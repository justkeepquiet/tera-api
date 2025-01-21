"use strict";

/**
 * @typedef {import("../../app").modules} modules
 */

const moment = require("moment-timezone");

class Benefit {
	/**
	 * @param {modules} modules
	 */
	constructor(modules, userId, serverId = null, params = {}) {
		this.modules = modules;
		this.userId = userId;
		this.serverId = serverId;
		this.params = params;
	}

	async addBenefit(benefitId, days) {
		const benefit = await this.modules.accountModel.benefits.findOne({
			attributes: ["availableUntil", [this.modules.sequelize.fn("NOW"), "dateNow"]],
			where: { accountDBID: this.userId, benefitId }
		});

		let totalDays = parseInt(days);

		if (totalDays < 1) {
			throw Error("Invalid days value");
		}

		if (benefit === null) {
			await this.modules.accountModel.benefits.create({
				accountDBID: this.userId,
				benefitId,
				availableUntil: this.modules.sequelize.fn("ADDDATE",
					this.modules.sequelize.fn("NOW"), totalDays)
			});
		} else {
			const currentDate = moment(benefit.get("dateNow")).isAfter(benefit.get("availableUntil")) ?
				this.modules.sequelize.fn("NOW") :
				this.modules.sequelize.col("availableUntil");

			await this.modules.accountModel.benefits.update({
				availableUntil: this.modules.sequelize.fn("ADDDATE", currentDate, totalDays)
			}, {
				where: { accountDBID: this.userId, benefitId }
			});

			totalDays += Math.round(moment.duration(moment(benefit.get("availableUntil"))
				.diff(moment(benefit.get("dateNow"))))
				.asDays());
		}

		if (this.serverId !== null) {
			this.modules.hub.addBenefit(this.serverId, this.userId, benefitId, totalDays * 86400).catch(err =>
				this.modules.logger.warn(err.toString())
			);
		}
	}

	async removeBenefit(benefitId) {
		const benefit = await this.modules.accountModel.benefits.findOne({
			where: { accountDBID: this.userId, benefitId }
		});

		if (benefit !== null) {
			await this.modules.accountModel.benefits.destroy({
				where: { benefitId, accountDBID: this.userId }
			});

			if (this.serverId !== null) {
				this.modules.hub.removeBenefit(this.serverId, this.userId, benefitId).catch(err =>
					this.modules.logger.warn(err.toString())
				);
			}
		}
	}
}

module.exports = Benefit;