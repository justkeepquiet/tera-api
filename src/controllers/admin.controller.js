"use strict";

const jwt = require("jsonwebtoken");
const body = require("express-validator").body;
const logger = require("../utils/logger");

const {
	i18nHandler,
	steer,
	resultJson,
	validationHandler,
	accessFunctionHandler
} = require("../middlewares/admin.middlewares");

module.exports.homeHtml = [
	i18nHandler,
	accessFunctionHandler(),
	/**
	 * @type {import("express").RequestHandler}
	 */
	(req, res) => {
		// @todo

		res.send("homePage");
	}
];

module.exports.loginHtml = [
	i18nHandler,
	/**
	 * @type {import("express").RequestHandler}
	 */
	(req, res) => {
		// @todo

		res.send("loginPage");
	}
];

module.exports.loginAction = [
	i18nHandler,
	// [body("login").notEmpty(), body("password").notEmpty()],
	validationHandler,
	/**
	 * @type {import("express").RequestHandler}
	 */
	(req, res) => {
		const { login, password } = req.query;

		new Promise((resolve, reject) => {
			if (!/^true$/i.test(process.env.ADMIN_PANEL_STEER_ENABLE)) {
				if (login === process.env.ADMIN_PANEL_QA_LOGIN && password === process.env.ADMIN_PANEL_QA_PASSWORD) {
					return resolve({ login, password });
				}
			} else {
				return steer.checkLoginGetSessionKey(login, password, "127.0.0.1").then(sessionKey =>
					resolve({ sessionKey })
				).catch(err =>
					reject(err)
				);
			}

			return reject("Login failed");
		}).then(payload => {
			const token = jwt.sign(payload, process.env.ADMIN_PANEL_JWT_SECRET, {
				algorithm: "HS256",
				expiresIn: 86400
			});

			res.cookie("token", token, { maxAge: 86400 * 1000 });
			res.redirect("/home");
		}).catch(err => {
			logger.warn(err.toString());
			resultJson(res, 1, { msg: err.toString() });
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

		if (steer.isRegistred && req.__payload.sessionKey) {
			return steer.logoutSessionKey(req.__payload.sessionKey).then(() => {
				res.redirect("/login");
			}).catch(err =>
				logger.warn(err)
			);
		}

		res.redirect("/login");
	}
];

module.exports.indexHtml = [
	i18nHandler,
	accessFunctionHandler(),
	/**
	 * @type {import("express").RequestHandler}
	 */
	(req, res) => {
		res.redirect("/home");
	}
];