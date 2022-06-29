"use strict";

const expressLayouts = require("express-ejs-layouts");
const Op = require("sequelize").Op;
const moment = require("moment-timezone");
const body = require("express-validator").body;
const logger = require("../utils/logger");
const helpers = require("../utils/helpers");
const accountModel = require("../models/account.model");
const { i18n, i18nHandler, accessFunctionHandler } = require("../middlewares/admin.middlewares");

/**
 * Servers
 */
module.exports.servers = [
	i18nHandler,
	accessFunctionHandler(),
	expressLayouts,
	/**
	 * @type {import("express").RequestHandler}
	 */
	(req, res) => {
		accountModel.serverInfo.findAll().then(servers => {
			res.render("adminServers", {
				layout: "adminLayout",
				servers
			});
		}).catch(err => {
			logger.error(err.toString());
			res.render("adminError", { layout: "adminLayout", err });
		});
	}
];

module.exports.serverStrings = [
	i18nHandler,
	accessFunctionHandler(),
	expressLayouts,
	/**
	 * @type {import("express").RequestHandler}
	 */
	(req, res) => {
		accountModel.serverStrings.findAll().then(strings => {
			res.render("adminServerStrings", {
				layout: "adminLayout",
				strings
			});
		}).catch(err => {
			logger.error(err.toString());
			res.render("adminError", { layout: "adminLayout", err });
		});
	}
];

/**
 * Maintenance
 */
module.exports.maintenance = [
	i18nHandler,
	accessFunctionHandler(),
	expressLayouts,
	/**
	 * @type {import("express").RequestHandler}
	 */
	(req, res) => {
		accountModel.maintenance.findAll().then(maintenances => {
			res.render("adminServerMaintenance", {
				layout: "adminLayout",
				maintenances,
				moment
			});
		}).catch(err => {
			logger.error(err.toString());
			res.render("adminError", { layout: "adminLayout", err });
		});
	}
];

module.exports.maintenanceAdd = [
	i18nHandler,
	accessFunctionHandler(),
	expressLayouts,
	/**
	 * @type {import("express").RequestHandler}
	 */
	(req, res) => {
		res.render("adminServerMaintenanceAdd", {
			layout: "adminLayout",
			errors: null,
			startTime: moment(),
			endTime: moment(),
			description: ""
		});
	}
];

module.exports.maintenanceAddAction = [
	i18nHandler,
	accessFunctionHandler(),
	expressLayouts,
	[
		body("startTime")
			.isISO8601().withMessage(i18n.__("Start time must contain a valid date.")),
		body("endTime")
			.isISO8601().withMessage(i18n.__("End time must contain a valid date.")),
		body("description").trim()
			.isLength({ min: 1, max: 1024 }).withMessage(i18n.__("Description must be between 1 and 1024 characters."))
	],
	/**
	 * @type {import("express").RequestHandler}
	 */
	(req, res) => {
		const { startTime, endTime, description } = req.body;
		const errors = helpers.validationResultLog(req);

		if (!errors.isEmpty()) {
			return res.render("adminServerMaintenanceAdd", {
				layout: "adminLayout",
				errors: errors.array(),
				startTime: moment(startTime),
				endTime: moment(endTime),
				description
			});
		}

		accountModel.maintenance.create({
			startTime: moment(startTime).format("YYYY-MM-DD HH:MM:ss"),
			endTime: moment(endTime).format("YYYY-MM-DD HH:MM:ss"),
			description
		}).then(() =>
			res.redirect("maintenance")
		).catch(err => {
			logger.error(err.toString());
			res.render("adminError", { layout: "adminLayout", err });
		});
	}
];

module.exports.maintenanceEdit = [
	i18nHandler,
	accessFunctionHandler(),
	expressLayouts,
	/**
	 * @type {import("express").RequestHandler}
	 */
	(req, res) => {
		const { id } = req.query;

		accountModel.maintenance.findOne({ where: { id } }).then(data => {
			if (data === null) {
				return res.redirect("maintenance");
			}

			res.render("adminServerMaintenanceEdit", {
				layout: "adminLayout",
				errors: null,
				startTime: moment(data.get("startTime")),
				endTime: moment(data.get("endTime")),
				description: data.get("description"),
				id
			});
		}).catch(err => {
			logger.error(err.toString());
			res.render("adminError", { layout: "adminLayout", err });
		});
	}
];

module.exports.maintenanceEditAction = [
	i18nHandler,
	accessFunctionHandler(),
	expressLayouts,
	[
		body("startTime")
			.isISO8601().withMessage(i18n.__("Start time must contain a valid date.")),
		body("endTime")
			.isISO8601().withMessage(i18n.__("End time must contain a valid date.")),
		body("description").trim()
			.isLength({ min: 1, max: 1024 }).withMessage(i18n.__("Description must be between 1 and 1024 characters."))
	],
	/**
	 * @type {import("express").RequestHandler}
	 */
	(req, res) => {
		const { id } = req.query;
		const { startTime, endTime, description } = req.body;
		const errors = helpers.validationResultLog(req);

		if (!errors.isEmpty()) {
			return res.render("adminServerMaintenanceEdit", {
				layout: "adminLayout",
				errors: errors.array(),
				startTime: moment(startTime),
				endTime: moment(endTime),
				description,
				id
			});
		}

		accountModel.maintenance.update({
			startTime: moment(startTime).format("YYYY-MM-DD HH:MM:ss"),
			endTime: moment(endTime).format("YYYY-MM-DD HH:MM:ss"),
			description
		}, {
			where: { id }
		}).then(() =>
			res.redirect("maintenance")
		).catch(err => {
			logger.error(err.toString());
			res.render("adminError", { layout: "adminLayout", err });
		});
	}
];

module.exports.maintenanceDeleteAction = [
	i18nHandler,
	accessFunctionHandler(),
	expressLayouts,
	/**
	 * @type {import("express").RequestHandler}
	 */
	(req, res) => {
		const { id } = req.query;

		accountModel.maintenance.destroy({ where: { id } }).then(() =>
			res.redirect("maintenance")
		).catch(err => {
			logger.error(err.toString());
			res.render("adminError", { layout: "adminLayout", err });
		});
	}
];