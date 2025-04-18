"use strict";

/**
 * @typedef {import("express").ErrorRequestHandler} ErrorRequestHandler
 * @typedef {import("../../app").modules} modules
 */

const path = require("path");
const I18n = require("i18n").I18n;
const express = require("express");
const uuid = require("uuid").v4;
const Op = require("sequelize").Op;
const session = require("express-session");
const FileStore = require("session-file-store")(session);
const Passport = require("passport").Passport;
const LocalStrategy = require("passport-local").Strategy;

const env = require("../../utils/env");
const helpers = require("../../utils/helpers");
const IpBlockHandler = require("../../utils/ipBlockHandler");
const ApiError = require("../../lib/apiError");
const portalLauncherController = require("../../controllers/portalLauncher.controller");

/**
 * @param {modules} modules
 */
module.exports = async modules => {
	if (!modules.config.get("launcher")) {
		throw "Cannot read configuration: launcher";
	}

	const ipBlock = new IpBlockHandler(modules.geoip, modules.ipapi, modules.logger);
	const passport = new Passport();
	const i18n = new I18n({
		staticCatalog: helpers.loadTranslations(path.resolve(__dirname, "../../locales/launcher"), []),
		defaultLocale: env.string("API_PORTAL_LOCALE"),
		header: undefined
	});

	passport.serializeUser((user, done) => {
		done(null, user);
	});

	passport.deserializeUser((user, done) => {
		modules.accountModel.info.findOne({
			where: { accountDBID: user.accountDBID }
		}).then(account => {
			if (account === null) {
				done("Invalid account ID.", null);
			} else {
				done(null, account);
			}
		}).catch(err => {
			modules.logger.error(err);
			done(err, null);
		});
	});

	passport.use(new LocalStrategy({ usernameField: "login", passReqToCallback: true },
		(req, userName, password, done) => {
			modules.accountModel.info.findOne({
				where: {
					[Op.or]: [{ userName }, { email: userName }]
				}
			}).then(account => {
				if (account === null || account.get("passWord") !== helpers.getPasswordString(password)) {
					done("Invalid login or password.", null);
				} else {
					done(null, account);
				}
			}).catch(err => {
				modules.logger.error(err);
				done(err, null);
			});
		})
	);

	modules.app.use("/launcher", async (req, res, next) => {
		const config = modules.config.get("ipBlock");
		const blocked = await ipBlock.applyBlock(req.ip, res.locals.__endpoint, config);

		if (blocked) {
			res.status(403).json({ Return: false, ReturnCode: 403, Msg: "Access denied" });
		} else {
			next();
		}
	});

	modules.app.use("/launcher", session({
		name: "launcher.sid",
		genid: () => uuid(),
		store: new FileStore({
			logFn: () => {
				//
			}
		}),
		secret: env.string("API_PORTAL_SECRET"),
		resave: false,
		saveUninitialized: false,
		cookie: {
			secure: false,
			maxAge: 365 * 86400000 // 365 days
		}
	}));

	modules.app.use("/launcher", passport.initialize());
	modules.app.use("/launcher", passport.session());

	modules.app.use("/launcher", (err, req, res, next) => {
		if (err) {
			modules.logger.warn(err);

			req.logout(() =>
				res.redirect("/launcher/LoginForm")
			);
		} else {
			next();
		}
	});

	modules.app.use("/launcher", (req, res, next) => {
		const queryLanguage = modules.localization.getLanguageByLocale(req.query.locale);
		const language = req?.user?.language || queryLanguage;

		if (i18n.getLocales().includes(language)) {
			i18n.setLocale(language);
		} else if (language === "us" && i18n.getLocales().includes("en")) {
			i18n.setLocale("en");
		}

		res.locals.__ = i18n.__;
		res.locals.locale = i18n.getLocale();

		return next();
	});

	const mod = { ...modules, i18n, passport };

	return express.Router()
		.get("/Main", portalLauncherController.MainHtml(mod))

		.get("/LoginForm", portalLauncherController.LoginFormHtml(mod))
		.post("/LoginAction", portalLauncherController.LoginAction(mod))

		.get("/LogoutAction", portalLauncherController.LogoutAction(mod))

		.get("/SignupForm", portalLauncherController.SignupFormHtml(mod))
		.post("/SignupAction", portalLauncherController.SignupAction(mod))
		.get("/SignupVerifyForm", portalLauncherController.SignupVerifyFormHtml(mod))
		.post("/SignupVerifyAction", portalLauncherController.SignupVerifyAction(mod))

		.get("/ResetPasswordForm", portalLauncherController.ResetPasswordFormHtml(mod))
		.post("/ResetPasswordAction", portalLauncherController.ResetPasswordAction(mod))
		.get("/ResetPasswordVerifyForm", portalLauncherController.ResetPasswordVerifyFormHtml(mod))
		.post("/ResetPasswordVerifyAction", portalLauncherController.ResetPasswordVerifyAction(mod))

		.get("/GetMaintenanceStatusAction", portalLauncherController.GetMaintenanceStatusAction(mod))
		.get("/GetAccountInfoAction", portalLauncherController.GetAccountInfoAction(mod))
		.get("/GetCharacterCountAction", portalLauncherController.GetCharacterCountAction(mod))
		.get("/GetAuthKeyAction", portalLauncherController.GetAuthKeyAction(mod))
		.post("/SetAccountLanguageAction", portalLauncherController.SetAccountLanguageAction(mod))
		.post("/ReportAction", portalLauncherController.ReportAction(mod))

		.get("/GetCaptcha", portalLauncherController.CaptchaCreate(mod))
		.post("/GetCaptcha", portalLauncherController.CaptchaVerify(mod))

		.use(
			/**
			 * @type {ErrorRequestHandler}
			 */
			(err, req, res, next) => {
				if (err instanceof ApiError) {
					res.json({ Return: false, ReturnCode: err.code, Msg: err.message });
				} else {
					modules.logger.error(err);
					res.status(500).json({ Return: false, ReturnCode: 1, Msg: "Internal Server Error" });
				}
			}
		)
	;
};