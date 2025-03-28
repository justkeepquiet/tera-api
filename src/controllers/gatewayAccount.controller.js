"use strict";

/**
 * @typedef {import("../app").modules} modules
 * @typedef {import("express").RequestHandler} RequestHandler
 */

const moment = require("moment-timezone");
const { query, body } = require("express-validator");
const Op = require("sequelize").Op;
const validator = require("validator");

const Benefit = require("../actions/handlers/benefit");
const helpers = require("../utils/helpers");
const { validationHandler, writeOperationReport } = require("../middlewares/gateway.middlewares");

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
				RegisterTime: moment(account.get("registerTime")).toISOString(),
				LastLoginTime: moment(account.get("lastLoginTime")).toISOString(),
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
		query("userNo").trim().isNumeric(),
		query("serverId").trim().isNumeric()
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
				UserName: character.get("info")?.get("userName") || null,
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
	[query("userNo").trim().isNumeric()],
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
				UserName: benefit.get("info")?.get("userName") || null,
				BenefitId: benefit.get("benefitId"),
				IsAvailable: isAvailable,
				AvailableUntil: moment(benefit.get("availableUntil")).toISOString()
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
		query("userNo").trim().isNumeric()
			.custom(value => accountModel.info.findOne({
				where: { accountDBID: value }
			}).then(data => {
				if (value && data === null) {
					return Promise.reject("Not existing account ID");
				}
				return true;
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
			RegisterTime: moment(account.get("registerTime")).toISOString(),
			LastLoginTime: moment(account.get("lastLoginTime")).toISOString(),
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
		query("userNo").optional().trim().isNumeric()
			.custom(value => accountModel.info.findOne({
				where: { accountDBID: value }
			}).then(data => {
				if (value && data === null) {
					return Promise.reject("Not existing account ID");
				}
				return true;
			})),
		query("clientIP").optional().trim()
	],
	validationHandler(logger),
	/**
	 * @type {RequestHandler}
	 */
	async (req, res, next) => {
		const { clientIP } = req.query;
		let userNo = req.query.userNo;

		const bannedByIp = clientIP ? await accountModel.bans.findOne({
			where: {
				active: 1,
				ip: { [Op.like]: `%"${clientIP}"%` },
				startTime: { [Op.lt]: sequelize.fn("NOW") },
				endTime: { [Op.gt]: sequelize.fn("NOW") }
			}
		}) : null;

		if (!userNo && bannedByIp) {
			userNo = bannedByIp.get("accountDBID");
		}

		const account = userNo ? await accountModel.info.findOne({
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
		}) : null;

		const isBanned = account?.get("banned") !== null || bannedByIp !== null;

		res.json({
			Return: true,
			ReturnCode: 0,
			Msg: "success",
			IsBanned: isBanned,
			UserNo: account?.get("accountDBID") || null,
			Description: account?.get("banned")?.get("description") ?? null,
			Ip: account?.get("banned") ? JSON.parse(account.get("banned").get("ip")) : null,
			StartTime: account?.get("banned") ? moment(account.get("banned").get("startTime")).toISOString() : null,
			EndTime: account?.get("banned") ? moment(account.get("banned").get("endTime")).toISOString() : null
		});
	}
];

/**
 * @param {modules} modules
 */
module.exports.RegisterNewAccount = modules => [
	[
		body("login").trim()
			.isLength({ min: 3, max: 24 }).withMessage("Must contain a string between 3 and 24 characters long")
			.isAlphanumeric().withMessage("Contains an invalid value")
			.custom(value => modules.accountModel.info.findOne({
				where: { userName: value }
			}).then(user => {
				if (user) {
					return Promise.reject("Contains an existing login");
				}
				return true;
			})),
		body("email").trim()
			.isLength({ max: 128 }).withMessage("Should not be more than 128 characters length")
			.isEmail().withMessage("Contains an invalid email")
			.custom(value => modules.accountModel.info.findOne({
				where: { email: value }
			}).then(user => {
				if (user) {
					return Promise.reject("Contains an existing email");
				}
				return true;
			})),
		body("password").trim()
			.isLength({ min: 8, max: 128 }).withMessage("Must contain a string between 8 and 128 characters long")
	],
	validationHandler(modules.logger),
	/**
	 * @type {RequestHandler}
	 */
	async (req, res, next) => {
		const { login, email, password } = req.body;
		const passWord = helpers.getPasswordString(password);

		res.locals.__account = await modules.accountModel.info.create({
			userName: login,
			passWord,
			email,
			language: modules.localization.defaultLanguage
		});

		next();
	},
	writeOperationReport(modules.reportModel),
	/**
	 * @type {RequestHandler}
	 */
	(req, res, next) => {
		res.json({
			Return: true,
			ReturnCode: 0,
			Msg: "success",
			UserNo: res.locals.__account.get("accountDBID")
		});
	}
];

/**
 * @param {modules} modules
 */
module.exports.AddBenefitByUserNo = modules => [
	[
		body("userNo").trim()
			.isInt({ min: 0 }).withMessage("Must contain a valid number")
			.custom(value => modules.accountModel.info.findOne({
				where: { accountDBID: value }
			}).then(data => {
				if (value && data === null) {
					return Promise.reject("Contains not existing account ID");
				}
				return true;
			})),
		body("benefitId").trim()
			.isInt({ min: 0 }).withMessage("Must contain a valid number"),
		body("benefitDays").trim()
			.isInt({ min: 1 }).withMessage("Must contain a valid number")
	],
	validationHandler(modules.logger),
	/**
	 * @type {RequestHandler}
	 */
	async (req, res, next) => {
		const { userNo, benefitId, benefitDays } = req.body;

		const online = await modules.accountModel.online.findOne({
			where: { accountDBID: userNo }
		});

		const serverId = online !== null ? online.get("serverId") : null;
		const benefit = new Benefit(modules, userNo, serverId);

		await benefit.addBenefit(benefitId, benefitDays);

		next();
	},
	writeOperationReport(modules.reportModel),
	/**
	 * @type {RequestHandler}
	 */
	(req, res, next) => {
		res.json({
			Return: true,
			ReturnCode: 0,
			Msg: "success"
		});
	}
];

/**
 * @param {modules} modules
 */
module.exports.RemoveBenefitByUserNo = modules => [
	[
		body("userNo").trim()
			.isInt({ min: 0 }).withMessage("Must contain a valid number")
			.custom(value => modules.accountModel.info.findOne({
				where: { accountDBID: value }
			}).then(data => {
				if (value && data === null) {
					return Promise.reject("Contains not existing account ID");
				}
				return true;
			})),
		body("benefitId").trim()
			.isInt({ min: 0 }).withMessage("Must contain a valid number")
	],
	validationHandler(modules.logger),
	/**
	 * @type {RequestHandler}
	 */
	async (req, res, next) => {
		const { userNo, benefitId } = req.body;

		const online = await modules.accountModel.online.findOne({
			where: { accountDBID: userNo }
		});

		const serverId = online !== null ? online.get("serverId") : null;
		const benefit = new Benefit(modules, userNo, serverId);

		await benefit.removeBenefit(benefitId);

		next();
	},
	writeOperationReport(modules.reportModel),
	/**
	 * @type {RequestHandler}
	 */
	(req, res, next) => {
		res.json({
			Return: true,
			ReturnCode: 0,
			Msg: "success"
		});
	}
];

/**
 * @param {modules} modules
 */
module.exports.BanAccountByUserNo = ({ logger, hub, reportModel, accountModel }) => [
	[
		body("userNo").trim().isNumeric()
			.custom(value => accountModel.bans.findOne({
				where: { accountDBID: value }
			}).then(data => {
				if (value && data !== null) {
					return Promise.reject("Already banned account ID");
				}
				return true;
			}))
			.custom(value => accountModel.info.findOne({
				where: { accountDBID: value }
			}).then(data => {
				if (value && data === null) {
					return Promise.reject("Not existing account ID");
				}
				return true;
			})),
		body("startTime").trim()
			.isISO8601().withMessage("Must contain a valid ISO 8601"),
		body("endTime").trim()
			.isISO8601().withMessage("Must contain a valid ISO 8601"),
		body("ip").optional().trim()
			.custom(value => {
				const ip = helpers.unserializeRange(value);
				return ip.length === 0 || ip.length === ip.filter(e => validator.isIP(e)).length;
			})
			.withMessage("Must contain a valid IP value"),
		body("description").trim()
			.isLength({ min: 1, max: 1024 }).withMessage("Must be between 1 and 1024 characters")
	],
	validationHandler(logger),
	/**
	 * @type {RequestHandler}
	 */
	async (req, res, next) => {
		const { userNo, startTime, endTime, active, ip, description } = req.body;

		const account = await accountModel.info.findOne({
			where: { accountDBID: userNo }
		});

		await accountModel.bans.create({
			accountDBID: account.get("accountDBID"),
			startTime: moment(startTime).toISOString(),
			endTime: moment(endTime).toISOString(),
			active: active == "on",
			ip: JSON.stringify(helpers.unserializeRange(ip)),
			description
		});

		if (account.get("lastLoginServer") && moment(startTime) < moment() && moment(endTime) > moment()) {
			hub.kickUser(account.get("lastLoginServer"), account.get("accountDBID"), 264).catch(err => {
				if (err.resultCode() !== 2) {
					logger.warn(err.toString());
				}
			});
		}

		next();
	},
	writeOperationReport(reportModel),
	/**
	 * @type {RequestHandler}
	 */
	(req, res, next) => {
		res.json({
			Return: true,
			ReturnCode: 0,
			Msg: "success"
		});
	}
];