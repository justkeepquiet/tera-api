"use strict";

const { Sequelize, DataTypes } = require("sequelize");

const sequelize = new Sequelize(
	process.env.DB_REPORT_DATABASE,
	process.env.DB_REPORT_USERNAME,
	process.env.DB_REPORT_PASSWORD,
	{
		logging: /^true$/i.test(process.env.DB_REPORT_LOG_QUERY) ? console.log : false,
		dialect: "mysql",
		host: process.env.DB_REPORT_HOST,
		port: process.env.DB_REPORT_PORT || 3306,
		define: {
			timestamps: false,
			freezeTableName: true
		}
	}
);

const models = {
	cheats: require("./report/reportCheats.model.js")(sequelize, DataTypes)
};

module.exports = { ...models, sequelize };