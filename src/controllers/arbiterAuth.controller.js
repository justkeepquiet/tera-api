"use strict";

/**
 * @typedef {import("express").RequestHandler} RequestHandler
 * @typedef {import("express").ErrorRequestHandler} ErrorRequestHandler
 * @typedef {import("../app").modules} modules
 */

const body = require("express-validator").body;
const Op = require("sequelize").Op;

const env = require("../utils/env");
const ApiError = require("../lib/apiError");
const { validationHandler } = require("../middlewares/arbiterAuth.middlewares");

const ipFromLauncher = env.bool("API_ARBITER_USE_IP_FROM_LAUNCHER");

/**
 * endpoint: /systemApi/RequestAPIServerStatusAvailable
 * @param {modules} modules
 */
module.exports.RequestAPIServerStatusAvailable = ({ logger, serverModel }) => [
	/**
	 * @type {RequestHandler}
	 */
	async (req, res, next) => {
		await serverModel.info.update({ isAvailable: 0, usersOnline: 0 }, {
			where: { isEnabled: 1 }
		});

		res.json({
			Return: true,
			ReturnCode: 0,
			Msg: "success"
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
	async (req, res, next) => {
		const { clientIP, userNo } = req.body;

		const account = await accountModel.info.findOne({ where: { accountDBID: userNo } });

		if (account === null) {
			throw new ApiError("account not exist", 50000);
		}

		res.json({
			Return: true,
			ReturnCode: 0,
			Msg: "success",
			Tokken: account.get("authKey")
		});
	}
];

/**
 * endpoint: /authApi/GameAuthenticationLogin
 * @param {modules} modules
 */
module.exports.GameAuthenticationLogin = ({ logger, sequelize, accountModel }) => [
	[body("authKey").notEmpty(), body("userNo").isNumeric()],
	validationHandler(logger),
	/**
	 * @type {RequestHandler}
	 */
	async (req, res, next) => {
		const { authKey, clientIP, userNo } = req.body;

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

		if (account === null) {
			throw new ApiError("account not exist", 50000);
		}

		if (account.get("authKey") !== authKey) {
			throw new ApiError("authkey mismatch", 50011);
		}

		const ip = ipFromLauncher ? account.get("lastLoginIP") : clientIP;

		const bannedByIp = await accountModel.bans.findOne({
			where: {
				active: 1,
				ip: { [Op.like]: `%"${ip}"%` },
				startTime: { [Op.lt]: sequelize.fn("NOW") },
				endTime: { [Op.gt]: sequelize.fn("NOW") }
			}
		});

		if (account.get("banned") !== null || bannedByIp !== null) {
			throw new ApiError("account banned", 50012);
		}

		res.json({
			Return: true,
			ReturnCode: 0,
			Msg: "success"
		});
	}
];