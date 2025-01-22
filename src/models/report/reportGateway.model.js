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
	sequelize.define("report_gateway", {
		id: {
			type: DataTypes.BIGINT,
			primaryKey: true,
			autoIncrement: true,
			allowNull: false
		},
		ip: {
			type: DataTypes.STRING(64)
		},
		endpoint: {
			type: DataTypes.STRING(256)
		},
		payload: {
			type: DataTypes.TEXT
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
				name: "endpoint",
				unique: false,
				fields: ["endpoint"]
			},
			{
				name: "reportTime",
				unique: false,
				fields: ["reportTime"]
			}
		]
	})
;