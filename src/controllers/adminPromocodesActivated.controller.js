"use strict";

/**
 * @typedef {import("../app").modules} modules
 * @typedef {import("express").RequestHandler} RequestHandler
 */

const expressLayouts = require("express-ejs-layouts");
const moment = require("moment-timezone");
const { query, body } = require("express-validator");
const helpers = require("../utils/helpers");

const { accessFunctionHandler, shopStatusHandler, writeOperationReport } = require("../middlewares/admin.middlewares");

/**
 * @param {modules} modules
 */
module.exports.index = ({ logger, shopModel }) => [
	accessFunctionHandler,
	shopStatusHandler,
	expressLayouts,
	/**
	 * @type {RequestHandler}
	 */
	(req, res) => {
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

		shopModel.promoCodeActivated.belongsTo(shopModel.promoCodes, { foreignKey: "promoCodeId" });
		shopModel.promoCodeActivated.hasMany(shopModel.promoCodes, { foreignKey: "promoCodeId" });

		shopModel.promoCodeActivated.findAll({
			where: {
				...promoCodeId ? { promoCodeId } : {},
				...accountDBID ? { accountDBID } : {}
			},
			include: [{
				model: shopModel.promoCodes,
				attributes: []
			}],
			attributes: {
				include: [
					[shopModel.itemStrings.sequelize.col("promoCode"), "promoCode"]
				]
			}
		}).then(promocodes => {
			res.render("adminPromocodesActivated", {
				layout: "adminLayout",
				promocodes,
				promoCodeId,
				accountDBID,
				moment
			});
		}).catch(err => {
			logger.error(err);
			res.render("adminError", { layout: "adminLayout", err });
		});
	}
];

/**
 * @param {modules} modules
 */
module.exports.add = ({ i18n, logger, shopModel }) => [
	accessFunctionHandler,
	shopStatusHandler,
	expressLayouts,
	[
		query("promoCodeId").trim().optional()
			.isInt({ min: 0 }).withMessage(i18n.__("Promo code ID field must contain a valid number.")),
		query("accountDBID").trim().optional()
			.isInt({ min: 0 }).withMessage(i18n.__("Account ID field must contain a valid number."))
	],
	/**
	 * @type {RequestHandler}
	 */
	(req, res) => {
		const { promoCodeId, accountDBID } = req.query;

		shopModel.promoCodes.findAll().then(promocodes => {
			res.render("adminPromocodesActivatedAdd", {
				layout: "adminLayout",
				errors: null,
				promoCodeId,
				accountDBID,
				promocodes
			});
		}).catch(err => {
			logger.error(err);
			res.render("adminError", { layout: "adminLayout", err });
		});
	}
];

/**
 * @param {modules} modules
 */
module.exports.addAction = ({ i18n, logger, reportModel, accountModel, shopModel }) => [
	accessFunctionHandler,
	shopStatusHandler,
	expressLayouts,
	[
		body("promoCodeId").trim()
			.isInt({ min: 0 }).withMessage(i18n.__("Promo code ID field must contain a valid number."))
			.custom((value, { req }) => shopModel.promoCodes.findOne({
				where: {
					promoCodeId: req.body.promoCodeId
				}
			}).then(data => {
				if (req.body.promoCodeId && data === null) {
					return Promise.reject(i18n.__("Promo code ID field contains not existing promo code ID."));
				}
			})),
		body("accountDBID").trim()
			.isInt({ min: 0 }).withMessage(i18n.__("Account ID field must contain a valid number."))
			.custom((value, { req }) => accountModel.info.findOne({
				where: {
					accountDBID: req.body.accountDBID
				}
			}).then(data => {
				if (req.body.accountDBID && data === null) {
					return Promise.reject(i18n.__("Account ID contains not existing account ID."));
				}
			}))
			.custom((value, { req }) => shopModel.promoCodeActivated.findOne({
				where: {
					promoCodeId: req.body.promoCodeId,
					accountDBID: req.body.accountDBID
				}
			}).then(data => {
				if (data) {
					return Promise.reject(i18n.__("This promo code has already been activated on the specified account ID."));
				}
			}))
	],
	/**
	 * @type {RequestHandler}
	 */
	(req, res, next) => {
		const { promoCodeId, accountDBID } = req.body;
		const errors = helpers.validationResultLog(req, logger);

		shopModel.promoCodes.findAll().then(promocodes => {
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

			return shopModel.promoCodeActivated.create({
				promoCodeId,
				accountDBID
			}).then(() =>
				next()
			);
		}).catch(err => {
			logger.error(err);
			res.render("adminError", { layout: "adminLayout", err });
		});
	},
	writeOperationReport(reportModel),
	/**
	 * @type {RequestHandler}
	 */
	(req, res) => {
		res.redirect(`/promocodes_activated?accountDBID=${req.body.accountDBID}`);
	}
];

/**
 * @param {modules} modules
 */
module.exports.deleteAction = ({ logger, reportModel, shopModel }) => [
	accessFunctionHandler,
	shopStatusHandler,
	expressLayouts,
	/**
	 * @type {RequestHandler}
	 */
	(req, res, next) => {
		const { id } = req.query;

		if (!id) {
			return res.redirect("/promocodes_activated");
		}

		shopModel.promoCodeActivated.findOne({
			where: { id }
		}).then(promocode => {
			if (promocode === null) {
				return res.redirect("/promocodes_activated");
			}

			req.accountDBID = promocode.get("accountDBID");

			return shopModel.promoCodeActivated.destroy({ where: { id } }).then(() =>
				next()
			);
		}).catch(err => {
			logger.error(err);
			res.render("adminError", { layout: "adminLayout", err });
		});
	},
	writeOperationReport(reportModel),
	/**
	 * @type {RequestHandler}
	 */
	(req, res) => {
		res.redirect(`/promocodes_activated?accountDBID=${req.accountDBID}`);
	}
];