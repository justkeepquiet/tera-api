"use strict";

// CHANGES MADE ARE APPLIED ONLY AFTER THE PROCESS IS RESTARTED.

const { expr } = require("../src/lib/scheduler");

module.exports = {
	// Automatic download settings.
	autoDownload: {
		// Enables or disables automatic downloading.
		enabled: false,

		// The URL from which the GeoIP database should be downloaded.
		url: "https://git.io/GeoLite2-City.mmdb",

		// Connection timeout in milliseconds.
		connectTimeout: 5000,

		// Response timeout in milliseconds (max interval between data chunks).
		responseTimeout: 10000,

		// Optional authentication string in the format "username:password".
		auth: null,

		// Enables or disables automatic updating.
		autoUpdateEnabled: true,

		// Schedule for automatic updates (see src/lib/scheduler.js).
		autoUpdateSchedule: expr.EVERY_WEDNESDAY_AND_SATURDAY
	}
};