"use strict";

/**
 * @typedef {import("../app").modules} modules
 * @typedef {import("express").RequestHandler} RequestHandler
 */

const expressLayouts = require("express-ejs-layouts");
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
module.exports.index = ({ localization, serverModel }) => [
	accessFunctionHandler,
	expressLayouts,
	/**
	 * @type {RequestHandler}
	 */
	async (req, res, next) => {
		const strings = await serverModel.strings.findAll();

		res.render("adminServerStrings", {
			layout: "adminLayout",
			availableLanguages: localization.listAllLanguages(),
			strings
		});
	}
];

/**
 * @param {modules} modules
 */
module.exports.add = ({ localization, serverModel }) => [
	accessFunctionHandler,
	expressLayouts,
	/**
	 * @type {RequestHandler}
	 */
	async (req, res, next) => {
		const strings = await serverModel.strings.findAll({ attributes: ["language"] });
		const addedLanguages = strings?.map(string => string.get("language")) || [];

		res.render("adminServerStringsAdd", {
			layout: "adminLayout",
			availableLanguages: localization.listAllLanguages(),
			addedLanguages
		});
	}
];

/**
 * @param {modules} modules
 */
module.exports.addAction = ({ localization, i18n, logger, reportModel, serverModel }) => [
	accessFunctionHandler,
	[
		body("language").trim().toLowerCase()
			.isIn(localization.listAllLanguages())
			.withMessage(i18n.__("The field must be a valid value."))
			.custom(value => serverModel.strings.findOne({
				where: { language: value }
			}).then(data => {
				if (data) {
					return Promise.reject(i18n.__("The field contains already existing language code."));
				}
				return true;
			})),
		body("categoryPvE").trim()
			.isLength({ min: 1, max: 50 }).withMessage(i18n.__("The field must be between 1 and 50 characters.")),
		body("categoryPvP").trim()
			.isLength({ min: 1, max: 50 }).withMessage(i18n.__("The field must be between 1 and 50 characters.")),
		body("serverOffline").trim()
			.isLength({ min: 1, max: 50 }).withMessage(i18n.__("The field must be between 1 and 50 characters.")),
		body("serverLow").trim()
			.isLength({ min: 1, max: 50 }).withMessage(i18n.__("The field must be between 1 and 50 characters.")),
		body("serverMedium").trim()
			.isLength({ min: 1, max: 50 }).withMessage(i18n.__("The field must be between 1 and 50 characters.")),
		body("serverHigh").trim()
			.isLength({ min: 1, max: 50 }).withMessage(i18n.__("The field must be between 1 and 50 characters.")),
		body("crowdNo").trim()
			.isLength({ min: 1, max: 50 }).withMessage(i18n.__("The field must be between 1 and 50 characters.")),
		body("crowdYes").trim()
			.isLength({ min: 1, max: 50 }).withMessage(i18n.__("The field must be between 1 and 50 characters.")),
		body("popup").trim()
			.isLength({ min: 1, max: 2048 }).withMessage(i18n.__("The field must be between 1 and 2048 characters."))
	],
	formValidationHandler(logger),
	/**
	 * @type {RequestHandler}
	 */
	async (req, res, next) => {
		const { language, categoryPvE, categoryPvP, serverOffline,
			serverLow, serverMedium, serverHigh, crowdNo, crowdYes, popup } = req.body;

		await serverModel.strings.create({
			language,
			categoryPvE,
			categoryPvP,
			serverOffline,
			serverLow,
			serverMedium,
			serverHigh,
			crowdNo,
			crowdYes,
			popup
		});

		next();
	},
	writeOperationReport(reportModel),
	formResultErrorHandler(logger),
	formResultSuccessHandler("/server_strings")
];

/**
 * @param {modules} modules
 */
module.exports.edit = ({ localization, logger, serverModel }) => [
	accessFunctionHandler,
	expressLayouts,
	[
		query("language").trim().notEmpty()
	],
	validationHandler(logger),
	/**
	 * @type {RequestHandler}
	 */
	async (req, res, next) => {
		const { language } = req.query;

		const data = await serverModel.strings.findOne({
			where: { language }
		});

		if (data === null) {
			throw Error("Object not found");
		}

		res.render("adminServerStringsEdit", {
			layout: "adminLayout",
			availableLanguages: localization.listAllLanguages(),
			language: data.get("language"),
			categoryPvE: data.get("categoryPvE"),
			categoryPvP: data.get("categoryPvP"),
			serverOffline: data.get("serverOffline"),
			serverLow: data.get("serverLow"),
			serverMedium: data.get("serverMedium"),
			serverHigh: data.get("serverHigh"),
			crowdNo: data.get("crowdNo"),
			crowdYes: data.get("crowdYes"),
			popup: data.get("popup")
		});
	}
];

/**
 * @param {modules} modules
 */
module.exports.editAction = ({ i18n, logger, reportModel, serverModel }) => [
	accessFunctionHandler,
	[
		query("language").trim().notEmpty(),
		body("categoryPvE").trim()
			.isLength({ min: 1, max: 50 }).withMessage(i18n.__("The field must be between 1 and 50 characters.")),
		body("categoryPvP").trim()
			.isLength({ min: 1, max: 50 }).withMessage(i18n.__("The field must be between 1 and 50 characters.")),
		body("serverOffline").trim()
			.isLength({ min: 1, max: 50 }).withMessage(i18n.__("The field must be between 1 and 50 characters.")),
		body("serverLow").trim()
			.isLength({ min: 1, max: 50 }).withMessage(i18n.__("The field must be between 1 and 50 characters.")),
		body("serverMedium").trim()
			.isLength({ min: 1, max: 50 }).withMessage(i18n.__("The field must be between 1 and 50 characters.")),
		body("serverHigh").trim()
			.isLength({ min: 1, max: 50 }).withMessage(i18n.__("The field must be between 1 and 50 characters.")),
		body("crowdNo").trim()
			.isLength({ min: 1, max: 50 }).withMessage(i18n.__("The field must be between 1 and 50 characters.")),
		body("crowdYes").trim()
			.isLength({ min: 1, max: 50 }).withMessage(i18n.__("The field must be between 1 and 50 characters.")),
		body("popup").trim()
			.isLength({ min: 1, max: 2048 }).withMessage(i18n.__("The field must be between 1 and 2048 characters."))
	],
	formValidationHandler(logger),
	/**
	 * @type {RequestHandler}
	 */
	async (req, res, next) => {
		const { language } = req.query;
		const { categoryPvE, categoryPvP, serverOffline,
			serverLow, serverMedium, serverHigh, crowdNo, crowdYes, popup } = req.body;

		await serverModel.strings.update({
			categoryPvE,
			categoryPvP,
			serverOffline,
			serverLow,
			serverMedium,
			serverHigh,
			crowdNo,
			crowdYes,
			popup
		}, {
			where: { language }
		});

		next();
	},
	writeOperationReport(reportModel),
	formResultErrorHandler(logger),
	formResultSuccessHandler("/server_strings")
];

/**
 * @param {modules} modules
 */
module.exports.deleteAction = ({ logger, reportModel, serverModel }) => [
	accessFunctionHandler,
	expressLayouts,
	[
		query("language").trim().notEmpty()
	],
	validationHandler(logger),
	/**
	 * @type {RequestHandler}
	 */
	async (req, res, next) => {
		const { language } = req.query;

		await serverModel.strings.destroy({
			where: { language }
		});

		next();
	},
	writeOperationReport(reportModel),
	/**
	 * @type {RequestHandler}
	 */
	(req, res, next) => {
		res.redirect("/server_strings");
	}
];