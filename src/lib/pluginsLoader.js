"use strict";

/**
 * @typedef {import("../app").modules} modules
 * @typedef {import("../utils/logger")} logger
 */

const fs = require("fs");
const path = require("path");
const dotenv = require("dotenv");

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
	/**
	 * @param {modules} modules
	 * @param {logger} logger
	 */
	constructor(pluginsPath, modules, logger = null) {
		this.pluginsPath = pluginsPath;
		this.modules = modules;
		this.logger = logger;

		this.plugins = new Map();
	}

	list() {
		if (fs.existsSync(this.pluginsPath)) {
			return fs.readdirSync(this.pluginsPath);
		}

		return [];
	}

	loadAll() {
		this.list().forEach(plugin => this.register(plugin));
	}

	register(plugin) {
		const pluginPath = path.join(this.pluginsPath, plugin, "plugin.js");
		const envPath = path.join(this.pluginsPath, plugin, ".env");

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
					const componentResult = await componentObject.call(null, ...args, this.modules);

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