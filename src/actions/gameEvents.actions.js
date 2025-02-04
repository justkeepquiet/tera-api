"use strict";

/**
 * @typedef {import("../app").modules} modules
 */

const { chainPromise } = require("../utils/helpers");

class GameEventsActions {
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
			config = modules.config.get("gameEvents");

			if (!config) {
				this.modules.logger.warn("GameEventsActions: Cannot read configuration: gameEvents");
				return;
			}
		} catch (err) {
			this.modules.logger.warn(err);
			return;
		}

		Object.keys(config).forEach(event => {
			this.controller[event] = (...args) =>
				modules.sequelize.transaction(() => {
					const methods = [];

					config[event].forEach(controller => {
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

	async execute(event, params) {
		if (this.controller[event] === undefined) {
			this.modules.logger.debug(`GameEventsActions: Invalid event: ${event}`);

			return Promise.resolve();
		}

		return await this.controller[event](this.modules, this.userId, this.serverId, params);
	}
}

module.exports = GameEventsActions;