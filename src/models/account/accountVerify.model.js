"use strict";

/**
* @typedef {import("../account.model").Sequelize} Sequelize
* @typedef {import("../account.model").DataTypes} DataTypes
*/

/**
* @param {Sequelize} sequelize
* @param {DataTypes} DataTypes
*/
module.exports = (sequelize, DataTypes) =>
	sequelize.define("account_verify", {
		token: {
			type: DataTypes.STRING(128),
			primaryKey: true,
			allowNull: false
		},
		email: {
			type: DataTypes.STRING(64),
			primaryKey: true,
			allowNull: false
		},
		code: {
			type: DataTypes.STRING(6)
		},
		failsCount: {
			type: DataTypes.INTEGER(11),
			allowNull: false,
			defaultValue: 0
		},
		userName: {
			type: DataTypes.STRING(64)
		},
		passWord: {
			type: DataTypes.STRING(128)
		},
		createdAt: {
			type: DataTypes.DATE,
			defaultValue: DataTypes.NOW
		}
	})
;