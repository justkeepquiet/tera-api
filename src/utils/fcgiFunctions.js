"use strict";

const moment = require("moment-timezone");
const FcgiConnection = require("./fcgiConnection");
const FcgiError = require("./fcgiError");

class FcgiFunctions extends FcgiConnection {
	constructor(fcgiUrl, params = { logger: null }) {
		super(fcgiUrl, params);
	}

	stat() {
		return this.post(["stat.json"]).then(response =>
			Promise.resolve(response.body)
		);
	}

	ping(serverId) {
		return this.post(["ping.json", serverId]).then(response =>
			Promise.resolve(response.body)
		);
	}

	query(userId) {
		return this.post(["query.json", userId]).then(response =>
			Promise.resolve(response.body)
		);
	}

	kick(serverId, userId, kickCode) {
		return this.get(["kick", serverId, userId, kickCode]).then(response =>
			(response.body !== 0 ?
				Promise.reject(new FcgiError(response.body, Number(response.body))) :
				Promise.resolve(response.body)
			)
		);
	}

	bulkKick(serverId, kickCode, filter = 0, filterMask = 0) {
		return this.get(["bulkkick", serverId, filter, filterMask, kickCode]).then(response =>
			Promise.resolve(response.body)
		);
	}

	msg(serverId, msg, userId = null) {
		return this.get(["msg", serverId, userId || "all", msg]).then(response =>
			(response.body !== 0 ?
				Promise.reject(new FcgiError(response.body, Number(response.body))) :
				Promise.resolve(response.body)
			)
		);
	}

	addBenefit(serverId, userId, benefitId, totalDays) {
		return this.get(["add_benefit", serverId, userId, benefitId, totalDays * 86400]).then(response =>
			(response.body !== 0 ?
				Promise.reject(new FcgiError(response.body, Number(response.body))) :
				Promise.resolve(response.body)
			)
		);
	}

	removeBenefit(serverId, userId, benefitId) {
		return this.get(["remove_benefit", serverId, userId, benefitId]).then(response =>
			(response.body !== 0 ?
				Promise.reject(new FcgiError(response.body, Number(response.body))) :
				Promise.resolve(response.body)
			)
		);
	}

	makeBox(boxContext, userId, serverId = 0, characterId = 0, logId = 0, boxNoti = true) {
		return this.post(["make_box.json"], {
			svr_id: serverId,
			user_srl: userId,
			char_srl: characterId,
			log_id: logId,
			start_valid: moment().unix(),
			valid_duration: boxContext.days * 86400,
			icon: boxContext.icon,
			title: boxContext.title,
			content: boxContext.content,
			items: boxContext.items
		}).then(response => {
			if (boxNoti) {
				this.boxNoti(serverId, userId, characterId).catch(err => {
					if (this.params.logger?.error) {
						this.params.logger.error(err);
					}
				});
			}

			return (response.body.message === undefined || response.body.message != "") ?
				Promise.reject(new FcgiError(response.body.message || "Unknown", 1)) :
				Promise.resolve(response.body);
		});
	}

	boxNoti(serverId, userId, characterId) {
		return this.get(["box_noti", serverId, userId, characterId]).then(response =>
			(response.body !== 0 ?
				Promise.reject(new FcgiError(response.body, Number(response.body))) :
				Promise.resolve(response.body)
			)
		);
	}

	countBox(serverId, userId, characterId = 0) {
		return this.get(["count_box", userId, serverId, characterId]).then(response =>
			Promise.resolve(response.body)
		);
	}

	checkBox(externalKey) {
		return this.get(["check_box.json", externalKey]).then(response =>
			((response.body.message === undefined || response.body.message != "") ?
				Promise.reject(new FcgiError(response.body.message || "Unknown", 1)) :
				Promise.resolve(response.body)
			)
		);
	}
}

module.exports = FcgiFunctions;