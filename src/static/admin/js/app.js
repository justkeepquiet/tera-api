/* eslint-disable no-param-reassign,no-undef */
var config = window.config = {};

// Config reference element
var $ref = $("#ref");

// Configure responsive bootstrap toolkit
config.ResponsiveBootstrapToolkitVisibilityDivs = {
	xs: $("<div class=\"device-xs 				  hidden-sm-up\"></div>"),
	sm: $("<div class=\"device-sm hidden-xs-down hidden-md-up\"></div>"),
	md: $("<div class=\"device-md hidden-sm-down hidden-lg-up\"></div>"),
	lg: $("<div class=\"device-lg hidden-md-down hidden-xl-up\"></div>"),
	xl: $("<div class=\"device-xl hidden-lg-down			  \"></div>")
};

ResponsiveBootstrapToolkit.use("Custom", config.ResponsiveBootstrapToolkitVisibilityDivs);

// validation configuration
config.validations = {
	errorClass: "has-error",
	validClass: "success",
	errorElement: "span",

	// add error class
	highlight: function(element, errorClass, validClass) {
		$("#error-message").hide();
		$(element).parents("div.form-group")
			.addClass(errorClass)
			.removeClass(validClass);
	},

	// add error class
	unhighlight: function(element, errorClass, validClass) {
		$("#error-message").hide();
		$(element).parents(".has-error")
			.removeClass(errorClass)
			.addClass(validClass);
	},

	// submit handler
	submitHandler: function(form) {
		form.submit();
	}
};

// delay time configuration
config.delayTime = 50;

// chart configurations
config.chart = {};
config.chart.colorPrimary = tinycolor($ref.find(".chart .color-primary").css("color"));
config.chart.colorSecondary = tinycolor($ref.find(".chart .color-secondary").css("color"));

$(function() {
	animate({
		name: "flipInY",
		selector: ".error-card > .error-title-block"
	});

	setTimeout(function() {
		var $el = $(".error-card > .error-container");

		animate({
			name: "fadeInUp",
			selector: $el
		});

		$el.addClass("visible");
	}, 1000);
});

// LoginForm validation
$(function() {
	if (!$("#login-form").length) {
		return false;
	}

	var loginValidationSettings = {
		rules: {
			login: "required",
			password: "required"
		},
		messages: {
			login: "Please enter login",
			password: "Please enter password"
		}
	};

	$.extend(loginValidationSettings, config.validations);

	$("#login-form").validate(loginValidationSettings);
});

/** *********************************************
*		Animation Settings
***********************************************/
function animate(options) {
	var animationName = "animated " + options.name;
	var animationEnd = "webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend";
	$(options.selector)
		.addClass(animationName)
		.one(animationEnd,
			function() {
				$(this).removeClass(animationName);
			}
		);
}

// Item Actions
$(function() {
	var $itemActions = $(".item-actions-dropdown");

	$(document).on("click", function(e) {
		if (!$(e.target).closest(".item-actions-dropdown").length) {
			$itemActions.removeClass("active");
		}
	});

	$(".item-actions-toggle-btn").on("click", function(e) {
		e.preventDefault();

		var $thisActionList = $(this).closest(".item-actions-dropdown");
		$itemActions.not($thisActionList).removeClass("active");
		$thisActionList.toggleClass("active");
	});
});

// NProgress Settings
var npSettings = {
	easing: "ease",
	speed: 500
};

NProgress.configure(npSettings);

$(function() {
	setSameHeights();

	var resizeTimer = null;

	$(window).resize(function() {
		clearTimeout(resizeTimer);
		resizeTimer = setTimeout(setSameHeights, 150);
	});
});

function setSameHeights($container) {
	$container = $container || $(".sameheight-container");
	var viewport = ResponsiveBootstrapToolkit.current();

	$container.each(function() {
		var $items = $(this).find(".sameheight-item");

		// Get max height of items in container
		var maxHeight = 0;

		$items.each(function() {
			$(this).css({ height: "auto" });
			maxHeight = Math.max(maxHeight, $(this).innerHeight());
		});

		// Set heights of items
		$items.each(function() {
			// Ignored viewports for item
			var excludedStr = $(this).data("exclude") || "";
			var excluded = excludedStr.split(",");

			// Set height of element if it's not excluded on
			if (excluded.indexOf(viewport) === -1) {
				$(this).innerHeight(maxHeight);
			}
		});
	});
}

// LoginForm validation
$(function() {
	if (!$(".form-control").length) {
		return false;
	}

	$(".form-control").focus(function() {
		$(this).siblings(".input-group-addon").addClass("focus");
	});

	$(".form-control").blur(function() {
		$(this).siblings(".input-group-addon").removeClass("focus");
	});
});

$(function() {
	$(".data-table").DataTable(dataTablesSettings);
	$(".data-table-desc").DataTable($.extend({}, dataTablesSettings, {
		order: [[0, "desc"]]
	}));
	$(".data-table-nosort").DataTable($.extend({}, dataTablesSettings, {
		columnDefs: [
			{ orderable: false, targets: -1 }
		]
	}));

	$("#sidebar-menu a").on("click", function() {
		$(".data-table, .data-table-desc, .data-table-nosort").DataTable().state.clear();
	});
	$("form").on("submit", function() {
		$(".data-table, .data-table-desc, .data-table-nosort").DataTable().state.clear();
	});
});

$(function() {
	// set sortable options
	var sortable = new Sortable($(".images-container").get(0), {
		animation: 150,
		handle: ".control-btn.move",
		draggable: ".image-container",
		onMove: function(evt) {
			var $relatedElem = $(evt.related);

			if ($relatedElem.hasClass("add-image")) {
				return false;
			}
		}
	});

	$controlsButtons = $(".controls");
	$controlsButtonsStar = $controlsButtons.find(".star");
	$controlsButtonsRemove = $controlsButtons.find(".remove");
	$controlsButtonsStar.on("click", function(e) {
		e.preventDefault();
		$controlsButtonsStar.removeClass("active");
		$controlsButtonsStar.parents(".image-container").removeClass("main");

		$(this).addClass("active");
		$(this).parents(".image-container").addClass("main");
	});
});

// Sidebar menu
$(function() {
	$("#sidebar-menu, #customize-menu").metisMenu({
		activeClass: "open"
	});
	$("#sidebar-collapse-btn").on("click", function(event) {
		event.preventDefault();
		$("#app").toggleClass("sidebar-open");
	});
	$("#sidebar-overlay").on("click", function() {
		$("#app").removeClass("sidebar-open");
	});

	if ($.browser.mobile) {
		var $appContainer = $("#app ");
		var $mobileHandle = $("#sidebar-mobile-menu-handle ");

		$mobileHandle.swipe({
			swipeLeft: function() {
				if ($appContainer.hasClass("sidebar-open")) {
					$appContainer.removeClass("sidebar-open");
				}
			},
			swipeRight: function() {
				if (!$appContainer.hasClass("sidebar-open")) {
					$appContainer.addClass("sidebar-open");
				}
			},
			// excludedElements: "button, input, select, textarea, .noSwipe, table",
			triggerOnTouchEnd: false
		});
	}
});

/*
var modalMedia = {
	$el: $("#modal-media"),
	result: {},
	options: {},
	open: function(options) {
		options = options || {};
		this.options = options;

		this.$el.modal("show");
	},
	close: function() {
		if ($.isFunction(this.options.beforeClose)) {
			this.options.beforeClose(this.result);
		}

		this.$el.modal("hide");

		if ($.isFunction(this.options.afterClose)) {
			this.options.beforeClose(this.result);
		}
	}
};
*/

$(function() {
	$("#confirm-modal").on("show.bs.modal", function(event) {
		$("#confirm-modal #modal-yes").click(function() {
			window.location.href = $(event.relatedTarget).attr("href");
		});
	});
});

$(function() {
	$("body").addClass("loaded");
});

// NProgress Settings

// start load bar
NProgress.start();

// end loading bar
NProgress.done();