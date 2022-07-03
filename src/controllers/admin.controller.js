"use strict";

const expressLayouts = require("express-ejs-layouts");
const moment = require("moment-timezone");
const dotenv = require("dotenv");
const passport = require("passport");
const logger = require("../utils/logger");
const accountModel = require("../models/account.model");
const reportModel = require("../models/report.model");
const shopModel = require("../models/shop.model");

const { i18n, i18nHandler, accessFunctionHandler } = require("../middlewares/admin.middlewares");

module.exports.home = [
	i18nHandler,
	accessFunctionHandler(),
	expressLayouts,
	/**
	 * @type {import("express").RequestHandler}
	 */
	async (req, res) => {
		const isSteer = req.session.passport.user.type === "steer";

		try {
			const servers = !isSteer || Object.values(req.session.passport.user.functions).includes("/servers") ?
				await accountModel.serverInfo.findAll({
					where: { isEnabled: 1 }
				}) : [];

			const activityReport = !isSteer || Object.values(req.session.passport.user.functions).includes("/report_activity") ?
				await reportModel.activity.findAll({
					offset: 0, limit: 6,
					order: [
						["reportTime", "DESC"]
					]
				}) : [];

			const cheatsReport = !isSteer || Object.values(req.session.passport.user.functions).includes("/report_cheats") ?
				await reportModel.cheats.findAll({
					offset: 0, limit: 6,
					order: [
						["reportTime", "DESC"]
					]
				}) : [];

			const payLogs = !isSteer || Object.values(req.session.passport.user.functions).includes("/shop_pay_logs") ?
				await shopModel.payLogs.findAll({
					offset: 0, limit: 8,
					order: [
						["createdAt", "DESC"]
					]
				}) : [];

			res.render("adminHome", {
				layout: "adminLayout",
				moment,
				servers,
				activityReport,
				cheatsReport,
				payLogs
			});
		} catch (err) {
			logger.error(err.toString());
			res.render("adminError", { layout: "adminLayout", err });
		}
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
			return res.redirect("/home");
		}

		res.render("adminLogin", { errorMessage: req.query.msg || null });
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
				res.redirect("/home")
			);
		})(req, res, next);
	}
];

module.exports.logoutAction = [
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
			res.redirect(req.query.msg ? `/login?msg=${req.query.msg}` : "/login")
		);
	}
];

module.exports.index = [
	/**
	 * @type {import("express").RequestHandler}
	 */
	(req, res) => {
		res.redirect("/home");
	}
];