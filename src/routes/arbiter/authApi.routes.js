"use strict";

const express = require("express");
const arbiterAuthController = require("../../controllers/arbiterAuth.controller");

module.exports = express.Router()
	.post("/GameAuthenticationLogin", ...arbiterAuthController.GameAuthenticationLogin)
;