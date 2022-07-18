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
			type: DataTypes.INTEGER(11),
			primaryKey: true,
			autoIncrement: true,
			allowNull: false
		},
		promoCode: {
			type: DataTypes.STRING(255),
			allowNull: false
		},
		function: {
			type: DataTypes.STRING(255),
			allowNull: false
		},
		validAfter: {
			type: DataTypes.DATE,
			allowNull: false
		},
		validBefore: {
			type: DataTypes.DATE,
			allowNull: false
		},
		active: {
			type: DataTypes.TINYINT(4),
			allowNull: false,
			defaultValue: 1
		},
		createdAt: {
			type: DataTypes.DATE,
			defaultValue: DataTypes.NOW
		},
		updatedAt: {
			type: DataTypes.DATE,
			defaultValue: DataTypes.NOW,
			onUpdate: DataTypes.NOW
		}
	})
;