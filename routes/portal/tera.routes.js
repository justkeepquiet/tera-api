"use strict";

const express = require("express");
const controller = require("../../controllers/tera.controller");

module.exports = express.Router()
	.get("/ServerList", controller.serverList)
	.post("/GetAccountInfoByUserNo", controller.getAccountInfoByUserNo)
	.post("/LauncherLoginAction", controller.launcherLoginAction)
;