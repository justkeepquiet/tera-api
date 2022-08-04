/* eslint-disable no-await-in-loop,no-empty-function */
"use strict";

require("dotenv").config();

const { Sequelize, DataTypes } = require("sequelize");
const fs = require("fs");
const path = require("path");
const xmljs = require("xml-js");

const language = process.argv[2];
const storageDir = path.join(__dirname, "..", "..", "share", "dataitems", language);
const strSheetDirPath = path.resolve(storageDir, "StrSheet_Item");
const dataDirPath = path.resolve(storageDir, "ItemData");
const conversionDirPath = path.resolve(storageDir, "ItemConversion");
const skillIconsDataDirPath = path.resolve(storageDir, "SkillIconData");

const strSheetElements = [];
const dataElements = new Map();
const conversionElements = [];
const skillIconsElements = [];

console.log("Loading StrSheet files...");

if (fs.existsSync(strSheetDirPath)) {
	const strSheetFiles = fs.readdirSync(strSheetDirPath, { withFileTypes: true });

	strSheetFiles.forEach(file => {
		if (path.extname(file.name) === ".xml") {
			const data = readXml(path.join(strSheetDirPath, file.name));

			if (data && data.elements) {
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

			if (data && data.elements) {
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

			if (data && data.elements) {
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

console.log("Loading SkillIcons files...");

if (fs.existsSync(skillIconsDataDirPath)) {
	const skillIconsDataFiles = fs.readdirSync(skillIconsDataDirPath, { withFileTypes: true });

	skillIconsDataFiles.forEach(file => {
		if (path.extname(file.name) === ".xml") {
			const data = readXml(path.join(skillIconsDataDirPath, file.name));

			if (data && data.elements) {
				data.elements.forEach(element => {
					if (element.string != "") {
						skillIconsElements.push(element.attributes);
					}
				});

				console.log("---> Loaded file", file.name, "with", data.elements.length, "elements");
			}
		}
	});
} else {
	console.error("SkillIcons directory not found.");
}

const sequelize = new Sequelize(
	process.env.DB_DATABASE,
	process.env.DB_USERNAME,
	process.env.DB_PASSWORD,
	{
		logging: false,
		dialect: "mysql",
		host: process.env.DB_HOST,
		port: process.env.DB_PORT || 3306,
		define: {
			timestamps: false,
			freezeTableName: true
		},
		pool: {
			max: 100,
			min: 0,
			acquire: 1000000,
			idle: 200000
		}
	}
);

sequelize.authenticate().then(async () => {
	const dataModel = require("../models/data.model")(sequelize, DataTypes);

	console.log("Adding strSheet elements...");
	const strSheetTotal = strSheetElements.length;

	for (const [index, itemStrings] of strSheetElements.entries()) {
		await dataModel.itemStrings.upsert({
			language,
			itemTemplateId: itemStrings.id,
			string: itemStrings.string.toString(),
			toolTip: itemStrings.toolTip?.toString() || ""
		});

		console.log(index, "/", strSheetTotal, "Added:", itemStrings.id);
	}

	console.log("Adding data elements...");
	const dataTotal = dataElements.size;

	let i = 0;
	for (const itemTemplate of dataElements) {
		await dataModel.itemTemplates.upsert({
			itemTemplateId: itemTemplate.id,
			name: itemTemplate.name || null,
			category: itemTemplate.category || null,
			linkSkillId: itemTemplate.linkSkillId || null,
			linkSkillPeriodDay: itemTemplate.linkSkillPeriodDay || null,
			icon: itemTemplate.icon.split(".").at(-1).toLowerCase(),
			rareGrade: Number(itemTemplate.rareGrade),
			requiredLevel: itemTemplate.requiredLevel || null,
			requiredClass: itemTemplate.requiredClass?.toLowerCase() || null,
			requiredGender: itemTemplate.requiredGender?.toLowerCase() || null,
			requiredRace: itemTemplate.requiredRace?.toLowerCase() || null,
			boundType: itemTemplate.boundType?.toLowerCase() || null,
			tradable: Number(itemTemplate.tradable === "true"),
			periodByWebAdmin: Number(itemTemplate.periodByWebAdmin === "true"),
			periodInMinute: itemTemplate.periodInMinute || null,
			warehouseStorable: Number(itemTemplate.warehouseStorable === "true")
		});

		console.log(++i, "/", dataTotal, "Added:", itemTemplate.id, itemTemplate.name);
	}

	console.log("Adding conversion elements...");
	const conversionTotal = conversionElements.length;

	for (const [index, conversion] of conversionElements.entries()) {
		await dataModel.itemConversions.upsert(conversion);

		console.log(index, "/", conversionTotal, "Added:", conversion.itemTemplateId, conversion.fixedItemTemplateId);
	}

	console.log("Adding skillIcons elements...");
	const skillIconsTotal = skillIconsElements.length;

	for (const [index, skillIcon] of skillIconsElements.entries()) {
		await dataModel.skillIcons.upsert({
			skillId: skillIcon.skillId,
			class: skillIcon.class.toLowerCase(),
			race: skillIcon.race.toLowerCase(),
			gender: skillIcon.gender.toLowerCase(),
			icon: skillIcon.iconName.split(".").at(-1).toLowerCase()
		});

		console.log(index, "/", skillIconsTotal, "Added:", skillIcon.skillId);
	}
	*/

	sequelize.close();
});

function readXml(file) {
	return xmljs.xml2js(fs.readFileSync(file, { encoding: "utf8" }), { ignoreComment: true }).elements[0];
}