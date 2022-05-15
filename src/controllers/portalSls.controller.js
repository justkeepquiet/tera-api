"use strict";

const xmlbuilder = require("xmlbuilder");
const logger = require("../utils/logger");
const accountModel = require("../models/account.model");

module.exports = {
	getServerListXML: [
		/**
		 * @type {import("express").RequestHandler}
		 */
		(req, res) => {
			accountModel.serverStrings.findOne({
				where: { language: req.query.lang || "en" }
			}).then(strings => accountModel.serverInfo.findAll({
				where: { isEnabled: 1 }
			}).then(servers => {
				const xml = xmlbuilder.create("serverlist", { encoding: "utf-8" });

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
						.ele("category", { sort: category[0] }, category[1]).up()
						.ele("name", { raw_name: server.get("nameString") }).cdata(server.get("nameString")).up()
						.ele("crowdness", { sort: crowdness[0] }, crowdness[1]).up()
						.ele("open", { sort: open[0] }).cdata(open[1]).up()
						.ele("permission_mask", permissionMask).up()
						.ele("server_stat", "0x00000000").up()
						.ele("popup").cdata(strings.get("popup")).up()
						.ele("language", server.get("language")).up();
				});

				res.type("application/xml");
				res.send(xml.end({ pretty: true }));
			})).catch(err => {
				logger.error(err.toString());
				res.status(500).end("getting sls error");
			});
		}
	]
};