"use strict";

/**
 * @typedef {object} reportModel
 * @property {import("sequelize").Sequelize} sequelize
 * @property {import("winston").Logger} logger
 * @property {import("sequelize").ModelCtor<Model<any, any>>} activity
 * @property {import("sequelize").ModelCtor<Model<any, any>>} characters
 * @property {import("sequelize").ModelCtor<Model<any, any>>} cheats
 * @property {import("sequelize").ModelCtor<Model<any, any>>} chronoScrolls
 * @property {import("sequelize").ModelCtor<Model<any, any>>} shopFund
 * @property {import("sequelize").ModelCtor<Model<any, any>>} shopPay
 * @property {import("sequelize").ModelCtor<Model<any, any>>} adminOp
 */

const { Sequelize, DataTypes } = require("sequelize");

module.exports = ({ logger }) => new Promise((resolve, reject) => {
	if (!process.env.DB_REPORT_HOST) {
		return reject("Invalid configuration parameter: DB_REPORT_HOST");
	}

	if (!process.env.DB_REPORT_DATABASE) {
		return reject("Invalid configuration parameter: DB_REPORT_DATABASE");
	}

	if (!process.env.DB_REPORT_USERNAME) {
		return reject("Invalid configuration parameter: DB_REPORT_USERNAME");
	}

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

	sequelize.authenticate().then(() => {
		logger.info("Connected.");

		/**
		 * @type {reportModel}
		 */
		const models = {
			activity: require("./report/reportActivity.model")(sequelize, DataTypes),
			characters: require("./report/reportCharacters.model")(sequelize, DataTypes),
			cheats: require("./report/reportCheats.model")(sequelize, DataTypes),
			chronoScrolls: require("./report/reportChronoScrolls.model")(sequelize, DataTypes),
			shopFund: require("./report/reportShopFund.model")(sequelize, DataTypes),
			shopPay: require("./report/reportShopPay.model")(sequelize, DataTypes),
			adminOp: require("./report/reportAdminOp.model")(sequelize, DataTypes)
		};

		resolve({ ...models, sequelize, logger });
	}).catch(err => {
		logger.error("Connection error:", err);
		reject();
	});
});