"use strict";

module.exports = app => {
	app.use("/systemApi", require("./arbiter/systemApi.routes"));
	app.use("/authApi", require("./arbiter/authApi.routes"));
	app.use("/api", require("./arbiter/api.routes"));
};