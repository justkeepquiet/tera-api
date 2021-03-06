"use strict";

const express = require("express");
const portalSlsController = require("../../controllers/portalSls.controller");
const portalAccountController = require("../../controllers/portalAccount.controller");
const portalLauncherController = require("../../controllers/portalLauncher.controller");

module.exports = express.Router()
	// Interfaces
	.get("/ServerList", ...portalSlsController.GetServerListXml)
	.post("/GetAccountInfoByUserNo", ...portalAccountController.GetAccountInfo)
	// Launcher
	.get("/LauncherMaintenanceStatus", ...portalLauncherController.MaintenanceStatus)
	.get("/LauncherMain", ...portalLauncherController.MainHtml)
	.get("/LauncherLoginForm", ...portalLauncherController.LoginFormHtml)
	.get("/LauncherSignupForm", ...portalLauncherController.SignupFormHtml)
	.post("/LauncherLoginAction", ...portalLauncherController.LoginAction)
	.post("/LauncherSignupAction", ...portalLauncherController.SignupAction)
;