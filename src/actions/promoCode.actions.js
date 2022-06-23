"use strict";

const { requireReload, chainPromise } = require("../utils/helpers");

class PromoCodeActions {
	constructor(serverId, userId) {
		this.serverId = serverId;
		this.userId = userId;

		const config = requireReload("../../config/promoCode");
		this.controller = {};

		Object.keys(config).forEach(itemId => {
			this.controller[itemId] = (...args) => {
				const methods = [];

				config[itemId].forEach(controller => {
					const instance = new controller[0](...args);

					Object.keys(controller[1]).forEach(method => {
						methods.push(instance[method].bind(instance, ...controller[1][method]));
					});
				});

				return chainPromise(methods);
			};
		});
	}

	execute(func, promoCode) {
		if (this.controller[func] === undefined) {
			return Promise.reject(`invalid promocode function: ${func}`);
		}

		return this.controller[func](this.userId, this.serverId, {
			report: `PromoCode,${func},${promoCode}`
		});
	}
}

module.exports = PromoCodeActions;