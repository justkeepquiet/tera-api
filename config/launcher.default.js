"use strict";

// THE CHANGES MADE ARE APPLIED WITHOUT RESTARTING THE PROCESS.

module.exports = {
	// Pages URLs for in-game actions (e.g. opening a page when entering the game).
	// You can specify the "%s" tag, which will include the user's current AuthKey.
	actsMap: {
		// On auth the game
		210: "/tera/ShopAuth?authKey=%s", // opens TERA Shop

		// On enter the game
		230: "/tera/ShopAuth?authKey=%s" // opens TERA Shop
	},

	// Pages URLs used to open pop-up windows from the game interface.
	// You can specify the "%s" tag, which will include the user's current AuthKey.
	pagesMap: {
		// Homepage
		// 0: "http://example.com",

		// League
		// 1: "http://example.com/league",

		// Support
		// 11: "http://example.com/support",

		// Homepage
		// 13: "http://example.com",

		// Facebook
		// 30: "http://facebook.com",

		// VK
		// 32: "http://vk.com",

		// Youtube
		// 33: "http://youtube.com",

		// Donation
		// 201501: "http://example.com/donation",

		// Inventory
		// 2017041901: "http://example.com/inventory",

		// Collection
		// 2017041902: "http://example.com/collection"
	}
};