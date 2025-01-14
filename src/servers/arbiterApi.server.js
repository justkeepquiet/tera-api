"use strict";

/**
 * @typedef {import("../app").modules} modules
 */

const env = require("../utils/env");
const { createLogger } = require("../utils/logger");
const { expr } = require("../lib/scheduler");
const ExpressServer = require("../lib/expressServer");
const ServerCheckActions = require("../actions/serverCheck.actions");

/**
 * @param {modules} modules
 */
module.exports = async modules => {
	if (!modules.checkComponent("arbiter_api")) return;

	if (!env.number("API_ARBITER_LISTEN_PORT")) {
		throw "Invalid configuration parameter: API_ARBITER_LISTEN_PORT";
	}

	const es = new ExpressServer(modules, {
		logger: createLogger("Arbiter API", { colors: { debug: "bold blue" } }),
		disableCache: true
	});

	es.setLogging();
	es.setRouter("../routes/arbiter.index");

	await es.bind(
		env.string("API_ARBITER_LISTEN_HOST"),
		env.number("API_ARBITER_LISTEN_PORT")
	);

	const allowPortCheck = env.bool("API_ARBITER_SERVER_PORT_CHECK");
	const serverCheckActions = new ServerCheckActions(modules);

	modules.scheduler.start({
		name: "serverCheckActions",
		schedule: expr.EVERY_TEN_SECONDS
	}, () =>
		serverCheckActions.all(allowPortCheck)
	);

	serverCheckActions.all(allowPortCheck);
};