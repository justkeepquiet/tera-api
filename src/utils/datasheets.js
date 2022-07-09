"use strict";

/**
 * @typedef {object} datasheets
 * @property {Map<any, any>[]} StrSheet_AccountBenefit
 * @property {Map<any, any>[]} StrSheet_Dungeon
 * @property {[][]} StrSheet_Creature
 */

const DatasheetLoader = require("./datasheetLoader");

module.exports = ({ logger }) => {
	const loader = new DatasheetLoader(logger);

	// StrSheet_AccountBenefit
	loader.add("StrSheet_AccountBenefit", data => {
		const result = new Map();

		data.forEach(element => {
			if (element.attributes.id < 1999) {
				result.set(Number(element.attributes.id), element.attributes.string);
			}
		});

		return { result, length: data.length };
	});

	// StrSheet_Dungeon
	loader.add("StrSheet_Dungeon", data => {
		const result = new Map();

		data.forEach(element =>
			result.set(Number(element.attributes.id), element.attributes.string)
		);

		return { result, length: data.length };
	});

	// StrSheet_Creature
	loader.add("StrSheet_Creature", data => {
		let length = 0;
		const result = [];

		data.forEach(huntingZone => {
			if (!huntingZone.elements) return;

			length += huntingZone.elements.length;
			huntingZone.elements.forEach(string => {
				if (!huntingZone.attributes) return;

				result.push({
					huntingZoneId: huntingZone.attributes.id, ...string.attributes
				});
			});
		});

		return { result, length };
	});

	return loader.final();
};