"use strict";

const body = require("express-validator").body;
const moment = require("moment-timezone");
const logger = require("../utils/logger");
const helpers = require("../utils/helpers");
const accountModel = require("../models/account.model");
const reportModel = require("../models/report.model");
const ChronoScrollActions = require("../actions/chronoScroll.actions");

/**
 * @param {import("express").Response} res
 */
const result = (res, code, params = {}) => res.json({
	result_code: code, ...params
});

/**
 * @type {import("express").RequestHandler}
 */
const validationHandler = (req, res, next) => {
	if (!helpers.validationResultLog(req).isEmpty()) {
		return result(res, 2, { msg: "invalid parameter" });
	}

	next();
};

module.exports = {
	ServiceTest: [
		/**
		 * @type {import("express").RequestHandler}
		 */
		(req, res) => {
			accountModel.sequelize.authenticate().then(() =>
				result(res, 0, { server_time: Date.now() / 1000 })
			).catch(err => {
				logger.error(err.toString());
				result(res, 1, { msg: "database error" });
			});
		}
	],

	GetServerPermission: [
		/**
		 * @type {import("express").RequestHandler}
		 */
		(req, res) => {
			// @todo
			result(res, 0, { permission: 0 });
		}
	],

	ServerDown: [
		[body("server_id").notEmpty().isNumeric()],
		validationHandler,
		/**
		 * @type {import("express").RequestHandler}
		 */
		(req, res) => {
			const { server_id } = req.body;

			accountModel.serverInfo.update({
				isAvailable: 0,
				usersOnline: 0
			}, {
				where: { serverId: server_id }
			}).catch(err =>
				logger.error(err.toString())
			);

			result(res, 0);
		}
	],

	GetUserInfo: [
		[body("user_srl").notEmpty().isNumeric()],
		validationHandler,
		/**
		 * @type {import("express").RequestHandler}
		 */
		(req, res) => {
			const { ip, server_id, user_srl } = req.body;

			accountModel.info.findOne({ where: { accountDBID: user_srl } }).then(async account => {
				if (account === null) {
					return result(res, 50000, { msg: "account not exist" });
				}

				let charCountInfo = "0";
				let benefit = [];

				try {
					const characters = await accountModel.characters.findAll({
						where: { accountDBID: account.get("accountDBID") }
					});

					charCountInfo = helpers.getCharCountString(characters, "serverId", "charCount");
				} catch (err) {
					logger.error(err.toString());
				}

				try {
					const benefits = await accountModel.benefits.findAll({
						where: { accountDBID: account.get("accountDBID") }
					});

					benefit = helpers.getBenefitsArray(benefits, "benefitId", "availableUntil");
				} catch (err) {
					logger.error(err.toString());
				}

				result(res, 0, {
					// "last_connected_server": account.get("lastLoginServer"),
					// "last_play_time": account.get("playTimeTotal"),
					// "logout_time_diff": account.get("playTimeLast"),
					// "vip_pub_exp": 0,
					permission: account.get("permission"),
					privilege: account.get("privilege"),
					char_count_info: charCountInfo,
					benefit: benefit
				});
			}).catch(err => {
				logger.error(err.toString());
				result(res, 50000, { msg: "account not exist" });
			});
		}
	],

	EnterGame: [
		[
			body("ip").notEmpty().isIP(),
			body("server_id").notEmpty().isNumeric(),
			body("user_srl").notEmpty().isNumeric()
		],
		validationHandler,
		/**
		 * @type {import("express").RequestHandler}
		 */
		(req, res) => {
			const { ip, server_id, user_srl } = req.body;

			const primises = [
				accountModel.info.update({
					lastLoginTime: moment.utc().format("YYYY-MM-DD HH:mm:ss"),
					lastLoginIP: ip,
					lastLoginServer: server_id,
					playCount: accountModel.sequelize.literal("playCount + 1")
				}, {
					where: { accountDBID: user_srl }
				}),
				accountModel.serverInfo.increment({ usersOnline: 1 }, {
					where: { serverId: server_id }
				}),
				accountModel.characters.upsert({
					accountDBID: user_srl,
					serverId: server_id
				})
			];

			Promise.all(primises).then(() =>
				result(res, 0)
			).catch(err => {
				logger.error(err.toString());
				result(res, 50000, { msg: "account not exist" });
			});
		}
	],

	LeaveGame: [
		[
			body("play_time").notEmpty().isNumeric(),
			body("user_srl").notEmpty().isNumeric()
		],
		validationHandler,
		/**
		 * @type {import("express").RequestHandler}
		 */
		(req, res) => {
			const { play_time, user_srl } = req.body;

			const primises = [
				accountModel.info.findOne({
					where: { accountDBID: user_srl }
				}).then(account => {
					if (account !== null) {
						accountModel.serverInfo.decrement({ usersOnline: 1 }, {
							where: { serverId: account.get("lastLoginServer") }
						});
					}
				}),
				accountModel.info.update({
					playTimeLast: play_time,
					playTimeTotal: accountModel.sequelize.literal(`playTimeTotal + ${play_time}`)
				}, {
					where: { accountDBID: user_srl }
				})
			];

			Promise.all(primises).then(() =>
				result(res, 0)
			).catch(err => {
				logger.error(err.toString());
				result(res, 50000, { msg: "account not exist" });
			});
		}
	],

	CreateChar: [
		[
			body("server_id").notEmpty().isNumeric(),
			body("user_srl").notEmpty().isNumeric()
		],
		validationHandler,
		/**
		 * @type {import("express").RequestHandler}
		 */
		(req, res) => {
			const { char_name, char_srl, class_id, gender_id, level, race_id, server_id, user_srl } = req.body;

			const primises = [
				accountModel.serverInfo.increment({ usersTotal: 1 }, {
					where: { serverId: server_id }
				}),
				accountModel.characters.increment({ charCount: 1 }, {
					where: {
						accountDBID: user_srl,
						serverId: server_id
					}
				})
			];

			Promise.all(primises).then(() =>
				result(res, 0)
			).catch(err => {
				logger.error(err.toString());
				result(res, 50000, { msg: "account not exist" });
			});
		}
	],

	ModifyChar: [
		/**
		 * @type {import("express").RequestHandler}
		 */
		(req, res) => {
			const { char_name, char_srl, class_id, gender_id, level, race_id, server_id, user_srl } = req.body;

			// nothing here

			result(res, 0);
		}
	],

	DeleteChar: [
		[
			body("server_id").notEmpty().isNumeric(),
			body("user_srl").notEmpty().isNumeric()
		],
		validationHandler,
		/**
		 * @type {import("express").RequestHandler}
		 */
		(req, res) => {
			const { char_srl, server_id, user_srl } = req.body;

			const primises = [
				accountModel.serverInfo.decrement({ usersTotal: 1 }, {
					where: { serverId: server_id }
				}),
				accountModel.characters.decrement({ charCount: 1 }, {
					where: {
						accountDBID: user_srl,
						serverId: server_id
					}
				})
			];

			Promise.all(primises).then(() =>
				result(res, 0)
			).catch(err => {
				logger.error(err.toString());
				result(res, 50000, { msg: "account not exist" });
			});
		}
	],

	UseChronoScroll: [
		[
			body("server_id").notEmpty().isNumeric(),
			body("chrono_id").notEmpty().isNumeric(),
			body("user_srl").notEmpty().isNumeric()
		],
		validationHandler,
		/**
		 * @type {import("express").RequestHandler}
		 */
		(req, res) => {
			const { server_id, chrono_id, user_srl } = req.body;
			const actions = new ChronoScrollActions(server_id);

			try {
				actions.emit(chrono_id, user_srl);
				result(res, 0);
			} catch (err) {
				logger.error(err.toString());
				result(res, 50000, { msg: "account not exist" });
			}
		}
	],

	ReportCheater: [
		[
			body("cheat_info").notEmpty().isNumeric(),
			body("ip").notEmpty().isIP(),
			body("svr_id").notEmpty().isNumeric(),
			body("type").notEmpty().isNumeric(),
			body("usr_srl").notEmpty().isNumeric()
		],
		validationHandler,
		/**
		 * @type {import("express").RequestHandler}
		 */
		(req, res) => {
			const { cheat_info, ip, svr_id, type, usr_srl } = req.body;

			reportModel.cheats.create({
				accountDBID: usr_srl,
				serverId: svr_id,
				ip: ip,
				type: type,
				cheatInfo: cheat_info
			}).then(() =>
				result(res, 0)
			).catch(err => {
				logger.error(err.toString());
				result(res, 50000, { msg: "account not exist" });
			});
		}
	]
};