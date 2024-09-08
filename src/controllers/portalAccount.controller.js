"use strict";

/**
 * @typedef {import("../app").modules} modules
 * @typedef {import("express").RequestHandler} RequestHandler
 */

const body = require("express-validator").body;
const Op = require("sequelize").Op;
const helpers = require("../utils/helpers");

const { validationHandler, resultJson } = require("../middlewares/portalLauncher.middlewares");

const ipFromLauncher = /^true$/i.test(process.env.API_ARBITER_USE_IP_FROM_LAUNCHER);

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
	(req, res) => {
		const { userNo, authKey } = req.body;

		accountModel.info.findOne({
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
		}).then(async account => {
			if (account === null) {
				return resultJson(res, 50000, "account not exist");
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

			resultJson(res, 0, "success", {
				CharacterCount: characterCount,
				Permission: account.get("permission"),
				Privilege: account.get("privilege"),
				Language: account.get("language"),
				UserNo: account.get("accountDBID"),
				UserName: account.get("userName"),
				Banned: account.get("banned") !== null || bannedByIp !== null
			});
		}).catch(err => {
			logger.error(err);
			resultJson(res, 1, "internal error");
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
		body("language").isIn(["cn", "en", "en-US", "fr", "de", "jp", "kr", "ru", "se", "th", "tw"])
	],
	validationHandler(logger),
	/**
	 * @type {RequestHandler}
	 */
	(req, res) => {
		const { userNo, authKey, language } = req.body;

		accountModel.info.findOne({
			where: { accountDBID: userNo, authKey }
		}).then(account => {
			if (account === null) {
				return resultJson(res, 50000, "account not exist");
			}

			return accountModel.info.update({
				language: /^true$/i.test(process.env.API_PORTAL_LOCALE_SELECTOR) ?
					language :
					helpers.regionToLanguage(process.env.API_PORTAL_CLIENT_DEFAULT_REGION),
				...ipFromLauncher ? { lastLoginIP: req.ip } : {}
			}, {
				where: { accountDBID: account.get("accountDBID") }
			}).then(() =>
				resultJson(res, 0, "success")
			);
		}).catch(err => {
			logger.error(err);
			resultJson(res, 1, "internal error");
		});
	}
];