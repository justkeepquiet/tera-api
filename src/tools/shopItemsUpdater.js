"use strict";

require("dotenv").config();

process.env.LOG_LEVEL = "info";
process.env.LOG_WRITE = "false";

const fs = require("fs");
const path = require("path");
const xmljs = require("xml-js");
const shopModel = require("../models/shop.model");

const language = process.argv[2];
const storageDir = path.join(__dirname, "..", "..", "share", "shopitems", language);
const strSheetDirPath = path.resolve(storageDir, "StrSheet_Item");
const dataDirPath = path.resolve(storageDir, "ItemData");
const conversionDirPath = path.resolve(storageDir, "ItemConversion");
const strSheetElements = [];
const dataElements = new Map();
const conversionElements = [];

console.log("Loading StrSheet files...");

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

				console.log("---> Loaded file", file.name, "with", data.elements.length, "elements");
			}
		}
	});
} else {
	console.error("StrSheet directory not found.");
}

console.log("Loading data files...");

if (fs.existsSync(dataDirPath)) {
	const strSheetFiles = fs.readdirSync(dataDirPath, { withFileTypes: true });

	strSheetFiles.forEach(file => {
		if (path.extname(file.name) === ".xml") {
			const data = readXml(path.join(dataDirPath, file.name));

			if (data) {
				data.elements.forEach(element => dataElements.set(element.attributes.id, element.attributes));

				console.log("---> Loaded file", file.name, "with", data.elements.length, "elements");
			}
		}
	});
} else {
	console.error("Data directory not found.");
}

console.log("Loading conversion files...");

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

				console.log("---> Loaded file", file.name, "with", data.elements.length, "elements");
			}
		}
	});
} else {
	console.error("ConversionDirPath directory not found.");
}

shopModel.itemTemplates.sequelize.authenticate().then(() => {
	console.log("Adding strSheet elements...");
	const strSheetTotal = strSheetElements.length;

	strSheetElements.forEach((itemStrings, index) => {
		shopModel.itemStrings.upsert({
			language,
			itemTemplateId: itemStrings.id,
			string: itemStrings.string.toString(),
			toolTip: itemStrings.toolTip?.toString() || ""
		}).then(() =>
			console.log(index, "/", strSheetTotal, "Added:", itemStrings.id)
		);
	});

	console.log("Adding data elements...");
	const dataTotal = dataElements.size;

	dataElements.forEach((itemTemplate, index) =>
		shopModel.itemTemplates.upsert({
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
			console.log(index, "/", dataTotal, "Added:", itemTemplate.id)
		)
	);

	console.log("Adding conversion elements...");
	const conversionTotal = conversionElements.length;

	conversionElements.forEach((conversion, index) => {
		shopModel.itemConversions.upsert(conversion).then(() =>
			console.log(index, "/", conversionTotal, "Added:", conversion.itemTemplateId, conversion.fixedItemTemplateId)
		);
	});
});

function readXml(file) {
	return xmljs.xml2js(fs.readFileSync(file, { encoding: "utf8" }), { ignoreComment: true }).elements[0];
}