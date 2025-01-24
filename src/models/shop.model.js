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
 * @property {import("sequelize").ModelCtor<Model<any, any>>} coupons
 * @property {import("sequelize").ModelCtor<Model<any, any>>} couponActivated
 */

/**
 * @param {Sequelize} sequelize
 * @param {DataTypes} DataTypes
 * @param {modules} modules
 */
module.exports = async (sequelize, DataTypes, syncTables, modules) => {
	const model = {
		accounts: require("./shop/shopAccounts.model")(sequelize, DataTypes),
		categories: require("./shop/shopCategories.model")(sequelize, DataTypes),
		categoryStrings: require("./shop/shopCategoryStrings.model")(sequelize, DataTypes),
		products: require("./shop/shopProducts.model")(sequelize, DataTypes),
		productStrings: require("./shop/shopProductStrings.model")(sequelize, DataTypes),
		productItems: require("./shop/shopProductItems.model")(sequelize, DataTypes),
		promoCodes: require("./shop/shopPromoCodes.model")(sequelize, DataTypes),
		promoCodeStrings: require("./shop/shopPromoCodeStrings.model")(sequelize, DataTypes),
		promoCodeActivated: require("./shop/shopPromoCodeActivated.model")(sequelize, DataTypes),
		coupons: require("./shop/shopCoupons.model")(sequelize, DataTypes),
		couponActivated: require("./shop/shopCouponActivated.model")(sequelize, DataTypes)
	};

	if (syncTables) {
		await model.accounts.sync();
		await model.categories.sync();
		await model.categoryStrings.sync();
		await model.products.sync();
		await model.productStrings.sync();
		await model.productItems.sync();
		await model.promoCodes.sync();
		await model.promoCodeStrings.sync();
		await model.promoCodeActivated.sync();
		await model.coupons.sync();
		await model.couponActivated.sync();
	}

	// accounts
	model.accounts.hasOne(modules.accountModel.info, {
		foreignKey: "accountDBID",
		as: "info"
	});

	// products
	model.products.hasMany(model.productStrings, {
		foreignKey: "productId",
		sourceKey: "id",
		as: "strings"
	});

	model.products.hasMany(model.productItems, {
		foreignKey: "productId",
		sourceKey: "id",
		as: "item"
	});

	// categories
	model.categories.hasMany(model.categoryStrings, {
		foreignKey: "categoryId",
		sourceKey: "id",
		as: "strings"
	});

	// promoCodes
	model.promoCodes.hasMany(model.promoCodeStrings, {
		foreignKey: "promoCodeId",
		sourceKey: "promoCodeId",
		as: "strings"
	});

	// promoCodeActivated
	model.promoCodeActivated.hasOne(model.promoCodes, {
		foreignKey: "promoCodeId",
		sourceKey: "promoCodeId",
		as: "info"
	});

	model.promoCodeActivated.hasMany(model.promoCodeStrings, {
		foreignKey: "promoCodeId",
		sourceKey: "promoCodeId",
		as: "strings"
	});

	model.promoCodeActivated.hasOne(modules.accountModel.info, {
		foreignKey: "accountDBID",
		sourceKey: "accountDBID",
		as: "account"
	});

	// coupons
	model.coupons.hasOne(modules.accountModel.info, {
		foreignKey: "accountDBID",
		sourceKey: "accountDBID",
		as: "account"
	});

	// couponActivated
	model.couponActivated.hasOne(model.coupons, {
		foreignKey: "couponId",
		sourceKey: "couponId",
		as: "info"
	});

	model.couponActivated.hasOne(modules.accountModel.info, {
		foreignKey: "accountDBID",
		sourceKey: "accountDBID",
		as: "account"
	});

	return model;
};