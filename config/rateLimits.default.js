"use strict";

// CHANGES MADE ARE APPLIED ONLY AFTER THE PROCESS IS RESTARTED.

// All set points of all users are reset when API processes are restarted.

// ATTENTION!
// The client's IP address is used as an identifier. Therefore, if the API is behind a reverse
// proxy (nginx, CloudFlare), make sure that parameter "LOG_IP_ADDRESSES_FORWARDED_FOR" is
// set to "TRUE" so that the client's IP address is determined correctly.

// Configuration parameters can be found here:
//   https://github.com/animir/node-rate-limiter-flexible/wiki/Options

// Rate limitter settings for Portal API
module.exports.portalApi = {
	// Game Launcher
	launcher: {
		// endpoint: POST /launcher/LoginAction
		// 60 requests per 5 minutes with block for 1 hour
		loginAction: {
			points: 60,
			duration: 300,
			blockDuration: 3600
		},

		// endpoint: POST /launcher/ResetPasswordAction
		// 60 requests per 5 minutes with block for 1 hour
		resetPasswordAction: {
			points: 60,
			duration: 300,
			blockDuration: 3600
		},

		// endpoint: POST /launcher/ResetPasswordVerifyAction
		// 60 requests per 5 minutes with block for 1 hour
		resetPasswordVerifyAction: {
			points: 60,
			duration: 300,
			blockDuration: 3600
		},

		// endpoint: POST /launcher/SignupAction
		// 10 requests per 1 hour with block for 1 hour
		signupAction: {
			points: 10,
			duration: 3600,
			blockDuration: 3600
		},

		// endpoint: POST /launcher/SignupVerifyAction
		// 10 requests per 1 hour with block for 1 hour
		signupVerifyAction: {
			points: 10,
			duration: 3600,
			blockDuration: 3600
		},

		// endpoint: POST /launcher/ReportAction
		// 60 requests per 3 minutes with block for 1 hour
		reportAction: {
			points: 60,
			duration: 180,
			blockDuration: 3600
		},

		// endpoint: POST /launcher/GetAccountInfoAction
		// 180 requests per 3 minutes with block for 5 minutes
		getAccountInfoAction: {
			points: 180,
			duration: 180,
			blockDuration: 300
		},

		// endpoint: POST /launcher/GetCharacterCountAction
		// 180 requests per 3 minutes with block for 5 minutes
		getCharacterCountAction: {
			points: 180,
			duration: 180,
			blockDuration: 300
		},

		// endpoint: POST /launcher/GetAuthKeyAction
		// 60 requests per 3 minutes with block for 5 minutes
		getAuthKeyAction: {
			points: 60,
			duration: 180,
			blockDuration: 300
		},

		// endpoint: POST /launcher/SetAccountLanguageAction
		// 60 requests per 3 minutes with block for 5 minutes
		setAccountLanguageAction: {
			points: 60,
			duration: 180,
			blockDuration: 300
		},

		// endpoint: POST /launcher/CaptchaVerify
		// 10 requests per 1 minute with block for 5 minutes
		captchaVerify: {
			points: 10,
			duration: 60,
			blockDuration: 300
		}
	},

	// In-game Shop
	shop: {
		// endpoint: POST /shop/PurchaseAction
		// 1 request per 5 seconds with block for 1 minute
		purchaseAction: {
			points: 1,
			duration: 5,
			blockDuration: 60
		},

		// endpoint: POST /shop/PromoCodeAction
		// 1 request per 5 seconds with block for 1 minute
		promoCodeAction: {
			points: 1,
			duration: 5,
			blockDuration: 60
		},

		// endpoint: POST /shop/CouponAcceptAction
		// 60 requests per 3 minutes with block for 5 minutes
		couponAcceptAction: {
			points: 60,
			duration: 180,
			blockDuration: 300
		}
	}
};