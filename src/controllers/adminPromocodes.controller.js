"use strict";

/**
 * @typedef {import("../app").modules} modules
 * @typedef {import("express").RequestHandler} RequestHandler
 */

const expressLayouts = require("express-ejs-layouts");
const { query, body } = require("express-validator");
const moment = require("moment-timezone");

const helpers = require("../utils/helpers");

const {
	accessFunctionHandler,
	validationHandler,
	formValidationHandler,
	formResultErrorHandler,
	formResultSuccessHandler,
	writeOperationReport
} = require("../middlewares/admin.middlewares");

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
			moment,
			promocodes
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
			moment,
			promocodeFunctions: helpers.getPromocodeFunctionsNames(),
			shopLocales
		});
	}
];

/**
 * @param {modules} modules
 */
module.exports.addAction = ({ i18n, logger, sequelize, reportModel, shopModel }) => [
	accessFunctionHandler,
	[
		body("promoCode")
			.isLength({ min: 6, max: 16 }).withMessage(i18n.__("Promo code field must be between 6 and 16 characters."))
			.custom(value => shopModel.promoCodes.findOne({
				where: { promoCode: value }
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
	formValidationHandler(logger),
	/**
	 * @type {RequestHandler}
	 */
	async (req, res, next) => {
		const { promoCode, aFunction, validAfter, validBefore, active, description } = req.body;

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
	formResultErrorHandler(logger),
	formResultSuccessHandler("/promocodes")
];

/**
 * @param {modules} modules
 */
module.exports.edit = ({ logger, shopModel }) => [
	accessFunctionHandler,
	expressLayouts,
	[
		query("promoCodeId").notEmpty()
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
	[
		query("promoCodeId").notEmpty(),
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
	formValidationHandler(logger),
	/**
	 * @type {RequestHandler}
	 */
	async (req, res, next) => {
		const { promoCodeId } = req.query;
		const { aFunction, validAfter, validBefore, active, description } = req.body;

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
		query("promoCodeId").notEmpty()
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