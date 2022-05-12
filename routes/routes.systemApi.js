"use strict";

const express = require("express");
const controller = require("../controllers/systemApi.controller");

module.exports = express.Router()
	.get("/RequestAPIServerStatusAvailable", controller.requestAPIServerStatusAvailable)
;