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
	sequelize.define("account_bans", {
		id: {
			type: DataTypes.BIGINT(20),
			primaryKey: true,
			autoIncrement: true,
			allowNull: false
		},
		accountDBID: {
			type: DataTypes.BIGINT(20),
			allowNull: false
		},
		startTime: {
			type: DataTypes.DATE,
			allowNull: false
		},
		endTime: {
			type: DataTypes.DATE,
			allowNull: false
		},
		ip: {
			type: DataTypes.TEXT
		},
		description: {
			type: DataTypes.TEXT
		},
		active: {
			type: DataTypes.BOOLEAN,
			allowNull: false,
			defaultValue: true
		}
	}, {
		indexes: [
			{
				name: "accountDBID",
				unique: false,
				fields: ["accountDBID"]
			},
			{
				name: "startTime",
				unique: false,
				fields: ["startTime"]
			},
			{
				name: "endTime",
				unique: false,
				fields: ["endTime"]
			},
			{
				name: "ip",
				unique: false,
				fields: ["ip"],
				type: "FULLTEXT"
			},
			{
				name: "active",
				unique: false,
				fields: ["active"]
			}
		]
	})
;