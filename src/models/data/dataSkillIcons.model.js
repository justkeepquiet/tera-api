"use strict";

/**
* @typedef {import("../data.model").Sequelize} Sequelize
* @typedef {import("../data.model").DataTypes} DataTypes
*/

/**
* @param {Sequelize} sequelize
* @param {DataTypes} DataTypes
*/
module.exports = (sequelize, DataTypes) =>
	sequelize.define("data_skill_icons", {
		skillId: {
			type: DataTypes.BIGINT(20),
			primaryKey: true,
			allowNull: false
		},
		class: {
			type: DataTypes.STRING(255),
			primaryKey: true,
			allowNull: false
		},
		race: {
			type: DataTypes.STRING(255),
			primaryKey: true,
			allowNull: false
		},
		gender: {
			type: DataTypes.STRING(255),
			primaryKey: true,
			allowNull: false
		},
		icon: {
			type: DataTypes.STRING(2048),
			allowNull: false
		}
	})
;