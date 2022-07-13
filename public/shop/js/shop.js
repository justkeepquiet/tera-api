/**
 * Init
 */
$(function() {
	loadMenu();
	loadContent("Welcome");
	loadAccountInfo();
	setInterval(loadAccountInfo, 5000);
});

/**
 * API calls
 */
function loadAccountInfo() {
	shopGetAccountInfo(function(result) {
		if (result.ReturnCode == 0) {
			$("#user_name").html(result.userName);
			$("#shop_balance").html(result.shopBalance);
			$("#navbar_right").fadeIn();
			$("#search_form").fadeIn();
		}
	});
}

function catalogSearchAction(search) {
	return apiRequest("ShopPartialCatalog", { search: search }, "html", function(result) {
		$("#content").html(result);
		loadMenu();
	});
}

function shopGetAccountInfo(callback) {
	return apiRequest("ShopGetAccountInfo", {}, "json", callback);
}

function loadMenu(active = 0) {
	apiRequest("ShopPartialMenu?active=" + active, null, "html", function(result) {
		$("#menu").html(result);
	});
}

function loadContent(page, params = null) {
	$(".navbar-fixed-top .nav li").removeClass("active");
	$(".navbar-fixed-top .nav li a[data-page='" + page.split("?")[0] + "']").parent().addClass("active");

	apiRequest("ShopPartial" + page, params, "html", function(result) {
		if (page === "Error") {
			$("#menu").html("");
		}
		if (page !== "Catalog" && page !== "Product" && page !== "Error") {
			loadMenu();
		}
		$("#content").html(result);
		$("#search_input").val("");
		$("#content").animate({
			scrollTop: params && params.scrollTop ? params.scrollTop : 0
		}, 0);
	});
}

function loadPromoCodes(callback) {
	var tzOffset = new Date().getTimezoneOffset();

	apiRequest("ShopPartialPromoCode?tzOffset=" + tzOffset, null, "html", function(result) {
		$("#content").html(result);
		callback();
	});
}

function shopPurchaseAction(productId, callback) {
	return apiRequest("ShopPurchaseAction", { productId: productId }, "json", callback);
}

function shopPromoCodeAction(promoCode, callback) {
	return apiRequest("ShopPromoCodeAction", { promoCode: promoCode }, "json", callback);
}

function apiRequest(event, params, dataType, callback) {
	if (!params) {
		return $.get("/tera/" + event, callback, dataType).fail(function(err) {
			console.log(err);
			loadContent("Error");
		});
	}

	return $.post({
		traditional: true,
		url: "/tera/" + event,
		contentType: "application/json",
		data: JSON.stringify(params),
		dataType: dataType,
		success: callback,
		error: function(err) {
			console.log(err);
			loadContent("Error");
		}
	});
}
