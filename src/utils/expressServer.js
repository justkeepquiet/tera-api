"use strict";

const express = require("express");
const path = require("path");
const morgan = require("morgan");
const morganBody = require("morgan-body");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const logger = require("./logger");

class ExpressServer {
	constructor(displayName, disableCache = true) {
		this.app = express();
		this.displayName = displayName;

		if (/^true$/i.test(process.env.LOG_IP_ADDRESSES_FORWARDED_FOR)) {
			this.app.enable("trust proxy");
		}

		this.app.disable("x-powered-by");
		this.app.use(express.json());
		this.app.use(bodyParser.urlencoded({ extended: true }));
		this.app.use(bodyParser.json());
		this.app.use(cookieParser());

		this.app.use((req, res, next) => {
			res.locals.__endpoint = req.path;
			next();
		});

		if (disableCache) {
			this.app.use((req, res, next) => {
				res.set("Cache-Control", "no-store");
				next();
			});

			this.app.set("etag", false);
		}

		this.app.set("view engine", "ejs");
		this.app.set("views", path.resolve(__dirname, "../views"));

		if (/^debug$/i.test(process.env.LOG_LEVEL)) {
			morganBody(this.app, {
				noColors: true,
				prettify: false,
				logReqDateTime: false,
				logReqUserAgent: false,
				stream: {
					write: text => logger.debug(`${this.displayName}: ${text.trim()}`)
				}
			});
		}
	}

	setLogging() {
		if (/^true$/i.test(process.env.LOG_API_REQUESTS)) {
			let logFormat = `${this.displayName}: :method :url :status - :response-time ms`;

			if (/^true$/i.test(process.env.LOG_IP_ADDRESSES)) {
				logFormat = `${this.displayName}: :remote-addr :method :url :status - :response-time ms`;
			}

			this.app.use(morgan(logFormat, {
				stream: {
					write: text => logger.info(text.trim())
				}
			}));
		}
	}

	setStatic(endpoint, directory) {
		this.app.use(endpoint, express.static(directory));
	}

	setRouter(router) {
		router(this.app);
	}

	bind(host, port) {
		this.app.use((req, res) =>
			res.status(404).send(`Invalid endpoint: ${req.url}`)
		);

		this.app.listen(port, host, () =>
			logger.info(`${this.displayName} is listening at: ${!host ? "*" : host}:${port}`)
		).on("error", err => {
			logger.error(`${this.displayName} has error: ${err.message}`);
			process.exit();
		});
	}
}

module.exports = ExpressServer;