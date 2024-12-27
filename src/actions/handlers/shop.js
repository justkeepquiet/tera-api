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

	async fund(amount) {
		let balance = amount;

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
}

module.exports = Shop;