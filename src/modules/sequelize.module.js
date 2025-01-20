"use strict";

/**
 * @typedef {import("sequelize").Sequelize} Sequelize
 * @typedef {import("../models/queue.model").queueModel} queueModel
 * @typedef {import("../models/account.model").accountModel} accountModel
 * @typedef {import("../models/server.model").serverModel} serverModel
 * @typedef {import("../models/report.model").reportModel} reportModel
 * @typedef {import("../models/shop.model").shopModel} shopModel
 * @typedef {import("../models/box.model").boxModel} boxModel
 * @typedef {import("../app").modules} modules
 */

const path = require("path");
const { Sequelize, DataTypes } = require("sequelize");
const cls = require("cls-hooked");

const env = require("../utils/env");
const { createLogger } = require("../utils/logger");
const { databaseMigrationProcedure } = require("../lib/databaseMigration");

/**
 * @param {modules} modules
 */
module.exports = async modules => {
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
	const syncTables = await databaseMigrationProcedure(sequelize, sequelizeLogger, migrationsDir, "dbVersion", modules.versions.db);

	if (syncTables) {
		sequelizeLogger.info("Syncing tables.");
	} else {
		sequelizeLogger.info("Skipping tables sync.");
	}

	await modules.pluginsLoader.loadComponent("models.before", sequelize, DataTypes);

	modules.queueModel = await require("../models/queue.model")(sequelize, DataTypes, syncTables, modules);
	modules.serverModel = await require("../models/server.model")(sequelize, DataTypes, syncTables, modules);
	modules.accountModel = await require("../models/account.model")(sequelize, DataTypes, syncTables, modules);
	modules.reportModel = await require("../models/report.model")(sequelize, DataTypes, syncTables, modules);
	modules.shopModel = await require("../models/shop.model")(sequelize, DataTypes, syncTables, modules);
	modules.boxModel = await require("../models/box.model")(sequelize, DataTypes, syncTables, modules);

	await modules.pluginsLoader.loadComponent("models.after", sequelize, DataTypes);

	return sequelize;
};