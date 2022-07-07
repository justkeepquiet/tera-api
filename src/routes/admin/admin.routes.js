"use strict";

/**
* @typedef {import("../../app").modules} modules
*/

const path = require("path");
const I18n = require("i18n").I18n;
const express = require("express");

const adminController = require("../../controllers/admin.controller");
const adminServersController = require("../../controllers/adminServers.controller");
const adminServerStringsController = require("../../controllers/adminServerStrings.controller");
const adminMaintenanceController = require("../../controllers/adminMaintenance.controller");
const adminAccountsController = require("../../controllers/adminAccounts.controller");
const adminBenefitsController = require("../../controllers/adminBenefits.controller");
const adminReportController = require("../../controllers/adminReport.controller");
const adminShopAccountsController = require("../../controllers/adminShopAccounts.controller");
const adminShopCategoriesController = require("../../controllers/adminShopCategories.controller");
const adminShopProductsController = require("../../controllers/adminShopProducts.controller");
const adminPromocodesController = require("../../controllers/adminPromocodes.controller");
const adminPromocodesActivatedController = require("../../controllers/adminPromocodesActivated.controller");
const adminShopLogsController = require("../../controllers/adminShopLogs.controller");

/**
* @param {modules} modules
*/
module.exports = modules => {
	const i18n = new I18n({
		directory: path.resolve(__dirname, "../../locales/admin"),
		defaultLocale: process.env.ADMIN_PANEL_LOCALE
	});

	const mod = { ...modules, i18n };

	modules.app.use((req, res, next) => {
		res.locals.__ = i18n.__;
		res.locals.locale = i18n.getLocale();

		return next();
	});

	return express.Router()
		// Admin Panel Auth
		.get("/", adminController.index(mod))
		.get("/login", adminController.login(mod))
		.post("/login", adminController.loginAction(mod))
		.get("/logout", adminController.logoutAction(mod))
		// Admin Panel Home
		.get("/test", adminController.home(mod))
		.get("/home", adminController.home(mod))
		.get("/profile", adminController.profile(mod))
		.get("/settings", adminController.settings(mod))
		// Account Management
		.get("/accounts", adminAccountsController.index(mod))
		.get("/accounts/add", adminAccountsController.add(mod))
		.post("/accounts/add", adminAccountsController.addAction(mod))
		.get("/accounts/edit", adminAccountsController.edit(mod))
		.post("/accounts/edit", adminAccountsController.editAction(mod))
		.get("/accounts/delete", adminAccountsController.deleteAction(mod))
		.get("/characters", adminAccountsController.characters(mod))
		// Account Benefits
		.get("/benefits", adminBenefitsController.index(mod))
		.get("/benefits/add", adminBenefitsController.add(mod))
		.post("/benefits/add", adminBenefitsController.addAction(mod))
		.get("/benefits/edit", adminBenefitsController.edit(mod))
		.post("/benefits/edit", adminBenefitsController.editAction(mod))
		.get("/benefits/delete", adminBenefitsController.deleteAction(mod))
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
	;
};