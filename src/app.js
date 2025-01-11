"use strict";

const DB_VERSION = 3;
const APP_VERSION = process.env.npm_package_version || require("../package.json").version;

/**
 * @typedef {import("sequelize").Sequelize} Sequelize
 * @typedef {import("sequelize").DataTypes} DataTypes
 * @typedef {import("@maxmind/geoip2-node").ReaderModel} ReaderModel
 * @typedef {import("./lib/ipApiClient")} IpApiClient
 * @typedef {import("./models/planetDb.model").planetDbModel} planetDbModel
 *
 * @typedef {object} planetDbInstance
 * @property {Sequelize} sequelize
 * @property {planetDbModel} model
 *
 * @typedef {object} datasheetModel
 * @property {import("./models/datasheet/strSheetAccountBenefit.model")[]} strSheetAccountBenefit
 * @property {import("./models/datasheet/strSheetDungeon.model")[]} strSheetDungeon
 * @property {import("./models/datasheet/strSheetCreature.model")[]} strSheetCreature
 * @property {import("./models/datasheet/itemConversion.model")[]} itemConversion
 * @property {import("./models/datasheet/itemData.model")[]} itemData
 * @property {import("./models/datasheet/skillIconData.model")[]} skillIconData
 * @property {import("./models/datasheet/strSheetItem.model")[]} strSheetItem
 *
 * @typedef {object} modules
 * @property {HubFunctions} hub
 * @property {SteerFunctions} steer
 * @property {nodemailer.Transporter} mailer
 * @property {ReaderModel} geoip
 * @property {IpApiClient} ipapi
 * @property {Sequelize} sequelize
 * @property {BackgroundQueue} queue
 * @property {versions} versions
 * @property {import("./utils/logger").logger} logger
 * @property {import("./lib/configManager")} config
 * @property {import("./lib/expressServer").app} app
 * @property {import("./lib/pluginsLoader")} pluginsLoader
 * @property {import("./lib/scheduler").Scheduler} scheduler
 * @property {import("./lib/rateLimitter")} rateLimitter
 * @property {import("./models/queue.model").queueModel} queueModel
 * @property {import("./models/account.model").accountModel} accountModel
 * @property {import("./models/server.model").serverModel} serverModel
 * @property {import("./models/report.model").reportModel} reportModel
 * @property {import("./models/shop.model").shopModel} shopModel
 * @property {import("./models/box.model").boxModel} boxModel
 * @property {datasheetModel} datasheetModel
 * @property {Map<Number, planetDbInstance>} planetDbs
 */

require("dotenv").config();

const fs = require("fs");
const path = require("path");
const { Sequelize, DataTypes } = require("sequelize");
const cls = require("cls-hooked");
const nodemailer = require("nodemailer");
const geoip = require("@maxmind/geoip2-node");

const CoreLoader = require("./lib/coreLoader");
const PluginsLoader = require("./lib/pluginsLoader");
const { Scheduler, expr } = require("./lib/scheduler");
const { databaseMigrationProcedure } = require("./lib/databaseMigration");
const RateLimitter = require("./lib/rateLimitter");
const HubFunctions = require("./lib/hubFunctions");
const SteerFunctions = require("./lib/steerFunctions");
const serverCategory = require("./lib/teraPlatformGuid").serverCategory;
const BackgroundQueue = require("./lib/backgroundQueue");
const DatasheetLoader = require("./lib/datasheetLoader");
const ExpressServer = require("./lib/expressServer");
const IpApiClient = require("./lib/ipApiClient");
const TasksActions = require("./actions/tasks.actions");
const ServerCheckActions = require("./actions/serverCheck.actions");
const CacheManager = require("./utils/cacheManager");
const helpers = require("./utils/helpers");
const env = require("./utils/env");
const createLogger = require("./utils/logger").createLogger;
const cliHelper = require("./utils/cliHelper");
const ConfigManager = require("./lib/configManager");

const versions = { app: APP_VERSION, db: DB_VERSION };
const moduleLoader = new CoreLoader();
const logger = createLogger("Core");
const cli = cliHelper(logger, versions.app);

const config = new ConfigManager(
	createLogger("Config Manager", { colors: { debug: "gray" } })
);

const pl = new PluginsLoader(
	createLogger("Plugins Loader", { colors: { debug: "gray" } })
);

cli.addOption("-c, --component <items...>", "List of components");

const options = cli.getOptions();
const checkComponent = name => !options.component || options.component.includes(name);

moduleLoader.setPromise("versions", async () => versions);
moduleLoader.setPromise("logger", async () => logger);
moduleLoader.setPromise("config", async () => config);
moduleLoader.setPromise("pluginsLoader", async () => pl);

pl.list().forEach(plugin =>
	pl.register(plugin)
);

moduleLoader.setPromise("scheduler", async () => new Scheduler(
	createLogger("Scheduler", { colors: { debug: "gray" } })
));

moduleLoader.setPromise("rateLimitter", async () => {
	const rateLimitsConfig = config.get("rateLimits");

	return new RateLimitter(
		rateLimitsConfig,
		createLogger("Rate Limitter", { colors: { debug: "gray" } })
	);
});

moduleLoader.setPromise("queue", async () => new BackgroundQueue({
	concurrent: 5,
	logger: createLogger("Background Queue")
}));

moduleLoader.setPromise("hub", async () => {
	const hub = new HubFunctions(
		env.string("HUB_HOST"),
		env.number("HUB_PORT"),
		serverCategory.webcstool, {
			logger: createLogger("Hub", { colors: { debug: "magenta" } })
		}
	);

	await hub.connect();

	return hub;
});

moduleLoader.setPromise("steer", async () => {
	const steer = new SteerFunctions(
		env.string("STEER_HOST"),
		env.number("STEER_PORT"),
		serverCategory.webcstool, "WebIMSTool", {
			logger: createLogger("Steer", { colors: { debug: "bold magenta" } })
		}
	);

	if (checkComponent("admin_panel")) {
		if (env.bool("STEER_ENABLE")) {
			await steer.connect();
		} else {
			steer.params.logger.warn("Not configured or disabled. QA authorization for Admin Panel is used.");
		}
	}

	return steer;
});

moduleLoader.setPromise("mailer", async () => {
	const settings = {
		host: env.string("MAILER_SMTP_HOST"),
		port: env.number("MAILER_SMTP_PORT"),
		secure: env.bool("MAILER_SMTP_SECURE")
	};

	if (env.string("MAILER_SMTP_AUTH_USER") && env.string("MAILER_SMTP_AUTH_PASSWORD")) {
		settings.auth = {
			user: env.string("MAILER_SMTP_AUTH_USER"),
			pass: env.string("MAILER_SMTP_AUTH_PASSWORD")
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

moduleLoader.setPromise("ipapi", async () => new IpApiClient(
	env.array("IPAPI_API_KEYS", []),
	env.number("IPAPI_CACHE_TTL", 86400), // 24 hours
	env.number("IPAPI_REQUEST_TIMEOUT", 3),
	env.number("IPAPI_REQUEST_MAX_RETRIES", 3)
));

moduleLoader.setPromise("sequelize", async () => {
	if (!env.string("DB_HOST")) {
		throw "Invalid configuration parameter: DB_HOST";
	}

	if (!env.string("DB_DATABASE")) {
		throw "Invalid configuration parameter: DB_DATABASE";
	}

	if (!env.string("DB_USERNAME")) {
		throw "Invalid configuration parameter: DB_USERNAME";
	}

	const sequelizeLogger = createLogger("Database", { colors: { debug: "cyan" } });
	const namespace = cls.createNamespace("sequelize-app");

	Sequelize.useCLS(namespace);

	const sequelize = new Sequelize(
		env.string("DB_DATABASE"),
		env.string("DB_USERNAME"),
		env.string("DB_PASSWORD"),
		{
			logging: msg => sequelizeLogger.debug(msg),
			dialect: "mysql",
			host: env.string("DB_HOST"),
			port: env.number("DB_PORT") || 3306,
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
	const syncTables = await databaseMigrationProcedure(sequelize, sequelizeLogger, migrationsDir, "dbVersion", DB_VERSION);

	if (syncTables) {
		sequelizeLogger.info("Syncing tables.");
	} else {
		sequelizeLogger.info("Skipping tables sync.");
	}

	await pl.loadComponent("models.before", moduleLoader, sequelize, DataTypes, syncTables);
	await moduleLoader.setAsync("queueModel", require("./models/queue.model"), sequelize, DataTypes, syncTables);
	await moduleLoader.setAsync("serverModel", require("./models/server.model"), sequelize, DataTypes, syncTables);
	await moduleLoader.setAsync("accountModel", require("./models/account.model"), sequelize, DataTypes, syncTables);
	await moduleLoader.setAsync("reportModel", require("./models/report.model"), sequelize, DataTypes, syncTables);
	await moduleLoader.setAsync("shopModel", require("./models/shop.model"), sequelize, DataTypes, syncTables);
	await moduleLoader.setAsync("boxModel", require("./models/box.model"), sequelize, DataTypes, syncTables);
	await pl.loadComponent("models.after", moduleLoader, sequelize, DataTypes, syncTables);

	sequelizeLogger.info(`DB version: ${DB_VERSION}`);

	return sequelize;
});

moduleLoader.setPromise("planetDbs", async () => {
	if (!checkComponent("admin_panel")) {
		return null;
	}

	const planetDbs = new Map();
	const planetDbIds = [];

	Object.keys(process.env).forEach(key => {
		const found = key.match(/DB_PLANETDB_(\d+)_DATABASE/);

		if (found) {
			planetDbIds.push(found[1]);
		}
	});

	for (const id of planetDbIds) {
		if (!env.bool(`DB_PLANETDB_${id}_ENABLED`)) {
			continue;
		}

		const database = env.string(`DB_PLANETDB_${id}_DATABASE`);
		const planetDbLogger = createLogger(`Database ${database}`, { colors: { debug: "cyan" } });

		const sequelize = new Sequelize(
			database,
			env.string(`DB_PLANETDB_${id}_USERNAME`),
			env.string(`DB_PLANETDB_${id}_PASSWORD`),
			{
				logging: msg => planetDbLogger.debug(msg),
				dialect: "mssql",
				dialectOptions: {
					options: {
						encrypt: false
					}
				},
				host: env.string(`DB_PLANETDB_${id}_HOST`),
				port: env.number(`DB_PLANETDB_${id}_PORT`) || 1433,
				define: {
					timestamps: false,
					freezeTableName: true
				}
			}
		);

		try {
			await sequelize.authenticate();
		} catch (err) {
			planetDbLogger.error(`Connection error: ${err}`);
		}

		planetDbLogger.info("Connected.");

		const model = await require("./models/planetDb.model")(sequelize, DataTypes);
		planetDbs.set(Number(id), { model, sequelize });
	}

	return planetDbs;
});

pl.loadComponent("app.moduleLoader", moduleLoader);

/**
 * @param {modules} modules
 */
const loadDatasheetModel = modules => {
	const cacheManager = new CacheManager(
		path.join(__dirname, "..", "data", "cache"), "dc",
		createLogger("CacheManager", { colors: { debug: "gray" } })
	);

	const datasheetLogger = createLogger("Datasheet", { colors: { debug: "gray" } });
	const useBinary = env.bool("DATASHEET_USE_BINARY");
	const directory = path.join(__dirname, "..", "data", "datasheets");
	const datasheetModel = [];
	const variants = [];
	let cacheRevision = null;

	try {
		if (useBinary) {
			fs.readdirSync(directory).forEach(file => {
				const match = file.match(/_(\w{3})\.dat$/);

				if (match) {
					variants.push({ region: match[1], locale: helpers.regionToLanguage(match[1]) });
				}
			});
		} else {
			fs.readdirSync(directory).forEach(file => {
				const stats = fs.statSync(path.join(directory, file));

				if (stats.isDirectory()) {
					variants.push({ region: helpers.languageToRegion(file), locale: file });
				}
			});
		}

		for (const { region, locale } of variants) {
			const datasheetLoader = new DatasheetLoader(datasheetLogger);

			if (useBinary) {
				const filePath = path.join(directory, `DataCenter_Final_${region}.dat`);

				cacheRevision = helpers.getRevision(filePath);
				datasheetLoader.fromBinary(filePath,
					env.string("DATASHEET_DATACENTER_KEY"),
					env.string("DATASHEET_DATACENTER_IV"),
					{
						isCompressed: env.bool("DATASHEET_DATACENTER_IS_COMPRESSED"),
						hasPadding: env.bool("DATASHEET_DATACENTER_HAS_PADDING")
					}
				);
			} else {
				const directoryPath = path.join(directory, locale);

				cacheRevision = helpers.getRevision(directoryPath);
				datasheetLoader.fromXml(directoryPath);
			}

			const addModel = (section, model) => {
				if (datasheetModel[section] === undefined) {
					datasheetModel[section] = {};
				}

				const instance = new model();
				const cache = cacheManager.read(`${locale}-${section}`, cacheRevision); // read cache

				if (cache !== null && typeof instance.import === "function") {
					instance.import(cache);
					datasheetModel[section][locale] = instance;

					datasheetLoader.logger.info(`Model loaded from cache: ${section} (${locale})`);
				} else {
					datasheetModel[section][locale] = datasheetLoader.addModel(instance);
				}
			};

			if (checkComponent("admin_panel")) {
				addModel("strSheetAccountBenefit", require("./models/datasheet/strSheetAccountBenefit.model"));
				addModel("strSheetDungeon", require("./models/datasheet/strSheetDungeon.model"));
				addModel("strSheetCreature", require("./models/datasheet/strSheetCreature.model"));
			}

			if (checkComponent("admin_panel") || checkComponent("portal_api")) {
				addModel("itemConversion", require("./models/datasheet/itemConversion.model"));
				addModel("skillIconData", require("./models/datasheet/skillIconData.model"));
			}

			if (checkComponent("admin_panel") || checkComponent("portal_api") || checkComponent("arbiter_api")) {
				addModel("itemData", require("./models/datasheet/itemData.model"));
				addModel("strSheetItem", require("./models/datasheet/strSheetItem.model"));
			}

			if (datasheetLoader.loader.sections.length !== 0) {
				datasheetLoader.load();

				for (const [section, locales] of Object.entries(datasheetModel)) {
					const instance = locales[locale];

					if (typeof instance.export === "function") {
						cacheManager.save(`${locale}-${section}`, instance.export(), cacheRevision); // save cache

						datasheetLoader.logger.info(`Model saved to cache: ${section} (${locale})`);
					}
				}
			}
		}
	} catch (err) {
		datasheetLogger.error(err);
		throw "";
	}

	modules.datasheetModel = datasheetModel;
};

/**
 * @param {modules} modules
 */
const startServers = async modules => {
	loadDatasheetModel(modules);

	if (checkComponent("arbiter_api")) {
		if (!env.number("API_ARBITER_LISTEN_PORT")) {
			throw "Invalid configuration parameter: API_ARBITER_LISTEN_PORT";
		}

		const es = new ExpressServer(modules, {
			logger: createLogger("Arbiter API", { colors: { debug: "bold blue" } }),
			disableCache: true
		});

		es.setLogging();
		es.setRouter("../routes/arbiter.index");

		await es.bind(
			env.string("API_ARBITER_LISTEN_HOST"),
			env.number("API_ARBITER_LISTEN_PORT")
		);
	}

	if (checkComponent("portal_api")) {
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
			pl.loadComponent("static.portalApi", es);
		}

		es.setLogging();

		pl.loadComponent("routers.portalApi.before", es);
		es.setRouter("../routes/portal.index");
		pl.loadComponent("routers.portalApi.after", es);

		await es.bind(
			env.string("API_PORTAL_LISTEN_HOST"),
			env.number("API_PORTAL_LISTEN_PORT")
		);
	}

	if (checkComponent("gateway_api")) {
		if (!env.number("API_GATEWAY_LISTEN_PORT")) {
			throw "Invalid configuration parameter: API_GATEWAY_LISTEN_PORT";
		}

		const es = new ExpressServer(modules, {
			logger: createLogger("Gateway API", { colors: { debug: "italic blue" } }),
			disableCache: true
		});

		es.setLogging();

		pl.loadComponent("routers.gatewayApi.before", es);
		es.setRouter("../routes/gateway.index");
		pl.loadComponent("routers.gatewayApi.after", es);

		await es.bind(
			env.string("API_GATEWAY_LISTEN_HOST"),
			env.number("API_GATEWAY_LISTEN_PORT")
		);
	}

	if (checkComponent("admin_panel")) {
		const tasksActions = new TasksActions(modules);

		if (!env.number("ADMIN_PANEL_LISTEN_PORT")) {
			throw "Invalid configuration parameter: ADMIN_PANEL_LISTEN_PORT";
		}

		if (!env.string("ADMIN_PANEL_LOCALE")) {
			throw "Invalid configuration parameter: ADMIN_PANEL_LOCALE";
		}

		const es = new ExpressServer(modules, {
			logger: createLogger("Admin Panel", { colors: { debug: "dim blue" } }),
			enableCompression: true
		});

		es.setStatic("/static/images/tera-icons", "data/tera-icons");
		es.setStatic("/static", "src/static/admin");
		pl.loadComponent("static.adminPanel", es);

		es.setLogging();

		pl.loadComponent("routers.adminPanel.before", es);
		es.setRouter("../routes/admin.index");
		pl.loadComponent("routers.adminPanel.after", es);

		await es.bind(
			env.string("ADMIN_PANEL_LISTEN_HOST"),
			env.number("ADMIN_PANEL_LISTEN_PORT")
		);

		modules.queue.setModel(modules.queueModel.tasks);
		modules.queue.setHandlers(tasksActions);
	}

	if (global.gc) {
		modules.scheduler.start({ name: "gcWorks", schedule: expr.EVERY_FIVE_MINUTES }, () => global.gc());
		global.gc();
	}

	modules.scheduler.start({ name: "printMemoryUsage", schedule: expr.EVERY_THIRTY_MINUTES }, () => cli.printMemoryUsage());

	if (checkComponent("arbiter_api")) {
		const allowPortCheck = env.bool("API_ARBITER_SERVER_PORT_CHECK");
		const serverCheckActions = new ServerCheckActions(modules);

		modules.scheduler.start({ name: "serverCheckActions", schedule: expr.EVERY_TEN_SECONDS }, () => serverCheckActions.all(allowPortCheck));
		serverCheckActions.all(allowPortCheck);
	}

	if (checkComponent("admin_panel")) {
		modules.scheduler.start({ name: "backgroundQueue", schedule: expr.EVERY_MINUTE }, () =>
			modules.queue.start().catch(err => modules.queue.logger.error(err))
		);
	}

	logger.info(`Served components: ${options.component || "all"}`);

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