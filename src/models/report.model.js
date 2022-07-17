"use strict";

/**
 * @typedef {import("../app").Sequelize} Sequelize
 * @typedef {import("../app").DataTypes} DataTypes
 *
 * @typedef {object} reportModel
 * @property {import("sequelize").ModelCtor<Model<any, any>>} activity
 * @property {import("sequelize").ModelCtor<Model<any, any>>} characters
 * @property {import("sequelize").ModelCtor<Model<any, any>>} cheats
 * @property {import("sequelize").ModelCtor<Model<any, any>>} chronoScrolls
 * @property {import("sequelize").ModelCtor<Model<any, any>>} shopFund
 * @property {import("sequelize").ModelCtor<Model<any, any>>} shopPay
 * @property {import("sequelize").ModelCtor<Model<any, any>>} adminOp
 * @property {import("sequelize").ModelCtor<Model<any, any>>} boxes
 */

/**
 * @param {Sequelize} sequelize
 * @param {DataTypes} DataTypes
 */
module.exports = (sequelize, DataTypes) => ({
	activity: require("./report/reportActivity.model")(sequelize, DataTypes),
	characters: require("./report/reportCharacters.model")(sequelize, DataTypes),
	cheats: require("./report/reportCheats.model")(sequelize, DataTypes),
	chronoScrolls: require("./report/reportChronoScrolls.model")(sequelize, DataTypes),
	shopFund: require("./report/reportShopFund.model")(sequelize, DataTypes),
	shopPay: require("./report/reportShopPay.model")(sequelize, DataTypes),
	adminOp: require("./report/reportAdminOp.model")(sequelize, DataTypes),
	boxes: require("./report/reportBoxes.model")(sequelize, DataTypes)
});