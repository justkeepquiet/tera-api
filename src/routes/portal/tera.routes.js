"use strict";

const express = require("express");
const portalSlsController = require("../../controllers/portalSls.controller");
const portalLauncherController = require("../../controllers/portalLauncher.controller");

module.exports = express.Router()
	.get("/ServerList", ...portalSlsController.getServerListXML)
	.post("/GetAccountInfoByUserNo", ...portalLauncherController.GetAccountInfoByUserNo)
	.post("/LauncherLoginAction", ...portalLauncherController.LauncherLoginAction)
;