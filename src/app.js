"use strict";

const DB_VERSION = 3;

/**
 * @typedef {import("sequelize").Sequelize} Sequelize
 * @typedef {import("sequelize").DataTypes} DataTypes
 * @typedef {import("@maxmind/geoip2-node").ReaderModel} ReaderModel
 *
 * @typedef {object} datasheetModel
 * @property {Map[]} strSheetAccountBenefit
 * @property {Map[]} strSheetDungeon
 * @property {[][]} strSheetCreature
 *
 * @typedef {object} modules
 * @property {Sequelize} sequelize
 * @property {HubFunctions} hub
 * @property {SteerFunctions} steer
 * @property {nodemailer.Transporter} mailer
 * @property {ReaderModel} geoip
 * @property {BackgroundQueue} queue
 * @property {import("./utils/logger").logger} logger
 * @property {import("./lib/expressServer").app} app
 * @property {import("./lib/scheduler").Scheduler} scheduler
 * @property {import("./models/queue.model").queueModel} queueModel
 * @property {import("./models/data.model").dataModel} dataModel
 * @property {import("./models/account.model").accountModel} accountModel
 * @property {import("./models/server.model").serverModel} serverModel
 * @property {import("./models/report.model").reportModel} reportModel
 * @property {import("./models/shop.model").shopModel} shopModel
 * @property {import("./models/box.model").boxModel} boxModel
 * @property {import("./models/launcher.model").launcherModel} launcherModel
 * @property {datasheetModel} datasheetModel
 */

require("dotenv").config();

const fs = require("fs");
const path = require("path");
const { Sequelize, DataTypes } = require("sequelize");
const cls = require("cls-hooked");
const nodemailer = require("nodemailer");
const geoip = require("@maxmind/geoip2-node");
const CoreLoader = require("./lib/coreLoader");
const { Scheduler, expr } = require("./lib/scheduler");
const HubFunctions = require("./lib/hubFunctions");
const SteerFunctions = require("./lib/steerFunctions");
const serverCategory = require("./lib/teraPlatformGuid").serverCategory;
const BackgroundQueue = require("./lib/backgroundQueue");
const DatasheetLoader = require("./lib/datasheetLoader");
const ExpressServer = require("./lib/expressServer");
const TasksActions = require("./actions/tasks.actions");
const ServerCheckActions = require("./actions/serverCheck.actions");
const MigrationManager = require("./utils/migrationManager");
const createLogger = require("./utils/logger").createLogger;
const cliHelper = require("./utils/cliHelper");

const moduleLoader = new CoreLoader();
const logger = createLogger("CL");
const cli = cliHelper(logger);

cli.addOption("-c, --component <items...>", "List of components");

const options = cli.getOptions();
const checkComponent = name => !options.component || options.component.includes(name);

moduleLoader.setPromise("logger", async () => logger);

moduleLoader.setPromise("scheduler", async () => new Scheduler(
	createLogger("Scheduler", { colors: { debug: "gray" } })
));

moduleLoader.setPromise("queue", async () => new BackgroundQueue({
	concurrent: 5,
	logger: createLogger("Background Queue")
}));

moduleLoader.setPromise("hub", async () => {
	const hub = new HubFunctions(
		process.env.HUB_HOST,
		process.env.HUB_PORT,
		serverCategory.webcstool, {
			logger: createLogger("Hub", { colors: { debug: "magenta" } })
		}
	);

	await hub.connect();

	return hub;
});

moduleLoader.setPromise("steer", async () => {
	const steer = new SteerFunctions(
		process.env.STEER_HOST,
		process.env.STEER_PORT,
		serverCategory.webcstool, "WebIMSTool", {
			logger: createLogger("Steer", { colors: { debug: "bold magenta" } })
		}
	);

	if (checkComponent("admin_panel")) {
		if (/^true$/i.test(process.env.STEER_ENABLE)) {
			await steer.connect();
		} else {
			steer.params.logger.warn("Not configured or disabled. QA authorization for Admin Panel is used.");
		}
	}

	return steer;
});

moduleLoader.setPromise("mailer", async () => {
	const settings = {
		host: process.env.MAILER_SMTP_HOST,
		port: process.env.MAILER_SMTP_PORT,
		secure: /^true$/i.test(process.env.MAILER_SMTP_SECURE)
	};

	if (process.env.MAILER_SMTP_AUTH_USER && process.env.MAILER_SMTP_AUTH_PASSWORD) {
		settings.auth = {
			user: process.env.MAILER_SMTP_AUTH_USER,
			pass: process.env.MAILER_SMTP_AUTH_PASSWORD
		};
	}

	return nodemailer.createTransport(settings);
});

moduleLoader.setPromise("geoip", async () => {
	const geoipLogger = createLogger("GeoIP", { colors: { debug: "gray" } });
	const filePath = path.join(__dirname, "..", "data", "geoip", "GeoLite2-City.mmdb");

	if (fs.existsSync(filePath)) {
		const geoIpData = fs.readFileSync(filePath);
		const reader = geoip.Reader.openBuffer(geoIpData);

		geoipLogger.info(`Loaded: ${filePath}`);
		return reader;
	} else {
		geoipLogger.debug(`File ${filePath} is not found. Skip loading.`);
	}
});

moduleLoader.setPromise("datasheetModel", async () => {
	const datasheetLoader = new DatasheetLoader(createLogger("Datasheet", { colors: { debug: "gray" } }));

	if (checkComponent("admin_panel")) {
		datasheetLoader.add("strSheetAccountBenefit", "StrSheet_AccountBenefit", require("./models/datasheet/strSheetAccountBenefit.model"));
		datasheetLoader.add("strSheetDungeon", "StrSheet_Dungeon", require("./models/datasheet/strSheetDungeon.model"));
		datasheetLoader.add("strSheetCreature", "StrSheet_Creature", require("./models/datasheet/strSheetCreature.model"));
	}

	return await datasheetLoader.final();
});

moduleLoader.setPromise("sequelize", async () => {
	if (!process.env.DB_HOST) {
		throw "Invalid configuration parameter: DB_HOST";
	}

	if (!process.env.DB_DATABASE) {
		throw "Invalid configuration parameter: DB_DATABASE";
	}

	if (!process.env.DB_USERNAME) {
		throw "Invalid configuration parameter: DB_USERNAME";
	}

	const sequelizeLogger = createLogger("Database", { colors: { debug: "cyan" } });
	const namespace = cls.createNamespace("sequelize-app");

	Sequelize.useCLS(namespace);

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

	try {
		await sequelize.authenticate();
	} catch (err) {
		sequelizeLogger.error(`Connection error: ${err}`);
		throw "";
	}

	sequelizeLogger.info("Connected.");

	const migrationsDir = path.join(__dirname, "migrations");
	const migrationManager = new MigrationManager(sequelize, sequelizeLogger, migrationsDir);
	await migrationManager.init();

	const currentDbVersion = await migrationManager.getCurrentVersion();
	let syncTables = false;

	if (currentDbVersion === 0) {
		sequelizeLogger.info("DB version is not found.");

		syncTables = true;
		const isDbNotClean = await migrationManager.queryInterface.showAllTables()
			.then(tables => tables.includes("server_info"));

		if (!isDbNotClean) {
			sequelizeLogger.debug(`Database is clean, set DB version: ${DB_VERSION}`);
			await migrationManager.setVersion(DB_VERSION);
		} else {
			await migrationManager.runMigrations();
		}
	} else if (currentDbVersion !== DB_VERSION) {
		syncTables = true;
		await migrationManager.runMigrations();
	}

	if (syncTables) {
		sequelizeLogger.info("Syncing tables.");
	}

	await moduleLoader.setAsync("queueModel", require("./models/queue.model"), sequelize, DataTypes, syncTables);
	await moduleLoader.setAsync("serverModel", require("./models/server.model"), sequelize, DataTypes, syncTables);
	await moduleLoader.setAsync("dataModel", require("./models/data.model"), sequelize, DataTypes, syncTables);
	await moduleLoader.setAsync("accountModel", require("./models/account.model"), sequelize, DataTypes, syncTables);
	await moduleLoader.setAsync("reportModel", require("./models/report.model"), sequelize, DataTypes, syncTables);
	await moduleLoader.setAsync("shopModel", require("./models/shop.model"), sequelize, DataTypes, syncTables);
	await moduleLoader.setAsync("boxModel", require("./models/box.model"), sequelize, DataTypes, syncTables);
	await moduleLoader.setAsync("launcherModel", require("./models/launcher.model"), sequelize, DataTypes, syncTables);

	sequelizeLogger.info(`DB version: ${DB_VERSION}`);

	return sequelize;
});

/**
 * @param {modules} modules
 */
const startServers = async modules => {
	const schedulerConfig = require("../config/scheduler");

	if (checkComponent("arbiter_api")) {
		if (!process.env.API_ARBITER_LISTEN_PORT) {
			throw "Invalid configuration parameter: API_ARBITER_LISTEN_PORT";
		}

		const es = new ExpressServer(modules, {
			logger: createLogger("Arbiter API", { colors: { debug: "bold blue" } }),
			disableCache: true
		});

		es.setLogging();
		es.setRouter("../routes/arbiter.index");

		await es.bind(
			process.env.API_ARBITER_LISTEN_HOST,
			process.env.API_ARBITER_LISTEN_PORT
		);
	}

	if (checkComponent("portal_api")) {
		if (!process.env.API_PORTAL_LISTEN_PORT) {
			throw "Invalid configuration parameter: API_PORTAL_LISTEN_PORT";
		}

		if (!process.env.API_PORTAL_LOCALE) {
			throw "Invalid configuration parameter: API_PORTAL_LOCALE";
		}

		if (!process.env.API_PORTAL_CLIENT_DEFAULT_REGION) {
			throw "Invalid configuration parameter: API_PORTAL_CLIENT_DEFAULT_REGION";
		}

		const es = new ExpressServer(modules, {
			logger: createLogger("Portal API", { colors: { debug: "blue" } }),
			disableCache: !/^true$/i.test(process.env.API_PORTAL_ENABLE_CACHE)
		});

		if (/^true$/i.test(process.env.API_PORTAL_PUBLIC_FOLDER_ENABLE)) {
			es.setStatic("/public/shop/images/tera-icons", "data/tera-icons");
			es.setStatic("/public/launcher/images/launcher-slides-bg", "data/launcher-slides-bg"); // launcher v2
			es.setStatic("/public", "public");
		}

		es.setLogging();
		es.setRouter("../routes/portal.index");

		await es.bind(
			process.env.API_PORTAL_LISTEN_HOST,
			process.env.API_PORTAL_LISTEN_PORT
		);
	}

	if (checkComponent("gateway_api")) {
		if (!process.env.API_GATEWAY_LISTEN_PORT) {
			throw "Invalid configuration parameter: API_GATEWAY_LISTEN_PORT";
		}

		const es = new ExpressServer(modules, {
			logger: createLogger("Gateway API", { colors: { debug: "italic blue" } }),
			disableCache: true
		});

		es.setLogging();
		es.setRouter("../routes/gateway.index");

		await es.bind(
			process.env.API_GATEWAY_LISTEN_HOST,
			process.env.API_GATEWAY_LISTEN_PORT
		);
	}

	if (checkComponent("admin_panel")) {
		const tasksActions = new TasksActions(modules);

		if (!process.env.ADMIN_PANEL_LISTEN_PORT) {
			throw "Invalid configuration parameter: ADMIN_PANEL_LISTEN_PORT";
		}

		if (!process.env.ADMIN_PANEL_LOCALE) {
			throw "Invalid configuration parameter: ADMIN_PANEL_LOCALE";
		}

		const es = new ExpressServer(modules, {
			logger: createLogger("Admin Panel", { colors: { debug: "dim blue" } }),
			enableCompression: true
		});

		es.setStatic("/static/images/tera-icons", "data/tera-icons");
		es.setStatic("/static/images/launcher-slides-bg", "data/launcher-slides-bg"); // launcher v2
		es.setStatic("/static", "src/static/admin");
		es.setLogging();
		es.setRouter("../routes/admin.index");

		await es.bind(
			process.env.ADMIN_PANEL_LISTEN_HOST,
			process.env.ADMIN_PANEL_LISTEN_PORT
		);

		modules.queue.setModel(modules.queueModel.tasks);
		modules.queue.setHandlers(tasksActions);
	}

	logger.info(`Served components: ${options.component || "all"}`);

	modules.scheduler.start({ name: "printMemoryUsage", schedule: expr.EVERY_THIRTY_MINUTES }, () => cli.printMemoryUsage());

	if (checkComponent("arbiter_api")) {
		const serverCheckActions = new ServerCheckActions(modules);
		modules.scheduler.start({ name: "serverCheckActions", schedule: expr.EVERY_TEN_SECONDS }, () => serverCheckActions.all());
		serverCheckActions.all();
	}

	if (checkComponent("portal_api")) {
		modules.scheduler.startTasks(schedulerConfig.portalApi, require("./schedules/portalApi.schedule"), modules);
	}

	if (checkComponent("admin_panel")) {
		modules.scheduler.start({ name: "backgroundQueue", schedule: expr.EVERY_MINUTE }, () =>
			modules.queue.start().catch(err => modules.queue.logger.error(err))
		);
	}

	cli.printInfo();
	cli.printMemoryUsage();
	cli.printReady();
};

moduleLoader.final().then(startServers).catch(err => {
	if (err) {
		logger.error(err);
	}

	cli.printEnded();
	process.exit();
});