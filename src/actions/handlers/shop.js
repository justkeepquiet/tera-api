"use strict";

/**
 * @typedef {import("../../app").modules} modules
 */

const moment = require("moment-timezone");

const ApiError = require("../../lib/apiError");
const { generateRandomWord } = require("../../utils/helpers");

class Shop {
	/**
	 * @param {modules} modules
	 */
	constructor(modules, userId, serverId, params = {}) {
		this.modules = modules;
		this.userId = userId;
		this.serverId = serverId;
		this.params = params;
	}

	async addBalance(amount) {
		let balance = parseInt(amount);

		if (balance < 1) {
			throw new ApiError("Invalid percent value", 2);
		}

		const account = await this.modules.shopModel.accounts.findOne({
			where: { accountDBID: this.userId }
		});

		if (account !== null) {
			balance = account.get("balance") + amount;

			await this.modules.shopModel.accounts.increment({
				balance: amount
			}, {
				where: { accountDBID: this.userId }
			});
		} else {
			await this.modules.shopModel.accounts.create({
				accountDBID: this.userId,
				balance: amount
			});
		}

		await this.modules.reportModel.shopFund.create({
			accountDBID: this.userId,
			amount: amount,
			balance,
			description: this.params.report
		});
	}

	async addDiscount(percent) {
		let discount = parseInt(percent);

		if (discount < 1 || discount > 100) {
			throw new ApiError("Invalid percent value", 2);
		}

		const account = await this.modules.shopModel.accounts.findOne({
			where: { accountDBID: this.userId }
		});

		if (account !== null) {
			discount = Math.min(account.get("discount") + percent, 100);

			await this.modules.shopModel.accounts.increment({
				discount: percent
			}, {
				where: { accountDBID: this.userId }
			});
		} else {
			await this.modules.shopModel.accounts.create({
				accountDBID: this.userId,
				discount: percent
			});
		}
	}

	async addCoupon(discount, days) {
		let coupon = null;
		let couponCount = 0;

		do {
			coupon = generateRandomWord(8);
			couponCount = await this.modules.shopModel.coupons.count({
				where: { coupon }
			});
		} while (couponCount > 0);

		await this.modules.shopModel.coupons.create({
			coupon,
			discount,
			validAfter: moment().toDate(),
			validBefore: moment().add(days, "days").toDate(),
			active: true,
			maxActivations: 1,
			accountDBID: this.userId
		});
	}

	// deprecated call
	async fund(amount) {
		return await this.addBalance(amount);
	}
}

module.exports = Shop;