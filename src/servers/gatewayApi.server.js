"use strict";

/**
 * @typedef {import("../app").modules} modules
 */

const env = require("../utils/env");
const { createLogger } = require("../utils/logger");
const ExpressServer = require("../lib/expressServer");

/**
 * @param {modules} modules
 */
module.exports = async modules => {
	if (!modules.checkComponent("gateway_api")) return;

	if (!env.number("API_GATEWAY_LISTEN_PORT")) {
		throw "Invalid configuration parameter: API_GATEWAY_LISTEN_PORT";
	}

	const es = new ExpressServer(modules, {
		logger: createLogger("Gateway API", { colors: { debug: "italic blue" } }),
		disableCache: true
	});

	es.setLogging();

	modules.pluginsLoader.loadComponent("routers.gatewayApi.before", es);
	es.setRouter("../routes/gateway.index");
	modules.pluginsLoader.loadComponent("routers.gatewayApi.after", es);

	await es.bind(
		env.string("API_GATEWAY_LISTEN_HOST"),
		env.number("API_GATEWAY_LISTEN_PORT")
	);
};