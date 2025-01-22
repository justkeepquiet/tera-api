"use strict";

/**
 * @typedef {import("express").RequestHandler} RequestHandler
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
			throw new ApiError("invalid parameter: ".concat(result.array()
				.map(e => `${e.location}:${e.param}=${e.msg}`).join(", ")
			), 2);
		}

		next();
	}
;

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

		reportModel.gateway.create({
			ip: req.ip,
			endpoint: res.locals.__endpoint,
			payload: JSON.stringify([query, body]),
			reportType: params.reportType || 1
		}).catch(err => {
			databaseLogger.error(err);
		});

		next();
	}
;