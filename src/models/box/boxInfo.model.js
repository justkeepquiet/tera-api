"use strict";

/**
* @typedef {import("../box.model").Sequelize} Sequelize
* @typedef {import("../box.model").DataTypes} DataTypes
*/

/**
* @param {Sequelize} sequelize
* @param {DataTypes} DataTypes
*/
module.exports = (sequelize, DataTypes) =>
	sequelize.define("box_info", {
		id: {
			type: DataTypes.BIGINT,
			primaryKey: true,
			autoIncrement: true
		},
		icon: {
			type: DataTypes.TEXT(255)
		},
		title: {
			type: DataTypes.TEXT(1024)
		},
		content: {
			type: DataTypes.TEXT(1024)
		},
		days: {
			type: DataTypes.INTEGER
		},
		createdAt: {
			type: DataTypes.DATE
		},
		updatedAt: {
			type: DataTypes.DATE
		}
	})
;