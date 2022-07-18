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
	sequelize.define("account_benefits", {
		accountDBID: {
			type: DataTypes.BIGINT(20),
			primaryKey: true,
			allowNull: false
		},
		benefitId: {
			type: DataTypes.INTEGER(11),
			primaryKey: true,
			allowNull: false
		},
		availableUntil: {
			type: DataTypes.DATE,
			allowNull: false
		}
	})
;