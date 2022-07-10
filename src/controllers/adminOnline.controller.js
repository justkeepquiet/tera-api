"use strict";

/**
 * @typedef {import("../app").modules} modules
 * @typedef {import("express").RequestHandler} RequestHandler
 */

const expressLayouts = require("express-ejs-layouts");
const query = require("express-validator").query;
const moment = require("moment-timezone");
const helpers = require("../utils/helpers");

const { accessFunctionHandler } = require("../middlewares/admin.middlewares");

/**
 * @param {modules} modules
 */
module.exports.index = ({ logger, accountModel }) => [
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
					[accountModel.info.sequelize.col("userName"), "userName"],
					[accountModel.info.sequelize.col("lastLoginTime"), "lastLoginTime"],
					[accountModel.info.sequelize.col("lastLoginIP"), "lastLoginIP"]
				]
			}
		}).then(online =>
			accountModel.serverInfo.findAll().then(servers => {
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
module.exports.kickAction = ({ i18n, logger, fcgi, accountModel }) => [
	accessFunctionHandler,
	expressLayouts,
	[
		query("accountDBID").trim()
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
		query("serverId").trim()
			.isInt({ min: 0 }).withMessage(i18n.__("Server ID field must contain a valid number."))
			.custom((value, { req }) => accountModel.serverInfo.findOne({
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
	(req, res) => {
		const { accountDBID, serverId, fromServerId } = req.query;
		const errors = helpers.validationResultLog(req, logger);

		if (!errors.isEmpty()) {
			return res.render("adminError", { layout: "adminLayout", err: errors.array()[0].msg });
		}

		fcgi.kick(serverId, accountDBID, 33).then(() =>
			res.redirect(`/online?serverId=${fromServerId}`)
		).catch(err => {
			logger.error(err);
			res.render("adminError", { layout: "adminLayout", err });
		});
	}
];