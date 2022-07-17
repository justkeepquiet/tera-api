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
			type: DataTypes.BIGINT,
			primaryKey: true,
			autoIncrement: true
		},
		icon: {
			type: DataTypes.TEXT(255)
		},
		rareGrade: {
			type: DataTypes.INTEGER
		},
		requiredLevel: {
			type: DataTypes.INTEGER
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