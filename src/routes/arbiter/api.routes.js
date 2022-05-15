"use strict";

const express = require("express");
const arbiterApiController = require("../../controllers/arbiterApi.controller");

module.exports = express.Router()
	.get("/ServiceTest", ...arbiterApiController.ServiceTest)
	.post("/GetServerPermission", ...arbiterApiController.GetServerPermission)
	.post("/ServerDown", ...arbiterApiController.ServerDown)
	.post("/GetUserInfo", ...arbiterApiController.GetUserInfo)
	.post("/EnterGame", ...arbiterApiController.EnterGame)
	.post("/LeaveGame", ...arbiterApiController.LeaveGame)
	.post("/CreateChar", ...arbiterApiController.CreateChar)
	.post("/ModifyChar", ...arbiterApiController.ModifyChar)
	.post("/DeleteChar", ...arbiterApiController.DeleteChar)
	.post("/UseChronoScroll", ...arbiterApiController.UseChronoScroll)
	.post("/report_cheater", ...arbiterApiController.ReportCheater)
;