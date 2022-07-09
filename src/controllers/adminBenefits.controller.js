"use strict";

/**
 * @typedef {import("../app").modules} modules
 * @typedef {import("express").RequestHandler} RequestHandler
 */

const expressLayouts = require("express-ejs-layouts");
const moment = require("moment-timezone");
const { query, body } = require("express-validator");
const helpers = require("../utils/helpers");

const { accessFunctionHandler } = require("../middlewares/admin.middlewares");

/**
 * @param {modules} modules
 */
module.exports.index = ({ i18n, logger, accountModel, datasheets }) => [
	accessFunctionHandler,
	expressLayouts,
	/**
	 * @type {RequestHandler}
	 */
	(req, res) => {
		const { accountDBID } = req.query;
		const accountBenefits = datasheets.StrSheet_AccountBenefit[i18n.getLocale()] || new Map();

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
				accountBenefits,
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
		const accountBenefits = datasheets.StrSheet_AccountBenefit[i18n.getLocale()] || new Map();

		res.render("adminBenefitsAdd", {
			layout: "adminLayout",
			errors: null,
			moment,
			accountBenefits,
			accountDBID,
			benefitId: "",
			availableUntil: moment().add(30, "days")
		});
	}
];

/**
 * @param {modules} modules
 */
module.exports.addAction = ({ i18n, logger, accountModel, datasheets }) => [
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
			})),
		body("benefitId").trim()
			.isInt({ min: 0 }).withMessage(i18n.__("Benefit ID field must contain a valid number.")),
		body("availableUntil").trim()
			.isISO8601().withMessage("Available until field must contain a valid date.")
	],
	/**
	 * @type {RequestHandler}
	 */
	(req, res) => {
		const { accountDBID, benefitId, availableUntil } = req.body;
		const errors = helpers.validationResultLog(req, logger);

		const accountBenefits = datasheets.StrSheet_AccountBenefit[i18n.getLocale()] || new Map();

		if (!errors.isEmpty()) {
			return res.render("adminBenefitsAdd", {
				layout: "adminLayout",
				errors: errors.array(),
				moment,
				accountBenefits,
				accountDBID,
				benefitId,
				availableUntil: moment(availableUntil)
			});
		}

		accountModel.benefits.create({
			accountDBID,
			benefitId,
			availableUntil: moment(availableUntil).format("YYYY-MM-DD HH:mm:ss")
		}).then(() =>
			res.redirect(`/benefits?accountDBID=${accountDBID}`)
		).catch(err => {
			logger.error(err);
			res.render("adminError", { layout: "adminLayout", err });
		});
	}
];

/**
 * @param {modules} modules
 */
module.exports.edit = ({ i18n, logger, accountModel, datasheets }) => [
	accessFunctionHandler,
	expressLayouts,
	/**
	 * @type {RequestHandler}
	 */
	(req, res) => {
		const { accountDBID, benefitId } = req.query;
		const accountBenefits = datasheets.StrSheet_AccountBenefit[i18n.getLocale()] || new Map();

		if (!accountDBID || !benefitId) {
			return res.redirect("/benefits");
		}

		accountModel.benefits.findOne({
			where: { benefitId, accountDBID }
		}).then(data => {
			if (data === null) {
				return res.redirect(`/benefits?accountDBID=${accountDBID}`);
			}

			res.render("adminBenefitsEdit", {
				layout: "adminLayout",
				errors: null,
				moment,
				accountBenefits,
				accountDBID: data.get("accountDBID"),
				benefitId: data.get("benefitId"),
				availableUntil: moment(data.get("availableUntil"))
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
module.exports.editAction = ({ logger, accountModel }) => [
	accessFunctionHandler,
	expressLayouts,
	[
		body("availableUntil").trim()
			.isISO8601().withMessage("Available until field must contain a valid date.")
	],
	/**
	 * @type {RequestHandler}
	 */
	(req, res) => {
		const { accountDBID, benefitId } = req.query;
		const { availableUntil } = req.body;
		const errors = helpers.validationResultLog(req, logger);

		if (!accountDBID || !benefitId) {
			return res.redirect("/benefits");
		}

		if (!errors.isEmpty()) {
			return res.render("adminBenefitsEdit", {
				layout: "adminLayout",
				errors: errors.array(),
				moment,
				accountDBID,
				benefitId,
				availableUntil
			});
		}

		accountModel.benefits.update({
			availableUntil
		}, {
			where: { benefitId, accountDBID }
		}).then(() =>
			res.redirect(`/benefits?accountDBID=${accountDBID}`)
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
		const { accountDBID, benefitId } = req.query;

		if (!accountDBID || !benefitId) {
			return res.redirect("/benefits");
		}

		accountModel.benefits.destroy({ where: { benefitId, accountDBID } }).then(() =>
			res.redirect(`/benefits?accountDBID=${accountDBID}`)
		).catch(err => {
			logger.error(err);
			res.render("adminError", { layout: "adminLayout", err });
		});
	}
];