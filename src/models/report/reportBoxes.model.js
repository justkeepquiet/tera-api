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
	sequelize.define("report_boxes", {
		id: {
			type: DataTypes.BIGINT(20),
			primaryKey: true,
			autoIncrement: true,
			allowNull: false
		},
		boxId: {
			type: DataTypes.BIGINT(20)
		},
		accountDBID: {
			type: DataTypes.BIGINT(20),
			allowNull: false
		},
		serverId: {
			type: DataTypes.INTEGER(11)
		},
		characterId: {
			type: DataTypes.INTEGER(11)
		},
		logType: {
			type: DataTypes.INTEGER(11)
		},
		logId: {
			type: DataTypes.BIGINT(20)
		},
		context: {
			type: DataTypes.TEXT,
			allowNull: false
		},
		createdAt: {
			type: DataTypes.DATE,
			defaultValue: DataTypes.NOW
		}
	}, {
		indexes: [
			{
				name: "boxId",
				unique: false,
				fields: ["boxId"]
			},
			{
				name: "accountDBID",
				unique: false,
				fields: ["accountDBID"]
			},
			{
				name: "logType",
				unique: false,
				fields: ["logType"]
			},
			{
				name: "logId",
				unique: false,
				fields: ["logId"]
			},
			{
				name: "createdAt",
				unique: false,
				fields: ["createdAt"]
			}
		]
	})
;