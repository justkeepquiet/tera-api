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
	sequelize.define("shop_product_strings", {
		id: {
			type: DataTypes.BIGINT(20),
			primaryKey: true,
			autoIncrement: true,
			allowNull: false
		},
		language: {
			type: DataTypes.STRING(3),
			unique: "UNIQUE",
			allowNull: false
		},
		productId: {
			type: DataTypes.BIGINT(20),
			unique: "UNIQUE",
			allowNull: false
		},
		title: {
			type: DataTypes.STRING(2048)
		},
		description: {
			type: DataTypes.TEXT
		}
	}, {
		indexes: [
			{
				name: "UNIQUE",
				unique: true,
				fields: ["language", "productId"]
			},
			{
				name: "title",
				unique: false,
				fields: ["title"],
				type: "FULLTEXT"
			},
			{
				name: "description",
				unique: false,
				fields: ["description"],
				type: "FULLTEXT"
			}
		]
	})
;