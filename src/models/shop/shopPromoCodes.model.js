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
	sequelize.define("shop_promocodes", {
		promoCodeId: {
			type: DataTypes.DATE,
			primaryKey: true,
			autoIncrement: true
		},
		promoCode: {
			type: DataTypes.STRING(255)
		},
		function: {
			type: DataTypes.STRING(255)
		},
		validAfter: {
			type: DataTypes.DATE
		},
		validBefore: {
			type: DataTypes.DATE
		},
		active: {
			type: DataTypes.TINYINT(4)
		},
		createdAt: {
			type: DataTypes.DATE
		},
		updatedAt: {
			type: DataTypes.DATE
		}
	})
;