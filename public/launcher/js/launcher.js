var host = "http://" + location.hostname + ((location.port && location.port != 80) ? ":" + location.port : ""); // Only HTTP is supported!
var debug = DEBUG_STR;

function urlParam(name) {
	var results = new RegExp("[\\?&]" + name + "=([^&#]*)")
		.exec(window.location.search);

	return (results !== null) ? results[1] || 0 : false;
}

function regionToLanguage(region) {
	var regions = {
		CHN: "cn", EUR: "en",
		FRA: "fr", GER: "de",
		INT: "en", JPN: "jp",
		KOR: "kr", RUS: "ru",
		SE: "se", THA: "th",
		TW: "tw", USA: "en-US"
	};

	if (typeof regions[region] !== "undefined") {
		return regions[region];
	} else {
		return "en";
	}
}

/**
 * Init
 */
$(function() {
	initErrorMsgArray();
	Launcher.startup();
});

/**
 * API calls
 */
function launcherLoginAction(login, password) {
	return apiRequest("LauncherLoginAction", {
		login: login,
		password: password
	});
}

function launcherLogoutAction(authKey) {
	return apiRequest("LauncherLogoutAction", {
		authKey: authKey
	});
}

function launcherResetPasswordAction(email, captcha) {
	return apiRequest("LauncherResetPasswordAction", {
		"g-recaptcha-response": captcha,
		email: email
	});
}

function launcherResetPasswordVerifyAction(token, code, password) {
	return apiRequest("LauncherResetPasswordVerifyAction", {
		token: token,
		code: code,
		password: password
	});
}

function launcherSignupAction(login, email, password, captcha) {
	return apiRequest("LauncherSignupAction", {
		"g-recaptcha-response": captcha,
		login: login,
		email: email,
		password: password
	});
}

function launcherSignupVerifyAction(token, code) {
	return apiRequest("LauncherSignupVerifyAction", {
		token: token,
		code: code
	});
}

function getAccountInfoByUserNo(userNo, authKey) {
	return apiRequest("GetAccountInfoByUserNo", {
		userNo: userNo,
		authKey: authKey
	});
}

function setAccountInfoByUserNo(userNo, authKey, language) {
	return apiRequest("SetAccountInfoByUserNo", {
		userNo: userNo,
		authKey: authKey,
		language: language
	});
}

function launcherEndGameReport(userNo, authKey, code1, code2, version) {
	return apiRequest("LauncherReportAction", {
		userNo: userNo,
		authKey: authKey,
		code1: code1,
		code2: code2,
		version: version
	});
}

function launcherActionReport(userNo, authKey, action, label, optLabel) {
	var data = {
		userNo: userNo,
		authKey: authKey,
		action: action
	};

	if (label) {
		data.label = label;
	}

	if (optLabel) {
		data.optLabel = optLabel;
	}

	return apiRequest("LauncherReportAction", data);
}

function launcherMaintenanceStatus() {
	return apiRequest("LauncherMaintenanceStatus");
}

function apiRequest(action, params) {
	var response = null;

	$.ajax({
		url: "/launcher/" + action + "?lang=" + urlParam("lang") + "&secure=" + (location.protocol == "https:") + "&ts=" + Date.now(),
		method: params ? "post" : "get",
		data: params,
		async: false,
		success: function(data) {
			response = data;
		}
	});

	return response;
}

/**
 * Launcher UI
 */
var Launcher = {
	status: 0,
	isLoginSuccess: false,

	startup: function() {
		Launcher.sendCommand("client|0,80,1024,768");
		Launcher.sendCommand("loaded");

		$("#progressBar1").width(0);
		$("#progressBar2").width(0);
		$("#fileName").text("");
		$("#totalText").text("");

		if (!urlParam("lang")) {
			if (localStorage.REGION) {
				Launcher.setRegion(localStorage.REGION, true);
			} else {
				Launcher.setRegion(REGIONS[USER_LANG] || REGIONS["en-US"] || REGION, true);
			}
		}
	},

	/*
	 * Command wrapper
	 */
	sendCommand: function(command) {
		document.location.replace("command:" + command);
	},

	/*
	 * Error handling
	 */
	showError: function(strTitle, strError) {
		$("#errorTitle", $("#errorIFrame").contents()).html(strTitle);
		$("#errorText", $("#errorIFrame").contents()).html(strError);
		$("#errorScreen").show();
	},

	hideError: function() {
		$("#errorScreen").hide();
	},

	/*
	 * Reporting handlers
	 */
	gameEnd: function(code1, code2) {
		launcherEndGameReport(loginIFrame.ACCOUNT_ID, loginIFrame.AUTH_KEY, code1, code2, null);
	},

	logAction: function(action, label, optLabel) {
		launcherActionReport(loginIFrame.ACCOUNT_ID, loginIFrame.AUTH_KEY, action, label, optLabel);
	},

	/*
	 * Login frame events
	 */
	loginSuccess: function() {
		$("#userName").html(loginIFrame.ACCOUNT_NAME);
		$("#launcherMain").show().focus();

		Launcher.hideLoginIFrame();
		Launcher.isLoginSuccess = true;

		Launcher.sendCommand("login|" + loginIFrame.ACCOUNT_ID);
		Launcher.sendCommand("check_p");
		Launcher.logAction("signin", "BHS");

		loginIFrame.$("#userLoginForm")[0].reset();
	},

	showLoginIFrame: function() {
		Launcher.sendCommand("size|320,500");
		$("#loginScreen").show();
		$("#launcherMain").hide();
	},

	hideLoginIFrame: function() {
		Launcher.sendCommand("size|960,610");
		$("#loginScreen").hide();
	},

	/*
	 * Play button events
	 */
	onButtonClick: function() {
		switch ($("#playButton").text()) {
			case "Play":
				Launcher.launchGame();
				break;

			case "Update":
				Launcher.patchGame();
				break;

			case "Repair":
				Launcher.repairGame();
				break;

			case "Abort":
				Launcher.abortPatch();
				break;
		}
	},

	enableLaunchButton: function(text, cls) {
		$("#playButton").addClass("ready");
		$("#playButton").attr("class", "btn " + cls);
		$("#playButton").text(text);
		$("#repair").show();
	},

	disableLaunchButton: function(text, cls) {
		$("#playButton").removeClass("ready");
		$("#playButton").attr("class", "btn " + cls);
		$("#playButton").text(text);
		$("#repair").show();
	},

	/*
	 * Repair button event
	 */
	filesCheck: function() {
		if ($("#playButton").hasClass("btn-break")) {
			return false;
		}

		Launcher.repairGame();
	},

	/*
	 * Launcher procedures
	 */
	launchGame: function() {
		Launcher.disableLaunchButton("Wait", "btn-wait");
		Launcher.setRegion(REGION, false);

		if (!loginIFrame.QA_MODE && loginIFrame.PERMISSION < 256) {
			var maintenance = launcherMaintenanceStatus();

			if (maintenance && maintenance.Return && maintenance.StartTime) {
				alert(maintenance.Description || serverMaintenanceString);
				Launcher.enableLaunchButton("Play", "btn-gamestart");
				return;
			}
		}

		if (loginIFrame.BANNED) {
			alert(accountBlockedString);
			Launcher.disableLaunchButton("Error", "btn-wrong");
			return;
		}

		Launcher.status = 3;

		if ((loginIFrame.QA_MODE && loginIFrame.QA_MODE_NOCHECK) || START_NO_CHECK || PATCH_NO_CHECK) { // no check files in QA mode
			Launcher.status = 0;
			Launcher.sendCommand("execute|" + REGION);
			Launcher.logAction("enter_game", "BHS");
		} else {
			Launcher.sendCommand("start_p|0");
		}
	},

	patchGame: function() {
		Launcher.enableLaunchButton("Abort", "btn-break");
		$("#repair").hide();

		Launcher.status = 1;
		Launcher.sendCommand("start_p|1");
	},

	repairGame: function() {
		Launcher.enableLaunchButton("Abort", "btn-break");
		$("#repair").hide();

		Launcher.status = 2;
		Launcher.sendCommand("start_p|2");
	},

	abortPatch: function() {
		Launcher.disableLaunchButton("Wait", "btn-wait");
		Launcher.sendCommand("abort_p");
	},

	setRegion: function(region, reload) {
		var language = regionToLanguage(region);

		if (language) {
			if (loginIFrame.ACCOUNT_ID && loginIFrame.AUTH_KEY) {
				setAccountInfoByUserNo(loginIFrame.ACCOUNT_ID, loginIFrame.AUTH_KEY, language);
			}

			if (reload) {
				location.replace("LauncherMain" + "?lang=" + language);
			}
		}

		REGION = region;
	}
};

/**
 * Launcher L2W hooks
 */
function l2w_getBaseUrl() {
	var patchUrl = PATCH_URL;

	if (!patchUrl) {
		patchUrl = host + "/public/patch";
	}
	if (!patchUrl.match(new RegExp("^http", "i"))) {
		patchUrl = host + patchUrl;
	}

	return patchUrl;
}

function l2w_getLauncherInfoUrl() {
	return l2w_getBaseUrl() + "/launcher_info.ini";
}

function l2w_getServerList() {
	return host + "/tera/ServerList?lang=" + regionToLanguage(REGION).split("-")[0];
}

function l2w_getOTP() {
	return loginIFrame.AUTH_KEY;
}

function l2w_getUserPermission() {
	return loginIFrame.PERMISSION;
}

function l2w_getUserCharCnt() {
	return loginIFrame.CHAR_COUNT;
}

function l2w_tooManyRetry() {
	debug("Too many retries on patching");
	return 1;
}

function l2w_checkPatchResult(patch_result, patch_error, file, reason, code) {
	debug(sprintf("Check patch finished with %d %d [%s] %d, %d", patch_result, patch_error, file, reason, code));

	if ((loginIFrame.QA_MODE && loginIFrame.QA_MODE_NOCHECK) || PATCH_NO_CHECK) { // no check files in QA mode
		Launcher.enableLaunchButton("Play", "btn-gamestart");
		return;
	}

	switch (patch_result) {
		case 2: // RESULT_LATEST_VERSION
			Launcher.enableLaunchButton("Play", "btn-gamestart");
			break;

		case 3: // RESULT_NEED_UPDATE
			Launcher.enableLaunchButton("Update", "btn-update");
			break;

		case 4: // RESULT_NEED_FILE_CHECK
			Launcher.enableLaunchButton("Repair", "btn-repair");
			break;

		default:
			if (patch_error == 3 || patch_error == 13 || patch_error == 14) {
				Launcher.enableLaunchButton("Repair");
			} else {
				Launcher.disableLaunchButton("Error", "btn-wrong");
			}

			displayPatchError(patch_error, file, reason, code);
			break;
	}
}

function l2w_patchResult(patch_result, patch_error, file, reason, code) {
	debug(sprintf("Patch finished with %d %d [%s] %d, %d", patch_result, patch_error, file, reason, code));

	switch (patch_result) {
		case 0:
		case 2:
			$("#progressBar1").width("100%");
			$("#progressBar2").width("100%");
			$("#fileName").text("");
			$("#totalText").text("");
			if (Launcher.status == 3) {
				Launcher.disableLaunchButton("Wait", "btn-wait");
				Launcher.status = 4;
				Launcher.sendCommand("execute|" + REGION);
				Launcher.logAction("enter_game", "BHS");
			} else {
				Launcher.status = 0;
				Launcher.enableLaunchButton("Play", "btn-gamestart");
			}
			break;

		case 1: // patch aborted
			Launcher.status = 0;
			Launcher.sendCommand("check_p");
			break;

		case 3:
			Launcher.status = 0;
			Launcher.enableLaunchButton("Update", "btn-update");
			break;

		case 4:
			Launcher.status = 0;
			Launcher.enableLaunchButton("Repair", "btn-repair");
			break;

		default:
			Launcher.status = 0;
			if (patch_error == 3 || patch_error == 13 || patch_error == 14) {
				Launcher.enableLaunchButton("Repair", "btn-repair");
			} else if (patch_error == 6) {
				Launcher.enableLaunchButton("Update", "btn-update");
			} else {
				Launcher.disableLaunchButton("Error", "btn-wrong");
			}

			displayPatchError(patch_error, file, reason, code);
			break;
	}
}

function l2w_currentFile(process, file) {
	var patch_info = "";

	switch (process) {
		case 0: // PATCH_FILE_PROCESS_NONE
			patch_info = PATCH_INFO_STRINGS[0];
			break;

		case 1: // PATCH_FILE_PROCESS_DOWNLOAD
			patch_info = PATCH_INFO_STRINGS[1] + ": " + file;
			break;

		case 2: // PATCH_FILE_PROCESS_EXTRACT
			patch_info = PATCH_INFO_STRINGS[2] + ": " + file;
			break;

		case 3: // PATCH_FILE_PROCESS_PATCH
			patch_info = PATCH_INFO_STRINGS[3] + ": " + file;
			break;

		case 4: // PATCH_FILE_PROCESS_HASH
			patch_info = PATCH_INFO_STRINGS[4] + ": " + file;
			break;

		case 5: // PATCH_FILE_PROCESS_DELETE
			patch_info = PATCH_INFO_STRINGS[5] + ": " + file;
			break;

		case 6: // PATCH_FILE_PROCESS_FILE_CHECK
			patch_info = PATCH_INFO_STRINGS[6] + ": " + file;
			break;

		case 11: // PATCH_FILE_PROCESS_MAKE_PATCH_LIST
			patch_info = PATCH_INFO_STRINGS[11];
			break;

		default:
			patch_info = file;
			break;
	}

	$("#fileName").text(patch_info);
}

function l2w_currentProgress(rate, current, total, speed) {
	$("#progressBar1").width(rate + "%");
	// $('#percent').text(sprintf('%d/%d', current, total));
	// $('#incomingAvgSpeed').text(speed);
}

function l2w_totalProgress(rate, current, total) {
	$("#progressBar2").width(rate + "%");
	$("#totalText").text(sprintf("%d / %d", current, total));
}

function l2w_gameEvent(event) {
	debug(sprintf("Game event 0x%X", event));
}

function l2w_gameEnd(end_type1, end_type2) {
	Launcher.gameEnd(end_type1, end_type2);

	debug(sprintf("Game end 0x%X, 0x%X", end_type1, end_type2));
	displayLauncherError(end_type1, end_type2);

	Launcher.status = 0;
	Launcher.sendCommand("close");
}

function l2w_getExeInfo() {
	return "";
}

function l2w_systemInfoResult(result) {
	debug(result);
}

function l2w_displayInfoResult(result) {
	debug(result);
}

function l2w_openPopup(page_id) {
	/*
	if (page_id == 13) { // Homepage
		setTimeout(function() {
			window.open(URLS.homepage);
		}, 0);
		return;
	}

	if (page_id == 30) { // Facebook
		setTimeout(function() {
			window.open(URLS.facebook);
		}, 0);
		return;
	}

	if (page_id == 33) { // Youtube
		setTimeout(function() {
			window.open(URLS.youtube);
		}, 0);
		return;
	}
	*/
}

function l2w_getWebLinkUrl(act_id, param) {
	debug(act_id, param);
}