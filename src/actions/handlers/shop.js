"use strict";

/**
 * @typedef {import("../../app").modules} modules
 */

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
			throw Error("Invalid percent value");
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
			throw Error("Invalid percent value");
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

	// deprecated call
	async fund(amount) {
		return await this.addBalance(amount);
	}
}

module.exports = Shop;