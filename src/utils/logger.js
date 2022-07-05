"use strict";

const fs = require("fs");
const path = require("path");
const util = require("util");
const winston = require("winston");
const moment = require("moment-timezone");

const logger = winston.createLogger({ level: process.env.LOG_LEVEL || "info" });
const colorizer = winston.format.colorize();
const logTimeFormat = "YYYY-MM-DD HH:mm:ss.SSS";

let logDirectory = process.env.LOG_WRITE_DIRECTORY ? process.env.LOG_WRITE_DIRECTORY : "./logs";

if (!path.isAbsolute(logDirectory)) {
	logDirectory = path.join(__dirname, "../../", logDirectory);
}

logger.add(new winston.transports.Console({
	format: winston.format.combine(
		{
			transform: (info, opts) => {
				info.message = util.format(info.message, ...info[Symbol.for("splat")] || []);
				return info;
			}
		},
		winston.format.timestamp({ format: logTimeFormat }),
		winston.format.printf(info =>
			colorizer.colorize(
				info.level, `[${info.timestamp}] ${info.level}: ${info.message}`
			)
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

Object.keys(winston.config.npm.levels).forEach(level =>
	module.exports[level] = (...args) => logger[level].apply(logger,
		Object.values(args).map(a => (
			a.stack !== undefined ? `${a.toString()} ${a.stack}` : a
		))
	)
);

module.exports.stream = logger.stream;