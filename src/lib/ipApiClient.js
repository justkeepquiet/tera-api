"use strict";

/**
 * @typedef {import("./IpApiClientResponse").IpApiClientResponse} IpApiClientResponse
 */

const https = require("https");

class IpApiClient {
	constructor(apiKeys = [], cacheTimeoutSeconds = 60, requestTimeoutSeconds = 5, maxRetries = 3) {
		this.apiKeys = apiKeys;
		this.cacheTimeout = cacheTimeoutSeconds * 1000;
		this.requestTimeout = requestTimeoutSeconds * 1000;
		this.maxRetries = maxRetries;
		this.cache = new Map();
	}

	/**
	 * @param {string} ip
	 * @return {Promise<IpApiClientResponse>}
	 */
	async request(ip) {
		if (this.cache.has(ip)) {
			const cachedData = this.cache.get(ip);
			if (Date.now() - cachedData.timestamp < this.cacheTimeout) {
				return cachedData.data;
			} else {
				this.cache.delete(ip);
			}
		}

		let attempts = 0;
		while (attempts < this.maxRetries) {
			try {
				const data = await this.makeRequest(ip);
				this.cache.set(ip, { data, timestamp: Date.now() });
				return data;
			} catch (_) {
				attempts++;
				if (attempts >= this.maxRetries) {
					throw new Error(`Failed to fetch IP info after ${this.maxRetries} attempts`);
				}
			}
		}
	}

	/**
	 * @return {string}
	 */
	getRandomApiKey() {
		if (this.apiKeys.length === 0) {
			return null;
		}
		const randomIndex = Math.floor(Math.random() * this.apiKeys.length);
		return this.apiKeys[randomIndex];
	}

	/**
	 * @param {string} ip
	 * @return {Promise<IpApiClientResponse>}
	 */
	makeRequest(ip) {
		return new Promise((resolve, reject) => {
			const apiKey = this.getRandomApiKey();
			const path = apiKey ? `/?q=${ip}&key=${apiKey}` : `/?q=${ip}`;

			const options = {
				hostname: "api.ipapi.is",
				port: 443,
				path: path,
				method: "GET",
				headers: {
					"Content-Type": "application/json"
				},
				timeout: this.requestTimeout
			};

			const req = https.request(options, res => {
				let responseData = "";

				res.on("data", chunk => {
					responseData += chunk;
				});

				res.on("end", () => {
					try {
						const parsed = JSON.parse(responseData);
						if (parsed) {
							return resolve(parsed);
						}
					} catch (_) {
						return reject(new Error("Failed to parse response"));
					}
				});
			});

			req.on("error", () => reject(new Error("Request error")));

			req.on("timeout", () => {
				req.destroy();
				return reject(new Error("Request timed out"));
			});

			req.end();
		});
	}
}

module.exports = IpApiClient;