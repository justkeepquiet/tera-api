"use strict";

/**
 * @typedef {nodemailer.Transporter} modules
 * @typedef {import("../app").modules} modules
 */

const nodemailer = require("nodemailer");

const env = require("../utils/env");

/**
 * @param {modules} modules
 */
module.exports = async () => {
	const settings = {
		host: env.string("MAILER_SMTP_HOST"),
		port: env.number("MAILER_SMTP_PORT"),
		secure: env.bool("MAILER_SMTP_SECURE")
	};

	if (env.string("MAILER_SMTP_AUTH_USER") && env.string("MAILER_SMTP_AUTH_PASSWORD")) {
		settings.auth = {
			user: env.string("MAILER_SMTP_AUTH_USER"),
			pass: env.string("MAILER_SMTP_AUTH_PASSWORD")
		};
	}

	return nodemailer.createTransport(settings);
};