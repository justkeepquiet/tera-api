"use strict";

/**
 * @typedef {import("../app").modules} modules
 * @typedef {import("express").RequestHandler} RequestHandler
 */

const Op = require("sequelize").Op;
const SlsBuilder = require("../lib/slsBuilder");

/**
 * @param {modules} modules
 */
module.exports.GetServerListXml = modules => [
	/**
	 * @type {RequestHandler}
	 */
	(req, res) => {
		modules.serverModel.maintenance.findOne({
			where: {
				startTime: { [Op.lt]: modules.sequelize.fn("NOW") },
				endTime: { [Op.gt]: modules.sequelize.fn("NOW") }
			}
		}).then(maintenance => modules.serverModel.strings.findOne({
			where: { language: req.query.lang || "en" }
		}).then(strings => modules.serverModel.info.findAll({
			where: { isEnabled: 1 }
		}).then(servers => {
			if (strings === null) {
				return res.status(500).end("getting sls error");
			}

			const sls = new SlsBuilder();

			servers.forEach(server =>
				sls.addServer(server, strings, maintenance !== null)
			);

			res.type("application/xml").send(sls.renderXML());
		}))).catch(err => {
			modules.logger.error(err);
			res.status(500).end("getting sls error");
		});
	}
];