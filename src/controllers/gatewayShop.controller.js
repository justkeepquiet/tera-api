"use strict";

/**
 * @typedef {import("../app").modules} modules
 * @typedef {import("express").RequestHandler} RequestHandler
 */

const moment = require("moment-timezone");
const { query, body } = require("express-validator");

const PromoCodeActions = require("../actions/promoCode.actions");
const Shop = require("../actions/handlers/shop");
const { validationHandler } = require("../middlewares/gateway.middlewares");

/**
 * @param {modules} modules
 */
module.exports.ListAccounts = ({ accountModel, shopModel }) => [
	/**
	 * @type {RequestHandler}
	 */
	async (req, res, next) => {
		const accounts = await shopModel.accounts.findAll({
			include: [{
				as: "info",
				model: accountModel.info,
				required: false,
				attributes: ["userName"]
			}]
		});

		const data = [];

		accounts.forEach(account => {
			data.push({
				UserNo: account.get("accountDBID"),
				UserName: account.get("info")?.get("userName") || null,
				Balance: account.get("balance"),
				Discount: account.get("discount"),
				IsActive: !!account.get("active"),
				RegisterTime: moment(account.get("createdAt")).toISOString()
			});
		});

		res.json({
			Return: true,
			ReturnCode: 0,
			Msg: "success",
			Accounts: data
		});
	}
];

/**
 * @param {modules} modules
 */
module.exports.GetAccountInfoByUserNo = ({ logger, accountModel, shopModel }) => [
	[
		query("userNo").trim().isNumeric()
			.custom(value => shopModel.accounts.findOne({
				where: { accountDBID: value }
			}).then(data => {
				if (value && data === null) {
					return Promise.reject("Not existing account ID");
				}
			}))
	],
	validationHandler(logger),
	/**
	 * @type {RequestHandler}
	 */
	async (req, res, next) => {
		const { userNo } = req.query;

		const account = await shopModel.accounts.findOne({
			where: { accountDBID: userNo },
			include: [{
				as: "info",
				model: accountModel.info,
				required: false,
				attributes: ["userName"]
			}]
		});

		res.json({
			Return: true,
			ReturnCode: 0,
			Msg: "success",
			UserNo: account.get("accountDBID"),
			UserName: account.get("info")?.get("userName") || null,
			Balance: account.get("balance"),
			Discount: account.get("discount"),
			IsActive: !!account.get("active"),
			RegisterTime: moment(account.get("createdAt")).toISOString()
		});
	}
];

/**
 * @param {modules} modules
 */
module.exports.FundByUserNo = modules => [
	[
		body("userNo").trim().isNumeric()
			.custom(value => modules.accountModel.info.findOne({
				where: { accountDBID: value }
			}).then(data => {
				if (value && data === null) {
					return Promise.reject("Not existing account ID");
				}
			})),
		body("transactionId").trim().isNumeric(),
		body("amount").trim().isInt({ min: 1 })
	],
	validationHandler(modules.logger),
	/**
	 * @type {RequestHandler}
	 */
	async (req, res, next) => {
		const { userNo, transactionId, amount } = req.body;

		await modules.sequelize.transaction(async () => {
			const account = await modules.accountModel.info.findOne({
				where: { accountDBID: userNo }
			});

			const shop = new Shop(
				modules,
				account.get("accountDBID"),
				null,
				{
					report: `ShopApi,${transactionId}`
				}
			);

			await shop.fund(amount);
		});

		res.json({
			Return: true,
			ReturnCode: 0,
			Msg: "success"
		});
	}
];

/**
 * @param {modules} modules
 */
module.exports.ListPromoCodes = ({ shopModel }) => [
	/**
	 * @type {RequestHandler}
	 */
	async (req, res, next) => {
		const promocodes = await shopModel.promoCodes.findAll();

		const data = [];

		promocodes.forEach(promocode => {
			const valid = promocode.get("active") &&
				(promocode.get("maxActivations") === 0 || promocode.get("currentActivations") < promocode.get("maxActivations")) &&
				moment().isSameOrAfter(moment(promocode.get("validAfter"))) &&
				moment().isSameOrBefore(moment(promocode.get("validBefore")));

			data.push({
				Id: promocode.get("promoCodeId"),
				String: promocode.get("promoCode"),
				Function: promocode.get("function"),
				CurrentActivations: promocode.get("currentActivations"),
				MaxActivations: promocode.get("maxActivations"),
				ValidAfterTime: moment(promocode.get("validAfter")).toISOString(),
				ValidBeforeTime: moment(promocode.get("validBefore")).toISOString(),
				IsActive: !!promocode.get("active"),
				IsValid: valid
			});
		});

		res.json({
			Return: true,
			ReturnCode: 0,
			Msg: "success",
			PromoCodes: data
		});
	}
];

/**
 * @param {modules} modules
 */
module.exports.ListPromoCodesActivatedByUserNo = ({ logger, accountModel, shopModel }) => [
	[query("userNo").trim().isNumeric()],
	validationHandler(logger),
	/**
	 * @type {RequestHandler}
	 */
	async (req, res, next) => {
		const { userNo } = req.query;

		const promocodesActivated = await shopModel.promoCodeActivated.findAll({
			where: { accountDBID: userNo },
			include: [
				{
					as: "info",
					model: shopModel.promoCodes
				},
				{
					as: "account",
					model: accountModel.info,
					required: false,
					attributes: ["userName"]
				}
			]
		});

		const data = [];

		promocodesActivated.forEach(activated => {
			data.push({
				Id: activated.get("promoCodeId"),
				String: activated.get("info").get("promoCode"),
				UserNo: activated.get("accountDBID"),
				UserName: activated.get("account")?.get("userName") || null,
				ActivationTime: moment(activated.get("createdAt")).toISOString()
			});
		});

		res.json({
			Return: true,
			ReturnCode: 0,
			Msg: "success",
			PromoCodesActivated: data
		});
	}
];

/**
 * @param {modules} modules
 */
module.exports.ListPromoCodesActivatedById = ({ logger, accountModel, shopModel }) => [
	[query("id").trim().isNumeric()],
	validationHandler(logger),
	/**
	 * @type {RequestHandler}
	 */
	async (req, res, next) => {
		const { id } = req.query;

		const promocodesActivated = await shopModel.promoCodeActivated.findAll({
			where: { promoCodeId: id },
			include: [
				{
					as: "info",
					model: shopModel.promoCodes
				},
				{
					as: "account",
					model: accountModel.info,
					required: false,
					attributes: ["userName"]
				}
			]
		});

		const data = [];

		promocodesActivated.forEach(activated => {
			data.push({
				Id: activated.get("promoCodeId"),
				String: activated.get("info").get("promoCode"),
				UserNo: activated.get("accountDBID"),
				UserName: activated.get("account")?.get("userName") || null,
				ActivationTime: moment(activated.get("createdAt")).toISOString()

			});
		});

		res.json({
			Return: true,
			ReturnCode: 0,
			Msg: "success",
			PromoCodesActivated: data
		});
	}
];


/**
 * @param {modules} modules
 */
module.exports.ActivatePromoCodeByUserNo = modules => [
	[
		body("promoCodeId").trim().isNumeric()
			.custom(value => modules.shopModel.promoCodes.findOne({
				attributes: {
					include: [[modules.sequelize.fn("NOW"), "dateNow"]]
				},
				where: { promoCodeId: value }
			}).then(data => {
				if (value) {
					if (data === null) {
						return Promise.reject("Not existing promo code ID");
					}
					if (!data.get("active")) {
						return Promise.reject("Inactive promo code ID");
					}
					if (moment(data.get("dateNow")).isBefore(data.get("validAfter")) ||
						moment(data.get("dateNow")).isAfter(data.get("validBefore"))
					) {
						return Promise.reject("Expired promo code ID");
					}
					if (data.get("maxActivations") > 0 &&
						data.get("currentActivations") >= data.get("maxActivations")
					) {
						return Promise.reject("Promo code ID with the activation limit reached");
					}
				}
			})),
		body("userNo").trim().isNumeric()
			.custom(value => modules.accountModel.info.findOne({
				where: { accountDBID: value }
			}).then(data => {
				if (value && data === null) {
					return Promise.reject("Not existing account ID");
				}
			}))
			.custom((value, { req }) => modules.shopModel.promoCodeActivated.findOne({
				where: {
					promoCodeId: req.body.promoCodeId,
					accountDBID: req.body.userNo
				}
			}).then(data => {
				if (data) {
					return Promise.reject("Already been activated on the specified account ID");
				}
			}))
	],
	validationHandler(modules.logger),
	/**
	 * @type {RequestHandler}
	 */
	async (req, res, next) => {
		const { promoCodeId, userNo } = req.body;

		const account = await modules.accountModel.info.findOne({
			where: { accountDBID: userNo }
		});

		const promocode = await modules.shopModel.promoCodes.findOne({
			where: { promoCodeId }
		});

		await modules.sequelize.transaction(async () => {
			await modules.shopModel.promoCodeActivated.create({
				promoCodeId: promocode.get("promoCodeId"),
				accountDBID: account.get("accountDBID")
			});

			await modules.shopModel.promoCodes.increment({
				currentActivations: 1
			}, {
				where: { promoCodeId: promocode.get("promoCodeId") }
			});
		});

		await modules.sequelize.transaction(async () => {
			const actions = new PromoCodeActions(
				modules,
				account.get("lastLoginServer"),
				account.get("accountDBID")
			);

			return await actions.execute(promocode.get("function"), promocode.get("promoCodeId"));
		}).catch(err => {
			modules.logger.error(err);

			return modules.shopModel.promoCodeActivated.destroy({
				where: {
					promoCodeId: promocode.get("promoCodeId"),
					accountDBID: account.get("accountDBID")
				}
			}).then(() => modules.shopModel.promoCodes.decrement({
				currentActivations: 1
			}, {
				where: { promoCodeId: promocode.get("promoCodeId") }
			}));
		});

		res.json({
			Return: true,
			ReturnCode: 0,
			Msg: "success"
		});
	}
];