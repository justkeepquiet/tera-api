"use strict";

const expressLayouts = require("express-ejs-layouts");
const moment = require("moment-timezone");
const Op = require("sequelize").Op;
const logger = require("../utils/logger");
const accountModel = require("../models/account.model");
const reportModel = require("../models/report.model");
const { i18nHandler, accessFunctionHandler } = require("../middlewares/admin.middlewares");

const reportHandler = (model, view) =>
	/**
	 * @type {import("express").RequestHandler}
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
					[Op.gt]: from.toDate(),
					[Op.lt]: to.toDate()
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
			logger.error(err.toString());
			res.render("adminError", { layout: "adminLayout", err });
		});
	}
;

module.exports.activity = [
	i18nHandler,
	accessFunctionHandler(),
	expressLayouts,
	reportHandler(reportModel.activity, "adminReportActivity")
];

module.exports.characters = [
	i18nHandler,
	accessFunctionHandler(),
	expressLayouts,
	reportHandler(reportModel.characters, "adminReportCharacters")
];

module.exports.cheats = [
	i18nHandler,
	accessFunctionHandler(),
	expressLayouts,
	reportHandler(reportModel.cheats, "adminReportCheats")
];

module.exports.chronoscrolls = [
	i18nHandler,
	accessFunctionHandler(),
	expressLayouts,
	reportHandler(reportModel.chronoScrolls, "adminReportChronoScrolls")
];