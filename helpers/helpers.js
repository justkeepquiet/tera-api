"use strict";

/**
* @typedef {import("sequelize").Model} Model
*/

/**
* @param {Model[]} characters
* @param {string} field1
* @param {string} field2
* @return {string}
*/
module.exports.getCharCountString = (characters, field1, field2) =>
	characters.map((c, i) => `${i}|${c.get(field1)},${c.get(field2)}`).join("|").concat("|")
;

/**
* @param {Model[]} benefits
* @param {string} field1
* @param {string} field2
* @return {Number[][]}
*/
module.exports.getBenefitsArray = (benefits, field1, field2) =>
	benefits.map(b =>
		[b.get(field1), Math.floor((new Date(b.get(field2)).getTime() - Date.now()) / 1000)]
	)
;
