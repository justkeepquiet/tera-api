"use strict";

/**
 * @typedef {import("../app").modules} modules
 * @typedef {import("express").RequestHandler} RequestHandler
 */

const Op = require("sequelize").Op;
const SlsBuilder = require("../utils/slsBuilder");
const { requireReload } = require("../utils/helpers");
const SlsOverrideHandler = require("../utils/slsOverrideHandler");

const applyServerOverride = (logger, servers, clientIp, geoip) => {
	try {
		const slsOverride = requireReload("../../config/slsOverride");

		try {
			const serverOverrideHandler = new SlsOverrideHandler(slsOverride, clientIp, geoip);

			servers.forEach(server => {
				serverOverrideHandler.applyOverrides(server);
			});
		} catch (err) {
			logger.warn(err);
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
		try {
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

			applyServerOverride(logger, sls.servers, req.ip, geoip);

			res.type("application/xml").send(sls.renderXML());
		} catch (err) {
			logger.error(err);
			res.status(500).end("getting sls error");
		}
	}
];