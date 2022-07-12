"use strict";

/**
 * @typedef {import("../app").modules} modules
 * @typedef {import("express").RequestHandler} RequestHandler
 */

const expressLayouts = require("express-ejs-layouts");
const moment = require("moment-timezone");
const { query, body } = require("express-validator");
const helpers = require("../utils/helpers");

const { accessFunctionHandler, shopStatusHandler, writeOperationReport } = require("../middlewares/admin.middlewares");

/**
 * @param {modules} modules
 */
module.exports.index = ({ logger, shopModel }) => [
	accessFunctionHandler,
	shopStatusHandler,
	expressLayouts,
	/**
	 * @type {RequestHandler}
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

/**
 * @param {modules} modules
 */
module.exports.add = ({ i18n }) => [
	accessFunctionHandler,
	shopStatusHandler,
	expressLayouts,
	[
		query("accountDBID").trim().optional()
			.isInt({ min: 0 }).withMessage(i18n.__("Account ID field must contain a valid number."))
	],
	/**
	 * @type {RequestHandler}
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

/**
 * @param {modules} modules
 */
module.exports.addAction = ({ i18n, logger, reportModel, accountModel, shopModel }) => [
	accessFunctionHandler,
	shopStatusHandler,
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
	 * @type {RequestHandler}
	 */
	(req, res, next) => {
		const { accountDBID, balance, active } = req.body;
		const errors = helpers.validationResultLog(req, logger);

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
			next()
		).catch(err => {
			logger.error(err);
			res.render("adminError", { layout: "adminLayout", err });
		});
	},
	writeOperationReport(reportModel),
	/**
	 * @type {RequestHandler}
	 */
	(req, res) => {
		res.redirect("/shop_accounts");
	}
];

/**
 * @param {modules} modules
 */
module.exports.edit = ({ logger, shopModel }) => [
	accessFunctionHandler,
	shopStatusHandler,
	expressLayouts,
	/**
	 * @type {RequestHandler}
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

/**
 * @param {modules} modules
 */
module.exports.editAction = ({ i18n, logger, reportModel, shopModel }) => [
	accessFunctionHandler,
	shopStatusHandler,
	expressLayouts,
	[
		body("balance").trim()
			.isInt({ min: 0 }).withMessage(i18n.__("Balance field must contain a valid number.")),
		body("active").optional()
			.isIn(["on"]).withMessage(i18n.__("Active field has invalid value."))
	],
	/**
	 * @type {RequestHandler}
	 */
	(req, res, next) => {
		const { accountDBID } = req.query;
		const { balance, active } = req.body;
		const errors = helpers.validationResultLog(req, logger);

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
			next()
		).catch(err => {
			logger.error(err);
			res.render("adminError", { layout: "adminLayout", err });
		});
	},
	writeOperationReport(reportModel),
	/**
	 * @type {RequestHandler}
	 */
	(req, res) => {
		res.redirect("/shop_accounts");
	}
];

/**
 * @param {modules} modules
 */
module.exports.deleteAction = ({ logger, reportModel, shopModel }) => [
	accessFunctionHandler,
	shopStatusHandler,
	expressLayouts,
	/**
	 * @type {RequestHandler}
	 */
	(req, res, next) => {
		const { accountDBID } = req.query;

		if (!accountDBID) {
			return res.redirect("/shop_accounts");
		}

		shopModel.accounts.destroy({ where: { accountDBID } }).then(() =>
			next()
		).catch(err => {
			logger.error(err);
			res.render("adminError", { layout: "adminLayout", err });
		});
	},
	writeOperationReport(reportModel),
	/**
	 * @type {RequestHandler}
	 */
	(req, res) => {
		res.redirect("/shop_accounts");
	}
];