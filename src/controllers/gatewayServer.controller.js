"use strict";

/**
 * @typedef {import("../app").modules} modules
 * @typedef {import("express").RequestHandler} RequestHandler
 */

const moment = require("moment-timezone");
const { query, body } = require("express-validator");

const { validationHandler, writeOperationReport } = require("../middlewares/gateway.middlewares");

/**
 * @param {modules} modules
 */
module.exports.ListServers = ({ serverModel }) => [
	/**
	 * @type {RequestHandler}
	 */
	async (req, res, next) => {
		const servers = await serverModel.info.findAll();

		const data = [];

		servers.forEach(server => {
			data.push({
				ServerId: server.get("serverId"),
				LoginIp: server.get("loginIp"),
				LoginPort: server.get("loginPort"),
				Language: server.get("language"),
				NameString: server.get("nameString"),
				DescrString: server.get("descrString"),
				Permission: server.get("permission"),
				ThresholdLow: server.get("thresholdLow"),
				ThresholdMedium: server.get("thresholdMedium"),
				IsPvE: server.get("isPvE"),
				IsCrowdness: server.get("isCrowdness"),
				IsAvailable: server.get("isAvailable"),
				IsEnabled: server.get("isEnabled"),
				UsersOnline: server.get("usersOnline"),
				UsersTotal: server.get("usersTotal")
			});
		});

		res.json({
			Return: true,
			ReturnCode: 0,
			Msg: "success",
			Servers: data
		});
	}
];

/**
 * @param {modules} modules
 */
module.exports.ListOnlineAccountsByServerId = ({ logger, accountModel }) => [
	[query("serverId").trim().isNumeric()],
	validationHandler(logger),
	/**
	 * @type {RequestHandler}
	 */
	async (req, res, next) => {
		const { serverId } = req.query;

		const online = await accountModel.online.findAll({
			where: { serverId },
			include: [{
				as: "info",
				model: accountModel.info,
				required: true
			}]
		});

		const data = [];

		online.forEach(account => {
			data.push({
				ServerId: account.get("serverId"),
				UserNo: account.get("accountDBID"),
				UserName: account.get("info").get("userName"),
				LastLoginIP: account.get("info").get("lastLoginIP"),
				LastLoginTime: moment(account.get("info").get("lastLoginTime")).toISOString()
			});
		});

		res.json({
			Return: true,
			ReturnCode: 0,
			Msg: "success",
			OnlineAccounts: data
		});
	}
];

/**
 * @param {modules} modules
 */
module.exports.GetServerInfoByServerId = ({ logger, serverModel, accountModel }) => [
	[
		query("serverId").trim().isNumeric()
			.custom(value => serverModel.info.findOne({
				where: { serverId: value }
			}).then(data => {
				if (value && data === null) {
					return Promise.reject("Not existing server ID");
				}
				return true;
			}))
	],
	validationHandler(logger),
	/**
	 * @type {RequestHandler}
	 */
	async (req, res, next) => {
		const { serverId } = req.query;

		const server = await serverModel.info.findOne({
			where: { serverId: serverId }
		});

		const characters = await accountModel.characters.count({
			where: { serverId: serverId }
		});

		res.json({
			Return: true,
			ReturnCode: 0,
			Msg: "success",
			ServerId: server.get("serverId"),
			LoginIp: server.get("loginIp"),
			LoginPort: server.get("loginPort"),
			Language: server.get("language"),
			NameString: server.get("nameString"),
			DescrString: server.get("descrString"),
			Permission: server.get("permission"),
			ThresholdLow: server.get("thresholdLow"),
			ThresholdMedium: server.get("thresholdMedium"),
			IsPvE: server.get("isPvE"),
			IsCrowdness: server.get("isCrowdness"),
			IsAvailable: server.get("isAvailable"),
			IsEnabled: server.get("isEnabled"),
			UsersOnline: server.get("usersOnline"),
			UsersTotal: server.get("usersTotal"),
			Characters: Number(characters)
		});
	}
];

/**
 * @param {modules} modules
 */
module.exports.KickAccountByUserNo = ({ logger, hub, reportModel, accountModel, serverModel }) => [
	[
		body("userNo").trim().isNumeric()
			.custom(value => accountModel.info.findOne({
				where: { accountDBID: value }
			}).then(data => {
				if (value && data === null) {
					return Promise.reject("Not existing account ID");
				}
				return true;
			})),
		body("serverId").trim().isNumeric()
			.custom(value => serverModel.info.findOne({
				where: { serverId: value }
			}).then(data => {
				if (value && data === null) {
					return Promise.reject("Not existing server ID");
				}
				return true;
			}))
	],
	validationHandler(logger),
	/**
	 * @type {RequestHandler}
	 */
	async (req, res, next) => {
		const { serverId, userNo } = req.body;

		await hub.kickUser(serverId, userNo, 33);

		next();
	},
	writeOperationReport(reportModel),
	/**
	 * @type {RequestHandler}
	 */
	(req, res, next) => {
		res.json({
			Return: true,
			ReturnCode: 0,
			Msg: "success"
		});
	}
];

/**
 * @param {modules} modules
 */
module.exports.KickAllAccountsByServerId = ({ logger, hub, reportModel, serverModel }) => [
	[
		body("serverId").trim().isNumeric()
			.custom(value => serverModel.info.findOne({
				where: { serverId: value }
			}).then(data => {
				if (value && data === null) {
					return Promise.reject("Not existing server ID");
				}
				return true;
			}))
	],
	validationHandler(logger),
	/**
	 * @type {RequestHandler}
	 */
	async (req, res, next) => {
		const { serverId } = req.body;

		await hub.bulkKick(serverId, 33);

		next();
	},
	writeOperationReport(reportModel),
	/**
	 * @type {RequestHandler}
	 */
	(req, res, next) => {
		res.json({
			Return: true,
			ReturnCode: 0,
			Msg: "success"
		});
	}
];