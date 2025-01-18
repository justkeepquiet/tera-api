"use strict";

/**
 * @typedef {import("express").ErrorRequestHandler} ErrorRequestHandler
 * @typedef {import("../../app").modules} modules
 */

const express = require("express");

const ApiError = require("../../lib/apiError");
const gatewayShopController = require("../../controllers/gatewayShop.controller");

/**
 * @param {modules} modules
 */
module.exports = modules => express.Router()
	.get("/ListAccounts", gatewayShopController.ListAccounts(modules))
	.get("/GetAccountInfoByUserNo", gatewayShopController.GetAccountInfoByUserNo(modules))
	.post("/FundByUserNo", gatewayShopController.FundByUserNo(modules))
	.get("/ListPromoCodes", gatewayShopController.ListPromoCodes(modules))
	.get("/ListPromoCodesActivatedByUserNo", gatewayShopController.ListPromoCodesActivatedByUserNo(modules))
	.get("/ListPromoCodesActivatedById", gatewayShopController.ListPromoCodesActivatedById(modules))
	.post("/ActivatePromoCodeByUserNo", gatewayShopController.ActivatePromoCodeByUserNo(modules))

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