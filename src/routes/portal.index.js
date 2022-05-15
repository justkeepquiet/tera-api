"use strict";

module.exports = app => {
	app.use("/tera", require("./portal/tera.routes"));
};