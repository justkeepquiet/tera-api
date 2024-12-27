"use strict";

/**
 * @typedef {import("../app").modules} modules
 * @typedef {import("express").RequestHandler} RequestHandler
 */

const expressLayouts = require("express-ejs-layouts");
const moment = require("moment-timezone");
const Op = require("sequelize").Op;

const helpers = require("../utils/helpers");
const { accessFunctionHandler } = require("../middlewares/admin.middlewares");

/**
 * @param {modules} modules
 */
module.exports.index = ({ reportModel }) => [
	accessFunctionHandler,
	expressLayouts,
	async (req, res, next) => {
		const { accountDBID, action } = req.query;
		const from = req.query.from ? moment.tz(req.query.from, req.user.tz) : moment().subtract(30, "days");
		const to = req.query.to ? moment.tz(req.query.to, req.user.tz) : moment().add(30, "days");

		let label = null;

		if (action === "exit_game") {
			label = { [Op.in]: ["0", "7"] };
		}

		if (action === "crash_game") {
			label = { [Op.notIn]: ["0", "7"] };
		}

		const reports = await reportModel.launcher.findAll({
			where: {
				...accountDBID ? { accountDBID } : {},
				...action ? { action: { [Op.like]: `${label ? "crash_game" : action}%` } } : {},
				...label ? { label } : {},
				reportTime: {
					[Op.gt]: from.toDate(),
					[Op.lt]: to.toDate()
				}
			},
			order: [
				["reportTime", "DESC"]
			]
		});

		res.render("adminLauncherLogs", {
			layout: "adminLayout",
			moment,
			helpers,
			reports,
			action,
			from,
			to,
			accountDBID
		});
	}
];