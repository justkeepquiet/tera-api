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
			type: DataTypes.BIGINT(20),
			primaryKey: true,
			autoIncrement: true,
			allowNull: false
		},
		icon: {
			type: DataTypes.STRING(255),
			allowNull: false
		},
		title: {
			type: DataTypes.STRING(1024),
			allowNull: false
		},
		content: {
			type: DataTypes.STRING(2048),
			allowNull: false
		},
		days: {
			type: DataTypes.INTEGER(11),
			allowNull: false
		}
	}, {
		timestamps: true
	})
;