"use strict";

// WARNING!
// Do not make changes to this list unless you know what you are doing!
// CHANGES MADE ARE APPLIED ONLY AFTER THE PROCESS IS RESTARTED.

const env = require("../src/utils/env");

// The language code to use by default if not determined.
module.exports.defaultLanguage = env.string("API_PORTAL_LOCALE");

// The locale codes to use by default if not determined.
module.exports.defaultLocales = [module.exports.defaultLanguage];

// The client region code to use by default if not determined.
module.exports.defaultRegion = env.string("API_PORTAL_CLIENT_DEFAULT_REGION");

// This list is responsible for converting language to region and back. Also, this list
// determines which languages the Launcher and SLS will support (including Server Strings).
//
// Properties:
//  "language" - Country language code used in the database, locale files and flags (ISO 3166-1 alpha-2 based).
//  "locales" - Locale codes for matching the language (ICU based).
//  "region" - Localization code used by the game (ISO 3166-1 alpha-3 based).
module.exports.localizations = [
	// United Kingdom (EU)
	{
		language: "en",
		locales: ["en", "en-GB"],
		region: "EUR"
	},

	// United States
	{
		language: "us",
		locales: ["en", "en-US"],
		region: "USA"
	},

	// Germany
	{
		language: "de",
		locales: ["de", "de-DE"],
		region: "GER"
	},

	// France
	{
		language: "fr",
		locales: ["fr", "fr-FR"],
		region: "FRA"
	},

	// Japan
	{
		language: "jp",
		locales: ["ja", "ja-JP"],
		region: "JPN"
	},

	// South Korea
	{
		language: "kr",
		locales: ["ko", "ko-KR"],
		region: "KOR"
	},

	// Russia
	{
		language: "ru",
		locales: ["ru", "ru-RU"],
		region: "RUS"
	},

	// Sweden
	{
		language: "se",
		locales: ["sw", "sw-SE"],
		region: "SE"
	},

	// Thailand
	{
		language: "th",
		locales: ["th", "th-TH"],
		region: "THA"
	},

	// China
	{
		language: "cn",
		locales: ["zh", "zh-CN"],
		region: "CHN"
	},

	// Taiwan
	{
		language: "tw",
		locales: ["zh", "zh-TW"],
		region: "TW"
	},

	// International
	{
		language: "en",
		locales: ["en"],
		region: "INT"
	}
];