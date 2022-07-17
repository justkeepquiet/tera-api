"use strict";

/**
 * @typedef {import("../app").modules} modules
 * @typedef {import("express").RequestHandler} RequestHandler
 */

const body = require("express-validator").body;
const Op = require("sequelize").Op;
const helpers = require("../utils/helpers");

const { validationHandler, resultJson } = require("../middlewares/portalLauncher.middlewares");

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
		const clientIP = req.headers["x-forwarded-for"] || req.socket.remoteAddress;

		accountModel.info.belongsTo(accountModel.bans, { foreignKey: "accountDBID" });
		accountModel.info.hasOne(accountModel.bans, { foreignKey: "accountDBID" });

		accountModel.info.findOne({
			where: { accountDBID: userNo, authKey },
			include: [{
				model: accountModel.bans,
				where: {
					active: 1,
					startTime: { [Op.lt]: sequelize.fn("NOW") },
					endTime: { [Op.gt]: sequelize.fn("NOW") }
				},
				required: false,
				attributes: []
			}],
			attributes: {
				include: [
					[sequelize.col("startTime"), "banned"]
				]
			}
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

				if (characters !== null) {
					characterCount = helpers.getCharCountString(characters, account.get("lastLoginServer"), "serverId", "charCount");
				}

				bannedByIp = await accountModel.bans.findOne({
					where: {
						active: 1,
						ip: { [Op.like]: `%"${clientIP}"%` },
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
				Banned: !!account.get("banned") || bannedByIp !== null
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
		body("language").isIn(["cn", "en", "fr", "de", "jp", "ru", "se", "th", "tw"])
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

			return accountModel.info.update({ language }, {
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