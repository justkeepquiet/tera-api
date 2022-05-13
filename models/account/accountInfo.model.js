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
	sequelize.define("account_info", {
		"accountDBID": {
			"type": DataTypes.INTEGER,
			"primaryKey": true
		},
		"userName": {
			"type": DataTypes.STRING,
			"primaryKey": true
		},
		"passWord": {
			"type": DataTypes.STRING
		},
		"RMB": {
			"type": DataTypes.INTEGER
		},
		"authKey": {
			"type": DataTypes.STRING
		},
		"registerTime": {
			"type": DataTypes.TIME
		},
		"lastLoginTime": {
			"type": DataTypes.TIME
		},
		"lastLoginIP": {
			"type": DataTypes.STRING
		},
		"playTimeLast": {
			"type": DataTypes.INTEGER
		},
		"playTimeTotal": {
			"type": DataTypes.INTEGER
		},
		"playCount": {
			"type": DataTypes.INTEGER
		},
		"isBlocked": {
			"type": DataTypes.INTEGER
		},
		"privilege": {
			"type": DataTypes.INTEGER
		}
	})
;