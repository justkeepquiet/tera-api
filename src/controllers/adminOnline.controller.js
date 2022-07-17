"use strict";

/**
 * @typedef {import("../app").modules} modules
 * @typedef {import("express").RequestHandler} RequestHandler
 */

const expressLayouts = require("express-ejs-layouts");
const query = require("express-validator").query;
const moment = require("moment-timezone");
const helpers = require("../utils/helpers");

const { accessFunctionHandler, writeOperationReport } = require("../middlewares/admin.middlewares");

/**
 * @param {modules} modules
 */
module.exports.index = ({ logger, sequelize, accountModel, serverModel }) => [
	accessFunctionHandler,
	expressLayouts,
	/**
	 * @type {RequestHandler}
	 */
	(req, res) => {
		const { serverId } = req.query;

		accountModel.online.belongsTo(accountModel.info, { foreignKey: "accountDBID" });
		accountModel.online.hasOne(accountModel.info, { foreignKey: "accountDBID" });

		accountModel.online.findAll({
			where: {
				...serverId ? { serverId } : {}
			},
			include: [{
				model: accountModel.info,
				required: false,
				attributes: []
			}],
			attributes: {
				include: [
					[sequelize.col("userName"), "userName"],
					[sequelize.col("lastLoginTime"), "lastLoginTime"],
					[sequelize.col("lastLoginIP"), "lastLoginIP"],
					[sequelize.col("permission"), "permission"],
					[sequelize.col("privilege"), "privilege"]
				]
			}
		}).then(online =>
			serverModel.info.findAll().then(servers => {
				res.render("adminOnline", {
					layout: "adminLayout",
					moment,
					servers,
					online,
					serverId
				});
			})
		).catch(err => {
			logger.error(err);
			res.render("adminError", { layout: "adminLayout", err });
		});
	}
];

/**
 * @param {modules} modules
 */
module.exports.kickAction = ({ i18n, logger, fcgi, reportModel, accountModel, serverModel }) => [
	accessFunctionHandler,
	expressLayouts,
	[
		query("accountDBID")
			.isInt({ min: 0 }).withMessage(i18n.__("Account ID field must contain a valid number."))
			.custom((value, { req }) => accountModel.info.findOne({
				where: {
					accountDBID: req.query.accountDBID
				}
			}).then(data => {
				if (data === null) {
					return Promise.reject(i18n.__("Account ID field contains not existing account ID."));
				}
			})),
		query("serverId")
			.isInt({ min: 0 }).withMessage(i18n.__("Server ID field must contain a valid number."))
			.custom((value, { req }) => serverModel.info.findOne({
				where: {
					serverId: req.query.serverId
				}
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
		const errors = helpers.validationResultLog(req, logger);

		try {
			if (!/^true$/i.test(process.env.FCGI_GW_WEBAPI_ENABLE)) {
				throw "FCGI Gateway is not configured or disabled.";
			}

			if (!errors.isEmpty()) {
				throw new Error(errors.array()[0].msg);
			}

			await fcgi.kick(serverId, accountDBID, 33);

			next();
		} catch (err) {
			logger.error(err);
			res.render("adminError", { layout: "adminLayout", err });
		}
	},
	writeOperationReport(reportModel),
	/**
	 * @type {RequestHandler}
	 */
	(req, res) => {
		res.redirect(`/online?serverId=${req.query.fromServerId || ""}`);
	}
];

/**
 * @param {modules} modules
 */
module.exports.kickAllAction = ({ i18n, logger, fcgi, reportModel, serverModel }) => [
	accessFunctionHandler,
	expressLayouts,
	[
		query("serverId")
			.isInt({ min: 0 }).withMessage(i18n.__("Server ID field must contain a valid number."))
			.custom((value, { req }) => serverModel.info.findOne({
				where: {
					serverId: req.query.serverId
				}
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
		const errors = helpers.validationResultLog(req, logger);

		try {
			if (!/^true$/i.test(process.env.FCGI_GW_WEBAPI_ENABLE)) {
				throw "FCGI Gateway is not configured or disabled.";
			}

			if (!errors.isEmpty()) {
				throw new Error(errors.array()[0].msg);
			}

			await fcgi.bulkKick(serverId, 33);

			next();
		} catch (err) {
			logger.error(err);
			res.render("adminError", { layout: "adminLayout", err });
		}
	},
	writeOperationReport(reportModel),
	/**
	 * @type {RequestHandler}
	 */
	(req, res) => {
		res.redirect(`/online?serverId=${req.query.fromServerId || ""}`);
	}
];