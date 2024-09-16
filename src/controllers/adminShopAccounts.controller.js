"use strict";

/**
 * @typedef {import("../app").modules} modules
 * @typedef {import("express").RequestHandler} RequestHandler
 */

const expressLayouts = require("express-ejs-layouts");
const moment = require("moment-timezone");
const { query, body } = require("express-validator");

const {
	accessFunctionHandler,
	validationHandler,
	formValidationHandler,
	formResultErrorHandler,
	formResultSuccessHandler,
	writeOperationReport
} = require("../middlewares/admin.middlewares");

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
			where: { ...accountDBID ? { accountDBID } : {} }
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
module.exports.add = ({ logger, i18n }) => [
	accessFunctionHandler,
	expressLayouts,
	[
		query("accountDBID").optional()
			.isInt({ min: 0 }).withMessage(i18n.__("Account ID field must contain a valid number."))
	],
	validationHandler(logger),
	/**
	 * @type {RequestHandler}
	 */
	async (req, res, next) => {
		const { accountDBID } = req.query;

		res.render("adminShopAccountsAdd", {
			layout: "adminLayout",
			accountDBID
		});
	}
];

/**
 * @param {modules} modules
 */
module.exports.addAction = ({ i18n, logger, reportModel, accountModel, shopModel }) => [
	accessFunctionHandler,
	[
		body("accountDBID")
			.isInt({ min: 0 }).withMessage(i18n.__("Account ID field must contain a valid number."))
			.custom(value => shopModel.accounts.findOne({
				where: { accountDBID: value }
			}).then(data => {
				if (value && data !== null) {
					return Promise.reject(i18n.__("Shop account with specified account ID already exists."));
				}
			}))
			.custom(value => accountModel.info.findOne({
				where: { accountDBID: value }
			}).then(data => {
				if (value && data === null) {
					return Promise.reject(i18n.__("Account ID field contains not existing account ID."));
				}
			})),
		body("balance")
			.isInt({ min: 0 }).withMessage(i18n.__("Balance field must contain a valid number.")),
		body("active").optional()
			.isIn(["on"]).withMessage(i18n.__("Active field has invalid value."))
	],
	formValidationHandler(logger),
	/**
	 * @type {RequestHandler}
	 */
	async (req, res, next) => {
		const { accountDBID, balance, active } = req.body;

		await shopModel.accounts.create({
			accountDBID,
			balance,
			active: active == "on"
		});

		next();
	},
	writeOperationReport(reportModel),
	formResultErrorHandler(logger),
	formResultSuccessHandler("/shop_accounts")
];

/**
 * @param {modules} modules
 */
module.exports.edit = ({ logger, shopModel }) => [
	accessFunctionHandler,
	expressLayouts,
	[
		query("accountDBID").notEmpty()
	],
	validationHandler(logger),
	/**
	 * @type {RequestHandler}
	 */
	async (req, res, next) => {
		const { accountDBID } = req.query;

		const data = await shopModel.accounts.findOne({
			where: { accountDBID }
		});

		if (data === null) {
			throw Error("Object not found");
		}

		res.render("adminShopAccountsEdit", {
			layout: "adminLayout",
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
	[
		query("accountDBID").notEmpty(),
		body("balance")
			.isInt({ min: 0 }).withMessage(i18n.__("Balance field must contain a valid number.")),
		body("active").optional()
			.isIn(["on"]).withMessage(i18n.__("Active field has invalid value."))
	],
	formValidationHandler(logger),
	/**
	 * @type {RequestHandler}
	 */
	async (req, res, next) => {
		const { accountDBID } = req.query;
		const { balance, active } = req.body;

		await shopModel.accounts.update({
			balance,
			active: active == "on"
		}, {
			where: { accountDBID }
		});

		next();
	},
	writeOperationReport(reportModel),
	formResultErrorHandler(logger),
	formResultSuccessHandler("/shop_accounts")
];

/**
 * @param {modules} modules
 */
module.exports.deleteAction = ({ logger, reportModel, shopModel }) => [
	accessFunctionHandler,
	expressLayouts,
	[
		query("accountDBID").notEmpty()
	],
	validationHandler(logger),
	/**
	 * @type {RequestHandler}
	 */
	async (req, res, next) => {
		const { accountDBID } = req.query;

		await shopModel.accounts.destroy({
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