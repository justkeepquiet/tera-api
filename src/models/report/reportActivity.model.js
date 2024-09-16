"use strict";

/**
* @typedef {import("../report.model").Sequelize} Sequelize
* @typedef {import("../report.model").DataTypes} DataTypes
*/

/**
* @param {Sequelize} sequelize
* @param {DataTypes} DataTypes
*/
module.exports = (sequelize, DataTypes) =>
	sequelize.define("report_activity", {
		id: {
			type: DataTypes.BIGINT(20),
			primaryKey: true,
			autoIncrement: true,
			allowNull: false
		},
		accountDBID: {
			type: DataTypes.BIGINT(20)
		},
		serverId: {
			type: DataTypes.INTEGER(11)
		},
		ip: {
			type: DataTypes.STRING(64)
		},
		playTime: {
			type: DataTypes.INTEGER(11)
		},
		reportType: {
			type: DataTypes.INTEGER(11)
		},
		reportTime: {
			type: DataTypes.DATE,
			defaultValue: DataTypes.NOW
		}
	}, {
		indexes: [
			{
				name: "accountDBID",
				unique: false,
				fields: ["accountDBID"]
			},
			{
				name: "serverId",
				unique: false,
				fields: ["serverId"]
			},
			{
				name: "reportType",
				unique: false,
				fields: ["reportType"]
			},
			{
				name: "reportTime",
				unique: false,
				fields: ["reportTime"]
			}
		]
	})
;