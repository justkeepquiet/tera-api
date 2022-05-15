"use strict";

const winston = require("winston");

module.exports = winston.createLogger({
	level: process.env.API_LOG_LEVEL || "info",
	format: winston.format.combine(
		winston.format.colorize(),
		winston.format.timestamp({
			format: "YYYY-MM-DD HH:mm:ss.SSS"
		}),
		winston.format.printf(info =>
			`[${info.timestamp}] ${info.level}: ${info.message}`
		)
	),
	transports: [
		new winston.transports.Console()
	]
});