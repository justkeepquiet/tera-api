"use strict";

/**
 * @typedef {import("../app").modules} modules
 * @typedef {import("express").RequestHandler} RequestHandler
 */

const body = require("express-validator").body;

const { validationHandler, resultJson } = require("../middlewares/shopApi.middlewares");

/**
 * @param {modules} modules
 */
module.exports.GetAccountInfoByUserNo = ({ logger, shopModel }) => [
	[body("userNo").notEmpty()],
	validationHandler(logger),
	/**
	 * @type {RequestHandler}
	 */
	(req, res) => {
		const { userNo } = req.body;

		shopModel.info.findOne({ where: { accountDBID: userNo } }).then(account => {
			if (account === null) {
				return resultJson(res, 50000, "account not exist");
			}

			resultJson(res, 0, "success", {
				UserNo: account.get("accountDBID"),
				Balance: account.get("balance")
			});
		}).catch(err => {
			logger.error(err);
			resultJson(res, 1, "internal error");
		});
	}
];

/**
 * @param {modules} modules
 */
module.exports.FundByUserNo = ({ logger, reportModel, accountModel, shopModel }) => [
	[
		body("userNo").isNumeric(),
		body("transactionId").isNumeric(),
		body("amount").isInt({ min: 1 })
	],
	validationHandler(logger),
	/**
	 * @type {RequestHandler}
	 */
	(req, res) => {
		const { userNo, transactionId, amount } = req.body;

		accountModel.info.findOne({ where: { accountDBID: userNo } }).then(account => {
			if (account === null) {
				return resultJson(res, 50000, "account not exist");
			}

			return shopModel.accounts.findOne({
				where: { accountDBID: userNo }
			}).then(shopAccount => {
				if (shopAccount !== null) {
					return shopModel.accounts.increment({
						balance: amount
					});
				}

				return shopModel.accounts.create({
					accountDBID: userNo,
					balance: amount
				});
			}).then(() => {
				reportModel.shopFund.create({
					accountDBID: userNo,
					amount: amount,
					description: `ShopApi,${transactionId}`
				}).catch(err => {
					logger.error(err);
				});

				resultJson(res, 0, "success");
			});
		}).catch(err => {
			logger.error(err);
			resultJson(res, 1, "internal error");
		});
	}
];