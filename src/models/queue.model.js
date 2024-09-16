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
 * @param {modules} modules
 */
module.exports = async (sequelize, DataTypes, syncTables, modules) => {
	const model = {
		tasks: require("./queue/queueTasks.model")(sequelize, DataTypes)
	};

	if (syncTables) {
		await model.tasks.sync();
	}

	return model;
};