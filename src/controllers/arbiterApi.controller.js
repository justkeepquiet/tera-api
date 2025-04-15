"use strict";

/**
 * @typedef {import("../app").modules} modules
 * @typedef {import("express").RequestHandler} RequestHandler
 */

const body = require("express-validator").body;
const moment = require("moment-timezone");
const Op = require("sequelize").Op;

const env = require("../utils/env");
const ApiError = require("../lib/apiError");
const ChronoScrollActions = require("../actions/chronoScroll.actions");
const GameEventsActions = require("../actions/gameEvents.actions");
const { getCharCountString, getBenefitsArray } = require("../utils/helpers");
const { validationHandler } = require("../middlewares/arbiterApi.middlewares");

const reportActivity = env.bool("API_ARBITER_REPORT_ACTIVITY");
const reportCharacters = env.bool("API_ARBITER_REPORT_CHARACTERS");
const reportChronoScrolls = env.bool("API_ARBITER_REPORT_CHRONOSCROLLS");
const reportCheats = env.bool("API_ARBITER_REPORT_CHEATS");
const ipFromLauncher = env.bool("API_ARBITER_USE_IP_FROM_LAUNCHER");

/**
 * @param {modules} modules
 */
module.exports.ServiceTest = ({ sequelize }) => [
	/**
	 * @type {RequestHandler}
	 */
	async (req, res, next) => {
		await sequelize.authenticate();

		res.json({
			result_code: 0,
			server_time: Date.now() / 1000
		});
	}
];

/**
 * @param {modules} modules
 */
module.exports.GetServerPermission = ({ logger, sequelize, serverModel }) => [
	[body("server_id").isNumeric()],
	validationHandler(logger),
	/**
	 * @type {RequestHandler}
	 */
	async (req, res, next) => {
		const { server_id } = req.body;

		const maintenance = await serverModel.maintenance.findOne({
			attributes: ["id"],
			where: {
				startTime: { [Op.lt]: sequelize.fn("NOW") },
				endTime: { [Op.gt]: sequelize.fn("NOW") }
			}
		});

		const server = await serverModel.info.findOne({
			attributes: ["permission", "isCrowdness"],
			where: { serverId: server_id }
		});

		if (server === null) {
			throw new ApiError("server not exist", 10000);
		}

		let permission = server.get("permission") || 0;

		if (server.get("isCrowdness")) {
			permission += 1;
		}

		if (maintenance !== null) {
			permission += 256;
		}

		res.json({
			result_code: 0,
			permission
		});
	}
];

/**
 * @param {modules} modules
 */
module.exports.ServerDown = ({ logger, accountModel, serverModel }) => [
	[body("server_id").isNumeric()],
	validationHandler(logger),
	/**
	 * @type {RequestHandler}
	 */
	async (req, res, next) => {
		const { server_id } = req.body;

		try {
			await serverModel.info.update({
				isAvailable: 0,
				usersOnline: 0
			}, {
				where: { serverId: server_id }
			});

			await accountModel.online.destroy({
				where: { serverId: server_id }
			});
		} catch (err) {
			logger.error(err);
		}

		res.json({ result_code: 0 });
	}
];

/**
 * @param {modules} modules
 */
module.exports.GetUserInfo = ({ logger, sequelize, accountModel }) => [
	[body("user_srl").isNumeric()],
	validationHandler(logger),
	/**
	 * @type {RequestHandler}
	 */
	async (req, res, next) => {
		const { ip, server_id, user_srl } = req.body;

		const account = await accountModel.info.findOne({
			where: { accountDBID: user_srl }
		});

		if (account === null) {
			throw new ApiError("account not exist", 50000);
		}

		let charCountInfo = "0";
		let benefit = [];

		try {
			const characters = await accountModel.characters.findAll({
				attributes: ["serverId", [sequelize.fn("COUNT", "characterId"), "charCount"]],
				group: ["serverId"],
				where: { accountDBID: account.get("accountDBID") }
			});

			charCountInfo = getCharCountString(characters, account.get("lastLoginServer"), "serverId", "charCount");
		} catch (err) {
			logger.error(err);
		}

		try {
			const benefits = await accountModel.benefits.findAll({
				where: { accountDBID: account.get("accountDBID") }
			});

			benefit = getBenefitsArray(benefits, "benefitId", "availableUntil");
		} catch (err) {
			logger.error(err);
		}

		res.json({
			result_code: 0,
			privilege: account.get("privilege"),
			permission: account.get("permission"),
			last_connected_server: account.get("lastLoginServer"),
			last_play_time: moment(account.get("lastLoginTime")).unix(),
			logout_time_diff: account.get("playTimeLast"),
			char_count_info: charCountInfo,
			benefit
		});
	}
];

/**
 * @param {modules} modules
 */
module.exports.EnterGame = modules => [
	[
		body("ip").isIP(),
		body("server_id").isNumeric(),
		body("user_srl").isNumeric()
	],
	validationHandler(modules.logger),
	/**
	 * @type {RequestHandler}
	 */
	async (req, res, next) => {
		const { ip, server_id, user_srl } = req.body;

		const account = await modules.accountModel.info.findOne({
			where: { accountDBID: user_srl }
		});

		if (account === null) {
			throw new ApiError("account not exist", 50000);
		}

		const actions = new GameEventsActions(modules, server_id, user_srl);

		try {
			if (account.get("playCount") === 0) {
				await actions.execute("enterGameFirst", req.body);
			}
		} catch (err) {
			modules.logger.warn(err);
		}

		await modules.sequelize.transaction(async () => {
			await modules.accountModel.info.update({
				...!ipFromLauncher ? { lastLoginIP: ip } : {},
				lastLoginTime: moment().toDate(),
				lastLoginServer: server_id,
				playCount: modules.sequelize.literal("playCount + 1")
			}, {
				where: { accountDBID: user_srl }
			});

			await modules.serverModel.info.increment({ usersOnline: 1 }, {
				where: { serverId: server_id }
			});

			await modules.accountModel.online.create({
				accountDBID: user_srl,
				serverId: server_id
			});

			if (reportActivity) {
				try {
					await modules.reportModel.activity.create({
						accountDBID: user_srl,
						serverId: server_id,
						ip: ipFromLauncher ? account.get("lastLoginIP") : ip,
						reportType: 1
					});
				} catch (err) {
					modules.logger.error(err);
				}
			}
		});

		try {
			await actions.execute("enterGame", req.body);
		} catch (err) {
			modules.logger.warn(err);
		}

		res.json({ result_code: 0 });
	}
];

/**
 * @param {modules} modules
 */
module.exports.LeaveGame = modules => [
	[
		body("play_time").isNumeric(),
		body("user_srl").isNumeric()
	],
	validationHandler(modules.logger),
	/**
	 * @type {RequestHandler}
	 */
	async (req, res, next) => {
		const { play_time, user_srl } = req.body;

		await modules.sequelize.transaction(async () => {
			const account = await modules.accountModel.info.findOne({
				where: { accountDBID: user_srl }
			});

			if (account !== null) {
				if (reportActivity) {
					try {
						await modules.reportModel.activity.create({
							accountDBID: user_srl,
							serverId: account.get("lastLoginServer"),
							ip: account.get("lastLoginIP"),
							playTime: play_time,
							reportType: 2
						});
					} catch (err) {
						modules.logger.error(err);
					}
				}

				await modules.serverModel.info.decrement({ usersOnline: 1 }, {
					where: {
						serverId: account.get("lastLoginServer"),
						usersOnline: { [Op.gt]: 0 }
					}
				});
			}

			await modules.accountModel.info.update({
				playTimeLast: play_time,
				playTimeTotal: modules.sequelize.literal(`playTimeTotal + ${play_time}`)
			}, {
				where: { accountDBID: user_srl }
			});

			await modules.accountModel.online.destroy({
				where: { accountDBID: user_srl }
			});
		});

		const actions = new GameEventsActions(modules, null, user_srl);

		try {
			await actions.execute("leaveGame", req.body);
		} catch (err) {
			modules.logger.warn(err);
		}

		res.json({ result_code: 0 });
	}
];

/**
 * @param {modules} modules
 */
module.exports.CreateChar = modules => [
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
	validationHandler(modules.logger),
	/**
	 * @type {RequestHandler}
	 */
	async (req, res, next) => {
		const { char_name, char_srl, class_id, gender_id, level, race_id, server_id, user_srl } = req.body;

		await modules.sequelize.transaction(async () => {
			await modules.serverModel.info.increment({ usersTotal: 1 }, {
				where: { serverId: server_id }
			});

			await modules.accountModel.characters.create({
				characterId: char_srl,
				serverId: server_id,
				accountDBID: user_srl,
				name: decodeURI(char_name),
				classId: class_id,
				genderId: gender_id,
				raceId: race_id,
				level
			});

			if (reportCharacters) {
				try {
					await modules.reportModel.characters.create({
						characterId: char_srl,
						serverId: server_id,
						accountDBID: user_srl,
						name: decodeURI(char_name),
						classId: class_id,
						genderId: gender_id,
						raceId: race_id,
						level,
						reportType: 1
					});
				} catch (err) {
					modules.logger.error(err);
				}
			}
		});

		const actions = new GameEventsActions(modules, server_id, user_srl);

		try {
			await actions.execute("createChar", req.body);
		} catch (err) {
			modules.logger.warn(err);
		}

		res.json({ result_code: 0 });
	}
];

/**
 * @param {modules} modules
 */
module.exports.ModifyChar = modules => [
	[
		body("char_srl").isNumeric(),
		body("server_id").isNumeric(),
		body("user_srl").isNumeric(),
		body("class_id").optional().isNumeric(),
		body("gender_id").optional().isNumeric(),
		body("level").optional().isNumeric(),
		body("race_id").optional().isNumeric()
	],
	validationHandler(modules.logger),
	/**
	 * @type {RequestHandler}
	 */
	async (req, res, next) => {
		const { char_name, char_srl, class_id, gender_id, level, race_id, server_id, user_srl } = req.body;
		const fields = {};

		if (char_name !== undefined) fields.name = decodeURI(char_name);
		if (class_id !== undefined) fields.classId = class_id;
		if (gender_id !== undefined) fields.genderId = gender_id;
		if (race_id !== undefined) fields.race_id = race_id;
		if (level !== undefined) fields.level = level;

		if (Object.keys(fields).length === 0) {
			return res.json({ result_code: 0 });
		}

		const actions = new GameEventsActions(modules, server_id, user_srl);

		if (fields.level) {
			try {
				const character = await modules.accountModel.characters.findOne({
					where: {
						characterId: char_srl,
						serverId: server_id,
						accountDBID: user_srl
					}
				});

				if (character === null || fields.level > character.get("level")) {
					await actions.execute("charLevelUp", req.body);
				}
			} catch (err) {
				modules.logger.warn(err);
			}
		}

		await modules.sequelize.transaction(async () => {
			if (reportCharacters) {
				try {
					await modules.reportModel.characters.create({
						characterId: char_srl,
						serverId: server_id,
						accountDBID: user_srl,
						...fields,
						reportType: 2
					});
				} catch (err) {
					modules.logger.error(err);
				}
			}

			await modules.accountModel.characters.update(fields, {
				where: {
					characterId: char_srl,
					serverId: server_id,
					accountDBID: user_srl
				}
			});
		});

		try {
			await actions.execute("modifyChar", req.body);
		} catch (err) {
			modules.logger.warn(err);
		}

		res.json({ result_code: 0 });
	}
];

/**
 * @param {modules} modules
 */
module.exports.DeleteChar = modules => [
	[
		body("char_srl").isNumeric(),
		body("server_id").isNumeric(),
		body("user_srl").isNumeric()
	],
	validationHandler(modules.logger),
	/**
	 * @type {RequestHandler}
	 */
	async (req, res, next) => {
		const { char_srl, server_id, user_srl } = req.body;

		await modules.sequelize.transaction(async () => {
			await modules.serverModel.info.decrement({ usersTotal: 1 }, {
				where: {
					serverId: server_id,
					usersTotal: { [Op.gt]: 0 }
				}
			});

			await modules.accountModel.characters.destroy({
				where: {
					characterId: char_srl,
					serverId: server_id,
					accountDBID: user_srl
				}
			});

			if (reportCharacters) {
				try {
					await modules.reportModel.characters.create({
						characterId: char_srl,
						serverId: server_id,
						accountDBID: user_srl,
						reportType: 3
					});
				} catch (err) {
					modules.logger.error(err);
				}
			}
		});

		const actions = new GameEventsActions(modules, server_id, user_srl);

		try {
			await actions.execute("deleteChar", req.body);
		} catch (err) {
			modules.logger.warn(err);
		}

		res.json({ result_code: 0 });
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
	async (req, res, next) => {
		const { server_id, chrono_id, user_srl } = req.body;

		const actions = new ChronoScrollActions(modules, server_id, user_srl);

		await actions.execute(chrono_id);

		if (reportChronoScrolls) {
			try {
				await modules.reportModel.chronoScrolls.create({
					accountDBID: user_srl,
					serverId: server_id,
					chronoId: chrono_id
				});
			} catch (err) {
				modules.logger.error(err);
			}
		}

		res.json({ result_code: 0 });
	}
];

/**
 * @param {modules} modules
 */
module.exports.ReportCheater = modules => [
	[
		body("cheat_info").notEmpty(),
		body("ip").isIP(),
		body("svr_id").isNumeric(),
		body("type").isNumeric(),
		body("usr_srl").isNumeric()
	],
	validationHandler(modules.logger),
	/**
	 * @type {RequestHandler}
	 */
	async (req, res, next) => {
		const { cheat_info, ip, svr_id, type, usr_srl } = req.body;

		const account = await modules.accountModel.info.findOne({
			where: { accountDBID: usr_srl }
		});

		if (account === null) {
			throw new ApiError("account not exist", 50000);
		}

		const userIp = ipFromLauncher ? account.get("lastLoginIP") : ip;

		if (reportCheats) {
			try {
				await modules.reportModel.cheats.create({
					accountDBID: usr_srl,
					serverId: svr_id,
					ip: userIp,
					type,
					cheatInfo: cheat_info
				});
			} catch (err) {
				modules.logger.error(err);
			}
		}

		const actions = new GameEventsActions(modules, svr_id, usr_srl);

		try {
			await actions.execute("reportCheater", { ...req.body, ip: userIp });
		} catch (err) {
			modules.logger.warn(err);
		}

		res.json({ result_code: 0 });
	}
];