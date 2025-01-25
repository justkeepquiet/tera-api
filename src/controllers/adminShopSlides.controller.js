"use strict";

/**
 * @typedef {import("../app").modules} modules
 * @typedef {import("express").RequestHandler} RequestHandler
 */

const path = require("path");
const expressLayouts = require("express-ejs-layouts");
const { query, body } = require("express-validator");
const moment = require("moment-timezone");

const { getFilenamesFromDirectory } = require("../utils/helpers");
const {
	accessFunctionHandler,
	validationHandler,
	formValidationHandler,
	formResultErrorHandler,
	formResultSuccessHandler,
	writeOperationReport
} = require("../middlewares/admin.middlewares");

const imagesPath = path.join(__dirname, "../../data/shop-slides-bg");

/**
 * @param {modules} modules
 */
module.exports.index = ({ shopModel }) => [
	accessFunctionHandler,
	expressLayouts,
	async (req, res, next) => {
		const slides = await shopModel.slides.findAll({
			order: [
				["priority", "DESC"]
			]
		});

		res.render("adminShopSlides", {
			layout: "adminLayout",
			slides,
			moment
		});
	}
];

/**
 * @param {modules} modules
 */
module.exports.add = () => [
	accessFunctionHandler,
	expressLayouts,
	/**
	 * @type {RequestHandler}
	 */
	async (req, res, next) => {
		const images = getFilenamesFromDirectory(imagesPath);

		res.render("adminShopSlidesAdd", {
			layout: "adminLayout",
			moment,
			images
		});
	}
];

/**
 * @param {modules} modules
 */
module.exports.addAction = ({ i18n, logger, reportModel, shopModel }) => [
	accessFunctionHandler,
	[
		body("priority").trim()
			.isInt({ min: -1e8, max: 1e8 }).withMessage(i18n.__("The field must contain the value as a number.")),
		body("active").optional().trim()
			.isIn(["on"]).withMessage(i18n.__("The field has invalid value.")),
		body("displayDateStart").trim()
			.isISO8601().withMessage(i18n.__("The field must contain a valid date.")),
		body("displayDateEnd").trim()
			.isISO8601().withMessage(i18n.__("The field must contain a valid date.")),
		body("image").trim()
			.isLength({ min: 1, max: 2048 }).withMessage(i18n.__("The field must be between 1 and 2048 characters.")),
		body("productId").trim()
			.isInt({ min: 0 }).withMessage(i18n.__("The field must contain a valid number."))
	],
	formValidationHandler(logger),
	async (req, res, next) => {
		const { priority, active, displayDateStart, displayDateEnd, image, productId } = req.body;

		await shopModel.slides.create({
			priority,
			active: active == "on",
			displayDateStart: moment.tz(displayDateStart, req.user.tz).toDate(),
			displayDateEnd: moment.tz(displayDateEnd, req.user.tz).toDate(),
			image,
			productId
		});

		next();
	},
	writeOperationReport(reportModel),
	formResultErrorHandler(logger),
	formResultSuccessHandler("/shop_slides")
];

/**
 * @param {modules} modules
 */
module.exports.edit = ({ logger, shopModel }) => [
	accessFunctionHandler,
	expressLayouts,
	[
		query("id").trim().notEmpty()
	],
	validationHandler(logger),
	async (req, res, next) => {
		const { id } = req.query;

		const slide = await shopModel.slides.findOne({
			where: { id }
		});

		if (slide === null) {
			throw Error("Object not found");
		}

		const images = getFilenamesFromDirectory(imagesPath);

		res.render("adminShopSlidesEdit", {
			layout: "adminLayout",
			id: slide.get("id"),
			priority: slide.get("priority"),
			active: slide.get("active"),
			displayDateStart: moment(slide.get("displayDateStart")),
			displayDateEnd: moment(slide.get("displayDateEnd")),
			productId: slide.get("productId"),
			image: slide.get("image"),
			images
		});
	}
],

/**
 * @param {modules} modules
 */
module.exports.editAction = ({ i18n, logger, reportModel, shopModel }) => [
	accessFunctionHandler,
	[
		body("priority").trim()
			.isInt({ min: -1e8, max: 1e8 }).withMessage(i18n.__("The field must contain the value as a number.")),
		body("active").optional().trim()
			.isIn(["on"]).withMessage(i18n.__("The field has invalid value.")),
		body("displayDateStart").trim()
			.isISO8601().withMessage(i18n.__("The field must contain a valid date.")),
		body("displayDateEnd").trim()
			.isISO8601().withMessage(i18n.__("The field must contain a valid date.")),
		body("image").trim()
			.isLength({ min: 1, max: 2048 }).withMessage(i18n.__("The field must be between 1 and 2048 characters.")),
		body("productId").trim()
			.isInt({ min: 0 }).withMessage(i18n.__("The field must contain a valid number."))
	],
	formValidationHandler(logger),
	async (req, res, next) => {
		const { id } = req.query;
		const { priority, active, displayDateStart, displayDateEnd, image, productId } = req.body;

		const slide = await shopModel.slides.findOne({
			where: { id }
		});

		if (slide === null) {
			throw Error("Object not found");
		}

		await shopModel.slides.update({
			priority,
			active: active == "on",
			displayDateStart: moment.tz(displayDateStart, req.user.tz).toDate(),
			displayDateEnd: moment.tz(displayDateEnd, req.user.tz).toDate(),
			image,
			productId
		}, {
			where: { id }
		});

		next();
	},
	writeOperationReport(reportModel),
	formResultErrorHandler(logger),
	formResultSuccessHandler("/shop_slides")
];

/**
 * @param {modules} modules
 */
module.exports.deleteAction = ({ logger, reportModel, shopModel }) => [
	accessFunctionHandler,
	expressLayouts,
	[
		query("id").trim().notEmpty()
	],
	validationHandler(logger),
	async (req, res, next) => {
		const { id } = req.query;

		await shopModel.slides.destroy({
			where: { id }
		});

		next();
	},
	writeOperationReport(reportModel),
	/**
	 * @type {RequestHandler}
	 */
	(req, res, next) => {
		res.redirect("/shop_slides");
	}
];