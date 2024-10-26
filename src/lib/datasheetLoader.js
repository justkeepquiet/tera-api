"use strict";

const fs = require("fs");
const path = require("path");
const xmljs = require("xml-js");

const Packer = require("./datacenter/packer");
const Reader = require("./datacenter/reader");
const Datacenter = require("./datacenter/datacenter");

class DatasheetLoader {
	constructor(logger = null) {
		this.logger = logger;
		this.loader = null;
		this.bindings = {};
	}

	fromBinary(filePath, key, iv, params = { isCompressed: true, hasPadding: true }) {
		return this.loader = new BinaryLoader(filePath, key, iv, params, this.logger);
	}

	fromXml(directoryPath) {
		return this.loader = new XmlLoader(directoryPath, this.logger);
	}

	addModel(instance) {
		if (!this.loader) {
			throw "DatasheetLoader: Loader is not loaded";
		}

		if (instance.section === undefined || instance.bindings === undefined) {
			throw "Invalid model format.";
		}

		this.bindings = { ...this.bindings, ...instance.bindings };
		this.loader.addSection(instance.section);

		return instance;
	}

	load() {
		if (!this.loader) {
			throw "DatasheetLoader: Loader is not loaded";
		}

		if (this.loader.sections.length !== 0) {
			this.loader.load(this.bindings);
		}
	}
}

class BinaryLoader {
	constructor(filePath, key, iv, params, logger) {
		this.logger = logger;
		this.sections = [];

		this.packer = new Packer(key, iv, filePath, params.isCompressed, logger);
		this.reader = new Reader(params.hasPadding, logger);
		this.datacenter = new Datacenter(logger);
	}

	addSection(section) {
		this.sections.push(section);
	}

	load(bindings) {
		const time = Date.now();

		if (this.logger) {
			this.logger.info(`BinaryLoader: Begin loading: file: ${this.packer.filePath}`);
		}

		const dataUnpacked = this.packer.unpack();
		this.reader.read(dataUnpacked, this.datacenter);
		const parsedData = this.datacenter.parse(this.sections, bindings);

		if (this.logger) {
			const used = process.memoryUsage();

			this.logger.info("BinaryLoader: Loading done took " +
				`${((Date.now() - time) / 1000).toFixed(2)}s ` +
				`rss: ${Math.round(used.rss / 1024 / 1024 * 100) / 100} MB`
			);
		}

		return parsedData;
	}
}

class XmlLoader {
	constructor(directoryPath, logger) {
		this.directoryPath = directoryPath;
		this.logger = logger;
		this.sections = [];
	}

	addSection(section) {
		this.sections.push(section);
	}

	load(bindings) {
		const time = Date.now();

		if (this.logger) {
			this.logger.info(`XmlLoader: Begin loading: file: ${this.directoryPath}, bindings: ${Object.keys(bindings).length}`);
		}

		const sections = fs.readdirSync(this.directoryPath);
		const parsedData = [];

		sections.forEach(section => {
			if (this.sections.length !== 0 && !this.sections.includes(section)) {
				return;
			}

			this.logger.info(`XmlLoader: Parse section: ${section}`);
			const elements = this.parseSection(section, bindings);

			parsedData.push(...elements);
		});

		if (this.logger) {
			this.logger.info(`XmlLoader: Loading done took ${((Date.now() - time) / 1000).toFixed(2)}s`);
		}

		return parsedData;
	}

	parseSection(section, bindings) {
		const directory = path.join(this.directoryPath, section);
		const files = fs.readdirSync(directory);
		const filesData = [];

		files.forEach(file => {
			if (path.extname(file) !== ".xml") {
				return;
			}

			this.logger.debug(`XmlLoader: Parse file: ${file}`);

			const content = fs.readFileSync(path.join(directory, file), { encoding: "utf8" });
			const reference = xmljs.xml2js(content, { ignoreComment: true, nativeTypeAttributes: true });

			if (reference) {
				if (reference.elements) {
					filesData.push(reference.elements[0]);
				}

				this.callElements(reference, "", bindings);
			}
		});

		return filesData;
	}

	callElements(ref, pathNodes, bindings) {
		if (ref.elements === undefined) {
			ref.elements = [];
		}

		const binding = bindings[pathNodes];

		if (typeof binding === "function") {
			binding.call(null, ref);
		}

		ref.elements.forEach(element => {
			this.callElements(element, `${pathNodes}/${element.name}`, bindings);
		});
	}
}

module.exports = DatasheetLoader;