"use strict";

/**
 * @typedef {import("../utils/logger")} logger
 */

const { RateLimiterMemory } = require("rate-limiter-flexible");

class RateLimitter {
	/**
	 * @param {logger} logger
	 */
	constructor(config, logger = null) {
		this.config = config;
		this.logger = logger;

		/**
		 * @type {Map<string, RateLimiterMemory>}
		 */
		this.instances = new Map();
	}

	async consume(endpoint, key, points = 1, options = {}) {
		const instance = this.getInstance(endpoint);

		try {
			const res = await instance.consume(key, points, options);
			this.logger.debug(`${endpoint}: Key: ${key}, Remaining: ${res.remainingPoints}, Consumed: ${res.consumedPoints}`);

			return true;
		} catch (res) {
			this.logger.warn(`${endpoint}: Too many requests! Key: ${key}, Consumed: ${res.consumedPoints}`);
		}

		return false;
	}

	async delete(endpoint, key, options = {}) {
		return await this.getInstance(endpoint).delete(key, options);
	}

	/**
	 * @return {RateLimiterMemory}
	 */
	getInstance(endpoint) {
		if (this.instances.has(endpoint)) {
			return this.instances.get(endpoint);
		}

		const config = this.getConfig(endpoint);

		if (config === undefined) {
			throw new Error(`Specified config section is not found: ${endpoint}`);
		}

		const instance = new RateLimiterMemory(config);
		this.instances.set(endpoint, instance);

		return instance;
	}

	removeInstance(endpoint) {
		return this.instances.delete(endpoint);
	}

	getConfig(endpoint) {
		const keys = endpoint.split(".");
		let current = this.config;

		for (const key of keys) {
			if (current[key] !== undefined) {
				current = current[key];
			} else {
				return undefined;
			}
		}

		return current;
	}
}

module.exports = RateLimitter;