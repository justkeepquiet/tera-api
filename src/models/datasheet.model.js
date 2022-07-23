"use strict";

/**
 * @typedef {object[]} data
 *
 * @typedef {object} datasheetModel
 * @property {Map[]} strSheetAccountBenefit
 * @property {Map[]} strSheetDungeon
 * @property {[][]} strSheetCreature
 */

const DatasheetLoader = require("../lib/datasheetLoader");

module.exports = logger => {
	const datasheetLoader = new DatasheetLoader(logger);

	datasheetLoader.add("strSheetAccountBenefit", "StrSheet_AccountBenefit", require("./datasheet/strSheetAccountBenefit.model"));
	datasheetLoader.add("strSheetDungeon", "StrSheet_Dungeon", require("./datasheet/strSheetDungeon.model"));
	datasheetLoader.add("strSheetCreature", "StrSheet_Creature", require("./datasheet/strSheetCreature.model"));

	return datasheetLoader.final();
};