"use strict";

/**
 * @typedef {import("../app").modules} modules
 */
const path = require("path");

const env = require("../utils/env");
const { createLogger } = require("../utils/logger");
const ExpressServer = require("../lib/expressServer");

/**
 * @param {modules} modules
 */
module.exports = async modules => {
	if (!modules.checkComponent("portal_api")) return;

	if (!env.number("API_PORTAL_LISTEN_PORT")) {
		throw "Invalid configuration parameter: API_PORTAL_LISTEN_PORT";
	}

	if (!env.string("API_PORTAL_LOCALE")) {
		throw "Invalid configuration parameter: API_PORTAL_LOCALE";
	}

	if (!env.string("API_PORTAL_CLIENT_DEFAULT_REGION")) {
		throw "Invalid configuration parameter: API_PORTAL_CLIENT_DEFAULT_REGION";
	}

	const es = new ExpressServer(modules, {
		logger: createLogger("Portal API", { colors: { debug: "blue" } }),
		viewsPath: path.resolve(__dirname, "../views"),
		compressionEnabled: false,
		cacheEnabled: env.bool("API_PORTAL_ENABLE_CACHE"),
		trustProxyEnabled: env.bool("API_PORTAL_TRUSTPROXY_ENABLE"),
		trustProxyHosts: env.array("API_PORTAL_TRUSTPROXY_HOSTS", []),
		logLevel: env.string("LOG_LEVEL"),
		logRequestsEnabled: env.bool("LOG_API_REQUESTS"),
		logIpAddressesEnabled: env.bool("LOG_IP_ADDRESSES")
	});

	if (env.bool("API_PORTAL_PUBLIC_FOLDER_ENABLE")) {
		es.setStatic("/public/shop/images/tera-icons", "data/tera-icons");
		es.setStatic("/public/shop/images/shop-slides-bg", "data/shop-slides-bg");
		es.setStatic("/public", "public");
		await modules.pluginsLoader.loadComponent("static.portalApi", es);
	}

	es.setLogging();

	await modules.pluginsLoader.loadComponent("routers.portalApi.before", es);
	await es.setRouter("../routes/portal.index");
	await modules.pluginsLoader.loadComponent("routers.portalApi.after", es);

	await es.bind(
		env.string("API_PORTAL_LISTEN_HOST"),
		env.number("API_PORTAL_LISTEN_PORT")
	);

	const geoipConfig = modules.config.get("geoip");

	if (!geoipConfig) {
		modules.logger.warn("Cannot read configuration: geoip");
	} else if (geoipConfig.autoDownload?.enabled && geoipConfig.autoDownload?.autoUpdateEnabled) {
		modules.scheduler.start({
			name: "updateAndLoadGeoip",
			schedule: geoipConfig.autoDownload.autoUpdateSchedule
		}, async () => {
			modules.geoip = await require("../modules/geoip.module")(modules, false);
		});
	}
};