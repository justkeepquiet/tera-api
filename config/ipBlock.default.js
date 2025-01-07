"use strict";

// THE CHANGES MADE ARE APPLIED WITHOUT RESTARTING THE PROCESS.

// This file allows you to configure blocking of a client (user) based on his IP address.

// NOTE:
// For the "geoip" method to work, you need to download file "GeoLite2-City.mmdb" from
// the https://git.io/GeoLite2-City.mmdb and place it in directory "data\geoip".

/**
 * @typedef {import("@maxmind/geoip2-node").ReaderModel} ReaderModel
 */

module.exports = [
	{
		// Enable this rule set.
		enabled: false,
		// List of endpoints that will be taken into account when checking IP for blocking.
		endpoints: [
			"/launcher/LoginAction",
			"/launcher/SignupAction",
			"/launcher/SignupVerifyAction",
			"/launcher/ResetPasswordAction",
			"/launcher/ResetPasswordVerifyAction",
			"/launcher/SetAccountLanguageAction",
			"/launcher/ReportAction",
			"/launcher/GetAccountInfoAction"
		],
		// List of rules for checking IP for blocking.
		rules: [
			// Blocking the IP address using the CIDR ranges.
			{
				method: "cidr",
				// Use CIDR ranges as params.
				// There we use LAN IPs: https://en.wikipedia.org/wiki/Private_network
				params: [
					// Block all LAN traffic
					"10.0.0.0/8",
					"100.64.0.0/10",
					"172.16.0.0/12",
					"192.168.0.0/16"
				]
			},
			// Blocking the IP address uses the data from geography (Maxmind Geoip).
			{
				method: "geoip",
				// Use callback function as first param.
				// This callback takes a ReaderModel as the first argument and
				// a client IP address string as the second argument.
				// The callback must return a boolean value.
				// See: https://maxmind.github.io/GeoIP2-node/classes/ReaderModel.html
				params: [
					/**
					 * @param {ReaderModel} reader
					 * @param {string} ip
					 */
					(reader, ip) => reader.city(ip)?.country?.isoCode !== "RU" // Block all countries except Russia
				]
			},
			// Blocking the IP address uses the data from geography (ipapi.is).
			{
				method: "ipapi",
				params: [
					// See: https://ipapi.is/developers.html#api-response-format
					response => response?.is_datacenter || response?.is_tor || response?.is_proxy || response?.is_vpn // Blocks all VPN/proxy/hosting traffic
				]
			}
		]
	}
];