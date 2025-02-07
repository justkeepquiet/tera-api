"use strict";

/**
* @typedef {import("../app").modules} modules
*/

/**
* @param {modules} modules
*/
module.exports = async modules => {
	modules.app.use("/systemApi", await require("./arbiter/systemApi.routes")(modules));
	modules.app.use("/authApi", await require("./arbiter/authApi.routes")(modules));
	modules.app.use("/api", await require("./arbiter/api.routes")(modules));
};