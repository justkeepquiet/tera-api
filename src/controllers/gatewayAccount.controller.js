"use strict";

/**
 * @typedef {import("../app").modules} modules
 * @typedef {import("express").RequestHandler} RequestHandler
 */

const moment = require("moment-timezone");
const query = require("express-validator").query;
const Op = require("sequelize").Op;

const { validationHandler } = require("../middlewares/gateway.middlewares");

/**
 * @param {modules} modules
 */
module.exports.ListAccounts = ({ accountModel }) => [
	/**
	 * @type {RequestHandler}
	 */
	async (req, res, next) => {
		const accounts = await accountModel.info.findAll();

		const data = [];

		accounts.forEach(account => {
			data.push({
				UserNo: account.get("accountDBID"),
				UserName: account.get("userName"),
				AuthKey: account.get("authKey"),
				Email: account.get("email"),
				RegisterTime: account.get("registerTime"),
				LastLoginTime: account.get("lastLoginTime"),
				LastLoginIP: account.get("lastLoginIP"),
				LastLoginServer: account.get("lastLoginServer"),
				PlayTimeLast: account.get("playTimeLast"),
				PlayTimeTotal: account.get("playTimeTotal"),
				PlayCount: account.get("playCount"),
				Permission: account.get("permission"),
				Privilege: account.get("privilege"),
				Language: account.get("language")
			});
		});

		res.json({
			Return: true,
			ReturnCode: 0,
			Msg: "success",
			Accounts: data
		});
	}
];

/**
 * @param {modules} modules
 */
module.exports.ListCharactersByUserNo = ({ logger, accountModel }) => [
	[
		query("serverId").isNumeric(),
		query("userNo").isNumeric()
	],
	validationHandler(logger),
	/**
	 * @type {RequestHandler}
	 */
	async (req, res, next) => {
		const { serverId, userNo } = req.query;

		const characters = await accountModel.characters.findAll({
			where: {
				serverId,
				accountDBID: userNo
			},
			include: [
				{
					as: "info",
					model: accountModel.info,
					required: false,
					attributes: ["userName"]
				}
			]
		});

		const data = [];

		characters.forEach(character => {
			data.push({
				UserNo: character.get("accountDBID"),
				UserName: character.get("info")?.get("userName"),
				ServerId: character.get("serverId"),
				Id: character.get("characterId"),
				Name: character.get("name"),
				Level: character.get("level"),
				RaceId: character.get("raceId"),
				GenderId: character.get("genderId"),
				ClassId: character.get("classId")
			});
		});

		res.json({
			Return: true,
			ReturnCode: 0,
			Msg: "success",
			Characters: data
		});
	}
];

/**
 * @param {modules} modules
 */
module.exports.ListBenefitsByUserNo = ({ logger, accountModel }) => [
	[query("userNo").isNumeric()],
	validationHandler(logger),
	/**
	 * @type {RequestHandler}
	 */
	async (req, res, next) => {
		const { userNo } = req.query;

		const benefits = await accountModel.benefits.findAll({
			where: { accountDBID: userNo },
			include: [{
				as: "info",
				model: accountModel.info,
				required: false,
				attributes: ["userName"]
			}]
		});

		const data = [];

		benefits.forEach(benefit => {
			const isAvailable = moment(benefit.get("availableUntil")) > moment();

			data.push({
				UserNo: benefit.get("accountDBID"),
				UserName: benefit.get("info")?.get("userName"),
				BenefitId: benefit.get("benefitId"),
				IsAvailable: isAvailable,
				AvailableUntil: benefit.get("availableUntil")
			});
		});

		res.json({
			Return: true,
			ReturnCode: 0,
			Msg: "success",
			Benefits: data
		});
	}
];

/**
 * @param {modules} modules
 */
module.exports.GetAccountInfoByUserNo = ({ logger, accountModel }) => [
	[
		query("userNo").isNumeric()
			.custom(value => accountModel.info.findOne({
				where: { accountDBID: value }
			}).then(data => {
				if (value && data === null) {
					return Promise.reject("Not existing account ID");
				}
			}))
	],
	validationHandler(logger),
	/**
	 * @type {RequestHandler}
	 */
	async (req, res, next) => {
		const { userNo } = req.query;

		const account = await accountModel.info.findOne({
			where: { accountDBID: userNo }
		});

		res.json({
			Return: true,
			ReturnCode: 0,
			Msg: "success",
			UserNo: account.get("accountDBID"),
			UserName: account.get("userName"),
			AuthKey: account.get("authKey"),
			Email: account.get("email"),
			RegisterTime: account.get("registerTime"),
			LastLoginTime: account.get("lastLoginTime"),
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
		query("userNo").isNumeric()
			.custom(value => accountModel.info.findOne({
				where: { accountDBID: value }
			}).then(data => {
				if (value && data === null) {
					return Promise.reject("Not existing account ID");
				}
			})),
		query("clientIP").isNumeric()
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

		const isBanned = account.get("banned") !== null || bannedByIp !== null;

		res.json({
			Return: true,
			ReturnCode: 0,
			Msg: "success",
			UserNo: account.get("accountDBID"),
			Banned: isBanned
		});
	}
];