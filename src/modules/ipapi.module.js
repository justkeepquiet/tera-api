"use strict";

/**
 * @typedef {IpApiClient} ipapi
 * @typedef {import("../app").modules} modules
 */

const env = require("../utils/env");
const IpApiClient = require("../lib/ipApiClient");

/**
 * @param {modules} modules
 */
module.exports = async () => new IpApiClient(
	env.array("IPAPI_API_KEYS", []),
	env.number("IPAPI_CACHE_TTL", 86400), // 24 hours
	env.number("IPAPI_REQUEST_TIMEOUT", 3),
	env.number("IPAPI_REQUEST_MAX_RETRIES", 3)
);