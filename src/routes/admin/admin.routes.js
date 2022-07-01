"use strict";

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
const adminPromocodesController = require("../../controllers/adminPromocodes.controller");
const adminPromocodesActivatedController = require("../../controllers/adminPromocodesActivated.controller");
const adminShopLogsController = require("../../controllers/adminShopLogs.controller");

module.exports = express.Router()
	// Admin Panel Auth
	.get("/", ...adminController.index)
	.get("/login", ...adminController.login)
	.post("/login", ...adminController.loginAction)
	.get("/logout", ...adminController.logoutAction)
	// Admin Panel Home
	.get("/home", ...adminController.home) // -----------------
	.get("/profile", ...adminController.profile)
	.get("/settings", ...adminController.settings)
	// Account Management
	.get("/characters", ...adminAccountsController.characters)
	.get("/accounts", ...adminAccountsController.index)
	.get("/accounts/add", ...adminAccountsController.add)
	.post("/accounts/add", ...adminAccountsController.addAction)
	.get("/accounts/edit", ...adminAccountsController.edit)
	.post("/accounts/edit", ...adminAccountsController.editAction)
	.get("/accounts/delete", ...adminAccountsController.deleteAction)
	// Account Benefits
	.get("/benefits", ...adminBenefitsController.index)
	.get("/benefits/add", ...adminBenefitsController.add)
	.post("/benefits/add", ...adminBenefitsController.addAction)
	.get("/benefits/edit", ...adminBenefitsController.edit)
	.post("/benefits/edit", ...adminBenefitsController.editAction)
	.get("/benefits/delete", ...adminBenefitsController.deleteAction)
	// Servers List (SLS)
	.get("/servers", ...adminServersController.index)
	.get("/servers/add", ...adminServersController.add)
	.post("/servers/add", ...adminServersController.addAction)
	.get("/servers/edit", ...adminServersController.edit)
	.post("/servers/edit", ...adminServersController.editAction)
	.get("/servers/delete", ...adminServersController.deleteAction)
	// Servers Strings
	.get("/server_strings", ...adminServerStringsController.index)
	.get("/server_strings/add", ...adminServerStringsController.add)
	.post("/server_strings/add", ...adminServerStringsController.addAction)
	.get("/server_strings/edit", ...adminServerStringsController.edit)
	.post("/server_strings/edit", ...adminServerStringsController.editAction)
	.get("/server_strings/delete", ...adminServerStringsController.deleteAction)
	// Server Maintenance
	.get("/maintenance", ...adminMaintenanceController.index)
	.get("/maintenance/add", ...adminMaintenanceController.add)
	.post("/maintenance/add", ...adminMaintenanceController.addAction)
	.get("/maintenance/edit", ...adminMaintenanceController.edit)
	.post("/maintenance/edit", ...adminMaintenanceController.editAction)
	.get("/maintenance/delete", ...adminMaintenanceController.deleteAction)
	// Report
	.get("/report_activity", ...adminReportController.activity)
	.get("/report_characters", ...adminReportController.characters)
	.get("/report_cheats", ...adminReportController.cheats)
	.get("/report_chronoscrolls", ...adminReportController.chronoscrolls)
	// Shop Account Management
	.get("/shop_accounts", ...adminShopAccountsController.index)
	.get("/shop_accounts/add", ...adminShopAccountsController.add)
	.post("/shop_accounts/add", ...adminShopAccountsController.addAction)
	.get("/shop_accounts/edit", ...adminShopAccountsController.edit)
	.post("/shop_accounts/edit", ...adminShopAccountsController.editAction)
	.get("/shop_accounts/delete", ...adminShopAccountsController.deleteAction)
	// Shop Categories
	.get("/shop_categories", ...adminShopCategoriesController.index)
	.get("/shop_categories/add", ...adminShopCategoriesController.add)
	.post("/shop_categories/add", ...adminShopCategoriesController.addAction)
	.get("/shop_categories/edit", ...adminShopCategoriesController.edit)
	.post("/shop_categories/edit", ...adminShopCategoriesController.editAction)
	.get("/shop_categories/delete", ...adminShopCategoriesController.deleteAction)
	// Shop Products
	// .get("/shop_products", ...adminShopProductsController.index)
	// .get("/shop_products/add", ...adminShopProductsController.add)
	// .post("/shop_products/add", ...adminShopProductsController.addAction)
	// .get("/shop_products/edit", ...adminShopProductsController.edit)
	// .post("/shop_products/edit", ...adminShopProductsController.editAction)
	// .get("/shop_products/delete", ...adminShopProductsController.deleteAction)
	// Shop Promocodes
	.get("/promocodes", ...adminPromocodesController.index)
	.get("/promocodes/add", ...adminPromocodesController.add)
	.post("/promocodes/add", ...adminPromocodesController.addAction)
	.get("/promocodes/edit", ...adminPromocodesController.edit)
	.post("/promocodes/edit", ...adminPromocodesController.editAction)
	.get("/promocodes/delete", ...adminPromocodesController.deleteAction)
	// Shop Activated Procmocodes
	.get("/promocodes_activated", ...adminPromocodesActivatedController.index)
	.get("/promocodes_activated/add", ...adminPromocodesActivatedController.add)
	.post("/promocodes_activated/add", ...adminPromocodesActivatedController.addAction)
	.get("/promocodes_activated/delete", ...adminPromocodesActivatedController.deleteAction)
	// Shop Logs
	.get("/shop_fund_logs", ...adminShopLogsController.fund)
	.get("/shop_pay_logs", ...adminShopLogsController.pay)
;