"use strict";

/**
* @typedef {import("../../app").modules} modules
*/

const path = require("path");
const I18n = require("i18n").I18n;
const express = require("express");
const uuid = require("uuid").v4;
const session = require("express-session");
const FileStore = require("session-file-store")(session);
const Passport = require("passport").Passport;
const LocalStrategy = require("passport-local").Strategy;

const adminController = require("../../controllers/admin.controller");
const adminApiController = require("../../controllers/adminApi.controller");
const adminOperationsReportController = require("../../controllers/adminOperationsReport.controller");
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

/**
* @param {modules} modules
*/
module.exports = modules => {
	const passport = new Passport();
	const i18n = new I18n({
		directory: path.resolve(__dirname, "../../locales/admin"),
		defaultLocale: process.env.ADMIN_PANEL_LOCALE
	});

	passport.serializeUser((user, done) => {
		done(null, user);
	});

	passport.deserializeUser((user, done) => {
		done(null, user);
	});

	passport.use(new LocalStrategy({ usernameField: "login" },
		(login, password, done) => {
			if (/^true$/i.test(process.env.STEER_ENABLE)) {
				return modules.steer.checkLoginGetSessionKey(login, password, "127.0.0.1").then(({ sessionKey, userSn }) =>
					modules.steer.getFunctionList(sessionKey).then(functions =>
						done(null, {
							type: "steer",
							login,
							userSn,
							sessionKey,
							functions
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

			if (login === process.env.ADMIN_PANEL_QA_USER &&
				password === process.env.ADMIN_PANEL_QA_PASSWORD
			) {
				done(null, {
					type: "qa",
					login,
					password
				});
			} else {
				done(null, false, "Invalid QA login or password.");
			}
		}
	));

	modules.app.use((req, res, next) => {
		res.locals.__quickMenu = require("../../../config/admin").quickMenu;
		next();
	});

	modules.app.use(session({
		genid: () => uuid(),
		store: new FileStore({
			logFn: modules.logger.debug
		}),
		secret: process.env.ADMIN_PANEL_SECRET,
		resave: false,
		saveUninitialized: true
	}));

	modules.app.use(passport.initialize());
	modules.app.use(passport.session());

	modules.app.use((req, res, next) => {
		res.locals.__ = i18n.__;
		res.locals.locale = i18n.getLocale();

		return next();
	});

	const mod = { ...modules, i18n, passport };

	return express.Router()
		// API
		.get("/api/notifications", adminApiController.notifications(mod))
		.get("/api/homeStats", adminApiController.homeStats(mod))
		// Admin Panel Auth
		.get("/", adminController.index(mod))
		.get("/login", adminController.login(mod))
		.post("/login", adminController.loginAction(mod))
		.get("/logout", adminController.logoutAction(mod))
		// Admin Panel Home
		.get("/home", adminController.home(mod))
		.get("/profile", adminController.profile(mod))
		.get("/settings", adminController.settings(mod))
		.get("/operations_report", adminOperationsReportController.index(mod))
		.get("/operations_report/view", adminOperationsReportController.view(mod))
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
		// Servers List (SLS(mod))
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
		// Report
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
		.get("/shop_products/delete", adminShopProductsController.deleteAction(mod))
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
		.get("/boxes_logs", adminBoxesController.logs(mod))
		// Tasks queue
		.get("/tasks", adminTasksController.index(mod))
		.get("/tasks/restart", adminTasksController.restartAction(mod))
		.get("/tasks/cancel_failed", adminTasksController.cancelFailedAction(mod))
		.get("/tasks/cancel_all", adminTasksController.cancelAllAction(mod))
	;
};