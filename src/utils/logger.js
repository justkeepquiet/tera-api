"use strict";

// Font styles: bold, dim, italic, underline, inverse, hidden, strikethrough.
// Font foreground colors: black, red, green, yellow, blue, magenta, cyan, white, gray, grey.
// Background colors: blackBG, redBG, greenBG, yellowBG, blueBG, magentaBG, cyanBG, whiteBG.

/**
 * @typedef {object} logger
 * @property {import("winston").Logger} debug
 * @property {import("winston").Logger} error
 * @property {import("winston").Logger} warn
 * @property {import("winston").Logger} info
 * @property {import("winston").Logger} http
 * @property {import("winston").Logger} verbose
 * @property {import("winston").Logger} debug
 * @property {import("winston").Logger} silly
 */

const fs = require("fs");
const path = require("path");
const util = require("util");
const winston = require("winston");
const moment = require("moment-timezone");

const fileLogger = winston.createLogger({ level: process.env.LOG_LEVEL || "info" });
const logTimeFormat = "YYYY-MM-DD HH:mm:ss.SSS";

const createCustomLogger = params => {
	const customLogger = winston.createLogger({
		level: process.env.LOG_LEVEL || "info", ...params.logger
	});

	customLogger.add(new winston.transports.Console({
		format: winston.format.combine(
			{
				transform: (info, opts) => {
					info.message = util.format(info.message, ...info[Symbol.for("splat")] || []);
					return info;
				}
			},
			winston.format.timestamp({ format: logTimeFormat }),
			winston.format.printf(info =>
				winston.format.colorize({
					colors: { ...winston.config.npm.colors, ...params.colors }
				}).colorize(
					info.level, `[${info.timestamp}] (${info.level}) ${info.message}`
				)
			)
		)
	}));

	return customLogger;
};

const defaultLogger = createCustomLogger({});
let logDirectory = process.env.LOG_WRITE_DIRECTORY ? process.env.LOG_WRITE_DIRECTORY : "./logs";

if (!path.isAbsolute(logDirectory)) {
	logDirectory = path.join(__dirname, "../../", logDirectory);
}

if (/^true$/i.test(process.env.LOG_WRITE)) {
	const logFilename = path.resolve(logDirectory,
		`log_${moment.utc().local().format("YYYY-MM-DD_HH-mm-ss")}_${process.pid}.log`);

	defaultLogger.info(`Logger: Log file: ${logFilename}`);

	if (!fs.existsSync(path.resolve(logDirectory))) {
		fs.mkdirSync(path.resolve(logDirectory));
	}

	fileLogger.add(new winston.transports.File({
		filename: logFilename,
		format: winston.format.combine(
			winston.format.timestamp({ format: logTimeFormat }),
			winston.format.printf(info =>
				`[${info.timestamp}] (${info.level.toUpperCase()}) ${info.message}`
			)
		)
	}));
}

const createLogger = (category, params = {}) => {
	const customLogger = createCustomLogger(params);
	const categoryString = category ? `${category}: ` : "";
	const levels = {
		stream: customLogger.stream
	};

	Object.keys(winston.config.npm.levels).forEach(level => {
		levels[level] = (...args) => [fileLogger, customLogger].forEach(logger =>
			logger[level].apply(logger,
				Object.values(args).map(a => (
					a?.stack !== undefined ? `${categoryString}${a.toString()} ${a.stack}` : categoryString + a
				))
			)
		);
	});

	return levels;
};

module.exports = { ...defaultLogger, createLogger };