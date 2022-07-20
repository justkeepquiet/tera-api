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
		return this.modules.platform.createBoxFromContext(context, this.userId, this.serverId, characterId, this.params.logId).then(boxId =>
			this.modules.reportModel.boxes.create({
				boxId,
				accountDBID: this.userId,
				serverId: this.serverId,
				characterId: characterId || null,
				logType: this.params.logType || null,
				logId: this.params.logId || null,
				context: JSON.stringify(context)
			}, {
				transaction: this.transaction
			}).then(() => {
				if (/^true$/i.test(process.env.FCGI_GW_WEBAPI_ENABLE)) {
					this.modules.fcgi.boxNoti(this.serverId, this.userId, characterId || 0).catch(err => {
						if (this.modules.fcgi.params.logger?.error) {
							this.modules.fcgi.params.logger.warn(err);
						}
					});
				}

				return Promise.resolve(boxId);
			})
		);
	}
}

module.exports = ItemClaim;