"use strict";

/**
 * @typedef {import("../lib/rateLimitter")} rateLimitter
 * @typedef {import("express").RequestHandler} RequestHandler
 */

const ApiError = require("../lib/apiError");
const env = require("../utils/env");
const helpers = require("../utils/helpers");

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

module.exports.authSessionHandler = () =>
	/**
	 * @type {RequestHandler}
	 */
	(req, res, next) => {
		if (req.isAuthenticated()) {
			next();
		} else {
			res.status(401).send();
		}
	}
;

/**
 * @type {RequestHandler}
 */
module.exports.shopStatusHandler = (req, res, next) => {
	if (!env.bool("API_PORTAL_SHOP_ENABLE")) {
		return res.redirect("ShopDisabled");
	}

	next();
};

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
			throw new ApiError("too many requests", 9);
		}

		next();
	}
;