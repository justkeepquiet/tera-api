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
module.exports = async modules => express.Router()
	.get("/ListAccounts", gatewayAccountController.ListAccounts(modules))
	.get("/ListCharactersByUserNo", gatewayAccountController.ListCharactersByUserNo(modules))
	.get("/ListBenefitsByUserNo", gatewayAccountController.ListBenefitsByUserNo(modules))
	.get("/GetAccountInfoByUserNo", gatewayAccountController.GetAccountInfoByUserNo(modules))
	.get("/GetAccountBanByUserNo", gatewayAccountController.GetAccountBanByUserNo(modules))
	.post("/RegisterNewAccount", gatewayAccountController.RegisterNewAccount(modules))
	.post("/AddBenefitByUserNo", gatewayAccountController.AddBenefitByUserNo(modules))
	.post("/RemoveBenefitByUserNo", gatewayAccountController.RemoveBenefitByUserNo(modules))
	.post("/BanAccountByUserNo", gatewayAccountController.BanAccountByUserNo(modules))

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