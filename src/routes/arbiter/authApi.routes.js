"use strict";

/**
 * @typedef {import("express").ErrorRequestHandler} ErrorRequestHandler
 * @typedef {import("../../app").modules} modules
 */

const express = require("express");

const ApiError = require("../../lib/apiError");
const arbiterAuthController = require("../../controllers/arbiterAuth.controller");

/**
 * @param {modules} modules
 */
module.exports = async modules => express.Router()
	.post("/RequestAuthkey", arbiterAuthController.RequestAuthkey(modules))
	.post("/GameAuthenticationLogin", arbiterAuthController.GameAuthenticationLogin(modules))

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