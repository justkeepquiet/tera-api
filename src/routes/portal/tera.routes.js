"use strict";

/**
* @typedef {import("../../app").modules} modules
*/

const express = require("express");

const portalSlsController = require("../../controllers/portalSls.controller");
const portalAccountController = require("../../controllers/portalAccount.controller");

/**
* @param {modules} modules
*/
module.exports = modules => express.Router()
	.get("/ServerList", portalSlsController.GetServerListXml(modules))
	.post("/GetAccountInfoByUserNo", portalAccountController.GetAccountInfoByUserNo(modules))
	.post("/SetAccountInfoByUserNo", portalAccountController.SetAccountInfoByUserNo(modules))
;