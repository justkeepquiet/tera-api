"use strict";

const moment = require("moment-timezone");
const logger = require("./logger");
const fcgiHttpHelper = require("./fcgiHttpHelper");

module.exports.makeBox = (context, logId, serverId, userId, characterId = 0) =>
	fcgiHttpHelper.post(["make_box.json"], {
		svr_id: serverId,
		user_srl: userId,
		char_srl: characterId,
		log_id: logId,
		start_valid: moment().unix(),
		valid_duration: context.days * 86400,
		icon: context.icon,
		title: context.title,
		content: context.content,
		items: context.items
	}).then(response => {
		if (response.body.message === undefined || response.body.message != "") {
			return Promise.reject(`fcgi_gw error: ${response.body.message || "unknown"}`);
		}

		fcgiHttpHelper.get(["box_noti", serverId, userId, characterId]).catch(err =>
			logger.error(err)
		);

		return Promise.resolve(response.body);
	})
;