"use strict";

/**
 * @typedef {object} accountModel
 * @property {import("sequelize").Sequelize} sequelize
 * @property {import("sequelize").ModelCtor<Model<any, any>>} info
 * @property {import("sequelize").ModelCtor<Model<any, any>>} bans
 * @property {import("sequelize").ModelCtor<Model<any, any>>} characters
 * @property {import("sequelize").ModelCtor<Model<any, any>>} benefits
 * @property {import("sequelize").ModelCtor<Model<any, any>>} maintenance
 * @property {import("sequelize").ModelCtor<Model<any, any>>} serverInfo
 * @property {import("sequelize").ModelCtor<Model<any, any>>} serverStrings
 */

const { Sequelize, DataTypes } = require("sequelize");

module.exports = ({ logger }) => new Promise((resolve, reject) => {
	if (!process.env.DB_ACCOUNT_HOST) {
		return reject("Invalid configuration parameter: DB_ACCOUNT_HOST");
	}

	if (!process.env.DB_ACCOUNT_DATABASE) {
		return reject("Invalid configuration parameter: DB_ACCOUNT_DATABASE");
	}

	if (!process.env.DB_ACCOUNT_USERNAME) {
		return reject("Invalid configuration parameter: DB_ACCOUNT_USERNAME");
	}

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

	sequelize.authenticate().then(() => {
		logger.info("Connected.");

		/**
		 * @type {accountModel}
		 */
		const models = {
			// Account
			info: require("./account/accountInfo.model")(sequelize, DataTypes),
			bans: require("./account/accountBans.model")(sequelize, DataTypes),
			characters: require("./account/accountCharacters.model")(sequelize, DataTypes),
			benefits: require("./account/accountBenefits.model")(sequelize, DataTypes),
			maintenance: require("./account/serverMaintenance.model")(sequelize, DataTypes),
			// Server
			serverInfo: require("./account/serverInfo.model")(sequelize, DataTypes),
			serverStrings: require("./account/serverStrings.model")(sequelize, DataTypes)
		};

		resolve({ ...models, sequelize });
	}).catch(err => {
		logger.error("Connection error:", err);
		reject();
	});
});