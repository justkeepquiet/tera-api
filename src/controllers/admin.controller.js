"use strict";

const jwt = require("jsonwebtoken");
const expressLayouts = require("express-ejs-layouts");
const body = require("express-validator").body;
const logger = require("../utils/logger");

const {
	steer,
	i18nHandler,
	resultJson,
	validationHandler,
	accessFunctionHandler
} = require("../middlewares/admin.middlewares");

module.exports.testHtml = [
	i18nHandler,
	accessFunctionHandler(),
	expressLayouts,
	/**
	 * @type {import("express").RequestHandler}
	 */
	(req, res) => {
		res.render("adminTest", { layout: "adminLayout" });
	}
];

module.exports.homeHtml = [
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

module.exports.profileHtml = [
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

module.exports.loginHtml = [
	i18nHandler,
	/**
	 * @type {import("express").RequestHandler}
	 */
	(req, res) => {
		// @todo

		res.render("adminLogin", { errorMessage: null });
	}
];

module.exports.loginActionHtml = [
	i18nHandler,
	[body("login").notEmpty(), body("password").notEmpty()],
	validationHandler,
	/**
	 * @type {import("express").RequestHandler}
	 */
	(req, res) => {
		const { login, password } = req.body;

		new Promise((resolve, reject) => {
			if (!/^true$/i.test(process.env.ADMIN_PANEL_STEER_ENABLE)) {
				if (login === process.env.ADMIN_PANEL_QA_LOGIN && password === process.env.ADMIN_PANEL_QA_PASSWORD) {
					return resolve({ login, password });
				}
			} else {
				return steer.checkLoginGetSessionKey(login, password, "127.0.0.1").then(sessionKey =>
					resolve({ login, sessionKey })
				).catch(err =>
					reject(err)
				);
			}

			return reject("Login failed");
		}).then(session => {
			const token = jwt.sign(session, process.env.ADMIN_PANEL_JWT_SECRET, {
				algorithm: "HS256",
				expiresIn: 86400
			});

			res.cookie("token", token, { maxAge: 86400 * 1000 });
			res.redirect("home");
		}).catch(err => {
			logger.warn(err.toString());
			res.render("adminLogin", { errorMessage: err.toString() });
		});
	}
];

module.exports.logoutAction = [
	i18nHandler,
	accessFunctionHandler(),
	/**
	 * @type {import("express").RequestHandler}
	 */
	(req, res) => {
		res.clearCookie("token");

		if (steer.isRegistred && res.locals.session.sessionKey) {
			return steer.logoutSessionKey(res.locals.session.sessionKey).then(() => {
				res.redirect("login");
			}).catch(err =>
				logger.warn(err)
			);
		}

		res.redirect("login");
	}
];

module.exports.indexHtml = [
	i18nHandler,
	accessFunctionHandler(),
	/**
	 * @type {import("express").RequestHandler}
	 */
	(req, res) => {
		res.redirect("home");
	}
];