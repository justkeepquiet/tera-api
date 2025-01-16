"use strict";

/**
 * @typedef {import("../app").modules} modules
 * @typedef {import("express").RequestHandler} RequestHandler
 */

const expressLayouts = require("express-ejs-layouts");
const moment = require("moment-timezone");
const { query, body } = require("express-validator");
const Op = require("sequelize").Op;

const env = require("../utils/env");
const { getInitialBenefits, getPasswordString } = require("../utils/helpers");

const {
	validationHandler,
	formValidationHandler,
	formResultErrorHandler,
	formResultSuccessHandler,
	accessFunctionHandler,
	writeOperationReport
} = require("../middlewares/admin.middlewares");

/**
 * @param {modules} modules
 */
module.exports.index = ({ accountModel, serverModel }) => [
	accessFunctionHandler,
	expressLayouts,
	/**
	 * @type {RequestHandler}
	 */
	async (req, res, next) => {
		const { accountDBID, email } = req.query;

		const accounts = await accountModel.info.findAll({
			where: {
				...accountDBID ? { accountDBID } : {},
				...email ? { email } : {}
			},
			include: [
				{
					as: "online",
					model: accountModel.online,
					required: false
				},
				{
					as: "banned",
					model: accountModel.bans,
					required: false
				},
				{
					as: "server",
					model: serverModel.info,
					required: false,
					attributes: ["nameString"]
				}
			],
			order: [
				["accountDBID", "ASC"]
			]
		});

		res.render("adminAccounts", {
			layout: "adminLayout",
			accounts,
			moment,
			accountDBID,
			email
		});
	}
];

/**
 * @param {modules} modules
 */
module.exports.add = ({ i18n, datasheetModel }) => [
	accessFunctionHandler,
	expressLayouts,
	/**
	 * @type {RequestHandler}
	 */
	(req, res, next) => {
		const benefitIds = [];
		const availableUntils = [];

		const accountBenefits = datasheetModel.strSheetAccountBenefit[i18n.getLocale()];

		getInitialBenefits().forEach((benefitDays, benefitId) => {
			benefitIds.push(benefitId);
			availableUntils.push(moment.tz(req.user.tz).add(benefitDays, "days"));
		});

		res.render("adminAccountsAdd", {
			layout: "adminLayout",
			moment,
			accountBenefits,
			benefitIds,
			availableUntils
		});
	}
];

/**
 * @param {modules} modules
 */
module.exports.addAction = ({ i18n, logger, sequelize, reportModel, accountModel, shopModel }) => [
	accessFunctionHandler,
	expressLayouts,
	[
		body("userName").trim()
			.isLength({ min: 3, max: 24 }).withMessage(i18n.__("User name must be between 3 and 24 characters."))
			.custom(value => accountModel.info.findOne({
				where: { userName: value }
			}).then(data => {
				if (data) {
					return Promise.reject(i18n.__("User name contains already existing name."));
				}
			})),
		body("passWord").trim()
			.isLength({ min: 8, max: 128 }).withMessage(i18n.__("Password field must be between 8 and 128 characters.")),
		body("email").trim()
			.isLength({ max: 128 }).withMessage(i18n.__("Email field must contain a valid email."))
			.isEmail().withMessage(i18n.__("Email field must contain a valid email."))
			.custom(value => accountModel.info.findOne({
				where: { email: value }
			}).then(data => {
				if (data) {
					return Promise.reject(i18n.__("Email field contains already existing email."));
				}
			})),
		body("permission")
			.isInt({ min: 0, max: 1e10 }).withMessage(i18n.__("Permission field must contain a valid number.")),
		body("privilege")
			.isInt({ min: 0, max: 1e10 }).withMessage(i18n.__("Privilege field must contain a valid number.")),
		body("benefitIds.*").optional()
			.isInt({ min: 0, max: 1e10 }).withMessage(i18n.__("Benefit ID field must contain a valid number."))
			.custom((value, { req }) => {
				const benefitIds = req.body.benefitIds.filter((e, i) =>
					req.body.benefitIds.lastIndexOf(e) == i && req.body.benefitIds.indexOf(e) != i
				);

				return benefitIds.length === 0 || !benefitIds.includes(value);
			})
			.withMessage(i18n.__("Added benefit already exists.")),
		body("availableUntils.*").optional()
			.isISO8601().withMessage("Available field until must contain a valid date.")
	],
	formValidationHandler(logger),
	/**
	 * @type {RequestHandler}
	 */
	async (req, res, next) => {
		const { userName, passWord, email, permission, privilege, benefitIds, availableUntils } = req.body;

		await sequelize.transaction(async () => {
			const account = await accountModel.info.create({
				userName,
				passWord: getPasswordString(passWord),
				email,
				permission,
				privilege
			});

			if (benefitIds) {
				const promises = [];

				benefitIds.forEach((benefitId, i) => {
					if (availableUntils[i] === undefined) {
						return;
					}

					promises.push(accountModel.benefits.create({
						accountDBID: account.get("accountDBID"),
						benefitId,
						availableUntil: moment.tz(availableUntils[i], req.user.tz).toDate()
					}));
				});

				await Promise.all(promises);
			}
		});

		next();
	},
	writeOperationReport(reportModel),
	formResultErrorHandler(logger),
	formResultSuccessHandler("/accounts")
];

/**
 * @param {modules} modules
 */
module.exports.edit = ({ logger, accountModel }) => [
	accessFunctionHandler,
	expressLayouts,
	[
		query("accountDBID").notEmpty()
	],
	validationHandler(logger),
	/**
	 * @type {RequestHandler}
	 */
	async (req, res, next) => {
		const { accountDBID } = req.query;

		const data = await accountModel.info.findOne({
			where: { accountDBID }
		});

		if (data === null) {
			throw Error("Object not found");
		}

		res.render("adminAccountsEdit", {
			layout: "adminLayout",
			encryptPasswords: env.bool("API_PORTAL_USE_SHA512_PASSWORDS"),
			moment,
			accountDBID,
			userName: data.get("userName"),
			passWord: data.get("passWord"),
			email: data.get("email"),
			permission: data.get("permission"),
			privilege: data.get("privilege")
		});
	}
];

/**
 * @param {modules} modules
 */
module.exports.editAction = ({ i18n, logger, reportModel, accountModel }) => [
	accessFunctionHandler,
	[
		query("accountDBID").notEmpty(),
		body("userName").trim()
			.isLength({ min: 3, max: 24 }).withMessage(i18n.__("User name must be between 3 and 24 characters."))
			.custom((value, { req }) => accountModel.info.findOne({
				where: {
					userName: req.body.userName,
					accountDBID: { [Op.ne]: req.query.accountDBID }
				}
			}).then(data => {
				if (data) {
					return Promise.reject(i18n.__("User name contains already existing name."));
				}
			})),
		body("passWord").trim().optional({ checkFalsy: true })
			.isLength({ min: 8, max: 128 }).withMessage(i18n.__("Password field must be between 8 and 128 characters.")),
		body("email").trim()
			.isLength({ max: 128 }).withMessage(i18n.__("Email field must contain a valid email."))
			.isEmail().withMessage(i18n.__("Email field must contain a valid email."))
			.custom((value, { req }) => accountModel.info.findOne({
				where: {
					email: req.body.email,
					accountDBID: { [Op.ne]: req.query.accountDBID }
				}
			}).then(data => {
				if (data) {
					return Promise.reject(i18n.__("Email field contains already existing email."));
				}
			})),
		body("permission")
			.isInt({ min: 0, max: 1e10 }).withMessage(i18n.__("Permission field must contain a valid number.")),
		body("privilege")
			.isInt({ min: 0, max: 1e10 }).withMessage(i18n.__("Privilege field must contain a valid number."))
	],
	formValidationHandler(logger),
	/**
	 * @type {RequestHandler}
	 */
	async (req, res, next) => {
		const { accountDBID } = req.query;
		const { userName, passWord, email, permission, privilege, benefitIds, availableUntils } = req.body;

		await accountModel.info.update({
			userName,
			...passWord ? { passWord: getPasswordString(passWord) } : {},
			email,
			permission,
			privilege,
			benefitIds,
			availableUntils
		}, {
			where: { accountDBID }
		});

		next();
	},
	writeOperationReport(reportModel),
	formResultErrorHandler(logger),
	formResultSuccessHandler("/accounts")
];

/**
 * @param {modules} modules
 */
module.exports.deleteAction = ({ logger, hub, sequelize, reportModel, accountModel, shopModel }) => [
	accessFunctionHandler,
	expressLayouts,
	[
		query("accountDBID").notEmpty()
	],
	validationHandler(logger),
	/**
	 * @type {RequestHandler}
	 */
	async (req, res, next) => {
		const { accountDBID } = req.query;

		const online = await accountModel.online.findOne({ where: { accountDBID } });

		if (online !== null) {
			hub.kickUser(online.get("serverId"), accountDBID, 33).catch(err =>
				logger.warn(err.toString())
			);

			await new Promise(resolve => setTimeout(resolve, 3000));
		}

		await sequelize.transaction(async () => {
			await accountModel.info.destroy({
				where: { accountDBID }
			});
			await accountModel.benefits.destroy({
				where: { accountDBID }
			});
			await accountModel.characters.destroy({
				where: { accountDBID }
			});
			await accountModel.online.destroy({
				where: { accountDBID }
			});
			await shopModel.promoCodeActivated.destroy({
				where: { accountDBID }
			});

			const shopAccount = await shopModel.accounts.findOne({
				where: { accountDBID }
			});

			if (shopAccount !== null) {
				await shopModel.accounts.destroy({
					where: { accountDBID }
				});
				await reportModel.shopFund.create({
					accountDBID,
					amount: -shopAccount.get("balance"),
					balance: 0,
					description: "AccountDeletion"
				});
			}
		});

		next();
	},
	writeOperationReport(reportModel),
	/**
	 * @type {RequestHandler}
	 */
	(req, res, next) => {
		res.redirect("/accounts");
	}
];

/**
 * @param {modules} modules
 */
module.exports.characters = ({ accountModel, serverModel }) => [
	accessFunctionHandler,
	expressLayouts,
	/**
	 * @type {RequestHandler}
	 */
	async (req, res, next) => {
		const { serverId, accountDBID } = req.query;

		const servers = await serverModel.info.findAll();

		if (!serverId || !accountDBID) {
			return res.render("adminAccountsCharacters", {
				layout: "adminLayout",
				characters: null,
				servers,
				moment,
				serverId,
				accountDBID
			});
		}

		const characters = await accountModel.characters.findAll({
			where: {
				serverId,
				accountDBID
			},
			include: [
				{
					as: "info",
					model: accountModel.info,
					required: false,
					attributes: ["userName"]
				},
				{
					as: "server",
					model: serverModel.info,
					required: false,
					attributes: ["nameString"]
				}
			]
		});

		res.render("adminAccountsCharacters", {
			layout: "adminLayout",
			characters,
			servers,
			moment,
			serverId,
			accountDBID
		});
	}
];