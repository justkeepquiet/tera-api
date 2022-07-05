"use strict";

const expressLayouts = require("express-ejs-layouts");
const moment = require("moment-timezone");
const { query, body } = require("express-validator");
const logger = require("../utils/logger");
const helpers = require("../utils/helpers");
const accountModel = require("../models/account.model");
const shopModel = require("../models/shop.model");
const { i18n, i18nHandler, accessFunctionHandler } = require("../middlewares/admin.middlewares");

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
				...accountDBID ? { accountDBID } : {}
			}
		}).then(accounts => {
			res.render("adminShopAccounts", {
				layout: "adminLayout",
				accounts,
				moment,
				accountDBID
			});
		}).catch(err => {
			logger.error(err);
			res.render("adminError", { layout: "adminLayout", err });
		});
	}
];

module.exports.add = [
	i18nHandler,
	accessFunctionHandler(),
	expressLayouts,
	[
		query("accountDBID").trim().optional()
			.isInt({ min: 0 }).withMessage(i18n.__("Account ID field must contain a valid number."))
	],
	/**
	 * @type {import("express").RequestHandler}
	 */
	(req, res) => {
		const { accountDBID } = req.query;

		res.render("adminShopAccountsAdd", {
			layout: "adminLayout",
			errors: null,
			moment,
			accountDBID,
			balance: 0,
			active: 1
		});
	}
];

module.exports.addAction = [
	i18nHandler,
	accessFunctionHandler(),
	expressLayouts,
	[
		body("accountDBID").trim()
			.isInt({ min: 0 }).withMessage(i18n.__("Account ID field must contain a valid number."))
			.custom((value, { req }) => shopModel.accounts.findOne({
				where: {
					accountDBID: req.body.accountDBID
				}
			}).then(data => {
				if (req.body.accountDBID && data !== null) {
					return Promise.reject(i18n.__("Shop account with specified account ID already exists."));
				}
			}))
			.custom((value, { req }) => accountModel.info.findOne({
				where: {
					accountDBID: req.body.accountDBID
				}
			}).then(data => {
				if (req.body.accountDBID && data === null) {
					return Promise.reject(i18n.__("Account ID field contains not existing account ID."));
				}
			})),
		body("balance").trim()
			.isInt({ min: 0 }).withMessage(i18n.__("Balance field must contain a valid number.")),
		body("active").optional()
			.isIn(["on"]).withMessage(i18n.__("Active field has invalid value."))
	],
	/**
	 * @type {import("express").RequestHandler}
	 */
	(req, res) => {
		const { accountDBID, balance, active } = req.body;
		const errors = helpers.validationResultLog(req);

		if (!errors.isEmpty()) {
			return res.render("adminShopAccountsAdd", {
				layout: "adminLayout",
				errors: errors.array(),
				accountDBID,
				balance,
				active
			});
		}

		shopModel.accounts.create({
			accountDBID,
			balance,
			active: active == "on"
		}).then(() =>
			res.redirect("/shop_accounts")
		).catch(err => {
			logger.error(err);
			res.render("adminError", { layout: "adminLayout", err });
		});
	}
];

module.exports.edit = [
	i18nHandler,
	accessFunctionHandler(),
	expressLayouts,
	/**
	 * @type {import("express").RequestHandler}
	 */
	(req, res) => {
		const { accountDBID } = req.query;

		if (!accountDBID) {
			return res.redirect("/shop_accounts");
		}

		shopModel.accounts.findOne({
			where: { accountDBID }
		}).then(data => {
			if (data === null) {
				return res.redirect("/shop_accounts");
			}

			res.render("adminShopAccountsEdit", {
				layout: "adminLayout",
				errors: null,
				accountDBID: data.get("accountDBID"),
				balance: data.get("balance"),
				active: data.get("active")
			});
		}).catch(err => {
			logger.error(err);
			res.render("adminError", { layout: "adminLayout", err });
		});
	}
];

module.exports.editAction = [
	i18nHandler,
	accessFunctionHandler(),
	expressLayouts,
	[
		body("balance").trim()
			.isInt({ min: 0 }).withMessage(i18n.__("Balance field must contain a valid number.")),
		body("active").optional()
			.isIn(["on"]).withMessage(i18n.__("Active field has invalid value."))
	],
	/**
	 * @type {import("express").RequestHandler}
	 */
	(req, res) => {
		const { accountDBID } = req.query;
		const { balance, active } = req.body;
		const errors = helpers.validationResultLog(req);

		if (!accountDBID) {
			return res.redirect("/shop_accounts");
		}

		if (!errors.isEmpty()) {
			return res.render("adminShopAccountsEdit", {
				layout: "adminLayout",
				errors: errors.array(),
				accountDBID,
				balance,
				active
			});
		}

		shopModel.accounts.update({
			balance,
			active: active == "on"
		}, {
			where: { accountDBID }
		}).then(() =>
			res.redirect("/shop_accounts")
		).catch(err => {
			logger.error(err);
			res.render("adminError", { layout: "adminLayout", err });
		});
	}
];

module.exports.deleteAction = [
	i18nHandler,
	accessFunctionHandler(),
	expressLayouts,
	/**
	 * @type {import("express").RequestHandler}
	 */
	(req, res) => {
		const { accountDBID } = req.query;

		if (!accountDBID) {
			return res.redirect("/shop_accounts");
		}

		shopModel.accounts.destroy({ where: { accountDBID } }).then(() =>
			res.redirect("/shop_accounts")
		).catch(err => {
			logger.error(err);
			res.render("adminError", { layout: "adminLayout", err });
		});
	}
];