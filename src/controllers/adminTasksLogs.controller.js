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
		const { taskId, handler, tag } = req.query;
		const from = req.query.from ? moment.tz(req.query.from, req.user.tz) : moment().subtract(30, "days");
		const to = req.query.to ? moment.tz(req.query.to, req.user.tz) : moment().add(30, "days");

		const reports = await reportModel.queueTasks.findAll({
			where: {
				...taskId ? { taskId } : {},
				...handler ? { handler } : {},
				...tag ? { tag } : {},
				reportTime: {
					[Op.gt]: from.toDate(),
					[Op.lt]: to.toDate()
				}
			},
			order: [
				["reportTime", "DESC"]
			]
		});

		res.render("adminTasksLogs", {
			layout: "adminLayout",
			moment,
			reports,
			from,
			to,
			taskId,
			tag,
			handler
		});
	}
];