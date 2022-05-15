"use strict";

const validationResult = require("express-validator").validationResult;
const logger = require("../utils/logger");

/**
* @typedef {import("sequelize").Model} Model
* @typedef {import("express").Request} Request
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

/**
* @param {Request} request
*/
module.exports.validationResultLog = request => {
	const result = validationResult(request);

	if (!result.isEmpty()) {
		logger.warn("Validation failed: ".concat(result.array().map(e => `${e.param}="${e.msg}"`).join(", ")));
	}

	return result;
};
