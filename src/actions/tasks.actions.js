"use strict";

/**
 * @typedef {import("../app").modules} modules
 */

class TasksActions {
	/**
	 * @param {modules} modules
	 */
	constructor(modules) {
		this.modules = modules;
	}

	createBox(context, userId, serverId = null, characterId = null, lastLoginServer = null, logId = null, logType = null) {
		return this.modules.hub.createBoxFromContext(context, userId, serverId, characterId, logId).then(boxId => {
			if (lastLoginServer !== null) {
				this.modules.hub.boxNotiUser(lastLoginServer, userId, characterId || 0).catch(err =>
					this.modules.logger.warn(err.toString())
				);
			}

			return this.modules.reportModel.boxes.create({
				boxId,
				accountDBID: userId,
				serverId: serverId || null,
				characterId: characterId || null,
				logType: logType || null,
				logId: logId || null,
				context: JSON.stringify(context)
			});
		});
	}
}

module.exports = TasksActions;