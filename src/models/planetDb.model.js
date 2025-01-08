"use strict";

/**
 * @typedef {import("../app").Sequelize} Sequelize
 * @typedef {import("../app").DataTypes} DataTypes
 *
 * @typedef {object} planetDbModel
 * @property {import("sequelize").ModelCtor<Model<any, any>>} users
 */

module.exports = async (sequelize, DataTypes) => {
	const models = {
		users: require("./planetDb/planetDbUsers.model.js")(sequelize, DataTypes)
	};

	return models;
};