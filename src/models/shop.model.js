"use strict";

const { Sequelize, DataTypes } = require("sequelize");
const logger = require("../utils/logger");

if (/^true$/i.test(process.env.API_PORTAL_SHOP_ENABLE)) {
	if (!process.env.DB_SHOP_HOST) {
		logger.error("Invalid configuration parameter: DB_SHOP_HOST");
		process.exit();
	}

	if (!process.env.DB_SHOP_DATABASE) {
		logger.error("Invalid configuration parameter: DB_SHOP_DATABASE");
		process.exit();
	}

	if (!process.env.DB_SHOP_USERNAME) {
		logger.error("Invalid configuration parameter: DB_SHOP_USERNAME");
		process.exit();
	}

	const sequelize = new Sequelize(
		process.env.DB_SHOP_DATABASE,
		process.env.DB_SHOP_USERNAME,
		process.env.DB_SHOP_PASSWORD,
		{
			logging: msg => logger.debug(msg),
			dialect: "mysql",
			host: process.env.DB_SHOP_HOST,
			port: process.env.DB_SHOP_PORT || 3306,
			define: {
				timestamps: false,
				freezeTableName: true
			},
			pool: {
				max: 100,
				min: 0,
				idle: 200000,
				acquire: 1000000
			}
		}
	);

	sequelize.authenticate().then(() =>
		logger.info("Shop database connected.")
	).catch(err => {
		logger.error("Shop database connection error:", err);
		process.exit();
	});

	const models = {
		accounts: require("./shop/shopAccounts.model")(sequelize, DataTypes),
		categories: require("./shop/shopCategories.model")(sequelize, DataTypes),
		categoryStrings: require("./shop/shopCategoryStrings.model")(sequelize, DataTypes),
		products: require("./shop/shopProducts.model")(sequelize, DataTypes),
		productStrings: require("./shop/shopProductStrings.model")(sequelize, DataTypes),
		productItems: require("./shop/shopProductItems.model")(sequelize, DataTypes),
		itemTemplates: require("./shop/shopItemTemplates.model")(sequelize, DataTypes),
		itemConversions: require("./shop/shopItemConversions.model")(sequelize, DataTypes),
		itemStrings: require("./shop/shopItemStrings.model")(sequelize, DataTypes),
		promoCodes: require("./shop/shopPromoCodes.model")(sequelize, DataTypes),
		promoCodeStrings: require("./shop/shopPromoCodeStrings.model")(sequelize, DataTypes),
		promoCodeActivated: require("./shop/shopPromoCodeActivated.model")(sequelize, DataTypes),
		fundLogs: require("./shop/shopFundLogs.model")(sequelize, DataTypes),
		payLogs: require("./shop/shopPayLogs.model")(sequelize, DataTypes)
	};

	module.exports = { ...models, sequelize };
}