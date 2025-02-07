"use strict";

/**
* @typedef {import("../app").modules} modules
*/

/**
* @param {modules} modules
*/
module.exports = async modules => {
	modules.app.use("/serverApi", await require("./gateway/serverApi.routes")(modules));
	modules.app.use("/accountApi", await require("./gateway/accountApi.routes")(modules));
	modules.app.use("/shopApi", await require("./gateway/shopApi.routes")(modules));
	modules.app.use("/boxApi", await require("./gateway/boxApi.routes")(modules));
};