"use strict";

const fs = require("fs");
const path = require("path");
const winston = require("winston");
const moment = require("moment-timezone");

const logger = winston.createLogger({ level: process.env.LOG_LEVEL || "info" });
const logTimeFormat = "YYYY-MM-DD HH:mm:ss.SSS";

let logDirectory = process.env.LOG_WRITE_DIRECTORY ? process.env.LOG_WRITE_DIRECTORY : "./logs";

if (!path.isAbsolute(logDirectory)) {
	logDirectory = path.join(__dirname, "../../", logDirectory);
}

logger.add(new winston.transports.Console({
	format: winston.format.combine(
		winston.format.colorize({ level: true }),
		winston.format.timestamp({ format: logTimeFormat }),
		winston.format.printf(info =>
			`[${info.timestamp}] ${info.level}: ${info.message}`
		)
	)
}));

if (/^true$/i.test(process.env.LOG_WRITE)) {
	const logFilename = path.resolve(logDirectory,
		`log_${moment.utc().local().format("YYYY-MM-DD_HH-mm-ss")}_${process.pid}.log`);

	logger.info(`Log file: ${logFilename}`);

	if (!fs.existsSync(path.resolve(logDirectory))) {
		fs.mkdirSync(path.resolve(logDirectory));
	}

	logger.add(new winston.transports.File({
		filename: logFilename,
		format: winston.format.combine(
			winston.format.timestamp({ format: logTimeFormat }),
			winston.format.printf(info =>
				`[${info.timestamp}] ${info.level.toUpperCase()}: ${info.message}`
			)
		)
	}));
}

module.exports = logger;