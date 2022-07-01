"use strict";

const expressLayouts = require("express-ejs-layouts");
const moment = require("moment-timezone");
const { query, body } = require("express-validator");
const logger = require("../utils/logger");
const helpers = require("../utils/helpers");
const datasheets = require("../utils/datasheets");
const accountModel = require("../models/account.model");
const { i18n, i18nHandler, accessFunctionHandler } = require("../middlewares/admin.middlewares");

const accountBenefits = datasheets.accountBenefits[i18n.getLocale()] || new Map();

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
				accountBenefits,
				accountDBID
			});
		}).catch(err => {
			logger.error(err.toString());
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

module.exports.addAction = [
	i18nHandler,
	accessFunctionHandler(),
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
	 * @type {import("express").RequestHandler}
	 */
	(req, res) => {
		const { accountDBID, benefitId, availableUntil } = req.body;
		const errors = helpers.validationResultLog(req);

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
			availableUntil: moment(availableUntil).format("YYYY-MM-DD HH:MM:ss")
		}).then(() =>
			res.redirect(`/benefits?accountDBID=${accountDBID}`)
		).catch(err => {
			logger.error(err.toString());
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
		const { accountDBID, benefitId } = req.query;

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
			logger.error(err.toString());
			res.render("adminError", { layout: "adminLayout", err });
		});
	}
];

module.exports.editAction = [
	i18nHandler,
	accessFunctionHandler(),
	expressLayouts,
	[
		body("availableUntil").trim()
			.isISO8601().withMessage("Available until field must contain a valid date.")
	],
	/**
	 * @type {import("express").RequestHandler}
	 */
	(req, res) => {
		const { accountDBID, benefitId } = req.query;
		const { availableUntil } = req.body;
		const errors = helpers.validationResultLog(req);

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
			logger.error(err.toString());
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
		const { accountDBID, benefitId } = req.query;

		if (!accountDBID || !benefitId) {
			return res.redirect("/benefits");
		}

		accountModel.benefits.destroy({ where: { benefitId, accountDBID } }).then(() =>
			res.redirect(`/benefits?accountDBID=${accountDBID}`)
		).catch(err => {
			logger.error(err.toString());
			res.render("adminError", { layout: "adminLayout", err });
		});
	}
];