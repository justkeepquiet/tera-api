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
	sequelize.define("report_characters", {
		accountDBID: {
			type: DataTypes.BIGINT,
			primaryKey: true
		},
		serverId: {
			type: DataTypes.INTEGER,
			primaryKey: true
		},
		characterId: {
			type: DataTypes.INTEGER,
			primaryKey: true
		},
		name: {
			type: DataTypes.STRING(64)
		},
		classId: {
			type: DataTypes.INTEGER
		},
		genderId: {
			type: DataTypes.INTEGER
		},
		raceId: {
			type: DataTypes.INTEGER
		},
		level: {
			type: DataTypes.INTEGER
		},
		reportType: {
			type: DataTypes.INTEGER
		},
		reportTime: {
			type: DataTypes.DATE
		}
	})
;