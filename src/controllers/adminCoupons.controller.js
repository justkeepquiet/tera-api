"use strict";

/**
 * @typedef {import("../app").modules} modules
 * @typedef {import("express").RequestHandler} RequestHandler
 */

const expressLayouts = require("express-ejs-layouts");
const { query, body } = require("express-validator");
const moment = require("moment-timezone");

const { generateRandomWord } = require("../utils/helpers");
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
module.exports.index = ({ accountModel, shopModel }) => [
	accessFunctionHandler,
	expressLayouts,
	/**
	 * @type {RequestHandler}
	 */
	async (req, res, next) => {
		const coupons = await shopModel.coupons.findAll({
			include: [{
				as: "account",
				model: accountModel.info,
				required: false,
				attributes: ["userName"]
			}]
		});

		// Correct the `currentActivations` value
		for (const coupon of coupons) {
			if (coupon.get("currentActivations") === 0) {
				const currentActivations = await shopModel.couponActivated.count({
					where: { couponId: coupon.get("couponId") }
				});

				await shopModel.coupons.update({
					currentActivations
				}, {
					where: { couponId: coupon.get("couponId") }
				});
			}
		}

		res.render("adminCoupons", {
			layout: "adminLayout",
			moment,
			coupons
		});
	}
];

/**
 * @param {modules} modules
 */
module.exports.add = ({ shopModel }) => [
	accessFunctionHandler,
	expressLayouts,
	/**
	 * @type {RequestHandler}
	 */
	async (req, res, next) => {

		let coupon = null;
		let couponCount = 0;

		do {
			coupon = generateRandomWord(8);
			couponCount = await shopModel.coupons.count({
				where: { coupon }
			});
		} while (couponCount > 0);

		if (req.query.generate === "true") {
			res.json({ result_code: 0, msg: "success", coupon });
			return;
		}

		res.render("adminCouponsAdd", {
			layout: "adminLayout",
			moment,
			coupon
		});
	}
];

/**
 * @param {modules} modules
 */
module.exports.addAction = ({ i18n, logger, reportModel, accountModel, shopModel }) => [
	accessFunctionHandler,
	[
		body("coupon").trim()
			.isLength({ min: 3, max: 8 }).withMessage(i18n.__("The field must be between 3 and 8 characters."))
			.custom(value => shopModel.coupons.findOne({
				where: { coupon: value }
			}).then(data => {
				if (data) {
					return Promise.reject(i18n.__("The field contains an existing coupon."));
				}
				return true;
			})),
		body("discount").trim()
			.isInt({ min: 0, max: 100 }).withMessage(i18n.__("The field must contain a valid number.")),
		body("validAfter").trim()
			.isISO8601().withMessage(i18n.__("The field must contain a valid date.")),
		body("validBefore").trim()
			.isISO8601().withMessage(i18n.__("The field must contain a valid date."))
			.custom((value, { req }) => {
				if (moment(value).isSameOrBefore(req.body.validAfter)) {
					return Promise.reject(`${i18n.__("The field must contain a valid date.")}`);
				}
				return true;
			}),
		body("maxActivations").trim()
			.isInt({ min: 0, max: 1e8 }).withMessage(i18n.__("The field must contain the value as a number.")),
		body("active").optional().trim()
			.isIn(["on"]).withMessage(i18n.__("The field has invalid value.")),
		body("accountDBID").trim().optional({ checkFalsy: true }).trim()
			.isInt().withMessage(i18n.__("The field must contain a valid number."))
			.custom(value => accountModel.info.findOne({
				where: { accountDBID: value }
			}).then(data => {
				if (value && data === null) {
					return Promise.reject(i18n.__("The field contains not existing account ID."));
				}
				return true;
			}))
	],
	formValidationHandler(logger),
	/**
	 * @type {RequestHandler}
	 */
	async (req, res, next) => {
		const { coupon, discount, validAfter, validBefore, maxActivations, active, accountDBID } = req.body;

		await shopModel.coupons.create({
			coupon,
			discount: discount,
			validAfter: moment.tz(validAfter, req.user.tz).toDate(),
			validBefore: moment.tz(validBefore, req.user.tz).toDate(),
			active: active == "on",
			maxActivations,
			accountDBID: accountDBID || null
		});

		next();
	},
	writeOperationReport(reportModel),
	formResultErrorHandler(logger),
	formResultSuccessHandler("/coupons")
];

/**
 * @param {modules} modules
 */
module.exports.edit = ({ logger, shopModel }) => [
	accessFunctionHandler,
	expressLayouts,
	[
		query("couponId").trim().notEmpty()
	],
	validationHandler(logger),
	/**
	 * @type {RequestHandler}
	 */
	async (req, res, next) => {
		const { couponId } = req.query;

		const coupon = await shopModel.coupons.findOne({
			where: { couponId }
		});

		if (coupon === null) {
			throw Error("Object not found");
		}

		res.render("adminCouponsEdit", {
			layout: "adminLayout",
			errors: null,
			couponId: coupon.get("couponId"),
			coupon: coupon.get("coupon"),
			discount: coupon.get("discount"),
			validAfter: moment(coupon.get("validAfter")),
			validBefore: moment(coupon.get("validBefore")),
			active: coupon.get("active"),
			maxActivations: coupon.get("maxActivations"),
			accountDBID: coupon.get("accountDBID")
		});
	}
],

/**
 * @param {modules} modules
 */
module.exports.editAction = ({ i18n, logger, reportModel, accountModel, shopModel }) => [
	accessFunctionHandler,
	[
		query("couponId").trim().notEmpty(),
		body("discount").trim()
			.isInt({ min: 0, max: 100 }).withMessage(i18n.__("The field must contain a valid number.")),
		body("validAfter").trim()
			.isISO8601().withMessage(i18n.__("The field must contain a valid date.")),
		body("validBefore").trim()
			.isISO8601().withMessage(i18n.__("The field must contain a valid date."))
			.custom((value, { req }) => {
				if (moment(value).isSameOrBefore(req.body.validAfter)) {
					return Promise.reject(`${i18n.__("The field must contain a valid date.")}`);
				}
				return true;
			}),
		body("maxActivations").trim()
			.isInt({ min: 0, max: 1e8 }).withMessage(i18n.__("The field must contain the value as a number.")),
		body("active").optional().trim()
			.isIn(["on"]).withMessage(i18n.__("The field has invalid value.")),
		body("accountDBID").trim().optional({ checkFalsy: true }).trim()
			.isInt().withMessage(i18n.__("The field must contain a valid number."))
			.custom(value => accountModel.info.findOne({
				where: { accountDBID: value }
			}).then(data => {
				if (value && data === null) {
					return Promise.reject(i18n.__("The field contains not existing account ID."));
				}
				return true;
			}))
	],
	formValidationHandler(logger),
	/**
	 * @type {RequestHandler}
	 */
	async (req, res, next) => {
		const { couponId } = req.query;
		const { discount, validAfter, validBefore, maxActivations, active, accountDBID } = req.body;

		const coupon = await shopModel.coupons.findOne({
			where: { couponId }
		});

		if (coupon === null) {
			throw Error("Object not found");
		}

		await shopModel.coupons.update({
			discount,
			validAfter: moment.tz(validAfter, req.user.tz).toDate(),
			validBefore: moment.tz(validBefore, req.user.tz).toDate(),
			active: active == "on",
			maxActivations,
			accountDBID: accountDBID || null
		}, {
			where: { couponId }
		});

		next();
	},
	writeOperationReport(reportModel),
	formResultErrorHandler(logger),
	formResultSuccessHandler("/coupons")
];

/**
 * @param {modules} modules
 */
module.exports.deleteAction = ({ logger, sequelize, reportModel, shopModel }) => [
	accessFunctionHandler,
	expressLayouts,
	[
		query("couponId").trim().notEmpty()
	],
	validationHandler(logger),
	/**
	 * @type {RequestHandler}
	 */
	async (req, res, next) => {
		const { couponId } = req.query;

		await sequelize.transaction(async () => {
			await shopModel.coupons.destroy({
				where: { couponId }
			});
			await shopModel.couponActivated.destroy({
				where: { couponId }
			});
		});

		next();
	},
	writeOperationReport(reportModel),
	/**
	 * @type {RequestHandler}
	 */
	(req, res, next) => {
		res.redirect("/coupons");
	}
];