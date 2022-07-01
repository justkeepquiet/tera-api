"use strict";

const fs = require("fs");
const path = require("path");
const logger = require("./logger");
const datasheetHelper = require("./datasheetHelper");

const accountBenefits = {};
const locales = fs.readdirSync(path.join(__dirname, "..", "..", "data", "datasheets"));

locales.forEach(locale => {
	accountBenefits[locale] = new Map();

	datasheetHelper.loadXml("StrSheet_AccountBenefit", locale).then(data =>
		data.forEach(entry => {
			if (entry.id < 1999) {
				accountBenefits[locale].set(Number(entry.id), entry.string);
			}
		})
	).catch(err =>
		logger.error(err.toString())
	);
});

module.exports.accountBenefits = accountBenefits;