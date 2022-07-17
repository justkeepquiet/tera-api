"use strict";

/**
 * @typedef {import("sequelize").Sequelize} Sequelize
 * @typedef {import("sequelize/types")} DataTypes
 *
 * @typedef {object} modules
 * @property {Sequelize} sequelize
 * @property {FcgiFunctions} fcgi
 * @property {PlatformFunctions} platform
 * @property {SteerFunctions} steer
 * @property {BackgroundQueue} queue
 * @property {import("./utils/logger").logger} logger
 * @property {import("./utils/expressServer").app} app
 * @property {import("./utils/datasheets").datasheets} datasheets
 * @property {import("./models/account.model").accountModel} accountModel
 * @property {import("./models/server.model").serverModel} serverModel
 * @property {import("./models/report.model").reportModel} reportModel
 * @property {import("./models/queue.model").queueModel} queueModel
 * @property {import("./models/shop.model").shopModel} shopModel
 * @property {import("./models/box.model").boxModel} boxModel
 * @property {import("./models/data.model").dataModel} dataModel
 */

require("dotenv").config();

const { Sequelize, DataTypes } = require("sequelize");
const CoreLoader = require("./utils/coreLoader");
const cliHelper = require("./utils/cliHelper");
const createLogger = require("./utils/logger").createLogger;
const BackgroundQueue = require("./utils/backgroundQueue");
const ExpressServer = require("./utils/expressServer");
const SteerFunctions = require("./utils/steerFunctions");
const PlatformFunctions = require("./utils/platformFunctions");
const FcgiFunctions = require("./utils/fcgiFunctions");
const datasheets = require("./utils/datasheets");
const TasksActions = require("./actions/tasks.actions");

const moduleLoader = new CoreLoader();
const logger = createLogger("CL");
const cli = cliHelper(logger);

const fcgi = new FcgiFunctions(
	process.env.FCGI_GW_WEBAPI_URL, {
		logger: createLogger("FCGI")
	}
);

if (!/^true$/i.test(process.env.FCGI_GW_WEBAPI_ENABLE)) {
	fcgi.params.logger.warn("Not configured or disabled. Some features will not be available.");
}

moduleLoader.setAsync("fcgi", () => fcgi);
moduleLoader.setAsync("logger", () => logger);

moduleLoader.setAsync("queue", () => new BackgroundQueue({
	concurrent: 5,
	logger: createLogger("CL: Background Queue")
}));

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
		steer.params.logger.warn("Not configured or disabled. QA authorization for Admin Panel is used.");
		return resolve(steer);
	}

	return steer.connect().then(() =>
		resolve(steer)
	);
}));

moduleLoader.setPromise("sequelize", () => new Promise((resolve, reject) => {
	if (!process.env.DB_HOST) {
		return reject("Invalid configuration parameter: DB_HOST");
	}

	if (!process.env.DB_DATABASE) {
		return reject("Invalid configuration parameter: DB_DATABASE");
	}

	if (!process.env.DB_USERNAME) {
		return reject("Invalid configuration parameter: DB_USERNAME");
	}

	const sequelizeLogger = createLogger("Database");

	const sequelize = new Sequelize(
		process.env.DB_DATABASE,
		process.env.DB_USERNAME,
		process.env.DB_PASSWORD,
		{
			logging: msg => sequelizeLogger.debug(msg),
			dialect: "mysql",
			host: process.env.DB_HOST,
			port: process.env.DB_PORT || 3306,
			define: {
				timestamps: false,
				freezeTableName: true
			},
			pool: {
				max: 100,
				min: 0,
				acquire: 1000000,
				idle: 200000
			}
		}
	);

	sequelize.authenticate().then(() => {
		moduleLoader.setAsync("accountModel", () => require("./models/account.model")(sequelize, DataTypes));
		moduleLoader.setAsync("serverModel", () => require("./models/server.model")(sequelize, DataTypes));
		moduleLoader.setAsync("reportModel", () => require("./models/report.model")(sequelize, DataTypes));
		moduleLoader.setAsync("queueModel", () => require("./models/queue.model")(sequelize, DataTypes));
		moduleLoader.setAsync("shopModel", () => require("./models/shop.model")(sequelize, DataTypes));
		moduleLoader.setAsync("boxModel", () => require("./models/box.model")(sequelize, DataTypes));
		moduleLoader.setAsync("dataModel", () => require("./models/data.model")(sequelize, DataTypes));

		sequelizeLogger.info("Connected.");
		resolve(sequelize);
	}).catch(err => {
		sequelizeLogger.error("Connection error:", err);
		reject();
	});
}));

moduleLoader.setPromise("datasheets", datasheets, {
	logger: createLogger("Datasheets")
});

moduleLoader.final().then(
	/**
	 * @param {modules} modules
	 */
	modules => {
		const serverLoader = new CoreLoader();
		const tasksActions = new TasksActions(modules);

		serverLoader.setPromise("arbiterApi", () => {
			if (!process.env.API_ARBITER_LISTEN_PORT) {
				return Promise.reject("Invalid configuration parameter: API_ARBITER_LISTEN_PORT");
			}

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
			if (!process.env.API_PORTAL_LISTEN_PORT) {
				return Promise.reject("Invalid configuration parameter: API_PORTAL_LISTEN_PORT");
			}

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

		serverLoader.setPromise("shopApi", () => {
			if (!process.env.API_SHOP_LISTEN_PORT) {
				return Promise.reject("Invalid configuration parameter: API_SHOP_LISTEN_PORT");
			}

			const es = new ExpressServer(modules, {
				logger: createLogger("Shop API"),
				disableCache: true
			});

			es.setLogging();
			es.setRouter("../routes/shop.index");

			return es.bind(
				process.env.API_SHOP_LISTEN_HOST,
				process.env.API_SHOP_LISTEN_PORT
			);
		});

		serverLoader.setPromise("adminPanel", () => {
			if (!process.env.ADMIN_PANEL_LISTEN_PORT) {
				return Promise.reject("Invalid configuration parameter: ADMIN_PANEL_LISTEN_PORT");
			}

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

		modules.queue.setModel(modules.queueModel.tasks);
		modules.queue.setHandlers(tasksActions);

		return serverLoader.final().then(() => {
			cli.printInfo();
			cli.printMemoryUsage();
			cli.printReady();

			setInterval(() =>
				modules.queue.start().catch(err =>
					modules.queue.logger.error(err)
				), 60000
			);

			setInterval(() =>
				cli.printMemoryUsage(), 60000 * 30
			);
		});
	})
	.catch(err => {
		if (err) {
			logger.error(err);
		}

		cli.printEnded();
		process.exit();
	})
;