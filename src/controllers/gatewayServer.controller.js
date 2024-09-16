"use strict";

/**
 * @typedef {import("../app").modules} modules
 * @typedef {import("express").RequestHandler} RequestHandler
 */

const query = require("express-validator").query;

const ApiError = require("../lib/apiError");
const { validationHandler } = require("../middlewares/gateway.middlewares");

/**
 * @param {modules} modules
 */
module.exports.GetServerInfoByServerId = ({ logger, serverModel, accountModel }) => [
	[query("serverId").notEmpty()],
	validationHandler(logger),
	/**
	 * @type {RequestHandler}
	 */
	async (req, res, next) => {
		const { serverId } = req.query;

		const server = await serverModel.info.findOne({
			where: { serverId: serverId }
		});

		if (server === null) {
			throw ApiError("server not exist", 50000);
		}

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