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
			type: DataTypes.INTEGER(11),
			primaryKey: true,
			autoIncrement: true,
			allowNull: false
		},
		language: {
			type: DataTypes.STRING(3),
			unique: "unique",
			allowNull: false
		},
		categoryId: {
			type: DataTypes.INTEGER(11),
			unique: "unique",
			allowNull: false
		},
		title: {
			type: DataTypes.STRING(1024)
		},
		description: {
			type: DataTypes.TEXT
		}
	}, {
		indexes: [
			{
				name: "unique",
				unique: true,
				fields: ["language", "categoryId"]
			}
		]
	})
;