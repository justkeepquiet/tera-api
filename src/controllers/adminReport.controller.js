"use strict";

/**
 * @typedef {import("../app").modules} modules
 * @typedef {import("express").RequestHandler} RequestHandler
 */

const expressLayouts = require("express-ejs-layouts");
const moment = require("moment-timezone");
const Op = require("sequelize").Op;

const { accessFunctionHandler } = require("../middlewares/admin.middlewares");

const reportHandler = (logger, serverModel, model, view, viewData = {}) =>
	/**
	 * @type {RequestHandler}
	*/
	(req, res) => {
		let { from, to } = req.query;
		const { serverId, accountDBID } = req.query;

		from = from ? moment.tz(from, req.user.tz) : moment().subtract(30, "days");
		to = to ? moment.tz(to, req.user.tz) : moment().add(30, "days");

		model.findAll({
			where: {
				...serverId ? { serverId } : {},
				...accountDBID ? { accountDBID } : {},
				reportTime: {
					[Op.gt]: from.toDate(),
					[Op.lt]: to.toDate()
				}
			},
			order: [
				["reportTime", "DESC"]
			]
		}).then(reports =>
			serverModel.info.findAll().then(servers => {
				res.render(view, {
					layout: "adminLayout",
					moment,
					servers,
					reports,
					from,
					to,
					serverId,
					accountDBID,
					...viewData
				});
			})
		).catch(err => {
			logger.error(err);
			res.render("adminError", { layout: "adminLayout", err });
		});
	}
;

/**
 * @param {modules} modules
 */
module.exports.activity = ({ logger, serverModel, reportModel }) => [
	accessFunctionHandler,
	expressLayouts,
	reportHandler(logger, serverModel, reportModel.activity, "adminReportActivity")
];

/**
 * @param {modules} modules
 */
module.exports.characters = ({ logger, serverModel, reportModel }) => [
	accessFunctionHandler,
	expressLayouts,
	reportHandler(logger, serverModel, reportModel.characters, "adminReportCharacters")
];

/**
 * @param {modules} modules
 */
module.exports.cheats = ({ logger, datasheetModel, serverModel, reportModel }) => [
	accessFunctionHandler,
	expressLayouts,
	reportHandler(logger, serverModel, reportModel.cheats, "adminReportCheats", { datasheetModel })
];

/**
 * @param {modules} modules
 */
module.exports.chronoscrolls = ({ logger, serverModel, reportModel }) => [
	accessFunctionHandler,
	expressLayouts,
	reportHandler(logger, serverModel, reportModel.chronoScrolls, "adminReportChronoScrolls")
];