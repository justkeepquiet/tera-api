"use strict";

const express = require("express");
const portalSlsController = require("../../controllers/portalSls.controller");
const portalAccountController = require("../../controllers/portalAccount.controller");

module.exports = express.Router()
	.get("/ServerList", ...portalSlsController.GetServerListXML)
	.post("/GetAccountInfoByUserNo", ...portalAccountController.GetAccountInfo)
	.post("/LauncherLoginAction", ...portalAccountController.ActionLogin)
	.post("/LauncherLogoutAction", ...portalAccountController.ActionLogout)
;