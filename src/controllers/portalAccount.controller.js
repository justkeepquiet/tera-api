"use strict";

/**
 * @typedef {import("express").RequestHandler} RequestHandler
 * @typedef {import("../app").modules} modules
 */

const query = require("express-validator").query;
const Op = require("sequelize").Op;

const helpers = require("../utils/helpers");
const ApiError = require("../lib/apiError");
const { validationHandler } = require("../middlewares/portalLauncher.middlewares");

/**
 * @param {modules} modules
 */
module.exports.GetAccountInfoByUserNo = ({ logger, sequelize, accountModel }) => [
	[
		query("userNo").notEmpty(),
		query("authKey").notEmpty()
	],
	validationHandler(logger),
	/**
	 * @type {RequestHandler}
	 */
	async (req, res, next) => {
		const { userNo, authKey } = req.query;

		const account = await accountModel.info.findOne({
			where: { accountDBID: userNo, authKey },
			include: [{
				as: "banned",
				model: accountModel.bans,
				where: {
					active: 1,
					startTime: { [Op.lt]: sequelize.fn("NOW") },
					endTime: { [Op.gt]: sequelize.fn("NOW") }
				},
				required: false
			}]
		});

		if (account === null) {
			throw new ApiError("account not exist", 50000);
		}

		let characterCount = "0";
		let bannedByIp = null;

		try {
			const characters = await accountModel.characters.findAll({
				attributes: ["serverId", [sequelize.fn("COUNT", "characterId"), "charCount"]],
				group: ["serverId"],
				where: { accountDBID: account.get("accountDBID") }
			});

			characterCount = helpers.getCharCountString(characters, account.get("lastLoginServer"), "serverId", "charCount");

			bannedByIp = await accountModel.bans.findOne({
				where: {
					active: 1,
					ip: { [Op.like]: `%"${req.ip}"%` },
					startTime: { [Op.lt]: sequelize.fn("NOW") },
					endTime: { [Op.gt]: sequelize.fn("NOW") }
				}
			});
		} catch (err) {
			logger.error(err);
		}

		res.json({
			Return: true,
			ReturnCode: 0,
			Msg: "success",
			CharacterCount: characterCount,
			Permission: account.get("permission"),
			Privilege: account.get("privilege"),
			Language: account.get("language"),
			UserNo: account.get("accountDBID"),
			UserName: account.get("userName"),
			Banned: account.get("banned") !== null || bannedByIp !== null
		});
	}
];