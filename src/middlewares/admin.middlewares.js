"use strict";

const path = require("path");
const I18n = require("i18n").I18n;
const helpers = require("../utils/helpers");
const logger = require("../utils/logger");

if (!process.env.ADMIN_PANEL_LOCALE) {
	logger.error("Invalid configuration parameter: ADMIN_PANEL_LOCALE");
	process.exit();
}

const i18n = new I18n({
	directory: path.resolve(__dirname, "../locales/admin"),
	defaultLocale: process.env.ADMIN_PANEL_LOCALE
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
		return module.exports.resultJson(res, 2, { msg: "invalid parameter" });
	}

	next();
};

module.exports.accessFunctionHandler = () =>
	/**
	 * @type {import("express").RequestHandler}
	 */
	(req, res, next) => {
		if (req.isAuthenticated()) {
			res.locals.passport = req.session.passport;

			if (req.session.passport.user.type === "steer" &&
				!Object.values(req.session.passport.user.functions).includes(req.path)
			) {
				const msg = `${encodeURI(i18n.__("Function access denied"))}: ${req.path}`;
				return res.redirect(`/logout?msg=${msg}`);
			}

			next();
		} else {
			res.redirect(`/login?msg=${encodeURI(i18n.__("The session has expired."))}`);
		}
	}
;

module.exports.i18n = i18n;