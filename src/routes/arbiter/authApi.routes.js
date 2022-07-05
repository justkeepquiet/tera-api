"use strict";

const express = require("express");
const arbiterAuthController = require("../../controllers/arbiterAuth.controller");

module.exports = express.Router()
	.post("/RequestAuthkey", arbiterAuthController.RequestAuthkey)
	.post("/GameAuthenticationLogin", arbiterAuthController.GameAuthenticationLogin)
;