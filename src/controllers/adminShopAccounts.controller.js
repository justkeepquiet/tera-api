"use strict";

/**
 * @typedef {import("../app").modules} modules
 * @typedef {import("express").RequestHandler} RequestHandler
 */

const expressLayouts = require("express-ejs-layouts");
const moment = require("moment-timezone");
const { query, body } = require("express-validator");
const {
	accessFunctionHandler,
	validationHandler,
	formValidationHandler,
	formResultErrorHandler,
	formResultSuccessHandler,
	writeOperationReport
} = require("../middlewares/admin.middlewares");

/**
 * @param {modules} modules
 */
module.exports.index = ({ accountModel, shopModel }) => [
	accessFunctionHandler,
	expressLayouts,
	/**
	 * @type {RequestHandler}
	 */
	async (req, res, next) => {
		const { accountDBID } = req.query;

		const accounts = await shopModel.accounts.findAll({
			where: {
				...accountDBID ? { accountDBID } : {}
			},
			include: [{
				as: "info",
				model: accountModel.info,
				required: false,
				attributes: ["userName"]
			}]
		});

		res.render("adminShopAccounts", {
			layout: "adminLayout",
			accounts,
			moment,
			accountDBID
		});
	}
];

/**
 * @param {modules} modules
 */
module.exports.add = ({ logger, i18n }) => [
	accessFunctionHandler,
	expressLayouts,
	[
		query("accountDBID").optional({ checkFalsy: true }).trim()
			.isInt({ min: 0 }).withMessage(i18n.__("The field must contain a valid number."))
	],
	validationHandler(logger),
	/**
	 * @type {RequestHandler}
	 */
	async (req, res, next) => {
		const { accountDBID } = req.query;

		res.render("adminShopAccountsAdd", {
			layout: "adminLayout",
			accountDBID
		});
	}
];

/**
 * @param {modules} modules
 */
module.exports.addAction = ({ i18n, logger, reportModel, accountModel, shopModel }) => [
	accessFunctionHandler,
	[
		body("accountDBID").trim()
			.isInt({ min: 0 }).withMessage(i18n.__("The field must contain a valid number."))
			.custom(value => shopModel.accounts.findOne({
				where: { accountDBID: value }
			}).then(data => {
				if (value && data !== null) {
					return Promise.reject(i18n.__("Shop account with specified account ID already exists."));
				}
			}))
			.custom(value => accountModel.info.findOne({
				where: { accountDBID: value }
			}).then(data => {
				if (value && data === null) {
					return Promise.reject(i18n.__("The field contains not existing account ID."));
				}
			})),
		body("balance").trim()
			.isInt({ min: 0, max: 1e10 }).withMessage(i18n.__("The field must contain a valid number.")),
		body("discount").trim()
			.isInt({ min: 0, max: 100 }).withMessage(i18n.__("The field must contain a valid number.")),
		body("active").optional().trim()
			.isIn(["on"]).withMessage(i18n.__("The field has invalid value."))
	],
	formValidationHandler(logger),
	/**
	 * @type {RequestHandler}
	 */
	async (req, res, next) => {
		const { accountDBID, balance, discount, active } = req.body;

		await shopModel.accounts.create({
			accountDBID,
			balance,
			discount,
			active: active == "on"
		});

		await reportModel.shopFund.create({
			accountDBID,
			amount: balance,
			balance,
			description: "SignUp"
		});

		next();
	},
	writeOperationReport(reportModel),
	formResultErrorHandler(logger),
	formResultSuccessHandler("/shop_accounts")
];

/**
 * @param {modules} modules
 */
module.exports.edit = ({ logger, shopModel }) => [
	accessFunctionHandler,
	expressLayouts,
	[
		query("accountDBID").trim().notEmpty()
	],
	validationHandler(logger),
	/**
	 * @type {RequestHandler}
	 */
	async (req, res, next) => {
		const { accountDBID } = req.query;

		const account = await shopModel.accounts.findOne({
			where: { accountDBID }
		});

		if (account === null) {
			throw Error("Object not found");
		}

		res.render("adminShopAccountsEdit", {
			layout: "adminLayout",
			accountDBID: account.get("accountDBID"),
			balance: account.get("balance"),
			discount: account.get("discount"),
			active: account.get("active")
		});
	}
];

/**
 * @param {modules} modules
 */
module.exports.editAction = ({ i18n, logger, reportModel, shopModel }) => [
	accessFunctionHandler,
	[
		query("accountDBID").trim().notEmpty(),
		body("balance").trim()
			.isInt({ min: 0, max: 1e10 }).withMessage(i18n.__("The field must contain a valid number.")),
		body("discount").trim()
			.isInt({ min: 0, max: 100 }).withMessage(i18n.__("The field must contain a valid number.")),
		body("active").optional().trim()
			.isIn(["on"]).withMessage(i18n.__("The field has invalid value."))
	],
	formValidationHandler(logger),
	/**
	 * @type {RequestHandler}
	 */
	async (req, res, next) => {
		const { accountDBID } = req.query;
		const { balance, discount, active } = req.body;

		const account = await shopModel.accounts.findOne({
			where: { accountDBID }
		});

		if (account === null) {
			throw Error("Object not found");
		}

		await shopModel.accounts.update({
			balance,
			discount,
			active: active == "on"
		}, {
			where: { accountDBID }
		});

		const amount = balance - account.get("balance");

		if (amount !== 0) {
			await reportModel.shopFund.create({
				accountDBID,
				amount,
				balance,
				description: "BalanceChange"
			});
		}

		next();
	},
	writeOperationReport(reportModel),
	formResultErrorHandler(logger),
	formResultSuccessHandler("/shop_accounts")
];

/**
 * @param {modules} modules
 */
module.exports.deleteAction = ({ logger, reportModel, shopModel }) => [
	accessFunctionHandler,
	expressLayouts,
	[
		query("accountDBID").trim().notEmpty()
	],
	validationHandler(logger),
	/**
	 * @type {RequestHandler}
	 */
	async (req, res, next) => {
		const { accountDBID } = req.query;

		const account = await shopModel.accounts.findOne({
			where: { accountDBID }
		});

		if (account === null) {
			throw Error("Object not found");
		}

		await shopModel.accounts.destroy({
			where: { accountDBID }
		});

		await reportModel.shopFund.create({
			accountDBID,
			amount: -account.get("balance"),
			balance: 0,
			description: "Delete"
		});

		next();
	},
	writeOperationReport(reportModel),
	/**
	 * @type {RequestHandler}
	 */
	(req, res, next) => {
		res.redirect("/shop_accounts");
	}
];