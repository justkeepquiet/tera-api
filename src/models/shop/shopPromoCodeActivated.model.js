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