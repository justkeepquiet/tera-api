"use strict";

const fs = require("fs");
const path = require("path");

function requireConfig(withReload, filePath) {
	if (withReload) {
		delete require.cache[require.resolve(filePath)];
	}
	return require(filePath);
}

class ConfigManager {
	constructor(configPath, logger = null) {
		this.configPath = configPath;
		this.logger = logger;
	}

	get(name, withReload = true) {
		const filePath = path.join(this.configPath, `${name}.js`);
		const defaultFilePath = path.join(this.configPath, `${name}.default.js`);

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