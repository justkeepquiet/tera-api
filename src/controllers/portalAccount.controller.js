"use strict";

const body = require("express-validator").body;
const crypto = require("crypto");
const uuid = require("uuid");
const logger = require("../utils/logger");
const helpers = require("../utils/helpers");
const accountModel = require("../models/account.model");

/**
 * @param {import("express").Response} res
 */
const result = (res, code, message, params = {}) => res.json({
	Return: code === 0, ReturnCode: code, Msg: message, ...params
});

/**
 * @type {import("express").RequestHandler}
 */
const validationHandler = (req, res, next) => {
	if (!helpers.validationResultLog(req).isEmpty()) {
		return result(res, 2, "invalid parameter");
	}

	next();
};

module.exports = {
	ActionLogin: [
		[body("userID").notEmpty(), body("password").notEmpty()],
		validationHandler,
		/**
		 * @type {import("express").RequestHandler}
		 */
		(req, res) => {
			const { userID, password } = req.body;

			accountModel.info.findOne({ where: { userName: userID } }).then(account => {
				let passwordString = password;

				if (/^true$/i.test(process.env.API_USE_SHA512_PASSWORDS)) {
					passwordString = crypto.createHash("sha512").update(process.env.API_USE_SHA512_PASSWORDS_SALT + password).digest("hex");
				}

				if (account === null || account.get("passWord") !== passwordString) {
					logger.warn("Invalid login or password");
					return result(res, 50015, "password error");
				}

				const authKey = uuid.v4();

				accountModel.info.update({ authKey: authKey }, {
					where: { accountDBID: account.get("accountDBID") }
				}).then(async () => {
					let characterCount = "0";

					try {
						const characters = await accountModel.characters.findAll({
							where: { accountDBID: account.get("accountDBID") }
						});

						characterCount = helpers.getCharCountString(characters, "serverId", "charCount");
					} catch (err) {
						logger.error(err.toString());
					}

					result(res, 0, "success", {
						CharacterCount: characterCount,
						Permission: account.get("permission"),
						UserNo: account.get("accountDBID"),
						AuthKey: authKey
					});
				}).catch(err => {
					logger.error(err.toString());
					result(res, 50811, "failure update auth token");
				});
			}).catch(err => {
				logger.error(err.toString());
				result(res, 50000, "account not exist");
			});
		}
	],

	ActionLogout: [
		[body("authKey").notEmpty(), body("userNo").notEmpty().isNumeric()],
		validationHandler,
		/**
		 * @type {import("express").RequestHandler}
		 */
		(req, res) => {
			const { authKey, userNo } = req.body;

			accountModel.info.findOne({
				where: { accountDBID: userNo, authKey: authKey }
			}).then(account => {
				if (account === null) {
					return result(res, 50000, "account not exist");
				}

				accountModel.info.update({ authKey: null }, {
					where: { accountDBID: account.get("accountDBID") }
				}).then(() =>
					result(res, 0, "success")
				).catch(err => {
					logger.error(err.toString());
					result(res, 50811, "failure update auth token");
				});
			}).catch(err => {
				logger.error(err.toString());
				result(res, 50000, "account not exist");
			});
		}
	],

	GetAccountInfo: [
		[body("id").notEmpty().isNumeric()],
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
						where: { accountDBID: account.get("accountDBID") }
					});

					characterCount = helpers.getCharCountString(characters, "serverId", "charCount");
				} catch (err) {
					logger.error(err.toString());
				}

				result(res, 0, "success", {
					CharacterCount: characterCount,
					Permission: account.get("permission")
				});
			}).catch(err => {
				logger.error(err.toString());
				result(res, 50000, "account not exist");
			});
		}
	]
};