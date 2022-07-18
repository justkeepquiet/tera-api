"use strict";

/**
* @typedef {import("../server.model").Sequelize} Sequelize
* @typedef {import("../server.model").DataTypes} DataTypes
*/

/**
* @param {Sequelize} sequelize
* @param {DataTypes} DataTypes
*/
module.exports = (sequelize, DataTypes) =>
	sequelize.define("server_maintenance", {
		id: {
			type: DataTypes.INTEGER(11),
			primaryKey: true,
			autoIncrement: true,
			allowNull: false
		},
		startTime: {
			type: DataTypes.DATE
		},
		endTime: {
			type: DataTypes.DATE
		},
		description: {
			type: DataTypes.STRING
		}
	})
;