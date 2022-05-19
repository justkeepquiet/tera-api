"use strict";

require("dotenv").config();

const express = require("express");
const path = require("path");
const morgan = require("morgan");
const morganBody = require("morgan-body");
const bodyParser = require("body-parser");
const logger = require("./utils/logger");

class API {
	constructor(displayName) {
		this.app = express();
		this.displayName = displayName;

		if (/^true$/i.test(process.env.LOG_IP_ADDRESSES_FORWARDED_FOR)) {
			this.app.enable("trust proxy");
		}

		this.app.disable("x-powered-by");
		this.app.use(express.json());
		this.app.use(bodyParser.urlencoded({ extended: true }));
		this.app.use(bodyParser.json());

		this.app.use((req, res, next) => {
			res.set("Cache-Control", "no-store");
			next();
		});

		this.app.set("etag", false);
		this.app.set("view engine", "ejs");
		this.app.set("views", path.resolve(__dirname, "views"));

		if (/^debug$/i.test(process.env.LOG_LEVEL)) {
			morganBody(this.app, {
				noColors: true,
				prettify: false,
				logReqDateTime: false,
				logReqUserAgent: false,
				stream: { write: text => logger.debug(text.trim()) }
			});
		}
	}

	setRouter(router) {
		if (/^true$/i.test(process.env.LOG_API_REQUESTS)) {
			let logFormat = `${this.displayName}: :method :url :status - :response-time ms`;

			if (/^true$/i.test(process.env.LOG_IP_ADDRESSES)) {
				logFormat = `${this.displayName}: :remote-addr :method :url :status - :response-time ms`;
			}

			this.app.use(morgan(logFormat, {
				stream: { write: text => logger.info(text.trim()) }
			}));
		}

		router(this.app);
	}

	setStatic(endpoint, directory) {
		this.app.use(endpoint, express.static(directory));
	}

	bind(host, port) {
		this.app.use((req, res) =>
			res.status(404).send(`Invalid endpoint: ${req.url}`)
		);

		this.app.listen(port, host, () =>
			logger.info(`${this.displayName} API is listening at: ${!host ? "*" : host}:${port}`)
		).on("error", err =>
			logger.error(`${this.displayName} API has error: ${err.message}`)
		);
	}
}

const arbiterApi = new API("Arbiter");
const portalApi = new API("Portal");

if (/^true$/i.test(process.env.API_PORTAL_PUBLIC_FOLDER_ENABLE)) {
	portalApi.setStatic("/public", "public");
}

arbiterApi.setRouter(require("./routes/arbiter.index"));
portalApi.setRouter(require("./routes/portal.index"));

arbiterApi.bind(
	process.env.API_ARBITER_LISTEN_HOST,
	process.env.API_ARBITER_LISTEN_PORT
);

portalApi.bind(
	process.env.API_PORTAL_LISTEN_HOST,
	process.env.API_PORTAL_LISTEN_PORT
);