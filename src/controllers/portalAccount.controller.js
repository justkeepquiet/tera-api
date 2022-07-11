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
module.exports.GetAccountInfoByAuthKey = ({ logger, accountModel }) => [
	[body("authKey").notEmpty()],
	validationHandler(logger),
	/**
	 * @type {RequestHandler}
	 */
	(req, res) => {
		const { authKey } = req.body;

		accountModel.info.belongsTo(accountModel.bans, { foreignKey: "accountDBID" });
		accountModel.info.hasOne(accountModel.bans, { foreignKey: "accountDBID" });

		accountModel.info.findOne({
			where: { authKey },
			include: [{
				model: accountModel.bans,
				where: {
					startTime: { [Op.lt]: accountModel.sequelize.fn("NOW") },
					endTime: { [Op.gt]: accountModel.sequelize.fn("NOW") }
				},
				required: false,
				attributes: []
			}],
			attributes: {
				include: [
					[accountModel.info.sequelize.col("startTime"), "banned"]
				]
			}
		}).then(async account => {
			if (account === null) {
				return resultJson(res, 50000, "account not exist");
			}

			let characterCount = "0";

			try {
				const characters = await accountModel.characters.findAll({
					attributes: ["serverId", [accountModel.characters.sequelize.fn("COUNT", "characterId"), "charCount"]],
					group: ["serverId"],
					where: { accountDBID: account.get("accountDBID") }
				});

				if (characters !== null) {
					characterCount = helpers.getCharCountString(characters, account.get("lastLoginServer"), "serverId", "charCount");
				}
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
				Banned: !!account.get("banned")
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
module.exports.SetAccountInfoByAuthKey = ({ logger, accountModel }) => [
	[
		body("authKey").notEmpty(),
		body("language").isIn(["cn", "en", "fr", "de", "jp", "ru", "se", "th", "tw"])
	],
	validationHandler(logger),
	/**
	 * @type {RequestHandler}
	 */
	(req, res) => {
		const { authKey, language } = req.body;

		accountModel.info.findOne({
			where: { authKey }
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