"use strict";

const expressLayouts = require("express-ejs-layouts");
const Op = require("sequelize").Op;
const moment = require("moment-timezone");
const logger = require("../utils/logger");
const accountModel = require("../models/account.model");
const shopModel = require("../models/shop.model");
const { i18nHandler, resultJson, validationHandler, accessFunctionHandler } = require("../middlewares/admin.middlewares");

module.exports.accounts = [
	i18nHandler,
	accessFunctionHandler(),
	expressLayouts,
	/**
	 * @type {import("express").RequestHandler}
	 */
	(req, res) => {
		const { account } = req.query;

		shopModel.accounts.findAll({
			where: {
				...(account ? { accountDBID: account } : {})
			}
		}).then(accounts => {
			res.render("adminShopAccounts", {
				layout: "adminLayout",
				accounts,
				moment,
				account
			});
		}).catch(err => {
			logger.error(err.toString());
			res.render("adminError", { layout: "adminLayout", err });
		});
	}
];

module.exports.fundLogs = [
	i18nHandler,
	accessFunctionHandler(),
	expressLayouts,
	/**
	 * @type {import("express").RequestHandler}
	 */
	(req, res) => {
		let { from, to } = req.query;
		const { account } = req.query;

		from = from ? moment(from) : moment().subtract(30, "days");
		to = to ? moment(to) : moment();

		shopModel.fundLogs.findAll({
			where: {
				...(account ? { accountDBID: account } : {}),
				createdAt: {
					[Op.gt]: from.format("YYYY-MM-DD HH:MM:ss"),
					[Op.lt]: to.format("YYYY-MM-DD HH:MM:ss")
				}
			}
		}).then(logs =>
			res.render("adminShopFundLogs", {
				layout: "adminLayout",
				moment,
				logs,
				from,
				to,
				account
			})
		).catch(err => {
			logger.error(err.toString());
			res.render("adminError", { layout: "adminLayout", err });
		});
	}
];

module.exports.payLogs = [
	i18nHandler,
	accessFunctionHandler(),
	expressLayouts,
	/**
	 * @type {import("express").RequestHandler}
	 */
	(req, res) => {
		let { from, to } = req.query;
		const { account, server } = req.query;

		from = from ? moment(from) : moment().subtract(30, "days");
		to = to ? moment(to) : moment();

		shopModel.payLogs.findAll({
			where: {
				...(account ? { accountDBID: account } : {}),
				createdAt: {
					[Op.gt]: from.format("YYYY-MM-DD HH:MM:ss"),
					[Op.lt]: to.format("YYYY-MM-DD HH:MM:ss")
				}
			}
		}).then(logs =>
			accountModel.serverInfo.findAll().then(servers => {
				res.render("adminShopPayLogs", {
					layout: "adminLayout",
					moment,
					servers,
					logs,
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
];

module.exports.promocodes = [
	i18nHandler,
	accessFunctionHandler(),
	expressLayouts,
	/**
	 * @type {import("express").RequestHandler}
	 */
	(req, res) => {
		shopModel.promoCodes.findAll().then(promocodes => {
			res.render("adminShopPromocodes", {
				layout: "adminLayout",
				promocodes,
				moment
			});
		}).catch(err => {
			logger.error(err.toString());
			res.render("adminError", { layout: "adminLayout", err });
		});
	}
];

module.exports.promocodeStrings = [
	i18nHandler,
	accessFunctionHandler(),
	expressLayouts,
	/**
	 * @type {import("express").RequestHandler}
	 */
	(req, res) => {
		const { promocode } = req.query;

		shopModel.promoCodeStrings.belongsTo(shopModel.promoCodes, { foreignKey: "promoCodeId" });
		shopModel.promoCodeStrings.hasMany(shopModel.promoCodes, { foreignKey: "promoCodeId" });

		shopModel.promoCodeStrings.findAll({
			where: {
				...(promocode ? { promoCodeId: promocode } : {})
			},
			include: [{
				model: shopModel.promoCodes,
				attributes: []
			}],
			attributes: {
				include: [
					[shopModel.itemStrings.sequelize.col("promoCode"), "promoCode"]
				]
			}
		}).then(strings => {
			res.render("adminShopPromocodeStrings", {
				layout: "adminLayout",
				strings,
				promocode,
				moment
			});
		}).catch(err => {
			logger.error(err.toString());
			res.render("adminError", { layout: "adminLayout", err });
		});
	}
];

module.exports.promocodesActivated = [
	i18nHandler,
	accessFunctionHandler(),
	expressLayouts,
	/**
	 * @type {import("express").RequestHandler}
	 */
	(req, res) => {
		const { promocode, account } = req.query;

		shopModel.promoCodeActivated.belongsTo(shopModel.promoCodes, { foreignKey: "promoCodeId" });
		shopModel.promoCodeActivated.hasMany(shopModel.promoCodes, { foreignKey: "promoCodeId" });

		shopModel.promoCodeActivated.findAll({
			where: {
				...(promocode ? { promoCodeId: promocode } : {}),
				...(account ? { accountDBID: account } : {})
			},
			include: [{
				model: shopModel.promoCodes,
				attributes: []
			}],
			attributes: {
				include: [
					[shopModel.itemStrings.sequelize.col("promoCode"), "promoCode"]
				]
			}
		}).then(promocodes => {
			res.render("adminShopPromocodesActivated", {
				layout: "adminLayout",
				promocodes,
				promocode,
				account,
				moment
			});
		}).catch(err => {
			logger.error(err.toString());
			res.render("adminError", { layout: "adminLayout", err });
		});
	}
];