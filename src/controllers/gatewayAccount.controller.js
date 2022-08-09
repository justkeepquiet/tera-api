"use strict";

/**
 * @typedef {import("../app").modules} modules
 * @typedef {import("express").RequestHandler} RequestHandler
 */

const moment = require("moment-timezone");
const query = require("express-validator").query;
const { validationHandler, resultJson } = require("../middlewares/gateway.middlewares");

/**
 * @param {modules} modules
 */
module.exports.GetAccountInfoByUserNo = ({ logger, accountModel }) => [
	[query("userNo").notEmpty()],
	validationHandler(logger),
	/**
	 * @type {RequestHandler}
	 */
	(req, res) => {
		const { userNo } = req.query;

		accountModel.info.findOne({ where: { accountDBID: userNo } }).then(account => {
			if (account === null) {
				return resultJson(res, 50000, "account not exist");
			}

			resultJson(res, 0, "success", {
				UserNo: account.get("accountDBID"),
				UserName: account.get("userName"),
				AuthKey: account.get("authKey"),
				Email: account.get("email"),
				RegisterTime: moment(account.get("registerTime")).unix(),
				LastLoginTime: moment(account.get("lastLoginTime")).unix(),
				LastLoginIP: account.get("lastLoginIP"),
				LastLoginServer: account.get("lastLoginServer"),
				PlayTimeLast: account.get("playTimeLast"),
				PlayTimeTotal: account.get("playTimeTotal"),
				PlayCount: account.get("playCount"),
				Permission: account.get("permission"),
				Privilege: account.get("privilege"),
				Language: account.get("language")
			});
		}).catch(err => {
			logger.error(err);
			resultJson(res, 1, "internal error");
		});
	}
];