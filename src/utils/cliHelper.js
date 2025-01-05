"use strict";

const moment = require("moment");
const { program } = require("commander");

module.exports = (logger, appVersion) => ({
	printReady: () => {
		logger.info("$ Server ready $");
	},

	printEnded: () => {
		logger.info("Process closed.");
	},

	printInfo: () => {
		logger.info(`TERA API Version: ${appVersion}`);
		logger.info(`Node.js Version: ${process.version}`);
		logger.info(`Server Timezone: ${moment().format("Z")} (${moment.tz.guess()})`);
	},

	printMemoryUsage: () => {
		const used = process.memoryUsage();

		const keys = {
			rss: "Resident set size",
			heapTotal: "Total heap size  ",
			heapUsed: "Used heap        ",
			external: "External         ",
			arrayBuffers: "Array buffers    "
		};

		logger.info("-".repeat(30));
		logger.info("Memory Usage:");

		Object.keys(used).forEach(key =>
			logger.info(` ${keys[key]}: ${Math.round(used[key] / 1024 / 1024 * 100) / 100} MB`)
		);

		logger.info("-".repeat(30));
	},

	addOption: (flags, description, defaultValue) => {
		program.option(flags, description, defaultValue);
	},

	getOptions: () =>
		program.parse(process.argv).opts()
});