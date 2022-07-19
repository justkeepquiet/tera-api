"use strict";

/**
 * @typedef {import("../app").modules} modules
 */

const moment = require("moment-timezone");

class TasksActions {
	/**
	 * @param {modules} modules
	 */
	constructor(modules) {
		this.modules = modules;
	}

	createBox(context, accountDBID, serverId = null, characterId = null, logId = null, logType = null) {
		const startDate = moment().utc().format("YYYY-MM-DD HH:mm:ss");
		const endDate = moment().utc().add(context.days, "days").format("YYYY-MM-DD HH:mm:ss");

		return this.modules.platform.createBoxFromContext(context, startDate, endDate, accountDBID, serverId, characterId, logId).then(boxId =>
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