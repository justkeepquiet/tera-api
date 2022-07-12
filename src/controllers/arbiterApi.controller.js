"use strict";

/**
 * @typedef {import("../app").modules} modules
 * @typedef {import("express").RequestHandler} RequestHandler
 */

const body = require("express-validator").body;
const moment = require("moment-timezone");
const Op = require("sequelize").Op;
const helpers = require("../utils/helpers");
const ChronoScrollActions = require("../actions/chronoScroll.actions");

const { validationHandler, resultJson } = require("../middlewares/arbiterApi.middlewares");

const reportActivity = /^true$/i.test(process.env.API_ARBITER_REPORT_ACTIVITY);
const reportCharacters = /^true$/i.test(process.env.API_ARBITER_REPORT_CHARACTERS);
const reportChronoScrolls = /^true$/i.test(process.env.API_ARBITER_REPORT_CHRONOSCROLLS);
const reportCheats = /^true$/i.test(process.env.API_ARBITER_REPORT_CHEATS);

/**
 * @param {modules} modules
 */
module.exports.ServiceTest = ({ logger, accountModel }) => [
	/**
	 * @type {RequestHandler}
	 */
	(req, res) => {
		accountModel.sequelize.authenticate().then(() =>
			resultJson(res, 0, { server_time: Date.now() / 1000 })
		).catch(err => {
			logger.error(err);
			resultJson(res, 1, { msg: "internal error" });
		});
	}
];

/**
 * @param {modules} modules
 */
module.exports.GetServerPermission = ({ logger, accountModel }) => [
	[body("server_id").isNumeric()],
	validationHandler(logger),
	/**
	 * @type {RequestHandler}
	 */
	(req, res) => {
		const { server_id } = req.body;

		accountModel.maintenance.findOne({
			where: {
				startTime: { [Op.lt]: accountModel.sequelize.fn("NOW") },
				endTime: { [Op.gt]: accountModel.sequelize.fn("NOW") }
			}
		}).then(maintenance => accountModel.serverInfo.findOne({
			where: { serverId: server_id }
		}).then(server => {
			let permission = 0x00000000;

			if (server.get("isCrowdness")) {
				permission = 0x00000001;
			}

			if (maintenance !== null) {
				permission = 0x00000100;
			}

			resultJson(res, 0, { permission });
		})).catch(err => {
			logger.error(err);
			resultJson(res, 1, { msg: "internal error" });
		});
	}
];

/**
 * @param {modules} modules
 */
module.exports.ServerDown = ({ logger, accountModel }) => [
	[body("server_id").isNumeric()],
	validationHandler(logger),
	/**
	 * @type {RequestHandler}
	 */
	(req, res) => {
		const { server_id } = req.body;

		Promise.all([
			accountModel.serverInfo.update({
				isAvailable: 0,
				usersOnline: 0
			}, {
				where: { serverId: server_id }
			}),
			accountModel.online.destroy({
				where: { serverId: server_id }
			})
		]).catch(err =>
			logger.error(err)
		);

		resultJson(res, 0);
	}
];

/**
 * @param {modules} modules
 */
module.exports.GetUserInfo = ({ logger, accountModel }) => [
	[body("user_srl").isNumeric()],
	validationHandler(logger),
	/**
	 * @type {RequestHandler}
	 */
	(req, res) => {
		const { ip, server_id, user_srl } = req.body;

		accountModel.info.findOne({ where: { accountDBID: user_srl } }).then(async account => {
			if (account === null) {
				return resultJson(res, 50000, { msg: "account not exist" });
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
					charCountInfo = helpers.getCharCountString(characters, account.get("lastLoginServer"), "serverId", "charCount");
				}
			} catch (err) {
				logger.error(err);
			}

			try {
				const benefits = await accountModel.benefits.findAll({
					where: { accountDBID: account.get("accountDBID") }
				});

				if (benefits !== null) {
					benefit = helpers.getBenefitsArray(benefits, "benefitId", "availableUntil");
				}
			} catch (err) {
				logger.error(err);
			}

			resultJson(res, 0, {
				privilege: account.get("privilege"),
				permission: account.get("permission"),
				last_connected_server: account.get("lastLoginServer"),
				last_play_time: account.get("playTimeLast"),
				logout_time_diff: account.get("playTimeTotal"),
				char_count_info: charCountInfo,
				benefit: benefit
			});
		}).catch(err => {
			logger.error(err);
			resultJson(res, 1, { msg: "internal error" });
		});
	}
];

/**
 * @param {modules} modules
 */
module.exports.EnterGame = ({ logger, accountModel, reportModel }) => [
	[
		body("ip").isIP(),
		body("server_id").isNumeric(),
		body("user_srl").isNumeric()
	],
	validationHandler(logger),
	/**
	 * @type {RequestHandler}
	 */
	(req, res) => {
		const { ip, server_id, user_srl } = req.body;

		accountModel.sequelize.transaction(transaction => {
			const promises = [
				accountModel.info.update({
					lastLoginTime: moment().toDate(),
					lastLoginIP: ip,
					lastLoginServer: server_id,
					playCount: accountModel.sequelize.literal("playCount + 1")
				}, {
					where: { accountDBID: user_srl },
					transaction
				}),
				accountModel.serverInfo.increment({ usersOnline: 1 }, {
					where: { serverId: server_id },
					transaction
				}),
				accountModel.online.create({
					accountDBID: user_srl,
					serverId: server_id
				})
			];

			return Promise.all(promises).then(() => {
				if (reportActivity) {
					reportModel.activity.create({
						accountDBID: user_srl,
						serverId: server_id,
						ip,
						reportType: 1
					}).catch(err => {
						logger.error(err);
					});
				}

				resultJson(res, 0);
			});
		}).catch(err => {
			logger.error(err);
			resultJson(res, 1, { msg: "internal error" });
		});
	}
];

/**
 * @param {modules} modules
 */
module.exports.LeaveGame = ({ logger, accountModel, reportModel }) => [
	[
		body("play_time").isNumeric(),
		body("user_srl").isNumeric()
	],
	validationHandler(logger),
	/**
	 * @type {RequestHandler}
	 */
	(req, res) => {
		const { play_time, user_srl } = req.body;

		accountModel.sequelize.transaction(transaction => {
			const promises = [
				accountModel.info.findOne({
					where: { accountDBID: user_srl }
				}).then(account => {
					if (account === null) return;

					if (reportActivity) {
						reportModel.activity.create({
							accountDBID: user_srl,
							serverId: account.get("lastLoginServer"),
							ip: account.get("lastLoginIP"),
							playTime: play_time,
							reportType: 2
						}).catch(err => {
							logger.error(err);
						});
					}

					return accountModel.serverInfo.decrement({ usersOnline: 1 }, {
						where: { serverId: account.get("lastLoginServer") },
						transaction
					});
				}),
				accountModel.info.update({
					playTimeLast: play_time,
					playTimeTotal: accountModel.sequelize.literal(`playTimeTotal + ${play_time}`)
				}, {
					where: { accountDBID: user_srl },
					transaction
				}),
				accountModel.online.destroy({
					where: { accountDBID: user_srl }
				})
			];

			return Promise.all(promises).then(() =>
				resultJson(res, 0)
			);
		}).catch(err => {
			logger.error(err);
			resultJson(res, 1, { msg: "internal error" });
		});
	}
];

/**
 * @param {modules} modules
 */
module.exports.CreateChar = ({ logger, accountModel, reportModel }) => [
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
	validationHandler(logger),
	/**
	 * @type {RequestHandler}
	 */
	(req, res) => {
		const { char_name, char_srl, class_id, gender_id, level, race_id, server_id, user_srl } = req.body;

		accountModel.sequelize.transaction(transaction => {
			const promises = [
				accountModel.serverInfo.increment({ usersTotal: 1 }, {
					where: { serverId: server_id },
					transaction
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
				}, {
					transaction
				})
			];

			return Promise.all(promises).then(() => {
				if (reportCharacters) {
					reportModel.characters.create({
						characterId: char_srl,
						serverId: server_id,
						accountDBID: user_srl,
						name: decodeURI(char_name),
						classId: class_id,
						genderId: gender_id,
						raceId: race_id,
						level,
						reportType: 1
					}).catch(err => {
						logger.error(err);
					});
				}

				resultJson(res, 0);
			});
		}).catch(err => {
			logger.error(err);
			resultJson(res, 1, { msg: "internal error" });
		});
	}
];

/**
 * @param {modules} modules
 */
module.exports.ModifyChar = ({ logger, accountModel, reportModel }) => [
	[
		body("char_srl").isNumeric(),
		body("server_id").isNumeric(),
		body("user_srl").isNumeric(),
		body("class_id").optional().isNumeric(),
		body("gender_id").optional().isNumeric(),
		body("level").optional().isNumeric(),
		body("race_id").optional().isNumeric()
	],
	validationHandler(logger),
	/**
	 * @type {RequestHandler}
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
			return resultJson(res, 0);
		}

		accountModel.characters.update(fields, {
			where: {
				characterId: char_srl,
				serverId: server_id,
				accountDBID: user_srl
			}
		}).then(() => {
			if (reportCharacters) {
				reportModel.characters.create({
					characterId: char_srl,
					serverId: server_id,
					accountDBID: user_srl,
					...fields,
					reportType: 2
				}).catch(err => {
					logger.error(err);
				});
			}

			resultJson(res, 0);
		}).catch(err => {
			logger.error(err);
			resultJson(res, 1, { msg: "internal error" });
		});
	}
];

/**
 * @param {modules} modules
 */
module.exports.DeleteChar = ({ logger, accountModel, reportModel }) => [
	[
		body("char_srl").isNumeric(),
		body("server_id").isNumeric(),
		body("user_srl").isNumeric()
	],
	validationHandler(logger),
	/**
	 * @type {RequestHandler}
	 */
	(req, res) => {
		const { char_srl, server_id, user_srl } = req.body;

		accountModel.sequelize.transaction(transaction => {
			const promises = [
				accountModel.serverInfo.decrement({ usersTotal: 1 }, {
					where: { serverId: server_id },
					transaction
				}),
				accountModel.characters.destroy({
					where: {
						characterId: char_srl,
						serverId: server_id,
						accountDBID: user_srl
					},
					transaction
				})
			];

			return Promise.all(promises).then(() => {
				if (reportCharacters) {
					reportModel.characters.create({
						characterId: char_srl,
						serverId: server_id,
						accountDBID: user_srl,
						reportType: 3
					}).catch(err => {
						logger.error(err);
					});
				}

				resultJson(res, 0);
			});
		}).catch(err => {
			logger.error(err);
			resultJson(res, 1, { msg: "internal error" });
		});
	}
];

/**
 * @param {modules} modules
 */
module.exports.UseChronoScroll = modules => [
	[
		body("server_id").isNumeric(),
		body("chrono_id").isNumeric(),
		body("user_srl").isNumeric()
	],
	validationHandler(modules.logger),
	/**
	 * @type {RequestHandler}
	 */
	(req, res) => {
		const { server_id, chrono_id, user_srl } = req.body;

		const actions = new ChronoScrollActions(modules, server_id, user_srl);

		actions.execute(chrono_id).then(() => {
			if (reportChronoScrolls) {
				modules.reportModel.chronoScrolls.create({
					accountDBID: user_srl,
					serverId: server_id,
					chronoId: chrono_id
				}).catch(err => {
					modules.logger.error(err);
				});
			}

			resultJson(res, 0);
		}).catch(err => {
			modules.logger.error(err);
			resultJson(res, 1, { msg: "internal error" });
		});
	}
];

/**
 * @param {modules} modules
 */
module.exports.ReportCheater = ({ logger, reportModel }) => [
	[
		body("cheat_info").isNumeric(),
		body("ip").isIP(),
		body("svr_id").isNumeric(),
		body("type").isNumeric(),
		body("usr_srl").isNumeric()
	],
	validationHandler(logger),
	/**
	 * @type {RequestHandler}
	 */
	(req, res) => {
		const { cheat_info, ip, svr_id, type, usr_srl } = req.body;

		if (!reportCheats) {
			return resultJson(res, 0);
		}

		reportModel.cheats.create({
			accountDBID: usr_srl,
			serverId: svr_id,
			ip: ip,
			type: type,
			cheatInfo: cheat_info
		}).then(() =>
			resultJson(res, 0)
		).catch(err => {
			logger.error(err);
			resultJson(res, 1, { msg: "internal error" });
		});
	}
];