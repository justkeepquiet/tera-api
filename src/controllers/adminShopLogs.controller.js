"use strict";

/**
 * @typedef {import("../app").modules} modules
 * @typedef {import("express").RequestHandler} RequestHandler
 */

const expressLayouts = require("express-ejs-layouts");
const Op = require("sequelize").Op;
const moment = require("moment-timezone");

const { accessFunctionHandler } = require("../middlewares/admin.middlewares");

/**
 * @param {modules} modules
 */
module.exports.fund = ({ accountModel, reportModel }) => [
	accessFunctionHandler,
	expressLayouts,
	/**
	 * @type {RequestHandler}
	 */
	async (req, res, next) => {
		const { id, accountDBID } = req.query;
		const from = req.query.from ? moment.tz(req.query.from, req.user.tz) : moment().subtract(30, "days");
		const to = req.query.to ? moment.tz(req.query.to, req.user.tz) : moment().add(30, "days");

		const logs = await reportModel.shopFund.findAll({
			where: {
				...id ? { id } : {},
				...accountDBID ? { accountDBID } : {},
				createdAt: {
					[Op.gt]: from.toDate(),
					[Op.lt]: to.toDate()
				}
			},
			include: [{
				as: "account",
				model: accountModel.info,
				required: false,
				attributes: ["userName"]
			}],
			order: [
				["createdAt", "DESC"]
			]
		});

		res.render("adminShopFundLogs", {
			layout: "adminLayout",
			moment,
			logs,
			from,
			to,
			accountDBID
		});
	}
];

/**
 * @param {modules} modules
 */
module.exports.pay = ({ serverModel, accountModel, reportModel }) => [
	accessFunctionHandler,
	expressLayouts,
	/**
	 * @type {RequestHandler}
	 */
	async (req, res, next) => {
		const { id, accountDBID, serverId } = req.query;
		const from = req.query.from ? moment.tz(req.query.from, req.user.tz) : moment().subtract(30, "days");
		const to = req.query.to ? moment.tz(req.query.to, req.user.tz) : moment().add(30, "days");

		const logs = await reportModel.shopPay.findAll({
			where: {
				...id ? { id } : {},
				...accountDBID ? { accountDBID } : {},
				...serverId ? { serverId } : {},
				createdAt: {
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
				["createdAt", "DESC"]
			]
		});

		const servers = await serverModel.info.findAll();

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
	}
];