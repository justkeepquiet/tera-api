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
	sequelize.define("report_characters", {
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
		serverId: {
			type: DataTypes.INTEGER(11),
			allowNull: false
		},
		characterId: {
			type: DataTypes.INTEGER(11),
			allowNull: false
		},
		name: {
			type: DataTypes.STRING(64)
		},
		classId: {
			type: DataTypes.INTEGER(11)
		},
		genderId: {
			type: DataTypes.INTEGER(11)
		},
		raceId: {
			type: DataTypes.INTEGER(11)
		},
		level: {
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
				name: "characterId",
				unique: false,
				fields: ["characterId"]
			},
			{
				name: "reportTime",
				unique: false,
				fields: ["reportTime"]
			}
		]
	})
;