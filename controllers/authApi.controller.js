/* eslint-disable no-unused-vars */
"use strict";

const accountModel = require("../models/account.model");

class AuthApiController {
	/**
	 * @type {import("express").RequestHandler}
	 */
	static gameAuthenticationLogin(req, res) {
		const { authKey, clientIP, userNo } = req.body;

		if (!authKey || !userNo) {
			return res.json({
				"Return": false,
				"ReturnCode": 2,
				"Msg": `authKey=${authKey}&userNo=${userNo}`
			});
		}

		accountModel.info.findOne({
			"where": {
				"accountDBID": userNo
			}
		}).then(account => {
			if (account.get("isBlocked") > 0) {
				res.json({
					"Return": false,
					"ReturnCode": 50010,
					"Msg": "account banned"
				});
			} else if (account.get("authKey") !== authKey) {
				res.json({
					"Return": false,
					"ReturnCode": 50011,
					"Msg": "authkey mismatch"
				});
			} else {
				res.json({
					"Return": true,
					"ReturnCode": 0,
					"Msg": "success",
					"UserID": account.get("accountDBID"),
					"AuthKey": account.get("authKey"),
					"UserNo": account.get("accountDBID"),
					"UserType": "PURCHASE",
					"isUsedOtp": false
				});
			}
		}).catch(() =>
			res.json({
				"Return": false,
				"ReturnCode": 50000,
				"Msg": "account not exist"
			})
		);
	}
}

module.exports = AuthApiController;