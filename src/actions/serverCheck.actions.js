"use strict";

/**
 * @typedef {import("../app").modules} modules
 */

const isPortReachable = require("../utils/isPortReachable");

class ServerCheckActions {
	/**
	 * @param {modules} modules
	 */
	constructor(modules) {
		this.modules = modules;
	}

	async all(allowPortCheck = false) {
		let stat = null;

		try {
			stat = await this.modules.hub.getServerStat();
		} catch (err) {
			this.modules.logger.warn(`ServerCheckActions: ${err}`);
		}

		return this.modules.serverModel.info.findAll({
			attributes: ["serverId", "loginIp", "loginPort", "isAvailable"]
		}).then(servers =>
			servers.forEach(server => {
				const promise = new Promise((resolve, reject) => {
					if (stat?.serverList && stat.serverList.find(s => s.serverId == server.get("serverId")) !== undefined) {
						return resolve({ method: "Hub", isAvailable: true });
					}

					if (allowPortCheck) {
						return isPortReachable(server.get("loginPort"), { host: server.get("loginIp"), timeout: 5000 }).then(isAvailable =>
							resolve({ method: `Port (${server.get("loginPort")})`, isAvailable })
						).catch(err =>
							reject(err)
						);
					}

					return resolve({ method: "Hub", isAvailable: false });
				});

				promise.then(async ({ method, isAvailable }) => {
					if (isAvailable === !!server.get("isAvailable")) {
						return Promise.resolve();
					}

					await this.modules.serverModel.info.update({ isAvailable }, {
						where: { serverId: server.get("serverId") }
					});

					return this.modules.logger.info(`ServerCheckActions: method: ${method}, available: ${isAvailable}, server: ${server.get("serverId")}`);
				}).catch(err =>
					this.modules.logger.error(err)
				);
			})
		);
	}
}

module.exports = ServerCheckActions;