"use strict";

/**
 * @typedef {import("../app").Sequelize} Sequelize
 * @typedef {import("../app").DataTypes} DataTypes
 *
 * @typedef {object} shopModel
 * @property {import("sequelize").ModelCtor<Model<any, any>>} accounts
 * @property {import("sequelize").ModelCtor<Model<any, any>>} categories
 * @property {import("sequelize").ModelCtor<Model<any, any>>} categoryStrings
 * @property {import("sequelize").ModelCtor<Model<any, any>>} products
 * @property {import("sequelize").ModelCtor<Model<any, any>>} productStrings
 * @property {import("sequelize").ModelCtor<Model<any, any>>} productItems
 * @property {import("sequelize").ModelCtor<Model<any, any>>} promoCodes
 * @property {import("sequelize").ModelCtor<Model<any, any>>} promoCodeStrings
 * @property {import("sequelize").ModelCtor<Model<any, any>>} promoCodeActivated
 * @property {import("sequelize").ModelCtor<Model<any, any>>} boxes
 * @property {import("sequelize").ModelCtor<Model<any, any>>} boxItems
 */

/**
 * @param {Sequelize} sequelize
 * @param {DataTypes} DataTypes
 */
module.exports = (sequelize, DataTypes) => ({
	accounts: require("./shop/shopAccounts.model")(sequelize, DataTypes),
	categories: require("./shop/shopCategories.model")(sequelize, DataTypes),
	categoryStrings: require("./shop/shopCategoryStrings.model")(sequelize, DataTypes),
	products: require("./shop/shopProducts.model")(sequelize, DataTypes),
	productStrings: require("./shop/shopProductStrings.model")(sequelize, DataTypes),
	productItems: require("./shop/shopProductItems.model")(sequelize, DataTypes),
	promoCodes: require("./shop/shopPromoCodes.model")(sequelize, DataTypes),
	promoCodeStrings: require("./shop/shopPromoCodeStrings.model")(sequelize, DataTypes),
	promoCodeActivated: require("./shop/shopPromoCodeActivated.model")(sequelize, DataTypes)
});