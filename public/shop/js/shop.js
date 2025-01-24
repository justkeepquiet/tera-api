
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

function getAccountBalance() {
	return parseInt($("#shop_balance").html());
}

function catalogSearchAction(search) {
	return apiRequest("PartialCatalog", { search: search }, "html", function(result) {
		$("#content_product").empty().hide();
		$("#content").html(result).show().animate({ scrollTop: 0 }, 0);
		loadMenu();
	});
}

function shopGetAccountInfo(callback) {
	return apiRequest("GetAccountInfo", {}, "json", callback);
}

function loadMenu(active) {
	if (!active) {
		active = 0;
	}

	apiRequest("PartialMenu?active=" + active, null, "html", function(result) {
		$("#menu").html(result);
	});
}

function loadContent(page, params) {
	// $(".item-icon").attr("src", "");
	$(".navbar-fixed-top .nav li").removeClass("active");
	$(".navbar-fixed-top .nav li a[data-page='" + page.split("?")[0] + "']").parent().addClass("active");

	apiRequest("Partial" + page, params, "html", function(result) {
		if (page == "Error") {
			$("#menu").html("");
		}
		if (page != "Catalog" && page != "Product" && page != "Error") {
			loadMenu();
		}
		$("#content_product").empty().hide();
		$("#content").html(result).show().animate({ scrollTop: 0 }, 0);
		$("#search_input").val("");
	});
}

function loadContentProduct(params) {
	apiRequest("PartialProduct", params, "html", function(result) {
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

	apiRequest("PartialPromoCode?tzOffset=" + tzOffset, null, "html", function(result) {
		$("#content").html(result);
		callback();
	});
}

function shopPurchaseAction(productId, quantity, callback) {
	return apiRequest("PurchaseAction", { productId: productId, quantity: quantity }, "json", callback);
}

function shopPurchaseStatusAction(logId, callback) {
	return apiRequest("PurchaseStatusAction", { logId: logId }, "json", callback);
}

function shopPromoCodeAction(promoCode, callback) {
	return apiRequest("PromoCodeAction", { promoCode: promoCode }, "json", callback);
}

function shopCouponAcceptAction(coupon, productId, callback) {
	return apiRequest("CouponAcceptAction", { coupon: coupon, productId: productId }, "json", callback);
}

function shopCouponCancelAction(callback) {
	return apiRequest("CouponCancelAction", {}, "json", callback);
}

function apiRequest(event, params, dataType, callback) {
	if (!params) {
		return $.get("/shop/" + event, callback, dataType).fail(function(err) {
			console.log(err);
			loadContent("Error");
		});
	}

	return $.post({
		traditional: true,
		url: "/shop/" + event,
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

/**
 * Util
 */

function subtractPercentage(number, percentage) {
	return Math.round(number - (number * (percentage / 100)));
}

function calculatePriceWithDiscounts(price, discounts) {
	for (var i = 0; i < discounts.length; i++) {
		price = subtractPercentage(price, discounts[i]);
	}

	return price;
}