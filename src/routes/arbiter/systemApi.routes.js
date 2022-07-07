"use strict";

/**
* @typedef {import("../../app").modules} modules
*/

const express = require("express");
const arbiterAuthController = require("../../controllers/arbiterAuth.controller");

/**
* @param {modules} modules
*/
module.exports = modules => express.Router()
	.get("/RequestAPIServerStatusAvailable", arbiterAuthController.RequestAPIServerStatusAvailable(modules))
;