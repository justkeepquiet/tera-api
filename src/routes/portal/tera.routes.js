"use strict";

/**
 * @typedef {import("express").RequestHandler} RequestHandler
 * @typedef {import("express").ErrorRequestHandler} ErrorRequestHandler
 * @typedef {import("../../app").modules} modules
 */

const express = require("express");

const ApiError = require("../../lib/apiError");
const portalSlsController = require("../../controllers/portalSls.controller");
const portalAccountController = require("../../controllers/portalAccount.controller");

/**
 * @param {modules} modules
 */
module.exports = modules => express.Router()
	// SLS
	.get("/ServerList", portalSlsController.GetServerList(modules, "xml"))
	.get("/ServerList.xml", portalSlsController.GetServerList(modules, "xml"))
	.get("/ServerList.json", portalSlsController.GetServerList(modules, "json"))

	// Account API (deprecated)
	.post("/GetAccountInfoByUserNo", portalAccountController.GetAccountInfoByUserNo(modules))
	.post("/SetAccountInfoByUserNo", portalAccountController.SetAccountInfoByUserNo(modules))

	// Launcher
	.get("/LauncherMain", (req, res) => {
		res.redirect(301, `/launcher/Main?${new URLSearchParams(req.query).toString()}`);
	})

	// Shop
	.get("/ShopAuth", (req, res) => {
		res.redirect(301, `/shop/Auth?${new URLSearchParams(req.query).toString()}`);
	})

	.use(
		/**
		 * @type {ErrorRequestHandler}
		 */
		(err, req, res, next) => {
			if (err instanceof ApiError) {
				res.json({ Return: false, ReturnCode: err.code, Msg: err.message });
			} else {
				modules.logger.error(err);
				res.json({ Return: false, ReturnCode: 1, Msg: "internal error" });
			}
		}
	)
;