"use strict";

/**
 * @typedef {import("../app").modules} modules
 */

const env = require("../utils/env");
const { createLogger } = require("../utils/logger");
const ExpressServer = require("../lib/expressServer");
const TasksActions = require("../actions/tasks.actions");

/**
 * @param {modules} modules
 */
module.exports = async modules => {
	if (!modules.checkComponent("gateway_api")) return;

	const tasksActions = new TasksActions(modules);

	if (!env.number("API_GATEWAY_LISTEN_PORT")) {
		throw "Invalid configuration parameter: API_GATEWAY_LISTEN_PORT";
	}

	const es = new ExpressServer(modules, {
		logger: createLogger("Gateway API", { colors: { debug: "italic blue" } }),
		disableCache: true,
		trustProxy: env.bool("LOG_IP_ADDRESSES_FORWARDED_FOR"),
		logLevel: env.string("LOG_LEVEL"),
		logRequests: env.bool("LOG_API_REQUESTS"),
		logIpAddresses: env.bool("LOG_IP_ADDRESSES")
	});

	es.setLogging();

	modules.pluginsLoader.loadComponent("routers.gatewayApi.before", es);
	es.setRouter("../routes/gateway.index");
	modules.pluginsLoader.loadComponent("routers.gatewayApi.after", es);

	await es.bind(
		env.string("API_GATEWAY_LISTEN_HOST"),
		env.number("API_GATEWAY_LISTEN_PORT")
	);

	modules.queue.setModel(modules.queueModel.tasks);
	modules.queue.setHandlers(tasksActions);
};