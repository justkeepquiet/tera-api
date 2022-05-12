"use strict";

const express = require("express");
const controller = require("../controllers/authApi.controller");

module.exports = express.Router()
	.post("/GameAuthenticationLogin", controller.gameAuthenticationLogin)
;