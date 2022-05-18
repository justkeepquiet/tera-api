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
	.get("/LauncherMain", ...portalLauncherController.MainHtml)
	.get("/LauncherLoginForm", ...portalLauncherController.LoginFormHtml)
	.post("/LauncherLoginAction", ...portalLauncherController.LoginAction)
	.post("/LauncherLogoutAction", ...portalLauncherController.LogoutAction)
;