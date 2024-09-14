"use strict";

/**
 * @typedef {import("../app").modules} modules
 * @typedef {import("express").RequestHandler} RequestHandler
 */

const expressLayouts = require("express-ejs-layouts");
const moment = require("moment-timezone");
const body = require("express-validator").body;
const validator = require("validator");

const helpers = require("../utils/helpers");
const { accessFunctionHandler, writeOperationReport } = require("../middlewares/admin.middlewares");

/**
 * @param {modules} modules
 */
module.exports.index = ({ accountModel }) => [
	accessFunctionHandler,
	expressLayouts,
	/**
	 * @type {RequestHandler}
	 */
	async (req, res, next) => {
		const bans = await accountModel.bans.findAll();

		res.render("adminBans", {
			layout: "adminLayout",
			moment,
			helpers,
			bans
		});
	}
];

/**
 * @param {modules} modules
 */
module.exports.add = ({ i18n, accountModel }) => [
	accessFunctionHandler,
	expressLayouts,
	[
		body("accountDBID")
			.isInt({ min: 0 }).withMessage(i18n.__("Account ID field must contain a valid number."))
			.custom(value => accountModel.info.findOne({
				where: { accountDBID: value }
			}).then(data => {
				if (value && data === null) {
					return Promise.reject(i18n.__("Account ID field contains not existing account ID."));
				}
			}))
	],
	/**
	 * @type {RequestHandler}
	 */
	async (req, res, next) => {
		const { accountDBID } = req.query;

		res.render("adminBansAdd", {
			layout: "adminLayout",
			errors: null,
			moment,
			accountDBID,
			startTime: moment(),
			endTime: moment().add(30, "days"),
			active: 1,
			ip: "",
			description: ""
		});
	}
];

/**
 * @param {modules} modules
 */
module.exports.addAction = ({ i18n, logger, hub, reportModel, accountModel }) => [
	accessFunctionHandler,
	expressLayouts,
	[
		body("accountDBID")
			.isInt({ min: 0 }).withMessage(i18n.__("Account ID field must contain a valid number."))
			.custom((value, { req }) => accountModel.bans.findOne({
				where: {
					accountDBID: req.body.accountDBID
				}
			}).then(data => {
				if (req.body.accountDBID && data !== null) {
					return Promise.reject(i18n.__("Account ID field contains already banned account ID."));
				}
			}))
			.custom((value, { req }) => accountModel.info.findOne({
				where: {
					accountDBID: req.body.accountDBID
				}
			}).then(data => {
				if (req.body.accountDBID && data === null) {
					return Promise.reject(i18n.__("Account ID field contains not existing account ID."));
				}
			})),
		body("startTime")
			.isISO8601().withMessage(i18n.__("Start time field must contain a valid date.")),
		body("endTime")
			.isISO8601().withMessage(i18n.__("End time field must contain a valid date.")),
		body("ip").optional().trim()
			.custom(value => {
				const ip = helpers.unserializeRange(value);
				return ip.length === 0 || ip.length === ip.filter(e => validator.isIP(e)).length;
			})
			.withMessage(i18n.__("IP address field must contain a valid IP value.")),
		body("active").optional()
			.isIn(["on"]).withMessage(i18n.__("Active field has invalid value.")),
		body("description").trim()
			.isLength({ min: 1, max: 1024 }).withMessage(i18n.__("Description field must be between 1 and 1024 characters."))
	],
	/**
	 * @type {RequestHandler}
	 */
	async (req, res, next) => {
		const { accountDBID, startTime, endTime, active, ip, description } = req.body;
		const errors = helpers.validationResultLog(req, logger);

		if (!errors.isEmpty()) {
			return res.render("adminBansAdd", {
				layout: "adminLayout",
				errors: errors.array(),
				accountDBID,
				startTime: moment.tz(startTime, req.user.tz),
				endTime: moment.tz(endTime, req.user.tz),
				active,
				ip,
				description
			});
		}

		const account = await accountModel.info.findOne({ where: { accountDBID } });

		await accountModel.bans.create({
			accountDBID: account.get("accountDBID"),
			startTime: moment.tz(startTime, req.user.tz).toDate(),
			endTime: moment.tz(endTime, req.user.tz).toDate(),
			active: active == "on",
			ip: JSON.stringify(helpers.unserializeRange(ip)),
			description
		});

		if (account.get("lastLoginServer") && moment.tz(startTime, req.user.tz) < moment() && moment.tz(endTime, req.user.tz) > moment()) {
			hub.kickUser(account.get("lastLoginServer"), account.get("accountDBID"), 264).catch(err => {
				if (err.resultCode() !== 2) {
					logger.warn(err.toString());
				}
			});
		}

		next();
	},
	writeOperationReport(reportModel),
	/**
	 * @type {RequestHandler}
	 */
	(req, res, next) => {
		res.redirect("/bans");
	}
];

/**
 * @param {modules} modules
 */
module.exports.edit = ({ accountModel }) => [
	accessFunctionHandler,
	expressLayouts,
	/**
	 * @type {RequestHandler}
	 */
	async (req, res, next) => {
		const { accountDBID } = req.query;

		if (!accountDBID) {
			return res.redirect("/bans");
		}

		const data = await accountModel.bans.findOne({
			where: { accountDBID }
		});

		if (data === null) {
			return res.redirect("/bans");
		}

		res.render("adminBansEdit", {
			layout: "adminLayout",
			errors: null,
			accountDBID: data.get("accountDBID"),
			startTime: moment(data.get("startTime")),
			endTime: moment(data.get("endTime")),
			description: data.get("description"),
			active: data.get("active"),
			ip: helpers.serializeRange(JSON.parse(data.get("ip") || "[]"))
		});
	}
];

/**
 * @param {modules} modules
 */
module.exports.editAction = ({ i18n, logger, hub, reportModel, accountModel }) => [
	accessFunctionHandler,
	expressLayouts,
	[
		body("startTime")
			.isISO8601().withMessage(i18n.__("Start time field must contain a valid date.")),
		body("endTime")
			.isISO8601().withMessage(i18n.__("End time field must contain a valid date.")),
		body("ip").optional().trim()
			.custom(value => {
				const ip = helpers.unserializeRange(value);
				return ip.length === 0 || ip.length === ip.filter(e => validator.isIP(e)).length;
			})
			.withMessage(i18n.__("IP address field must contain a valid IP value.")),
		body("active").optional()
			.isIn(["on"]).withMessage(i18n.__("Active field has invalid value.")),
		body("description").trim()
			.isLength({ min: 1, max: 1024 }).withMessage(i18n.__("Description field must be between 1 and 1024 characters."))
	],
	/**
	 * @type {RequestHandler}
	 */
	async (req, res, next) => {
		const { accountDBID } = req.query;
		const { startTime, endTime, active, ip, description } = req.body;
		const errors = helpers.validationResultLog(req, logger);

		if (!accountDBID) {
			return res.redirect("/bans");
		}

		if (!errors.isEmpty()) {
			return res.render("adminBansEdit", {
				layout: "adminLayout",
				errors: errors.array(),
				accountDBID,
				startTime: moment.tz(startTime, req.user.tz),
				endTime: moment.tz(endTime, req.user.tz),
				active,
				ip,
				description
			});
		}

		const account = await accountModel.info.findOne({ where: { accountDBID } });

		await accountModel.bans.update({
			startTime: moment.tz(startTime, req.user.tz).toDate(),
			endTime: moment.tz(endTime, req.user.tz).toDate(),
			active: active == "on",
			ip: JSON.stringify(helpers.unserializeRange(ip)),
			description
		}, {
			where: { accountDBID }
		});

		if (account.get("lastLoginServer") && moment.tz(startTime, req.user.tz) < moment() && moment.tz(endTime, req.user.tz) > moment()) {
			hub.kickUser(account.get("lastLoginServer"), account.get("accountDBID"), 264).catch(err => {
				if (err.resultCode() !== 2) {
					logger.warn(err.toString());
				}
			});
		}

		next();
	},
	writeOperationReport(reportModel),
	/**
	 * @type {RequestHandler}
	 */
	(req, res, next) => {
		res.redirect("/bans");
	}
];

/**
 * @param {modules} modules
 */
module.exports.deleteAction = ({ reportModel, accountModel }) => [
	accessFunctionHandler,
	expressLayouts,
	/**
	 * @type {RequestHandler}
	 */
	async (req, res, next) => {
		const { accountDBID } = req.query;

		if (!accountDBID) {
			return res.redirect("/bans");
		}

		await accountModel.bans.destroy({
			where: { accountDBID }
		});

		next();
	},
	writeOperationReport(reportModel),
	/**
	 * @type {RequestHandler}
	 */
	(req, res, next) => {
		res.redirect("/bans");
	}
];