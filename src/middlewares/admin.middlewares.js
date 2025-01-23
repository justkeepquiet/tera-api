"use strict";

/**
 * @typedef {import("express").RequestHandler} RequestHandler
 * @typedef {import("express").ErrorRequestHandler} ErrorRequestHandler
 * @typedef {import("../models/report.model").reportModel} reportModel
 */

const ApiError = require("../lib/apiError");
const helpers = require("../utils/helpers");
const databaseLogger = require("../utils/logger").createLogger("Database");

module.exports.validationHandler = logger =>
	/**
	 * @type {RequestHandler}
	 */
	(req, res, next) => {
		const result = helpers.validationResultLog(req, logger);

		if (!result.isEmpty()) {
			throw new ApiError("Invalid parameter: ".concat(result.array()
				.map(e => `${e.location}:${e.param}=${e.msg}`).join(", ")
			), 2);
		}

		next();
	}
;

module.exports.formValidationHandler = logger =>
	/**
	 * @type {RequestHandler}
	 */
	(req, res, next) => {
		const errors = helpers.validationResultLog(req, logger);

		if (!errors.isEmpty()) {
			res.json({ result_code: 2, msg: "Invalid parameter", errors: errors.array() });
		} else {
			next();
		}
	}
;

module.exports.formResultErrorHandler = logger =>
	/**
	 * @type {ErrorRequestHandler}
	 */
	(err, req, res, next) => {
		logger.error(err);
		res.json({ result_code: err.code || 1, msg: `${res.locals.__("Operation failed")}: ${err.message || err}` });
	}
;

module.exports.formResultSuccessHandler = successUrl =>
	/**
	 * @type {RequestHandler}
	 */
	(req, res, next) => {
		res.json({ result_code: 0, msg: "success", success_url: req.query.successUrl || successUrl });
	}
;

/**
 * @type {RequestHandler}
 */
module.exports.apiAccessHandler = (req, res, next) => {
	if (!req.isAuthenticated()) {
		throw new ApiError("Invalid parameter", 3);
	}

	res.locals.user = req.user;
	next();
};

/**
 * @type {RequestHandler}
 */
module.exports.accessFunctionHandler = (req, res, next) => {
	if (req.isAuthenticated()) {
		res.locals.user = req.user;

		let path = req.path.split("/");

		if (path.length > 3) {
			path = path.slice(0, 3);
		}

		if (req.user.type === "steer" &&
			!Object.values(req.user.functions).includes(path.join("/"))
		) {
			const msg = `${encodeURI(res.locals.__("Function access denied"))}: ${req.path}`;
			return res.redirect(`/logout?msg=${msg}`);
		}

		next();
	} else {
		res.redirect(`/login?msg=${encodeURI(res.locals.__("The session has expired."))}&url=${req.url}`);
	}
};

/**
 * @param {reportModel} reportModel
 */
module.exports.writeOperationReport = (reportModel, params = {}) =>
	/**
	 * @type {RequestHandler}
	 */
	(req, res, next) => {
		const query = { ...req.query || {} };
		const body = { ...req.body || {} };

		["passWord", "password"].forEach(key => {
			if (query[key] !== undefined) {
				query[key] = "[removed]";
			}

			if (body[key] !== undefined) {
				body[key] = "[removed]";
			}
		});

		reportModel.adminOp.create({
			userSn: req?.user?.userSn,
			userId: req?.user?.login,
			userType: req?.user?.type,
			userTz: req?.user?.tz,
			ip: req.ip,
			function: req.path,
			payload: JSON.stringify([query, body]),
			reportType: params.reportType || 1
		}).catch(err => {
			databaseLogger.error(err);
		});

		next();
	}
;