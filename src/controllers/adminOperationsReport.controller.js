"use strict";

/**
 * @typedef {import("../app").modules} modules
 * @typedef {import("express").RequestHandler} RequestHandler
 */

const expressLayouts = require("express-ejs-layouts");
const query = require("express-validator").query;
const moment = require("moment-timezone");
const validator = require("validator");
const Op = require("sequelize").Op;

const { validationHandler, accessFunctionHandler } = require("../middlewares/admin.middlewares");

/**
 * @param {modules} modules
 */
module.exports.index = ({ reportModel }) => [
	accessFunctionHandler,
	expressLayouts,
	/**
	 * @type {RequestHandler}
	 */
	async (req, res, next) => {
		const { userId } = req.query;
		const from = req.query.from ? moment.tz(req.query.from, req.user.tz) : moment().subtract(30, "days");
		const to = req.query.to ? moment.tz(req.query.to, req.user.tz) : moment().add(30, "days");

		const reports = await reportModel.adminOp.findAll({
			where: {
				...userId ? { userId } : {},
				reportTime: {
					[Op.gt]: from.toDate(),
					[Op.lt]: to.toDate()
				}
			},
			order: [
				["reportTime", "DESC"]
			]
		});

		res.render("adminOperationsReport", {
			layout: "adminLayout",
			moment,
			reports,
			from,
			to,
			userId
		});
	}
];

module.exports.view = ({ logger, reportModel }) => [
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
		const { id, from, to } = req.query;

		const report = await reportModel.adminOp.findOne({
			where: { id }
		});

		if (report === null) {
			throw Error("Object not found");
		}

		res.render("adminOperationsReportView", {
			layout: "adminLayout",
			moment,
			validator,
			from: moment.tz(from, req.user.tz),
			to: moment.tz(to, req.user.tz),
			report
		});
	}
];