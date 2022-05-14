/* eslint-disable no-unused-vars */
"use strict";

const moment = require("moment-timezone");
const validateIP = require("validate-ip-node");
const helpers = require("../helpers/helpers");
const accountModel = require("../models/account.model");
const reportModel = require("../models/report.model");

class ApiController {
	/**
	 * @type {import("express").RequestHandler}
	 */
	static serviceTest(req, res) {
		accountModel.sequelize.authenticate().then(() =>
			res.json({
				"server_time": Date.now() / 1000,
				"result_code": 0
			})
		).catch(() =>
			res.json({
				"result_code": 1,
				"msg": "database error"
			})
		);
	}

	/**
	 * @type {import("express").RequestHandler}
	 */
	static getServerPermission(req, res) {
		// @todo
		res.json({
			"permission": 0,
			"result_code": 0
		});
	}

	/**
	 * @type {import("express").RequestHandler}
	 */
	static serverDown(req, res) {
		const { server_id } = req.body;

		accountModel.serverInfo.update({
			"isAvailable": 0, // set server is offline (me need open server manually on start?!)
			"usersOnline": 0
		}, {
			"where": {
				"serverId": server_id
			}
		});

		res.json({
			"result_code": 0
		});
	}

	/**
	 * @type {import("express").RequestHandler}
	 */
	static getUserInfo(req, res) {
		const { ip, server_id, user_srl } = req.body;

		if (!user_srl) {
			return res.json({
				"result_code": 2,
				"msg": `user_srl=${user_srl}`
			});
		}

		accountModel.info.findOne({
			"where": {
				"accountDBID": user_srl
			}
		}).then(async account => {
			let charCountInfo = "0";
			let benefit = [];

			try {
				const characters = await accountModel.characters.findAll({
					"where": {
						"accountDBID": account.get("accountDBID")
					}
				});

				charCountInfo = helpers.getCharCountString(characters, "serverId", "charCount");
			} catch (_) {}

			try {
				const benefits = await accountModel.benefits.findAll({
					"where": {
						"accountDBID": account.get("accountDBID")
					}
				});

				benefit = helpers.getBenefitsArray(benefits, "benefitId", "availableUntil");
			} catch (_) {}

			res.json({
				// "last_connected_server": account.get("lastLoginServer"),
				// "last_play_time": account.get("playTimeTotal"),
				// "logout_time_diff": account.get("playTimeLast"),
				"permission": account.get("permission"),
				"privilege": account.get("privilege"),
				"char_count_info": charCountInfo,
				"benefit": benefit,
				// "vip_pub_exp": 0, // @todo
				"result_code": 0
			});
		}).catch(() =>
			res.json({
				"result_code": 50000,
				"msg": "account not exist"
			})
		);
	}

	/**
	 * @type {import("express").RequestHandler}
	 */
	static enterGame(req, res) {
		const { ip, server_id, user_srl } = req.body;

		if (!validateIP(ip) || !server_id || !user_srl) {
			return res.json({
				"result_code": 2,
				"msg": `ip=${ip}&server_id=${server_id}&user_srl=${user_srl}`
			});
		}

		const primises = [
			accountModel.info.update({
				"lastLoginTime": moment.utc().format("YYYY-MM-DD HH:mm:ss"),
				"lastLoginIP": ip,
				"lastLoginServer": server_id,
				"playCount": accountModel.sequelize.literal("playCount + 1")
			}, {
				"where": {
					"accountDBID": user_srl
				}
			}),
			accountModel.serverInfo.increment({ "usersOnline": 1 }, {
				"where": {
					"serverId": server_id
				}
			}),
			accountModel.characters.upsert({
				"accountDBID": user_srl,
				"serverId": server_id
			})
		];

		Promise.all(primises).then(() =>
			res.json({
				"result_code": 0
			})
		).catch(() =>
			res.json({
				"result_code": 50000,
				"msg": "account not exist"
			})
		);
	}

	/**
	 * @type {import("express").RequestHandler}
	 */
	static leaveGame(req, res) {
		const { play_time, user_srl } = req.body;

		if (!play_time || !user_srl) {
			return res.json({
				"result_code": 2,
				"msg": `play_time=${play_time}&user_srl=${user_srl}`
			});
		}

		const primises = [
			accountModel.info.findOne({
				"where": {
					"accountDBID": user_srl
				}
			}).then(account =>
				accountModel.serverInfo.decrement({ "usersOnline": 1 }, {
					"where": {
						"serverId": account.get("lastLoginServer")
					}
				})
			),
			accountModel.info.update({
				"playTimeLast": play_time,
				"playTimeTotal": accountModel.sequelize.literal(`playTimeTotal + ${play_time}`)
			}, {
				"where": {
					"accountDBID": user_srl
				}
			})
		];

		Promise.all(primises).then(() =>
			res.json({
				"result_code": 0
			})
		).catch(() =>
			res.json({
				"result_code": 50000,
				"msg": "account not exist"
			})
		);
	}

	/**
	 * @type {import("express").RequestHandler}
	 */
	static createChar(req, res) {
		const { char_name, char_srl, class_id, gender_id, level, race_id, server_id, user_srl } = req.body;

		if (!server_id || !user_srl) {
			return res.json({
				"result_code": 2,
				"msg": `server_id=${server_id}&user_srl=${user_srl}`
			});
		}

		const primises = [
			accountModel.serverInfo.increment({ "usersTotal": 1 }, {
				"where": {
					"serverId": server_id
				}
			}),
			accountModel.characters.increment({ "charCount": 1 }, {
				"where": {
					"accountDBID": user_srl,
					"serverId": server_id
				}
			})
		];

		Promise.all(primises).then(() =>
			res.json({
				"result_code": 0
			})
		).catch(() =>
			res.json({
				"result_code": 50000,
				"msg": "account not exist"
			})
		);
	}

	/**
	 * @type {import("express").RequestHandler}
	 */
	static modifyChar(req, res) {
		const { char_name, char_srl, class_id, gender_id, level, race_id, server_id, user_srl } = req.body;

		// nothing here

		res.json({
			"result_code": 0
		});
	}

	/**
	 * @type {import("express").RequestHandler}
	 */
	static deleteChar(req, res) {
		const { char_srl, server_id, user_srl } = req.body;

		if (!server_id || !user_srl) {
			return res.json({
				"result_code": 2,
				"msg": `server_id=${server_id}&user_srl=${user_srl}`
			});
		}

		const primises = [
			accountModel.serverInfo.decrement({ "usersTotal": 1 }, {
				"where": {
					"serverId": server_id
				}
			}),
			accountModel.characters.decrement({ "charCount": 1 }, {
				"where": {
					"accountDBID": user_srl,
					"serverId": server_id
				}
			})
		];

		Promise.all(primises).then(() =>
			res.json({
				"result_code": 0
			})
		).catch(() =>
			res.json({
				"result_code": 50000,
				"msg": "account not exist"
			})
		);
	}

	/**
	 * @type {import("express").RequestHandler}
	 */
	static useChronoScroll(req, res) {
		const { server_id, chrono_id, user_srl } = req.body;

		if (!server_id || !chrono_id || !user_srl) {
			return res.json({
				"result_code": 2,
				"msg": `server_id=${server_id}&chrono_id=${chrono_id}&user_srl=${user_srl}`
			});
		}

		// @todo Use premium item to account

		res.json({
			"result_code": 0
		});
	}

	/**
	 * @type {import("express").RequestHandler}
	 */
	static reportCheater(req, res) {
		const { cheat_info, ip, svr_id, type, usr_srl } = req.body;

		if (!cheat_info || !validateIP(ip) || !svr_id || !type || !usr_srl) {
			return res.json({
				"result_code": 2,
				"msg": `cheat_info=${cheat_info}&ip=${ip}&svr_id=${svr_id}&type=${type}&usr_srl=${usr_srl}`
			});
		}

		reportModel.cheats.create({
			"accountDBID": usr_srl,
			"serverId": svr_id,
			"ip": ip,
			"type": type,
			"cheatInfo": cheat_info
		}).then(() =>
			res.json({
				"result_code": 0
			})
		).catch(() =>
			res.json({
				"result_code": 50000,
				"msg": "account not exist"
			})
		);
	}
}

module.exports = ApiController;