"use strict";

/**
 * @typedef {import("../app").modules} modules
 * @typedef {import("express").RequestHandler} RequestHandler
 */

const moment = require("moment-timezone");
const query = require("express-validator").query;
const Op = require("sequelize").Op;

const ApiError = require("../lib/apiError");
const { validationHandler } = require("../middlewares/gateway.middlewares");

/**
 * @param {modules} modules
 */
module.exports.GetAccountInfoByUserNo = ({ logger, accountModel }) => [
	[query("userNo").notEmpty()],
	validationHandler(logger),
	/**
	 * @type {RequestHandler}
	 */
	async (req, res, next) => {
		const { userNo } = req.query;

		const account = await accountModel.info.findOne({
			where: { accountDBID: userNo }
		});

		if (account === null) {
			throw ApiError("account not exist", 50000);
		}

		res.json({
			Return: true,
			ReturnCode: 0,
			Msg: "success",
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
	}
];

/**
 * @param {modules} modules
 */
module.exports.GetAccountBanByUserNo = ({ logger, sequelize, accountModel }) => [
	[
		query("userNo").notEmpty(),
		query("clientIP").notEmpty()
	],
	validationHandler(logger),
	/**
	 * @type {RequestHandler}
	 */
	async (req, res, next) => {
		const { userNo, clientIP } = req.query;

		const account = await accountModel.info.findOne({
			where: { accountDBID: userNo },
			include: [{
				as: "banned",
				model: accountModel.bans,
				where: {
					active: 1,
					startTime: { [Op.lt]: sequelize.fn("NOW") },
					endTime: { [Op.gt]: sequelize.fn("NOW") }
				},
				required: false
			}]
		});

		const bannedByIp = await accountModel.bans.findOne({
			where: {
				active: 1,
				ip: { [Op.like]: `%"${clientIP}"%` },
				startTime: { [Op.lt]: sequelize.fn("NOW") },
				endTime: { [Op.gt]: sequelize.fn("NOW") }
			}
		});

		if (account === null) {
			throw ApiError("account not exist", 50000);
		}

		const isBanned = account.get("banned") !== null || bannedByIp !== null;

		res.json({
			Return: true,
			ReturnCode: 0,
			Msg: "success",
			Banned: isBanned
		});
	}
];