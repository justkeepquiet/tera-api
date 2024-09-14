"use strict";

/**
 * @typedef {import("../app").modules} modules
 * @typedef {import("express").RequestHandler} RequestHandler
 */

const expressLayouts = require("express-ejs-layouts");
const moment = require("moment-timezone");
const { query, body } = require("express-validator");

const helpers = require("../utils/helpers");
const { accessFunctionHandler, writeOperationReport } = require("../middlewares/admin.middlewares");

/**
 * @param {modules} modules
 */
module.exports.index = ({ shopModel }) => [
	accessFunctionHandler,
	expressLayouts,
	/**
	 * @type {RequestHandler}
	 */
	async (req, res, next) => {
		const { accountDBID } = req.query;

		const accounts = await shopModel.accounts.findAll({
			where: {
				...accountDBID ? { accountDBID } : {}
			}
		});

		res.render("adminShopAccounts", {
			layout: "adminLayout",
			accounts,
			moment,
			accountDBID
		});
	}
];

/**
 * @param {modules} modules
 */
module.exports.add = ({ i18n }) => [
	accessFunctionHandler,
	expressLayouts,
	[
		query("accountDBID").optional()
			.isInt({ min: 0 }).withMessage(i18n.__("Account ID field must contain a valid number."))
	],
	/**
	 * @type {RequestHandler}
	 */
	async (req, res, next) => {
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
	expressLayouts,
	[
		body("accountDBID")
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
		body("balance")
			.isInt({ min: 0 }).withMessage(i18n.__("Balance field must contain a valid number.")),
		body("active").optional()
			.isIn(["on"]).withMessage(i18n.__("Active field has invalid value."))
	],
	/**
	 * @type {RequestHandler}
	 */
	async (req, res, next) => {
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

		await shopModel.accounts.create({
			accountDBID,
			balance,
			active: active == "on"
		});

		next();
	},
	writeOperationReport(reportModel),
	/**
	 * @type {RequestHandler}
	 */
	(req, res, next) => {
		res.redirect("/shop_accounts");
	}
];

/**
 * @param {modules} modules
 */
module.exports.edit = ({ shopModel }) => [
	accessFunctionHandler,
	expressLayouts,
	/**
	 * @type {RequestHandler}
	 */
	async (req, res, next) => {
		const { accountDBID } = req.query;

		if (!accountDBID) {
			return res.redirect("/shop_accounts");
		}

		const data = await shopModel.accounts.findOne({
			where: { accountDBID }
		});

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
	}
];

/**
 * @param {modules} modules
 */
module.exports.editAction = ({ i18n, logger, reportModel, shopModel }) => [
	accessFunctionHandler,
	expressLayouts,
	[
		body("balance")
			.isInt({ min: 0 }).withMessage(i18n.__("Balance field must contain a valid number.")),
		body("active").optional()
			.isIn(["on"]).withMessage(i18n.__("Active field has invalid value."))
	],
	/**
	 * @type {RequestHandler}
	 */
	async (req, res, next) => {
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

		await shopModel.accounts.update({
			balance,
			active: active == "on"
		}, {
			where: { accountDBID }
		});

		next();
	},
	writeOperationReport(reportModel),
	/**
	 * @type {RequestHandler}
	 */
	(req, res, next) => {
		res.redirect("/shop_accounts");
	}
];

/**
 * @param {modules} modules
 */
module.exports.deleteAction = ({ reportModel, shopModel }) => [
	accessFunctionHandler,
	expressLayouts,
	/**
	 * @type {RequestHandler}
	 */
	async (req, res, next) => {
		const { accountDBID } = req.query;

		if (!accountDBID) {
			return res.redirect("/shop_accounts");
		}

		await shopModel.accounts.destroy({ where: { accountDBID } });

		next();
	},
	writeOperationReport(reportModel),
	/**
	 * @type {RequestHandler}
	 */
	(req, res, next) => {
		res.redirect("/shop_accounts");
	}
];