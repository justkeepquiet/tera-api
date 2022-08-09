"use strict";

/**
* @typedef {import("../../app").modules} modules
*/

const express = require("express");
const gatewayShopController = require("../../controllers/gatewayShop.controller");

/**
* @param {modules} modules
*/
module.exports = modules => express.Router()
	.get("/GetAccountInfoByUserNo", gatewayShopController.GetAccountInfoByUserNo(modules))
	.post("/FundByUserNo", gatewayShopController.FundByUserNo(modules))
;