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
	sequelize.define("data_item_templates", {
		itemTemplateId: {
			type: DataTypes.BIGINT(20),
			primaryKey: true,
			autoIncrement: true,
			allowNull: false
		},
		icon: {
			type: DataTypes.TEXT(255),
			allowNull: false
		},
		rareGrade: {
			type: DataTypes.INTEGER(11),
			allowNull: false
		},
		requiredLevel: {
			type: DataTypes.INTEGER(11)
		},
		requiredClass: {
			type: DataTypes.TEXT(255)
		},
		requiredGender: {
			type: DataTypes.TEXT(255)
		},
		requiredRace: {
			type: DataTypes.TEXT(255)
		},
		tradable: {
			type: DataTypes.TINYINT(4)
		},
		warehouseStorable: {
			type: DataTypes.TINYINT(4)
		}
	})
;