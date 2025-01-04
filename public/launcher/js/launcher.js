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
	document.body.onselectstart = function(event) {
		if (event.target.tagName === "INPUT" || event.target.tagName === "TEXTAREA") {
			return true;
		}

		return false;
	};

	initErrorMsgArray();
	Launcher.startup();
});

/**
 * API calls
 */
function launcherLoginAction(login, password) {
	return apiRequest("LoginAction", {
		login: login,
		password: password
	});
}

function launcherLogoutAction(authKey) {
	return apiRequest("LogoutAction", {
		authKey: authKey
	});
}

function launcherResetPasswordAction(email, captcha) {
	return apiRequest("ResetPasswordAction", {
		"g-recaptcha-response": captcha,
		email: email
	});
}

function launcherResetPasswordVerifyAction(code, password) {
	return apiRequest("ResetPasswordVerifyAction", {
		code: code,
		password: password
	});
}

function launcherSignupAction(login, email, password, captcha) {
	return apiRequest("SignupAction", {
		"g-recaptcha-response": captcha,
		login: login,
		email: email,
		password: password
	});
}

function launcherSignupVerifyAction(code) {
	return apiRequest("SignupVerifyAction", {
		code: code
	});
}

function getAccountInfoAction() {
	return apiRequest("GetAccountInfoAction");
}

function setAccountLanguageAction(language) {
	return apiRequest("SetAccountLanguageAction", {
		language: language
	});
}

function launcherEndGameReport(code1, code2, version) {
	return apiRequest("ReportAction", {
		code1: code1,
		code2: code2,
		version: version
	});
}

function launcherActionReport(action, label, optLabel) {
	var data = {
		action: action
	};

	if (label) {
		data.label = label;
	}

	if (optLabel) {
		data.optLabel = optLabel;
	}

	return apiRequest("ReportAction", data);
}

function launcherMaintenanceStatus() {
	return apiRequest("MaintenanceStatus");
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
		location.replace(page);
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
		launcherEndGameReport(code1, code2, null);
	},

	logAction: function(action, label, optLabel) {
		launcherActionReport(action, label, optLabel);
	},

	/*
	 * Main frame events
	 */
	setAccountInfo: function(cb) {
		var result = getAccountInfoAction();

		if (result && result.Return) {
			ACCOUNT_ID = result.UserNo;
			ACCOUNT_NAME = result.UserName;
			AUTH_KEY = result.AuthKey;
			PERMISSION = result.Permission.toString();
			PRIVILEGE = result.Privilege.toString();
			BANNED = result.Banned;
			CHAR_COUNT = result.CharacterCount;
			REGION = result.Region;
			QA_MODE = PRIVILEGE == QA_PRIVILEGE;

			if (typeof cb == "function") {
				cb();
			}
		} else {
			Launcher.showError("Internal error");
			Launcher.disableLaunchButton("btn-wrong");
		}
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

		Launcher.isLoginSuccess = true;

		Launcher.sendCommand("login|" + ACCOUNT_ID);
		Launcher.sendCommand("check_p");

		Launcher.logAction("signin", "BHS");
	},

	/*
	 * QA form events
	 */
	setQaBox: function() {
		$("#qaRegion option[value=" + REGION + "]").attr("selected", "selected");
		$("#qaBox").show();

		$("#qaHide").click(function() {
			$("#qaBox a, #qaBox fieldset").hide();
			$("#qaBox").fadeOut("fast");
		});

		$("#qaRegion").on("change", function() {
			Launcher.abortPatch();
			Launcher.setRegion(this.value, true);
		});

		$("#qaModeCheck").click(function() {
			QA_MODE_NOCHECK = $(this).is(":checked");
		});

		QA_MODE_NOCHECK = $("#qaModeCheck").is(":checked");
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

		Launcher.setAccountInfo(function() {
			if (!QA_MODE && PERMISSION < 256) {
				var maintenance = launcherMaintenanceStatus();

				if (maintenance && maintenance.Return && maintenance.StartTime) {
					Launcher.showError(maintenance.Description || serverMaintenanceString);
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
		});
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
			setAccountLanguageAction(language);

			if (reload) {
				Launcher.goTo("Main" + "?lang=" + language);
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
	return AUTH_KEY;
}

function l2w_getUserPermission() {
	return PERMISSION;
}

function l2w_getUserCharCnt() {
	return CHAR_COUNT;
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