"use strict";

/**
* @typedef {import("sequelize").Model} Model
*/

const xmlbuilder = require("xmlbuilder");
const { permissionToString } = require("./helpers");

const maxPermissionValue = 2147483648; // 0x80000000

class SlsBuilder {
	constructor() {
		this.servers = [];
	}

	/**
	* @param {Model} server
	* @param {Model} strings
	* @param {boolean} isMaintenance
	*/
	addServer(server, strings, isMaintenance) {
		const category = server.get("isPvE") ?
			{ sort: 1, value: strings.get("categoryPvE") } :
			{ sort: 1, value: strings.get("categoryPvP") };

		let permissionMask = server.get("permission") || 0;
		let open = { sort: 1, value: strings.get("serverLow"), color: "#00ff00" };
		let crowdness = { sort: 1, value: strings.get("crowdNo") };

		if (server.get("isCrowdness")) {
			permissionMask += 1;
			crowdness = { sort: 1, value: strings.get("crowdYes") };
		}

		if (isMaintenance) {
			permissionMask += 256;
		}

		if (server.get("isAvailable")) {
			if (server.get("usersOnline") > server.get("tresholdLow")) {
				open = { sort: 1, value: strings.get("serverMedium"), color: "#ffffff" };
			}
			if (server.get("usersOnline") > server.get("tresholdMedium")) {
				open = { sort: 1, value: strings.get("serverHigh"), color: "#ffff00" };
			}
		} else {
			permissionMask = maxPermissionValue;
			open = { sort: 1, value: strings.get("serverOffline"), color: "#990000" };
		}

		this.servers.push({
			id: server.get("serverId"),
			ip: server.get("loginIp"),
			port: server.get("loginPort"),
			category,
			name: server.get("nameString"),
			rawName: server.get("descrString"),
			crowdness,
			open,
			permissionMask: permissionToString(permissionMask),
			serverStat: permissionToString(permissionMask),
			popup: strings.get("popup"),
			language: server.get("language")
		});
	}

	/**
	 * @param {boolean} [pretty=true]
	 * @param {string} [encoding=utf-8]
	 * @return {string}
	 */
	renderXML(pretty = true, encoding = "utf-8") {
		this.xml = xmlbuilder.create("serverlist", { encoding });

		this.servers.forEach(server => {
			this.xml.ele("server")
				.ele("id", server.id).up()
				.ele("ip", server.ip).up()
				.ele("port", server.port).up()
				.ele("category", { sort: server.category.sort }, server.category.value).up()
				.ele("name", { raw_name: server.rawName }).cdata(server.name).up()
				.ele("crowdness", { sort: server.crowdness.sort }, server.crowdness.value).up()
				.ele("open", { sort: server.open.sort }).cdata(
					`<font color="${server.open.color}">${server.open.value}</font>`).up()
				.ele("permission_mask", server.permissionMask).up()
				.ele("server_stat", server.serverStat).up()
				.ele("popup").cdata(server.popup).up()
				.ele("language", server.language).up()
			;
		});

		return this.xml.end({ pretty });
	}

	/**
	 * @param {boolean} [pretty=true]
	 * @param {Number} [sortCriterion=3]
	 * @return {string}
	 */
	renderJSON(pretty = true, sortCriterion = 3) {
		this.json = {
			servers: [],
			sort_criterion: sortCriterion
		};

		this.servers.forEach(server => {
			this.json.servers.push({
				id: server.id,
				name: server.name,
				category: server.category.value,
				title: server.rawName,
				queue: server.crowdness.value,
				population: `<font color="${server.open.color}">${server.open.value}</font>`,
				address: server.ip,
				port: server.port,
				available: Number(server.permissionMask < maxPermissionValue),
				unavailable_message: server.popup,
				host: null
			});
		});

		return JSON.stringify(this.json, ...(pretty ? [null, 4] : []));
	}

	get getServers() {
		return this.servers;
	}
}

module.exports = SlsBuilder;