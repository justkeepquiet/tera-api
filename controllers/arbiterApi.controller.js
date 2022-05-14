/* eslint-disable no-unused-vars */
"use strict";

const { body, validationResult } = require("express-validator");
const moment = require("moment-timezone");
const helpers = require("../helpers/helpers");
const accountModel = require("../models/account.model");
const reportModel = require("../models/report.model");

module.exports = {
	ServiceTest: [
		/**
		 * @type {import("express").RequestHandler}
		 */
		(req, res) => {
			accountModel.sequelize.authenticate().then(() =>
				res.json({
					server_time: Date.now() / 1000,
					result_code: 0
				})
			).catch(() =>
				res.json({
					result_code: 1,
					msg: "database error"
				})
			);
		}
	],

	GetServerPermission: [
		/**
		 * @type {import("express").RequestHandler}
		 */
		(req, res) => {
			// @todo
			res.json({
				permission: 0,
				result_code: 0
			});
		}
	],

	ServerDown: [
		[body("server_id").notEmpty().isNumeric()],
		/**
		 * @type {import("express").RequestHandler}
		 */
		(req, res) => {
			if (!validationResult(req).isEmpty()) {
				return res.json({
					result_code: 2,
					msg: "invalid parameter"
				});
			}

			const { server_id } = req.body;

			accountModel.serverInfo.update({
				isAvailable: 0, // set server is offline (me need open server manually on start?!)
				usersOnline: 0
			}, {
				where: { serverId: server_id }
			});

			res.json({
				result_code: 0
			});
		}
	],

	GetUserInfo: [
		[body("user_srl").notEmpty().isNumeric()],
		/**
		 * @type {import("express").RequestHandler}
		 */
		(req, res) => {
			if (!validationResult(req).isEmpty()) {
				return res.json({
					result_code: 2,
					msg: "invalid parameter"
				});
			}

			const { ip, server_id, user_srl } = req.body;

			accountModel.info.findOne({ where: { accountDBID: user_srl } }).then(async account => {
				let charCountInfo = "0";
				let benefit = [];

				try {
					const characters = await accountModel.characters.findAll({
						where: { accountDBID: account.get("accountDBID") }
					});

					charCountInfo = helpers.getCharCountString(characters, "serverId", "charCount");
				} catch (_) {}

				try {
					const benefits = await accountModel.benefits.findAll({
						where: { accountDBID: account.get("accountDBID") }
					});

					benefit = helpers.getBenefitsArray(benefits, "benefitId", "availableUntil");
				} catch (_) {}

				res.json({
					// "last_connected_server": account.get("lastLoginServer"),
					// "last_play_time": account.get("playTimeTotal"),
					// "logout_time_diff": account.get("playTimeLast"),
					permission: account.get("permission"),
					privilege: account.get("privilege"),
					char_count_info: charCountInfo,
					benefit: benefit,
					// "vip_pub_exp": 0, // @todo
					result_code: 0
				});
			}).catch(() =>
				res.json({
					result_code: 50000,
					msg: "account not exist"
				})
			);
		}
	],

	EnterGame: [
		[
			body("ip").notEmpty().isIP(),
			body("server_id").notEmpty().isNumeric(),
			body("user_srl").notEmpty().isNumeric()
		],
		/**
		 * @type {import("express").RequestHandler}
		 */
		(req, res) => {
			if (!validationResult(req).isEmpty()) {
				return res.json({
					result_code: 2,
					msg: "invalid parameter"
				});
			}

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
				res.json({ result_code: 0 })
			).catch(() =>
				res.json({
					result_code: 50000,
					msg: "account not exist"
				})
			);
		}
	],

	LeaveGame: [
		[
			body("play_time").notEmpty().isNumeric(),
			body("user_srl").notEmpty().isNumeric()
		],
		/**
		 * @type {import("express").RequestHandler}
		 */
		(req, res) => {
			if (!validationResult(req).isEmpty()) {
				return res.json({
					result_code: 2,
					msg: "invalid parameter"
				});
			}

			const { play_time, user_srl } = req.body;

			const primises = [
				accountModel.info.findOne({
					where: { accountDBID: user_srl }
				}).then(account =>
					accountModel.serverInfo.decrement({ usersOnline: 1 }, {
						where: { serverId: account.get("lastLoginServer") }
					})
				),
				accountModel.info.update({
					playTimeLast: play_time,
					playTimeTotal: accountModel.sequelize.literal(`playTimeTotal + ${play_time}`)
				}, {
					where: { accountDBID: user_srl }
				})
			];

			Promise.all(primises).then(() =>
				res.json({ result_code: 0 })
			).catch(() =>
				res.json({
					result_code: 50000,
					msg: "account not exist"
				})
			);
		}
	],

	CreateChar: [
		[
			body("server_id").notEmpty().isNumeric(),
			body("user_srl").notEmpty().isNumeric()
		],
		/**
		 * @type {import("express").RequestHandler}
		 */
		(req, res) => {
			if (!validationResult(req).isEmpty()) {
				return res.json({
					result_code: 2,
					msg: "invalid parameter"
				});
			}

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
				res.json({ result_code: 0 })
			).catch(() =>
				res.json({
					result_code: 50000,
					msg: "account not exist"
				})
			);
		}
	],

	ModifyChar: [
		/**
		 * @type {import("express").RequestHandler}
		 */
		(req, res) => {
			const { char_name, char_srl, class_id, gender_id, level, race_id, server_id, user_srl } = req.body;

			// nothing here

			res.json({ result_code: 0 });
		}
	],

	DeleteChar: [
		[
			body("server_id").notEmpty().isNumeric(),
			body("user_srl").notEmpty().isNumeric()
		],
		/**
		 * @type {import("express").RequestHandler}
		 */
		(req, res) => {
			if (!validationResult(req).isEmpty()) {
				return res.json({
					result_code: 2,
					msg: "invalid parameter"
				});
			}

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
				res.json({ result_code: 0 })
			).catch(() =>
				res.json({
					result_code: 50000,
					msg: "account not exist"
				})
			);
		}
	],

	UseChronoScroll: [
		[
			body("server_id").notEmpty().isNumeric(),
			body("chrono_id").notEmpty().isNumeric(),
			body("user_srl").notEmpty().isNumeric()
		],
		/**
		 * @type {import("express").RequestHandler}
		 */
		(req, res) => {
			if (!validationResult(req).isEmpty()) {
				return res.json({
					result_code: 2,
					msg: "invalid parameter"
				});
			}

			const { server_id, chrono_id, user_srl } = req.body;

			// @todo Use premium item to account

			res.json({ result_code: 0 });
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
		/**
		 * @type {import("express").RequestHandler}
		 */
		(req, res) => {
			if (!validationResult(req).isEmpty()) {
				return res.json({
					result_code: 2,
					msg: "invalid parameter"
				});
			}

			const { cheat_info, ip, svr_id, type, usr_srl } = req.body;

			reportModel.cheats.create({
				accountDBID: usr_srl,
				serverId: svr_id,
				ip: ip,
				type: type,
				cheatInfo: cheat_info
			}).then(() =>
				res.json({ result_code: 0 })
			).catch(() =>
				res.json({
					result_code: 50000,
					msg: "account not exist"
				})
			);
		}
	]
};