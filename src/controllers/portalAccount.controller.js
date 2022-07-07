"use strict";

/**
 * @typedef {import("../app").modules} modules
 * @typedef {import("express").RequestHandler} RequestHandler
 */

const body = require("express-validator").body;
const helpers = require("../utils/helpers");

const { validationHandler, resultJson } = require("../middlewares/portalLauncher.middlewares");

/**
 * @param {modules} modules
 */
module.exports.GetAccountInfo = ({ logger, accountModel }) => [
	[body("id").isNumeric()],
	validationHandler(logger),
	/**
	 * @type {RequestHandler}
	 */
	(req, res) => {
		const { id } = req.body;

		accountModel.info.findOne({ where: { accountDBID: id } }).then(async account => {
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
				UserNo: account.get("accountDBID"),
				UserName: account.get("userName")
			});
		}).catch(err => {
			logger.error(err);
			resultJson(res, 1, "internal error");
		});
	}
];