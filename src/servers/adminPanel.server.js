"use strict";

/**
 * @typedef {import("../app").modules} modules
 */

const path = require("path");

const env = require("../utils/env");
const { createLogger } = require("../utils/logger");
const { expr } = require("../lib/scheduler");
const ExpressServer = require("../lib/expressServer");
const TasksActions = require("../actions/tasks.actions");

/**
 * @param {modules} modules
 */
module.exports = async modules => {
	if (!modules.checkComponent("admin_panel")) return;

	const tasksActions = new TasksActions(modules);

	if (!env.number("ADMIN_PANEL_LISTEN_PORT")) {
		throw "Invalid configuration parameter: ADMIN_PANEL_LISTEN_PORT";
	}

	if (!env.string("ADMIN_PANEL_LOCALE")) {
		throw "Invalid configuration parameter: ADMIN_PANEL_LOCALE";
	}

	const es = new ExpressServer(modules, {
		logger: createLogger("Admin Panel", { colors: { debug: "dim blue" } }),
		viewsPath: path.resolve(__dirname, "../views"),
		compressionEnabled: true,
		cacheEnabled: true,
		trustProxyEnabled: env.bool("ADMIN_PANEL_TRUSTPROXY_ENABLE"),
		trustProxyHosts: env.array("ADMIN_PANEL_TRUSTPROXY_HOSTS", []),
		logLevel: env.string("LOG_LEVEL"),
		logRequestsEnabled: env.bool("LOG_API_REQUESTS"),
		logIpAddresses: env.bool("LOG_IP_ADDRESSES")
	});

	es.setStatic("/static/images/tera-icons", "data/tera-icons");
	es.setStatic("/static/images/shop-slides-bg", "data/shop-slides-bg");
	es.setStatic("/static", "src/static/admin");
	await modules.pluginsLoader.loadComponent("static.adminPanel", es);

	es.setLogging();

	await modules.pluginsLoader.loadComponent("routers.adminPanel.before", es);
	await es.setRouter("../routes/admin.index");
	await modules.pluginsLoader.loadComponent("routers.adminPanel.after", es);

	await es.bind(
		env.string("ADMIN_PANEL_LISTEN_HOST"),
		env.number("ADMIN_PANEL_LISTEN_PORT")
	);

	modules.queue.setModel(modules.queueModel.tasks);
	modules.queue.setLogsModel(modules.reportModel.queueTasks);
	modules.queue.setHandlers(tasksActions);

	modules.scheduler.start({
		name: "backgroundQueue",
		schedule: expr.EVERY_MINUTE
	}, () =>
		modules.queue.start().catch(err => modules.queue.logger.error(err))
	);
};