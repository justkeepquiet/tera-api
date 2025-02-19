
/**
 * Init
 */
$(function() {
	loadAccountInfo();
	setInterval(loadAccountInfo, 5000);
	loadContent("Welcome");
});

/**
 * Load content
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

function loadContent(page, params) {
	$("#header .nav li").removeClass("active");
	$("#header .nav li a[data-page='" + page.split("?")[0] + "']").parent().addClass("active");
	$("#menu li").removeClass("active");

	apiRequest("Partial" + page, params, "html", function(result) {
		if (page == "Error") {
			$("#menu div").hide();
		}
		if (page != "Product" && page != "Error") {
			$("#menu div").show();
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

function loadPromoCodes(callback) {
	apiRequest("PartialPromoCode", null, "html", function(result) {
		$("#content").html(result);
		callback();
	});
}

/**
 * API calls
 */

function shopGetAccountInfo(callback) {
	return apiRequest("GetAccountInfo", {}, "json", callback);
}

function shopGetCatalog(params, callback) {
	return apiRequest("GetCatalog", params, "json", callback);
}

function shopPurchaseAction(productId, quantity, recipientUserId, callback) {
	return apiRequest("PurchaseAction", { productId: productId, quantity: quantity, recipientUserId: recipientUserId }, "json", callback);
}

function shopReqCharacterAction(name, callback) {
	return apiRequest("ReqCharacterAction", { name: name }, "json", callback);
}

function shopPurchaseStatusAction(logId, callback) {
	return apiRequest("PurchaseStatusAction", { logId: logId }, "json", callback);
}

function shopPromoCodeAction(promoCode, callback) {
	return apiRequest("PromoCodeAction", { promoCode: promoCode }, "json", callback);
}

function shopPromoCodeStatusAction(promoCodeId, callback) {
	return apiRequest("PromoCodeStatusAction", { promoCodeId: promoCodeId }, "json", callback);
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