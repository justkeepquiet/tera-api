"use strict";

/**
 * @typedef {express.Express} app
 */

const express = require("express");
const morgan = require("morgan");
const morganBody = require("morgan-body");
const cookieParser = require("cookie-parser");
const compression = require("compression");

class ExpressServer {
	constructor(modules, params) {
		this.app = express();

		this.logger = params.logger || console;
		this.logLevel = params.logLevel || "debug";
		this.logIpAddressesEnabled = !!params.logIpAddressesEnabled;
		this.logRequestsEnabled = !!params.logRequestsEnabled;
		this.cacheEnabled = !!params.cacheEnabled;
		this.compressionEnabled = !!params.compressionEnabled;
		this.viewsPath = params.viewsPath;

		this.modules = { ...modules, app: this.app, logger: this.logger };
		this.views = new Set();

		if (params.trustProxyEnabled) {
			const trustProxyHosts = params.trustProxyHosts || [];

			if (trustProxyHosts.length > 0) {
				this.app.set("trust proxy", trustProxyHosts);
			} else {
				this.app.set("trust proxy", true);
			}
		}

		this.app.disable("x-powered-by");
		this.app.disable("etag");

		this.app.use(express.json());
		this.app.use(express.urlencoded({ extended: true }));
		this.app.use(cookieParser());

		this.app.use((req, res, next) => {
			res.locals.__req = req;
			res.locals.__endpoint = req.path;

			next();
		});

		this.app.use((req, res, next) => {
			res.set("Cache-Control", "no-store, no-cache, must-revalidate, proxy-revalidate");
			res.set("Expires", 0);

			next();
		});

		if (this.compressionEnabled) {
			this.app.use(compression());
		}

		this.app.set("view engine", "ejs");

		if (this.viewsPath) {
			this.setViews(this.viewsPath);
		}

		if (/^debug$/i.test(this.logLevel)) {
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
		if (this.logRequestsEnabled) {
			let logFormat = ":method :url :status - :response-time ms";

			if (this.logIpAddressesEnabled) {
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
		this.app.use(endpoint, (req, res, next) => {
			if (this.cacheEnabled) {
				const maxAge = 300;
				const expires = new Date(Date.now() + maxAge * 1000).toUTCString();

				res.set("Cache-Control", `public, max-age=${maxAge}`);
				res.set("Expires", expires);
			} else {
				res.set("Cache-Control", "no-store, no-cache, must-revalidate, proxy-revalidate");
				res.set("Expires", 0);
			}

			next();
		});

		this.app.use(endpoint, express.static(directory));
	}

	async setRouter(router) {
		await require(router)(this.modules);
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