"use strict";

const fs = require("fs");
const path = require("path");
const winston = require("winston");
const moment = require("moment-timezone");

const logDirectory = "../../logs";
const logger = winston.createLogger({ level: process.env.API_LOG_LEVEL || "info" });

logger.add(new winston.transports.Console({
	format: winston.format.combine(
		winston.format.colorize({ level: true }),
		winston.format.timestamp({ format: "YYYY-MM-DD HH:mm:ss.SSS" }),
		winston.format.printf(info =>
			`[${info.timestamp}] ${info.level}: ${info.message}`
		)
	)
}));

if (/^true$/i.test(process.env.API_LOG_WRITE)) {
	const logFilename = `log_${moment.utc().local().format("YYYY-MM-DD_HH-mm-ss")}_${process.pid}.log`;

	if (!fs.existsSync(path.resolve(__dirname, logDirectory))) {
		fs.mkdirSync(path.resolve(__dirname, logDirectory));
	}

	logger.add(new winston.transports.File({
		filename: path.resolve(__dirname, logDirectory, logFilename),
		format: winston.format.combine(
			winston.format.timestamp({ format: "YYYY-MM-DD HH:mm:ss.SSS" }),
			winston.format.printf(info =>
				`[${info.timestamp}] ${info.level.toUpperCase()}: ${info.message}`
			)
		)
	}));
}

module.exports = logger;