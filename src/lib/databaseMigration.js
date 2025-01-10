"use strict";

const MigrationManager = require("../utils/migrationManager");

async function databaseMigrationProcedure(sequelize, migrationLogger, migrationsDir, fieldName, dbVersion) {
	const migrationManager = new MigrationManager(sequelize, migrationLogger, migrationsDir, fieldName);
	await migrationManager.init();

	const currentDbVersion = await migrationManager.getCurrentVersion();
	let passed = false;

	if (currentDbVersion === 0) {
		migrationLogger.info("DB version is not found.");

		passed = true;
		const isDbNotClean = await migrationManager.queryInterface.showAllTables()
			.then(tables => tables.includes("server_info"));

		if (!isDbNotClean) {
			migrationLogger.debug(`Database is clean, set DB version: ${dbVersion}`);
			await migrationManager.setVersion(dbVersion);
		} else {
			await migrationManager.runMigrations();
		}
	} else if (currentDbVersion !== dbVersion) {
		passed = true;
		await migrationManager.runMigrations();
	}

	return passed;
}

module.exports = { MigrationManager, databaseMigrationProcedure };