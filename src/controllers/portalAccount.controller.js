"use strict";

const body = require("express-validator").body;
const logger = require("../utils/logger");
const helpers = require("../utils/helpers");
const accountModel = require("../models/account.model");

/**
 * @type {import("express").RequestHandler}
 */
const validationHandler = (req, res, next) => {
	if (!helpers.validationResultLog(req).isEmpty()) {
		return result(res, 2, "invalid parameter");
	}

	next();
};

/**
 * @param {import("express").Response} res
 */
const result = (res, code, message, params = {}) => res.json({
	Return: code === 0, ReturnCode: code, Msg: message, ...params
});

module.exports.GetAccountInfo = [
	[body("id").isNumeric()],
	validationHandler,
	/**
	 * @type {import("express").RequestHandler}
	 */
	(req, res) => {
		const { id } = req.body;

		accountModel.info.findOne({ where: { accountDBID: id } }).then(async account => {
			if (account === null) {
				return result(res, 50000, "account not exist");
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
				logger.error(err.toString());
			}

			result(res, 0, "success", {
				CharacterCount: characterCount,
				Permission: account.get("permission"),
				Privilege: account.get("privilege"),
				UserNo: account.get("accountDBID"),
				UserName: account.get("userName")
			});
		}).catch(err => {
			logger.error(err.toString());
			result(res, 1, "internal error");
		});
	}
];