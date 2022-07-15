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

	createBox(context, days, accountDBID, serverId = null, characterId = null, logId = null) {
		const startDate = moment().utc().format("YYYY-MM-DD HH:mm:ss");
		const endDate = moment().utc().add(days, "days").format("YYYY-MM-DD HH:mm:ss");

		return this.modules.platform.createBoxFromContext(context, startDate, endDate, accountDBID, serverId, characterId).then(() => {
			this.modules.reportModel.boxes.create({
				accountDBID,
				serverId,
				characterId,
				logId,
				days,
				context: JSON.stringify(context)
			}).catch(err =>
				this.modules.logger.error(err)
			);
		});
	}
}

module.exports = TasksActions;