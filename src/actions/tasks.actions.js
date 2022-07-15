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

	createBox(context, startDate, endDate, accountId, serverId, characterId = null) {
		return this.modules.platform.createBoxFromContext(context, startDate, endDate, accountId, serverId, characterId);
	}
}

module.exports = TasksActions;