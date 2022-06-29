"use strict";

const path = require("path");
const I18n = require("i18n").I18n;
const Recaptcha = require("express-recaptcha").RecaptchaV3;
const logger = require("../utils/logger");
const helpers = require("../utils/helpers");

/**
 * @param {import("express").Response} res
 */
const resultJson = (res, code, message, params = {}) => res.json({
	Return: code === 0, ReturnCode: code, Msg: message, ...params
});

let recaptcha = null;

if (/^true$/i.test(process.env.API_PORTAL_RECAPTCHA_ENABLE)) {
	recaptcha = new Recaptcha(
		process.env.API_PORTAL_RECAPTCHA_SITE_KEY,
		process.env.API_PORTAL_RECAPTCHA_SECRET_KEY, {
			callback: "bindFormAction"
		}
	);
}

if (!process.env.API_PORTAL_LOCALE) {
	logger.error("Invalid configuration parameter: API_PORTAL_LOCALE");
	process.exit();
}

const i18n = new I18n({
	directory: path.resolve(__dirname, "../locales/launcher"),
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
		return resultJson(res, 2, "invalid parameter");
	}

	next();
};

module.exports.resultJson = resultJson;
module.exports.i18n = i18n;
module.exports.recaptcha = recaptcha;