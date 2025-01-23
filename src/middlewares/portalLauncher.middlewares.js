"use strict";

/**
 * @typedef {import("../lib/rateLimitter")} rateLimitter
 * @typedef {import("express").RequestHandler} RequestHandler
 */

const ApiError = require("../lib/apiError");
const helpers = require("../utils/helpers");

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

module.exports.authSessionHandler = () =>
	/**
	 * @type {RequestHandler}
	 */
	(req, res, next) => {
		if (!req.isAuthenticated()) {
			return res.redirect("/launcher/LoginForm");
		}

		next();
	}
;

module.exports.apiAuthSessionHandler = () =>
	/**
	 * @type {RequestHandler}
	 */
	(req, res, next) => {
		if (!req.isAuthenticated()) {
			throw new ApiError("Access denied", 3);
		}

		next();
	}
;

/**
 * @param {rateLimitter} rateLimitter
 */
module.exports.rateLimitterHandler = (rateLimitter, endpoint, points = 1) =>
	/**
	 * @type {RequestHandler}
	 */
	async (req, res, next) => {
		const result = await rateLimitter.consume(endpoint, req.ip, points);

		if (!result) {
			throw new ApiError("Too many requests", 9);
		}

		next();
	}
;