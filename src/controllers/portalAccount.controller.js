"use strict";

/**
 * @typedef {import("express").RequestHandler} RequestHandler
 * @typedef {import("../app").modules} modules
 */

const body = require("express-validator").body;
const Op = require("sequelize").Op;

const env = require("../utils/env");
const helpers = require("../utils/helpers");
const ApiError = require("../lib/apiError");
const { validationHandler } = require("../middlewares/portalLauncher.middlewares");

const ipFromLauncher = env.bool("API_ARBITER_USE_IP_FROM_LAUNCHER");

/**
 * @param {modules} modules
 */
module.exports.GetAccountInfoByUserNo = ({ logger, sequelize, accountModel }) => [
	[
		body("userNo").notEmpty(),
		body("authKey").notEmpty()
	],
	validationHandler(logger),
	/**
	 * @type {RequestHandler}
	 */
	async (req, res, next) => {
		const { userNo, authKey } = req.body;

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

		let lastLoginServer = 0;
		let characterCount = "0";
		let bannedByIp = null;

		try {
			const characters = await accountModel.characters.findAll({
				attributes: ["serverId", [sequelize.fn("COUNT", "characterId"), "charCount"]],
				group: ["serverId"],
				where: { accountDBID: account.get("accountDBID") }
			});

			if (!env.bool("API_PORTAL_DISABLE_CLIENT_AUTO_ENTER")) {
				lastLoginServer = account.get("lastLoginServer");
			}

			characterCount = helpers.getCharCountString(characters, lastLoginServer, "serverId", "charCount");

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

/**
 * @param {modules} modules
 */
module.exports.SetAccountInfoByUserNo = ({ logger, accountModel }) => [
	[
		body("userNo").notEmpty(),
		body("authKey").notEmpty(),
		body("language")
			.isIn(["cn", "en", "en-US", "fr", "de", "jp", "kr", "ru", "se", "th", "tw"])
			.custom(value => {
				if (helpers.getClientLocales().every(locale => locale !== value)) {
					return Promise.reject("language code not allowed");
				}
				return Promise.resolve();
			})
	],
	validationHandler(logger),
	/**
	 * @type {RequestHandler}
	 */
	async (req, res, next) => {
		const { userNo, authKey, language } = req.body;

		const account = await accountModel.info.findOne({
			where: { accountDBID: userNo, authKey }
		});

		if (account === null) {
			throw new ApiError("account not exist", 50000);
		}

		await accountModel.info.update({
			language: env.bool("API_PORTAL_LOCALE_SELECTOR") ?
				language :
				helpers.regionToLanguage(env.string("API_PORTAL_CLIENT_DEFAULT_REGION")),
			...ipFromLauncher ? { lastLoginIP: req.ip } : {}
		}, {
			where: { accountDBID: account.get("accountDBID") }
		});

		res.json({
			Return: true,
			ReturnCode: 0,
			Msg: "success"
		});
	}
];