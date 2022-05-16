"use strict";

const isPortReachable = require("../utils/isPortReachable");
const logger = require("../utils/logger");
const accountModel = require("../models/account.model");

class ServerUpActions {
	async set(serverId, loginIp, loginPort) {
		const portStatus = await isPortReachable(loginPort, {
			host: loginIp,
			timeout: 5000
		});

		if (portStatus === true) {
			accountModel.serverInfo.update({ isAvailable: 1 }, {
				where: { serverId: serverId }
			}).catch(err =>
				logger.error(err.toString())
			);
		}
	}
}

module.exports = ServerUpActions;