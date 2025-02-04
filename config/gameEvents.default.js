/* eslint-disable comma-dangle */
"use strict";

// THE CHANGES MADE ARE APPLIED WITHOUT RESTARTING THE PROCESS.

// This file allows you to customize reactions to game events, such as entering the game, leveling up, etc.
// For example, this can allow you to issue a reward for leveling up, or for entering the game for the first time.

/**
 * @typedef {import("../src/app").modules} modules
 */

const ItemClaim = require("../src/actions/handlers/itemClaim");
const Custom = require("../src/actions/handlers/custom");

module.exports = {
	// Events triggered when entering the game.
	enterGame: [
		[Custom, { invoke: [
			/**
			 * Example callback function.
			 * @param {modules} modules
			 */
			async (modules, userId, serverId, params) => {
				const { ip, server_id, user_srl } = params;

				// Implementation here
			}
		] }]
	],

	// Events triggered when entering the game first time.
	enterGameFirst: [
		[Custom, { invoke: [
			/**
			 * Example of callback function.
			 * @param {modules} modules
			 */
			async (modules, userId, serverId, params) => {
				const { ip, server_id, user_srl } = params;

				// Implementation here
			}
		] }],
		// Example of calling a standard handler (sending an item).
		/*
		[ItemClaim, {
			makeBox: [{
				title: "Your gift!",
				content: "Your gift for registering in the game.",
				icon: "GiftBox01.bmp",
				days: 365,
				items: [
					{ item_template_id: 207546, item_count: 100 } // Multi-Nostrum
				]
			}]
		}]
		*/
	],

	// Events triggered when leaving the game.
	leaveGame: [
		[Custom, { invoke: [
			/**
			 * Example of callback function.
			 * @param {modules} modules
			 */
			async (modules, userId, serverId, params) => {
				const { play_time, user_srl } = params;

				// Implementation here
			}
		] }]
	],

	// Events triggered when a character is created in the game.
	createChar: [
		[Custom, { invoke: [
			/**
			 * Example of callback function.
			 * @param {modules} modules
			 */
			async (modules, userId, serverId, params) => {
				const { char_name, char_srl, class_id, gender_id, level, race_id, server_id, user_srl } = params;

				// Implementation here
			}
		] }]
	],

	// Events triggered when a character changes in the game.
	modifyChar: [
		[Custom, { invoke: [
			/**
			 * Example of callback function.
			 * @param {modules} modules
			 */
			async (modules, userId, serverId, params) => {
				const { char_name, char_srl, class_id, gender_id, level, race_id, server_id, user_srl } = params;

				// Implementation here
			}
		] }]
	],

	// Events triggered when a character levels up in the game.
	charLevelUp: [
		[Custom, { invoke: [
			/**
			 * Example of callback function.
			 * @param {modules} modules
			 */
			async (modules, userId, serverId, params) => {
				const { char_name, char_srl, class_id, gender_id, level, race_id, server_id, user_srl } = params;

				// Implementation example (sending item for level up):
				/*
				const itemClaim = new ItemClaim(modules, userId, serverId);

				switch (level) {
					case 10:
						await itemClaim.makeBox({
							title: "Level 10 is up!",
							content: "Your gift for leveling up your character.",
							icon: "GiftBox01.bmp",
							days: 365,
							items: [
								{ item_template_id: 5250, item_count: 1 } // Village Atlas (15 Days)
							]
						});
						break;
				}
				*/
			}
		] }]
	],

	// Events triggered when a character is deleted in the game.
	deleteChar: [
		[Custom, { invoke: [
			/**
			 * Example of callback function.
			 * @param {modules} modules
			 */
			async (modules, userId, serverId, params) => {
				const { char_srl, server_id, user_srl } = params;

				// Implementation here
			}
		] }]
	],

	// Events triggered when cheats are detected in the game.
	reportCheater: [
		[Custom, { invoke: [
			/**
			 * Example of callback function.
			 * @param {modules} modules
			 */
			async (modules, userId, serverId, params) => {
				const { cheat_info, ip, svr_id, type, usr_srl } = params;

				// Example of implementation (user kick)
				// await modules.hub.kickUser(serverId, userId, 33);
			}
		] }]
	]
};