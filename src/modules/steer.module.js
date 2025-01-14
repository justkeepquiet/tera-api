"use strict";

/**
 * @typedef {SteerFunctions} steer
 * @typedef {import("../app").modules} modules
 */

const env = require("../utils/env");
const { createLogger } = require("../utils/logger");
const SteerFunctions = require("../lib/steerFunctions");
const serverCategory = require("../lib/teraPlatformGuid").serverCategory;

/**
 * @param {modules} modules
 */
module.exports = async ({ checkComponent }) => {
	const steer = new SteerFunctions(
		env.string("STEER_HOST"),
		env.number("STEER_PORT"),
		serverCategory.webcstool, "WebIMSTool", {
			logger: createLogger("Steer", { colors: { debug: "bold magenta" } })
		}
	);

	if (checkComponent("admin_panel")) {
		if (env.bool("STEER_ENABLE")) {
			await steer.connect();
		} else {
			steer.params.logger.warn("Not configured or disabled. QA authorization for Admin Panel is used.");
		}
	}

	return steer;
};