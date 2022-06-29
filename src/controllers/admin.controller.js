"use strict";

const expressLayouts = require("express-ejs-layouts");
const dotenv = require("dotenv");
const passport = require("passport");
const logger = require("../utils/logger");

const { i18n, i18nHandler, accessFunctionHandler } = require("../middlewares/admin.middlewares");

module.exports.test = [
	accessFunctionHandler(),
	expressLayouts,
	/**
	 * @type {import("express").RequestHandler}
	 */
	(req, res) => {
		res.render("adminTest", { layout: "adminLayout" });
	}
];

module.exports.home = [
	i18nHandler,
	accessFunctionHandler(),
	expressLayouts,
	/**
	 * @type {import("express").RequestHandler}
	 */
	(req, res) => {
		res.render("adminHome", { layout: "adminLayout" });
	}
];

module.exports.profile = [
	i18nHandler,
	accessFunctionHandler(),
	expressLayouts,
	/**
	 * @type {import("express").RequestHandler}
	 */
	(req, res) => {
		res.render("adminProfile", { layout: "adminLayout" });
	}
];

module.exports.settings = [
	i18nHandler,
	accessFunctionHandler(),
	expressLayouts,
	/**
	 * @type {import("express").RequestHandler}
	 */
	(req, res) => {
		const settings = [];

		Object.keys(dotenv.config().parsed).forEach(parameter => {
			if (process.env[parameter] !== undefined) {
				settings.push({ parameter, value: process.env[parameter] });
			}
		});

		res.render("adminSettings", { layout: "adminLayout", settings });
	}
];

module.exports.login = [
	i18nHandler,
	/**
	 * @type {import("express").RequestHandler}
	 */
	(req, res) => {
		if (req.isAuthenticated()) {
			return res.redirect("home");
		}

		res.render("adminLogin", { errorMessage: null });
	}
];

module.exports.loginAction = [
	i18nHandler,
	/**
	 * @type {import("express").RequestHandler}
	 */
	(req, res, next) => {
		passport.authenticate("local", (error, user, msg) => {
			if (error) {
				return res.render("adminLogin", { errorMessage: `Operation failed: ${error}` });
			}
			if (msg) {
				return res.render("adminLogin", { errorMessage: i18n.__(msg) });
			}

			req.login(user, () =>
				res.redirect("home")
			);
		})(req, res, next);
	}
];

module.exports.logoutAction = [
	accessFunctionHandler(),
	/**
	 * @type {import("express").RequestHandler}
	 */
	(req, res) => {
		if (req.steer.isRegistred && req.session.passport?.user.sessionKey) {
			req.steer.logoutSessionKey(req.session.passport.user.sessionKey).catch(err =>
				logger.warn(err)
			);
		}

		req.logout(() =>
			res.redirect("login")
		);
	}
];

module.exports.index = [
	accessFunctionHandler(),
	/**
	 * @type {import("express").RequestHandler}
	 */
	(req, res) => {
		res.redirect("home");
	}
];