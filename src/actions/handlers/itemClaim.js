"use strict";

/**
 * @typedef {import("../../app").modules} modules
 */

const Box = require("../../utils/boxHelper").Box;

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

		this.box = new Box(modules);
	}

	makeBox(context, characterId = null) {
		return this.box.create(context, this.userId, this.serverId, characterId, this.params.logId).then(boxId =>
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
				this.box.notiUser(this.serverId, this.userId, characterId || 0).catch(err =>
					this.modules.logger.warn(err.toString())
				);

				return Promise.resolve(boxId);
			})
		);
	}
}

module.exports = ItemClaim;