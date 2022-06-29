"use strict";

const express = require("express");
const adminController = require("../../controllers/admin.controller");
const adminServersController = require("../../controllers/adminServers.controller");
const adminServerStringsController = require("../../controllers/adminServerStrings.controller");
const adminMaintenanceController = require("../../controllers/adminMaintenance.controller");
const adminAccountsController = require("../../controllers/adminAccounts.controller");
const adminBenefitsController = require("../../controllers/adminBenefits.controller");
const adminReportController = require("../../controllers/adminReport.controller");
const adminShopController = require("../../controllers/adminShop.controller");

module.exports = express.Router()
	// Admin Panel Auth*
	.get("/", ...adminController.index)
	.get("/login", ...adminController.login)
	.post("/login", ...adminController.loginAction)
	.get("/logout", ...adminController.logoutAction)
	// Admin Panel Home
	.get("/home", ...adminController.home)
	.get("/profile", ...adminController.profile)
	.get("/settings", ...adminController.settings)
	// Account Management
	.get("/characters", ...adminAccountsController.characters)
	.get("/accounts", ...adminAccountsController.index)
	.get("/accounts/add", ...adminAccountsController.add)
	// .post("/accounts/add", ...adminAccountsController.addAction)
	// .get("/accounts/edit", ...adminAccountsController.edit)
	// .post("/accounts/edit", ...adminAccountsController.editAction)
	// .get("/accounts/delete", ...adminAccountsController.deleteAction)
	// Account Benefits
	.get("/benefits", ...adminBenefitsController.index)
	.get("/benefits/add", ...adminBenefitsController.add)
	.post("/benefits/add", ...adminBenefitsController.addAction)
	.get("/benefits/edit", ...adminBenefitsController.edit)
	.post("/benefits/edit", ...adminBenefitsController.editAction)
	.get("/benefits/delete", ...adminBenefitsController.deleteAction)
	// Servers List (SLS)*
	.get("/servers", ...adminServersController.index)
	.get("/servers/add", ...adminServersController.add)
	.post("/servers/add", ...adminServersController.addAction)
	.get("/servers/edit", ...adminServersController.edit)
	.post("/servers/edit", ...adminServersController.editAction)
	.get("/servers/delete", ...adminServersController.deleteAction)
	// Servers Strings
	.get("/server_strings", ...adminServerStringsController.index)
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
	.get("/shop_accounts", ...adminShopController.accounts)
	// Shop Categories
	.get("/shop_category", ...adminController.home)
	// Shop Category Strings
	.get("/shop_category_strings", ...adminController.home)
	// Shop Products
	// Shop Product Strings
	// Shop Product Items
	// Shop Promocodes
	.get("/promocodes", ...adminShopController.promocodes)
	.get("/promocode_strings", ...adminShopController.promocodeStrings)
	.get("/promocodes_activated", ...adminShopController.promocodesActivated)
	// Shop Logs
	.get("/shop_fund_logs", ...adminShopController.fundLogs)
	.get("/shop_pay_logs", ...adminShopController.payLogs)
;