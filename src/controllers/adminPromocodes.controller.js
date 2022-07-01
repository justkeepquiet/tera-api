"use strict";

const path = require("path");
const expressLayouts = require("express-ejs-layouts");
const body = require("express-validator").body;
const I18n = require("i18n").I18n;
const Op = require("sequelize").Op;
const moment = require("moment-timezone");
const logger = require("../utils/logger");
const helpers = require("../utils/helpers");
const shopModel = require("../models/shop.model");
const { i18n, i18nHandler, accessFunctionHandler } = require("../middlewares/admin.middlewares");

const shopLocales = (new I18n({ directory: path.resolve(__dirname, "../locales/shop") })).getLocales();
const promocodeFunctions = Object.keys(require("../../config/promoCode"));

module.exports.index = [
	i18nHandler,
	accessFunctionHandler(),
	expressLayouts,
	/**
	 * @type {import("express").RequestHandler}
	 */
	(req, res) => {
		shopModel.promoCodes.belongsTo(shopModel.promoCodeStrings, { foreignKey: "promoCodeId" });
		shopModel.promoCodes.hasOne(shopModel.promoCodeStrings, { foreignKey: "promoCodeId" });

		shopModel.promoCodes.findAll({
			include: [{
				model: shopModel.promoCodeStrings,
				where: { language: i18n.getLocale() },
				required: false,
				attributes: []
			}],
			attributes: {
				include: [
					[shopModel.promoCodeStrings.sequelize.col("description"), "description"]
				]
			}
		}).then(promocodes => {
			res.render("adminPromocodes", {
				layout: "adminLayout",
				promocodes,
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
	/**
	 * @type {import("express").RequestHandler}
	 */
	(req, res) => {
		res.render("adminPromocodesAdd", {
			layout: "adminLayout",
			errors: null,
			promocodeFunctions,
			shopLocales,
			promoCode: "",
			aFunction: "",
			validAfter: moment(),
			validBefore: moment().add(365, "days"),
			active: "on",
			description: []
		});
	}
];

module.exports.addAction = [
	i18nHandler,
	accessFunctionHandler(),
	expressLayouts,
	[
		body("promoCode")
			.isLength({ min: 6, max: 16 }).withMessage("Promocode must be between 6 and 16 characters.")
			.custom((value, { req }) => shopModel.promoCodes.findOne({
				where: {
					promoCode: req.body.promoCode
				}
			}).then(data => {
				if (data) {
					return Promise.reject(i18n.__("Promocode contains an existing promocode."));
				}
			})),
		body("aFunction")
			.custom(value => promocodeFunctions.includes(value))
			.withMessage(i18n.__("Assigned function contains invalid function.")),
		body("validAfter")
			.isISO8601().withMessage(i18n.__("Valid from must contain a valid date.")),
		body("validBefore")
			.isISO8601().withMessage(i18n.__("Valid to must contain a valid date.")),
		body("active").optional()
			.isIn(["on"]).withMessage(i18n.__("Active field has invalid value.")),
		body("description.*")
			.isLength({ min: 1, max: 2048 }).withMessage("Description must be between 1 and 2048 characters.")
	],
	/**
	 * @type {import("express").RequestHandler}
	 */
	(req, res) => {
		const { promoCode, aFunction, validAfter, validBefore, active, description } = req.body;
		const errors = helpers.validationResultLog(req);

		if (!errors.isEmpty()) {
			return res.render("adminPromocodesAdd", {
				layout: "adminLayout",
				errors: errors.array(),
				promocodeFunctions,
				shopLocales,
				promoCode,
				aFunction,
				validAfter: moment(validAfter),
				validBefore: moment(validBefore),
				active,
				description
			});
		}

		shopModel.sequelize.transaction(transaction =>
			shopModel.promoCodes.create({
				promoCode,
				function: aFunction,
				validAfter: moment(validAfter).format("YYYY-MM-DD HH:MM:ss"),
				validBefore: moment(validBefore).format("YYYY-MM-DD HH:MM:ss"),
				active: active == "on"
			}, {
				transaction
			}).then(promocode => {
				const promises = [];

				if (description) {
					Object.keys(description).forEach(language => {
						promises.push(shopModel.promoCodeStrings.create({
							promoCodeId: promocode.get("promoCodeId"),
							language,
							description: description[language]
						}, {
							transaction
						}));
					});
				}

				return Promise.all(promises).then(() =>
					res.redirect("/promocodes")
				);
			})
		).then(() =>
			res.redirect("/promocodes")
		).catch(err => {
			logger.error(err.toString());
			res.render("adminError", { layout: "adminLayout", err });
		});
	}
];

module.exports.edit = [
	i18nHandler,
	accessFunctionHandler(),
	expressLayouts,
	/**
	 * @type {import("express").RequestHandler}
	 */
	(req, res) => {
		const { promoCodeId } = req.query;

		shopModel.promoCodes.findOne({
			where: { promoCodeId }
		}).then(promocode => {
			if (promocode === null) {
				return res.redirect("/promocodes");
			}

			return shopModel.promoCodeStrings.findAll({
				where: { promoCodeId: promocode.get("promoCodeId") }
			}).then(strings => {
				const description = {};

				if (strings !== null) {
					strings.forEach(string => {
						description[string.get("language")] = string.get("description");
					});
				}

				res.render("adminPromocodesEdit", {
					layout: "adminLayout",
					errors: null,
					promocodeFunctions,
					shopLocales,
					promoCodeId: promocode.get("promoCodeId"),
					promoCode: promocode.get("promoCode"),
					aFunction: promocode.get("function"),
					validAfter: moment(promocode.get("validAfter")),
					validBefore: moment(promocode.get("validBefore")),
					active: promocode.get("active"),
					description
				});
			});
		}).catch(err => {
			logger.error(err.toString());
			res.render("adminError", { layout: "adminLayout", err });
		});
	}
],

module.exports.editAction = [
	i18nHandler,
	accessFunctionHandler(),
	expressLayouts,
	[
		body("aFunction")
			.custom(value => promocodeFunctions.includes(value))
			.withMessage(i18n.__("Assigned function contains invalid function.")),
		body("validAfter")
			.isISO8601().withMessage(i18n.__("Valid from must contain a valid date.")),
		body("validBefore")
			.isISO8601().withMessage(i18n.__("Valid to must contain a valid date.")),
		body("active").optional()
			.isIn(["on"]).withMessage(i18n.__("Active field has invalid value.")),
		body("description.*")
			.isLength({ min: 1, max: 2048 }).withMessage("Description must be between 1 and 2048 characters.")
	],
	/**
	 * @type {import("express").RequestHandler}
	 */
	(req, res) => {
		const { promoCodeId } = req.query;
		const { aFunction, validAfter, validBefore, active, description } = req.body;
		const errors = helpers.validationResultLog(req);

		if (!promoCodeId) {
			return res.redirect("/promocodes");
		}

		shopModel.promoCodes.findOne({
			where: { promoCodeId }
		}).then(promocode => {
			if (promocode === null) {
				return res.redirect("/promocodes");
			}

			if (!errors.isEmpty()) {
				return res.render("adminPromocodesEdit", {
					layout: "adminLayout",
					errors: errors.array(),
					promocodeFunctions,
					shopLocales,
					promoCodeId: promocode.get("promoCodeId"),
					promoCode: promocode.get("promoCode"),
					aFunction,
					validAfter: moment(validAfter),
					validBefore: moment(validBefore),
					active,
					description
				});
			}

			return shopModel.sequelize.transaction(transaction =>
				shopModel.promoCodes.update({
					function: aFunction,
					validAfter: moment(validAfter).format("YYYY-MM-DD HH:MM:ss"),
					validBefore: moment(validBefore).format("YYYY-MM-DD HH:MM:ss"),
					active: active == "on"
				}, {
					where: { promoCodeId },
					transaction
				}).then(() => {
					const promises = [];

					if (description) {
						Object.keys(description).forEach(language => {
							promises.push(shopModel.promoCodeStrings.update({
								description: description[language]
							}, {
								transaction,
								where: {
									promoCodeId,
									language
								}
							}));
						});
					}

					return Promise.all(promises).then(() =>
						res.redirect("/promocodes")
					);
				})
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
		const { promoCodeId } = req.query;

		if (!promoCodeId) {
			return res.redirect("/promocodes");
		}

		shopModel.sequelize.transaction(transaction =>
			Promise.all([
				shopModel.promoCodes.destroy({
					where: { promoCodeId },
					transaction
				}),
				shopModel.promoCodeStrings.destroy({
					where: { promoCodeId },
					transaction
				}),
				shopModel.promoCodeActivated.destroy({
					where: { promoCodeId },
					transaction
				})
			]).then(() =>
				res.redirect("/promocodes")
			)
		).catch(err => {
			logger.error(err.toString());
			res.render("adminError", { layout: "adminLayout", err });
		});
	}
];