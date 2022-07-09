"use strict";

/**
 * @typedef {import("../app").modules} modules
 * @typedef {import("express").RequestHandler} RequestHandler
 */

const expressLayouts = require("express-ejs-layouts");
const moment = require("moment-timezone");
const body = require("express-validator").body;
const fcgiHttpHelper = require("../utils/fcgiHttpHelper");
const helpers = require("../utils/helpers");

const { accessFunctionHandler } = require("../middlewares/admin.middlewares");

/**
 * @param {modules} modules
 */
module.exports.index = ({ logger, accountModel }) => [
	accessFunctionHandler,
	expressLayouts,
	/**
	 * @type {RequestHandler}
	 */
	(req, res) => {
		accountModel.bans.findAll().then(bans => {
			res.render("adminBans", {
				layout: "adminLayout",
				moment,
				bans
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
module.exports.add = ({ i18n, accountModel, datasheets }) => [
	accessFunctionHandler,
	expressLayouts,
	[
		body("accountDBID").trim()
			.isInt({ min: 0 }).withMessage(i18n.__("Account ID field must contain a valid number."))
			.custom((value, { req }) => accountModel.info.findOne({
				where: {
					accountDBID: req.body.accountDBID
				}
			}).then(data => {
				if (req.body.accountDBID && data === null) {
					return Promise.reject(i18n.__("Account ID field contains not existing account ID."));
				}
			}))
	],
	/**
	 * @type {RequestHandler}
	 */
	(req, res) => {
		const { accountDBID } = req.query;

		res.render("adminBansAdd", {
			layout: "adminLayout",
			errors: null,
			moment,
			accountDBID,
			startTime: moment(),
			endTime: moment().add(30, "days"),
			description: ""
		});
	}
];

/**
 * @param {modules} modules
 */
module.exports.addAction = ({ i18n, logger, accountModel }) => [
	accessFunctionHandler,
	expressLayouts,
	[
		body("accountDBID").trim()
			.isInt({ min: 0 }).withMessage(i18n.__("Account ID field must contain a valid number."))
			.custom((value, { req }) => accountModel.bans.findOne({
				where: {
					accountDBID: req.body.accountDBID
				}
			}).then(data => {
				if (req.body.accountDBID && data !== null) {
					return Promise.reject(i18n.__("Account ID field contains already banned account ID."));
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
		body("startTime")
			.isISO8601().withMessage(i18n.__("Start time field must contain a valid date.")),
		body("endTime")
			.isISO8601().withMessage(i18n.__("End time field must contain a valid date.")),
		body("description").trim()
			.isLength({ min: 1, max: 1024 }).withMessage(i18n.__("Description field must be between 1 and 1024 characters."))
	],
	/**
	 * @type {RequestHandler}
	 */
	(req, res) => {
		const { accountDBID, startTime, endTime, description } = req.body;
		const errors = helpers.validationResultLog(req, logger);

		if (!errors.isEmpty()) {
			return res.render("adminBansAdd", {
				layout: "adminLayout",
				errors: errors.array(),
				accountDBID,
				startTime: moment(startTime),
				endTime: moment(endTime),
				description
			});
		}

		accountModel.info.findOne({ where: { accountDBID } }).then(account =>
			accountModel.bans.create({
				accountDBID: account.get("accountDBID"),
				startTime: moment(startTime).format("YYYY-MM-DD HH:mm:ss"),
				endTime: moment(endTime).format("YYYY-MM-DD HH:mm:ss"),
				description
			}).then(() => {
				if (account.get("lastLoginServer") && moment(startTime) < moment() && moment(endTime) > moment()) {
					fcgiHttpHelper.get(["kick", account.get("lastLoginServer"), account.get("accountDBID"), 264]).catch(err =>
						logger.warn(err)
					);
				}

				res.redirect("/bans");
			})
		).catch(err => {
			logger.error(err);
			res.render("adminError", { layout: "adminLayout", err });
		});
	}
];

/**
 * @param {modules} modules
 */
module.exports.edit = ({ logger, accountModel }) => [
	accessFunctionHandler,
	expressLayouts,
	/**
	 * @type {RequestHandler}
	 */
	(req, res) => {
		const { accountDBID } = req.query;

		if (!accountDBID) {
			return res.redirect("/bans");
		}

		accountModel.bans.findOne({ where: { accountDBID } }).then(data => {
			if (data === null) {
				return res.redirect("/bans");
			}

			res.render("adminBansEdit", {
				layout: "adminLayout",
				errors: null,
				accountDBID: data.get("accountDBID"),
				startTime: moment(data.get("startTime")),
				endTime: moment(data.get("endTime")),
				description: data.get("description")
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
module.exports.editAction = ({ i18n, logger, accountModel }) => [
	accessFunctionHandler,
	expressLayouts,
	[
		body("startTime")
			.isISO8601().withMessage(i18n.__("Start time field must contain a valid date.")),
		body("endTime")
			.isISO8601().withMessage(i18n.__("End time field must contain a valid date.")),
		body("description").trim()
			.isLength({ min: 1, max: 1024 }).withMessage(i18n.__("Description field must be between 1 and 1024 characters."))
	],
	/**
	 * @type {RequestHandler}
	 */
	(req, res) => {
		const { accountDBID } = req.query;
		const { startTime, endTime, description } = req.body;
		const errors = helpers.validationResultLog(req, logger);

		if (!accountDBID) {
			return res.redirect("/bans");
		}

		if (!errors.isEmpty()) {
			return res.render("adminBansEdit", {
				layout: "adminLayout",
				errors: errors.array(),
				accountDBID,
				startTime: moment(startTime),
				endTime: moment(endTime),
				description
			});
		}

		accountModel.info.findOne({ where: { accountDBID } }).then(account =>
			accountModel.bans.update({
				startTime: moment(startTime).format("YYYY-MM-DD HH:mm:ss"),
				endTime: moment(endTime).format("YYYY-MM-DD HH:mm:ss"),
				description
			}, {
				where: { accountDBID }
			}).then(() => {
				if (account.get("lastLoginServer") && moment(startTime) < moment() && moment(endTime) > moment()) {
					fcgiHttpHelper.get(["kick", account.get("lastLoginServer"), account.get("accountDBID"), 264]).catch(err =>
						logger.warn(err)
					);
				}

				res.redirect("/bans");
			})
		).catch(err => {
			logger.error(err);
			res.render("adminError", { layout: "adminLayout", err });
		});
	}
];

/**
 * @param {modules} modules
 */
module.exports.deleteAction = ({ logger, accountModel }) => [
	accessFunctionHandler,
	expressLayouts,
	/**
	 * @type {RequestHandler}
	 */
	(req, res) => {
		const { accountDBID } = req.query;

		if (!accountDBID) {
			return res.redirect("/bans");
		}

		accountModel.bans.destroy({ where: { accountDBID } }).then(() =>
			res.redirect("/bans")
		).catch(err => {
			logger.error(err);
			res.render("adminError", { layout: "adminLayout", err });
		});
	}
];