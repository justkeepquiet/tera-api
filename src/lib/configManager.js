"use strict";

const fs = require("fs");
const path = require("path");
const { requireReload } = require("../utils/helpers");

const CONFIG_PATH = "../../config";

function requireConfig(withReload, filePath) {
	return withReload ? requireReload(filePath) : require(filePath);
}

class ConfigManager {
	constructor(logger = null) {
		this.logger = logger;
	}

	get(name, withReload = true) {
		const filePath = path.join(__dirname, CONFIG_PATH, `${name}.js`);
		const defaultFilePath = path.join(__dirname, CONFIG_PATH, `${name}.default.js`);

		if (fs.existsSync(filePath)) {
			return requireConfig(withReload, filePath);
		}

		if (fs.existsSync(defaultFilePath)) {
			return requireConfig(withReload, defaultFilePath);
		}

		if (this.logger) {
			this.logger.debug(`Cannot find config file: ${name}.js`);
		}

		return null;
	}
}

module.exports = ConfigManager;