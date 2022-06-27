"use strict";

const expressLayouts = require("express-ejs-layouts");
const moment = require("moment-timezone");
const Op = require("sequelize").Op;
const logger = require("../utils/logger");
const accountModel = require("../models/account.model");
const reportModel = require("../models/report.model");
const { i18nHandler, accessFunctionHandler } = require("../middlewares/admin.middlewares");

const middlewares = [
	i18nHandler,
	accessFunctionHandler(),
	expressLayouts
];

const reportHandler = (model, view) =>
	/**
	 * @type {import("express").RequestHandler}
	*/
	(req, res) => {
		let { from, to } = req.query;
		const { server, account } = req.query;

		from = from ? moment(from) : moment().subtract(30, "days");
		to = to ? moment(to) : moment();

		model.findAll({
			where: {
				...(server ? { serverId: server } : {}),
				...(account ? { accountDBID: account } : {}),
				reportTime: {
					[Op.gt]: from.format("YYYY-MM-DD HH:MM:ss"),
					[Op.lt]: to.format("YYYY-MM-DD HH:MM:ss")
				}
			}
		}).then(reports =>
			accountModel.serverInfo.findAll().then(servers => {
				res.render(view, {
					layout: "adminLayout",
					moment,
					servers,
					reports,
					from,
					to,
					server,
					account
				});
			})
		).catch(err => {
			logger.error(err.toString());
			res.render("adminError", { layout: "adminLayout", err });
		});
	}
;

module.exports.activityHtml = [...middlewares, reportHandler(reportModel.activity, "adminReportActivity")];
module.exports.charactersHtml = [...middlewares, reportHandler(reportModel.characters, "adminReportCharacters")];
module.exports.cheatsHtml = [...middlewares, reportHandler(reportModel.cheats, "adminReportCheats")];
module.exports.chronoscrollsHtml = [...middlewares, reportHandler(reportModel.chronoScrolls, "adminReportChronoScrolls")];