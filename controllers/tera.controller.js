"use strict";

const crypto = require("crypto");
const uuid = require("uuid");
const xmlbuilder = require("xmlbuilder");
const helpers = require("../helpers/helpers");
const accountModel = require("../models/account.model");

class TeraController {
	/**
	 * @type {import("express").RequestHandler}
	 */
	static serverList(req, res) {
		accountModel.serverStrings.findOne({
			"where": {
				"language": req.query.lang || "en"
			}
		}).then(strings => accountModel.serverInfo.findAll({
			"where": {
				"isEnabled": 1
			}
		}).then(servers => {
			const xml = xmlbuilder.create("serverlist", { "encoding": "utf-8" });

			servers.forEach(server => {
				const category = server.get("isPvE") ?
					[1, strings.get("categoryPvE")] :
					[2, strings.get("categoryPvP")];

				const crowdness = server.get("isCrowdness") ?
					[2, strings.get("crowdYes")] :
					[1, strings.get("crowdNo")];

				let permissionMask = "0x00010000";
				let open = [0, `<font color="#990000">${strings.get("serverOffline")}</font>`];

				if (server.get("isAvailable")) {
					permissionMask = "0x00000000";
					open = [1, `<font color="#00ff00">${strings.get("serverLow")}</font>`];

					if (server.get("usersOnline") > server.get("tresholdLow")) {
						open = [2, `<font color="#ffffff">${strings.get("serverMedium")}</font>`];
					}
					if (server.get("usersOnline") > server.get("tresholdMedium")) {
						open = [3, `<font color="#ffff00">${strings.get("serverHigh")}</font>`];
					}
				}

				xml.ele("server")
					.ele("id", server.get("serverId")).up()
					.ele("ip", server.get("loginIp")).up()
					.ele("port", server.get("loginPort")).up()
					.ele("category", { "sort": category[0] }, category[1]).up()
					.ele("name", { "raw_name": server.get("nameString") }).cdata(server.get("nameString")).up()
					.ele("crowdness", { "sort": crowdness[0] }, crowdness[1]).up()
					.ele("open", { "sort": open[0] }).cdata(open[1]).up()
					.ele("permission_mask", permissionMask).up()
					.ele("server_stat", "0x00000000").up()
					.ele("popup").cdata(strings.get("popup")).up()
					.ele("language", server.get("language")).up();
			});

			res.type("application/xml");
			res.send(xml.end({
				"pretty": true
			}));
		})).catch(() => {
			res.status(500).end("getting sls error");
		});
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
			let characterCount = "0";

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
				accountModel.info.update({
					"authKey": authKey
				}, {
					"where": {
						"accountDBID": account.get("accountDBID")
					}
				}).then(async () => {
					try {
						const characters = await accountModel.characters.findAll({
							"where": {
								"accountDBID": account.get("accountDBID")
							}
						});

						characterCount = helpers.getCharCountString(characters, "serverId", "charCount");
					} catch (_) {}

					res.json({
						"Return": true,
						"ReturnCode": 0,
						"Msg": "success",
						"VipitemInfo": "", // @todo
						"PassitemInfo": "", // @todo
						"CharacterCount": characterCount,
						"Permission": account.get("permission"),
						"UserNo": account.get("accountDBID"),
						"AuthKey": authKey
					});
				}).catch(() =>
					res.json({
						"Return": false,
						"ReturnCode": 50811,
						"Msg": "failure insert auth token"
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

				characterCount = helpers.getCharCountString(characters, "serverId", "charCount");
			} catch (_) {}

			res.json({
				"Return": true,
				"ReturnCode": 0,
				"Msg": "success",
				"VipitemInfo": "", // @todo
				"PassitemInfo": "", // @todo
				"CharacterCount": characterCount,
				"Permission": account.get("permission")
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