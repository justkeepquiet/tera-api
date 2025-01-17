"use strict";

/**
 * @typedef {import("../app").modules} modules
 * @typedef {import("express").RequestHandler} RequestHandler
 */

const expressLayouts = require("express-ejs-layouts");
const moment = require("moment-timezone");
const dotenv = require("dotenv");
const Op = require("sequelize").Op;
const { EncryptJWT, jwtDecrypt } = require("jose");

const env = require("../utils/env");
const { createKeyFromString } = require("../utils/helpers");
const { accessFunctionHandler } = require("../middlewares/admin.middlewares");

/**
 * @param {modules} modules
 */
module.exports.home = ({ sequelize, serverModel }) => [
	accessFunctionHandler,
	expressLayouts,
	/**
	 * @type {RequestHandler}
	 */
	async (req, res, next) => {
		const isSteer = req.user.type === "steer";

		const maintenance = await serverModel.maintenance.findOne({
			where: {
				startTime: { [Op.lt]: sequelize.fn("NOW") },
				endTime: { [Op.gt]: sequelize.fn("NOW") }
			}
		});

		const servers = await serverModel.info.findAll({
			where: { isEnabled: 1 }
		});

		res.render("adminHome", {
			layout: "adminLayout",
			moment,
			servers,
			isMaintenance: maintenance !== null,
			activityReport: !isSteer || Object.values(req.user.functions).includes("/report_activity"),
			cheatsReport: !isSteer || Object.values(req.user.functions).includes("/report_cheats"),
			payLogs: !isSteer || Object.values(req.user.functions).includes("/shop_pay_logs")
		});
	}
];

/**
 * @param {modules} modules
 */
module.exports.profile = () => [
	accessFunctionHandler,
	expressLayouts,
	/**
	 * @type {RequestHandler}
	 */
	async (req, res, next) => {
		res.render("adminProfile", { layout: "adminLayout", moment });
	}
];

/**
 * @param {modules} modules
 */
module.exports.settings = ({ versions }) => [
	accessFunctionHandler,
	expressLayouts,
	/**
	 * @type {RequestHandler}
	 */
	async (req, res, next) => {
		const settings = [];

		Object.keys(dotenv.config().parsed).forEach(parameter => {
			if (process.env[parameter] !== undefined) {
				settings.push({ parameter, value: process.env[parameter] });
			}
		});

		res.render("adminSettings", { layout: "adminLayout", settings, versions });
	}
];

/**
 * @param {modules} modules
 */
module.exports.login = () => [
	/**
	 * @type {RequestHandler}
	 */
	async (req, res, next) => {
		if (req.isAuthenticated()) {
			return res.redirect("/home");
		}

		let payload = null;

		try {
			const secret = env.string("API_PORTAL_SECRET");
			const secretKey = await createKeyFromString(secret);
			const jwe = req.cookies["connect.rid"] || "";

			payload = (await jwtDecrypt(jwe, secretKey)).payload;
		} catch (_) {}

		res.render("adminLogin", {
			errorMessage: req.query.msg || null,
			login: payload?.login || "",
			password: payload?.password || ""
		});
	}
];

/**
 * @param {modules} modules
 */
module.exports.loginAction = ({ logger, passport }) => [
	/**
	 * @type {RequestHandler}
	 */
	async (req, res, next) => {
		const strategy = req.body.useToken === "true" ? "custom" : "local";

		passport.authenticate(strategy, (error, user, msg) => {
			if (error) {
				return res.render("adminLogin", {
					errorMessage: `Operation failed: ${error}`, login: "", password: ""
				});
			}

			if (msg) {
				return res.render("adminLogin", {
					errorMessage: res.locals.__(msg), login: "", password: ""
				});
			}

			req.login(user, async () => {
				if (user.remember) {
					try {
						const maxAge = 86400000 * 7;

						const payload = {
							login: user.login,
							password: user.password
						};

						const secret = env.string("ADMIN_PANEL_SECRET");
						const secretKey = await createKeyFromString(secret);
						const expTime = Math.floor(Date.now() / 1000) + maxAge / 1000;

						const jwe = await new EncryptJWT(payload)
							.setProtectedHeader({ alg: "dir", enc: "A128CBC-HS256" })
							.setIssuedAt()
							.setExpirationTime(expTime)
							.encrypt(secretKey);

						res.cookie("connect.rid", jwe, { maxAge });
					} catch (err) {
						logger.error(err);
					}
				} else {
					res.clearCookie("connect.rid");
				}

				res.redirect(req.query.url || "/home");
			});
		})(req, res, next);
	}
];

/**
 * @param {modules} modules
 */
module.exports.logoutAction = ({ logger, steer }) => [
	/**
	 * @type {RequestHandler}
	 */
	async (req, res, next) => {
		if (steer.isRegistered && req?.user?.sessionKey) {
			steer.closeSession(req.user.sessionKey).catch(err =>
				logger.warn(err)
			);
		}

		req.logout(() =>
			res.redirect(req.query.msg ? `/login?msg=${req.query.msg}` : "/login")
		);
	}
];

/**
 * @param {modules} modules
 */
module.exports.index = () => [
	/**
	 * @type {RequestHandler}
	 */
	async (req, res, next) => {
		res.redirect("/login");
	}
];