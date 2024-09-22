"use strict";

/**
 * @typedef {import("../app").modules} modules
 * @typedef {import("express").RequestHandler} RequestHandler
 */

const expressLayouts = require("express-ejs-layouts");
const moment = require("moment-timezone");
const { query, body } = require("express-validator");

const {
	validationHandler,
	formValidationHandler,
	formResultErrorHandler,
	formResultSuccessHandler,
	accessFunctionHandler,
	writeOperationReport
} = require("../middlewares/admin.middlewares");

/**
 * @param {modules} modules
 */
module.exports.index = ({ i18n, accountModel, datasheetModel }) => [
	accessFunctionHandler,
	expressLayouts,
	/**
	 * @type {RequestHandler}
	 */
	async (req, res, next) => {
		const { accountDBID } = req.query;
		const accountBenefits = datasheetModel.strSheetAccountBenefit[i18n.getLocale()];

		if (!accountDBID) {
			return res.render("adminBenefits", {
				layout: "adminLayout",
				benefits: null,
				moment,
				accountDBID
			});
		}

		const benefits = await accountModel.benefits.findAll({
			where: { accountDBID }
		});

		res.render("adminBenefits", {
			layout: "adminLayout",
			benefits,
			moment,
			accountBenefits,
			accountDBID
		});
	}
];

/**
 * @param {modules} modules
 */
module.exports.add = ({ logger, i18n, accountModel, datasheetModel }) => [
	accessFunctionHandler,
	expressLayouts,
	[
		query("accountDBID").optional({ checkFalsy: true })
			.isInt({ min: 0 }).withMessage(i18n.__("Account ID field must contain a valid number."))
			.custom(value => accountModel.info.findOne({
				where: { accountDBID: value }
			}).then(data => {
				if (value && data === null) {
					return Promise.reject(i18n.__("Account ID field contains not existing account ID."));
				}
			}))
	],
	validationHandler(logger),
	/**
	 * @type {RequestHandler}
	 */
	async (req, res, next) => {
		const { accountDBID } = req.query;
		const accountBenefits = datasheetModel.strSheetAccountBenefit[i18n.getLocale()];

		res.render("adminBenefitsAdd", {
			layout: "adminLayout",
			moment,
			accountBenefits,
			accountDBID
		});
	}
];

/**
 * @param {modules} modules
 */
module.exports.addAction = ({ i18n, logger, hub, reportModel, accountModel }) => [
	accessFunctionHandler,
	[
		body("accountDBID")
			.isInt({ min: 0 }).withMessage(i18n.__("Account ID field must contain a valid number."))
			.custom(value => accountModel.info.findOne({
				where: { accountDBID: value }
			}).then(data => {
				if (value && data === null) {
					return Promise.reject(i18n.__("Account ID field contains not existing account ID."));
				}
			})),
		body("benefitId")
			.isInt({ min: 0 }).withMessage(i18n.__("Benefit ID field must contain a valid number."))
			.custom((value, { req }) => accountModel.benefits.findOne({
				where: {
					accountDBID: req.body.accountDBID,
					benefitId: req.body.benefitId
				}
			}).then(data => {
				if (data !== null) {
					return Promise.reject(i18n.__("Benefit ID field contains existing benefit ID on account."));
				}
			})),
		body("availableUntil").trim()
			.isISO8601().withMessage("Available until field must contain a valid date.")
	],
	formValidationHandler(logger),
	/**
	 * @type {RequestHandler}
	 */
	async (req, res, next) => {
		const { accountDBID, benefitId, availableUntil } = req.body;

		try {
			const online = await accountModel.online.findOne({
				where: { accountDBID }
			});

			if (online !== null && moment.tz(availableUntil, req.user.tz) > moment()) {
				await hub.addBenefit(online.get("serverId"), online.get("accountDBID"), benefitId,
					moment.duration(moment.tz(availableUntil, req.user.tz).diff()).asSeconds());
			}
		} catch (err) {
			logger.warn(err.toString());
		}

		await accountModel.benefits.create({
			accountDBID,
			benefitId,
			availableUntil: moment.tz(availableUntil, req.user.tz).toDate()
		});

		next();
	},
	writeOperationReport(reportModel),
	formResultErrorHandler(logger),
	/**
	 * @type {RequestHandler}
	 */
	(req, res, next) => {
		formResultSuccessHandler(`/benefits?accountDBID=${req.body.accountDBID || ""}`)(req, res, next);
	}
];

/**
 * @param {modules} modules
 */
module.exports.edit = ({ logger, i18n, accountModel, datasheetModel }) => [
	accessFunctionHandler,
	expressLayouts,
	[
		query("accountDBID").notEmpty(),
		query("benefitId").notEmpty()
	],
	validationHandler(logger),
	/**
	 * @type {RequestHandler}
	 */
	async (req, res, next) => {
		const { accountDBID, benefitId } = req.query;
		const accountBenefits = datasheetModel.strSheetAccountBenefit[i18n.getLocale()];

		const data = await accountModel.benefits.findOne({
			where: { benefitId, accountDBID }
		});

		if (data === null) {
			throw Error("Object not found");
		}

		res.render("adminBenefitsEdit", {
			layout: "adminLayout",
			moment,
			accountBenefits,
			accountDBID: data.get("accountDBID"),
			benefitId: data.get("benefitId"),
			availableUntil: moment(data.get("availableUntil"))
		});
	}
];

/**
 * @param {modules} modules
 */
module.exports.editAction = ({ logger, hub, reportModel, accountModel }) => [
	accessFunctionHandler,
	[
		query("accountDBID").notEmpty(),
		query("benefitId").notEmpty(),
		body("availableUntil").trim()
			.isISO8601().withMessage("Available until field must contain a valid date.")
	],
	formValidationHandler(logger),
	/**
	 * @type {RequestHandler}
	 */
	async (req, res, next) => {
		const { accountDBID, benefitId } = req.query;
		const { availableUntil } = req.body;

		try {
			const online = await accountModel.online.findOne({
				where: { accountDBID }
			});

			if (online !== null) {
				await hub.removeBenefit(online.get("serverId"), online.get("accountDBID"), benefitId);

				if (moment.tz(availableUntil, req.user.tz) > moment()) {
					await hub.addBenefit(online.get("serverId"), online.get("accountDBID"), benefitId,
						moment.duration(moment.tz(availableUntil, req.user.tz).diff()).asSeconds());
				}
			}
		} catch (err) {
			logger.warn(err.toString());
		}

		await accountModel.benefits.update({
			availableUntil: moment.tz(availableUntil, req.user.tz).toDate()
		}, {
			where: { benefitId, accountDBID }
		});

		next();
	},
	writeOperationReport(reportModel),
	formResultErrorHandler(logger),
	/**
	 * @type {RequestHandler}
	 */
	(req, res, next) => {
		formResultSuccessHandler(`/benefits?accountDBID=${req.query.accountDBID || ""}`)(req, res, next);
	}
];

/**
 * @param {modules} modules
 */
module.exports.deleteAction = ({ logger, hub, reportModel, accountModel }) => [
	accessFunctionHandler,
	expressLayouts,
	[
		query("accountDBID").notEmpty(),
		query("benefitId").notEmpty()
	],
	validationHandler(logger),
	/**
	 * @type {RequestHandler}
	 */
	async (req, res, next) => {
		const { accountDBID, benefitId } = req.query;

		accountModel.online.findOne({
			where: { accountDBID }
		}).then(online => {
			if (online !== null) {
				return hub.removeBenefit(online.get("serverId"), online.get("accountDBID"), benefitId);
			}
		}).catch(err =>
			logger.warn(err.toString())
		);

		await accountModel.benefits.destroy({ where: { benefitId, accountDBID } });

		next();
	},
	writeOperationReport(reportModel),
	/**
	 * @type {RequestHandler}
	 */
	(req, res, next) => {
		res.redirect(`/benefits?accountDBID=${req.query.accountDBID || ""}`);
	}
];