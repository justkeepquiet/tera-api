"use strict";

const Shop = require("../src/actions/handlers/shop");
const Benefit = require("../src/actions/handlers/benefit");
const ItemClaim = require("../src/actions/handlers/itemClaim");

// Default benefit id for Elite Status
const benefitId = process.env.API_PORTAL_BENEFIT_ID_ELITE_STATUS || 433; // TERA Club

// Box Context for Elite Status Voucher Benefit
const boxContext = {
	// Title of the box sent to the player
	title: "Your Premium Gift",

	// Message text included in the box
	content: "We give you these useful items for activating the Premium.",

	// Box item icon file name (GiftBox01.bmp or GiftBox02.bmp)
	icon: "GiftBox01.bmp",

	// Period of storage of the box in days
	days: 365,

	// List of items in the box
	items: [
		{ item_template_id: 207018, item_count: 1 }, // (207018) Care and Use of Your Pet Candyspinner (15 Days)
		{ item_template_id: 81207, item_count: 1000 } // (81207) Tikat
	]
};

module.exports = {
	/*
	 * Shop Token
	 */

	// Сертификат на 1 звезду
	215296: [[Shop, { fund: [1] }]],

	// Сертификат на 5 звезд
	215297: [[Shop, { fund: [5] }]],

	// Сертификат на 20 звезд
	215298: [[Shop, { fund: [20] }]],

	// Сертификат на 65 звезд
	215299: [[Shop, { fund: [65] }]],

	// Сертификат на 100 звезд
	215300: [[Shop, { fund: [100] }]],

	// Сертификат на 330 звезд
	215301: [[Shop, { fund: [330] }]],

	// Сертификат на 500 звезд
	215302: [[Shop, { fund: [500] }]],

	// Сертификат на 960 звезд
	215303: [[Shop, { fund: [960] }]],

	// Сертификат на 2000 звезд
	215304: [[Shop, { fund: [2000] }]],

	// Сертификат на 5000 звезд
	215305: [[Shop, { fund: [5000] }]],


	/*
	 * Elite Status Voucher Benefit
	 */

	// Mini Chronoscroll
	358: [[Benefit, { addBenefit: [benefitId, 7] }], [ItemClaim, { makeBox: [boxContext] }]],

	// Chronoscroll
	372: [[Benefit, { addBenefit: [benefitId, 30] }], [ItemClaim, { makeBox: [boxContext] }]],

	// Triple Chronoscroll
	373: [[Benefit, { addBenefit: [benefitId, 90] }], [ItemClaim, { makeBox: [boxContext] }]],

	// VIP 1 Day
	149897: [[Benefit, { addBenefit: [benefitId, 1] }]],

	// VIP 15 Day
	149901: [[Benefit, { addBenefit: [benefitId, 15] }]],

	// VIP 3 Day
	149898: [[Benefit, { addBenefit: [benefitId, 3] }]],

	// VIP 30 Day
	149902: [[Benefit, { addBenefit: [benefitId, 30] }], [ItemClaim, { makeBox: [boxContext] }]],

	// VIP 5 Day
	149899: [[Benefit, { addBenefit: [benefitId, 5] }]],

	// VIP 7 Day
	149900: [[Benefit, { addBenefit: [benefitId, 7] }]],

	// VIP 30 Day
	215306: [[Benefit, { addBenefit: [benefitId, 30] }], [ItemClaim, { makeBox: [boxContext] }]],

	// TERA Club Membership (3 Days)
	155780: [[Benefit, { addBenefit: [benefitId, 3] }]],

	// TERA Club Membership (30 Days)
	155503: [[Benefit, { addBenefit: [benefitId, 30] }], [ItemClaim, { makeBox: [boxContext] }]],

	// Elite Status Voucher (1-day)
	183455: [[Benefit, { addBenefit: [benefitId, 1] }]],

	// Elite Status Voucher (14-day)
	183459: [[Benefit, { addBenefit: [benefitId, 14] }]],

	// Elite Status Voucher (180-day)
	183463: [[Benefit, { addBenefit: [benefitId, 180] }], [ItemClaim, { makeBox: [boxContext] }]],

	// Elite Status Voucher (30-day)
	183460: [[Benefit, { addBenefit: [benefitId, 30] }], [ItemClaim, { makeBox: [boxContext] }]],

	// Elite Status Voucher (360-day)
	183464: [[Benefit, { addBenefit: [benefitId, 360] }], [ItemClaim, { makeBox: [boxContext] }]],

	// Elite Status Voucher (5-day)
	183457: [[Benefit, { addBenefit: [benefitId, 5] }]],

	// Elite Status Voucher (60-day)
	183461: [[Benefit, { addBenefit: [benefitId, 60] }], [ItemClaim, { makeBox: [boxContext] }]],

	// Elite Status Voucher (7-day)
	183458: [[Benefit, { addBenefit: [benefitId, 7] }], [ItemClaim, { makeBox: [boxContext] }]],

	// Elite Status Voucher (90-day)
	183462: [[Benefit, { addBenefit: [benefitId, 90] }], [ItemClaim, { makeBox: [boxContext] }]]
};