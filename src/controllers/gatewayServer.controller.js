"use strict";

/**
 * @typedef {import("../app").modules} modules
 * @typedef {import("express").RequestHandler} RequestHandler
 */

const query = require("express-validator").query;
const { validationHandler, resultJson } = require("../middlewares/gateway.middlewares");

/**
 * @param {modules} modules
 */
module.exports.GetServerInfoByServerId = ({ logger, serverModel, accountModel }) => [
	[query("serverId").notEmpty()],
	validationHandler(logger),
	/**
	 * @type {RequestHandler}
	 */
	(req, res) => {
		const { serverId } = req.query;

		serverModel.info.findOne({ where: { serverId: serverId } }).then(server => {
			if (server === null) {
				return resultJson(res, 50000, "server not exist");
			}

			return accountModel.characters.count({ where: { serverId: serverId } }).then(characters =>
				resultJson(res, 0, "success", {
					ServerId: server.get("serverId"),
					LoginIp: server.get("loginIp"),
					LoginPort: server.get("loginPort"),
					Language: server.get("language"),
					NameString: server.get("nameString"),
					DescrString: server.get("descrString"),
					Permission: server.get("permission"),
					TresholdLow: server.get("tresholdLow"),
					TresholdMedium: server.get("tresholdMedium"),
					IsPvE: server.get("isPvE"),
					IsCrowdness: server.get("isCrowdness"),
					IsAvailable: server.get("isAvailable"),
					IsEnabled: server.get("isEnabled"),
					UsersOnline: server.get("usersOnline"),
					UsersTotal: server.get("usersTotal"),
					Characters: Number(characters)
				})
			);
		}).catch(err => {
			logger.error(err);
			resultJson(res, 1, "internal error");
		});
	}
];