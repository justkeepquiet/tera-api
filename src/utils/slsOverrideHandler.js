"use strict";

/**
 * @typedef {import("@maxmind/geoip2-node").ReaderModel} ReaderModel
 * @typedef {import("../../config/slsOverride")} servers
 */

const { Netmask } = require("netmask");

class SlsOverrideHandler {
	/**
	 * @param {servers} servers
	 * @param {string} ip
	 * @param {ReaderModel} reader
	 */
	constructor(servers, clientIp, reader) {
		this.servers = servers;
		this.clientIp = clientIp;
		this.reader = reader;
	}

	applyOverrides(server) {
		this.servers.forEach(overrideServer => {
			if (overrideServer.serverId !== server.id) return;

			overrideServer.rules.forEach(rule => {
				switch (rule.method) {
					case "geoip":
						this.applyGeoipRule(rule, server);
						break;
					case "cidr":
						this.applyCidrRule(rule, server);
						break;
				}
			});
		});
	}

	applyGeoipRule(rule, server) {
		if (!this.reader) return;

		rule.params.forEach(param => {
			if (typeof param === "function") {
				const result = param.call(null, this.reader, this.clientIp);

				if (result) {
					this.updateServerWithRule(server, rule);
				}
			}
		});
	}

	applyCidrRule(rule, server) {
		rule.params.forEach(cidrRange => {
			const block = new Netmask(cidrRange);
			const isIpInRange = block.contains(this.clientIp);

			if (isIpInRange) {
				this.updateServerWithRule(server, rule);
			}
		});
	}

	updateServerWithRule(server, rule) {
		if (rule.serverIp) {
			server.ip = rule.serverIp;
		}

		if (rule.serverPort) {
			server.port = rule.serverPort;
		}

		if (rule.nameSuffix) {
			server.name += ` ${rule.nameSuffix}`;
		}
	}
}

module.exports = SlsOverrideHandler;