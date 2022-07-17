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
			type: DataTypes.BIGINT,
			primaryKey: true
		},
		benefitId: {
			type: DataTypes.INTEGER,
			primaryKey: true
		},
		availableUntil: {
			type: DataTypes.DATE
		}
	})
;