"use strict";

const eliteStatusVoucherBenefit = require("../src/actions/eliteStatusVoucherBenefit.actions");

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
	// You can only use the IDs of Service Items configured in the Box Web panel
	items: [
		{ item_id: 1, item_count: 1 },
		{ item_id: 2, item_count: 1 },
		{ item_id: 3, item_count: 1 }
	]
};

module.exports = {
	// Mini Chronoscroll
	358: [[eliteStatusVoucherBenefit, { addBenefit: [7], sendBox: [boxContext] }]],

	// Chronoscroll
	372: [[eliteStatusVoucherBenefit, { addBenefit: [30], sendBox: [boxContext] }]],

	// Triple Chronoscroll
	373: [[eliteStatusVoucherBenefit, { addBenefit: [90], sendBox: [boxContext] }]],

	// VIP 1 Day
	149897: [[eliteStatusVoucherBenefit, { addBenefit: [1] }]],

	// VIP 15 Day
	149901: [[eliteStatusVoucherBenefit, { addBenefit: [15] }]],

	// VIP 3 Day
	149898: [[eliteStatusVoucherBenefit, { addBenefit: [3] }]],

	// VIP 30 Day
	149902: [[eliteStatusVoucherBenefit, { addBenefit: [30], sendBox: [boxContext] }]],

	// VIP 5 Day
	149899: [[eliteStatusVoucherBenefit, { addBenefit: [5] }]],

	// VIP 7 Day
	149900: [[eliteStatusVoucherBenefit, { addBenefit: [7] }]],

	// VIP 30 Day
	215306: [[eliteStatusVoucherBenefit, { addBenefit: [30], sendBox: [boxContext] }]],

	// TERA Club Membership (3 Days)
	155780: [[eliteStatusVoucherBenefit, { addBenefit: [3] }]],

	// TERA Club Membership (30 Days)
	155503: [[eliteStatusVoucherBenefit, { addBenefit: [30], sendBox: [boxContext] }]],

	// Elite Status Voucher (1-day)
	183455: [[eliteStatusVoucherBenefit, { addBenefit: [1] }]],

	// Elite Status Voucher (14-day)
	183459: [[eliteStatusVoucherBenefit, { addBenefit: [14] }]],

	// Elite Status Voucher (180-day)
	183463: [[eliteStatusVoucherBenefit, { addBenefit: [180], sendBox: [boxContext] }]],

	// Elite Status Voucher (30-day)
	183460: [[eliteStatusVoucherBenefit, { addBenefit: [30], sendBox: [boxContext] }]],

	// Elite Status Voucher (360-day)
	183464: [[eliteStatusVoucherBenefit, { addBenefit: [360], sendBox: [boxContext] }]],

	// Elite Status Voucher (5-day)
	183457: [[eliteStatusVoucherBenefit, { addBenefit: [5] }]],

	// Elite Status Voucher (60-day)
	183461: [[eliteStatusVoucherBenefit, { addBenefit: [60], sendBox: [boxContext] }]],

	// Elite Status Voucher (7-day)
	183458: [[eliteStatusVoucherBenefit, { addBenefit: [7] }]],

	// Elite Status Voucher (90-day)
	183462: [[eliteStatusVoucherBenefit, { addBenefit: [90], sendBox: [boxContext] }]]
};