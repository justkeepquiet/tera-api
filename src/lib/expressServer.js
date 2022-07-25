"use strict";

/**
 * @typedef {express.Express} app
 */

const express = require("express");
const path = require("path");
const morgan = require("morgan");
const morganBody = require("morgan-body");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");

class ExpressServer {
	constructor(modules, params) {
		this.app = express();

		this.logger = params.logger || console;
		this.disableCache = !!params.disableCache;

		this.modules = { ...modules, app: this.app, logger: this.logger };

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

		if (this.disableCache) {
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
					write: text => this.logger.debug(text.trim())
				}
			});
		}
	}

	setLogging() {
		if (/^true$/i.test(process.env.LOG_API_REQUESTS)) {
			let logFormat = ":method :url :status - :response-time ms";

			if (/^true$/i.test(process.env.LOG_IP_ADDRESSES)) {
				logFormat = ":remote-addr :method :url :status - :response-time ms";
			}

			this.app.use(morgan(logFormat, {
				stream: {
					write: text => this.logger.info(text.trim())
				}
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

	bind(host, port) {
		this.app.use((req, res) =>
			res.status(404).send(`Invalid endpoint: ${req.url}`)
		);

		return new Promise((resolve, reject) => {
			this.app.listen(port, host || "0.0.0.0", () => {
				this.logger.info(`Listening at: ${!host ? "*" : host}:${port}`);
				resolve();
			}).on("error", err => {
				this.logger.error(`Error: ${err.message}`);
				reject();
			});
		});
	}
}

module.exports = ExpressServer;