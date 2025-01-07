"use strict";

/**
 * @typedef {import("express").RequestHandler} RequestHandler
 * @typedef {import("express").ErrorRequestHandler} ErrorRequestHandler
 * @typedef {import("../app").modules} modules
 */

const Op = require("sequelize").Op;

const SlsBuilder = require("../utils/slsBuilder");
const SlsOverrideHandler = require("../utils/slsOverrideHandler");

const applyServerOverride = async (config, servers, clientIp, geoip, ipapi, logger) => {
	try {
		const slsOverride = config.get("slsOverride");
		const serverOverrideHandler = new SlsOverrideHandler(slsOverride, clientIp, geoip, ipapi, logger);

		for (const server of servers) {
			await serverOverrideHandler.applyOverrides(server);
		}
	} catch (_) {
		logger.debug("Config file slsOverride is not found. Skip overrides.");
	}
};

/**
 * @param {modules} modules
 */
module.exports.GetServerList = ({ config, logger, sequelize, geoip, ipapi, serverModel }, format) => [
	/**
	 * @type {RequestHandler}
	 */
	async (req, res) => {
		const strings = await serverModel.strings.findOne({
			where: { language: req.query.lang || "en" }
		});

		if (strings === null) {
			res.status(500).end("Invalid SLS language");
			return;
		}

		const servers = await serverModel.info.findAll({ where: { isEnabled: 1 } });
		const maintenance = await serverModel.maintenance.findOne({
			where: {
				startTime: { [Op.lt]: sequelize.fn("NOW") },
				endTime: { [Op.gt]: sequelize.fn("NOW") }
			}
		});

		const sls = new SlsBuilder();

		servers.forEach(server =>
			sls.addServer(server, strings, maintenance !== null)
		);

		await applyServerOverride(config, sls.servers, req.ip, geoip, ipapi, logger);

		switch (format) {
			case "xml":
				res.type("application/xml").send(sls.renderXML(true));
				break;
			case "json":
				res.type("application/json").send(sls.renderJSON(true, Number(req.query.sort ?? 3)));
				break;
			default:
				res.status(500).end("Invalid SLS format");
				break;
		}
	},
	/**
	 * @type {ErrorRequestHandler}
	 */
	(err, req, res, next) => {
		logger.error(err);
		res.status(500).end("Getting SLS error");
	}
];