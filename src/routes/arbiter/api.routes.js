"use strict";

/**
 * @typedef {import("express").ErrorRequestHandler} ErrorRequestHandler
 * @typedef {import("../../app").modules} modules
 */

const express = require("express");

const ApiError = require("../../lib/apiError");
const arbiterApiController = require("../../controllers/arbiterApi.controller");

/**
 * @param {modules} modules
 */
module.exports = async modules => express.Router()
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

	.use(
		/**
		 * @type {ErrorRequestHandler}
		 */
		(err, req, res, next) => {
			if (err instanceof ApiError) {
				res.json({ Return: false, ReturnCode: err.code, Msg: err.message });
			} else {
				modules.logger.error(err);
				res.status(500).json({ Return: false, ReturnCode: 1, Msg: "internal server error" });
			}
		}
	)
;