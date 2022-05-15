"use strict";

const body = require("express-validator").body;
const logger = require("../utils/logger");
const helpers = require("../utils/helpers");
const accountModel = require("../models/account.model");

module.exports = {
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

	GameAuthenticationLogin: [
		[body("authKey").notEmpty(), body("userNo").notEmpty()],
		/**
		 * @type {import("express").RequestHandler}
		 */
		(req, res) => {
			if (!helpers.validationResultLog(req).isEmpty()) {
				return res.json({
					Return: false,
					ReturnCode: 2,
					Msg: "invalid parameter"
				});
			}

			const { authKey, clientIP, userNo } = req.body;

			accountModel.info.findOne({ where: { accountDBID: userNo } }).then(account => {
				if (account.get("permission") > 0) { // @todo
					res.json({
						Return: false,
						ReturnCode: 50010,
						Msg: "account banned"
					});
				} else if (account.get("authKey") !== authKey) {
					res.json({
						Return: false,
						ReturnCode: 50011,
						Msg: "authkey mismatch"
					});
				} else {
					res.json({
						Return: true,
						ReturnCode: 0,
						Msg: "success",
						UserID: account.get("accountDBID"),
						AuthKey: account.get("authKey"),
						UserNo: account.get("accountDBID"),
						UserType: "PURCHASE",
						isUsedOtp: false
					});
				}
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