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
			return res.status(400).send();
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

module.exports.resultJson = resultJson;