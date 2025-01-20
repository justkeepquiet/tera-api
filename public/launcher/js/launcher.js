var host = "http://" + location.hostname + ((location.port && location.port != 80) ? ":" + location.port : ""); // Only HTTP is supported!
var locale = navigator.language || navigator.userLanguage;
var secure = location.protocol == "https:";
var debug = DEBUG_STR;

function getUrlParam(name) {
	var results = new RegExp("[\\?&]" + name + "=([^&#]*)")
		.exec(window.location.search);
	return (results !== null) ? results[1] || "" : "";
}

function regionToLanguage(region) {
	if (typeof REGIONS[region] != "undefined") {
		return REGIONS[region];
	} else {
		return "en";
	}
}

/**
 * Init
 */
$(function() {
	document.body.onselectstart = function(event) {
		if (event.target.tagName == "INPUT" || event.target.tagName == "TEXTAREA") {
			return true;
		}

		return false;
	};

	initErrorMsgArray();
	Launcher.startup();
});

/**
 * Launcher REST API
 */
var LauncherAPI = {
	loginAction: function(login, password) {
		return LauncherAPI.request("LoginAction", {
			login: login,
			password: password
		});
	},

	logoutAction: function(authKey) {
		return LauncherAPI.request("LogoutAction", {
			authKey: authKey
		});
	},

	resetPasswordAction: function(email) {
		return LauncherAPI.request("ResetPasswordAction", {
			email: email
		});
	},

	resetPasswordVerifyAction: function(code, password) {
		return LauncherAPI.request("ResetPasswordVerifyAction", {
			code: code,
			password: password
		});
	},

	signupAction: function(login, email, password) {
		return LauncherAPI.request("SignupAction", {
			login: login,
			email: email,
			password: password
		});
	},

	signupVerifyAction: function(code) {
		return LauncherAPI.request("SignupVerifyAction", {
			code: code
		});
	},

	getMaintenanceStatusAction: function() {
		return LauncherAPI.request("GetMaintenanceStatusAction");
	},

	getCharacterCountAction: function() {
		return LauncherAPI.request("GetCharacterCountAction");
	},

	getAuthKeyAction: function() {
		return LauncherAPI.request("GetAuthKeyAction");
	},

	getAccountInfoAction: function() {
		return LauncherAPI.request("GetAccountInfoAction");
	},

	setAccountLanguageAction: function(language) {
		return LauncherAPI.request("SetAccountLanguageAction", {
			language: language
		});
	},

	endGameReport: function(code1, code2, version) {
		return LauncherAPI.request("ReportAction", {
			code1: code1,
			code2: code2,
			version: version
		});
	},

	actionReport: function(action, label, optLabel) {
		var data = {
			action: action
		};

		if (label) {
			data.label = label;
		}

		if (optLabel) {
			data.optLabel = optLabel;
		}

		return LauncherAPI.request("ReportAction", data);
	},

	request: function(action, params) {
		var response = null;

		$.ajax({
			url: "/launcher/" + action + "?locale=" + locale + "&secure=" + secure + "&ts=" + Date.now(),
			method: params ? "post" : "get",
			data: params,
			async: false,
			success: function(data) {
				response = data;
			}
		});

		return response;
	}
};

/**
 * Launcher UI
 */
var Launcher = {
	status: 0,
	isLoginSuccess: false,

	startup: function() {
		Launcher.sendCommand("client|0,80,1024,768");
		Launcher.sendCommand("loaded");

		$("#msg-modal").click(function(e) {
			e.stopPropagation();
		});

		$("form, .sc-placeholder-container, .msg-modal .close-btn").click(function() {
			Launcher.hideMessage();
		});
	},

	loaded: function(w, h) {
		Launcher.sendCommand("size|" + w + "," + h);
		$(".form-horizontal").show();
	},

	goTo: function(page, hide) {
		if (hide) {
			Launcher.sendCommand("size|0,0");
		}

		$(".form-horizontal").hide();

		if (page.indexOf("?") != -1) {
			location.replace(page + "&ts=" + Date.now());
		} else {
			location.replace(page + "?ts=" + Date.now());
		}
	},

	/*
	 * Command wrapper
	 */
	sendCommand: function(command) {
		if (window.document.documentMode) {
			document.location.replace("command:" + command);
		}
	},

	/*
	 * Message modal events
	 */
	showSuccess: function(msg) {
		$("#msg-modal").removeClass("error");
		$("#msg-modal").addClass("success");
		$("#msg-modal span").html(msg);
		$("#msg-modal").fadeIn(100);
	},

	showError: function(msg) {
		$("#msg-modal").removeClass("success");
		$("#msg-modal").addClass("error");
		$("#msg-modal span").html(msg);
		$("#msg-modal").fadeIn(100);
	},

	hideMessage: function() {
		$("#msg-modal").fadeOut(100);
	},

	/*
	 * Reporting handlers
	 */
	gameEnd: function(code1, code2) {
		LauncherAPI.endGameReport(code1, code2, null);
	},

	logAction: function(action, label, optLabel) {
		LauncherAPI.actionReport(action, label, optLabel);
	},

	/*
	 * Login action events
	 */
	login: function() {
		$("#progressBar1").width(0);
		$("#progressBar2").width(0);
		$("#fileName").text("");
		$("#totalText").text("");

		$("#launcherMain").show().focus();

		var result = LauncherAPI.getAccountInfoAction();

		if (result && result.Return) {
			ACCOUNT_ID = result.UserNo;
			PERMISSION = result.Permission.toString();
			PRIVILEGE = result.Privilege.toString();
			BANNED = result.Banned;
			REGION = result.Region;
			QA_MODE = PRIVILEGE == QA_PRIVILEGE;
		} else {
			Launcher.showError("Internal error: Cannot get account info");
			Launcher.disableLaunchButton("btn-wrong");
			return;
		}

		Launcher.isLoginSuccess = true;

		Launcher.sendCommand("login|" + ACCOUNT_ID);
		Launcher.sendCommand("check_p");

		Launcher.logAction("signin", "BHS");
	},

	/*
	 * Play button events
	 */
	onButtonClick: function() {
		Launcher.hideMessage();

		switch ($("#playButton").text()) {
			case GAMESTART_BUTTON_STRINGS["btn-gamestart"]:
				Launcher.launchGame();
				break;

			case GAMESTART_BUTTON_STRINGS["btn-update"]:
				Launcher.patchGame();
				break;

			case GAMESTART_BUTTON_STRINGS["btn-repair"]:
				Launcher.repairGame();
				break;

			case GAMESTART_BUTTON_STRINGS["btn-break"]:
				Launcher.abortPatch();
				break;
		}
	},

	enableLaunchButton: function(cls) {
		$("#playButton").empty();
		$("#playButton").addClass("ready");
		$("#playButton").attr("class", "btn " + cls);
		$("#playButton").text(GAMESTART_BUTTON_STRINGS[cls]);
		$("#playButton").text(GAMESTART_BUTTON_STRINGS[cls]);
		$("#repair").show();
	},

	disableLaunchButton: function(cls) {
		$("#playButton").empty();
		$("#playButton").removeClass("ready");
		$("#playButton").attr("class", "btn " + cls);
		$("#playButton").text(GAMESTART_BUTTON_STRINGS[cls]);
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
		Launcher.disableLaunchButton("btn-wait");

		if (!QA_MODE && PERMISSION < 256) {
			var maintenance = LauncherAPI.getMaintenanceStatusAction();

			if (maintenance && maintenance.Return && maintenance.StartTime) {
				Launcher.showError(serverMaintenanceString);
				Launcher.enableLaunchButton("btn-gamestart");
				return;
			}
		}

		if (BANNED) {
			Launcher.showError(accountBlockedString);
			Launcher.disableLaunchButton("btn-wrong");
			return;
		}

		Launcher.status = 3;

		if ((QA_MODE && QA_MODE_NOCHECK) || START_NO_CHECK || PATCH_NO_CHECK) { // no check files in QA mode
			Launcher.status = 0;
			Launcher.sendCommand("execute|" + REGION);
			Launcher.logAction("enter_game", "BHS");
		} else {
			Launcher.sendCommand("start_p|0");
		}
	},

	patchGame: function() {
		Launcher.enableLaunchButton("btn-break");
		$("#repair").hide();

		Launcher.status = 1;
		Launcher.sendCommand("start_p|1");
	},

	repairGame: function() {
		Launcher.enableLaunchButton("btn-break");
		$("#repair").hide();

		Launcher.status = 2;
		Launcher.sendCommand("start_p|2");
	},

	abortPatch: function() {
		Launcher.disableLaunchButton("btn-wait");
		Launcher.sendCommand("abort_p");
	},

	setRegion: function(region, reload) {
		var language = regionToLanguage(region);

		if (language) {
			LauncherAPI.setAccountLanguageAction(language);

			if (reload) {
				Launcher.goTo("Main");
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
	var result = LauncherAPI.getAuthKeyAction();

	if (result && result.Return) {
		return result.AuthKey;
	}
}

function l2w_getUserPermission() {
	return PERMISSION;
}

function l2w_getUserCharCnt() {
	var result = LauncherAPI.getCharacterCountAction();

	if (result && result.Return) {
		return result.CharacterCount;
	}
}

function l2w_tooManyRetry() {
	debug("Too many retries on patching");
	return 1;
}

function l2w_checkPatchResult(patch_result, patch_error, file, reason, code) {
	debug(sprintf("Check patch finished with %d %d [%s] %d, %d", patch_result, patch_error, file, reason, code));

	if ((QA_MODE && QA_MODE_NOCHECK) || PATCH_NO_CHECK) { // no check files in QA mode
		Launcher.enableLaunchButton("btn-gamestart");
		return;
	}

	switch (patch_result) {
		case 2: // RESULT_LATEST_VERSION
			Launcher.enableLaunchButton("btn-gamestart");
			break;

		case 3: // RESULT_NEED_UPDATE
			Launcher.enableLaunchButton("btn-update");
			break;

		case 4: // RESULT_NEED_FILE_CHECK
			Launcher.enableLaunchButton("btn-repair");
			break;

		default:
			if (patch_error == 3 || patch_error == 13 || patch_error == 14) {
				Launcher.enableLaunchButton("btn-repair");
			} else {
				Launcher.disableLaunchButton("btn-wrong");
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
				Launcher.disableLaunchButton("btn-wait");
				Launcher.status = 4;
				Launcher.sendCommand("execute|" + REGION);
				Launcher.logAction("enter_game", "BHS");
			} else {
				Launcher.status = 0;
				Launcher.enableLaunchButton("btn-gamestart");
			}
			break;

		case 1: // patch aborted
			Launcher.status = 0;
			Launcher.sendCommand("check_p");
			break;

		case 3:
			Launcher.status = 0;
			Launcher.enableLaunchButton("btn-update");
			break;

		case 4:
			Launcher.status = 0;
			Launcher.enableLaunchButton("btn-repair");
			break;

		default:
			Launcher.status = 0;
			if (patch_error == 3 || patch_error == 13 || patch_error == 14) {
				Launcher.enableLaunchButton("btn-repair");
			} else if (patch_error == 6) {
				Launcher.enableLaunchButton("btn-update");
			} else {
				Launcher.disableLaunchButton("btn-wrong");
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

	Launcher.status = 0;
	// Launcher.sendCommand("close");
	Launcher.enableLaunchButton("btn-gamestart");

	debug(sprintf("Game end 0x%X, 0x%X", end_type1, end_type2));
	displayLauncherError(end_type1, end_type2);
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
	debug(page_id);

	if (PAGES_MAP.hasOwnProperty(page_id)) {
		var authKey = l2w_getOTP();

		setTimeout(function() {
			window.open(PAGES_MAP[page_id].replace("%s", authKey));
		}, 0);
	}
}

function l2w_getWebLinkUrl(act_id, param) {
	debug(act_id, param);

	if (ACTS_MAP.hasOwnProperty(act_id)) {
		var authKey = l2w_getOTP();

		return ACTS_MAP[act_id].replace("%s", authKey);
	}
}