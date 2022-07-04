"use strict";

const shopModel = require("../models/shop.model");

class Shop {
	constructor(userId, serverId, params = {}) {
		this.userId = userId;
		this.serverId = serverId;
		this.params = params;
	}

	fund(amount) {
		return shopModel.accounts.findOne({
			where: { accountDBID: this.userId }
		}).then(account => {
			if (account !== null) {
				return shopModel.accounts.increment({
					balance: amount
				}, {
					where: { accountDBID: this.userId }
				});
			}

			return shopModel.accounts.create({
				accountDBID: this.userId,
				balance: amount
			});
		}).then(() =>
			shopModel.fundLogs.create({
				accountDBID: this.userId,
				amount: amount,
				description: this.params.report
			})
		);
	}
}

module.exports = Shop;