"use strict";

const EventEmitter = require("events").EventEmitter;
const accountModel = require("../models/account.model");

// @see StrSheet_AccountBenefit
const BENEFIT_ID_ELITE_STATUS = 533; // RU VIP

const сhronoScrollController = {
	// Elite Status Voucher (1-day)
	183455: (serverId, userId) => (new EliteStatusVoucherBenefit(userId)).addDays(1),

	// Elite Status Voucher (14-day)
	183459: (serverId, userId) => (new EliteStatusVoucherBenefit(userId)).addDays(14),

	// Elite Status Voucher (180-day)
	183463: (serverId, userId) => (new EliteStatusVoucherBenefit(userId)).addDays(180),

	// Elite Status Voucher (30-day)
	183460: (serverId, userId) => (new EliteStatusVoucherBenefit(userId)).addDays(30),

	// Elite Status Voucher (360-day)
	183464: (serverId, userId) => (new EliteStatusVoucherBenefit(userId)).addDays(360),

	// Elite Status Voucher (5-day)
	183457: (serverId, userId) => (new EliteStatusVoucherBenefit(userId)).addDays(5),

	// Elite Status Voucher (60-day)
	183461: (serverId, userId) => (new EliteStatusVoucherBenefit(userId)).addDays(60),

	// Elite Status Voucher (7-day)
	183458: (serverId, userId) => (new EliteStatusVoucherBenefit(userId)).addDays(7),

	// Elite Status Voucher (90-day)
	183462: (serverId, userId) => (new EliteStatusVoucherBenefit(userId)).addDays(90)
};

class EliteStatusVoucherBenefit {
	constructor(userId) {
		this.userId = userId;
		this.benefitId = BENEFIT_ID_ELITE_STATUS;
	}

	async addDays(days) {
		const benefit = await accountModel.benefits.findOne({
			where: { accountDBID: this.userId, benefitId: this.benefitId }
		});

		if (benefit === null) {
			return accountModel.benefits.create({
				accountDBID: this.userId,
				benefitId: this.benefitId,
				availableUntil: accountModel.sequelize.fn("ADDDATE", accountModel.sequelize.fn("NOW"), days)
			});
		} else {
			return accountModel.benefits.update({
				availableUntil: accountModel.sequelize.fn("ADDDATE", accountModel.sequelize.col("availableUntil"), days)
			}, {
				where: { accountDBID: this.userId, benefitId: this.benefitId }
			});
		}
	}
}

class ChronoScrollActions extends EventEmitter {
	constructor(serverId) {
		super();
		this.serverId = serverId;
		this.assign();
	}

	assign() {
		Object.keys(сhronoScrollController).forEach(chronoId =>
			this.on(chronoId, userId => сhronoScrollController[chronoId](this.serverId, userId))
		);
	}
}

module.exports = ChronoScrollActions;