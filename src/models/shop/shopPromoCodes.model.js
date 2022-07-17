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
	sequelize.define("shop_promocodes", {
		promoCodeId: {
			type: DataTypes.INTEGER,
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