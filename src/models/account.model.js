"use strict";

const { Sequelize, DataTypes } = require("sequelize");
const logger = require("../utils/logger");

const sequelize = new Sequelize(
	process.env.DB_ACCOUNT_DATABASE,
	process.env.DB_ACCOUNT_USERNAME,
	process.env.DB_ACCOUNT_PASSWORD,
	{
		logging: msg => logger.debug(msg),
		dialect: "mysql",
		host: process.env.DB_ACCOUNT_HOST,
		port: process.env.DB_ACCOUNT_PORT || 3306,
		define: {
			timestamps: false,
			freezeTableName: true
		}
	}
);

sequelize.authenticate().then(() =>
	logger.info("Account database connected.")
).catch(err =>
	logger.error("Account database connection error:", err)
);

const models = {
	info: require("./account/accountInfo.model")(sequelize, DataTypes),
	characters: require("./account/accountCharacters.model")(sequelize, DataTypes),
	benefits: require("./account/accountBenefits.model")(sequelize, DataTypes),
	serverInfo: require("./account/serverInfo.model")(sequelize, DataTypes),
	serverStrings: require("./account/serverStrings.model")(sequelize, DataTypes)
};

module.exports = { ...models, sequelize };