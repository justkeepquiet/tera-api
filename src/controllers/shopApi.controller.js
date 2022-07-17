"use strict";

/**
 * @typedef {import("../app").modules} modules
 * @typedef {import("express").RequestHandler} RequestHandler
 */

const moment = require("moment-timezone");
const Op = require("sequelize").Op;
const { query, body } = require("express-validator");
const helpers = require("../utils/helpers");

const { resultJson } = require("../middlewares/portalShop.middlewares");

/**
 * @param {modules} modules
 */
module.exports.fund = () => [
	// @todo
];