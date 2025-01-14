"use strict";

const DB_VERSION = 3;
const APP_VERSION = process.env.npm_package_version || require("../package.json").version;

/**
 * @typedef {object} modules
 * @property {versions} versions
 * @property {logger} logger
 * @property {ConfigManager} config
 * @property {cliHelper} cli
 * @property {gcCollect} gcCollect
 * @property {checkComponent} checkComponent
 * @property {PluginsLoader} pluginsLoader
 * @property {LocalizationManager} localization
 * @property {Scheduler} scheduler
 * @property {RateLimitter} rateLimitter
 * @property {BackgroundQueue} queue
 * @property {import("./modules/datasheetModel.module").datasheetModel} datasheetModel
 * @property {import("./modules/sequelize.module").Sequelize} sequelize
 * @property {import("./modules/sequelize.module").queueModel} queueModel
 * @property {import("./modules/sequelize.module").accountModel} accountModel
 * @property {import("./modules/sequelize.module").serverModel} serverModel
 * @property {import("./modules/sequelize.module").reportModel} reportModel
 * @property {import("./modules/sequelize.module").shopModel} shopModel
 * @property {import("./modules/sequelize.module").boxModel} boxModel
 * @property {import("./modules/planetDbs.module").planetDbs} planetDbs
 * @property {import("./modules/hub.module").hub} hub
 * @property {import("./modules/steer.module").steer} steer
 * @property {import("./modules/geoip.module").geoip} geoip
 * @property {import("./modules/ipapi.module").ipapi} ipapi
 * @property {import("./modules/mailer.module").mailer} mailer
 * @property {import("./lib/expressServer").app} app
 * @property {import("i18n")?} i18n
 */

require("dotenv").config();

const path = require("path");

const { createLogger } = require("./utils/logger");
const cliHelper = require("./utils/cliHelper");
const LocalizationManager = require("./lib/localizationManager");
const ConfigManager = require("./lib/configManager");
const PluginsLoader = require("./lib/pluginsLoader");
const { Scheduler, expr } = require("./lib/scheduler");
const RateLimitter = require("./lib/rateLimitter");
const BackgroundQueue = require("./lib/backgroundQueue");

const loggerParams = { colors: { debug: "gray" } };
const logger = createLogger("Core", loggerParams);
const versions = { app: APP_VERSION, db: DB_VERSION };

const config = new ConfigManager(
	path.join(__dirname, "../config"),
	createLogger("Config Manager", loggerParams)
);

const cli = cliHelper(logger, versions.app);
cli.addOption("-c, --component <items...>", "List of components");
const cliOptions = cli.getOptions();

async function loadModules() {
	const modules = { versions, logger, config, cli, gcCollect, checkComponent };

	modules.pluginsLoader = new PluginsLoader(
		path.join(__dirname, "./plugins"),
		modules,
		createLogger("Plugins Loader", loggerParams)
	);

	modules.pluginsLoader.loadAll();

	const localizationConfig = modules.config.get("localization");

	if (!localizationConfig) {
		throw "Cannot read configuration: localization";
	}

	modules.localization = new LocalizationManager(localizationConfig);
	modules.scheduler = new Scheduler(createLogger("Scheduler", loggerParams));

	const rateLimitsConfig = config.get("rateLimits");

	if (!rateLimitsConfig) {
		throw "Cannot read configuration: rateLimits";
	}

	modules.rateLimitter = new RateLimitter(
		rateLimitsConfig,
		createLogger("Rate Limitter", loggerParams)
	);

	modules.queue = new BackgroundQueue({
		concurrent: 5,
		logger: createLogger("Background Queue")
	});

	modules.pluginsLoader.loadComponent("app.moduleLoader.before");

	modules.datasheetModel = await require("./modules/datasheetModel.module")(modules);
	modules.sequelize = await require("./modules/sequelize.module")(modules);
	modules.planetDbs = await require("./modules/planetDbs.module")(modules);
	modules.hub = await require("./modules/hub.module")(modules);
	modules.steer = await require("./modules/steer.module")(modules);
	modules.geoip = await require("./modules/geoip.module")(modules);
	modules.ipapi = await require("./modules/ipapi.module")(modules);
	modules.mailer = await require("./modules/mailer.module")(modules);

	modules.pluginsLoader.loadComponent("app.moduleLoader.after");

	return modules;
}

/**
 * @param {modules} modules
 */
async function startServers(modules) {
	modules.pluginsLoader.loadComponent("app.startServers.before", modules);

	await require("./servers/arbiterApi.server")(modules);
	await require("./servers/portalApi.server")(modules);
	await require("./servers/gatewayApi.server")(modules);
	await require("./servers/adminPanel.server")(modules);

	modules.pluginsLoader.loadComponent("app.startServers.after", modules);
	modules.logger.info(`Served components: ${cliOptions.component || "all"}`);

	if (global.gc) {
		modules.scheduler.start({
			name: "gcWorks",
			schedule: expr.EVERY_FIVE_MINUTES
		}, gcCollect);

		gcCollect();
	}

	modules.scheduler.start({
		name: "printMemoryUsage",
		schedule: expr.EVERY_THIRTY_MINUTES
	}, () =>
		modules.cli.printMemoryUsage()
	);

	modules.cli.printInfo();
	modules.cli.printMemoryUsage();
	modules.cli.printReady();
}

function gcCollect() {
	if (!global.gc) return;

	const getRss = () => `${Math.round(process.memoryUsage().rss / 1024 / 1024 * 100) / 100} MB`;
	const oldRss = getRss();

	global.gc();
	logger.debug(`GC collected: rss old: ${oldRss}, rss new: ${getRss()}`);
}

function checkComponent(name) {
	return !cliOptions.component || cliOptions.component.includes(name);
}

loadModules().then(startServers).catch(err => {
	if (err) {
		logger.error(err);
	}

	cli.printEnded();
	process.exit();
});