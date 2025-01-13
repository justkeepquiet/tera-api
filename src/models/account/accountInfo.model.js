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
			type: DataTypes.BIGINT(20),
			primaryKey: true,
			autoIncrement: true,
			allowNull: false
		},
		userName: {
			type: DataTypes.STRING(64),
			allowNull: false,
			unique: true
		},
		passWord: {
			type: DataTypes.STRING(128),
			allowNull: false
		},
		authKey: {
			type: DataTypes.STRING(128),
			unique: true
		},
		email: {
			type: DataTypes.STRING(64),
			allowNull: false,
			unique: true
		},
		registerTime: {
			type: DataTypes.DATE,
			defaultValue: DataTypes.NOW
		},
		lastLoginTime: {
			type: DataTypes.DATE
		},
		lastLoginIP: {
			type: DataTypes.STRING(64)
		},
		lastLoginServer: {
			type: DataTypes.INTEGER(11)
		},
		playTimeLast: {
			type: DataTypes.INTEGER(11),
			allowNull: false,
			defaultValue: 0
		},
		playTimeTotal: {
			type: DataTypes.INTEGER(11),
			allowNull: false,
			defaultValue: 0
		},
		playCount: {
			type: DataTypes.INTEGER(11),
			allowNull: false,
			defaultValue: 0
		},
		permission: {
			type: DataTypes.INTEGER(11),
			allowNull: false,
			defaultValue: 0
		},
		privilege: {
			type: DataTypes.INTEGER(11),
			allowNull: false,
			defaultValue: 0
		},
		language: {
			type: DataTypes.STRING(3)
		}
	}, {
		indexes: [
			{
				name: "userName",
				unique: true,
				fields: ["userName"]
			},
			{
				name: "passWord",
				unique: false,
				fields: ["passWord"]
			},
			{
				name: "authKey",
				unique: true,
				fields: ["authKey"]
			},
			{
				name: "email",
				unique: true,
				fields: ["email"]
			}
		]
	})
;