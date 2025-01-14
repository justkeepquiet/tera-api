"use strict";

/**
 * @typedef {import("@maxmind/geoip2-node").ReaderModel} ReaderModel
 * @typedef {import("../lib/ipApiClient")} IpApiClient
 * @typedef {import("../../config/ipBlock.default")} config
 */

const { Netmask } = require("netmask");

class IpBlockHandler {
	/**
	 * @param {ReaderModel} geoip
	 * @param {IpApiClient} ipapi
	 * @param {console} logger
	 */
	constructor(geoip, ipapi, logger) {
		this.geoip = geoip;
		this.ipapi = ipapi;
		this.logger = logger;
	}

	async applyBlock(clientIp, endpoint, configs) {
		if (!configs) {
			this.logger.warn("IP Block Handler: Configuration not found.");
			return false;
		}

		for (const config of configs) {
			if (!config.enabled || !config.endpoints.some(el => endpoint.startsWith(el))) {
				continue;
			}

			for (const rule of config.rules) {
				let blocked = false;

				try {
					switch (rule.method) {
						case "geoip":
							blocked = this.applyGeoipRule(rule, clientIp);
							break;

						case "ipapi":
							blocked = await this.applyIpapiRule(rule, clientIp);
							break;

						case "cidr":
							blocked = this.applyCidrRule(rule, clientIp);
							break;
					}
				} catch (err) {
					this.logger.warn("IP Block Handler:", err);
				}

				if (blocked) {
					return blocked;
				}
			}
		}

		return false;
	}

	applyGeoipRule(rule, clientIp) {
		if (!this.geoip) {
			this.logger.error("IP Block Handler: GeoIP reader not initialized. Method 'geoip' was skipped.");
			return false;
		}

		for (const param of rule.params) {
			if (typeof param === "function") {
				const result = param.call(null, this.geoip, clientIp);

				if (result) {
					this.logger.warn(`IP Block Handler: Blocked IP: ${clientIp}, method: ${rule.method}`);
					return true;
				}
			}
		}

		return false;
	}

	async applyIpapiRule(rule, clientIp) {
		if (!this.ipapi) {
			this.logger.error("IP Block Handler: IpApi client not initialized. Method 'ipapi' was skipped.");
			return false;
		}

		for (const param of rule.params) {
			if (typeof param === "function") {
				try {
					const response = await this.ipapi.request(clientIp);
					const result = param.call(null, response);

					if (result) {
						this.logger.warn(`IP Block Handler: Blocked IP: ${clientIp}, method: ${rule.method}`);
						return true;
					}
				} catch (err) {
					this.logger.error(err.toString());
				}
			}
		}

		return false;
	}

	applyCidrRule(rule, clientIp) {
		for (const cidrRange of rule.params) {
			const block = new Netmask(cidrRange);
			const isIpInRange = block.contains(clientIp);

			if (isIpInRange) {
				this.logger.warn(`IP Block Handler: Blocked IP: ${clientIp}, method: ${rule.method}`);
				return true;
			}
		}

		return false;
	}
}

module.exports = IpBlockHandler;