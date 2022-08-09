"use strict";

/**
 * @typedef {import("../app").modules} modules
 * @typedef {import("express").RequestHandler} RequestHandler
 */

const { query, body } = require("express-validator");
const Shop = require("../actions/handlers/shop");

const { validationHandler, resultJson } = require("../middlewares/gateway.middlewares");

/**
 * @param {modules} modules
 */
module.exports.GetAccountInfoByUserNo = ({ logger, shopModel }) => [
	[query("userNo").notEmpty()],
	validationHandler(logger),
	/**
	 * @type {RequestHandler}
	 */
	(req, res) => {
		const { userNo } = req.query;

		shopModel.accounts.findOne({ where: { accountDBID: userNo } }).then(account => {
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
	(req, res) => {
		const { userNo, transactionId, amount } = req.body;

		modules.sequelize.transaction(() =>
			modules.accountModel.info.findOne({ where: { accountDBID: userNo } }).then(account => {
				if (account === null) {
					return resultJson(res, 50000, "account not exist");
				}

				const shop = new Shop(
					modules,
					account.get("accountDBID"),
					null,
					{
						report: `ShopApi,${transactionId}`
					}
				);

				return shop.fund(amount).then(() =>
					resultJson(res, 0, "success")
				);
			})
		).catch(err => {
			modules.logger.error(err);
			resultJson(res, 1, "internal error");
		});
	}
];