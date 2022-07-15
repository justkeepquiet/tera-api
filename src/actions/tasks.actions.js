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

	createBox(context, startDate, endDate, accountDBID, serverId = null, characterId = null, logId = null) {
		return this.modules.platform.createBoxFromContext(context, startDate, endDate, accountDBID, serverId, characterId).then(() => {
			this.modules.reportModel.boxes.create({
				accountDBID,
				serverId,
				characterId,
				logId,
				context: JSON.stringify(context)
			}).catch(err =>
				this.modules.logger.error(err)
			);
		});
	}
}

module.exports = TasksActions;