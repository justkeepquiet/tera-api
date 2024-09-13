"use strict";

/**
 * @typedef {import("../app").modules} modules
 * @typedef {import("express").RequestHandler} RequestHandler
 */

const expressLayouts = require("express-ejs-layouts");
const moment = require("moment-timezone");
const { query, body } = require("express-validator");

const helpers = require("../utils/helpers");
const PromoCodeActions = require("../actions/promoCode.actions");
const { accessFunctionHandler, writeOperationReport } = require("../middlewares/admin.middlewares");

/**
 * @param {modules} modules
 */
module.exports.index = ({ shopModel }) => [
	accessFunctionHandler,
	expressLayouts,
	/**
	 * @type {RequestHandler}
	 */
	async (req, res, next) => {
		const { promoCodeId, accountDBID } = req.query;

		if (!promoCodeId && !accountDBID) {
			return res.render("adminPromocodesActivated", {
				layout: "adminLayout",
				errors: null,
				promoCodeId,
				accountDBID,
				promocodes: null
			});
		}

		const promocodes = await shopModel.promoCodeActivated.findAll({
			where: {
				...promoCodeId ? { promoCodeId } : {},
				...accountDBID ? { accountDBID } : {}
			},
			include: [{
				as: "info",
				model: shopModel.promoCodes
			}]
		});

		res.render("adminPromocodesActivated", {
			layout: "adminLayout",
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
module.exports.add = ({ i18n, shopModel }) => [
	accessFunctionHandler,
	expressLayouts,
	[
		query("promoCodeId").optional()
			.isInt({ min: 0 }).withMessage(i18n.__("Promo code ID field must contain a valid number.")),
		query("accountDBID").optional()
			.isInt({ min: 0 }).withMessage(i18n.__("Account ID field must contain a valid number."))
	],
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
	expressLayouts,
	[
		body("promoCodeId")
			.isInt({ min: 0 }).withMessage(modules.i18n.__("Promo code ID field must contain a valid number."))
			.custom(value => modules.shopModel.promoCodes.findOne({
				where: {
					promoCodeId: value
				}
			}).then(data => {
				if (value && data === null) {
					return Promise.reject(modules.i18n.__("Promo code ID field contains not existing promo code ID."));
				}
			})),
		body("accountDBID")
			.isInt({ min: 0 }).withMessage(modules.i18n.__("Account ID field must contain a valid number."))
			.custom(value => modules.accountModel.info.findOne({
				where: {
					accountDBID: value
				}
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
	/**
	 * @type {RequestHandler}
	 */
	async (req, res, next) => {
		const { promoCodeId, accountDBID } = req.body;
		const errors = helpers.validationResultLog(req, modules.logger);

		const promocodes = await modules.shopModel.promoCodes.findAll();

		if (!errors.isEmpty()) {
			return res.render("adminPromocodesActivatedAdd", {
				layout: "adminLayout",
				errors: errors.array(),
				moment,
				promoCodeId,
				accountDBID,
				promocodes
			});
		}

		const account = await modules.accountModel.info.findOne({
			where: { accountDBID }
		});

		const promocode = await modules.shopModel.promoCodes.findOne({
			where: { promoCodeId }
		});

		const actions = new PromoCodeActions(
			modules,
			account.get("lastLoginServer"),
			account.get("accountDBID")
		);

		await actions.execute(promocode.get("function"), promocode.get("promoCodeId"));

		await modules.shopModel.promoCodeActivated.create({
			promoCodeId: promocode.get("promoCodeId"),
			accountDBID: account.get("accountDBID")
		});

		next();
	},
	writeOperationReport(modules.reportModel),
	/**
	 * @type {RequestHandler}
	 */
	(req, res, next) => {
		res.redirect(`/promocodes_activated?accountDBID=${req.body.accountDBID}`);
	}
];

/**
 * @param {modules} modules
 */
module.exports.deleteAction = ({ reportModel, shopModel }) => [
	accessFunctionHandler,
	expressLayouts,
	/**
	 * @type {RequestHandler}
	 */
	async (req, res, next) => {
		const { id } = req.query;

		if (!id) {
			return res.redirect("/promocodes_activated");
		}

		const promocode = await shopModel.promoCodeActivated.findOne({
			where: { id }
		});

		if (promocode === null) {
			return res.redirect("/promocodes_activated");
		}

		req.accountDBID = promocode.get("accountDBID");

		await shopModel.promoCodeActivated.destroy({ where: { id } });

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