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
	sequelize.define("shop_promocode_strings", {
		id: {
			type: DataTypes.BIGINT,
			primaryKey: true,
			autoIncrement: true,
			allowNull: false
		},
		language: {
			type: DataTypes.STRING(3),
			unique: "unique",
			allowNull: false
		},
		promoCodeId: {
			type: DataTypes.INTEGER(11),
			unique: "unique",
			allowNull: false
		},
		description: {
			type: DataTypes.STRING(2048)
		}
	}, {
		indexes: [
			{
				name: "unique",
				unique: true,
				fields: ["language", "promoCodeId"]
			}
		]
	})
;