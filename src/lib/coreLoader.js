"use strict";

/**
 * @typedef {import("../utils/logger")} logger
 */

class CoreLoader {
	/**
	 * @param {logger} logger
	 */
	constructor(logger = null, modules = {}) {
		this.logger = logger;
		this.modules = modules;
		this.promises = [];
	}

	async setAsync(name, callback, ...args) {
		this.modules[name] = await callback(...args, this.modules);
	}

	setPromise(name, callback, ...args) {
		this.promises.push(callback(...args, this.modules).then(modules =>
			this.modules[name] = modules
		));
	}

	async final() {
		await Promise.all(this.promises);

		if (this.logger) {
			this.logger.debug(`Registered modules: ${Object.keys(this.modules).join(", ")}`);
		}

		return this.modules;
	}
}

module.exports = CoreLoader;