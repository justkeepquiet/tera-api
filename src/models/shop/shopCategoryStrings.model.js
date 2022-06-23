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
	sequelize.define("shop_category_strings", {
		id: {
			type: DataTypes.BIGINT,
			primaryKey: true,
			autoIncrement: true
		},
		language: {
			type: DataTypes.STRING(3),
			unique: "unique"
		},
		categoryId: {
			type: DataTypes.INTEGER,
			unique: "unique"
		},
		title: {
			type: DataTypes.STRING(1024)
		},
		description: {
			type: DataTypes.TEXT
		}
	})
;