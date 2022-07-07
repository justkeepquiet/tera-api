"use strict";

/**
 * @typedef {import("../app").modules} modules
 * @typedef {import("express").RequestHandler} RequestHandler
 */

const Op = require("sequelize").Op;
const SlsBuilder = require("../utils/slsBuilder");
const ServerUpActions = require("../actions/serverUp.actions");

/**
 * @param {modules} modules
 */
module.exports.GetServerListXml = modules => [
	/**
	 * @type {RequestHandler}
	 */
	(req, res) => {
		modules.accountModel.maintenance.findOne({
			where: {
				startTime: { [Op.lt]: modules.accountModel.sequelize.fn("NOW") },
				endTime: { [Op.gt]: modules.accountModel.sequelize.fn("NOW") }
			}
		}).then(maintenance => modules.accountModel.serverStrings.findOne({
			where: { language: req.query.lang || "en" }
		}).then(strings => modules.accountModel.serverInfo.findAll({
			where: { isEnabled: 1 }
		}).then(servers => {
			if (strings === null || servers === null) {
				return res.status(500).end("getting sls error");
			}

			const sls = new SlsBuilder();
			const serverUp = new ServerUpActions(modules);

			servers.forEach(server => {
				if (/^true$/i.test(process.env.SLS_AUTO_SET_AVAILABLE) && !server.get("isAvailable")) {
					serverUp.set(
						server.get("serverId"),
						server.get("loginIp"),
						server.get("loginPort")
					);
				}

				sls.addServer(server, strings, maintenance !== null);
			});

			res.type("application/xml").send(sls.renderXML());
		}))).catch(err => {
			modules.logger.error(err);
			res.status(500).end("getting sls error");
		});
	}
];