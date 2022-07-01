"use strict";

const expressLayouts = require("express-ejs-layouts");
const moment = require("moment-timezone");
const { query, body } = require("express-validator");
const logger = require("../utils/logger");
const helpers = require("../utils/helpers");
const shopModel = require("../models/shop.model");
const accountModel = require("../models/account.model");
const { i18n, i18nHandler, accessFunctionHandler } = require("../middlewares/admin.middlewares");

module.exports.index = [
	i18nHandler,
	accessFunctionHandler(),
	expressLayouts,
	/**
	 * @type {import("express").RequestHandler}
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
				...(promoCodeId ? { promoCodeId } : {}),
				...(accountDBID ? { accountDBID } : {})
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
			logger.error(err.toString());
			res.render("adminError", { layout: "adminLayout", err });
		});
	}
];


module.exports.add = [
	i18nHandler,
	accessFunctionHandler(),
	expressLayouts,
	[
		query("promoCodeId").trim().optional()
			.isInt({ min: 0 }).withMessage(i18n.__("Promocode ID field must contain a valid number.")),
		query("accountDBID").trim().optional()
			.isInt({ min: 0 }).withMessage(i18n.__("Account ID field must contain a valid number."))
	],
	/**
	 * @type {import("express").RequestHandler}
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
			logger.error(err.toString());
			res.render("adminError", { layout: "adminLayout", err });
		});
	}
];

module.exports.addAction = [
	i18nHandler,
	accessFunctionHandler(),
	expressLayouts,
	[
		body("promoCodeId").trim()
			.isInt({ min: 0 }).withMessage(i18n.__("Promocode ID field must contain a valid number."))
			.custom((value, { req }) => shopModel.promoCodes.findOne({
				where: {
					promoCodeId: req.body.promoCodeId
				}
			}).then(data => {
				if (req.body.promoCodeId && data === null) {
					return Promise.reject(i18n.__("Promocode ID field contains not existing promocode ID."));
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
					return Promise.reject(i18n.__("This promocode has already been activated on the specified account ID."));
				}
			}))
	],
	/**
	 * @type {import("express").RequestHandler}
	 */
	(req, res) => {
		const { promoCodeId, accountDBID } = req.body;
		const errors = helpers.validationResultLog(req);

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
				res.redirect(`/promocodes_activated?accountDBID=${accountDBID}`)
			);
		}).catch(err => {
			logger.error(err.toString());
			res.render("adminError", { layout: "adminLayout", err });
		});
	}
];

module.exports.deleteAction = [
	i18nHandler,
	accessFunctionHandler(),
	expressLayouts,
	/**
	 * @type {import("express").RequestHandler}
	 */
	(req, res) => {
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

			return shopModel.promoCodeActivated.destroy({ where: { id } }).then(() =>
				res.redirect(`/promocodes_activated?accountDBID=${promocode.get("accountDBID")}`)
			);
		}).catch(err => {
			logger.error(err.toString());
			res.render("adminError", { layout: "adminLayout", err });
		});
	}
];