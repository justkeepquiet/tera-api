"use strict";

/**
* @typedef {import("../app").modules} modules
*/

/**
* @param {modules} modules
*/
module.exports = async modules => {
	modules.app.use("/", await require("./admin/admin.routes")(modules));

	modules.app.use((req, res) =>
		res.redirect("/")
	);
};