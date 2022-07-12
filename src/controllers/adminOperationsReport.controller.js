"use strict";

/**
 * @typedef {import("../app").modules} modules
 * @typedef {import("express").RequestHandler} RequestHandler
 */

const expressLayouts = require("express-ejs-layouts");
const moment = require("moment-timezone");
const validator = require("validator");
const Op = require("sequelize").Op;

const { accessFunctionHandler } = require("../middlewares/admin.middlewares");

/**
 * @param {modules} modules
 */
module.exports.index = ({ logger, reportModel }) => [
	accessFunctionHandler,
	expressLayouts,
	/**
	 * @type {RequestHandler}
	 */
	(req, res) => {
		let { from, to } = req.query;

		from = from ? moment.tz(from, req.user.tz) : moment().subtract(30, "days");
		to = to ? moment.tz(to, req.user.tz) : moment();

		reportModel.adminOp.findAll({
			where: {
				reportTime: {
					[Op.gt]: from.toDate(),
					[Op.lt]: to.toDate()
				}
			},
			order: [
				["reportTime", "DESC"]
			]
		}).then(reports =>
			res.render("adminOperationsReport", {
				layout: "adminLayout",
				moment,
				reports,
				from,
				to
			})
		).catch(err => {
			logger.error(err);
			res.render("adminError", { layout: "adminLayout", err });
		});
	}
];

module.exports.view = ({ logger, reportModel }) => [
	accessFunctionHandler,
	expressLayouts,
	/**
	 * @type {RequestHandler}
	 */
	(req, res) => {
		const { id, from, to } = req.query;

		if (!id) {
			return res.redirect("/operations_report");
		}

		reportModel.adminOp.findOne({
			where: { id }
		}).then(report => {
			if (report === null) {
				return res.redirect("/operations_report");
			}

			res.render("adminOperationsReportView", {
				layout: "adminLayout",
				moment,
				validator,
				from: moment.tz(from, req.user.tz),
				to: moment.tz(to, req.user.tz),
				report
			});
		}).catch(err => {
			logger.error(err);
			res.render("adminError", { layout: "adminLayout", err });
		});
	}
];