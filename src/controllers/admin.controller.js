"use strict";

/**
 * @typedef {import("../app").modules} modules
 * @typedef {import("express").RequestHandler} RequestHandler
 */

const expressLayouts = require("express-ejs-layouts");
const moment = require("moment-timezone");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");

const { accessFunctionHandler, resultJson } = require("../middlewares/admin.middlewares");

/**
 * @param {modules} modules
 */
module.exports.notifications = ({ logger, queue }) => [
	expressLayouts,
	/**
	 * @type {RequestHandler}
	 */
	async (req, res) => {
		queue.findByStatus(queue.status.rejected, 6).then(tasks => {
			const items = [];

			if (req.user.type !== "steer" || Object.values(req.user.functions).includes("/tasks")) {
				tasks.forEach(task => {
					items.push({
						id: task.get("id"),
						tag: task.get("tag"),
						handler: task.get("handler"),
						status: task.get("status"),
						message: task.get("message")
					});
				});
			}

			resultJson(res, 0, { msg: "success", count: items.length, items });
		}).catch(err => {
			logger.error(err);
			resultJson(res, 1, { msg: "internal error" });
		});
	}
];

/**
 * @param {modules} modules
 */
module.exports.home = ({ logger, datasheets, serverModel, reportModel }) => [
	accessFunctionHandler,
	expressLayouts,
	/**
	 * @type {RequestHandler}
	 */
	async (req, res) => {
		const isSteer = req.user.type === "steer";

		try {
			const servers = await serverModel.info.findAll({
				where: { isEnabled: 1 }
			});

			const activityReport = !isSteer || Object.values(req.user.functions).includes("/report_activity") ?
				await reportModel.activity.findAll({
					offset: 0, limit: 6,
					order: [
						["reportTime", "DESC"]
					]
				}) : null;

			const cheatsReport = !isSteer || Object.values(req.user.functions).includes("/report_cheats") ?
				await reportModel.cheats.findAll({
					offset: 0, limit: 6,
					order: [
						["reportTime", "DESC"]
					]
				}) : null;

			const payLogs = !isSteer ||
				Object.values(req.user.functions).includes("/shop_pay_logs") ?
				await reportModel.shopPay.findAll({
					offset: 0, limit: 8,
					order: [
						["createdAt", "DESC"]
					]
				}) : null;

			res.render("adminHome", {
				layout: "adminLayout",
				moment,
				servers,
				datasheets,
				activityReport,
				cheatsReport,
				payLogs
			});
		} catch (err) {
			logger.error(err);
			res.render("adminError", { layout: "adminLayout", err });
		}
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
	(req, res) => {
		res.render("adminProfile", { layout: "adminLayout", moment });
	}
];

/**
 * @param {modules} modules
 */
module.exports.settings = () => [
	accessFunctionHandler,
	expressLayouts,
	/**
	 * @type {RequestHandler}
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

/**
 * @param {modules} modules
 */
module.exports.login = () => [
	/**
	 * @type {RequestHandler}
	 */
	(req, res) => {
		if (req.isAuthenticated()) {
			return res.redirect("/home");
		}

		let payload = null;

		try {
			payload = jwt.verify(req.cookies["connect.rid"], process.env.API_PORTAL_SECRET);
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
module.exports.loginAction = ({ passport }) => [
	/**
	 * @type {RequestHandler}
	 */
	(req, res, next) => {
		passport.authenticate("local", (error, user, msg) => {
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

			req.login(user, () => {
				req.user.remember = !!req.body.remember;
				req.user.tz = req.body.tz || moment.tz.guess();

				if (req.user.remember) {
					const maxAge = 86400000 * 7;

					const token = jwt.sign({
						login: req.body.login,
						password: req.body.password
					}, process.env.ADMIN_PANEL_SECRET, {
						algorithm: "HS256",
						expiresIn: maxAge
					});

					res.cookie("connect.rid", token, { maxAge });
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
	(req, res) => {
		if (steer.isRegistred && req?.user?.sessionKey) {
			steer.logoutSessionKey(req.user.sessionKey).catch(err =>
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
	(req, res) => {
		res.redirect("/home");
	}
];