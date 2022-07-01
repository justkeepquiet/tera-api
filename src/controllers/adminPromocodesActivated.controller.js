"use strict";

const expressLayouts = require("express-ejs-layouts");
const Op = require("sequelize").Op;
const moment = require("moment-timezone");
const logger = require("../utils/logger");
const shopModel = require("../models/shop.model");
const { i18nHandler, accessFunctionHandler } = require("../middlewares/admin.middlewares");

module.exports.index = [
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
			res.render("adminPromocodesActivated", {
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