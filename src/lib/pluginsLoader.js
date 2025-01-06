"use strict";

const fs = require("fs");
const path = require("path");
const dotenv = require("dotenv");

const PLUGINS_PATH = "../plugins";

function getObjectByPathString(object, pathString) {
	const keys = pathString.split(".");
	let current = object;

	for (const key of keys) {
		if (current[key] !== undefined) {
			current = current[key];
		} else {
			return undefined;
		}
	}

	return current;
}

class PluginsLoader {
	constructor(logger = null) {
		this.logger = logger;

		this.plugins = new Map();
	}

	list() {
		const pluginsPath = path.join(__dirname, PLUGINS_PATH);

		if (fs.existsSync(pluginsPath)) {
			return fs.readdirSync(pluginsPath);
		}

		return [];
	}

	register(plugin) {
		const pluginPath = path.join(__dirname, PLUGINS_PATH, plugin, "plugin.js");
		const envPath = path.join(__dirname, PLUGINS_PATH, plugin, ".env");

		if (fs.existsSync(pluginPath)) {
			if (fs.existsSync(envPath)) {
				dotenv.config({ path: envPath });
			}

			this.plugins.set(plugin, require(pluginPath));

			this.logger.info(`Plugin registered: ${plugin}`);
		} else {
			this.logger.warn(`Plugin is not found: ${plugin}`);
		}
	}

	async loadComponent(component, ...args) {
		const results = new Map();

		for (const [plugin, pluginObject] of this.plugins) {
			const componentObject = getObjectByPathString(pluginObject, component);

			if (componentObject !== undefined) {
				if (typeof componentObject === "function") {
					const componentResult = await componentObject.call(null, ...args);

					results.set(plugin, componentResult);
				} else {
					results.set(plugin, componentObject);
				}

				this.logger.debug(`Loaded: plugin: ${plugin}, component: ${component}`);
			}
		}
	}
}

module.exports = PluginsLoader;