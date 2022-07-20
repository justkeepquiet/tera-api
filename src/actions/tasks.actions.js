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

	createBox(context, accountDBID, serverId = null, characterId = null, logId = null, logType = null) {
		return this.modules.platform.createBoxFromContext(context, accountDBID, serverId, characterId, logId).then(boxId =>
			this.modules.reportModel.boxes.create({
				boxId,
				accountDBID,
				serverId: serverId || null,
				characterId: characterId || null,
				logType: logType || null,
				logId: logId || null,
				context: JSON.stringify(context)
			})
		);
	}
}

module.exports = TasksActions;