"use strict";

/**
 * @typedef {import("../app").modules} modules
 * @typedef {import("express").RequestHandler} RequestHandler
 */

const path = require("path");
const expressLayouts = require("express-ejs-layouts");
const { query, body } = require("express-validator");
const moment = require("moment-timezone");

const { getSupportedLanguagesByDirectory, getPromocodeFunctionsNames } = require("../utils/helpers");
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

		// Correct the `currentActivations` value
		for (const promocode of promocodes) {
			if (promocode.get("currentActivations") === 0) {
				const currentActivations = await shopModel.promoCodeActivated.count({
					where: { promoCodeId: promocode.get("promoCodeId") }
				});

				await shopModel.promoCodes.update({
					currentActivations
				}, {
					where: { promoCodeId: promocode.get("promoCodeId") }
				});
			}
		}

		res.render("adminPromocodes", {
			layout: "adminLayout",
			moment,
			promocodes
		});
	}
];

/**
 * @param {modules} modules
 */
module.exports.add = ({ config, localization }) => [
	accessFunctionHandler,
	expressLayouts,
	/**
	 * @type {RequestHandler}
	 */
	async (req, res, next) => {
		const languages = getSupportedLanguagesByDirectory(path.join(__dirname, "../locales/shop"), localization);

		res.render("adminPromocodesAdd", {
			layout: "adminLayout",
			moment,
			promocodeFunctions: getPromocodeFunctionsNames(config),
			languages
		});
	}
];

/**
 * @param {modules} modules
 */
module.exports.addAction = ({ config, i18n, logger, sequelize, reportModel, shopModel }) => [
	accessFunctionHandler,
	[
		body("promoCode").trim()
			.isLength({ min: 6, max: 20 }).withMessage(i18n.__("The field must be between 6 and 20 characters."))
			.custom(value => shopModel.promoCodes.findOne({
				where: { promoCode: value }
			}).then(data => {
				if (data) {
					return Promise.reject(i18n.__("The field contains an existing promo code."));
				}
				return true;
			})),
		body("aFunction").trim()
			.custom(value => getPromocodeFunctionsNames(config).includes(value))
			.withMessage(i18n.__("The field contains invalid function.")),
		body("validAfter").trim()
			.isISO8601().withMessage(i18n.__("The field must contain a valid date.")),
		body("validBefore").trim()
			.isISO8601().withMessage(i18n.__("The field must contain a valid date."))
			.custom((value, { req }) => {
				if (moment(value).isSameOrBefore(req.body.validAfter)) {
					return Promise.reject(`${i18n.__("The field must contain a valid date.")}`);
				}
				return true;
			}),
		body("maxActivations").trim()
			.isInt({ min: 0, max: 1e8 }).withMessage(i18n.__("The field must contain the value as a number.")),
		body("active").optional().trim()
			.isIn(["on"]).withMessage(i18n.__("The field has invalid value.")),
		body("description.*").trim()
			.isLength({ min: 1, max: 2048 }).withMessage(i18n.__("The field must be between 1 and 2048 characters."))
	],
	formValidationHandler(logger),
	/**
	 * @type {RequestHandler}
	 */
	async (req, res, next) => {
		const { promoCode, aFunction, validAfter, validBefore, maxActivations, active, description } = req.body;

		await sequelize.transaction(async () => {
			const promocode = await shopModel.promoCodes.create({
				promoCode,
				function: aFunction,
				validAfter: moment.tz(validAfter, req.user.tz).toDate(),
				validBefore: moment.tz(validBefore, req.user.tz).toDate(),
				active: active == "on",
				maxActivations
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
	formResultErrorHandler(logger),
	formResultSuccessHandler("/promocodes")
];

/**
 * @param {modules} modules
 */
module.exports.edit = ({ config, localization, logger, shopModel }) => [
	accessFunctionHandler,
	expressLayouts,
	[
		query("promoCodeId").trim().notEmpty()
	],
	validationHandler(logger),
	/**
	 * @type {RequestHandler}
	 */
	async (req, res, next) => {
		const { promoCodeId } = req.query;

		const promocode = await shopModel.promoCodes.findOne({
			where: { promoCodeId }
		});

		if (promocode === null) {
			throw Error("Object not found");
		}

		const strings = await shopModel.promoCodeStrings.findAll({
			where: { promoCodeId: promocode.get("promoCodeId") }
		});

		const description = {};

		strings.forEach(string => {
			description[string.get("language")] = string.get("description");
		});

		const languages = getSupportedLanguagesByDirectory(path.join(__dirname, "../locales/shop"), localization);

		res.render("adminPromocodesEdit", {
			layout: "adminLayout",
			errors: null,
			promocodeFunctions: getPromocodeFunctionsNames(config),
			languages,
			promoCodeId: promocode.get("promoCodeId"),
			promoCode: promocode.get("promoCode"),
			aFunction: promocode.get("function"),
			validAfter: moment(promocode.get("validAfter")),
			validBefore: moment(promocode.get("validBefore")),
			active: promocode.get("active"),
			maxActivations: promocode.get("maxActivations"),
			description
		});
	}
],

/**
 * @param {modules} modules
 */
module.exports.editAction = ({ config, localization, i18n, logger, sequelize, reportModel, shopModel }) => [
	accessFunctionHandler,
	[
		query("promoCodeId").trim().notEmpty(),
		body("aFunction").trim()
			.custom(value => getPromocodeFunctionsNames(config).includes(value))
			.withMessage(i18n.__("The field contains invalid function.")),
		body("validAfter").trim()
			.isISO8601().withMessage(i18n.__("The field must contain a valid date.")),
		body("validBefore").trim()
			.isISO8601().withMessage(i18n.__("The field must contain a valid date."))
			.custom((value, { req }) => {
				if (moment(value).isSameOrBefore(req.body.validAfter)) {
					return Promise.reject(`${i18n.__("The field must contain a valid date.")}`);
				}
				return true;
			}),
		body("maxActivations").trim()
			.isInt({ min: 0, max: 1e8 }).withMessage(i18n.__("The field must contain the value as a number.")),
		body("active").optional().trim()
			.isIn(["on"]).withMessage(i18n.__("The field has invalid value.")),
		body("description.*").trim()
			.isLength({ min: 1, max: 2048 }).withMessage(i18n.__("The field must be between 1 and 2048 characters."))
	],
	formValidationHandler(logger),
	/**
	 * @type {RequestHandler}
	 */
	async (req, res, next) => {
		const { promoCodeId } = req.query;
		const { aFunction, validAfter, validBefore, maxActivations, active, description } = req.body;

		const promocode = await shopModel.promoCodes.findOne({
			where: { promoCodeId }
		});

		if (promocode === null) {
			throw Error("Object not found");
		}

		await sequelize.transaction(async () => {
			const promises = [
				shopModel.promoCodes.update({
					function: aFunction,
					validAfter: moment.tz(validAfter, req.user.tz).toDate(),
					validBefore: moment.tz(validBefore, req.user.tz).toDate(),
					active: active == "on",
					maxActivations
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

				const languages = getSupportedLanguagesByDirectory(path.join(__dirname, "../locales/shop"), localization);

				languages.forEach(language => {
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
	formResultErrorHandler(logger),
	formResultSuccessHandler("/promocodes")
];

/**
 * @param {modules} modules
 */
module.exports.deleteAction = ({ logger, sequelize, reportModel, shopModel }) => [
	accessFunctionHandler,
	expressLayouts,
	[
		query("promoCodeId").trim().notEmpty()
	],
	validationHandler(logger),
	/**
	 * @type {RequestHandler}
	 */
	async (req, res, next) => {
		const { promoCodeId } = req.query;

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