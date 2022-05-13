"use strict";

const { Sequelize, DataTypes } = require("sequelize");

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
			"logging": /^true$/i.test(process.env[`DB_PLANET_${id}_LOG_QUERY`]) ? console.log : false,
			"dialect": "mssql",
			"dialectOptions": {
				"options": {
					"encrypt": false
				}
			},
			"host": process.env[`DB_PLANET_${id}_HOST`],
			"port": process.env[`DB_PLANET_${id}_PORT`] || 1433,
			"define": {
				"timestamps": false,
				"freezeTableName": true
			}
		}
	);

	const models = {
		"users": require("./planet/planetUsers.model.js")(sequelize, DataTypes)
	};

	_exports[id] = { ...models, sequelize };
});

module.exports = _exports;