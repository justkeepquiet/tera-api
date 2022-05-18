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
	sequelize.define("server_maintenance", {
		id: {
			type: DataTypes.INTEGER(11),
			primaryKey: true
		},
		startTime: {
			type: DataTypes.TIME
		},
		endTime: {
			type: DataTypes.TIME
		},
		description: {
			type: DataTypes.STRING
		}
	})
;