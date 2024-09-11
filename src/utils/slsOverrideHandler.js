"use strict";

/**
 * @typedef {import("@maxmind/geoip2-node").ReaderModel} ReaderModel
 * @typedef {import("../../config/slsOverride")} servers
 */

const { Netmask } = require("netmask");
const { Resolver } = require("dns").promises;

class SlsOverrideHandler {
	/**
	 * @param {servers} servers
	 * @param {string} ip
	 * @param {ReaderModel} reader
	 * @param {console} logger
	 */
	constructor(servers, clientIp, reader, logger) {
		this.servers = servers;
		this.clientIp = clientIp;
		this.reader = reader;
		this.logger = logger;
	}

	async applyOverrides(server) {
		for (const overrideServer of this.servers) {
			if (overrideServer.serverId !== server.id) continue;

			for (const rule of overrideServer.rules) {
				try {
					switch (rule.method) {
						case "geoip":
							this.applyGeoipRule(rule, server);
							break;

						case "cidr":
							this.applyCidrRule(rule, server);
							break;

						case "domain":
							await this.applyDomainRule(rule, server);
							break;
					}
				} catch (err) {
					this.logger.warn("SLS Override Handler:", err);
				}
			}
		}
	}

	applyGeoipRule(rule, server) {
		if (!this.reader) {
			this.logger.error("SLS Override Handler: GeoIP reader not initialized. Method 'geoip' was skipped.");
			return;
		}

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

	async applyDomainRule(rule, server) {
		const { domain, dnsServers } = rule.params;

		if (!domain || !dnsServers || !Array.isArray(dnsServers) || dnsServers.length === 0) {
			this.logger.error("SLS Override Handler: For the 'domain' method, 'domain' and 'dnsServers' must be specified.");
			return;
		}

		for (const dnsServer of dnsServers) {
			try {
				const resolver = new Resolver();
				resolver.setServers([dnsServer]);
				const addresses = await resolver.resolve4(domain);

				if (addresses.length > 0) {
					rule.serverIp = addresses[0];
					this.updateServerWithRule(server, rule);
					return;
				}
			} catch (err) {
				this.logger.warn("SLS Override Handler:", err);
			}
		}

		this.logger.error(`SLS Override Handler: Unable to resolve domain ${domain} from any DNS servers.`);
	}

	updateServerWithRule(server, rule) {
		if (rule.serverIp) {
			this.logger.debug(`SLS Override Handler: Override IP with ${rule.serverIp} by method: ${rule.method}`);
			server.ip = rule.serverIp;
		}

		if (rule.serverPort) {
			this.logger.debug(`SLS Override Handler: Override Port with ${rule.serverPort} by method: ${rule.method}`);
			server.port = rule.serverPort;
		}

		if (rule.nameSuffix) {
			this.logger.debug(`SLS Override Handler: Add name suffix as ${rule.nameSuffix} by method: ${rule.method}`);
			server.name += ` ${rule.nameSuffix}`;
		}
	}
}

module.exports = SlsOverrideHandler;