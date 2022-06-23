"use strict";

/**
* @typedef {import("sequelize").Sequelize} Sequelize
* @typedef {import("sequelize/types")} DataTypes
*/

/**
* @param {Sequelize} sequelize
* @param {DataTypes} DataTypes
*/
module.exports = (sequelize, DataTypes) =>
	sequelize.define("shop_item_templates", {
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