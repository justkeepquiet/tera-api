"use strict";

/**
* @typedef {import("sequelize").Sequelize} Sequelize
* @typedef {import("sequelize/types")} DataTypes
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
			type: DataTypes.INTEGER
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
		}
	})
;