"use strict";

/**
 * @typedef {import("../app").modules} modules
 */

const isPortReachable = require("../utils/isPortReachable");

class ServerUpActions {
	/**
	 * @param {modules} modules
	 */
	constructor(modules) {
		this.modules = modules;
	}

	async set(serverId, loginIp, loginPort) {
		const portStatus = await isPortReachable(loginPort, {
			host: loginIp,
			timeout: 5000
		});

		if (portStatus === true) {
			this.modules.accountModel.serverInfo.update({ isAvailable: 1 }, {
				where: { serverId }
			}).then(() =>
				this.modules.logger.info(`ServerUpActions: Set isAvailable=1 for server ID: ${serverId}`)
			).catch(err =>
				this.modules.logger.error(err)
			);
		}
	}
}

module.exports = ServerUpActions;