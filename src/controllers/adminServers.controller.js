"use strict";

const expressLayouts = require("express-ejs-layouts");
const body = require("express-validator").body;
const logger = require("../utils/logger");
const helpers = require("../utils/helpers");
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
		accountModel.serverInfo.findAll().then(servers => {
			res.render("adminServers", {
				layout: "adminLayout",
				servers
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
		res.render("adminServersAdd", {
			layout: "adminLayout",
			errors: null,
			serverId: "",
			loginIp: "",
			loginPort: 7801,
			language: i18n.getLocale(),
			nameString: "",
			descrString: "",
			tresholdLow: 100,
			tresholdMedium: 500,
			isPvE: 0,
			isCrowdness: 0,
			isAvailable: 0,
			isEnabled: 1
		});
	}
];

module.exports.addAction = [
	i18nHandler,
	accessFunctionHandler(),
	expressLayouts,
	[
		body("serverId")
			.isNumeric().withMessage("Server ID must contain the value as a number.")
			.custom((value, { req }) => accountModel.serverInfo.findOne({
				where: {
					serverId: req.body.serverId
				}
			}).then(user => {
				if (user) {
					return Promise.reject(i18n.__("Server ID contains an existing server ID."));
				}
			})),
		body("loginIp").trim()
			.isIP().withMessage(i18n.__("Login IP must contain a valid IP value.")),
		body("loginPort")
			.isPort().withMessage(i18n.__("Login port must contain a valid port value.")),
		body("language").trim()
			.isAlpha().withMessage(i18n.__("Language must be a valid value."))
			.isLength({ min: 2, max: 3 }).withMessage(i18n.__("Language must be between 2 and 3 characters.")),
		body("nameString").trim()
			.isLength({ min: 1, max: 256 }).withMessage(i18n.__("Name string must be between 1 and 256 characters.")),
		body("descrString").trim()
			.isLength({ min: 1, max: 1024 }).withMessage(i18n.__("Description string must be between 1 and 1024 characters.")),
		body("tresholdLow").trim()
			.isNumeric().withMessage(i18n.__("Treshold low must contain the value as a number.")),
		body("tresholdMedium").trim()
			.isNumeric().withMessage(i18n.__("Treshold medium must contain the value as a number.")),
		body("isPvE").optional()
			.isIn(["on"]).withMessage(i18n.__("Only PvE field has invalid value.")),
		body("isCrowdness").optional()
			.isIn(["on"]).withMessage(i18n.__("Is crowdness field has invalid value.")),
		body("isAvailable").optional()
			.isIn(["on"]).withMessage(i18n.__("Is available field has invalid value.")),
		body("isEnabled").optional()
			.isIn(["on"]).withMessage(i18n.__("Is enabled field has invalid value."))
	],
	/**
	 * @type {import("express").RequestHandler}
	 */
	(req, res) => {
		const { serverId, loginIp, loginPort, language, nameString, descrString,
			tresholdLow, tresholdMedium, isPvE, isCrowdness, isAvailable, isEnabled } = req.body;
		const errors = helpers.validationResultLog(req);

		if (!errors.isEmpty()) {
			return res.render("adminServersAdd", {
				layout: "adminLayout",
				errors: errors.array(),
				serverId,
				loginIp,
				loginPort,
				language,
				nameString,
				descrString,
				tresholdLow,
				tresholdMedium,
				isPvE,
				isCrowdness,
				isAvailable,
				isEnabled
			});
		}

		accountModel.serverInfo.create({
			serverId,
			loginIp,
			loginPort,
			language,
			nameString,
			descrString,
			tresholdLow,
			tresholdMedium,
			isPvE: isPvE == "on",
			isCrowdness: isCrowdness == "on",
			isAvailable: isAvailable == "on",
			isEnabled: isEnabled == "on"
		}).then(() =>
			res.redirect("/servers")
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
		const { serverId } = req.query;

		accountModel.serverInfo.findOne({ where: { serverId } }).then(data => {
			if (data === null) {
				return res.redirect("/servers");
			}

			res.render("adminServersEdit", {
				layout: "adminLayout",
				errors: null,
				serverId: data.get("serverId"),
				loginIp: data.get("loginIp"),
				loginPort: data.get("loginPort"),
				language: data.get("language"),
				nameString: data.get("nameString"),
				descrString: data.get("descrString"),
				tresholdLow: data.get("tresholdLow"),
				tresholdMedium: data.get("tresholdMedium"),
				isPvE: data.get("isPvE"),
				isCrowdness: data.get("isCrowdness"),
				isAvailable: data.get("isAvailable"),
				isEnabled: data.get("isEnabled")
			});
		}).catch(err => {
			logger.error(err.toString());
			res.render("adminError", { layout: "adminLayout", err });
		});
	}
];

module.exports.editAction = [
	i18nHandler,
	accessFunctionHandler(),
	expressLayouts,
	[
		body("loginIp").trim()
			.isIP().withMessage(i18n.__("Login IP must contain a valid IP value.")),
		body("loginPort")
			.isPort().withMessage(i18n.__("Login port must contain a valid port value.")),
		body("language").trim()
			.isAlpha().withMessage(i18n.__("Language must be a valid value."))
			.isLength({ min: 2, max: 3 }).withMessage(i18n.__("Language must be between 2 and 3 characters.")),
		body("nameString").trim()
			.isLength({ min: 1, max: 256 }).withMessage(i18n.__("Name string must be between 1 and 256 characters.")),
		body("descrString").trim()
			.isLength({ min: 1, max: 1024 }).withMessage(i18n.__("Description string must be between 1 and 1024 characters.")),
		body("tresholdLow").trim()
			.isNumeric().withMessage(i18n.__("Treshold low must contain the value as a number.")),
		body("tresholdMedium").trim()
			.isNumeric().withMessage(i18n.__("Treshold medium must contain the value as a number.")),
		body("isPvE").optional()
			.isIn(["on"]).withMessage(i18n.__("Only PvE field has invalid value.")),
		body("isCrowdness").optional()
			.isIn(["on"]).withMessage(i18n.__("Is crowdness field has invalid value.")),
		body("isAvailable").optional()
			.isIn(["on"]).withMessage(i18n.__("Is available field has invalid value.")),
		body("isEnabled").optional()
			.isIn(["on"]).withMessage(i18n.__("Is enabled field has invalid value."))
	],
	/**
	 * @type {import("express").RequestHandler}
	 */
	(req, res) => {
		const { serverId } = req.query;
		const { loginIp, loginPort, language, nameString, descrString,
			tresholdLow, tresholdMedium, isPvE, isCrowdness, isAvailable, isEnabled } = req.body;
		const errors = helpers.validationResultLog(req);

		if (!errors.isEmpty()) {
			return res.render("adminServersAdd", {
				layout: "adminLayout",
				errors: errors.array(),
				serverId,
				loginIp,
				loginPort,
				language,
				nameString,
				descrString,
				tresholdLow,
				tresholdMedium,
				isPvE,
				isCrowdness,
				isAvailable,
				isEnabled
			});
		}

		accountModel.serverInfo.update({
			loginIp,
			loginPort,
			language,
			nameString,
			descrString,
			tresholdLow,
			tresholdMedium,
			isPvE: isPvE == "on",
			isCrowdness: isCrowdness == "on",
			isAvailable: isAvailable == "on",
			isEnabled: isEnabled == "on"
		}, {
			where: { serverId }
		}).then(() =>
			res.redirect("/servers")
		).catch(err => {
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
		const { serverId } = req.query;

		accountModel.serverInfo.destroy({ where: { serverId } }).then(() =>
			res.redirect("/servers")
		).catch(err => {
			logger.error(err.toString());
			res.render("adminError", { layout: "adminLayout", err });
		});
	}
];