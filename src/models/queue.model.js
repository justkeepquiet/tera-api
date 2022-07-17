"use strict";

/**
 * @typedef {import("../app").Sequelize} Sequelize
 * @typedef {import("../app").DataTypes} DataTypes
 *
 * @typedef {object} queueModel
 * @property {import("sequelize").ModelCtor<Model<any, any>>} tasks
 */

/**
 * @param {Sequelize} sequelize
 * @param {DataTypes} DataTypes
 */
module.exports = (sequelize, DataTypes) => ({
	tasks: require("./queue/queueTasks.model")(sequelize, DataTypes)
});