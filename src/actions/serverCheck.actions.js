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

	async all() {
		let stat = null;

		try {
			stat = await this.modules.hub.getServerStat();
		} catch (err) {
			this.modules.logger.warn(`ServerCheckActions: ${err}`);
		}

		return this.modules.serverModel.info.findAll().then(servers =>
			servers.forEach(server => {
				const promise = new Promise((resolve, reject) => {
					if (stat !== null && stat.serverList) {
						resolve({
							method: "Hub",
							isAvailable: stat.serverList.find(s => s.serverId == server.get("serverId")) !== undefined
						});
					} else {
						isPortReachable(server.get("loginPort"), {
							host: server.get("loginIp"),
							timeout: 5000
						}).then(isAvailable =>
							resolve({
								method: "isPortReachable",
								isAvailable
							})
						).catch(err =>
							reject(err)
						);
					}
				});

				promise.then(result => {
					if (result.isAvailable === !!server.get("isAvailable")) {
						return Promise.resolve();
					}

					return this.modules.serverModel.info.update({
						isAvailable: result.isAvailable
					}, {
						where: { serverId: server.get("serverId") }
					}).then(() =>
						this.modules.logger.info(`ServerCheckActions: Set ${result.isAvailable}, server ${server.get("serverId")}, method ${result.method}`)
					);
				}).catch(err =>
					this.modules.logger.error(err)
				);
			})
		);
	}
}

module.exports = ServerCheckActions;