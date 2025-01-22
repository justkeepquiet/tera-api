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
		reportModel.gateway.create({
			ip: req.ip,
			endpoint: res.locals.__endpoint,
			payload: JSON.stringify([req.query || {}, req.body || {}]),
			reportType: params.reportType || 1
		}).catch(err => {
			databaseLogger.error(err);
		});

		next();
	}
;