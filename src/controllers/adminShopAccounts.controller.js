"use strict";

const expressLayouts = require("express-ejs-layouts");
const Op = require("sequelize").Op;
const moment = require("moment-timezone");
const logger = require("../utils/logger");
const accountModel = require("../models/account.model");
const shopModel = require("../models/shop.model");
const { i18nHandler, validationHandler, accessFunctionHandler } = require("../middlewares/admin.middlewares");

module.exports.index = [
	i18nHandler,
	accessFunctionHandler(),
	expressLayouts,
	/**
	 * @type {import("express").RequestHandler}
	 */
	(req, res) => {
		const { accountDBID } = req.query;

		shopModel.accounts.findAll({
			where: {
				...(accountDBID ? { accountDBID } : {})
			}
		}).then(accounts => {
			res.render("adminShopAccounts", {
				layout: "adminLayout",
				accounts,
				moment,
				accountDBID
			});
		}).catch(err => {
			logger.error(err.toString());
			res.render("adminError", { layout: "adminLayout", err });
		});
	}
];