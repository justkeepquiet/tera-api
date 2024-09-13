"use strict";

/**
 * @typedef {import("../app").modules} modules
 * @typedef {import("express").RequestHandler} RequestHandler
 */

const expressLayouts = require("express-ejs-layouts");
const moment = require("moment-timezone");
const body = require("express-validator").body;

const helpers = require("../utils/helpers");
const { accessFunctionHandler, writeOperationReport } = require("../middlewares/admin.middlewares");

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
			errors: null,
			startTime: moment(),
			endTime: moment(),
			description: ""
		});
	}
];

/**
 * @param {modules} modules
 */
module.exports.addAction = ({ i18n, logger, reportModel, serverModel }) => [
	accessFunctionHandler,
	expressLayouts,
	[
		body("startTime")
			.isISO8601().withMessage(i18n.__("Start time field must contain a valid date.")),
		body("endTime")
			.isISO8601().withMessage(i18n.__("End time field must contain a valid date.")),
		body("description").optional().trim()
			.isLength({ max: 1024 }).withMessage(i18n.__("Description field must be between 1 and 1024 characters."))
	],
	/**
	 * @type {RequestHandler}
	 */
	async (req, res, next) => {
		const { startTime, endTime, description } = req.body;
		const errors = helpers.validationResultLog(req, logger);

		if (!errors.isEmpty()) {
			return res.render("adminMaintenanceAdd", {
				layout: "adminLayout",
				errors: errors.array(),
				startTime: moment.tz(startTime, req.user.tz),
				endTime: moment.tz(endTime, req.user.tz),
				description
			});
		}

		await serverModel.maintenance.create({
			startTime: moment.tz(startTime, req.user.tz).toDate(),
			endTime: moment.tz(endTime, req.user.tz).toDate(),
			description
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

/**
 * @param {modules} modules
 */
module.exports.edit = ({ serverModel }) => [
	accessFunctionHandler,
	expressLayouts,
	/**
	 * @type {RequestHandler}
	 */
	async (req, res, next) => {
		const { id } = req.query;

		if (!id) {
			return res.redirect("/maintenance");
		}

		const data = await serverModel.maintenance.findOne({ where: { id } });

		if (data === null) {
			return res.redirect("/maintenance");
		}

		res.render("adminMaintenanceEdit", {
			layout: "adminLayout",
			errors: null,
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
	expressLayouts,
	[
		body("startTime")
			.isISO8601().withMessage(i18n.__("Start time field must contain a valid date.")),
		body("endTime")
			.isISO8601().withMessage(i18n.__("End time field must contain a valid date.")),
		body("description").optional().trim()
			.isLength({ max: 1024 }).withMessage(i18n.__("Description field must be between 1 and 1024 characters."))
	],
	/**
	 * @type {RequestHandler}
	 */
	async (req, res, next) => {
		const { id } = req.query;
		const { startTime, endTime, description } = req.body;
		const errors = helpers.validationResultLog(req, logger);

		if (!id) {
			return res.redirect("/maintenance");
		}

		if (!errors.isEmpty()) {
			return res.render("adminMaintenanceEdit", {
				layout: "adminLayout",
				errors: errors.array(),
				startTime: moment.tz(startTime, req.user.tz),
				endTime: moment.tz(endTime, req.user.tz),
				description,
				id
			});
		}

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
	/**
	 * @type {RequestHandler}
	 */
	(req, res, next) => {
		res.redirect("/maintenance");
	}
];

/**
 * @param {modules} modules
 */
module.exports.deleteAction = ({ reportModel, serverModel }) => [
	accessFunctionHandler,
	expressLayouts,
	/**
	 * @type {RequestHandler}
	 */
	async (req, res, next) => {
		const { id } = req.query;

		if (!id) {
			return res.redirect("/maintenance");
		}

		await serverModel.maintenance.destroy({ where: { id } });

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