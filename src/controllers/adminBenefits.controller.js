"use strict";

const expressLayouts = require("express-ejs-layouts");
const Op = require("sequelize").Op;
const moment = require("moment-timezone");
const logger = require("../utils/logger");
const accountModel = require("../models/account.model");
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

		if (!accountDBID) {
			return res.render("adminBenefits", {
				layout: "adminLayout",
				benefits: null,
				moment,
				accountDBID
			});
		}

		accountModel.benefits.findAll({
			where: {
				accountDBID
			}
		}).then(benefits => {
			res.render("adminBenefits", {
				layout: "adminLayout",
				benefits,
				moment,
				accountDBID
			});
		}).catch(err => {
			logger.error(err.toString());
			res.render("adminError", { layout: "adminLayout", err });
		});
	}
];

module.exports.add = [];
module.exports.addAction = [];
module.exports.edit = [];
module.exports.editAction = [];
module.exports.deleteAction = [];