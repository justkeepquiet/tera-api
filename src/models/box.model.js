"use strict";

/**
 * @typedef {import("../app").Sequelize} Sequelize
 * @typedef {import("../app").DataTypes} DataTypes
 * @typedef {import("../app").modules} modules
 *
 * @typedef {object} boxModel
 * @property {import("sequelize").ModelCtor<Model<any, any>>} info
 * @property {import("sequelize").ModelCtor<Model<any, any>>} items
 */

/**
 * @param {Sequelize} sequelize
 * @param {DataTypes} DataTypes
 * @param {modules} modules
 */
module.exports = (sequelize, DataTypes, modules) => {
	const model = {
		info: require("./box/boxInfo.model")(sequelize, DataTypes),
		items: require("./box/boxItems.model")(sequelize, DataTypes)
	};

	// items
	model.items.hasOne(modules.dataModel.itemTemplates, {
		foreignKey: "itemTemplateId",
		sourceKey: "itemTemplateId",
		as: "template"
	});

	model.items.hasMany(modules.dataModel.itemStrings, {
		foreignKey: "itemTemplateId",
		sourceKey: "itemTemplateId",
		as: "strings"
	});

	// info
	model.info.hasMany(model.items, {
		foreignKey: "boxId",
		sourceKey: "id",
		as: "item"
	});

	return model;
};