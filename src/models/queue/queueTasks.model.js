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
	sequelize.define("queue_tasks", {
		id: {
			type: DataTypes.BIGINT(20),
			primaryKey: true,
			autoIncrement: true,
			allowNull: false
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
		}
	}, {
		indexes: [
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
			}
		],
		timestamps: true
	})
;