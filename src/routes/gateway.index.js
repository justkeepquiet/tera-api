"use strict";

/**
* @typedef {import("../app").modules} modules
*/

/**
* @param {modules} modules
*/
module.exports = modules => {
	modules.app.use("/serverApi", require("./gateway/serverApi.routes")(modules));
	modules.app.use("/accountApi", require("./gateway/accountApi.routes")(modules));
	modules.app.use("/shopApi", require("./gateway/shopApi.routes")(modules));
};