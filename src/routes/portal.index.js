"use strict";

/**
* @typedef {import("../app").modules} modules
*/

const env = require("../utils/env");

/**
* @param {modules} modules
*/
module.exports = modules => {
	// Game API
	modules.app.use("/tera", require("./portal/tera.routes")(modules));

	// Shop
	modules.app.use("/shop", require("./portal/shop.routes")(modules));

	// Launcher
	if (!env.bool("API_PORTAL_LAUNCHER_DISABLE")) {
		modules.app.use("/launcher", require("./portal/launcher.routes")(modules));
	}
};