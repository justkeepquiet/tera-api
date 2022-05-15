"use strict";

require("dotenv").config();

const express = require("express");
const morgan = require("morgan");
const morganBody = require("morgan-body");
const bodyParser = require("body-parser");
const logger = require("./helpers/logger");

const createApi = (router, params) => {
	const app = express();

	app.disable("x-powered-by");
	app.use(express.json());
	app.use(bodyParser.urlencoded({ extended: true }));
	app.use(bodyParser.json());

	morgan.token("api-name", () => params.name);

	app.use(morgan(":api-name :method :url :status - :response-time ms", {
		stream: { write: text => logger.info(text.trim()) }
	}));

	if (/^debug$/i.test(process.env.API_LOG_LEVEL)) {
		morganBody(app, {
			noColors: true,
			prettify: false,
			logReqDateTime: false,
			logReqUserAgent: false,
			stream: { write: text => logger.debug(text.trim()) }
		});
	}

	router(app);

	app.use((req, res) =>
		res.status(404).send(`Invalid endpoint: ${req.url}`)
	);
	app.listen(params.port, () =>
		logger.info(`${params.name} API is listening at port: ${params.port}`)
	);
};

createApi(require("./routes/arbiter.index.js"), {
	name: "Arbiter",
	port: process.env.API_ARBITER_LISTEN_PORT
});

createApi(require("./routes/portal.index.js"), {
	name: "Portal",
	port: process.env.API_PORTAL_LISTEN_PORT
});