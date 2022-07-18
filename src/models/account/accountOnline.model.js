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
	sequelize.define("account_online", {
		accountDBID: {
			type: DataTypes.BIGINT(20),
			primaryKey: true,
			allowNull: false
		},
		serverId: {
			type: DataTypes.INTEGER(11),
			primaryKey: true,
			allowNull: false
		},
		createdAt: {
			type: DataTypes.DATE,
			defaultValue: DataTypes.NOW
		}
	})
;