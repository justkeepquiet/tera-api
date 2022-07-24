"use strict";

/**
 * @typedef {import("../app").Sequelize} Sequelize
 * @typedef {import("../app").DataTypes} DataTypes
 *
 * @typedef {object} dataModel
 * @property {import("sequelize").ModelCtor<Model<any, any>>} itemTemplates
 * @property {import("sequelize").ModelCtor<Model<any, any>>} itemConversions
 * @property {import("sequelize").ModelCtor<Model<any, any>>} itemStrings
 */

/**
 * @param {Sequelize} sequelize
 * @param {DataTypes} DataTypes
 */
module.exports = (sequelize, DataTypes) => {
	const model = {
		itemTemplates: require("./data/dataItemTemplates.model")(sequelize, DataTypes),
		itemConversions: require("./data/dataItemConversions.model")(sequelize, DataTypes),
		itemStrings: require("./data/dataItemStrings.model")(sequelize, DataTypes)
	};

	model.itemConversions.hasOne(model.itemTemplates, {
		foreignKey: "itemTemplateId",
		sourceKey: "fixedItemTemplateId",
		as: "template"
	});

	model.itemConversions.hasOne(model.itemStrings, {
		foreignKey: "itemTemplateId",
		sourceKey: "fixedItemTemplateId",
		as: "strings"
	});

	model.itemTemplates.hasOne(model.itemStrings, {
		foreignKey: "itemTemplateId",
		sourceKey: "itemTemplateId",
		as: "strings"
	});

	model.itemTemplates.hasMany(model.itemConversions, {
		foreignKey: "itemTemplateId",
		sourceKey: "itemTemplateId",
		as: "conversion"
	});

	return model;
};