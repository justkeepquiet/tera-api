"use strict";

/**
 * @typedef {object} datasheetModel
 * @property {import("../models/datasheet/strSheetAccountBenefit.model")[]?} strSheetAccountBenefit
 * @property {import("../models/datasheet/strSheetDungeon.model")[]?} strSheetDungeon
 * @property {import("../models/datasheet/strSheetCreature.model")[]?} strSheetCreature
 * @property {import("../models/datasheet/itemConversion.model")[]?} itemConversion
 * @property {import("../models/datasheet/itemData.model")[]?} itemData
 * @property {import("../models/datasheet/skillIconData.model")[]?} skillIconData
 * @property {import("../models/datasheet/strSheetItem.model")[]?} strSheetItem
 *
 * @typedef {import("../app").modules} modules
 */

const fs = require("fs");
const path = require("path");

const env = require("../utils/env");
const { createLogger } = require("../utils/logger");
const { getRevision } = require("../utils/helpers");
const CacheManager = require("../utils/cacheManager");
const DatasheetLoader = require("../lib/datasheetLoader");

const CACHE_DIRECTORY = "../../data/cache";
const DATASHEETS_DIRECTORY = "../../data/datasheets";

/**
 * @param {modules} modules
 */
module.exports = async ({ checkComponent, pluginsLoader, localization }) => {
	/**
	 * @param {logger} logger
	 */
	const loadDatasheetModelSync = (logger, datasheetModel, directory, region, locale, useBinary) => {
		const cacheManager = new CacheManager(
			path.join(__dirname, CACHE_DIRECTORY), "dc",
			createLogger("CacheManager", { colors: { debug: "gray" } })
		);

		const datasheetLoader = new DatasheetLoader(logger);
		let cacheRevision = null;

		if (useBinary) {
			const filePath = path.join(directory, `DataCenter_Final_${region}.dat`);

			cacheRevision = getRevision(filePath);
			datasheetLoader.fromBinary(filePath,
				env.string("DATASHEET_DATACENTER_KEY"),
				env.string("DATASHEET_DATACENTER_IV"),
				{
					isCompressed: env.bool("DATASHEET_DATACENTER_IS_COMPRESSED"),
					hasPadding: env.bool("DATASHEET_DATACENTER_HAS_PADDING")
				}
			);
		} else {
			const directoryPath = path.join(directory, locale);

			cacheRevision = getRevision(directoryPath);
			datasheetLoader.fromXml(directoryPath);
		}

		const addModel = (section, model) => {
			if (datasheetModel[section] === undefined) {
				datasheetModel[section] = {};
			}

			const instance = new model();
			const cache = cacheManager.read(`${locale}-${section}`, cacheRevision); // read cache

			if (cache !== null && typeof instance.import === "function") {
				instance.import(cache);
				datasheetModel[section][locale] = instance;

				datasheetLoader.logger.info(`Model loaded from cache: ${section} (${locale})`);
			} else {
				datasheetModel[section][locale] = datasheetLoader.addModel(instance);
			}
		};

		pluginsLoader.loadComponent("datasheetModels.before", addModel);

		if (checkComponent("admin_panel")) {
			addModel("strSheetAccountBenefit", require("../models/datasheet/strSheetAccountBenefit.model"));
			addModel("strSheetDungeon", require("../models/datasheet/strSheetDungeon.model"));
			addModel("strSheetCreature", require("../models/datasheet/strSheetCreature.model"));
		}

		if (checkComponent("admin_panel") || checkComponent("portal_api")) {
			addModel("itemConversion", require("../models/datasheet/itemConversion.model"));
			addModel("skillIconData", require("../models/datasheet/skillIconData.model"));
		}

		if (checkComponent("admin_panel") || checkComponent("portal_api") || checkComponent("arbiter_api")) {
			addModel("itemData", require("../models/datasheet/itemData.model"));
			addModel("strSheetItem", require("../models/datasheet/strSheetItem.model"));
		}

		pluginsLoader.loadComponent("datasheetModels.after", addModel);

		let dirty = false;

		if (datasheetLoader.loader.sections.length !== 0) {
			datasheetLoader.load();
			dirty = true;

			for (const [section, locales] of Object.entries(datasheetModel)) {
				const instance = locales[locale];

				if (typeof instance.export === "function") {
					cacheManager.save(`${locale}-${section}`, instance.export(), cacheRevision); // save cache

					datasheetLoader.logger.info(`Model saved to cache: ${section} (${locale})`);
				}
			}
		}

		return dirty;
	};

	const datasheetLogger = createLogger("Datasheet", { colors: { debug: "gray" } });
	const useBinary = env.bool("DATASHEET_USE_BINARY");
	const directory = path.join(__dirname, DATASHEETS_DIRECTORY);
	const datasheetModel = [];
	const variants = [];

	try {
		if (useBinary) {
			fs.readdirSync(directory).forEach(file => {
				const match = file.match(/_(\w{3})\.dat$/);

				if (match) {
					variants.push({ region: match[1], locale: localization.getLanguageByRegion(match[1]) });
				}
			});
		} else {
			fs.readdirSync(directory).forEach(file => {
				const stats = fs.statSync(path.join(directory, file));

				if (stats.isDirectory()) {
					variants.push({ region: localization.getRegionByLanguage(file), locale: file });
				}
			});
		}

		for (const { region, locale } of variants) {
			if (loadDatasheetModelSync(datasheetLogger, datasheetModel, directory, region, locale, useBinary)) {
				// gcCollect();
			}
		}
	} catch (err) {
		datasheetLogger.error(err);
		throw "";
	}

	return datasheetModel;
};