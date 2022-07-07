"use strict";

/**
 * @typedef {import("../app").modules} modules
 * @typedef {import("express").RequestHandler} RequestHandler
 */

const body = require("express-validator").body;

const { validationHandler, resultJson } = require("../middlewares/arbiterAuth.middlewares");

/**
 * endpoint: /systemApi/RequestAPIServerStatusAvailable
 * @param {modules} modules
 */
module.exports.RequestAPIServerStatusAvailable = ({ logger, accountModel }) => [
	/**
	 * @type {RequestHandler}
	 */
	(req, res) => {
		accountModel.serverInfo.update({ isAvailable: 0, usersOnline: 0 }, {
			where: { isEnabled: 1 }
		}).then(() =>
			res.json({ Return: true })
		).catch(err => {
			logger.error(err);
			res.json({ Return: false });
		});
	}
];

/**
 * endpoint: /authApi/RequestAuthkey
 * @param {modules} modules
 */
module.exports.RequestAuthkey = ({ logger, accountModel }) => [
	[body("clientIP").notEmpty(), body("userNo").isNumeric()],
	validationHandler(logger),
	/**
	 * @type {RequestHandler}
	 */
	(req, res) => {
		const { clientIP, userNo } = req.body;

		accountModel.info.findOne({ where: { accountDBID: userNo } }).then(account => {
			if (account === null) {
				return resultJson(res, 50000, "account not exist");
			}

			resultJson(res, 0, "success", {
				Tokken: account.get("authKey")
			});
		}).catch(err => {
			logger.error(err);
			resultJson(res, 1, "internal error");
		});
	}
];

/**
 * endpoint: /authApi/GameAuthenticationLogin
 * @param {modules} modules
 */
module.exports.GameAuthenticationLogin = ({ logger, accountModel }) => [
	[body("authKey").notEmpty(), body("userNo").isNumeric()],
	validationHandler(logger),
	/**
	 * @type {RequestHandler}
	 */
	(req, res) => {
		const { authKey, clientIP, userNo } = req.body;

		accountModel.info.findOne({ where: { accountDBID: userNo } }).then(account => {
			if (account === null) {
				return resultJson(res, 50000, "account not exist");
			}

			if (account.get("permission") == 1) { // @todo
				return resultJson(res, 50010, "account banned");
			}

			if (account.get("authKey") !== authKey) {
				return resultJson(res, 50011, "authkey mismatch");
			}

			resultJson(res, 0, "success");
		}).catch(err => {
			logger.error(err);
			resultJson(res, 1, "internal error");
		});
	}
];