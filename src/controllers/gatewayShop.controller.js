"use strict";

/**
 * @typedef {import("../app").modules} modules
 * @typedef {import("express").RequestHandler} RequestHandler
 */

const { query, body } = require("express-validator");

const Shop = require("../actions/handlers/shop");
const ApiError = require("../lib/apiError");
const { validationHandler } = require("../middlewares/gateway.middlewares");

/**
 * @param {modules} modules
 */
module.exports.GetAccountInfoByUserNo = ({ logger, shopModel }) => [
	[query("userNo").notEmpty()],
	validationHandler(logger),
	/**
	 * @type {RequestHandler}
	 */
	async (req, res, next) => {
		const { userNo } = req.query;

		const account = await shopModel.accounts.findOne({
			where: { accountDBID: userNo }
		});

		if (account === null) {
			throw ApiError("account not exist", 50000);
		}

		res.json({
			Return: true,
			ReturnCode: 0,
			Msg: "success",
			UserNo: account.get("accountDBID"),
			Balance: account.get("balance")
		});
	}
];

/**
 * @param {modules} modules
 */
module.exports.FundByUserNo = modules => [
	[
		body("userNo").isNumeric(),
		body("transactionId").isNumeric(),
		body("amount").isInt({ min: 1 })
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

			if (account === null) {
				throw ApiError("account not exist", 50000);
			}

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