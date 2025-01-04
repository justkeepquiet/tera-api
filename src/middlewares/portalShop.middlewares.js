"use strict";

/**
 * @typedef {import("express").RequestHandler} RequestHandler
 */

const ApiError = require("../lib/apiError");
const helpers = require("../utils/helpers");

module.exports.validationHandler = logger =>
	/**
	 * @type {RequestHandler}
	 */
	(req, res, next) => {
		if (!helpers.validationResultLog(req, logger).isEmpty()) {
			throw new ApiError("invalid parameter", 2);
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
	if (!/^true$/i.test(process.env.API_PORTAL_SHOP_ENABLE)) {
		return res.redirect("ShopDisabled");
	}

	next();
};

module.exports.rateLimitterHandler = (rateLimiter, logger, points = 1) =>
	/**
	 * @type {RequestHandler}
	 */
	async (req, res, next) => {
		try {
			const rateLimiterRes = await rateLimiter.consume(req.ip, points);

			logger.debug(`Rate Limitter: ${rateLimiterRes}`);
			next();
		} catch (rateLimiterRes) {
			logger.debug(`Rate Limitter: ${rateLimiterRes}`);
			logger.warn("Rate Limitter: Too many requests");

			throw new ApiError("too many requests", 9);
		}
	}
;