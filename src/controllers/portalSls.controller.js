"use strict";

const logger = require("../utils/logger");
const SlsBuilder = require("../utils/slsBuilder");
const accountModel = require("../models/account.model");

module.exports = {
	GetServerListXML: [
		/**
		 * @type {import("express").RequestHandler}
		 */
		(req, res) => {
			accountModel.serverStrings.findOne({
				where: { language: req.query.lang || "en" }
			}).then(strings => accountModel.serverInfo.findAll({
				where: { isEnabled: 1 }
			}).then(servers => {
				if (strings === null || servers === null) {
					return res.status(500).end("getting sls error");
				}

				const sls = new SlsBuilder();
				servers.forEach(server =>
					sls.addServer(server, strings)
				);

				res.type("application/xml").send(sls.renderXML());
			})).catch(err => {
				logger.error(err.toString());
				res.status(500).end("getting sls error");
			});
		}
	]
};