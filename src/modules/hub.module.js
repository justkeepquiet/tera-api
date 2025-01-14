"use strict";

/**
 * @typedef {HubFunctions} hub
 * @typedef {import("../app").modules} modules
 */

const env = require("../utils/env");
const { createLogger } = require("../utils/logger");
const HubFunctions = require("../lib/hubFunctions");
const serverCategory = require("../lib/teraPlatformGuid").serverCategory;

/**
 * @param {modules} modules
 */
module.exports = async () => {
	const hub = new HubFunctions(
		env.string("HUB_HOST"),
		env.number("HUB_PORT"),
		serverCategory.webcstool, {
			logger: createLogger("Hub", { colors: { debug: "magenta" } })
		}
	);

	await hub.connect();

	return hub;
};