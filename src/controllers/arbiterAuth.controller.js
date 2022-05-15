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
		return res.json({
			Return: false,
			ReturnCode: 2,
			Msg: "invalid parameter"
		});
	}

	next();
};

module.exports = {
	// endpoint: /systemApi/RequestAPIServerStatusAvailable
	RequestAPIServerStatusAvailable: [
		/**
		 * @type {import("express").RequestHandler}
		 */
		(req, res) => {
			accountModel.sequelize.authenticate().then(() =>
				res.json({ Return: true })
			).catch(err => {
				logger.error(err.toString());
				res.json({ Return: false });
			});
		}
	],

	// endpoint: /authApi/GameAuthenticationLogin
	GameAuthenticationLogin: [
		[body("authKey").notEmpty(), body("userNo").notEmpty().isNumeric()],
		validationHandler,
		/**
		 * @type {import("express").RequestHandler}
		 */
		(req, res) => {
			const { authKey, clientIP, userNo } = req.body;

			accountModel.info.findOne({ where: { accountDBID: userNo } }).then(account => {
				if (account === null) {
					return res.json({
						Return: false,
						ReturnCode: 50000,
						Msg: "account not exist"
					});
				}

				if (account.get("permission") > 0) { // @todo
					return res.json({
						Return: false,
						ReturnCode: 50010,
						Msg: "account banned"
					});
				}

				if (account.get("authKey") !== authKey) {
					return res.json({
						Return: false,
						ReturnCode: 50011,
						Msg: "authkey mismatch"
					});
				}

				res.json({
					Return: true,
					ReturnCode: 0,
					Msg: "success"
				});
			}).catch(err => {
				logger.error(err.toString());
				res.json({
					Return: false,
					ReturnCode: 50000,
					Msg: "account not exist"
				});
			});
		}
	]
};