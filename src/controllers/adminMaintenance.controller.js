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
module.exports.index = ({ serverModel }) => [
	accessFunctionHandler,
	expressLayouts,
	/**
	 * @type {RequestHandler}
	 */
	async (req, res, next) => {
		const maintenances = await serverModel.maintenance.findAll();

		res.render("adminMaintenance", {
			layout: "adminLayout",
			maintenances,
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
		res.render("adminMaintenanceAdd", {
			layout: "adminLayout",
			moment
		});
	}
];

/**
 * @param {modules} modules
 */
module.exports.addAction = ({ i18n, logger, reportModel, serverModel }) => [
	accessFunctionHandler,
	[
		body("startTime").trim()
			.isISO8601().withMessage(i18n.__("Start time field must contain a valid date.")),
		body("endTime").trim()
			.isISO8601().withMessage(i18n.__("End time field must contain a valid date.")),
		body("description").optional().trim()
			.isLength({ max: 1024 }).withMessage(i18n.__("Description field must be between 1 and 1024 characters."))
	],
	formValidationHandler(logger),
	/**
	 * @type {RequestHandler}
	 */
	async (req, res, next) => {
		const { startTime, endTime, description } = req.body;

		await serverModel.maintenance.create({
			startTime: moment.tz(startTime, req.user.tz).toDate(),
			endTime: moment.tz(endTime, req.user.tz).toDate(),
			description
		});

		next();
	},
	writeOperationReport(reportModel),
	formResultErrorHandler(logger),
	formResultSuccessHandler("/maintenance")
];

/**
 * @param {modules} modules
 */
module.exports.edit = ({ logger, serverModel }) => [
	accessFunctionHandler,
	expressLayouts,
	[
		query("id").trim().notEmpty()
	],
	validationHandler(logger),
	/**
	 * @type {RequestHandler}
	 */
	async (req, res, next) => {
		const { id } = req.query;

		const data = await serverModel.maintenance.findOne({ where: { id } });

		if (data === null) {
			throw Error("Object not found");
		}

		res.render("adminMaintenanceEdit", {
			layout: "adminLayout",
			startTime: moment(data.get("startTime")),
			endTime: moment(data.get("endTime")),
			description: data.get("description"),
			id
		});
	}
];

/**
 * @param {modules} modules
 */
module.exports.editAction = ({ i18n, logger, reportModel, serverModel }) => [
	accessFunctionHandler,
	[
		query("id").trim().notEmpty(),
		body("startTime").trim()
			.isISO8601().withMessage(i18n.__("Start time field must contain a valid date.")),
		body("endTime").trim()
			.isISO8601().withMessage(i18n.__("End time field must contain a valid date.")),
		body("description").optional().trim()
			.isLength({ max: 1024 }).withMessage(i18n.__("Description field must be between 1 and 1024 characters."))
	],
	formValidationHandler(logger),
	/**
	 * @type {RequestHandler}
	 */
	async (req, res, next) => {
		const { id } = req.query;
		const { startTime, endTime, description } = req.body;

		await serverModel.maintenance.update({
			startTime: moment.tz(startTime, req.user.tz).toDate(),
			endTime: moment.tz(endTime, req.user.tz).toDate(),
			description
		}, {
			where: { id }
		});

		next();
	},
	writeOperationReport(reportModel),
	formResultErrorHandler(logger),
	formResultSuccessHandler("/maintenance")
];

/**
 * @param {modules} modules
 */
module.exports.deleteAction = ({ logger, reportModel, serverModel }) => [
	accessFunctionHandler,
	expressLayouts,
	[
		query("id").trim().notEmpty()
	],
	validationHandler(logger),
	/**
	 * @type {RequestHandler}
	 */
	async (req, res, next) => {
		const { id } = req.query;

		await serverModel.maintenance.destroy({
			where: { id }
		});

		next();
	},
	writeOperationReport(reportModel),
	/**
	 * @type {RequestHandler}
	 */
	(req, res, next) => {
		res.redirect("/maintenance");
	}
];