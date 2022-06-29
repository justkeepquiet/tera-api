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
		const { accountDBID } = req.query;

		shopModel.accounts.findAll({
			where: {
				...(accountDBID ? { accountDBID } : {})
			}
		}).then(accounts => {
			res.render("adminShopAccounts", {
				layout: "adminLayout",
				accounts,
				moment,
				accountDBID
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
		const { accountDBID } = req.query;

		from = from ? moment(from) : moment().subtract(30, "days");
		to = to ? moment(to) : moment();

		shopModel.fundLogs.findAll({
			where: {
				...(accountDBID ? { accountDBID } : {}),
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
				accountDBID
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
		const { accountDBID, serverId } = req.query;

		from = from ? moment(from) : moment().subtract(30, "days");
		to = to ? moment(to) : moment();

		shopModel.payLogs.findAll({
			where: {
				...(accountDBID ? { accountDBID } : {}),
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
					serverId,
					accountDBID
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
		const { promoCodeId } = req.query;

		shopModel.promoCodeStrings.belongsTo(shopModel.promoCodes, { foreignKey: "promoCodeId" });
		shopModel.promoCodeStrings.hasMany(shopModel.promoCodes, { foreignKey: "promoCodeId" });

		shopModel.promoCodeStrings.findAll({
			where: {
				...(promoCodeId ? { promoCodeId } : {})
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
				promoCodeId,
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
		const { promoCodeId, accountDBID } = req.query;

		shopModel.promoCodeActivated.belongsTo(shopModel.promoCodes, { foreignKey: "promoCodeId" });
		shopModel.promoCodeActivated.hasMany(shopModel.promoCodes, { foreignKey: "promoCodeId" });

		shopModel.promoCodeActivated.findAll({
			where: {
				...(promoCodeId ? { promoCodeId } : {}),
				...(accountDBID ? { accountDBID } : {})
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
				promoCodeId,
				accountDBID,
				moment
			});
		}).catch(err => {
			logger.error(err.toString());
			res.render("adminError", { layout: "adminLayout", err });
		});
	}
];