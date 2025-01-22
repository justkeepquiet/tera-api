"use strict";

/**
* @typedef {import("../queue.model").Sequelize} Sequelize
* @typedef {import("../queue.model").DataTypes} DataTypes
*/

/**
* @param {Sequelize} sequelize
* @param {DataTypes} DataTypes
*/
module.exports = (sequelize, DataTypes) =>
	sequelize.define("report_queue_tasks", {
		id: {
			type: DataTypes.BIGINT(20),
			primaryKey: true,
			autoIncrement: true,
			allowNull: false
		},
		taskId: {
			type: DataTypes.BIGINT(20)
		},
		tag: {
			type: DataTypes.STRING(256)
		},
		handler: {
			type: DataTypes.STRING(256),
			allowNull: false
		},
		arguments: {
			type: DataTypes.TEXT,
			allowNull: false
		},
		status: {
			type: DataTypes.INTEGER(11),
			allowNull: false
		},
		message: {
			type: DataTypes.TEXT
		},
		reportTime: {
			type: DataTypes.DATE,
			defaultValue: DataTypes.NOW
		}
	}, {
		indexes: [
			{
				name: "taskId",
				unique: false,
				fields: ["taskId"]
			},
			{
				name: "tag",
				unique: false,
				fields: ["tag"]
			},
			{
				name: "handler",
				unique: false,
				fields: ["handler"]
			},
			{
				name: "status",
				unique: false,
				fields: ["status"]
			},
			{
				name: "reportTime",
				unique: false,
				fields: ["reportTime"]
			}
		]
	})
;