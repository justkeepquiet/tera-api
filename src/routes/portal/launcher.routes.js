"use strict";

/**
 * @typedef {import("express").ErrorRequestHandler} ErrorRequestHandler
 * @typedef {import("../../app").modules} modules
 */

const path = require("path");
const I18n = require("i18n").I18n;
const express = require("express");

const ApiError = require("../../lib/apiError");
const portalLauncherController = require("../../controllers/portalLauncher.controller");

/**
 * @param {modules} modules
 */
module.exports = modules => {
	const i18n = new I18n({
		directory: path.resolve(__dirname, "../../locales/launcher"),
		defaultLocale: process.env.API_PORTAL_LOCALE
	});

	modules.app.use((req, res, next) => {
		const locale = (req.query.lang || process.env.API_PORTAL_LOCALE).split("-")[0];

		if (i18n.getLocales().includes(locale)) {
			i18n.setLocale(locale);
		}

		res.locals.__ = i18n.__;
		res.locals.locale = i18n.getLocale();

		return next();
	});

	const mod = { ...modules, i18n };

	return express.Router()
		.get("/LauncherMaintenanceStatus", portalLauncherController.MaintenanceStatus(mod))
		.get("/LauncherMain", portalLauncherController.MainHtml(mod))

		.get("/LauncherLoginForm", portalLauncherController.LoginFormHtml(mod))
		.post("/LauncherLoginAction", portalLauncherController.LoginAction(mod))

		.get("/LauncherSignupForm", portalLauncherController.SignupFormHtml(mod))
		.post("/LauncherSignupAction", portalLauncherController.SignupAction(mod))
		.get("/LauncherSignupVerifyForm", portalLauncherController.SignupVerifyFormHtml(mod))
		.post("/LauncherSignupVerifyAction", portalLauncherController.SignupVerifyAction(mod))

		.get("/LauncherResetPasswordForm", portalLauncherController.ResetPasswordFormHtml(mod))
		.post("/LauncherResetPasswordAction", portalLauncherController.ResetPasswordAction(mod))
		.get("/LauncherResetPasswordVerifyForm", portalLauncherController.ResetPasswordVerifyFormHtml(mod))
		.post("/LauncherResetPasswordVerifyAction", portalLauncherController.ResetPasswordVerifyAction(mod))

		.post("/LauncherReportAction", portalLauncherController.ReportAction(mod))

		.use(
			/**
			 * @type {ErrorRequestHandler}
			 */
			(err, req, res, next) => {
				if (err instanceof ApiError) {
					res.json({ Return: false, ReturnCode: err.code, Msg: err.message });
				} else {
					modules.logger.error(err);
					res.json({ Return: false, ReturnCode: 1, Msg: "internal error" });
				}
			}
		)
	;
};