"use strict";

/**
* @typedef {import("sequelize").Model} Model
* @typedef {import("express").Request} Request
* @typedef {import("winston").Logger} Logger
* @typedef {import("i18n").__} __
* @typedef {import("../lib/configManager")} ConfigManager
* @typedef {import("../lib/localizationManager")} LocalizationManager
*/

const fs = require("fs");
const path = require("path");
const crypto = require("crypto");
const CRC32 = require("crc-32");
const validationResult = require("express-validator").validationResult;
const env = require("../utils/env");
const logger = require("../utils/logger");

/**
* @param {string} filePath
* @return {*}
*/
module.exports.requireReload = filePath => {
	delete require.cache[require.resolve(filePath)];
	return require(filePath);
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
 * @param {string} string
 * @param {LocalizationManager} localization
 * @return {string[]}
 */
module.exports.getSupportedLanguagesByDirectory = (directory, localization) => {
	const translations = module.exports.loadTranslations(directory, []);
	const clientLanguages = localization.listClientLanguages();

	return Object.keys(translations).filter(language =>
		clientLanguages.includes(language)
	);
};

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
		(customLogger || logger).debug("Validation failed: ".concat(result.array()
			.map(e => `${e.location}:${e.param}="${e.msg}"`).join(", ")
		));
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
* @param {ConfigManager} config
* @return {array[]}
*/
module.exports.getPromocodeFunctionsNames = config =>
	Object.keys(config?.get("promoCode") || {})
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

	if (env.bool("API_PORTAL_USE_SHA512_PASSWORDS")) {
		passwordString = crypto.createHash("sha512").update(env.string("API_PORTAL_USE_SHA512_PASSWORDS_SALT") + password).digest("hex");
	}

	return passwordString;
};

/**
 * @param {string} secretWord
 */
module.exports.createKeyFromString = async secretWord => {
	const encoder = new TextEncoder();
	const keyData = encoder.encode(secretWord);
	const hashBuffer = await crypto.subtle.digest("SHA-256", keyData);

	return new Uint8Array(hashBuffer);
};

/**
* @return {string}
*/
module.exports.generateVerificationCode = () =>
	Math.floor(100000 + Math.random() * 900000).toString().padStart(6, "0")
;

/**
 * @param {number} length
 * @return {string}
 */
module.exports.generateRandomWord = length => {
	const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
	let result = "";
	for (let i = 0; i < length; i++) {
		const randomIndex = Math.floor(Math.random() * characters.length);
		result += characters[randomIndex];
	}
	return result;
};

/**
* @param {string} email
* @return {string}
*/
module.exports.maskEmail = email => {
	const [localPart, domain] = email.split("@");
	const hiddenLocal = localPart.slice(0, 2) + "*".repeat(localPart.length - 2);
	const [domainName, domainSuffix] = domain.split(".");
	const hiddenDomain = `${domainName[0] + "*".repeat(domainName.length - 1)}.${domainSuffix}`;
	return `${hiddenLocal}@${hiddenDomain}`;
};

/**
* @param {directory} directory
* @param {string[]} exts
* @return {string[]}
*/
module.exports.getFilenamesFromDirectory = (directory, exts = [".png", ".jpg"]) => {
	const files = fs.readdirSync(directory);
	const filteredFiles = files.filter(file =>
		exts.includes(path.extname(file).toLowerCase())
	);
	return filteredFiles;
};

/**
* @param {number} number
* @param {number} percentage
* @return {number}
*/
module.exports.subtractPercentage = (number, percentage) =>
	Math.round(number - (number * (percentage / 100)))
;

/**
* @param {import("fs").PathLike} filePath
* @return {number}
*/
module.exports.getRevision = filePath => {
	const stats = fs.statSync(filePath);

	if (stats.isFile()) {
		const mtimeMs = stats.mtimeMs;
		return CRC32.str(mtimeMs.toString());
	}

	if (stats.isDirectory()) {
		let mtimeSum = "";

		const calculateDirectoryCrc = dirPath => {
			const files = fs.readdirSync(dirPath);

			files.forEach(file => {
				const fullPath = path.join(dirPath, file);
				const fileStats = fs.statSync(fullPath);

				if (fileStats.isFile()) {
					mtimeSum += fileStats.mtimeMs.toString();
				} else if (fileStats.isDirectory()) {
					calculateDirectoryCrc(fullPath);
				}
			});
		};

		calculateDirectoryCrc(filePath);

		return CRC32.str(mtimeSum);
	}

	throw new Error("The specified path is not a file or directory.");
};

/**
* @param {string} localesDir
* @param {string[]} additionalDirs
* @return {object}
*/
module.exports.loadTranslations = (localesDir, additionalDirs = []) => {
	const translations = {};
	const locales = fs.readdirSync(localesDir).filter(file => file.endsWith(".json"));

	locales.forEach(localeFile => {
		const locale = path.basename(localeFile, ".json");
		translations[locale] = {};

		const mainFilePath = path.join(localesDir, localeFile);

		if (fs.existsSync(mainFilePath)) {
			Object.assign(translations[locale], JSON.parse(fs.readFileSync(mainFilePath, "utf8")));
		}

		additionalDirs.forEach(dir => {
			const additionalFilePath = path.join(dir, localeFile);
			if (fs.existsSync(additionalFilePath)) {
				Object.assign(translations[locale], JSON.parse(fs.readFileSync(additionalFilePath, "utf8")));
			}
		});
	});

	return translations;
};

/**
* @param {string} directory
* @param {string} file
* @return {bool}
*/
module.exports.isSafePath = (directory, file) =>
	path.resolve(directory, file).startsWith(path.resolve(directory) + path.sep)
;