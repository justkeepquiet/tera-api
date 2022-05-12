"use strict";

module.exports = app => {
	app.use("/systemApi", require("./routes.systemApi"));
	app.use("/authApi", require("./routes.authApi"));
	app.use("/api", require("./routes.api"));
	app.use("/tera", require("./routes.tera"));
};