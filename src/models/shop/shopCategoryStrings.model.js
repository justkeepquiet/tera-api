"use strict";

/**
* @typedef {import("../shop.model").Sequelize} Sequelize
* @typedef {import("../shop.model").DataTypes} DataTypes
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