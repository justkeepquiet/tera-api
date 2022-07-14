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

	makeBox(serverId, userId, context) {
		return this.modules.fcgi.makeBox(serverId, userId, 0, 0, context, false);
	}
}

module.exports = TasksActions;