"use strict";

/**
 * @typedef {import("../../app").modules} modules
 */

class Custom {
	/**
	 * @param {modules} modules
	 */
	constructor(modules, userId, serverId, params = {}) {
		this.modules = modules;
		this.userId = userId;
		this.serverId = serverId;
		this.params = params;
	}

	/**
	 * @param {function} callback
	 */
	async invoke(callback, ...args) {
		if (typeof callback !== "function") {
			throw Error("Callback is not a function");
		}

		await callback.call(null,
			this.modules,
			this.userId,
			this.serverId,
			this.params,
			...args
		);
	}
}

module.exports = Custom;