"use strict";

/**
 * @typedef {import("../app").modules} modules
 * @typedef {import("express").RequestHandler} RequestHandler
 */

const expressLayouts = require("express-ejs-layouts");
const moment = require("moment-timezone");
const Op = require("sequelize").Op;

const { accessFunctionHandler } = require("../middlewares/admin.middlewares");

const reportHandler = (logger, accountModel, model, view) =>
	/**
	 * @type {RequestHandler}
	*/
	(req, res) => {
		let { from, to } = req.query;
		const { serverId, accountDBID } = req.query;

		from = from ? moment(from) : moment().subtract(30, "days");
		to = to ? moment(to) : moment();

		model.findAll({
			where: {
				...serverId ? { serverId } : {},
				...accountDBID ? { accountDBID } : {},
				reportTime: {
					[Op.gt]: from.format("YYYY-MM-DD HH:mm:ss"),
					[Op.lt]: to.format("YYYY-MM-DD HH:mm:ss")
				}
			},
			order: [
				["reportTime", "DESC"]
			]
		}).then(reports =>
			accountModel.serverInfo.findAll().then(servers => {
				res.render(view, {
					layout: "adminLayout",
					moment,
					servers,
					reports,
					from,
					to,
					serverId,
					accountDBID
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
module.exports.activity = ({ logger, accountModel, reportModel }) => [
	accessFunctionHandler,
	expressLayouts,
	reportHandler(logger, accountModel, reportModel.activity, "adminReportActivity")
];

/**
 * @param {modules} modules
 */
module.exports.characters = ({ logger, accountModel, reportModel }) => [
	accessFunctionHandler,
	expressLayouts,
	reportHandler(logger, accountModel, reportModel.characters, "adminReportCharacters")
];

/**
 * @param {modules} modules
 */
module.exports.cheats = ({ logger, accountModel, reportModel }) => [
	accessFunctionHandler,
	expressLayouts,
	reportHandler(logger, accountModel, reportModel.cheats, "adminReportCheats")
];

/**
 * @param {modules} modules
 */
module.exports.chronoscrolls = ({ logger, accountModel, reportModel }) => [
	accessFunctionHandler,
	expressLayouts,
	reportHandler(logger, accountModel, reportModel.chronoScrolls, "adminReportChronoScrolls")
];