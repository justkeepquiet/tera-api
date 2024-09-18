"use strict";

/**
 * @typedef {object[]} data
 */

/**
 * @param {data} data
 */
module.exports = data => {
	const result = new Map();

	data.forEach(element => {
		if (element.attributes.id < 1999) {
			result.set(Number(element.attributes.id), element.attributes.string);
		}
	});

	return result;
};