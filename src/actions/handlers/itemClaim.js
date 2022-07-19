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

	makeBox(context, characterId = null) {
		if (!/^true$/i.test(process.env.FCGI_GW_WEBAPI_ENABLE)) {
			return Promise.reject("FCGI Gateway is not configured or disabled.");
		}

		return this.modules.fcgi.makeBox(
			this.serverId,
			this.userId,
			characterId || 0,
			this.params.logId || 0,
			context
		).then(result =>
			this.modules.reportModel.boxes.create({
				boxId: result.box_id,
				accountDBID: this.userId,
				serverId: this.serverId,
				characterId: characterId || null,
				logType: this.params.logType || null,
				logId: this.params.logId || null,
				context: JSON.stringify(context)
			}, {
				transaction: this.transaction
			}).then(() =>
				Promise.resolve(result)
			)
		);
	}
}

module.exports = ItemClaim;