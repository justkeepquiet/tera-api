"use strict";

const expressLayouts = require("express-ejs-layouts");
const body = require("express-validator").body;
const logger = require("../utils/logger");
const helpers = require("../utils/helpers");
const accountModel = require("../models/account.model");
const { i18n, i18nHandler, accessFunctionHandler } = require("../middlewares/admin.middlewares");

module.exports.index = [
	i18nHandler,
	accessFunctionHandler(),
	expressLayouts,
	/**
	 * @type {import("express").RequestHandler}
	 */
	(req, res) => {
		accountModel.serverStrings.findAll().then(strings => {
			res.render("adminServerStrings", {
				layout: "adminLayout",
				strings
			});
		}).catch(err => {
			logger.error(err.toString());
			res.render("adminError", { layout: "adminLayout", err });
		});
	}
];