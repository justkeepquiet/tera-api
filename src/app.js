"use strict";

/**
 * @typedef {object} modules
 * @property {PlatformFunctions} platform
 * @property {SteerFunctions} steer
 * @property {import("./utils/logger").logger} logger
 * @property {import("./utils/expressServer").app} app
 * @property {import("./utils/datasheets").datasheets} datasheets
 * @property {import("./models/account.model").accountModel} accountModel
 * @property {import("./models/report.model").reportModel} reportModel
 * @property {import("./models/shop.model").shopModel} shopModel
 */

require("dotenv").config();

const CoreLoader = require("./utils/coreLoader");
const cliHelper = require("./utils/cliHelper");
const createLogger = require("./utils/logger").createLogger;
const ExpressServer = require("./utils/expressServer");
const SteerFunctions = require("./utils/steerFunctions");
const PlatformFunctions = require("./utils/platformFunctions");
const datasheets = require("./utils/datasheets");
const accountModel = require("./models/account.model");
const reportModel = require("./models/report.model");
const shopModel = require("./models/shop.model");

const moduleLoader = new CoreLoader();
const logger = createLogger("CL");
const cli = cliHelper(logger);

moduleLoader.setAsync("logger", () => logger);

moduleLoader.setAsync("platform", () => new PlatformFunctions(
	process.env.PLATFORM_HUB_GW_HOST,
	process.env.PLATFORM_HUB_GW_PORT,
	19, {
		logger: createLogger("Platform")
	}
));

moduleLoader.setPromise("steer", () => new Promise(resolve => {
	const steer = new SteerFunctions(
		process.env.STEER_HOST,
		process.env.STEER_PORT,
		19, "WebIMSTool", {
			logger: createLogger("Steer")
		}
	);

	if (!/^true$/i.test(process.env.STEER_ENABLE)) {
		return resolve(steer);
	}

	return steer.connect().then(() =>
		resolve(steer)
	);
}));

moduleLoader.setPromise("datasheets", datasheets, { logger: createLogger("Datasheets") });
moduleLoader.setPromise("accountModel", accountModel, { logger: createLogger("Account database") });
moduleLoader.setPromise("reportModel", reportModel, { logger: createLogger("Report database") });

if (/^true$/i.test(process.env.API_PORTAL_SHOP_ENABLE)) {
	moduleLoader.setPromise("shopModel", shopModel, { logger: createLogger("Shop database") });
}

/**
 * @param {modules} modules
 */
moduleLoader.final().then(modules => {
	const serverLoader = new CoreLoader();

	serverLoader.setPromise("arbiterApi", () => {
		const es = new ExpressServer(modules, {
			logger: createLogger("Arbiter API"),
			disableCache: true
		});

		es.setLogging();
		es.setRouter("../routes/arbiter.index");

		return es.bind(
			process.env.API_ARBITER_LISTEN_HOST,
			process.env.API_ARBITER_LISTEN_PORT
		);
	});

	serverLoader.setPromise("portalApi", () => {
		if (!process.env.API_PORTAL_LOCALE) {
			return Promise.reject("Invalid configuration parameter: API_PORTAL_LOCALE");
		}

		if (!process.env.API_PORTAL_CLIENT_DEFAULT_REGION) {
			return Promise.reject("Invalid configuration parameter: API_PORTAL_CLIENT_DEFAULT_REGION");
		}

		const es = new ExpressServer(modules, {
			logger: createLogger("Portal API"),
			disableCache: true
		});

		if (/^true$/i.test(process.env.API_PORTAL_PUBLIC_FOLDER_ENABLE)) {
			es.setStatic("/public/shop/images/tera-icons", "data/tera-icons");
			es.setStatic("/public", "public");
		}

		es.setLogging();
		es.setRouter("../routes/portal.index");

		return es.bind(
			process.env.API_PORTAL_LISTEN_HOST,
			process.env.API_PORTAL_LISTEN_PORT
		);
	});

	serverLoader.setPromise("adminPanel", () => {
		if (!process.env.ADMIN_PANEL_LOCALE) {
			return Promise.reject("Invalid configuration parameter: ADMIN_PANEL_LOCALE");
		}

		const es = new ExpressServer(modules, {
			logger: createLogger("Admin Panel")
		});

		es.setStatic("/static", "src/static/admin");
		es.setStatic("/static/images/tera-icons", "data/tera-icons");
		es.setLogging();
		es.setRouter("../routes/admin.index");

		return es.bind(
			process.env.ADMIN_PANEL_LISTEN_HOST,
			process.env.ADMIN_PANEL_LISTEN_PORT
		);
	});

	return serverLoader.final().then(() => {
		cli.printInfo();
		cli.printMemoryUsage();
		cli.printReady();

		setInterval(() =>
			cli.printMemoryUsage(), 60000 * 30);
	});
}).catch(err => {
	if (err) {
		logger.error(err);
	}

	cli.printEnded();
	process.exit();
});