"use strict";

/**
 * @typedef {import("express").ErrorRequestHandler} ErrorRequestHandler
 * @typedef {import("../../app").modules} modules
 */

const express = require("express");

const ApiError = require("../../lib/apiError");
const arbiterAuthController = require("../../controllers/arbiterAuth.controller");

/**
 * @param {modules} modules
 */
module.exports = modules => express.Router()
	.get("/RequestAPIServerStatusAvailable", arbiterAuthController.RequestAPIServerStatusAvailable(modules))
;