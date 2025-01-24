"use strict";

/**
 * @typedef {import("../app").modules} modules
 * @typedef {import("express").RequestHandler} RequestHandler
 */

const expressLayouts = require("express-ejs-layouts");
const moment = require("moment-timezone");
const query = require("express-validator").query;

const {
	accessFunctionHandler,
	validationHandler,
	writeOperationReport
} = require("../middlewares/admin.middlewares");

/**
 * @param {modules} modules
 */
module.exports.index = ({ accountModel, shopModel }) => [
	accessFunctionHandler,
	expressLayouts,
	/**
	 * @type {RequestHandler}
	 */
	async (req, res, next) => {
		const { coupon, accountDBID } = req.query;

		const coupons = await shopModel.coupons.findAll();

		if (!coupon && !accountDBID) {
			return res.render("adminCouponsActivated", {
				layout: "adminLayout",
				errors: null,
				couponsActivated: null,
				coupons,
				coupon,
				accountDBID
			});
		}

		const couponsActivated = await shopModel.couponActivated.findAll({
			where: {
				...accountDBID ? { accountDBID } : {}
			},
			include: [
				{
					as: "info",
					model: shopModel.coupons,
					where: {
						...coupon ? { coupon } : {}
					}
				},
				{
					as: "account",
					model: accountModel.info,
					required: false,
					attributes: ["userName"]
				}
			]
		});

		res.render("adminCouponsActivated", {
			layout: "adminLayout",
			couponsActivated,
			coupons,
			coupon,
			accountDBID,
			moment
		});
	}
];

/**
 * @param {modules} modules
 */
module.exports.deleteAction = ({ logger, sequelize, reportModel, shopModel }) => [
	accessFunctionHandler,
	expressLayouts,
	[
		query("id").trim().notEmpty()
	],
	validationHandler(logger),
	/**
	 * @type {RequestHandler}
	 */
	async (req, res, next) => {
		const { id } = req.query;

		const coupon = await shopModel.couponActivated.findOne({
			where: { id }
		});

		if (coupon === null) {
			throw Error("Object not found");
		}

		req.accountDBID = coupon.get("accountDBID");

		await sequelize.transaction(async () => {
			await shopModel.couponActivated.destroy({ where: { id } });

			await shopModel.coupons.decrement({
				currentActivations: 1
			}, {
				where: { couponId: coupon.get("couponId") }
			});
		});

		next();
	},
	writeOperationReport(reportModel),
	/**
	 * @type {RequestHandler}
	 */
	(req, res, next) => {
		res.redirect(`/coupons_activated?accountDBID=${req.accountDBID}`);
	}
];