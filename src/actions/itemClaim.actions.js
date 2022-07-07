"use strict";

/**
 * @typedef {import("../app").modules} modules
 */

const boxHelper = require("../utils/boxHelper");

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

	makeBox(context, logId = 0) {
		return boxHelper.makeBox(context, logId, this.serverId, this.userId);
	}
}

module.exports = ItemClaim;