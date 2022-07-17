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
	sequelize.define("account_characters", {
		characterId: {
			type: DataTypes.INTEGER,
			primaryKey: true
		},
		serverId: {
			type: DataTypes.INTEGER,
			primaryKey: true
		},
		accountDBID: {
			type: DataTypes.BIGINT,
			primaryKey: true
		},
		name: {
			type: DataTypes.STRING(64)
		},
		classId: {
			type: DataTypes.INTEGER
		},
		genderId: {
			type: DataTypes.INTEGER
		},
		raceId: {
			type: DataTypes.INTEGER
		},
		level: {
			type: DataTypes.INTEGER
		}
	})
;