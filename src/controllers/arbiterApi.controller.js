"use strict";

const body = require("express-validator").body;
const moment = require("moment-timezone");
const logger = require("../utils/logger");
const helpers = require("../utils/helpers");
const accountModel = require("../models/account.model");
const reportModel = require("../models/report.model");
const ChronoScrollActions = require("../actions/chronoScroll.actions");

const reportActivity = /^true$/i.test(process.env.API_ARBITER_REPORT_ACTIVITY);
const reportCharacters = /^true$/i.test(process.env.API_ARBITER_REPORT_CHARACTERS);
const reportChronoScrolls = /^true$/i.test(process.env.API_ARBITER_REPORT_CHRONOSCROLLS);
const reportCheats = /^true$/i.test(process.env.API_ARBITER_REPORT_CHEATS);

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
		[body("server_id").isNumeric()],
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
		[body("user_srl").isNumeric()],
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
						attributes: ["serverId", [accountModel.characters.sequelize.fn("COUNT", "characterId"), "charCount"]],
						group: ["serverId"],
						where: { accountDBID: account.get("accountDBID") }
					});

					if (characters !== null) {
						charCountInfo = helpers.getCharCountString(characters, "serverId", "charCount");
					}
				} catch (err) {
					logger.error(err.toString());
				}

				try {
					const benefits = await accountModel.benefits.findAll({
						where: { accountDBID: account.get("accountDBID") }
					});

					if (benefits !== null) {
						benefit = helpers.getBenefitsArray(benefits, "benefitId", "availableUntil");
					}
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
			body("ip").isIP(),
			body("server_id").isNumeric(),
			body("user_srl").isNumeric()
		],
		validationHandler,
		/**
		 * @type {import("express").RequestHandler}
		 */
		(req, res) => {
			const { ip, server_id, user_srl } = req.body;

			const promises = [
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
				})
			];

			if (reportActivity) {
				promises.push(reportModel.activity.create({
					accountDBID: user_srl,
					serverId: server_id,
					ip,
					reportType: 1
				}));
			}

			Promise.all(promises).then(() =>
				result(res, 0)
			).catch(err => {
				logger.error(err.toString());
				result(res, 50000, { msg: "account not exist" });
			});
		}
	],

	LeaveGame: [
		[
			body("play_time").isNumeric(),
			body("user_srl").isNumeric()
		],
		validationHandler,
		/**
		 * @type {import("express").RequestHandler}
		 */
		(req, res) => {
			const { play_time, user_srl } = req.body;

			const promises = [
				accountModel.info.findOne({
					where: { accountDBID: user_srl }
				}).then(async account => {
					if (account !== null) {
						await accountModel.serverInfo.decrement({ usersOnline: 1 }, {
							where: { serverId: account.get("lastLoginServer") }
						});

						if (reportActivity) {
							await reportModel.activity.create({
								accountDBID: user_srl,
								serverId: account.get("lastLoginServer"),
								ip: account.get("lastLoginIP"),
								playTime: play_time,
								reportType: 2
							});
						}
					}
				}),
				accountModel.info.update({
					playTimeLast: play_time,
					playTimeTotal: accountModel.sequelize.literal(`playTimeTotal + ${play_time}`)
				}, {
					where: { accountDBID: user_srl }
				})
			];

			Promise.all(promises).then(() =>
				result(res, 0)
			).catch(err => {
				logger.error(err.toString());
				result(res, 50000, { msg: "account not exist" });
			});
		}
	],

	CreateChar: [
		[
			body("server_id").isNumeric(),
			body("user_srl").isNumeric(),
			body("char_srl").isNumeric(),
			body("class_id").isNumeric(),
			body("gender_id").isNumeric(),
			body("level").isNumeric(),
			body("race_id").isNumeric(),
			body("char_name").notEmpty()
		],
		validationHandler,
		/**
		 * @type {import("express").RequestHandler}
		 */
		(req, res) => {
			const { char_name, char_srl, class_id, gender_id, level, race_id, server_id, user_srl } = req.body;

			const promises = [
				accountModel.serverInfo.increment({ usersTotal: 1 }, {
					where: { serverId: server_id }
				}),
				accountModel.characters.create({
					characterId: char_srl,
					serverId: server_id,
					accountDBID: user_srl,
					name: decodeURI(char_name),
					classId: class_id,
					genderId: gender_id,
					raceId: race_id,
					level
				})
			];

			if (reportCharacters) {
				promises.push(reportModel.characters.create({
					characterId: char_srl,
					serverId: server_id,
					accountDBID: user_srl,
					name: decodeURI(char_name),
					classId: class_id,
					genderId: gender_id,
					raceId: race_id,
					level,
					reportType: 1
				}));
			}

			Promise.all(promises).then(() =>
				result(res, 0)
			).catch(err => {
				logger.error(err.toString());
				result(res, 50000, { msg: "account not exist" });
			});
		}
	],

	ModifyChar: [
		[
			body("char_srl").isNumeric(),
			body("server_id").isNumeric(),
			body("user_srl").isNumeric(),
			body("class_id").optional().isNumeric(),
			body("gender_id").optional().isNumeric(),
			body("level").optional().isNumeric(),
			body("race_id").optional().isNumeric()
		],
		validationHandler,
		/**
		 * @type {import("express").RequestHandler}
		 */
		(req, res) => {
			const { char_name, char_srl, class_id, gender_id, level, race_id, server_id, user_srl } = req.body;
			const fields = {};

			if (char_name !== undefined) fields.name = decodeURI(char_name);
			if (class_id !== undefined) fields.classId = class_id;
			if (gender_id !== undefined) fields.genderId = gender_id;
			if (race_id !== undefined) fields.race_id = race_id;
			if (level !== undefined) fields.level = level;

			if (Object.keys(fields).length === 0) {
				return result(res, 0);
			}

			const promises = [
				accountModel.characters.update(fields, {
					where: {
						characterId: char_srl,
						serverId: server_id,
						accountDBID: user_srl
					}
				})
			];

			if (reportCharacters) {
				promises.push(reportModel.characters.create({
					characterId: char_srl,
					serverId: server_id,
					accountDBID: user_srl,
					...fields,
					reportType: 2
				}));
			}

			Promise.all(promises).then(() =>
				result(res, 0)
			).catch(err => {
				logger.error(err.toString());
				result(res, 50000, { msg: "account not exist" });
			});
		}
	],

	DeleteChar: [
		[
			body("char_srl").isNumeric(),
			body("server_id").isNumeric(),
			body("user_srl").isNumeric()
		],
		validationHandler,
		/**
		 * @type {import("express").RequestHandler}
		 */
		(req, res) => {
			const { char_srl, server_id, user_srl } = req.body;

			const promises = [
				accountModel.serverInfo.decrement({ usersTotal: 1 }, {
					where: { serverId: server_id }
				}),
				accountModel.characters.destroy({
					where: {
						characterId: char_srl,
						serverId: server_id,
						accountDBID: user_srl
					}
				})
			];

			if (reportCharacters) {
				promises.push(reportModel.characters.create({
					characterId: char_srl,
					serverId: server_id,
					accountDBID: user_srl,
					reportType: 3
				}));
			}

			Promise.all(promises).then(() =>
				result(res, 0)
			).catch(err => {
				logger.error(err.toString());
				result(res, 50000, { msg: "account not exist" });
			});
		}
	],

	UseChronoScroll: [
		[
			body("server_id").isNumeric(),
			body("chrono_id").isNumeric(),
			body("user_srl").isNumeric()
		],
		validationHandler,
		/**
		 * @type {import("express").RequestHandler}
		 */
		async (req, res) => {
			const { server_id, chrono_id, user_srl } = req.body;
			const actions = new ChronoScrollActions(server_id);

			try {
				actions.emit(chrono_id, user_srl);

				if (reportChronoScrolls) {
					await reportModel.chronoScrolls.create({
						accountDBID: user_srl,
						serverId: server_id,
						chronoId: chrono_id
					});
				}

				result(res, 0);
			} catch (err) {
				logger.error(err.toString());
				result(res, 50000, { msg: "account not exist" });
			}
		}
	],

	ReportCheater: [
		[
			body("cheat_info").isNumeric(),
			body("ip").isIP(),
			body("svr_id").isNumeric(),
			body("type").isNumeric(),
			body("usr_srl").isNumeric()
		],
		validationHandler,
		/**
		 * @type {import("express").RequestHandler}
		 */
		(req, res) => {
			const { cheat_info, ip, svr_id, type, usr_srl } = req.body;

			if (!reportCheats) {
				return result(res, 0);
			}

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