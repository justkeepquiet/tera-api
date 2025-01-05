var DEBUG_STR = function(arg) {};
var DEBUG_FMT = function() {};
var DEBUG_FRAME = null;

function DebugEnable() {
	var frame = $("<div/>", {
		id: "DebugArea",
		style: "display: block; background: #eee; position: absolute; top: 200px; left: 50px; border: 1px solid #cccccc; margin-top: .3em; padding: 2px 4px; width: 760px; height: 240px; overflow: auto; z-index: 9999;"
	});
	var contents = $("<div/>", {
		id: "DebugConsole",
		style: "font-family: \"lucida console\", Courier; display: inline; font-size: .80em;"
	});
	frame.append(contents);
	DEBUG_STR = function(arg) {
		var t = new Date();
		var line = $("<span/>").html(
			t.toTimeString().split(" ")[0] + ":" + t.getMilliseconds() + " " + arg + "<br>");
		contents.append(line);
		if (frame.offsetHeight <= frame.scrollHeight) {
			frame.scrollTop = frame.scrollHeight;
		}
	};
	DEBUG_STR("Debug log console");
	$(window).bind("load", function() {
		$(document.body).append(frame);
		DEBUG_FRAME = frame;
	});
}

function sprintf() {
	if (!arguments || arguments.length < 1 || !RegExp) {
		return;
	}
	var str = arguments[0];
	var re = /([^%]*)%('.|0|\x20)?(-)?(\d+)?(\.\d+)?(%|b|c|d|u|f|o|s|x|X)(.*)/;
	var a = [], numSubstitutions = 0, numMatches = 0;
	var res = "";
	while (a = re.exec(str)) {
		var leftpart = a[1], pPad = a[2], pJustify = a[3], pMinLength = a[4];
		var pPrecision = a[5], pType = a[6], rightPart = a[7];
		numMatches++;
		if (pType == "%") {
			subst = "%";
		} else {
			numSubstitutions++;
			if (numSubstitutions >= arguments.length) {
				alert("Error! Not enough function arguments (" + (arguments.length - 1) + ", excluding the string)\nfor the number of substitution parameters in string (" + numSubstitutions + " so far).");
			}
			var param = arguments[numSubstitutions];
			var pad = "";
			if (pPad && pPad.substr(0, 1) == "'") pad = leftpart.substr(1, 1);
			else if (pPad) pad = pPad;
			var justifyRight = true;
			if (pJustify && pJustify === "-") justifyRight = false;
			var minLength = -1;
			if (pMinLength) minLength = parseInt(pMinLength);
			var precision = -1;
			if (pPrecision && pType == "f") precision = parseInt(pPrecision.substring(1));
			var subst = param;
			if (pType == "b") subst = parseInt(param).toString(2);
			else if (pType == "c") subst = String.fromCharCode(parseInt(param));
			else if (pType == "d") subst = parseInt(param) ? parseInt(param) : 0;
			else if (pType == "u") subst = Math.abs(param);
			else if (pType == "f") subst = (precision > -1) ? Math.round(parseFloat(param) * Math.pow(10, precision)) / Math.pow(10, precision) : parseFloat(param);
			else if (pType == "o") subst = parseInt(param).toString(8);
			else if (pType == "s") subst = param;
			else if (pType == "x") subst = ("" + parseInt(param).toString(16)).toLowerCase();
			else if (pType == "X") subst = ("" + parseInt(param).toString(16)).toUpperCase();
		}
		res += leftpart + subst;
		str = rightPart;
	}
	return res + str;
}

function FromYMD(arg) {
	var r = arg.replace(/\D/g, "").match(/(\d\d\d\d)(\d\d)(\d\d)/);
	return new Date(r[1], r[2] - 1, r[3]);
}

Date.prototype.fromYMD = function(arg) {
	var r = arg.replace(/\D/g, "").match(/(\d\d\d\d)(\d\d)(\d\d)/);
	this.setTime(new Date(r[1], r[2] - 1, r[3]).getTime());
};

Date.prototype.getWeek = function() {
	var begin = new Date(this.getFullYear(), 0, 1);
	var diff = (this.getTime() - begin.getTime()) / 86400000 + begin.getDay();
	return Math.floor(diff / 7);
};
