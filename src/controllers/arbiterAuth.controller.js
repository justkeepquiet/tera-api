"use strict";

const body = require("express-validator").body;
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

// endpoint: /systemApi/RequestAPIServerStatusAvailable
module.exports.RequestAPIServerStatusAvailable = [
	/**
	 * @type {import("express").RequestHandler}
	 */
	(req, res) => {
		accountModel.serverInfo.update({ isAvailable: 0, usersOnline: 0 }, {
			where: { isEnabled: 1 }
		}).then(() =>
			res.json({ Return: true })
		).catch(err => {
			logger.error(err.toString());
			res.json({ Return: false });
		});
	}
];

// endpoint: /authApi/RequestAuthkey
module.exports.RequestAuthkey = [
	[body("clientIP").notEmpty(), body("userNo").isNumeric()],
	validationHandler,
	/**
	 * @type {import("express").RequestHandler}
	 */
	(req, res) => {
		const { clientIP, userNo } = req.body;

		accountModel.info.findOne({ where: { accountDBID: userNo } }).then(async account => {
			if (account === null) {
				return result(res, 50000, "account not exist");
			}

			result(res, 0, "success", {
				Tokken: account.get("authKey")
			});
		}).catch(err => {
			logger.error(err.toString());
			result(res, 50000, "account not exist");
		});
	}
];

// endpoint: /authApi/GameAuthenticationLogin
module.exports.GameAuthenticationLogin = [
	[body("authKey").notEmpty(), body("userNo").isNumeric()],
	validationHandler,
	/**
	 * @type {import("express").RequestHandler}
	 */
	(req, res) => {
		const { authKey, clientIP, userNo } = req.body;

		accountModel.info.findOne({ where: { accountDBID: userNo } }).then(account => {
			if (account === null) {
				return result(res, 50000, "account not exist");
			}

			if (account.get("permission") == 1) { // @todo
				return result(res, 50010, "account banned");
			}

			if (account.get("authKey") !== authKey) {
				return result(res, 50011, "authkey mismatch");
			}

			result(res, 0, "success");
		}).catch(err => {
			logger.error(err.toString());
			result(res, 50000, "account not exist");
		});
	}
];