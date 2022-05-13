"use strict";

const crypto = require("crypto");
const uuid = require("uuid");
const accountModel = require("../models/account.model");

class TeraController {
	/**
	 * @type {import("express").RequestHandler}
	 */
	static serverList(req, res) {
		// @todo
		res.send();
	}

	/**
	 * @type {import("express").RequestHandler}
	 */
	static launcherLoginAction(req, res) {
		const { userID, password } = req.body;

		if (!userID || !password) {
			return res.json({
				"Return": false,
				"ReturnCode": 2,
				"Msg": `userID=${userID}&password=${password}`
			});
		}

		accountModel.info.findOne({
			"where": {
				"userName": userID
			}
		}).then(account => {
			const authKey = uuid.v4();
			let passwordString = password;

			if (/^true$/i.test(process.env.API_USE_SHA512_PASSWORDS)) {
				passwordString = crypto.createHash("sha512").update(process.env.API_USE_SHA512_PASSWORDS_SALT + password).digest("hex");
			}

			if (account.get("passWord") !== passwordString) {
				res.json({
					"Return": false,
					"ReturnCode": 50015,
					"Msg": "password error"
				});
			} else {
				console.log("TEST");
				accountModel.info.update({
					"authKey": authKey
				}, {
					"where": {
						"accountDBID": account.get("accountDBID")
					}
				}).then(async () => {
					let characterCount = "0";

					try {
						const characters = await accountModel.characters.findAll({
							"where": {
								"accountDBID": account.get("accountDBID")
							}
						});

						characterCount = `${characters.map((c, i) => `${i}|${c.get("serverId")},${c.get("charCount")}`).join("|")}|`;
					} catch (_) {}

					res.json({
						"FailureCount": 0,
						"VipitemInfo": "",
						"PassitemInfo": "",
						"CharacterCount": characterCount,
						"Permission": account.get("permission"),
						"UserNo": account.get("accountDBID"),
						"AuthKey": authKey,
						"UserStatus": {
							"enumType": "com.common.auth.User$UserStatus",
							"name": "JOIN"
						},
						"phoneLock": false,
						"Return": true,
						"ReturnCode": 0,
						"Msg": "success"
					});
				}).catch(() =>
					res.json({
						"Return": false,
						"ReturnCode": 50811,
						"Msg": "account not exist"
					})
				);
			}
		}).catch((e) => {
			console.log(e);
			res.json({
				"Return": false,
				"ReturnCode": 50000,
				"Msg": "account not exist"
			});
		});
	}

	/**
	 * @type {import("express").RequestHandler}
	 */
	static getAccountInfoByUserNo(req, res) {
		const { id } = req.body;

		if (!id) {
			return res.json({
				"Return": false,
				"ReturnCode": 2,
				"Msg": `id=${id}`
			});
		}

		accountModel.info.findOne({
			"where": {
				"accountDBID": id
			}
		}).then(async account => {
			let characterCount = "0";

			try {
				const characters = await accountModel.characters.findAll({
					"where": {
						"accountDBID": account.get("accountDBID")
					}
				});

				characterCount = `${characters.map((c, i) => `${i}|${c.get("serverId")},${c.get("charCount")}`).join("|")}|`;
			} catch (_) {}

			res.json({
				"charcountstr": characterCount, // CharacterCount
				"passitemInfo": "", // PassitemInfo
				"permission": account.get("permission"), // Permission
				"vipitemInfo": "", // VipitemInfo
				"Return": true,
				"ReturnCode": 0,
				"Msg": "success"
			});
		}).catch(() =>
			res.json({
				"Return": false,
				"ReturnCode": 50000,
				"Msg": "account not exist"
			})
		);
	}
}

module.exports = TeraController;