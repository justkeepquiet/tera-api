"use strict";

/**
 * @typedef {import("@maxmind/geoip2-node").ReaderModel} ReaderModel
 * @typedef {import("../lib/ipApiClient")} IpApiClient
 * @typedef {import("../../config/slsOverride.default")} servers
 */

const { Netmask } = require("netmask");
const { Resolver } = require("dns").promises;

class SlsOverrideHandler {
	/**
	 * @param {servers} servers
	 * @param {string} ip
	 * @param {ReaderModel} geoip
	 * @param {IpApiClient} ipapi
	 * @param {console} logger
	 */
	constructor(servers, clientIp, geoip, ipapi, logger) {
		this.servers = servers;
		this.clientIp = clientIp;
		this.geoip = geoip;
		this.ipapi = ipapi;
		this.logger = logger;
	}

	async applyOverrides(server) {
		if (!this.servers) {
			this.logger.warn("SLS Override Handler: Configuration not found.");
			return false;
		}

		for (const overrideServer of this.servers) {
			if (!overrideServer.enabled || overrideServer.serverId !== server.id) continue;

			for (const rule of overrideServer.rules) {
				try {
					switch (rule.method) {
						case "geoip":
							this.applyGeoipRule(rule, server);
							break;

						case "ipapi":
							await this.applyIpapiRule(rule, server);
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
		if (!this.geoip) {
			this.logger.error("SLS Override Handler: GeoIP reader not initialized. Method 'geoip' was skipped.");
			return;
		}

		for (const param of rule.params) {
			if (typeof param === "function") {
				const result = param.call(null, this.geoip, this.clientIp);

				if (result) {
					this.updateServerWithRule(server, rule);
				}
			}
		}
	}

	async applyIpapiRule(rule, server) {
		if (!this.ipapi) {
			this.logger.error("SLS Override Handler: IpApi client not initialized. Method 'ipapi' was skipped.");
			return;
		}

		for (const param of rule.params) {
			if (typeof param === "function") {
				try {
					const response = await this.ipapi.request(this.clientIp);
					const result = param.call(null, response);

					if (result) {
						this.updateServerWithRule(server, rule);
					}
				} catch (err) {
					this.logger.error(err.toString());
				}
			}
		}
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