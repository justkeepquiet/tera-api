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
	sequelize.define("account_info", {
		accountDBID: {
			type: DataTypes.BIGINT,
			primaryKey: true,
			autoIncrement: true
		},
		userName: {
			type: DataTypes.STRING(64),
			primaryKey: true
		},
		passWord: {
			type: DataTypes.STRING(128)
		},
		authKey: {
			type: DataTypes.STRING(128)
		},
		email: {
			type: DataTypes.STRING(64),
			primaryKey: true
		},
		registerTime: {
			type: DataTypes.DATE
		},
		lastLoginTime: {
			type: DataTypes.DATE
		},
		lastLoginIP: {
			type: DataTypes.STRING(64)
		},
		lastLoginServer: {
			type: DataTypes.INTEGER
		},
		playTimeLast: {
			type: DataTypes.INTEGER
		},
		playTimeTotal: {
			type: DataTypes.INTEGER
		},
		playCount: {
			type: DataTypes.INTEGER
		},
		permission: {
			type: DataTypes.INTEGER
		},
		privilege: {
			type: DataTypes.INTEGER
		},
		language: {
			type: DataTypes.STRING(3)
		}
	})
;