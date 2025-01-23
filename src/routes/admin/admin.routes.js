"use strict";

/**
 * @typedef {import("express").ErrorRequestHandler} ErrorRequestHandler
 * @typedef {import("../../app").modules} modules
 */

const path = require("path");
const I18n = require("i18n").I18n;
const moment = require("moment-timezone");
const express = require("express");
const uuid = require("uuid").v4;
const session = require("express-session");
const FileStore = require("session-file-store")(session);
const Passport = require("passport").Passport;
const LocalStrategy = require("passport-local").Strategy;
const CustomStrategy = require("passport-custom").Strategy;
const { jwtDecrypt } = require("jose");

const env = require("../../utils/env");
const helpers = require("../../utils/helpers");
const ApiError = require("../../lib/apiError");

const adminController = require("../../controllers/admin.controller");
const adminApiController = require("../../controllers/adminApi.controller");
const adminOperationsReportController = require("../../controllers/adminOperationsReport.controller");
const adminGatewayReportController = require("../../controllers/adminGatewayReport.controller");
const adminServersController = require("../../controllers/adminServers.controller");
const adminServerStringsController = require("../../controllers/adminServerStrings.controller");
const adminMaintenanceController = require("../../controllers/adminMaintenance.controller");
const adminOnlineController = require("../../controllers/adminOnline.controller");
const adminAccountsController = require("../../controllers/adminAccounts.controller");
const adminBansController = require("../../controllers/adminBans.controller");
const adminBenefitsController = require("../../controllers/adminBenefits.controller");
const adminReportController = require("../../controllers/adminReport.controller");
const adminShopAccountsController = require("../../controllers/adminShopAccounts.controller");
const adminShopCategoriesController = require("../../controllers/adminShopCategories.controller");
const adminShopProductsController = require("../../controllers/adminShopProducts.controller");
const adminPromocodesController = require("../../controllers/adminPromocodes.controller");
const adminPromocodesActivatedController = require("../../controllers/adminPromocodesActivated.controller");
const adminBoxesController = require("../../controllers/adminBoxes.controller");
const adminShopLogsController = require("../../controllers/adminShopLogs.controller");
const adminTasksController = require("../../controllers/adminTasks.controller");
const adminTasksLogsController = require("../../controllers/adminTasksLogs.controller");
const adminLauncherLogsController = require("../../controllers/adminLauncherLogs.controller");

/**
* @param {modules} modules
*/
module.exports = modules => {
	const adminConfig = modules.config.get("admin");

	if (!adminConfig) {
		throw "Cannot read configuration: admin";
	}

	const passport = new Passport();
	const additionalLocalesDirs = [];

	modules.pluginsLoader.loadComponent("locales.adminPanel", additionalLocalesDirs);

	const i18n = new I18n({
		staticCatalog: helpers.loadTranslations(path.resolve(__dirname, "../../locales/admin"), additionalLocalesDirs),
		defaultLocale: env.string("ADMIN_PANEL_LOCALE")
	});

	passport.serializeUser((user, done) => {
		done(null, user);
	});

	passport.deserializeUser((user, done) => {
		done(null, user);
	});

	const authenticateUser = (req, login, password, done) => {
		const remember = !!req.body?.remember;
		const tz = moment.tz.zone(req.body?.tz)?.name || moment.tz.guess();

		if (env.bool("STEER_ENABLE")) {
			return modules.steer.openSession(login, password, req.ip).then(({ sessionKey, userSn }) =>
				modules.steer.getFunctionList(sessionKey).then(functions =>
					done(null, {
						type: "steer",
						login,
						password,
						userSn,
						sessionKey,
						functions,
						tz,
						remember
					})
				)
			).catch(err => {
				if (err.resultCode) {
					if (err.resultCode() < 100) {
						modules.logger.error(err);
					} else {
						modules.logger.warn(err);
					}

					done(null, false, `err_${err.resultCode()}`);
				} else {
					modules.logger.error(err);
					done(null, false, "err_1");
				}
			});
		}

		if (login === env.string("ADMIN_PANEL_QA_USER") &&
			password === env.string("ADMIN_PANEL_QA_PASSWORD")
		) {
			done(null, {
				type: "qa",
				login,
				password,
				tz,
				remember
			});
		} else {
			done(null, false, "Invalid QA login or password.");
		}
	};

	passport.use(new LocalStrategy(
		{ usernameField: "login", passReqToCallback: true }, authenticateUser)
	);

	passport.use(new CustomStrategy(
		async (req, done) => {
			let payload = null;

			try {
				const secret = env.string("API_PORTAL_SECRET");
				const secretKey = await helpers.createKeyFromString(secret);
				const jwe = req.cookies["connect.rid"] || "";

				payload = (await jwtDecrypt(jwe, secretKey)).payload;
			} catch (_) {}

			authenticateUser(req, payload?.login, payload?.password, done);
		})
	);

	modules.app.use((req, res, next) => {
		res.locals.__quickMenu = adminConfig.quickMenu;
		next();
	});

	modules.app.use(session({
		genid: () => uuid(),
		store: new FileStore({
			logFn: modules.logger.debug
		}),
		secret: env.string("ADMIN_PANEL_SECRET"),
		resave: false,
		saveUninitialized: true
	}));

	modules.app.use(passport.initialize());
	modules.app.use(passport.session());

	modules.app.use((err, req, res, next) => {
		if (err) {
			modules.logger.warn(err);

			req.logout(() =>
				res.redirect("/login")
			);
		} else {
			next();
		}
	});

	modules.app.use((req, res, next) => {
		res.locals.__ = i18n.__;
		res.locals.locale = i18n.getLocale();

		next();
	});

	const mod = { ...modules, i18n, passport };

	modules.app.use((req, res, next) => {
		res.locals.__modules = mod;

		next();
	});

	const router = express.Router()
		// API
		.get("/api/notifications", adminApiController.notifications(mod))
		.get("/api/homeStats", adminApiController.homeStats(mod))
		.get("/api/getAccounts", adminApiController.getAccounts(mod))
		.get("/api/getCharacters", adminApiController.getCharacters(mod))
		.get("/api/getItems", adminApiController.getItems(mod))

		.use("/api",
			/**
			 * @type {ErrorRequestHandler}
			 */
			(err, req, res, next) => {
				if (err instanceof ApiError) {
					res.json({ result_code: err.code, msg: err.message });
				} else {
					modules.logger.error(err);
					res.status(500).json({ result_code: 1, msg: "Internal Server Error" });
				}
			}
		)

		// Admin Panel Auth
		.get("/", adminController.index(mod))
		.get("/login", adminController.login(mod))
		.post("/login", adminController.loginAction(mod))
		.get("/logout", adminController.logoutAction(mod))
		// Admin Panel Home
		.get("/home", adminController.home(mod))
		.get("/profile", adminController.profile(mod))
		.get("/settings", adminController.settings(mod))
		// Operations Report
		.get("/operations_report", adminOperationsReportController.index(mod))
		.get("/operations_report/view", adminOperationsReportController.view(mod))
		// Gateway Report
		.get("/gateway_report", adminGatewayReportController.index(mod))
		.get("/gateway_report/view", adminGatewayReportController.view(mod))
		// Account Management
		.get("/accounts", adminAccountsController.index(mod))
		.get("/accounts/add", adminAccountsController.add(mod))
		.post("/accounts/add", adminAccountsController.addAction(mod))
		.get("/accounts/edit", adminAccountsController.edit(mod))
		.post("/accounts/edit", adminAccountsController.editAction(mod))
		.get("/accounts/delete", adminAccountsController.deleteAction(mod))
		.get("/characters", adminAccountsController.characters(mod))
		// Online Users
		.get("/online", adminOnlineController.index(mod))
		.get("/online/kick", adminOnlineController.kickAction(mod))
		.get("/online/kick_all", adminOnlineController.kickAllAction(mod))
		// Account Benefits
		.get("/benefits", adminBenefitsController.index(mod))
		.get("/benefits/add", adminBenefitsController.add(mod))
		.post("/benefits/add", adminBenefitsController.addAction(mod))
		.get("/benefits/edit", adminBenefitsController.edit(mod))
		.post("/benefits/edit", adminBenefitsController.editAction(mod))
		.get("/benefits/delete", adminBenefitsController.deleteAction(mod))
		// Account Bans
		.get("/bans", adminBansController.index(mod))
		.get("/bans/add", adminBansController.add(mod))
		.post("/bans/add", adminBansController.addAction(mod))
		.get("/bans/edit", adminBansController.edit(mod))
		.post("/bans/edit", adminBansController.editAction(mod))
		.get("/bans/delete", adminBansController.deleteAction(mod))
		// Servers List (SLS)
		.get("/servers", adminServersController.index(mod))
		.get("/servers/add", adminServersController.add(mod))
		.post("/servers/add", adminServersController.addAction(mod))
		.get("/servers/edit", adminServersController.edit(mod))
		.post("/servers/edit", adminServersController.editAction(mod))
		.get("/servers/delete", adminServersController.deleteAction(mod))
		// Servers Strings
		.get("/server_strings", adminServerStringsController.index(mod))
		.get("/server_strings/add", adminServerStringsController.add(mod))
		.post("/server_strings/add", adminServerStringsController.addAction(mod))
		.get("/server_strings/edit", adminServerStringsController.edit(mod))
		.post("/server_strings/edit", adminServerStringsController.editAction(mod))
		.get("/server_strings/delete", adminServerStringsController.deleteAction(mod))
		// Server Maintenance
		.get("/maintenance", adminMaintenanceController.index(mod))
		.get("/maintenance/add", adminMaintenanceController.add(mod))
		.post("/maintenance/add", adminMaintenanceController.addAction(mod))
		.get("/maintenance/edit", adminMaintenanceController.edit(mod))
		.post("/maintenance/edit", adminMaintenanceController.editAction(mod))
		.get("/maintenance/delete", adminMaintenanceController.deleteAction(mod))
		// Launcher Logs
		.get("/launcher_logs", adminLauncherLogsController.index(mod))
		// Game Reports
		.get("/report_activity", adminReportController.activity(mod))
		.get("/report_characters", adminReportController.characters(mod))
		.get("/report_cheats", adminReportController.cheats(mod))
		.get("/report_chronoscrolls", adminReportController.chronoscrolls(mod))
		// Shop Account Management
		.get("/shop_accounts", adminShopAccountsController.index(mod))
		.get("/shop_accounts/add", adminShopAccountsController.add(mod))
		.post("/shop_accounts/add", adminShopAccountsController.addAction(mod))
		.get("/shop_accounts/edit", adminShopAccountsController.edit(mod))
		.post("/shop_accounts/edit", adminShopAccountsController.editAction(mod))
		.get("/shop_accounts/delete", adminShopAccountsController.deleteAction(mod))
		// Shop Categories
		.get("/shop_categories", adminShopCategoriesController.index(mod))
		.get("/shop_categories/add", adminShopCategoriesController.add(mod))
		.post("/shop_categories/add", adminShopCategoriesController.addAction(mod))
		.get("/shop_categories/edit", adminShopCategoriesController.edit(mod))
		.post("/shop_categories/edit", adminShopCategoriesController.editAction(mod))
		.get("/shop_categories/delete", adminShopCategoriesController.deleteAction(mod))
		// Shop Products
		.get("/shop_products", adminShopProductsController.index(mod))
		.get("/shop_products/add", adminShopProductsController.add(mod))
		.post("/shop_products/add", adminShopProductsController.addAction(mod))
		.get("/shop_products/edit", adminShopProductsController.edit(mod))
		.post("/shop_products/edit", adminShopProductsController.editAction(mod))
		.post("/shop_products/edit/all", adminShopProductsController.editAllAction(mod))
		.get("/shop_products/delete", adminShopProductsController.deleteAction(mod))
		.post("/shop_products/delete/all", adminShopProductsController.deleteAction(mod))
		// Shop Logs
		.get("/shop_fund_logs", adminShopLogsController.fund(mod))
		.get("/shop_pay_logs", adminShopLogsController.pay(mod))
		// Promocodes
		.get("/promocodes", adminPromocodesController.index(mod))
		.get("/promocodes/add", adminPromocodesController.add(mod))
		.post("/promocodes/add", adminPromocodesController.addAction(mod))
		.get("/promocodes/edit", adminPromocodesController.edit(mod))
		.post("/promocodes/edit", adminPromocodesController.editAction(mod))
		.get("/promocodes/delete", adminPromocodesController.deleteAction(mod))
		// Activated Procmocodes
		.get("/promocodes_activated", adminPromocodesActivatedController.index(mod))
		.get("/promocodes_activated/add", adminPromocodesActivatedController.add(mod))
		.post("/promocodes_activated/add", adminPromocodesActivatedController.addAction(mod))
		.get("/promocodes_activated/delete", adminPromocodesActivatedController.deleteAction(mod))
		// Boxes
		.get("/boxes", adminBoxesController.index(mod))
		.get("/boxes/add", adminBoxesController.add(mod))
		.post("/boxes/add", adminBoxesController.addAction(mod))
		.get("/boxes/edit", adminBoxesController.edit(mod))
		.post("/boxes/edit", adminBoxesController.editAction(mod))
		.get("/boxes/delete", adminBoxesController.deleteAction(mod))
		.get("/boxes/send", adminBoxesController.send(mod))
		.post("/boxes/send", adminBoxesController.sendAction(mod))
		.get("/boxes/send_all", adminBoxesController.sendAll(mod))
		.post("/boxes/send_all", adminBoxesController.sendAllAction(mod))
		.get("/boxes/send_result", adminBoxesController.sendResult(mod))
		// Boxes Logs
		.get("/boxes_logs", adminBoxesController.logs(mod))
		// Tasks Queue
		.get("/tasks", adminTasksController.index(mod))
		.get("/tasks/restart", adminTasksController.restartAction(mod))
		.get("/tasks/cancel_failed", adminTasksController.cancelFailedAction(mod))
		.get("/tasks/cancel_all", adminTasksController.cancelAllAction(mod))
		// Tasks Queue Logs
		.get("/tasks_logs", adminTasksLogsController.index(mod))
	;

	modules.pluginsLoader.loadComponent("routes.adminPanel.admin", router, mod);

	router.use(
		/**
		 * @type {ErrorRequestHandler}
		 */
		(err, req, res, next) => {
			if (!(err instanceof ApiError)) {
				modules.logger.error(err);
				res.status(500);
			}

			if (typeof res["__render"] === "function") {
				res.render("adminError", {
					layout: "adminLayout",
					err: err.message || err.toString()
				});
			} else {
				res.send("Internal Server Error");
			}
		}
	);

	return router;
};