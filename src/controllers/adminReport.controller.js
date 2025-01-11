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

const reportHandler = (serverModel, accountModel, model, view, viewData = {}) =>
	/**
	 * @type {RequestHandler}
	*/
	async (req, res, next) => {
		const { serverId, accountDBID } = req.query;
		const from = req.query.from ? moment.tz(req.query.from, req.user.tz) : moment().subtract(30, "days");
		const to = req.query.to ? moment.tz(req.query.to, req.user.tz) : moment().add(30, "days");

		const reports = await model.findAll({
			where: {
				...serverId ? { serverId } : {},
				...accountDBID ? { accountDBID } : {},
				reportTime: {
					[Op.gt]: from.toDate(),
					[Op.lt]: to.toDate()
				}
			},
			include: [
				{
					as: "account",
					model: accountModel.info,
					required: false,
					attributes: ["userName"]
				},
				{
					as: "server",
					model: serverModel.info,
					required: false,
					attributes: ["nameString"]
				}
			],
			order: [
				["reportTime", "DESC"]
			]
		});

		const servers = await serverModel.info.findAll();

		res.render(view, {
			layout: "adminLayout",
			moment,
			helpers,
			servers,
			reports,
			from,
			to,
			serverId,
			accountDBID,
			...viewData
		});
	}
;

/**
 * @param {modules} modules
 */
module.exports.activity = ({ serverModel, accountModel, reportModel }) => [
	accessFunctionHandler,
	expressLayouts,
	reportHandler(serverModel, accountModel, reportModel.activity, "adminReportActivity")
];

/**
 * @param {modules} modules
 */
module.exports.characters = ({ serverModel, accountModel, reportModel }) => [
	accessFunctionHandler,
	expressLayouts,
	reportHandler(serverModel, accountModel, reportModel.characters, "adminReportCharacters")
];

/**
 * @param {modules} modules
 */
module.exports.cheats = ({ datasheetModel, serverModel, accountModel, reportModel }) => [
	accessFunctionHandler,
	expressLayouts,
	reportHandler(serverModel, accountModel, reportModel.cheats, "adminReportCheats", { datasheetModel })
];

/**
 * @param {modules} modules
 */
module.exports.chronoscrolls = ({ serverModel, accountModel, reportModel }) => [
	accessFunctionHandler,
	expressLayouts,
	reportHandler(serverModel, accountModel, reportModel.chronoScrolls, "adminReportChronoScrolls")
];