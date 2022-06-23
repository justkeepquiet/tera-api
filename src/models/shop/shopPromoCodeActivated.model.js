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
	sequelize.define("shop_promocode_activated", {
		id: {
			type: DataTypes.INTEGER,
			primaryKey: true,
			autoIncrement: true
		},
		promoCodeId: {
			type: DataTypes.INTEGER,
			unique: "promoCodeId"
		},
		accountDBID: {
			type: DataTypes.BIGINT(20),
			unique: "promoCodeId"
		},
		createdAt: {
			type: DataTypes.DATE
		}
	})
;