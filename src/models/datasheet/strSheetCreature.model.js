"use strict";

/**
 * @typedef {object[]} data
 */

/**
 * @param {data} data
 */
module.exports = data => {
	const result = [];
	let length = 0;

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

	return result;
};