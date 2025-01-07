"use strict";

// THE CHANGES MADE ARE APPLIED WITHOUT RESTARTING THE PROCESS.

// This file allows you to configure the overriding of the IP address of
// the game server depending on the IP address (or range of IP addresses) of
// the connecting client. This can be useful for the operation of geographically
// distributed proxies, or for direct access to the server from the local
// network (without the need to use Hairpin NAT technology).

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
		// Specifies the ID of the server for which the rules apply.
		serverId: 2800,
		// List of rules for overriding the server IP address.
		rules: [
			// Reassignment using client IP address ranges from CIDR ranges.
			{
				method: "cidr",
				// Use CIDR ranges as params.
				// There we use LAN IPs: https://en.wikipedia.org/wiki/Private_network
				params: [
					"10.0.0.0/8",
					"100.64.0.0/10",
					"172.16.0.0/12",
					"192.168.0.0/16"
				],
				// Setting a new IP address for the server (use "null" to disable).
				serverIp: "10.64.16.109",
				// Setting a new port for the server (use "null" to disable).
				serverPort: null,
				// Set suffix to server name (use "null" to disable).
				nameSuffix: null
			},
			// Reassignment using client IP address ranges from geography (Maxmind Geoip).
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
					(reader, ip) => reader.city(ip)?.country?.isoCode === "UA"
				],
				// Setting a new IP address for the server (use "null" to disable).
				serverIp: "10.10.10.11",
				// Setting a new port for the server (use "null" to disable).
				serverPort: null,
				// Set suffix to server name (use "null" to disable).
				nameSuffix: "UA"
			},
			// Reassignment using client IP address ranges from geography (ipapi.is).
			{
				method: "ipapi",
				params: [
					// See: https://ipapi.is/developers.html#api-response-format
					response => response?.location?.country_code === "UA"
				],
				// Setting a new IP address for the server (use "null" to disable).
				serverIp: "10.10.10.11",
				// Setting a new port for the server (use "null" to disable).
				serverPort: null,
				// Set suffix to server name (use "null" to disable).
				nameSuffix: "UA"
			},
			// Reassignment the IP address based on the resolving from the domain name
			// (for example, when using DynDNS or No-IP).
			{
				method: "domain",
				params: {
					// Specifies the domain name on the basis of which the IP will be determined.
					domain: "qhbtdfacvt.ddns.net",
					// The IP addresses of the DNS servers that serves the domain is specified (to avoid caching).
					dnsServers: [
						"194.62.182.53", // nf1.no-ip.com
						"45.54.64.53" // nf2.no-ip.com
					]
				}
			}
		]
	}
];