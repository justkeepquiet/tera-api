"use strict";

/**
 * @typedef {import("express").RequestHandler} RequestHandler
 * @typedef {import("express").Response} Response
 */

const jwt = require("jsonwebtoken");
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
			return res.send(); // @todo
		}

		next();
	}
;

module.exports.authSessionHandler = (logger, accountModel) =>
	/**
	 * @type {RequestHandler}
	 */
	(req, res, next) => {
		try {
			const payload = jwt.verify(req.cookies.token, process.env.API_PORTAL_SECRET);

			accountModel.info.findOne({
				where: {
					accountDBID: payload.userNo
				}
			}).then(account => {
				if (account === null) {
					return res.send();
				}

				res.__account = account;
				next();
			}).catch(err => {
				logger.error(err);
				res.send();
			});
		} catch (err) {
			logger.warn(err.toString());
			return res.send();
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