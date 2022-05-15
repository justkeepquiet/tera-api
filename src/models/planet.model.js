"use strict";

const { Sequelize, DataTypes } = require("sequelize");
const logger = require("../utils/logger");

const _exports = {};
const planetIds = [];

Object.keys(process.env).forEach(key => {
	const found = key.match(/DB_PLANET_(\d+)_DATABASE/);

	if (found) {
		planetIds.push(Number(found[1]));
	}
});

planetIds.forEach(id => {
	const sequelize = new Sequelize(
		process.env[`DB_PLANET_${id}_DATABASE`],
		process.env[`DB_PLANET_${id}_USERNAME`],
		process.env[`DB_PLANET_${id}_PASSWORD`],
		{
			logging: msg => logger.debug(msg),
			dialect: "mssql",
			dialectOptions: {
				options: {
					encrypt: false
				}
			},
			host: process.env[`DB_PLANET_${id}_HOST`],
			port: process.env[`DB_PLANET_${id}_PORT`] || 1433,
			define: {
				timestamps: false,
				freezeTableName: true
			}
		}
	);

	sequelize.authenticate().then(() =>
		logger.info("Planet database connected.")
	).catch(err =>
		logger.error("Planet database connection error:", err)
	);

	const models = {
		users: require("./planet/planetUsers.model.js")(sequelize, DataTypes)
	};

	_exports[id] = { ...models, sequelize };
});

module.exports = _exports;