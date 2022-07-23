"use strict";

module.exports.makeGuid = (category, number) =>
	(parseInt(category) & 0x000000FF) << 24 | (parseInt(number) & 0x00FFFFFF)
;

module.exports.readGuid = guid =>
	({ category: parseInt(guid) >> 24, number: parseInt(guid) & 0x00FFFFFF })
;

module.exports.gusid = {
	userenter: 4278190080,
	boxapi: 268435457, // (16 << 24) + 1
	steersession: 167772160, // (10 << 24) + 0
	steermind: 67108864 // (4 << 24) + 0
};

module.exports.serverCategory = {
	unknown: 254,
	all: 255,
	arbitergw: 0,
	steerweb: 1,
	steergw: 2,
	steerhub: 3,
	steermind: 4,
	steerdb: 5,
	gas: 6,
	glogdb: 7,
	steerclient: 8,
	steercast: 9,
	steersession: 10,
	gameadmintool: 11,
	steerbridge: 12,
	hubgw: 13,
	cardmaker: 14,
	carddealer: 15,
	boxapi: 16,
	boxdm: 17,
	dbgw: 18,
	webcstool: 19,
	cardsteerbridge: 20,
	cardweb: 21,
	carddb: 22,
	boxdb: 23,
	boxbridgedorian: 24,
	scstool: 25,
	boxweb: 26,
	cardbridgenetmoderator: 27,
	dicedb: 31,
	dice: 32,
	diceweb: 33,
	steereye: 35
};