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
			type: DataTypes.BIGINT,
			primaryKey: true,
			autoIncrement: true
		},
		tag: {
			type: DataTypes.STRING(256)
		},
		handler: {
			type: DataTypes.STRING(256)
		},
		arguments: {
			type: DataTypes.TEXT
		},
		status: {
			type: DataTypes.INTEGER
		},
		message: {
			type: DataTypes.TEXT
		},
		createdAt: {
			type: DataTypes.DATE
		}
	})
;