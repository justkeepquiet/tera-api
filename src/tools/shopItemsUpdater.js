"use strict";

/**
 * @typedef {import("../models/shop.model").shopModel} model
 */

require("dotenv").config();

process.env.LOG_LEVEL = "info";
process.env.LOG_WRITE = "false";

const fs = require("fs");
const path = require("path");
const xmljs = require("xml-js");
const logger = require("../utils/logger");
const shopModel = require("../models/shop.model")({ logger });

const language = process.argv[2];
const storageDir = path.join(__dirname, "..", "..", "share", "shopitems", language);
const strSheetDirPath = path.resolve(storageDir, "StrSheet_Item");
const dataDirPath = path.resolve(storageDir, "ItemData");
const conversionDirPath = path.resolve(storageDir, "ItemConversion");
const strSheetElements = [];
const dataElements = new Map();
const conversionElements = [];

logger.info("Loading StrSheet files...");

if (fs.existsSync(strSheetDirPath)) {
	const strSheetFiles = fs.readdirSync(strSheetDirPath, { withFileTypes: true });

	strSheetFiles.forEach(file => {
		if (path.extname(file.name) === ".xml") {
			const data = readXml(path.join(strSheetDirPath, file.name));

			if (data) {
				data.elements.forEach(element => {
					if (element.string != "") {
						strSheetElements.push(element.attributes);
					}
				});

				logger.info("---> Loaded file", file.name, "with", data.elements.length, "elements");
			}
		}
	});
} else {
	logger.error("StrSheet directory not found.");
}

logger.info("Loading data files...");

if (fs.existsSync(dataDirPath)) {
	const strSheetFiles = fs.readdirSync(dataDirPath, { withFileTypes: true });

	strSheetFiles.forEach(file => {
		if (path.extname(file.name) === ".xml") {
			const data = readXml(path.join(dataDirPath, file.name));

			if (data) {
				data.elements.forEach(element => dataElements.set(element.attributes.id, element.attributes));

				logger.info("---> Loaded file", file.name, "with", data.elements.length, "elements");
			}
		}
	});
} else {
	logger.error("Data directory not found.");
}

logger.info("Loading conversion files...");

if (fs.existsSync(conversionDirPath)) {
	const strSheetFiles = fs.readdirSync(conversionDirPath, { withFileTypes: true });

	strSheetFiles.forEach(file => {
		if (path.extname(file.name) === ".xml") {
			const data = readXml(path.join(conversionDirPath, file.name));

			if (data) {
				data.elements.forEach(element => {
					if (element.elements !== undefined) {
						element.elements.forEach(childElement => {
							if (childElement.name === "FixedItem") {
								conversionElements.push({
									itemTemplateId: element.attributes.itemTemplateId,
									fixedItemTemplateId: childElement.attributes.templateId,
									class: childElement.attributes?.class || null,
									gender: childElement.attributes?.gender || null,
									race: childElement.attributes?.race || null
								});
							}
						});
					}
				});

				logger.info("---> Loaded file", file.name, "with", data.elements.length, "elements");
			}
		}
	});
} else {
	logger.error("ConversionDirPath directory not found.");
}

shopModel.then(
	/**
	 * @param {model} model
	 */
	model => {
		model.itemTemplates.sequelize.authenticate().then(() => {
			logger.info("Adding strSheet elements...");
			const strSheetTotal = strSheetElements.length;

			strSheetElements.forEach((itemStrings, index) => {
				model.itemStrings.upsert({
					language,
					itemTemplateId: itemStrings.id,
					string: itemStrings.string.toString(),
					toolTip: itemStrings.toolTip?.toString() || ""
				}).then(() =>
					logger.info(index, "/", strSheetTotal, "Added:", itemStrings.id)
				);
			});

			logger.info("Adding data elements...");
			const dataTotal = dataElements.size;

			dataElements.forEach((itemTemplate, index) =>
				model.itemTemplates.upsert({
					itemTemplateId: itemTemplate.id,
					icon: itemTemplate.icon.split(".").at(-1).toLowerCase(),
					rareGrade: Number(itemTemplate.rareGrade),
					requiredLevel: itemTemplate.requiredLevel || null,
					requiredClass: itemTemplate.requiredClass?.toLowerCase() || null,
					requiredGender: itemTemplate.requiredGender?.toLowerCase() || null,
					requiredRace: itemTemplate.requiredRace?.toLowerCase() || null,
					tradable: Number(itemTemplate.tradable === "true"),
					warehouseStorable: Number(itemTemplate.warehouseStorable === "true")
				}).then(() =>
					logger.info(index, "/", dataTotal, "Added:", itemTemplate.id)
				)
			);

			logger.info("Adding conversion elements...");
			const conversionTotal = conversionElements.length;

			conversionElements.forEach((conversion, index) => {
				model.itemConversions.upsert(conversion).then(() =>
					logger.info(index, "/", conversionTotal, "Added:", conversion.itemTemplateId, conversion.fixedItemTemplateId)
				);
			});
		});
	}
);

function readXml(file) {
	return xmljs.xml2js(fs.readFileSync(file, { encoding: "utf8" }), { ignoreComment: true }).elements[0];
}