"use strict";

const { requireReload, chainPromise } = require("../utils/helpers");

class ChronoScrollActions {
	constructor(serverId, userId) {
		this.serverId = serverId;
		this.userId = userId;

		const config = requireReload("../../config/chronoScroll");
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

	execute(chronoId) {
		if (this.controller[chronoId] === undefined) {
			return Promise.reject(`invalid chronoId: ${chronoId}`);
		}

		return this.controller[chronoId](this.userId, this.serverId, {
			report: `ChronoScroll,${chronoId}`
		});
	}
}

module.exports = ChronoScrollActions;