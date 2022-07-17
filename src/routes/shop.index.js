"use strict";

/**
* @typedef {import("../app").modules} modules
*/

/**
* @param {modules} modules
*/
module.exports = modules => {
	modules.app.use("/api", require("./shop/api.routes")(modules));
};