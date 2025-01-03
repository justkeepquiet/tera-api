var PATCH_ERROR = null;
var PATCH_REASON = null;
var LAUNCHER_ERROR = null;

function initErrorMsgArray() {
	PATCH_ERROR = new Array();
	PATCH_ERROR["0"] = "ERROR_NONE";
	PATCH_ERROR["1"] = "Patcher is not initialized";
	PATCH_ERROR["2"] = "Update information is not prepared";
	PATCH_ERROR["3"] = "Corrupted file found - run repair";
	PATCH_ERROR["4"] = "Invalid file path";
	PATCH_ERROR["5"] = "Invalid version.ini";
	PATCH_ERROR["6"] = "Download failed";
	PATCH_ERROR["7"] = "Cannot extract file";
	PATCH_ERROR["8"] = "Cannot patch file";
	PATCH_ERROR["9"] = "Cannot get file information";
	PATCH_ERROR["10"] = "Cannot access file";
	PATCH_ERROR["11"] = "Cannot move file";
	PATCH_ERROR["12"] = "Invalid server.db";
	PATCH_ERROR["13"] = "Invalid local.db - run repair";
	PATCH_ERROR["14"] = "File mismatch - run repair";
	PATCH_ERROR["15"] = "Internal error";
	PATCH_ERROR["16"] = "No memory";

	PATCH_REASON = new Array();
	PATCH_REASON["-1"] = "UNKNOWN";
	PATCH_REASON["0"] = "NONE";
	PATCH_REASON["1"] = "ABORTED";
	PATCH_REASON["2"] = "Internal error";
	PATCH_REASON["3"] = "Invalid file size";
	PATCH_REASON["4"] = "Cannot open file";
	PATCH_REASON["5"] = "Cannot create file";
	PATCH_REASON["6"] = "Cannot read file";
	PATCH_REASON["7"] = "Cannot write file";
	PATCH_REASON["8"] = "Cannot extract file";
	PATCH_REASON["9"] = "Cannot patch file";
	PATCH_REASON["10"] = "Cannot calculate file hash value";
	PATCH_REASON["11"] = "Download disconnected";
	PATCH_REASON["12"] = "Download timeout";
	PATCH_REASON["13"] = "Invalid URL";
	PATCH_REASON["14"] = "URL not found";
	PATCH_REASON["15"] = "URL busy";

	// Launcher는 ErrorCode로 2개의 16비트 integer를 반환한다. 이를 Error Code와 Additional info로 구분한다. Additional info는 프로그래머(현재 박광진님)이 체크하기 위한 것이고, 외부 공유에는 error code만 주면 된다.
	LAUNCHER_ERROR = new Object();
	LAUNCHER_ERROR["x0"] = "Normal end"; 										// 0	: 정상종료
	LAUNCHER_ERROR["x5"] = "Error caused the window to close"; 					// 5	: DirectX API 에러로 인한 크래시
	LAUNCHER_ERROR["x6"] = "Data Center abnormal";								// 6	: 비정상 데이터센터
	LAUNCHER_ERROR["x7"] = "Normal end";										// 7 	: 정상종료
	LAUNCHER_ERROR["x8"] = "In the game, an error occurred on the network";						// 8	: network error
	LAUNCHER_ERROR["x9"] = "Connection timed out";								// 9	: ticket요청을 받고 5초 이내에 ticket을 전달하지 못했을 때
	LAUNCHER_ERROR["x10"] = "Insufficient memory";								// 10	: 메모리 부족
	LAUNCHER_ERROR["x11"] = "DirectX initialization failed";					// 11	: DirectX 초기화 실패
	LAUNCHER_ERROR["x12"] = "Use an unsupported graphics card";					// 12	: 지원하지 않는 그래픽카드 사용
	LAUNCHER_ERROR["x15"] = "A long time has not been entered and ended";		// 15	: 오랫동안 입력이 없어서 종료
	LAUNCHER_ERROR["x16"] = "Through the connection end menu Normal end";		// 16	: 접속종료 메뉴를 통해서 정상종료
	LAUNCHER_ERROR["x17"] = "Service temporarily unavailable";
	LAUNCHER_ERROR["x32"] = "Disconnected by administrator";					// 32	: 웹운영툴로 직접 접속종료
	LAUNCHER_ERROR["x33"] = "Disconnected by administrator";					// 33	: 웹운영툴로 강제 접속종료
	LAUNCHER_ERROR["x34"] = "Disconnected by administrator";					// 34	: 인게임 운영툴로 접속종료
	LAUNCHER_ERROR["x257"] = "Member authentication failed";					// 257	: 인증 실패 : 인증키 불일치
	LAUNCHER_ERROR["x258"] = "Billing error";									// 258	: billing fail
	LAUNCHER_ERROR["x259"] = "Repeat login";									// 259	: 중복접속(기존접속)
	LAUNCHER_ERROR["x260"] = "Commodity expiration";							// 260	: 상품만료(현재 사용안함) - ex. playtime 소진
	LAUNCHER_ERROR["x261"] = "Connection error with server";					// 261	: server network fail (현재 사용안함?-심재한) -ex. userEntityServer down.
	LAUNCHER_ERROR["x262"] = "Repeat login";									// 262	: 중복접속(신규접속)
	LAUNCHER_ERROR["x263"] = "No server connection permission";					// 263	: 서버 접속 권한 없음
	LAUNCHER_ERROR["x264"] = "Account blocked";									// 264	: BANNED
	LAUNCHER_ERROR["x273"] = "SLS error";										// 273	: SLS 오류
	LAUNCHER_ERROR["x274"] = "ini error";										// 274	: ini 오류
	LAUNCHER_ERROR["x275"] = "TERA.EXE Execution failed";						// 275	: TERA.EXE 실행 실패
	LAUNCHER_ERROR["x276"] = "Launcher update failed";							// 276	: 런처 업데이트 실패
	LAUNCHER_ERROR["x277"] = "Failed to initialize update file";				// 277	: 패처 초기화 실패
	LAUNCHER_ERROR["x278"] = "The condition of tampering with TERA.EXE or unable to connect to TERA.EXE file";		// 278	: TERA.EXE가 변조되었거나 TERA.EXE파일에 접근 불가 상태
	LAUNCHER_ERROR["x65280"] = "Game guard related, Game guard led to the end";	// 65280: 게임가드관련. 게임가드에 의한 종료.
	LAUNCHER_ERROR["x65285"] = "Game guard related, Game guard led to the end";	// 65285: 게임가드관련. 게임가드에 의한 종료.
	// Additional info : 게임가드 오류코드. (2900~3700 : GameGuard의 CSAuth 관련 오류코드. 나머지 : GameGuard Client의 오류 코드)
	// Additional info : Game guard 錯誤碼。(2900~3700 : GameGuard的CSAuth相關錯誤碼，其餘 : GameGuard Client的錯誤碼)
	LAUNCHER_ERROR["x65535"] = "Game program closed";							// 65535: Client crashed
	LAUNCHER_ERROR["x65520"] = "Game program closed";							// 65520: Client crashed (client know)
	LAUNCHER_ERROR["0x000x"] = "Game program";									// Client	0~15
	LAUNCHER_ERROR["0x001x"] = "Server can't connect";							// Arbiter	16~31
	LAUNCHER_ERROR["0x002x"] = "Operating tools"; 								// 운영툴		31~47
	LAUNCHER_ERROR["0x010x"] = "Server can't connect";							// arg_gw	256~271
	LAUNCHER_ERROR["0x011x"] = "launcher";										// launcher	272~287
	LAUNCHER_ERROR["0x0109"] = "The client file is damaged, please perform a file check";	// 클라이언트 파일이 손상 되었습니다. 파일 검사를 실행해 주시기 바랍니다.
}

function displayPatchError(patch_error, file, reason, code) {
	var errorMsg = PATCH_ERROR[patch_error.toString()] + "\n";

	if (file.length > 0) errorMsg += "\nFile: " + file;
	if (reason > 0) errorMsg += "\nReason: " + PATCH_REASON[reason.toString()];

	errorMsg += "\nCode: " + code.toString();

	alert(errorMsg);
}

function displayLauncherError(end_type1, end_type2) {
	if (end_type1 == 0 || end_type1 == 7 || end_type1 == 16) return;

	var errorMsg = end_type1 + " (" + end_type2 + "): ";

	errorMsg += LAUNCHER_ERROR["x" + end_type1] + ".";
	// errorMsg += "Do you want visit FAQ page?";

	// if (confirm("Error " + errorMsg)) {
	// 	window.open("../faq?searchText=" + end_type1);
	// }

	Launcher.showError(errorMsg);
}