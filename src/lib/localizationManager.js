"use strict";

/**
 * @typedef {import("../../config/localization.default")} localizationConfig
 */

class LocalizationManager {
	/**
	 * @param {localizationConfig} config
	 */
	constructor(config) {
		this.localizations = config.localizations;

		this.defaultRegion = config.defaultRegion || "EUR";
		this.defaultLocales = config.defaultLocales || ["en"];
		this.defaultLanguage = config.defaultLanguage || "en";
	}

	//
	// Region
	//

	getRegionByLanguage(language) {
		const localization = this.localizations.find(r =>
			r.language.toLowerCase() === language?.toLowerCase()
		);

		return localization ? localization.region : this.defaultRegion;
	}

	getRegionByLocale(locale) {
		const normalizedLocale = locale?.replace("_", "-").toLowerCase();

		for (const localization of this.localizations) {
			if (localization.locales.some(l => l.toLowerCase() === normalizedLocale)) {
				return localization.region;
			}
		}

		return this.defaultRegion;
	}

	listAllRegions() {
		return [...new Set(this.localizations.map(localization => localization.region))];
	}

	//
	// Locales
	//

	getLocalesByRegion(region) {
		const localization = this.localizations.find(r =>
			r.region.toLowerCase() === region?.toLowerCase()
		);

		return localization ? localization.locales : this.defaultLocales;
	}

	listAllLocales() {
		return [...new Set(this.localizations.flatMap(localization => localization.locales))];
	}

	//
	// Language
	//

	getLanguageByRegion(region) {
		const localization = this.localizations.find(r =>
			r.region.toLowerCase() === region?.toLowerCase()
		);

		return localization ? localization.language : this.defaultLanguage;
	}

	getLanguageByLocale(locale) {
		const normalizedLocale = locale?.replace("_", "-").toLowerCase();

		for (const localization of this.localizations) {
			if (localization.locales.some(l => l.toLowerCase() === normalizedLocale)) {
				return localization.language;
			}
		}

		return this.defaultLanguage;
	}

	listAllLanguages() {
		return [...new Set(this.localizations.map(localization => localization.language))];
	}

	//
	// Client
	// TODO: we need to remove the hardcoded process.env parsing
	//

	getClientLanguageByLocale(locale) {
		const normalizedLocale = locale?.replace("_", "-").toLowerCase();
		const clientRegions = this.listClientRegions();

		for (const localization of this.localizations) {
			if (clientRegions.includes(localization.region) &&
				localization.locales.some(l => l.toLowerCase() === normalizedLocale)
			) {
				return localization.language;
			}
		}

		return this.defaultLanguage;
	}

	listClientLocalizations() {
		const localizations = [];

		Object.keys(process.env).forEach(key => {
			const found = key.match(/API_PORTAL_CLIENT_REGIONS_([A-Z]+)$/);

			if (found) {
				const localization = this.localizations.find(r =>
					r.region.toLowerCase() === found[1]?.toLowerCase()
				);

				localizations.push({ ...localization, name: process.env[key] });
			}
		});

		return localizations;
	}

	listClientRegions() {
		return this.listClientLocalizations().map(r => r.region);
	}

	listClientLanguages() {
		return this.listClientLocalizations().map(r => r.language);
	}
}

module.exports = LocalizationManager;