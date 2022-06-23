"use strict";

const moment = require("moment-timezone");
const fcgiHttpHelper = require("../utils/fcgiHttpHelper");
const accountModel = require("../models/account.model");

class Benefit {
	constructor(userId, serverId, params = {}) {
		this.userId = userId;
		this.serverId = serverId;
		this.params = params;
	}

	addBenefit(benefitId, days) {
		return accountModel.benefits.findOne({
			attributes: ["availableUntil", [accountModel.characters.sequelize.fn("NOW"), "dateNow"]],
			where: { accountDBID: this.userId, benefitId }
		}).then(benefit => {
			let promise = null;

			if (benefit === null) {
				promise = accountModel.benefits.create({
					accountDBID: this.userId,
					benefitId,
					availableUntil: accountModel.sequelize.fn("ADDDATE", accountModel.sequelize.fn("NOW"), days)
				});
			} else {
				const currentDate = moment(benefit.get("dateNow")).isAfter(benefit.get("availableUntil")) ?
					accountModel.sequelize.fn("NOW") :
					accountModel.sequelize.col("availableUntil");

				promise = accountModel.benefits.update({
					availableUntil: accountModel.sequelize.fn("ADDDATE", currentDate, days)
				}, {
					where: { accountDBID: this.userId, benefitId }
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

				return fcgiHttpHelper.get(["add_benefit", this.serverId, this.userId, benefitId, totalDays * 86400]);
			});
		});
	}
}

module.exports = Benefit;