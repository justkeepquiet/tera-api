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
	sequelize.define("shop_promocode_strings", {
		id: {
			type: DataTypes.BIGINT,
			unique: "id",
			autoIncrement: true
		},
		language: {
			type: DataTypes.STRING(3),
			primaryKey: true
		},
		promoCodeId: {
			type: DataTypes.INTEGER,
			primaryKey: true
		},
		description: {
			type: DataTypes.STRING(2048)
		}
	})
;