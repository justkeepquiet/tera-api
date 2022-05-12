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
	sequelize.define("account_characters", {
		"accountDBID": {
			"type": DataTypes.INTEGER,
			"primaryKey": true
		},
		"serverId": {
			"type": DataTypes.INTEGER,
			"primaryKey": true
		},
		"charCount": {
			"type": DataTypes.INTEGER
		}
	})
;