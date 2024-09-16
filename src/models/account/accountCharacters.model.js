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
			type: DataTypes.INTEGER(11),
			primaryKey: true,
			allowNull: false
		},
		serverId: {
			type: DataTypes.INTEGER(11),
			primaryKey: true,
			allowNull: false
		},
		accountDBID: {
			type: DataTypes.BIGINT(20),
			primaryKey: true,
			allowNull: false
		},
		name: {
			type: DataTypes.STRING(64)
		},
		classId: {
			type: DataTypes.INTEGER(11)
		},
		genderId: {
			type: DataTypes.INTEGER(11)
		},
		raceId: {
			type: DataTypes.INTEGER(11)
		},
		level: {
			type: DataTypes.INTEGER(11)
		}
	}, {
		indexes: [
			{
				name: "name",
				unique: false,
				fields: ["name"]
			}
		]
	})
;