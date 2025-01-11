"use strict";

/**
 * @typedef {import("../app").modules} modules
 * @typedef {import("express").RequestHandler} RequestHandler
 */

const expressLayouts = require("express-ejs-layouts");
const moment = require("moment-timezone");
const { query, body } = require("express-validator");

const PromoCodeActions = require("../actions/promoCode.actions");

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
module.exports.index = ({ i18n, accountModel, shopModel }) => [
	accessFunctionHandler,
	expressLayouts,
	/**
	 * @type {RequestHandler}
	 */
	async (req, res, next) => {
		const { promoCodeId, accountDBID } = req.query;

		const promocodes = await shopModel.promoCodes.findAll();

		if (!promoCodeId && !accountDBID) {
			return res.render("adminPromocodesActivated", {
				layout: "adminLayout",
				errors: null,
				promocodesActivated: null,
				promocodes,
				promoCodeId,
				accountDBID
			});
		}

		const promocodesActivated = await shopModel.promoCodeActivated.findAll({
			where: {
				...promoCodeId ? { promoCodeId } : {},
				...accountDBID ? { accountDBID } : {}
			},
			include: [
				{
					as: "info",
					model: shopModel.promoCodes
				},
				{
					as: "account",
					model: accountModel.info,
					required: false,
					attributes: ["userName"]
				}
			]
		});

		res.render("adminPromocodesActivated", {
			layout: "adminLayout",
			promocodesActivated,
			promocodes,
			promoCodeId,
			accountDBID,
			moment
		});
	}
];

/**
 * @param {modules} modules
 */
module.exports.add = ({ logger, i18n, shopModel }) => [
	accessFunctionHandler,
	expressLayouts,
	[
		query("promoCodeId").optional({ checkFalsy: true })
			.isInt({ min: 0 }).withMessage(i18n.__("Promo code ID field must contain a valid number.")),
		query("accountDBID").optional({ checkFalsy: true })
			.isInt({ min: 0 }).withMessage(i18n.__("Account ID field must contain a valid number."))
	],
	validationHandler(logger),
	/**
	 * @type {RequestHandler}
	 */
	async (req, res, next) => {
		const { promoCodeId, accountDBID } = req.query;

		const promocodes = await shopModel.promoCodes.findAll();

		res.render("adminPromocodesActivatedAdd", {
			layout: "adminLayout",
			errors: null,
			promoCodeId,
			accountDBID,
			promocodes
		});
	}
];

/**
 * @param {modules} modules
 */
module.exports.addAction = modules => [
	accessFunctionHandler,
	[
		body("promoCodeId")
			.isInt({ min: 0 }).withMessage(modules.i18n.__("Promo code ID field must contain a valid number."))
			.custom(value => modules.shopModel.promoCodes.findOne({
				attributes: [
					"validAfter",
					"validBefore",
					"active",
					"currentActivations",
					"maxActivations",
					[modules.sequelize.fn("NOW"), "dateNow"]
				],
				where: { promoCodeId: value }
			}).then(data => {
				if (value) {
					if (data === null) {
						return Promise.reject(modules.i18n.__("Promo code ID field contains not existing promo code ID."));
					}
					if (!data.get("active")) {
						return Promise.reject(modules.i18n.__("Promo code ID field contains inactive promo code ID."));
					}
					if (moment(data.get("dateNow")).isBefore(data.get("validAfter")) ||
						moment(data.get("dateNow")).isAfter(data.get("validBefore"))
					) {
						return Promise.reject(modules.i18n.__("Promo code ID field contains expired promo code ID."));
					}
					if (data.get("maxActivations") > 0 &&
						data.get("currentActivations") >= data.get("maxActivations")
					) {
						return Promise.reject(modules.i18n.__("Promo code ID field contains the promo code ID with the activation limit reached."));
					}
				}
			})),
		body("accountDBID")
			.isInt({ min: 0 }).withMessage(modules.i18n.__("Account ID field must contain a valid number."))
			.custom(value => modules.accountModel.info.findOne({
				where: { accountDBID: value }
			}).then(data => {
				if (value && data === null) {
					return Promise.reject(modules.i18n.__("Account ID contains not existing account ID."));
				}
			}))
			.custom((value, { req }) => modules.shopModel.promoCodeActivated.findOne({
				where: {
					promoCodeId: req.body.promoCodeId,
					accountDBID: req.body.accountDBID
				}
			}).then(data => {
				if (data) {
					return Promise.reject(modules.i18n.__("This promo code has already been activated on the specified account ID."));
				}
			}))
	],
	formValidationHandler(modules.logger),
	/**
	 * @type {RequestHandler}
	 */
	async (req, res, next) => {
		const { promoCodeId, accountDBID } = req.body;

		const account = await modules.accountModel.info.findOne({
			where: { accountDBID }
		});

		const promocode = await modules.shopModel.promoCodes.findOne({
			where: { promoCodeId }
		});

		await modules.sequelize.transaction(async () => {
			await modules.shopModel.promoCodeActivated.create({
				promoCodeId: promocode.get("promoCodeId"),
				accountDBID: account.get("accountDBID")
			});

			await modules.shopModel.promoCodes.increment({
				currentActivations: 1
			}, {
				where: { promoCodeId: promocode.get("promoCodeId") }
			});
		});

		await modules.sequelize.transaction(async () => {
			const actions = new PromoCodeActions(
				modules,
				account.get("lastLoginServer"),
				account.get("accountDBID")
			);

			return await actions.execute(promocode.get("function"), promocode.get("promoCodeId"));
		}).catch(err => {
			modules.logger.error(err);

			return modules.shopModel.promoCodeActivated.destroy({
				where: {
					promoCodeId: promocode.get("promoCodeId"),
					accountDBID: req.user.accountDBID
				}
			}).then(() => modules.shopModel.promoCodes.decrement({
				currentActivations: 1
			}, {
				where: { promoCodeId: promocode.get("promoCodeId") }
			}));
		});

		next();
	},
	writeOperationReport(modules.reportModel),
	formResultErrorHandler(modules.logger),
	/**
	 * @type {RequestHandler}
	 */
	(req, res, next) => {
		formResultSuccessHandler(`/promocodes_activated?accountDBID=${req.body.accountDBID}`)(req, res, next);
	}
];

/**
 * @param {modules} modules
 */
module.exports.deleteAction = ({ logger, sequelize, reportModel, shopModel }) => [
	accessFunctionHandler,
	expressLayouts,
	[
		query("id").notEmpty()
	],
	validationHandler(logger),
	/**
	 * @type {RequestHandler}
	 */
	async (req, res, next) => {
		const { id } = req.query;

		const promocode = await shopModel.promoCodeActivated.findOne({
			where: { id }
		});

		if (promocode === null) {
			throw Error("Object not found");
		}

		req.accountDBID = promocode.get("accountDBID");

		await sequelize.transaction(async () => {
			await shopModel.promoCodeActivated.destroy({ where: { id } });

			await shopModel.promoCodes.decrement({
				currentActivations: 1
			}, {
				where: { promoCodeId: promocode.get("promoCodeId") }
			});
		});

		next();
	},
	writeOperationReport(reportModel),
	/**
	 * @type {RequestHandler}
	 */
	(req, res, next) => {
		res.redirect(`/promocodes_activated?accountDBID=${req.accountDBID}`);
	}
];