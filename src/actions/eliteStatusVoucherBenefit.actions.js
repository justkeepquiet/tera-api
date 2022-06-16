"use strict";

const moment = require("moment-timezone");
const fcgiHttpHelper = require("../utils/fcgiHttpHelper");
const accountModel = require("../models/account.model");

class EliteStatusVoucherBenefit {
	constructor(userId, serverId) {
		this.userId = userId;
		this.serverId = serverId;
		this.benefitId = process.env.API_PORTAL_BENEFIT_ID_ELITE_STATUS || 533; // RU VIP
	}

	addBenefit(days, benefitId = null) {
		const benefitIdentifier = benefitId || this.benefitId;

		return accountModel.benefits.findOne({
			attributes: ["availableUntil", [accountModel.characters.sequelize.fn("NOW"), "dateNow"]],
			where: { accountDBID: this.userId, benefitId: benefitIdentifier }
		}).then(benefit => {
			let promise = null;

			if (benefit === null) {
				promise = accountModel.benefits.create({
					accountDBID: this.userId,
					benefitId: benefitIdentifier,
					availableUntil: accountModel.sequelize.fn("ADDDATE", accountModel.sequelize.fn("NOW"), days)
				});
			} else {
				const currentDate = moment(benefit.get("dateNow")).isAfter(benefit.get("availableUntil")) ?
					accountModel.sequelize.fn("NOW") :
					accountModel.sequelize.col("availableUntil");

				promise = accountModel.benefits.update({
					availableUntil: accountModel.sequelize.fn("ADDDATE", currentDate, days)
				}, {
					where: { accountDBID: this.userId, benefitId: benefitIdentifier }
				});
			}

			return promise.then(() => {
				let totalDays = days;

				if (benefit !== null) {
					totalDays += Math.round(
						moment.duration(moment(benefit.get("availableUntil"))
							.diff(moment(benefit.get("dateNow"))))
							.asDays()
					);
				}

				return fcgiHttpHelper.get(["add_benefit", this.serverId, this.userId, this.benefitId, totalDays * 86400]);
			});
		});
	}

	sendBox(context) {
		return Promise.all([
			fcgiHttpHelper.post(["make_box.json"], {
				svr_id: this.serverId,
				user_srl: this.userId,
				char_srl: 0,
				log_id: 0,
				start_valid: moment().unix(),
				valid_duration: context.days * 86400,
				icon: context.icon,
				title: context.title,
				content: context.content,
				items: context.items
			}),
			fcgiHttpHelper.get(["box_noti", this.serverId, this.userId, 0])
		]);
	}
}

module.exports = EliteStatusVoucherBenefit;