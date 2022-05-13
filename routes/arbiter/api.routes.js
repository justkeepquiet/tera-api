"use strict";

const express = require("express");
const controller = require("../../controllers/api.controller");

module.exports = express.Router()
	.get("/ServiceTest", controller.serviceTest)
	.post("/GetServerPermission", controller.getServerPermission)
	.post("/ServerDown", controller.serverDown)
	.post("/GetUserInfo", controller.getUserInfo)
	.post("/EnterGame", controller.enterGame)
	.post("/LeaveGame", controller.leaveGame)
	.post("/CreateChar", controller.createChar)
	.post("/ModifyChar", controller.modifyChar)
	.post("/DeleteChar", controller.deleteChar)
	.post("/UseChronoScroll", controller.useChronoScroll)
	.post("/report_cheater", controller.reportCheater)
;