"use strict";

/**
 * @typedef {import("express").RequestHandler} RequestHandler
 * @typedef {import("express").ErrorRequestHandler} ErrorRequestHandler
 * @typedef {import("../app").modules} modules
 */

const Op = require("sequelize").Op;

const SlsBuilder = require("../utils/slsBuilder");
const { requireReload } = require("../utils/helpers");
const SlsOverrideHandler = require("../utils/slsOverrideHandler");

const applyServerOverride = async (servers, clientIp, geoip, logger) => {
	try {
		const slsOverride = requireReload("../../config/slsOverride");
		const serverOverrideHandler = new SlsOverrideHandler(slsOverride, clientIp, geoip, logger);

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
module.exports.GetServerListXml = ({ logger, sequelize, geoip, serverModel }) => [
	/**
	 * @type {RequestHandler}
	 */
	async (req, res) => {
		const strings = await serverModel.strings.findOne({
			where: { language: req.query.lang || "en" }
		});

		if (strings === null) {
			return res.status(500).end("getting strings error");
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

		await applyServerOverride(sls.servers, req.ip, geoip, logger);

		res.type("application/xml").send(sls.renderXML());
	},
	/**
	 * @type {ErrorRequestHandler}
	 */
	(err, req, res, next) => {
		logger.error(err);
		res.status(500).end("getting sls error");
	}
];