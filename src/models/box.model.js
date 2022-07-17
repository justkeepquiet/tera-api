"use strict";

/**
 * @typedef {import("../app").Sequelize} Sequelize
 * @typedef {import("../app").DataTypes} DataTypes
 *
 * @typedef {object} boxModel
 * @property {import("sequelize").ModelCtor<Model<any, any>>} info
 * @property {import("sequelize").ModelCtor<Model<any, any>>} items
 */

/**
 * @param {Sequelize} sequelize
 * @param {DataTypes} DataTypes
 */
module.exports = (sequelize, DataTypes) => ({
	info: require("./box/boxInfo.model")(sequelize, DataTypes),
	items: require("./box/boxItems.model")(sequelize, DataTypes)
});