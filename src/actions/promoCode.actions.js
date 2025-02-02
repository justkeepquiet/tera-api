"use strict";

/**
 * @typedef {import("../app").modules} modules
 */

const { chainPromise } = require("../utils/helpers");

class PromoCodeActions {
	/**
	 * @param {modules} modules
	 */
	constructor(modules, serverId, userId) {
		this.modules = modules;
		this.serverId = serverId;
		this.userId = userId;
		this.controller = {};

		let config = null;

		try {
			config = modules.config.get("promoCode");

			if (!config) {
				this.modules.logger.warn("PromoCodeActions: Cannot read configuration: promoCode");
				return;
			}
		} catch (err) {
			this.modules.logger.warn(err);
			return;
		}

		Object.keys(config).forEach(func => {
			this.controller[func] = (...args) =>
				modules.sequelize.transaction(() => {
					const methods = [];

					config[func].forEach(controller => {
						const instance = new controller[0](...args);

						Object.keys(controller[1]).forEach(method => {
							methods.push(instance[method].bind(instance, ...controller[1][method]));
						});
					});

					return chainPromise(methods);
				})
			;
		});
	}

	async execute(func, promoCode) {
		if (this.controller[func] === undefined) {
			return Promise.reject(`PromoCodeActions: Invalid promocode function: ${func}`);
		}

		return await this.controller[func](this.modules, this.userId, this.serverId, {
			report: `PromoCode,${func},${promoCode}`,
			logType: 2,
			logId: promoCode
		});
	}
}

module.exports = PromoCodeActions;