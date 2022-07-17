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
		this.modules.logger.debug(`ServerUpActions: Running, server ${serverId}`);

		let status = null;
		let method = null;

		if (/^true$/i.test(process.env.FCGI_GW_WEBAPI_ENABLE)) {
			method = "FCGI.stat";

			try {
				const stat = await this.modules.fcgi.stat();

				if (stat.servers) {
					status = stat.servers[serverId] !== undefined;
				}
			} catch (err) {
				this.modules.logger.warn(err);
			}
		}

		if (status !== true) {
			method = "isPortReachable";

			status = await isPortReachable(loginPort, {
				host: loginIp,
				timeout: 5000
			});
		}

		this.modules.logger.debug(`ServerUpActions: Result, server ${serverId}, method ${method}`);

		if (status === true) {
			try {
				await this.modules.serverModel.info.update({ isAvailable: 1 }, {
					where: { serverId }
				});

				this.modules.logger.info(`ServerUpActions: Set available, server ${serverId}, method ${method}`);
			} catch (err) {
				this.modules.logger.error(err);
			}
		}
	}
}

module.exports = ServerUpActions;