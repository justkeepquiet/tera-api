"use strict";

/**
* @typedef {import("sequelize").Model} Model
* @typedef {import("express").Request} Request
* @typedef {import("winston").Logger} Logger
* @typedef {import("i18n").__} __
*/

const crypto = require("crypto");
const validationResult = require("express-validator").validationResult;
const logger = require("../utils/logger");

/**
* @param {string} path
* @return {*}
*/
module.exports.requireReload = path => {
	delete require.cache[require.resolve(path)];
	return require(path);
};

/**
* @param {[]} functions
* @param {Number} index
* @return {Promise}
*/
module.exports.chainPromise = (functions, index = 0) => {
	if (functions[index] !== undefined) {
		return functions[index]().then(() => module.exports.chainPromise(functions, index + 1));
	}
};

/**
* @param {string} string
* @return {string}
*/
module.exports.formatStrsheet = string =>
	(string || "").replace(/\$BR/g, "<br>")
		.replace(/\$H_W_GOOD/g, "<span style=\"color: #2478ff\">")
		.replace(/\$H_W_BAD/g, "<span style=\"color: #ff0000\">")
		.replace(/\$COLOR_END/g, "</span>")
		.replace(/\$value(\d{0,})/g, "X")
		.replace(/\$time/g, "T")
;

/**
* @param {__} __
* @param {number} seconds
* @return {string}
*/
module.exports.secondsToDhms = (__, seconds) => {
	const d = Math.floor(Number(seconds) / (3600 * 24));
	const h = Math.floor(Number(seconds) % (3600 * 24) / 3600);
	const m = Math.floor(Number(seconds) % 3600 / 60);
	const s = Math.floor(Number(seconds) % 60);

	const r = [];

	if (d > 0) r.push(`${d} ${__("d.")}`);

	if (r.length === 0) {
		if (h > 0) r.push(`${h} ${__("hr.")}`);
		if (m > 0) r.push(`${m} ${__("min.")}`);

		if (r.length === 0)
			r.push(`${s} ${__("sec.")}`);
	}

	return r.join(" ");
};

/**
* @param {string} region
* @return {Object[]}
*/
module.exports.regionToLanguage = region =>
	({
		CHN: "cn",
		EUR: "en",
		FRA: "fr",
		GER: "de",
		INT: "en",
		JPN: "jp",
		KOR: "kr",
		RUS: "ru",
		SE: "se",
		THA: "th",
		TW: "tw",
		USA: "en"
	}[region.toUpperCase()] || "en")
;

/**
 * @param {string} language
 * @return {Object[]}
 */
module.exports.languageToRegion = language =>
	({
		cn: "CHN",
		en: "EUR",
		"en-GB": "EUR",
		"en-US": "USA",
		fr: "FRA",
		de: "GER",
		jp: "JPN",
		kr: "KOR",
		ru: "RUS",
		se: "SE",
		th: "THA",
		tw: "TW"
	}[language.toLowerCase()] || "EUR")
;

/**
* @return {Object[]}
*/
module.exports.getClientRegions = () => {
	const regions = [];

	Object.keys(process.env).forEach(key => {
		const found = key.match(/API_PORTAL_CLIENT_REGIONS_([A-Z]+)$/);

		if (found) {
			regions.push({
				region: found[1],
				name: process.env[key],
				locale: module.exports.regionToLanguage(found[1])
			});
		}
	});

	return regions;
};

/**
* @return {Object[]}
*/
module.exports.getClientLocales = () =>
	module.exports.getClientRegions().map(r => r.locale)
;

/**
* @return {Map}
*/
module.exports.getInitialBenefits = () => {
	const initialBenefits = new Map();

	Object.keys(process.env).forEach(key => {
		const found = key.match(/API_PORTAL_INITIAL_BENEFIT_ID_(\d+)_DAYS$/);

		if (found) {
			const days = Number(process.env[key]);

			if (days > 0) {
				initialBenefits.set(found[1], Math.min(days, 3600));
			}
		}
	});

	return initialBenefits;
};

/**
* @param {Model[]} characters
* @param {Number} lastLoginServer
* @param {string} field1
* @param {string} field2
* @return {string}
*/
module.exports.getCharCountString = (characters, lastLoginServer, field1, field2) =>
	`${lastLoginServer || 0}|`.concat(characters.map(c => `${c.get(field1)},${c.get(field2)}`).join("|")).concat("|")
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
* @param {Logger} customLogger
*/
module.exports.validationResultLog = (request, customLogger) => {
	const result = validationResult(request);

	if (!result.isEmpty()) {
		(customLogger || logger).warn("Validation failed: ".concat(result.array().map(e => `${e.param}="${e.msg}"`).join(", ")));
	}

	return result;
};

/**
* @param {string[]} array
* @return {string}
*/
module.exports.serializeRange = array =>
	array.join("; ")
;

/**
* @param {string} string
* @return {string[]}
*/
module.exports.unserializeRange = string =>
	string.split(";").map(e => e.trim() || null).filter(e => e !== null)
;

/**
* @return {array[]}
*/
module.exports.getPromocodeFunctionsNames = () =>
	Object.keys(module.exports.requireReload("../../config/promoCode"))
;

/**
* @param {number} permission
* @return {string}
*/
module.exports.permissionToString = permission =>
	"0x".concat(parseInt(permission, 10).toString(16).padStart(8, "0"))
;

/**
* @param {string} string
* @return {number}
*/
module.exports.stringToPermission = string =>
	parseInt(string, 16)
;

/**
* @param {string} password
* @return {string}
*/
module.exports.getPasswordString = password => {
	let passwordString = password;

	if (/^true$/i.test(process.env.API_PORTAL_USE_SHA512_PASSWORDS)) {
		passwordString = crypto.createHash("sha512").update(process.env.API_PORTAL_USE_SHA512_PASSWORDS_SALT + password).digest("hex");
	}

	return passwordString;
};