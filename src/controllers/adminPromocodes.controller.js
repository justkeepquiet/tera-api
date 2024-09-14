"use strict";

/**
 * @typedef {import("../app").modules} modules
 * @typedef {import("express").RequestHandler} RequestHandler
 */

const expressLayouts = require("express-ejs-layouts");
const body = require("express-validator").body;
const moment = require("moment-timezone");

const helpers = require("../utils/helpers");
const { accessFunctionHandler, writeOperationReport } = require("../middlewares/admin.middlewares");

const shopLocales = require("../../config/admin").shopLocales;

/**
 * @param {modules} modules
 */
module.exports.index = ({ i18n, shopModel }) => [
	accessFunctionHandler,
	expressLayouts,
	/**
	 * @type {RequestHandler}
	 */
	async (req, res, next) => {
		const promocodes = await shopModel.promoCodes.findAll({
			include: [{
				as: "strings",
				model: shopModel.promoCodeStrings,
				where: { language: i18n.getLocale() },
				required: false
			}]
		});

		res.render("adminPromocodes", {
			layout: "adminLayout",
			promocodes,
			moment
		});
	}
];

/**
 * @param {modules} modules
 */
module.exports.add = () => [
	accessFunctionHandler,
	expressLayouts,
	/**
	 * @type {RequestHandler}
	 */
	async (req, res, next) => {
		res.render("adminPromocodesAdd", {
			layout: "adminLayout",
			errors: null,
			promocodeFunctions: helpers.getPromocodeFunctionsNames(),
			shopLocales,
			promoCode: "",
			aFunction: "",
			validAfter: moment(),
			validBefore: moment().add(365, "days"),
			active: 1,
			description: []
		});
	}
];

/**
 * @param {modules} modules
 */
module.exports.addAction = ({ i18n, logger, sequelize, reportModel, shopModel }) => [
	accessFunctionHandler,
	expressLayouts,
	[
		body("promoCode")
			.isLength({ min: 6, max: 16 }).withMessage(i18n.__("Promo code field must be between 6 and 16 characters."))
			.custom((value, { req }) => shopModel.promoCodes.findOne({
				where: {
					promoCode: req.body.promoCode
				}
			}).then(data => {
				if (data) {
					return Promise.reject(i18n.__("Promo code field contains an existing promo code."));
				}
			})),
		body("aFunction")
			.custom(value => helpers.getPromocodeFunctionsNames().includes(value))
			.withMessage(i18n.__("Assigned function field contains invalid function.")),
		body("validAfter")
			.isISO8601().withMessage(i18n.__("Valid from field must contain a valid date.")),
		body("validBefore")
			.isISO8601().withMessage(i18n.__("Valid to field must contain a valid date.")),
		body("active").optional()
			.isIn(["on"]).withMessage(i18n.__("Active field has invalid value.")),
		body("description.*")
			.isLength({ min: 1, max: 2048 }).withMessage(i18n.__("Description must be between 1 and 2048 characters."))
	],
	/**
	 * @type {RequestHandler}
	 */
	async (req, res, next) => {
		const { promoCode, aFunction, validAfter, validBefore, active, description } = req.body;
		const errors = helpers.validationResultLog(req, logger);

		if (!errors.isEmpty()) {
			return res.render("adminPromocodesAdd", {
				layout: "adminLayout",
				errors: errors.array(),
				promocodeFunctions: helpers.getPromocodeFunctionsNames(),
				shopLocales,
				promoCode,
				aFunction,
				validAfter: moment.tz(validAfter, req.user.tz),
				validBefore: moment.tz(validBefore, req.user.tz),
				active,
				description: description || []
			});
		}

		await sequelize.transaction(async () => {
			const promocode = await shopModel.promoCodes.create({
				promoCode,
				function: aFunction,
				validAfter: moment.tz(validAfter, req.user.tz).toDate(),
				validBefore: moment.tz(validBefore, req.user.tz).toDate(),
				active: active == "on"
			});

			const promises = [];

			if (description) {
				Object.keys(description).forEach(language =>
					promises.push(shopModel.promoCodeStrings.create({
						promoCodeId: promocode.get("promoCodeId"),
						language,
						description: description[language]
					}))
				);
			}

			await Promise.all(promises);
		});

		next();
	},
	writeOperationReport(reportModel),
	/**
	 * @type {RequestHandler}
	 */
	(req, res, next) => {
		res.redirect("/promocodes");
	}
];

/**
 * @param {modules} modules
 */
module.exports.edit = ({ shopModel }) => [
	accessFunctionHandler,
	expressLayouts,
	/**
	 * @type {RequestHandler}
	 */
	async (req, res, next) => {
		const { promoCodeId } = req.query;

		if (!promoCodeId) {
			return res.redirect("/promocodes");
		}

		const promocode = await shopModel.promoCodes.findOne({
			where: { promoCodeId }
		});
		if (promocode === null) {
			return res.redirect("/promocodes");
		}

		const strings = await shopModel.promoCodeStrings.findAll({
			where: { promoCodeId: promocode.get("promoCodeId") }
		});

		const description = {};

		strings.forEach(string => {
			description[string.get("language")] = string.get("description");
		});

		res.render("adminPromocodesEdit", {
			layout: "adminLayout",
			errors: null,
			promocodeFunctions: helpers.getPromocodeFunctionsNames(),
			shopLocales,
			promoCodeId: promocode.get("promoCodeId"),
			promoCode: promocode.get("promoCode"),
			aFunction: promocode.get("function"),
			validAfter: moment(promocode.get("validAfter")),
			validBefore: moment(promocode.get("validBefore")),
			active: promocode.get("active"),
			description
		});
	}
],

/**
 * @param {modules} modules
 */
module.exports.editAction = ({ i18n, logger, sequelize, reportModel, shopModel }) => [
	accessFunctionHandler,
	expressLayouts,
	[
		body("aFunction")
			.custom(value => helpers.getPromocodeFunctionsNames().includes(value))
			.withMessage(i18n.__("Assigned function field contains invalid function.")),
		body("validAfter")
			.isISO8601().withMessage(i18n.__("Valid from field must contain a valid date.")),
		body("validBefore")
			.isISO8601().withMessage(i18n.__("Valid to field must contain a valid date.")),
		body("active").optional()
			.isIn(["on"]).withMessage(i18n.__("Active field has invalid value.")),
		body("description.*")
			.isLength({ min: 1, max: 2048 }).withMessage(i18n.__("Description field must be between 1 and 2048 characters."))
	],
	/**
	 * @type {RequestHandler}
	 */
	async (req, res, next) => {
		const { promoCodeId } = req.query;
		const { aFunction, validAfter, validBefore, active, description } = req.body;
		const errors = helpers.validationResultLog(req, logger);

		if (!promoCodeId) {
			return res.redirect("/promocodes");
		}

		const promocode = await shopModel.promoCodes.findOne({
			where: { promoCodeId }
		});

		if (promocode === null) {
			return res.redirect("/promocodes");
		}

		if (!errors.isEmpty()) {
			return res.render("adminPromocodesEdit", {
				layout: "adminLayout",
				errors: errors.array(),
				promocodeFunctions: helpers.getPromocodeFunctionsNames(),
				shopLocales,
				promoCodeId: promocode.get("promoCodeId"),
				promoCode: promocode.get("promoCode"),
				aFunction,
				validAfter: moment.tz(validAfter, req.user.tz),
				validBefore: moment.tz(validBefore, req.user.tz),
				active,
				description: description || []
			});
		}

		await sequelize.transaction(async () => {
			const promises = [
				shopModel.promoCodes.update({
					function: aFunction,
					validAfter: moment.tz(validAfter, req.user.tz).toDate(),
					validBefore: moment.tz(validBefore, req.user.tz).toDate(),
					active: active == "on"
				}, {
					where: { promoCodeId }
				})
			];

			if (description) {
				const categoryStrings = await shopModel.promoCodeStrings.findAll({
					where: { promoCodeId }
				});

				categoryStrings.forEach(promoCodeString => {
					const language = promoCodeString.get("language");

					if (description[language]) {
						promises.push(shopModel.promoCodeStrings.update({
							description: description[language]
						}, {
							where: {
								promoCodeId,
								language
							}
						}));
					} else {
						promises.push(shopModel.promoCodeStrings.destroy({
							where: {
								promoCodeId,
								language
							}
						}));
					}
				});

				shopLocales.forEach(language => {
					if (description[language]) {
						promises.push(shopModel.promoCodeStrings.create({
							promoCodeId,
							description: description[language],
							language
						}, {
							ignoreDuplicates: true
						}));
					}
				});
			}

			await Promise.all(promises);
		});

		next();
	},
	writeOperationReport(reportModel),
	/**
	 * @type {RequestHandler}
	 */
	(req, res, next) => {
		res.redirect("/promocodes");
	}
];

/**
 * @param {modules} modules
 */
module.exports.deleteAction = ({ sequelize, reportModel, shopModel }) => [
	accessFunctionHandler,
	expressLayouts,
	/**
	 * @type {RequestHandler}
	 */
	async (req, res, next) => {
		const { promoCodeId } = req.query;

		if (!promoCodeId) {
			return res.redirect("/promocodes");
		}

		await sequelize.transaction(async () => {
			await shopModel.promoCodes.destroy({
				where: { promoCodeId }
			});
			await shopModel.promoCodeStrings.destroy({
				where: { promoCodeId }
			});
			await shopModel.promoCodeActivated.destroy({
				where: { promoCodeId }
			});
		});

		next();
	},
	writeOperationReport(reportModel),
	/**
	 * @type {RequestHandler}
	 */
	(req, res, next) => {
		res.redirect("/promocodes");
	}
];