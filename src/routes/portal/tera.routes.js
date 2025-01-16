"use strict";

/**
 * @typedef {import("express").RequestHandler} RequestHandler
 * @typedef {import("express").ErrorRequestHandler} ErrorRequestHandler
 * @typedef {import("../../app").modules} modules
 */

const express = require("express");

const ApiError = require("../../lib/apiError");
const IpBlockHandler = require("../../utils/ipBlockHandler");
const portalSlsController = require("../../controllers/portalSls.controller");

/**
 * @param {modules} modules
 */
module.exports = modules => {
	if (!modules.config.get("slsOverride")) {
		modules.logger.warn("Cannot read configuration: slsOverride");
	}

	const ipBlock = new IpBlockHandler(modules.geoip, modules.ipapi, modules.logger);

	modules.serverModel.info.count().then(servers => {
		if (servers === null || servers === 0) {
			modules.logger.warn("ServerList: No TERA servers have been added. Go to Admin Panel and add at least one server.");
		}
	}).catch(err =>
		module.logger.error(err)
	);

	modules.serverModel.strings.count().then(strings => {
		if (strings === null || strings === 0) {
			modules.logger.warn("ServerList: No server strings sets added. Go to Admin Panel and add at least one server strings set.");
		}
	}).catch(err =>
		module.logger.error(err)
	);

	modules.app.use("/tera", async (req, res, next) => {
		const config = modules.config.get("ipBlock");
		const blocked = await ipBlock.applyBlock(req.ip, res.locals.__endpoint, config);

		if (blocked) {
			res.status(403).json({ Return: false, ReturnCode: 403, Msg: "Access denied" });
		} else {
			next();
		}
	});

	return express.Router()
		// SLS
		.get("/ServerList", portalSlsController.GetServerList(modules, "xml"))
		.get("/ServerList.xml", portalSlsController.GetServerList(modules, "xml"))
		.get("/ServerList.json", portalSlsController.GetServerList(modules, "json"))

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
};