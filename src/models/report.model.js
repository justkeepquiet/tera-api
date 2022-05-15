"use strict";

const { Sequelize, DataTypes } = require("sequelize");
const logger = require("../helpers/logger");

const sequelize = new Sequelize(
	process.env.DB_REPORT_DATABASE,
	process.env.DB_REPORT_USERNAME,
	process.env.DB_REPORT_PASSWORD,
	{
		logging: msg => logger.debug(msg),
		dialect: "mysql",
		host: process.env.DB_REPORT_HOST,
		port: process.env.DB_REPORT_PORT || 3306,
		define: {
			timestamps: false,
			freezeTableName: true
		}
	}
);

sequelize.authenticate().then(() =>
	logger.info("Report database connected.")
).catch(err =>
	logger.error("Report database connection error:", err)
);

const models = {
	cheats: require("./report/reportCheats.model.js")(sequelize, DataTypes)
};

module.exports = { ...models, sequelize };