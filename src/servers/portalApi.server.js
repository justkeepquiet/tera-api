"use strict";

/**
 * @typedef {import("../app").modules} modules
 */

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
		disableCache: env.bool("API_PORTAL_ENABLE_CACHE")
	});

	if (env.bool("API_PORTAL_PUBLIC_FOLDER_ENABLE")) {
		es.setStatic("/public/shop/images/tera-icons", "data/tera-icons");
		es.setStatic("/public", "public");
		modules.pluginsLoader.loadComponent("static.portalApi", es);
	}

	es.setLogging();

	modules.pluginsLoader.loadComponent("routers.portalApi.before", es);
	es.setRouter("../routes/portal.index");
	modules.pluginsLoader.loadComponent("routers.portalApi.after", es);

	await es.bind(
		env.string("API_PORTAL_LISTEN_HOST"),
		env.number("API_PORTAL_LISTEN_PORT")
	);
};