"use strict";

/**
* @typedef {import("../account.model").Sequelize} Sequelize
* @typedef {import("../account.model").DataTypes} DataTypes
*/

/**
* @param {Sequelize} sequelize
* @param {DataTypes} DataTypes
*/
module.exports = (sequelize, DataTypes) =>
	sequelize.define("account_reset_password", {
		token: {
			type: DataTypes.STRING(128),
			primaryKey: true,
			allowNull: false
		},
		email: {
			type: DataTypes.STRING(64),
			primaryKey: true,
			allowNull: false
		},
		code: {
			type: DataTypes.STRING(6)
		},
		failsCount: {
			type: DataTypes.INTEGER(11),
			allowNull: false,
			defaultValue: 0
		}
	}, {
		indexes: [
			{
				name: "code",
				unique: false,
				fields: ["code"]
			}
		],
		timestamps: true,
		updatedAt: false
	})
;