"use strict";

module.exports = {
	// Customizing the slides carousel on the shop welcome page
	// Slides can be uploaded to "public\shop\images" directory and must be resolution 740x300 px.
	// A product ID can be provided for the link reference.
	welcomeCarousel: [
		{ slide: "/public/shop/images/slide-01.jpg", productId: "195" },
		{ slide: "/public/shop/images/slide-02.jpg", productId: "185" },
		{ slide: "/public/shop/images/slide-03.jpg", productId: "97" },
		{ slide: "/public/shop/images/slide-04.jpg", productId: "162" }
	],

	// List of Founder Benefit IDs to display on the shop welcome page
	founderBenefits: [
		"334",
		"434",
		"534"
	],

	// List of VIP/Premium/TERA Club Benefit IDs to display on the shop welcome page
	premiumBenefits: [
		"333",
		"433",
		"533",
		"500",
		"520",
		"701"
	],

	// List of PC Cafe/PC Club Benefit IDs to display on the shop welcome page
	pcCafeBenefits: [
		"800",
		"801",
		"802",
		"803",
		"1000"
	]
};