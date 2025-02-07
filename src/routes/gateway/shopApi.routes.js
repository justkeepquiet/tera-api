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
module.exports = async modules => express.Router()
	.get("/ListAccounts", gatewayShopController.ListAccounts(modules))
	.get("/GetAccountInfoByUserNo", gatewayShopController.GetAccountInfoByUserNo(modules))
	.post("/FundByUserNo", gatewayShopController.FundByUserNo(modules))
	.get("/ListCoupons", gatewayShopController.ListCoupons(modules))
	.get("/ListCouponsAvailableByUserNo", gatewayShopController.ListCouponsAvailableByUserNo(modules))
	.get("/ListCouponsActivatedByUserNo", gatewayShopController.ListCouponsActivatedByUserNo(modules))
	.get("/ListCouponsActivatedById", gatewayShopController.ListCouponsActivatedById(modules))
	.post("/AddNewCoupon", gatewayShopController.AddNewCoupon(modules))
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
				res.status(500).json({ Return: false, ReturnCode: 1, Msg: "Internal Server Error" });
			}
		}
	)
;