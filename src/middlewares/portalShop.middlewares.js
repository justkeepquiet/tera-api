"use strict";

const path = require("path");
const I18n = require("i18n").I18n;
const jwt = require("jsonwebtoken");
const logger = require("../utils/logger");
const helpers = require("../utils/helpers");
const accountModel = require("../models/account.model");

/**
 * @param {import("express").Response} res
 */
const resultJson = (res, code, message, params = {}) => res.json({
	Return: code === 0, ReturnCode: code, Msg: message, ...params
});

if (!process.env.API_PORTAL_LOCALE) {
	logger.error("Invalid configuration parameter: API_PORTAL_LOCALE");
	process.exit();
}

const i18n = new I18n({
	directory: path.resolve(__dirname, "../locales/shop"),
	defaultLocale: process.env.API_PORTAL_LOCALE
});

/**
 * @type {import("express").RequestHandler}
 */
module.exports.i18nHandler = (req, res, next) => {
	res.locals.__ = i18n.__;
	res.locals.locale = i18n.getLocale();

	return next();
};

/**
 * @type {import("express").RequestHandler}
 */
module.exports.validationHandler = (req, res, next) => {
	if (!helpers.validationResultLog(req).isEmpty()) {
		return res.send(); // @todo
	}

	next();
};

/**
 * @type {import("express").RequestHandler}
 */
module.exports.authSessionHandler = (req, res, next) => {
	if (!/^true$/i.test(process.env.API_PORTAL_SHOP_ENABLE)) {
		return res.send();
	}

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
			logger.error(err.toString());
			res.send();
		});
	} catch (err) {
		logger.warn(err.toString());
		return res.send();
	}
};

module.exports.resultJson = resultJson;
module.exports.i18n = i18n;