"use strict";

/**
 * @typedef {import("../app").modules} modules
 */

const { chainPromise } = require("../utils/helpers");

class ChronoScrollActions {
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
			config = modules.config.get("chronoScroll");

			if (!config) {
				this.modules.logger.warn("ChronoScrollActions: Cannot read configuration: chronoScroll");
				return;
			}
		} catch (err) {
			this.modules.logger.warn(err);
			return;
		}

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

	async execute(chronoId) {
		if (this.controller[chronoId] === undefined) {
			return Promise.reject(`ChronoScrollActions: Invalid chronoId: ${chronoId}`);
		}

		return await this.controller[chronoId](this.modules, this.userId, this.serverId, {
			report: `ChronoScroll,${chronoId}`,
			logType: 1,
			logId: chronoId
		});
	}
}

module.exports = ChronoScrollActions;