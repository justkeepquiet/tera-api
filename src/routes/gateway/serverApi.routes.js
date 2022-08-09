"use strict";

/**
* @typedef {import("../../app").modules} modules
*/

const express = require("express");
const gatewayServerController = require("../../controllers/gatewayServer.controller");

/**
* @param {modules} modules
*/
module.exports = modules => express.Router()
	.get("/GetServerInfoByServerId", gatewayServerController.GetServerInfoByServerId(modules))
;