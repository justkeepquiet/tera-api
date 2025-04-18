"use strict";

const Sequelize = require("sequelize");
const fs = require("fs");
const path = require("path");

/**
 * @typedef {import("sequelize").Sequelize} sequelize
 * @typedef {import("./logger")} logger
 */

class MigrationManager {
	/**
	 * @param {sequelize} sequelize
	 * @param {logger} logger
	 */
	constructor(sequelize, logger, migrationsDir, fieldName = "dbVersion") {
		this.sequelize = sequelize;
		this.logger = logger;
		this.queryInterface = sequelize.getQueryInterface();
		this.migrationsDir = migrationsDir;
		this.fieldName = fieldName;
		this.tableName = "global_property";
	}

	async init() {
		const tableExists = await this.queryInterface.showAllTables()
			.then(tables => tables.includes(this.tableName));

		if (!tableExists) {
			await this.queryInterface.createTable(this.tableName, {
				name: {
					type: Sequelize.DataTypes.STRING,
					allowNull: false,
					primaryKey: true
				},
				value: {
					type: Sequelize.DataTypes.STRING,
					allowNull: false
				}
			});
		}
	}

	async getCurrentVersion() {
		const result = await this.queryInterface.rawSelect(this.tableName, {
			where: { name: this.fieldName }
		}, ["value"]);

		return result ? parseInt(result[0], 10) : 0;
	}

	async setVersion(version) {
		const currentVersion = await this.getCurrentVersion();

		if (currentVersion === 0) {
			await this.queryInterface.bulkInsert(this.tableName, [{
				name: this.fieldName,
				value: version
			}]);
		} else {
			await this.queryInterface.bulkUpdate(this.tableName, {
				value: version
			}, {
				name: this.fieldName
			});
		}
	}

	async runMigrations() {
		const currentVersion = await this.getCurrentVersion();

		const migrationFiles = fs.readdirSync(this.migrationsDir)
			.filter(file => file.endsWith(".js"))
			.map(file => path.join(this.migrationsDir, file));

		for (const file of migrationFiles) {
			const migration = require(file);

			if (migration.VERSION > currentVersion) {
				try {
					this.logger.info(`Applying migration: ${file}`);

					await migration.up(this.queryInterface, Sequelize);
					await this.setVersion(migration.VERSION);

					this.logger.info(`Migration ${file} applied.`);
				} catch (migrationError) {
					try {
						this.logger.info(`Rollback migration: ${file}`);

						await migration.down(this.queryInterface, Sequelize);
					} catch (rollbackError) {
						this.logger.debug(`Rollback error: ${rollbackError}`);
					}

					throw `Migration error: ${migrationError}`;
				}
			}
		}
	}
}

module.exports = MigrationManager;