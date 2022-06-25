"use strict";

module.exports = app => {
	app.use("/", require("./admin/admin.routes"));
};