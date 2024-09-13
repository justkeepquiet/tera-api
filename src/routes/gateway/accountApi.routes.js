"use strict";

/**
 * @typedef {import("express").ErrorRequestHandler} ErrorRequestHandler
 * @typedef {import("../../app").modules} modules
 */

const express = require("express");

const ApiError = require("../../lib/apiError");
const gatewayAccountController = require("../../controllers/gatewayAccount.controller");

/**
 * @param {modules} modules
 */
module.exports = modules => express.Router()
	.get("/GetAccountInfoByUserNo", gatewayAccountController.GetAccountInfoByUserNo(modules))
	.get("/GetAccountBanByUserNo", gatewayAccountController.GetAccountBanByUserNo(modules))

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