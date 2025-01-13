"use strict";

/**
 * @typedef {express.Express} app
 */

const express = require("express");
const path = require("path");
const morgan = require("morgan");
const morganBody = require("morgan-body");
const cookieParser = require("cookie-parser");
const compression = require("compression");

const env = require("../utils/env");

const VIEWS_PATH = "../views";

class ExpressServer {
	constructor(modules, params) {
		this.app = express();

		this.logger = params.logger || console;
		this.disableCache = !!params.disableCache;
		this.enableCompression = params.enableCompression !== undefined ?
			!!params.enableCompression : false;

		this.modules = { ...modules, app: this.app, logger: this.logger };
		this.views = new Set();

		if (env.bool("LOG_IP_ADDRESSES_FORWARDED_FOR")) {
			this.app.enable("trust proxy");
		}

		this.app.disable("x-powered-by");
		this.app.use(express.json());
		this.app.use(express.urlencoded({ extended: true }));
		this.app.use(cookieParser());

		this.app.use((req, res, next) => {
			res.locals.__req = req;
			res.locals.__endpoint = req.path;
			next();
		});

		if (this.enableCompression) {
			this.app.use(compression());
		}

		if (this.disableCache) {
			this.app.use((req, res, next) => {
				res.set("Cache-Control", "no-store");
				next();
			});

			this.app.set("etag", false);
		}

		this.app.set("view engine", "ejs");
		this.setViews(path.resolve(__dirname, VIEWS_PATH));

		if (/^debug$/i.test(env.string("LOG_LEVEL"))) {
			morganBody(this.app, {
				noColors: true,
				prettify: false,
				logReqDateTime: false,
				logReqUserAgent: false,
				stream: {
					write: text => this.logger.debug(text.trim())
				}
			});
		}
	}

	setLogging() {
		if (env.bool("LOG_API_REQUESTS")) {
			let logFormat = ":method :url :status - :response-time ms";

			if (env.bool("LOG_IP_ADDRESSES")) {
				logFormat = ":remote-addr :method :url :status - :response-time ms";
			}

			this.app.use(morgan(logFormat, {
				skip: (req, res) => res.statusCode < 400,
				stream: { write: text => this.logger.warn(text.trim()) }
			}));

			this.app.use(morgan(logFormat, {
				skip: (req, res) => res.statusCode >= 400,
				stream: { write: text => this.logger.info(text.trim()) }
			}));
		}
	}

	setStatic(endpoint, directory) {
		if (!this.disableCache) {
			this.app.use(endpoint, (req, res, next) => {
				res.set("Cache-Control", "public, max-age=300");
				next();
			});
		}

		this.app.use(endpoint, express.static(directory));
	}

	setRouter(router) {
		require(router)(this.modules);
	}

	setViews(views) {
		this.views.add(views);
		this.app.set("views", Array.from(this.views));
	}

	bind(host, port) {
		this.app.use((req, res) =>
			res.status(404).send(`Invalid endpoint: ${req.url}`)
		);

		return new Promise((resolve, reject) => {
			this.app.listen(port, host || "0.0.0.0")
				.on("listening", () => {
					this.logger.info(`Listening at: ${!host ? "*" : host}:${port}`);
					resolve();
				})
				.on("error", err => {
					this.logger.error(`Error: ${err.message}`);
					reject();
				});
		});
	}
}

module.exports = ExpressServer;