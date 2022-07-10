"use strict";

/**
 * @typedef {import("../app").modules} modules
 */

class ItemClaim {
	/**
	 * @param {modules} modules
	 */
	constructor(modules, userId, serverId, params = {}) {
		this.modules = modules;
		this.userId = userId;
		this.serverId = serverId;
		this.params = params;
	}

	makeBox(context, logId = 0, characterId = 0) {
		return this.modules.fcgi.makeBox(this.serverId, this.userId, characterId, logId, context);
	}
}

module.exports = ItemClaim;