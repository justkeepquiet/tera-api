"use strict";

/**
 * @typedef {import("../app").Sequelize} Sequelize
 * @typedef {import("../app").DataTypes} DataTypes
 *
 * @typedef {object} serverModel
 * @property {import("sequelize").ModelCtor<Model<any, any>>} maintenance
 * @property {import("sequelize").ModelCtor<Model<any, any>>} info
 * @property {import("sequelize").ModelCtor<Model<any, any>>} strings
 */

/**
 * @param {Sequelize} sequelize
 * @param {DataTypes} DataTypes
 */
module.exports = (sequelize, DataTypes) => ({
	maintenance: require("./server/serverMaintenance.model")(sequelize, DataTypes),
	info: require("./server/serverInfo.model")(sequelize, DataTypes),
	strings: require("./server/serverStrings.model")(sequelize, DataTypes)
});