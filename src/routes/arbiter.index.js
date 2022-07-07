"use strict";

/**
* @typedef {import("../app").modules} modules
*/

/**
* @param {modules} modules
*/
module.exports = modules => {
	modules.app.use("/systemApi", require("./arbiter/systemApi.routes")(modules));
	modules.app.use("/authApi", require("./arbiter/authApi.routes")(modules));
	modules.app.use("/api", require("./arbiter/api.routes")(modules));
};