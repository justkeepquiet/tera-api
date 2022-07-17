"use strict";

/**
* @typedef {import("../../app").modules} modules
*/

const express = require("express");
const shopApiController = require("../../controllers/shopApi.controller");

/**
* @param {modules} modules
*/
module.exports = modules => express.Router()
	.post("/GetAccountInfoByUserNo", shopApiController.GetAccountInfoByUserNo(modules))
	.post("/FundByUserNo", shopApiController.FundByUserNo(modules))
;