"use strict";

/**
 * @typedef {import("express").RequestHandler} RequestHandler
 * @typedef {import("express").Response} Response
 */

const helpers = require("../utils/helpers");

/**
 * @param {Response} res
 */
const resultJson = (res, code, params = {}) => res.json({
	result_code: code, ...params
});

module.exports.validationHandler = logger =>
	/**
	 * @type {RequestHandler}
	 */
	(req, res, next) => {
		if (!helpers.validationResultLog(req, logger).isEmpty()) {
			return resultJson(res, 2, { msg: "invalid parameter" });
		}

		next();
	}
;

module.exports.resultJson = resultJson;