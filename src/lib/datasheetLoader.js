"use strict";

const fs = require("fs");
const path = require("path");
const xmljs = require("xml-js");

class DatasheetLoader {
	constructor(logger) {
		this.logger = logger;

		this.direcory = path.join(__dirname, "..", "..", "data", "datasheets");
		this.locales = fs.readdirSync(this.direcory);

		this.promises = [];
		this.results = {};
	}

	add(datasheet, datasheetOrigin, parserFunc) {
		this.results[datasheet] = {};

		this.locales.forEach(locale => {
			this.promises.push(this._parseXml(datasheetOrigin, locale).then(data => {
				const result = parserFunc(data);
				const elements = result.size || result.length;

				this.results[datasheet][locale] = result;

				this.logger.info(`Loaded: ${locale}:${datasheet}, elements: ${elements}`);
			}));
		});
	}

	final() {
		return new Promise(resolve =>
			Promise.all(this.promises)
				.then(() => resolve({ ...this.results }))
		);
	}

	_parseXml(datasheet, locale) {
		const direcory = path.join(this.direcory, locale, datasheet);

		return fs.promises.readdir(direcory, { withFileTypes: true }).then(filenames => {
			const promises = [];

			filenames.forEach((file, index) => {
				if (path.extname(file.name) !== ".xml") {
					return;
				}

				promises.push(
					fs.promises.readFile(path.join(direcory, file.name), { encoding: "utf8" }).then(content => {
						const data = xmljs.xml2js(content, { ignoreComment: true }).elements[0];
						const elements = [];

						if (data) {
							data.elements.forEach(element =>
								elements.push(element)
							);
						}

						this.logger.debug(`Parsed: [${locale}] ${filenames.length - index}/${filenames.length}: ${file.name}`);

						return Promise.resolve(elements);
					})
				);
			});

			return Promise.all(promises).then(data =>
				data.reduce((array, row) => array.concat(row), [])
			);
		});
	}
}

module.exports = DatasheetLoader;