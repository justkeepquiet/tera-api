"use strict";

/**
 * @typedef {import("@maxmind/geoip2-node").ReaderModel} geoip
 * @typedef {import("../app").modules} modules
 */

const fs = require("fs");
const path = require("path");
const geoip = require("@maxmind/geoip2-node");

const { createLogger } = require("../utils/logger");
const downloadFile = require("../utils/downloadFile");

/**
 * @param {modules} modules
 */
module.exports = async (modules, firstRun = true) => {
	const fileName = "GeoLite2-City.mmdb";
	const filePath = path.join(__dirname, "../../data/geoip", fileName);

	const geoipLogger = createLogger("GeoIP", { colors: { debug: "gray" } });
	const geoipConfig = modules.config.get("geoip");
	const { enabled, autoUpdateEnabled, url, connectTimeout, responseTimeout, auth } = geoipConfig.autoDownload;

	if (firstRun) {
		if (enabled && autoUpdateEnabled) {
			geoipLogger.info("Automatic database updates is enabled.");
		} else {
			geoipLogger.info("Automatic database updates is disabled.");
		}
	}

	let updated = false;

	if (enabled && (!firstRun || !fs.existsSync(filePath))) {
		geoipLogger.info(`Download database process started for file: ${filePath}`);
		geoipLogger.debug(`URL used as download source: ${url}`);

		try {
			await downloadFile(url, filePath, connectTimeout ?? 5000, responseTimeout ?? 10000, auth);
			geoipLogger.info("Download database process done.");

			updated = true;
		} catch (err) {
			geoipLogger.warn(`Download database process error: ${err}`);
		}
	} else {
		updated = true;
	}

	if (updated) {
		if (fs.existsSync(filePath)) {
			const geoIpData = fs.readFileSync(filePath);
			const reader = geoip.Reader.openBuffer(geoIpData);

			geoipLogger.info(`Database file ${fileName} found and loaded.`);
			return reader;
		} else {
			geoipLogger.info(`Database file ${fileName} is not found. Skip GeoIP loading.`);
		}
	}
};