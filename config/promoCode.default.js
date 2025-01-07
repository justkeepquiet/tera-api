"use strict";

// THE CHANGES MADE ARE APPLIED WITHOUT RESTARTING THE PROCESS.

const Shop = require("../src/actions/handlers/shop");
const Benefit = require("../src/actions/handlers/benefit");
const ItemClaim = require("../src/actions/handlers/itemClaim");

// Default benefit id for Elite Status
const benefitId = process.env.API_PORTAL_BENEFIT_ID_ELITE_STATUS || 433; // TERA Club

// Box Context base settings for sending items on Promo code activation
const boxContext = {
	// Title of the box sent to the player
	title: "Promo Code Activation",

	// Message text included in the box
	content: "Your promo code activation gift!",

	// Box item icon file name (GiftBox01.bmp or GiftBox02.bmp)
	icon: "GiftBox01.bmp",

	// Period of storage of the box in days
	days: 365
};

// List of Promo code functions, linked with certain promo code.
// The functions specified here are automatically displayed in the Admin Panel.
module.exports = {
	// FREE-70-LVLUP
	add_item_70_scroll: [
		[ItemClaim, {
			makeBox: [{ ...boxContext,
				// List of items in the box
				items: [
					{ item_template_id: 207631, item_count: 1 } // (207631) Level 70 Scroll
				]
			}]
		}]
	],

	// FREE-100-COINS
	fund_100_coins: [
		[Shop, { fund: [100] }]
	],

	// FREE-VIP-30DAY
	add_benefit_vip_30: [
		[Benefit, { addBenefit: [benefitId, 30] }]
	]
};