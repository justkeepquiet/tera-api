"use strict";

/**
 * @typedef {import("express").RequestHandler} RequestHandler
 * @typedef {import("express").Response} Response
 */

const helpers = require("../utils/helpers");

/**
 * @param {Response} res
 */
const resultJson = (res, code, message, params = {}) => res.json({
	Return: code === 0, ReturnCode: code, Msg: message, ...params
});

module.exports.validationHandler = logger =>
	/**
	 * @type {RequestHandler}
	 */
	(req, res, next) => {
		if (!helpers.validationResultLog(req, logger).isEmpty()) {
			return resultJson(res, 2, "invalid parameter");
		}

		next();
	}
;

module.exports.resultJson = resultJson;