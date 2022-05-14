"use strict";

require("dotenv").config();

const express = require("express");
const morganBody = require("morgan-body");
const bodyParser = require("body-parser");

createApi(require("./routes/arbiter.index.js"), {
	name: "Arbiter",
	port: process.env.API_ARBITER_LISTEN_PORT,
	log: process.env.API_ARBITER_LOG
});

createApi(require("./routes/portal.index.js"), {
	name: "Portal",
	port: process.env.API_PORTAL_LISTEN_PORT,
	log: process.env.API_PORTAL_LOG
});

function createApi(router, params) {
	const app = express();

	app.disable("x-powered-by");
	app.use(express.json());
	app.use(bodyParser.urlencoded({ extended: true }));
	app.use(bodyParser.json());

	if (/^true$/i.test(params.log)) {
		morganBody(app);
	}

	router(app);

	app.listen(params.port, () => {
		console.log(`${params.name} API is listening at port: ${params.port}`);
	});
}