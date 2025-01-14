"use strict";

/**
 * @typedef {object} planetDbInstance
 * @property {Sequelize} sequelize
 * @property {import("../models/planetDb.model").planetDbModel} model
 *
 * @typedef {Map<Number, planetDbInstance>?} planetDbs
 * @typedef {import("../app").modules} modules
 */

const { Sequelize, DataTypes } = require("sequelize");

const env = require("../utils/env");
const { createLogger } = require("../utils/logger");

/**
 * @param {modules} modules
 */
module.exports = async modules => {
	if (!modules.checkComponent("admin_panel")) {
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

		const model = await require("../models/planetDb.model")(sequelize, DataTypes);
		planetDbs.set(Number(id), { model, sequelize });
	}

	return planetDbs;
};