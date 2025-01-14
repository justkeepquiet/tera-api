"use strict";

/**
 * @typedef {import("@maxmind/geoip2-node").ReaderModel} geoip
 * @typedef {import("../app").modules} modules
 */

const fs = require("fs");
const path = require("path");
const geoip = require("@maxmind/geoip2-node");

const { createLogger } = require("../utils/logger");

/**
 * @param {modules} modules
 */
module.exports = async () => {
	const geoipLogger = createLogger("GeoIP", { colors: { debug: "gray" } });
	const filePath = path.join(__dirname, "../../data/geoip/GeoLite2-City.mmdb");

	if (fs.existsSync(filePath)) {
		const geoIpData = fs.readFileSync(filePath);
		const reader = geoip.Reader.openBuffer(geoIpData);

		geoipLogger.info(`Loaded: ${filePath}`);
		return reader;
	} else {
		geoipLogger.debug(`File ${filePath} is not found. Skip loading.`);
	}
};