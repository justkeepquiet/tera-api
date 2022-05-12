/* eslint-disable no-unused-vars */
"use strict";

const validateIP = require("validate-ip-node");
const accountModel = require("../models/account.model");

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

		// @todo Update server status
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
			let char_count_info = "0";
			let benefit = [];

			try {
				const characters = await accountModel.characters.findAll({
					"where": {
						"accountDBID": account.get("accountDBID")
					}
				});

				char_count_info = `${characters.map((c, i) => `${i}|${c.get("serverId")},${c.get("charCount")}`).join("|")}|`;
			} catch (_) {}

			try {
				const benefits = await accountModel.benefits.findAll({
					"where": {
						"accountDBID": account.get("accountDBID")
					}
				});

				benefit = benefits.map(b => [b.get("benefitId"), b.get("availableUntil")]);
			} catch (_) {}

			res.json({
				"vip_pub_exp": 0, // @todo
				"permission": account.get("isBlocked"),
				"privilege": account.get("privilege"),
				"char_count_info": char_count_info,
				"benefit": benefit,
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
				"lastLoginTime": Math.floor(Date.now() / 1000),
				"lastLoginIP": ip
			}, {
				"where": {
					"accountDBID": user_srl
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

		accountModel.info.update({
			"playTimeLast": play_time,
			"playTimeTotal": accountModel.sequelize.literal(`playTimeTotal + ${play_time}`)
		}, {
			"where": {
				"accountDBID": user_srl
			}
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

		accountModel.characters.increment({ "charCount": 1 }, {
			"where": {
				"accountDBID": user_srl,
				"serverId": server_id
			}
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

	/**
	 * @type {import("express").RequestHandler}
	 */
	static modifyChar(req, res) {
		const { char_name, char_srl, class_id, gender_id, level, race_id, server_id, user_srl } = req.body;

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

		accountModel.characters.decrement({ "charCount": 1 }, {
			"where": {
				"accountDBID": user_srl,
				"serverId": server_id
			}
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

		// @todo Write cheats report to database

		res.json({
			"result_code": 0
		});
	}
}

module.exports = ApiController;