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
 * @param {modules} modules
 */
module.exports = async (sequelize, DataTypes, syncTables, modules) => {
	const model = {
		info: require("./box/boxInfo.model")(sequelize, DataTypes),
		items: require("./box/boxItems.model")(sequelize, DataTypes)
	};

	if (syncTables) {
		await model.info.sync();
		await model.items.sync();
	}

	// info
	model.info.hasMany(model.items, {
		foreignKey: "boxId",
		sourceKey: "id",
		as: "item"
	});

	return model;
};