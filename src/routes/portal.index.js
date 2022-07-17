"use strict";

/**
* @typedef {import("../app").modules} modules
*/

/**
* @param {modules} modules
*/
module.exports = modules => {
	modules.app.use("/tera", require("./portal/tera.routes")(modules));
	modules.app.use("/tera", require("./portal/launcher.routes")(modules));
	modules.app.use("/tera", require("./portal/shop.routes")(modules));
};