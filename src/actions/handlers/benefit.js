"use strict";

/**
 * @typedef {import("../../app").modules} modules
 */

const moment = require("moment-timezone");

const ApiError = require("../../lib/apiError");

const MAX_BENEFIT_DAYS = 3650;

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
		let totalDays = parseInt(days);

		if (totalDays < 1) {
			throw new ApiError("Invalid days value", 2);
		}

		const benefit = await this.modules.accountModel.benefits.findOne({
			attributes: ["availableUntil", [this.modules.sequelize.fn("NOW"), "dateNow"]],
			where: { accountDBID: this.userId, benefitId }
		});

		if (benefit === null) {
			if (totalDays > MAX_BENEFIT_DAYS) {
				throw new ApiError(`Days value cannot be greater than ${MAX_BENEFIT_DAYS} days`, 2);
			}

			await this.modules.accountModel.benefits.create({
				accountDBID: this.userId,
				benefitId,
				availableUntil: this.modules.sequelize.fn("ADDDATE",
					this.modules.sequelize.fn("NOW"), totalDays)
			});
		} else {
			const currentDate = moment(benefit.get("dateNow")).isAfter(benefit.get("availableUntil")) ?
				moment(benefit.get("dateNow")) :
				moment(benefit.get("availableUntil"));

			const availableUntil = currentDate.add(totalDays, "days");
			const dateLimit = moment(benefit.get("dateNow")).add(MAX_BENEFIT_DAYS, "days");

			if (availableUntil.isAfter(dateLimit)) {
				throw new ApiError(`Benefit date with added days value must not exceed ${MAX_BENEFIT_DAYS} days`, 2);
			}

			await this.modules.accountModel.benefits.update({
				availableUntil: availableUntil.toISOString()
			}, {
				where: { accountDBID: this.userId, benefitId }
			});

			totalDays = Math.round(
				moment.duration(
					currentDate.diff(moment(benefit.get("dateNow")))
				).asDays()
			);
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