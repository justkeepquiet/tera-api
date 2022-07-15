"use strict";

/**
 * @typedef {object} shopModel
 * @property {import("sequelize").Sequelize} sequelize
 * @property {import("winston").Logger} logger
 * @property {import("sequelize").ModelCtor<Model<any, any>>} accounts
 * @property {import("sequelize").ModelCtor<Model<any, any>>} categories
 * @property {import("sequelize").ModelCtor<Model<any, any>>} categoryStrings
 * @property {import("sequelize").ModelCtor<Model<any, any>>} products
 * @property {import("sequelize").ModelCtor<Model<any, any>>} productStrings
 * @property {import("sequelize").ModelCtor<Model<any, any>>} productItems
 * @property {import("sequelize").ModelCtor<Model<any, any>>} itemTemplates
 * @property {import("sequelize").ModelCtor<Model<any, any>>} itemConversions
 * @property {import("sequelize").ModelCtor<Model<any, any>>} itemStrings
 * @property {import("sequelize").ModelCtor<Model<any, any>>} promoCodes
 * @property {import("sequelize").ModelCtor<Model<any, any>>} promoCodeStrings
 * @property {import("sequelize").ModelCtor<Model<any, any>>} promoCodeActivated
 * @property {import("sequelize").ModelCtor<Model<any, any>>} boxes
 * @property {import("sequelize").ModelCtor<Model<any, any>>} boxItems
 */

const { Sequelize, DataTypes } = require("sequelize");

module.exports = ({ logger }) => new Promise((resolve, reject) => {
	if (!process.env.DB_SHOP_HOST) {
		return reject("Invalid configuration parameter: DB_SHOP_HOST");
	}

	if (!process.env.DB_SHOP_DATABASE) {
		return reject("Invalid configuration parameter: DB_SHOP_DATABASE");
	}

	if (!process.env.DB_SHOP_USERNAME) {
		return reject("Invalid configuration parameter: DB_SHOP_USERNAME");
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

	sequelize.authenticate().then(() => {
		logger.info("Connected.");

		/**
		 * @type {shopModel}
		 */
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
			boxes: require("./shop/shopBoxes.model")(sequelize, DataTypes),
			boxItems: require("./shop/shopBoxItems.model")(sequelize, DataTypes)
		};

		resolve({ ...models, sequelize, logger });
	}).catch(err => {
		logger.error("Connection error:", err);
		reject();
	});
});