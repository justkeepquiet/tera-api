"use strict";

/**
* @typedef {import("../../app").modules} modules
*/

const express = require("express");
const gatewayAccountController = require("../../controllers/gatewayAccount.controller");

/**
* @param {modules} modules
*/
module.exports = modules => express.Router()
	.get("/GetAccountInfoByUserNo", gatewayAccountController.GetAccountInfoByUserNo(modules))
;