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
			unique: "id",
			autoIncrement: true,
			allowNull: false
		},
		language: {
			type: DataTypes.STRING(3),
			primaryKey: true,
			allowNull: false
		},
		promoCodeId: {
			type: DataTypes.INTEGER(11),
			primaryKey: true,
			allowNull: false
		},
		description: {
			type: DataTypes.STRING(2048)
		}
	})
;