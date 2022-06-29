"use strict";

const express = require("express");
const adminController = require("../../controllers/admin.controller");
const adminServerController = require("../../controllers/adminServer.controller");
const adminAccountController = require("../../controllers/adminAccount.controller");
const adminReportController = require("../../controllers/adminReport.controller");
const adminShopController = require("../../controllers/adminShop.controller");

module.exports = express.Router()
	.get("/test", ...adminController.test)

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
	.get("/accounts", ...adminAccountController.accounts)
	.get("/accountAdd", ...adminController.home)
	.post("/accountAddAction", ...adminController.home)
	.get("/accountEdit", ...adminController.home)
	.post("/accountEditAction", ...adminController.home)
	.post("/accountDeleteAction", ...adminController.home)
	// Account Benefits
	.get("/benefits", ...adminAccountController.benefits)
	.get("/benefitAdd", ...adminController.home)
	.post("/benefitAddAction", ...adminController.home)
	.get("/benefitEdit", ...adminController.home)
	.post("/benefitEditAction", ...adminController.home)
	.post("/benefitDeleteAction", ...adminController.home)
	// Account Characters
	.get("/characters", ...adminAccountController.characters)
	// Servers List (SLS)
	.get("/servers", ...adminServerController.servers)
	.get("/serverAdd", ...adminController.home)
	.post("/serverAddAction", ...adminController.home)
	.get("/serverEdit", ...adminController.home)
	.post("/serverEditAction", ...adminController.home)
	.post("/serverDeleteAction", ...adminController.home)
	// Servers Strings
	.get("/serverStrings", ...adminServerController.serverStrings)
	.get("/serverStringsAdd", ...adminController.home)
	.post("/servertringsAddAction", ...adminController.home)
	.get("/serverStringsEdit", ...adminController.home)
	.post("/serverStringsEditAction", ...adminController.home)
	.post("/serverStringsDeleteAction", ...adminController.home)
	// Server Maintenance
	.get("/maintenance", ...adminServerController.maintenance)
	.get("/maintenanceAdd", ...adminServerController.maintenanceAdd)
	.post("/maintenanceAdd", ...adminServerController.maintenanceAddAction)
	.get("/maintenanceEdit", ...adminServerController.maintenanceEdit)
	.post("/maintenanceEdit", ...adminServerController.maintenanceEditAction)
	.get("/maintenanceDelete", ...adminServerController.maintenanceDeleteAction)
	// Report
	.get("/reportActivity", ...adminReportController.activity)
	.get("/reportCharacters", ...adminReportController.characters)
	.get("/reportCheats", ...adminReportController.cheats)
	.get("/reportChronoscrolls", ...adminReportController.chronoscrolls)
	// Shop Account Management
	.get("/shopAccounts", ...adminShopController.accounts)
	.get("/shopAccountAdd", ...adminController.home)
	.post("/shopAccountAddAction", ...adminController.home)
	.get("/shopAccountEdit", ...adminController.home)
	.post("/shopAccountEditAction", ...adminController.home)
	.post("/shopAccountDeleteAction", ...adminController.home)
	// Shop Categories
	.get("/shopCategory", ...adminController.home)
	.get("/shopCategoryAdd", ...adminController.home)
	.post("/shopCategoryAddAction", ...adminController.home)
	.get("/shopCategoryEdit", ...adminController.home)
	.post("/shopCategoryEditAction", ...adminController.home)
	.post("/shopCategoryDeleteAction", ...adminController.home)
	// Shop Category Strings
	.get("/shopCategoryStrings", ...adminController.home)
	.get("/shopCategoryStringsAdd", ...adminController.home)
	.post("/shopCategoryStringsAddAction", ...adminController.home)
	.get("/shopCategoryStringsEdit", ...adminController.home)
	.post("/shopCategoryStringsEditAction", ...adminController.home)
	.post("/shopCategoryStringsDeleteAction", ...adminController.home)
	// Shop Products
	// Shop Product Strings
	// Shop Product Items
	// Shop Promocodes
	.get("/promocodes", ...adminShopController.promocodes)
	.get("/promocodeStrings", ...adminShopController.promocodeStrings)
	.get("/promocodesActivated", ...adminShopController.promocodesActivated)
	// Shop Logs
	.get("/shopFundLogs", ...adminShopController.fundLogs)
	.get("/shopPayLogs", ...adminShopController.payLogs)
;