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
		$("#content_product").empty().hide();
		$("#content").html(result).show();
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
	$(".item-icon").attr("src", "");
	$(".navbar-fixed-top .nav li").removeClass("active");
	$(".navbar-fixed-top .nav li a[data-page='" + page.split("?")[0] + "']").parent().addClass("active");

	apiRequest("ShopPartial" + page, params, "html", function(result) {
		if (page === "Error") {
			$("#menu").html("");
		}
		if (page !== "Catalog" && page !== "Product" && page !== "Error") {
			loadMenu();
		}
		$("#content_product").empty().hide();
		$("#content").html(result).show().animate({ scrollTop: 0 }, 0);
		$("#search_input").val("");
	});
}

function loadContentProduct(params = null) {
	apiRequest("ShopPartialProduct", params, "html", function(result) {
		$("#content").hide();
		$("#content_product").html(result).show().animate({ scrollTop: 0 }, 0);
		$("#search_input").val("");
	});
}

function backToCatalog() {
	$("#content_product").hide();
	$("#content").show();
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
