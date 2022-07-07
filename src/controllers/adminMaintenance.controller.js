"use strict";

/**
 * @typedef {import("../app").modules} modules
 * @typedef {import("express").RequestHandler} RequestHandler
 */

const expressLayouts = require("express-ejs-layouts");
const moment = require("moment-timezone");
const body = require("express-validator").body;
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
		accountModel.maintenance.findAll().then(maintenances => {
			res.render("adminMaintenance", {
				layout: "adminLayout",
				maintenances,
				moment
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
module.exports.add = () => [
	accessFunctionHandler,
	expressLayouts,
	/**
	 * @type {RequestHandler}
	 */
	(req, res) => {
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
module.exports.addAction = ({ i18n, logger, accountModel }) => [
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
		const { startTime, endTime, description } = req.body;
		const errors = helpers.validationResultLog(req, logger);

		if (!errors.isEmpty()) {
			return res.render("adminMaintenanceAdd", {
				layout: "adminLayout",
				errors: errors.array(),
				startTime: moment(startTime),
				endTime: moment(endTime),
				description
			});
		}

		accountModel.maintenance.create({
			startTime: moment(startTime).format("YYYY-MM-DD HH:mm:ss"),
			endTime: moment(endTime).format("YYYY-MM-DD HH:mm:ss"),
			description
		}).then(() =>
			res.redirect("/maintenance")
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
		const { id } = req.query;

		if (!id) {
			return res.redirect("/maintenance");
		}

		accountModel.maintenance.findOne({ where: { id } }).then(data => {
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
				startTime: moment(startTime),
				endTime: moment(endTime),
				description,
				id
			});
		}

		accountModel.maintenance.update({
			startTime: moment(startTime).format("YYYY-MM-DD HH:mm:ss"),
			endTime: moment(endTime).format("YYYY-MM-DD HH:mm:ss"),
			description
		}, {
			where: { id }
		}).then(() =>
			res.redirect("/maintenance")
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
		const { id } = req.query;

		if (!id) {
			return res.redirect("/maintenance");
		}

		accountModel.maintenance.destroy({ where: { id } }).then(() =>
			res.redirect("/maintenance")
		).catch(err => {
			logger.error(err);
			res.render("adminError", { layout: "adminLayout", err });
		});
	}
];