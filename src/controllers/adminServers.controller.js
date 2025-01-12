"use strict";

/**
 * @typedef {import("../app").modules} modules
 * @typedef {import("express").RequestHandler} RequestHandler
 */

const expressLayouts = require("express-ejs-layouts");
const { query, body } = require("express-validator");

const helpers = require("../utils/helpers");

const {
	accessFunctionHandler,
	validationHandler,
	formValidationHandler,
	formResultErrorHandler,
	formResultSuccessHandler,
	writeOperationReport
} = require("../middlewares/admin.middlewares");

const isSlsOverridden = (config, serverId = null) => {
	try {
		const slsOverride = config.get("slsOverride");

		if (serverId !== null) {
			return slsOverride.filter(s => s.serverId == serverId).length !== 0;
		} else {
			return slsOverride.length !== 0;
		}
	} catch (_) { }

	return false;
};

/**
 * @param {modules} modules
 */
module.exports.index = ({ config, serverModel }) => [
	accessFunctionHandler,
	expressLayouts,
	/**
	 * @type {RequestHandler}
	 */
	async (req, res, next) => {
		const servers = await serverModel.info.findAll();

		res.render("adminServers", {
			layout: "adminLayout",
			servers,
			config,
			isSlsOverridden
		});
	}
];

/**
 * @param {modules} modules
 */
module.exports.add = ({ config, i18n }) => [
	accessFunctionHandler,
	expressLayouts,
	/**
	 * @type {RequestHandler}
	 */
	async (req, res, next) => {
		res.render("adminServersAdd", {
			layout: "adminLayout",
			i18n,
			language: i18n.getLocale(),
			isSlsOverridden: isSlsOverridden(config)
		});
	}
];

/**
 * @param {modules} modules
 */
module.exports.addAction = ({ i18n, logger, reportModel, serverModel }) => [
	accessFunctionHandler,
	[
		body("serverId")
			.isInt({ min: 1 }).withMessage(i18n.__("Server ID field must contain the value as a number."))
			.custom(value => serverModel.info.findOne({
				where: { serverId: value }
			}).then(data => {
				if (data) {
					return Promise.reject(i18n.__("Server ID field contains an existing server ID."));
				}
			})),
		body("loginIp").trim()
			.isIP().withMessage(i18n.__("Login IP field must contain a valid IP value.")),
		body("loginPort")
			.isPort().withMessage(i18n.__("Login port field must contain a valid port value.")),
		body("language").trim().toLowerCase()
			.isIn(["cn", "de", "en", "fr", "jp", "kr", "ru", "se", "th", "tw"])
			.withMessage(i18n.__("Language field must be a valid value.")),
		body("nameString").trim()
			.isLength({ min: 1, max: 256 }).withMessage(i18n.__("Name string field must be between 1 and 256 characters.")),
		body("descrString").trim()
			.isLength({ min: 1, max: 1024 }).withMessage(i18n.__("Description string field must be between 1 and 1024 characters.")),
		body("permission")
			.isInt({ min: 0, max: 1e10 }).withMessage(i18n.__("Permission field must contain the value as a number.")),
		body("thresholdLow")
			.isInt({ min: 0, max: 1e8 }).withMessage(i18n.__("Threshold low field must contain the value as a number.")),
		body("thresholdMedium")
			.isInt({ min: 0, max: 1e8 }).withMessage(i18n.__("Threshold medium field must contain the value as a number.")),
		body("isPvE").optional()
			.isIn(["on"]).withMessage(i18n.__("Only PvE field has invalid value.")),
		body("isCrowdness").optional()
			.isIn(["on"]).withMessage(i18n.__("Is crowdness field has invalid value.")),
		body("isAvailable").optional()
			.isIn(["on"]).withMessage(i18n.__("Is available field has invalid value.")),
		body("isEnabled").optional()
			.isIn(["on"]).withMessage(i18n.__("Is enabled field has invalid value."))
	],
	formValidationHandler(logger),
	/**
	 * @type {RequestHandler}
	 */
	async (req, res, next) => {
		const { serverId, loginIp, loginPort, language, nameString, descrString, permission,
			thresholdLow, thresholdMedium, isPvE, isCrowdness, isAvailable, isEnabled } = req.body;

		await serverModel.info.create({
			serverId,
			loginIp,
			loginPort,
			language,
			nameString,
			descrString,
			permission,
			thresholdLow,
			thresholdMedium,
			isPvE: isPvE == "on",
			isCrowdness: isCrowdness == "on",
			isAvailable: isAvailable == "on",
			isEnabled: isEnabled == "on"
		});

		next();
	},
	writeOperationReport(reportModel),
	formResultErrorHandler(logger),
	formResultSuccessHandler("/servers")
];

/**
 * @param {modules} modules
 */
module.exports.edit = ({ config, planetDbs, logger, serverModel }) => [
	accessFunctionHandler,
	expressLayouts,
	[
		query("serverId").notEmpty()
	],
	validationHandler(logger),
	/**
	 * @type {RequestHandler}
	 */
	async (req, res, next) => {
		const { serverId } = req.query;

		const data = await serverModel.info.findOne({
			where: { serverId }
		});

		if (data === null) {
			throw Error("Object not found");
		}

		res.render("adminServersEdit", {
			layout: "adminLayout",
			serverId: data.get("serverId"),
			loginIp: data.get("loginIp"),
			loginPort: data.get("loginPort"),
			language: data.get("language"),
			nameString: data.get("nameString"),
			descrString: data.get("descrString"),
			permission: data.get("permission"),
			thresholdLow: data.get("thresholdLow"),
			thresholdMedium: data.get("thresholdMedium"),
			isPvE: data.get("isPvE"),
			isCrowdness: data.get("isCrowdness"),
			isAvailable: data.get("isAvailable"),
			isEnabled: data.get("isEnabled"),
			isSlsOverridden: isSlsOverridden(config, serverId),
			isSyncCharactersAvailable: planetDbs?.has(Number(serverId)),
			syncCharacters: false
		});
	}
];

/**
 * @param {modules} modules
 */
module.exports.editAction = ({ i18n, logger, queue, reportModel, serverModel }) => [
	accessFunctionHandler,
	[
		query("serverId").notEmpty(),
		body("loginIp").trim()
			.isIP().withMessage(i18n.__("Login IP field must contain a valid IP value.")),
		body("loginPort")
			.isPort().withMessage(i18n.__("Login port field must contain a valid port value.")),
		body("language").trim().toLowerCase()
			.isIn(["cn", "de", "en", "fr", "jp", "kr", "ru", "se", "th", "tw"])
			.withMessage(i18n.__("Language field must be a valid value.")),
		body("nameString").trim()
			.isLength({ min: 1, max: 256 }).withMessage(i18n.__("Name string field must be between 1 and 256 characters.")),
		body("descrString").trim()
			.isLength({ min: 1, max: 1024 }).withMessage(i18n.__("Description string field must be between 1 and 1024 characters.")),
		body("permission")
			.isInt({ min: 0, max: 1e10 }).withMessage(i18n.__("Permission field must contain the value as a number.")),
		body("thresholdLow")
			.isInt({ min: 0, max: 1e8 }).withMessage(i18n.__("Threshold low field must contain the value as a number.")),
		body("thresholdMedium")
			.isInt({ min: 0, max: 1e8 }).withMessage(i18n.__("Threshold medium field must contain the value as a number.")),
		body("isPvE").optional()
			.isIn(["on"]).withMessage(i18n.__("Only PvE field has invalid value.")),
		body("isCrowdness").optional()
			.isIn(["on"]).withMessage(i18n.__("Is crowdness field has invalid value.")),
		body("isAvailable").optional()
			.isIn(["on"]).withMessage(i18n.__("Is available field has invalid value.")),
		body("isEnabled").optional()
			.isIn(["on"]).withMessage(i18n.__("Is enabled field has invalid value.")),
		body("syncCharacters").optional()
			.isIn(["on"]).withMessage(i18n.__("Sync characters field has invalid value."))
	],
	formValidationHandler(logger),
	/**
	 * @type {RequestHandler}
	 */
	async (req, res, next) => {
		const { serverId } = req.query;
		const { loginIp, loginPort, language, nameString, descrString, permission,
			thresholdLow, thresholdMedium, isPvE, isCrowdness, isAvailable, isEnabled, syncCharacters } = req.body;

		await serverModel.info.update({
			loginIp,
			loginPort,
			language,
			nameString,
			descrString,
			permission,
			thresholdLow,
			thresholdMedium,
			isPvE: isPvE == "on",
			isCrowdness: isCrowdness == "on",
			isAvailable: isAvailable == "on",
			isEnabled: isEnabled == "on"
		}, {
			where: { serverId }
		});

		if (syncCharacters == "on") {
			const found = await queue.findByTag("charactersMigrate", serverId, 1);

			if (found.length === 0) {
				await queue.insert("charactersMigrate", [serverId], serverId);
			}
		}

		next();
	},
	writeOperationReport(reportModel),
	formResultErrorHandler(logger),
	formResultSuccessHandler("/servers")
];

/**
 * @param {modules} modules
 */
module.exports.deleteAction = ({ logger, reportModel, serverModel }) => [
	accessFunctionHandler,
	expressLayouts,
	[
		query("serverId").notEmpty()
	],
	validationHandler(logger),
	/**
	 * @type {RequestHandler}
	 */
	async (req, res, next) => {
		const { serverId } = req.query;

		await serverModel.info.destroy({
			where: { serverId }
		});

		next();
	},
	writeOperationReport(reportModel),
	/**
	 * @type {RequestHandler}
	 */
	(req, res, next) => {
		res.redirect("/servers");
	}
];