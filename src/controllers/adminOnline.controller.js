"use strict";

/**
 * @typedef {import("../app").modules} modules
 * @typedef {import("express").RequestHandler} RequestHandler
 */

const expressLayouts = require("express-ejs-layouts");
const query = require("express-validator").query;
const moment = require("moment-timezone");

const { validationResultLog } = require("../utils/helpers");
const { accessFunctionHandler, writeOperationReport } = require("../middlewares/admin.middlewares");

/**
 * @param {modules} modules
 */
module.exports.index = ({ accountModel, serverModel }) => [
	accessFunctionHandler,
	expressLayouts,
	/**
	 * @type {RequestHandler}
	 */
	async (req, res, next) => {
		const { serverId } = req.query;

		const online = await accountModel.online.findAll({
			where: {
				...serverId ? { serverId } : {}
			},
			include: [{
				as: "info",
				model: accountModel.info
			}]
		});

		serverModel.info.findAll().then(servers => {
			res.render("adminOnline", {
				layout: "adminLayout",
				moment,
				servers,
				online,
				serverId
			});
		});
	}
];

/**
 * @param {modules} modules
 */
module.exports.kickAction = ({ i18n, logger, hub, reportModel, accountModel, serverModel }) => [
	accessFunctionHandler,
	expressLayouts,
	[
		query("accountDBID").trim()
			.isInt({ min: 0 }).withMessage(i18n.__("Account ID field must contain a valid number."))
			.custom(value => accountModel.info.findOne({
				where: { accountDBID: value }
			}).then(data => {
				if (data === null) {
					return Promise.reject(i18n.__("Account ID field contains not existing account ID."));
				}
			})),
		query("serverId").trim()
			.isInt({ min: 0 }).withMessage(i18n.__("Server ID field must contain a valid number."))
			.custom(value => serverModel.info.findOne({
				where: { serverId: value }
			}).then(data => {
				if (data === null) {
					return Promise.reject(i18n.__("Server ID field contains not existing server ID."));
				}
			}))
	],
	/**
	 * @type {RequestHandler}
	 */
	async (req, res, next) => {
		const { accountDBID, serverId } = req.query;
		const errors = validationResultLog(req, logger);

		if (!errors.isEmpty()) {
			throw new Error(errors.array()[0].msg);
		}

		await hub.kickUser(serverId, accountDBID, 33);

		next();
	},
	writeOperationReport(reportModel),
	/**
	 * @type {RequestHandler}
	 */
	async (req, res, next) => {
		res.redirect(`/online?serverId=${req.query.fromServerId || ""}`);
	}
];

/**
 * @param {modules} modules
 */
module.exports.kickAllAction = ({ i18n, logger, hub, reportModel, serverModel }) => [
	accessFunctionHandler,
	expressLayouts,
	[
		query("serverId").trim()
			.isInt({ min: 0 }).withMessage(i18n.__("Server ID field must contain a valid number."))
			.custom(value => serverModel.info.findOne({
				where: { serverId: value }
			}).then(data => {
				if (data === null) {
					return Promise.reject(i18n.__("Server ID field contains not existing server ID."));
				}
			}))
	],
	/**
	 * @type {RequestHandler}
	 */
	async (req, res, next) => {
		const { serverId } = req.query;
		const errors = validationResultLog(req, logger);

		if (!errors.isEmpty()) {
			throw new Error(errors.array()[0].msg);
		}

		await hub.bulkKick(serverId, 33);

		next();
	},
	writeOperationReport(reportModel),
	/**
	 * @type {RequestHandler}
	 */
	(req, res, next) => {
		res.redirect(`/online?serverId=${req.query.fromServerId || ""}`);
	}
];