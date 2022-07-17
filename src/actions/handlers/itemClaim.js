"use strict";

/**
 * @typedef {import("../../app").modules} modules
 */

class ItemClaim {
	/**
	 * @param {modules} modules
	 */
	constructor(transaction, modules, userId, serverId, params = {}) {
		this.transaction = transaction;
		this.modules = modules;
		this.userId = userId;
		this.serverId = serverId;
		this.params = params;
	}

	makeBox(context, logId = 0, characterId = 0) {
		if (!/^true$/i.test(process.env.FCGI_GW_WEBAPI_ENABLE)) {
			return Promise.reject("FCGI Gateway is not configured or disabled.");
		}

		return this.modules.fcgi.makeBox(this.serverId, this.userId, characterId, logId, context);
	}
}

module.exports = ItemClaim;