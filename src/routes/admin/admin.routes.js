"use strict";

const express = require("express");
const adminController = require("../../controllers/admin.controller");
const adminAccountController = require("../../controllers/adminAccount.controller");

module.exports = express.Router()
	.get("/test", ...adminController.testHtml)

	// Admin Panel Auth*
	.get("/", ...adminController.indexHtml)
	.get("/login", ...adminController.loginHtml)
	.post("/login", ...adminController.loginActionHtml)
	.get("/logout", ...adminController.logoutAction)
	// Admin Panel Home
	.get("/home", ...adminController.homeHtml)
	.get("/profile", ...adminController.profileHtml)
	// Account Management
	.get("/account", ...adminAccountController.test)
	.get("/accountAdd", ...adminAccountController.test)
	.post("/accountAddAction", ...adminAccountController.test)
	.get("/accountEdit", ...adminAccountController.test)
	.post("/accountEditAction", ...adminAccountController.test)
	.post("/accountDeleteAction", ...adminAccountController.test)
	// Account Benefits
	.get("/benefit", ...adminController.homeHtml)
	.get("/benefitAdd", ...adminController.homeHtml)
	.post("/benefitAddAction", ...adminController.homeHtml)
	.get("/benefitEdit", ...adminController.homeHtml)
	.post("/benefitEditAction", ...adminController.homeHtml)
	.post("/benefitDeleteAction", ...adminController.homeHtml)
	// Account Characters
	.get("/characters", ...adminController.homeHtml)
	// Servers List (SLS)
	.get("/sls", ...adminController.homeHtml)
	.get("/slsAdd", ...adminController.homeHtml)
	.post("/slsAddAction", ...adminController.homeHtml)
	.get("/slsEdit", ...adminController.homeHtml)
	.post("/slsEditAction", ...adminController.homeHtml)
	.post("/slsDeleteAction", ...adminController.homeHtml)
	// Servers Strings
	.get("/slsStrings", ...adminController.homeHtml)
	.get("/slsStringsAdd", ...adminController.homeHtml)
	.post("/slsStringsAddAction", ...adminController.homeHtml)
	.get("/slsStringsEdit", ...adminController.homeHtml)
	.post("/slsStringsEditAction", ...adminController.homeHtml)
	.post("/slsStringsDeleteAction", ...adminController.homeHtml)
	// Server Maintenance
	.get("/maintenance", ...adminController.homeHtml)
	.get("/maintenanceAdd", ...adminController.homeHtml)
	.post("/maintenanceAddAction", ...adminController.homeHtml)
	.get("/maintenanceEdit", ...adminController.homeHtml)
	.post("/maintenanceEditAction", ...adminController.homeHtml)
	.post("/maintenanceDeleteAction", ...adminController.homeHtml)
	// Report
	.get("/reportActivity", ...adminController.homeHtml)
	.get("/reportCharacters", ...adminController.homeHtml)
	.get("/reportCheates", ...adminController.homeHtml)
	.get("/reportChronoscrolls", ...adminController.homeHtml)
	// Shop Account Management
	.get("/shopAccount", ...adminController.homeHtml)
	.get("/shopAccountAdd", ...adminController.homeHtml)
	.post("/shopAccountAddAction", ...adminController.homeHtml)
	.get("/shopAccountEdit", ...adminController.homeHtml)
	.post("/shopAccountEditAction", ...adminController.homeHtml)
	.post("/shopAccountDeleteAction", ...adminController.homeHtml)
	// Shop Categories
	.get("/shopCategory", ...adminController.homeHtml)
	.get("/shopCategoryAdd", ...adminController.homeHtml)
	.post("/shopCategoryAddAction", ...adminController.homeHtml)
	.get("/shopCategoryEdit", ...adminController.homeHtml)
	.post("/shopCategoryEditAction", ...adminController.homeHtml)
	.post("/shopCategoryDeleteAction", ...adminController.homeHtml)
	// Shop Category Strings
	.get("/shopCategoryStrings", ...adminController.homeHtml)
	.get("/shopCategoryStringsAdd", ...adminController.homeHtml)
	.post("/shopCategoryStringsAddAction", ...adminController.homeHtml)
	.get("/shopCategoryStringsEdit", ...adminController.homeHtml)
	.post("/shopCategoryStringsEditAction", ...adminController.homeHtml)
	.post("/shopCategoryStringsDeleteAction", ...adminController.homeHtml)
	// Shop Products
	// Shop Product Strings
	// Shop Product Items
	// Shop Promocodes
	// Shop Promocode Strings
	// Shop Activated Promocodes
	// Shop Fund Logs
	// Shop Pay Logs
;