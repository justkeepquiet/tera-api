/*! jQuery Number Input v1.1.2 | MIT License | (c) 2024 Non-commercial Project "HSDN" */
!(function($) {
	$.fn.numberInput = function() {
		return this.each(function() {
			var $input = $(this);
			var step = parseFloat($input.attr("step")) || 1;
			var min = parseFloat($input.attr("min"));
			var max = parseFloat($input.attr("max"));
			var $container = $("<div class=\"number-input\"></div>");

			$input.wrap($container);

			var $arrows = $("<div class=\"custom-arrows\">" +
							"<div class=\"arrow-up\">&#9650;</div>" +
							"<div class=\"arrow-down\">&#9660;</div>" +
						"</div>");

			$input.after($arrows);

			var updateArrowsState = function() {
				var isDisabled = $input.prop("disabled");
				$arrows.find(".arrow-up, .arrow-down").toggleClass("disabled", isDisabled);
			};

			$arrows.find(".arrow-up").click(function() {
				if ($input.prop("disabled")) return;
				$input.val(function(i, val) {
					var newValue = +val + step;
					if (max !== undefined && newValue > max) {
						newValue = max;
					}
					return newValue;
				}).trigger("change");
			});

			$arrows.find(".arrow-down").click(function() {
				if ($input.prop("disabled")) return;
				$input.val(function(i, val) {
					var newValue = +val - step;
					if (min !== undefined && newValue < min) {
						newValue = min;
					}
					return newValue;
				}).trigger("change");
			});

			updateArrowsState();

			$input.on("change disabledChange", updateArrowsState);
		});
	};
}(window.jQuery));