"use strict";

/**
* @typedef {import("../app").modules} modules
*/

/**
* @param {modules} modules
*/
module.exports = modules => {
	// Game API
	modules.app.use("/tera", require("./portal/tera.routes")(modules));

	// Shop
	modules.app.use("/shop", require("./portal/shop.routes")(modules));

	// Launcher
	modules.app.use("/launcher", require("./portal/launcher.routes")(modules));

	// Launcher V2
	modules.app.use("/v2/launcher", require("./portal/v2/launcher.routes")(modules));
};