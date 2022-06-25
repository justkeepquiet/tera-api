"use strict";

const path = require("path");
const I18n = require("i18n").I18n;
const jwt = require("jsonwebtoken");
const logger = require("../utils/logger");
const helpers = require("../utils/helpers");
const SteerConnection = require("../utils/steerConnection");

const steer = new SteerConnection(
	process.env.ADMIN_PANEL_STEER_HOST,
	process.env.ADMIN_PANEL_STEER_PORT,
	19, "WebIMSTool", { logger }
);

if (/^true$/i.test(process.env.ADMIN_PANEL_STEER_ENABLE)) {
	steer.connect().catch(err =>
		logger.warn(err.toString())
	);
}

if (!process.env.ADMIN_PANEL_LOCALE) {
	logger.error("Invalid configuration parameter: ADMIN_PANEL_LOCALE");
	process.exit();
}

module.exports.i18n = new I18n({
	directory: path.resolve(__dirname, "../locales/admin"),
	defaultLocale: process.env.ADMIN_PANEL_LOCALE
});

/**
 * @type {import("express").RequestHandler}
 */
module.exports.i18nHandler = (req, res, next) => {
	res.locals.__ = module.exports.i18n.__;
	return next();
};

/**
 * @type {import("express").RequestHandler}
 */
module.exports.validationHandler = (req, res, next) => {
	if (!helpers.validationResultLog(req).isEmpty()) {
		return module.exports.resultJson(res, 2, { msg: "invalid parameter" });
	}

	next();
};

module.exports.accessFunctionHandler = (functionId = null) =>
	/**
	 * @type {import("express").RequestHandler}
	 */
	(req, res, next) => new Promise((resolve, reject) => {
		req.__payload = {};

		try {
			req.__payload = jwt.verify(req.cookies.token, process.env.ADMIN_PANEL_JWT_SECRET);
		} catch (err) {
			return reject(err);
		}

		if (!/^true$/i.test(process.env.ADMIN_PANEL_STEER_ENABLE)) {
			return req.__payload.login !== process.env.ADMIN_PANEL_QA_LOGIN || req.__payload.password !== process.env.ADMIN_PANEL_QA_PASSWORD ?
				reject("Invalid QA login or password") :
				resolve();
		}

		return steer.validateSessionKey(req.__payload.sessionKey, "127.0.0.1").then(() =>
			(functionId !== null ?
				steer.checkFunctionExecutionPrivilege(req.__payload.sessionKey, functionId) : // @todo
				resolve())
		).catch(err =>
			reject(err)
		);
	}).then(() =>
		next()
	).catch(err => {
		logger.warn(err.toString());
		res.redirect("/login");
	})
;

/**
 * @param {import("express").Response} res
 */
module.exports.resultJson = (res, code, params = {}) => res.json({
	result_code: code, ...params
});

module.exports.steer = steer;