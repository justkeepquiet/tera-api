"use strict";

/**
 * @typedef {import("express").ErrorRequestHandler} ErrorRequestHandler
 * @typedef {import("../../app").modules} modules
 */

const express = require("express");

const ApiError = require("../../lib/apiError");
const gatewayServerController = require("../../controllers/gatewayServer.controller");

/**
 * @param {modules} modules
 */
module.exports = modules => express.Router()
	.get("/ListServers", gatewayServerController.ListServers(modules))
	.get("/ListOnlineAccountsByServerId", gatewayServerController.ListOnlineAccountsByServerId(modules))
	.get("/GetServerInfoByServerId", gatewayServerController.GetServerInfoByServerId(modules))
	.post("/KickAccountByUserNo", gatewayServerController.KickAccountByUserNo(modules))
	.post("/KickAllAccountsByServerId", gatewayServerController.KickAllAccountsByServerId(modules))

	.use(
		/**
		 * @type {ErrorRequestHandler}
		 */
		(err, req, res, next) => {
			if (err instanceof ApiError) {
				res.json({ Return: false, ReturnCode: err.code, Msg: err.message });
			} else {
				modules.logger.error(err);
				res.status(500).json({ Return: false, ReturnCode: 1, Msg: "Internal Server Error" });
			}
		}
	)
;