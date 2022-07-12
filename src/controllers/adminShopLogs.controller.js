"use strict";

/**
 * @typedef {import("../app").modules} modules
 * @typedef {import("express").RequestHandler} RequestHandler
 */

const expressLayouts = require("express-ejs-layouts");
const Op = require("sequelize").Op;
const moment = require("moment-timezone");

const { accessFunctionHandler, shopStatusHandler } = require("../middlewares/admin.middlewares");

/**
 * @param {modules} modules
 */
module.exports.fund = ({ logger, reportModel }) => [
	accessFunctionHandler,
	shopStatusHandler,
	expressLayouts,
	/**
	 * @type {RequestHandler}
	 */
	(req, res) => {
		let { from, to } = req.query;
		const { accountDBID } = req.query;

		from = from ? moment.tz(from, req.user.tz) : moment().subtract(30, "days");
		to = to ? moment.tz(to, req.user.tz) : moment();

		reportModel.shopFund.findAll({
			where: {
				...accountDBID ? { accountDBID } : {},
				createdAt: {
					[Op.gt]: from.toDate(),
					[Op.lt]: to.toDate()
				}
			},
			order: [
				["createdAt", "DESC"]
			]
		}).then(logs =>
			res.render("adminShopFundLogs", {
				layout: "adminLayout",
				moment,
				logs,
				from,
				to,
				accountDBID
			})
		).catch(err => {
			logger.error(err);
			res.render("adminError", { layout: "adminLayout", err });
		});
	}
];

/**
 * @param {modules} modules
 */
module.exports.pay = ({ logger, accountModel, reportModel }) => [
	accessFunctionHandler,
	shopStatusHandler,
	expressLayouts,
	/**
	 * @type {RequestHandler}
	 */
	(req, res) => {
		let { from, to } = req.query;
		const { accountDBID, serverId } = req.query;

		from = from ? moment.tz(from, req.user.tz) : moment().subtract(30, "days");
		to = to ? moment.tz(to, req.user.tz) : moment();

		reportModel.shopPay.findAll({
			where: {
				...(accountDBID ? { accountDBID } : {}),
				...(serverId ? { serverId } : {}),
				createdAt: {
					[Op.gt]: from.toDate(),
					[Op.lt]: to.toDate()
				}
			},
			order: [
				["createdAt", "DESC"]
			]
		}).then(logs =>
			accountModel.serverInfo.findAll().then(servers => {
				res.render("adminShopPayLogs", {
					layout: "adminLayout",
					moment,
					servers,
					logs,
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
];