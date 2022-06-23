"use strict";

const boxHelper = require("../utils/boxHelper");

class ItemClaim {
	constructor(userId, serverId, params = {}) {
		this.userId = userId;
		this.serverId = serverId;
		this.params = params;
	}

	makeBox(context, logId = 0) {
		return boxHelper.makeBox(context, logId, this.serverId, this.userId);
	}
}

module.exports = ItemClaim;