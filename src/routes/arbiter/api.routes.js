"use strict";

/**
* @typedef {import("../../app").modules} modules
*/

const express = require("express");
const arbiterApiController = require("../../controllers/arbiterApi.controller");

/**
* @param {modules} modules
*/
module.exports = modules => express.Router()
	.get("/ServiceTest", arbiterApiController.ServiceTest(modules))
	.post("/GetServerPermission", arbiterApiController.GetServerPermission(modules))
	.post("/ServerDown", arbiterApiController.ServerDown(modules))
	.post("/GetUserInfo", arbiterApiController.GetUserInfo(modules))
	.post("/EnterGame", arbiterApiController.EnterGame(modules))
	.post("/LeaveGame", arbiterApiController.LeaveGame(modules))
	.post("/CreateChar", arbiterApiController.CreateChar(modules))
	.post("/ModifyChar", arbiterApiController.ModifyChar(modules))
	.post("/DeleteChar", arbiterApiController.DeleteChar(modules))
	.post("/UseChronoScroll", arbiterApiController.UseChronoScroll(modules))
	.post("/report_cheater", arbiterApiController.ReportCheater(modules))
;