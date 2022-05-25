"use strict";

const EventEmitter = require("events").EventEmitter;
const moment = require("moment-timezone");
const accountModel = require("../models/account.model");

// @see StrSheet_AccountBenefit
const BENEFIT_ID_ELITE_STATUS = process.env.API_PORTAL_BENEFIT_ID_ELITE_STATUS || 533; // RU VIP

const сhronoScrollController = {
	// Mini Chronoscroll
	358: userId => (new EliteStatusVoucherBenefit(userId)).add(7),

	// Chronoscroll
	372: userId => (new EliteStatusVoucherBenefit(userId)).add(30),

	// Triple Chronoscroll
	373: userId => (new EliteStatusVoucherBenefit(userId)).add(90),

	// VIP 1 Day
	149897: userId => (new EliteStatusVoucherBenefit(userId)).add(1),

	// VIP 15 Day
	149901: userId => (new EliteStatusVoucherBenefit(userId)).add(15),

	// VIP 3 Day
	149898: userId => (new EliteStatusVoucherBenefit(userId)).add(3),

	// VIP 30 Day
	149902: userId => (new EliteStatusVoucherBenefit(userId)).add(30),

	// VIP 5 Day
	149899: userId => (new EliteStatusVoucherBenefit(userId)).add(5),

	// VIP 7 Day
	149900: userId => (new EliteStatusVoucherBenefit(userId)).add(7),

	// VIP 30 Day
	215306: userId => (new EliteStatusVoucherBenefit(userId)).add(30),

	// TERA Club Membership (3 Days)
	155780: userId => (new EliteStatusVoucherBenefit(userId)).add(3),

	// TERA Club Membership (30 Days)
	155503: userId => (new EliteStatusVoucherBenefit(userId)).add(30),

	// Elite Status Voucher (1-day)
	183455: userId => (new EliteStatusVoucherBenefit(userId)).add(1),

	// Elite Status Voucher (14-day)
	183459: userId => (new EliteStatusVoucherBenefit(userId)).add(14),

	// Elite Status Voucher (180-day)
	183463: userId => (new EliteStatusVoucherBenefit(userId)).add(180),

	// Elite Status Voucher (30-day)
	183460: userId => (new EliteStatusVoucherBenefit(userId)).add(30),

	// Elite Status Voucher (360-day)
	183464: userId => (new EliteStatusVoucherBenefit(userId)).add(360),

	// Elite Status Voucher (5-day)
	183457: userId => (new EliteStatusVoucherBenefit(userId)).add(5),

	// Elite Status Voucher (60-day)
	183461: userId => (new EliteStatusVoucherBenefit(userId)).add(60),

	// Elite Status Voucher (7-day)
	183458: userId => (new EliteStatusVoucherBenefit(userId)).add(7),

	// Elite Status Voucher (90-day)
	183462: userId => (new EliteStatusVoucherBenefit(userId)).add(90)
};

class EliteStatusVoucherBenefit {
	constructor(userId) {
		this.userId = userId;
		this.benefitId = BENEFIT_ID_ELITE_STATUS;
	}

	async add(days) {
		const benefit = await accountModel.benefits.findOne({
			attributes: ["availableUntil", [accountModel.characters.sequelize.fn("NOW"), "dateNow"]],
			where: { accountDBID: this.userId, benefitId: this.benefitId }
		});

		if (benefit === null) {
			return accountModel.benefits.create({
				accountDBID: this.userId,
				benefitId: this.benefitId,
				availableUntil: accountModel.sequelize.fn("ADDDATE", accountModel.sequelize.fn("NOW"), days)
			});
		}

		const currentDate = moment(benefit.get("dateNow")).isAfter(benefit.get("availableUntil")) ?
			accountModel.sequelize.fn("NOW") :
			accountModel.sequelize.col("availableUntil");

		return accountModel.benefits.update({
			availableUntil: accountModel.sequelize.fn("ADDDATE", currentDate, days)
		}, {
			where: { accountDBID: this.userId, benefitId: this.benefitId }
		});
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
			this.on(chronoId, userId => сhronoScrollController[chronoId](userId, this.serverId))
		);
	}
}

module.exports = ChronoScrollActions;