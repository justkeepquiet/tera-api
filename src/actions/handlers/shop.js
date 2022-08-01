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

	fund(amount) {
		return this.modules.shopModel.accounts.findOne({
			where: { accountDBID: this.userId }
		}).then(account => {
			if (account !== null) {
				return this.modules.shopModel.accounts.increment({
					balance: amount
				}, {
					where: { accountDBID: this.userId }
				});
			}

			return this.modules.shopModel.accounts.create({
				accountDBID: this.userId,
				balance: amount
			});
		}).then(() =>
			this.modules.reportModel.shopFund.create({
				accountDBID: this.userId,
				amount: amount,
				description: this.params.report
			})
		);
	}
}

module.exports = Shop;