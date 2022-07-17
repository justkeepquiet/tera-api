"use strict";

/**
 * @typedef {import("../app").Sequelize} Sequelize
 * @typedef {import("../app").DataTypes} DataTypes
 *
 * @typedef {object} accountModel
 * @property {import("sequelize").ModelCtor<Model<any, any>>} info
 * @property {import("sequelize").ModelCtor<Model<any, any>>} bans
 * @property {import("sequelize").ModelCtor<Model<any, any>>} characters
 * @property {import("sequelize").ModelCtor<Model<any, any>>} benefits
 * @property {import("sequelize").ModelCtor<Model<any, any>>} online
 */

/**
 * @param {Sequelize} sequelize
 * @param {DataTypes} DataTypes
 */
module.exports = (sequelize, DataTypes) => ({
	info: require("./account/accountInfo.model")(sequelize, DataTypes),
	bans: require("./account/accountBans.model")(sequelize, DataTypes),
	characters: require("./account/accountCharacters.model")(sequelize, DataTypes),
	benefits: require("./account/accountBenefits.model")(sequelize, DataTypes),
	online: require("./account/accountOnline.model")(sequelize, DataTypes)
});