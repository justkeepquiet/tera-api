"use strict";

/**
 * @typedef {object} datasheets
 * @property {new () => Map<any, any>} accountBenefits
 */

const fs = require("fs");
const path = require("path");
const datasheetHelper = require("./datasheetHelper");

const locales = fs.readdirSync(path.join(__dirname, "..", "..", "data", "datasheets"));

module.exports = ({ logger }) => new Promise(resolve => {
	const accountBenefits = {};
	const promises = [];

	logger.info("Loading datasheets...");

	locales.forEach(locale => {
		accountBenefits[locale] = new Map();

		promises.push(datasheetHelper.loadXml("StrSheet_AccountBenefit", locale).then(data => {
			data.forEach(entry => {
				if (entry.id < 1999) {
					accountBenefits[locale].set(Number(entry.id), entry.string);
				}
			});

			logger.info(`Loaded: ${locale}:StrSheet_AccountBenefit, elements count: ${data.length}`);
		}));
	});

	return Promise.all(promises)
		.then(() => resolve({ accountBenefits }));
});