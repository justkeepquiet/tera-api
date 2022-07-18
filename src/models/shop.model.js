"use strict";

/**
 * @typedef {import("../app").Sequelize} Sequelize
 * @typedef {import("../app").DataTypes} DataTypes
 * @typedef {import("../app").modules} modules
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
 * @param {modules} modules
 */
module.exports = (sequelize, DataTypes, modules) => {
	const model = {
		accounts: require("./shop/shopAccounts.model")(sequelize, DataTypes),
		categories: require("./shop/shopCategories.model")(sequelize, DataTypes),
		categoryStrings: require("./shop/shopCategoryStrings.model")(sequelize, DataTypes),
		products: require("./shop/shopProducts.model")(sequelize, DataTypes),
		productStrings: require("./shop/shopProductStrings.model")(sequelize, DataTypes),
		productItems: require("./shop/shopProductItems.model")(sequelize, DataTypes),
		promoCodes: require("./shop/shopPromoCodes.model")(sequelize, DataTypes),
		promoCodeStrings: require("./shop/shopPromoCodeStrings.model")(sequelize, DataTypes),
		promoCodeActivated: require("./shop/shopPromoCodeActivated.model")(sequelize, DataTypes)
	};

	model.productItems.hasOne(modules.dataModel.itemTemplates, {
		foreignKey: "itemTemplateId",
		sourceKey: "itemTemplateId",
		as: "template"
	});

	model.productItems.hasOne(modules.dataModel.itemStrings, {
		foreignKey: "itemTemplateId",
		sourceKey: "itemTemplateId",
		as: "strings"
	});

	model.products.hasOne(model.productStrings, {
		foreignKey: "productId",
		sourceKey: "id",
		as: "strings"
	});

	model.categories.hasOne(model.categoryStrings, {
		foreignKey: "categoryId",
		sourceKey: "id",
		as: "strings"
	});

	model.promoCodes.hasOne(model.promoCodeStrings, {
		foreignKey: "promoCodeId",
		sourceKey: "promoCodeId",
		as: "strings"
	});

	model.promoCodeActivated.hasOne(model.promoCodes, {
		foreignKey: "promoCodeId",
		sourceKey: "promoCodeId",
		as: "info"
	});

	model.promoCodeActivated.hasOne(model.promoCodeStrings, {
		foreignKey: "promoCodeId",
		sourceKey: "promoCodeId",
		as: "strings"
	});

	return model;
};