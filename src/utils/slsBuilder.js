"use strict";

const xmlbuilder = require("xmlbuilder");

/**
* @typedef {import("sequelize").Model} Model
*/

class SlsBuilder {
	constructor() {
		this.servers = [];
	}

	/**
	* @param {Model} server
	* @param {Model} strings
	*/
	addServer(server, strings) {
		const category = server.get("isPvE") ?
			{ sort: 1, value: strings.get("categoryPvE") } :
			{ sort: 2, value: strings.get("categoryPvP") };

		const crowdness = server.get("isCrowdness") ?
			{ sort: 2, value: strings.get("crowdYes") } :
			{ sort: 1, value: strings.get("crowdNo") };

		let permissionMask = "0x00010000";
		let open = { sort: 0, value: strings.get("serverOffline"), color: "#990000" };

		if (server.get("isAvailable")) {
			permissionMask = "0x00000000";
			open = { sort: 1, value: strings.get("serverLow"), color: "#00ff00" };

			if (server.get("usersOnline") > server.get("tresholdLow")) {
				open = { sort: 2, value: strings.get("serverMedium"), color: "#ffffff" };
			}
			if (server.get("usersOnline") > server.get("tresholdMedium")) {
				open = { sort: 3, value: strings.get("serverHigh"), color: "#ffff00" };
			}
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
			permissionMask,
			serverStat: "0x00000000",
			popup: strings.get("popup"),
			language: server.get("language")
		});
	}

	/**
	 * @param {boolean} [pretty=true]
	 * @return {string}
	 */
	renderJSON(pretty = true) {
		return JSON.stringify(this.servers, ...(pretty ? [null, 4] : []));
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

	get getServers() {
		return this.servers;
	}
}

module.exports = SlsBuilder;