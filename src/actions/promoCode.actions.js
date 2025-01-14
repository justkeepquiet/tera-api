"use strict";

/**
 * @typedef {import("../app").modules} modules
 */

const { requireReload, chainPromise } = require("../utils/helpers");

class PromoCodeActions {
	/**
	 * @param {modules} modules
	 */
	constructor(modules, serverId, userId) {
		this.modules = modules;
		this.serverId = serverId;
		this.userId = userId;

		const config = modules.config.get("promoCode");

		if (!config) {
			this.modules.logger.warn("Cannot read configuration: promoCode");
			return;
		}

		this.controller = {};

		Object.keys(config).forEach(itemId => {
			this.controller[itemId] = (...args) =>
				modules.sequelize.transaction(() => {
					const methods = [];

					config[itemId].forEach(controller => {
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

	execute(func, promoCode) {
		if (this.controller[func] === undefined) {
			return Promise.reject(`invalid promocode function: ${func}`);
		}

		return this.controller[func](this.modules, this.userId, this.serverId, {
			report: `PromoCode,${func},${promoCode}`,
			logType: 2,
			logId: promoCode
		});
	}
}

module.exports = PromoCodeActions;