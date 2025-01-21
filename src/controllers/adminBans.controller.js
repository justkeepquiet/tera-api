"use strict";

/**
 * @typedef {import("../app").modules} modules
 * @typedef {import("express").RequestHandler} RequestHandler
 */

const expressLayouts = require("express-ejs-layouts");
const moment = require("moment-timezone");
const { query, body } = require("express-validator");
const validator = require("validator");

const helpers = require("../utils/helpers");

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
module.exports.index = ({ accountModel }) => [
	accessFunctionHandler,
	expressLayouts,
	/**
	 * @type {RequestHandler}
	 */
	async (req, res, next) => {
		const bans = await accountModel.bans.findAll({
			include: [{
				as: "info",
				model: accountModel.info,
				required: false,
				attributes: ["userName"]
			}]
		});

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
module.exports.add = ({ logger, i18n, accountModel }) => [
	accessFunctionHandler,
	expressLayouts,
	[
		query("accountDBID").optional({ checkFalsy: true }).trim()
			.isInt({ min: 0 }).withMessage(i18n.__("The field must contain a valid number."))
			.custom(value => accountModel.info.findOne({
				where: { accountDBID: value }
			}).then(data => {
				if (value && data === null) {
					return Promise.reject(i18n.__("The field contains not existing account ID."));
				}
			}))
	],
	validationHandler(logger),
	/**
	 * @type {RequestHandler}
	 */
	async (req, res, next) => {
		const { accountDBID } = req.query;

		res.render("adminBansAdd", {
			layout: "adminLayout",
			moment,
			accountDBID
		});
	}
];

/**
 * @param {modules} modules
 */
module.exports.addAction = ({ i18n, logger, hub, reportModel, accountModel }) => [
	accessFunctionHandler,
	[
		body("accountDBID").trim()
			.isInt({ min: 0 }).withMessage(i18n.__("The field must contain a valid number."))
			.custom(value => accountModel.bans.findOne({
				where: { accountDBID: value }
			}).then(data => {
				if (value && data !== null) {
					return Promise.reject(i18n.__("The field contains already banned account ID."));
				}
			}))
			.custom(value => accountModel.info.findOne({
				where: { accountDBID: value }
			}).then(data => {
				if (value && data === null) {
					return Promise.reject(i18n.__("The field contains not existing account ID."));
				}
			})),
		body("startTime").trim()
			.isISO8601().withMessage(i18n.__("The field must contain a valid date.")),
		body("endTime").trim()
			.isISO8601().withMessage(i18n.__("The field must contain a valid date.")),
		body("ip").optional().trim()
			.custom(value => {
				const ip = helpers.unserializeRange(value);
				return ip.length === 0 || ip.length === ip.filter(e => validator.isIP(e)).length;
			})
			.withMessage(i18n.__("The field must contain a valid IP value.")),
		body("active").optional().trim()
			.isIn(["on"]).withMessage(i18n.__("The field has invalid value.")),
		body("description").trim()
			.isLength({ min: 1, max: 1024 }).withMessage(i18n.__("The field must be between 1 and 1024 characters."))
	],
	formValidationHandler(logger),
	/**
	 * @type {RequestHandler}
	 */
	async (req, res, next) => {
		const { accountDBID, startTime, endTime, active, ip, description } = req.body;

		const account = await accountModel.info.findOne({
			where: { accountDBID }
		});

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
	formResultErrorHandler(logger),
	formResultSuccessHandler("/bans")
];

/**
 * @param {modules} modules
 */
module.exports.edit = ({ logger, accountModel }) => [
	accessFunctionHandler,
	expressLayouts,
	[
		query("accountDBID").trim().notEmpty()
	],
	validationHandler(logger),
	/**
	 * @type {RequestHandler}
	 */
	async (req, res, next) => {
		const { accountDBID } = req.query;

		const data = await accountModel.bans.findOne({
			where: { accountDBID }
		});

		if (data === null) {
			throw Error("Object not found");
		}

		res.render("adminBansEdit", {
			layout: "adminLayout",
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
	[
		query("accountDBID").trim().notEmpty(),
		body("startTime").trim()
			.isISO8601().withMessage(i18n.__("The field must contain a valid date.")),
		body("endTime").trim()
			.isISO8601().withMessage(i18n.__("The field must contain a valid date.")),
		body("ip").optional().trim()
			.custom(value => {
				const ip = helpers.unserializeRange(value);
				return ip.length === 0 || ip.length === ip.filter(e => validator.isIP(e)).length;
			})
			.withMessage(i18n.__("The field must contain a valid IP value.")),
		body("active").optional().trim()
			.isIn(["on"]).withMessage(i18n.__("The field has invalid value.")),
		body("description").trim()
			.isLength({ min: 1, max: 1024 }).withMessage(i18n.__("The field must be between 1 and 1024 characters."))
	],
	formValidationHandler(logger),
	/**
	 * @type {RequestHandler}
	 */
	async (req, res, next) => {
		const { accountDBID } = req.query;
		const { startTime, endTime, active, ip, description } = req.body;

		const account = await accountModel.info.findOne({
			where: { accountDBID }
		});

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
	formResultErrorHandler(logger),
	formResultSuccessHandler("/bans")
];

/**
 * @param {modules} modules
 */
module.exports.deleteAction = ({ logger, reportModel, accountModel }) => [
	accessFunctionHandler,
	expressLayouts,
	[
		query("accountDBID").trim().notEmpty()
	],
	validationHandler(logger),
	/**
	 * @type {RequestHandler}
	 */
	async (req, res, next) => {
		const { accountDBID } = req.query;

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