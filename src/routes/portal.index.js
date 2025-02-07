"use strict";

/**
* @typedef {import("../app").modules} modules
*/

const env = require("../utils/env");

/**
* @param {modules} modules
*/
module.exports = async modules => {
	// Game API
	modules.app.use("/tera", await require("./portal/tera.routes")(modules));

	// Shop
	modules.app.use("/shop", await require("./portal/shop.routes")(modules));

	// Launcher
	if (!env.bool("API_PORTAL_LAUNCHER_DISABLE")) {
		modules.app.use("/launcher", await require("./portal/launcher.routes")(modules));
	}
};