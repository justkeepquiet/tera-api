/*! jQuery Custom Select v1.0.1 | MIT License | (c) 2025 Non-commercial Project "HSDN" */
!(function($) {
	var originalProp = $.fn.prop;

	$.fn.prop = function(property, value) {
		if (property === "selectedIndex" && value !== undefined) {
			this.each(function() {
				var $this = $(this);
				var previousValue = $this.prop(property);
				originalProp.call($this, property, value);
				if (previousValue !== value) {
					$this.trigger("change");
				}
			});
			return this;
		}
		return originalProp.apply(this, arguments);
	};
}(window.jQuery));

!(function($) {
	$.fn.customSelect = function() {
		return this.each(function() {
			var $select = $(this);

			var $customSelect = $("<div class=\"custom-select\"></div>");
			var $selectedOption = $("<div class=\"custom-select-selected\"></div>");
			var $arrow = $("<div class=\"custom-select-arrow\">&#9660;</div>");
			var $optionsContainer = $("<div class=\"custom-select-options\"></div>");

			$selectedOption.text($select.find("option:selected").text());
			$customSelect.append($selectedOption);
			$selectedOption.append($arrow);

			$select.find("option").each(function(index) {
				var $option = $(this);
				var $customOption = $("<div class=\"custom-select-option\"></div>");
				$customOption.text($option.text());
				$customOption.attr("data-value", $option.val());

				$customOption.on("click", function() {
					if ($select.prop("disabled")) return;

					$select.prop("selectedIndex", index).trigger("change");
					$selectedOption.text($option.text());
					$selectedOption.append($arrow);
					$optionsContainer.hide();
				});

				$optionsContainer.append($customOption);
			});
			$customSelect.append($optionsContainer);

			$select.css({
				position: "absolute",
				left: "-9999px",
				top: "-9999px"
			});

			$select.after($customSelect);

			if ($select.css("display") === "none") {
				$customSelect.hide();
			}

			function updateDisabledState() {
				$selectedOption.off("click");
				if ($select.prop("disabled")) {
					$customSelect.addClass("custom-select-disabled");
				} else {
					$customSelect.removeClass("custom-select-disabled");
					$selectedOption.on("click", function(e) {
						e.stopPropagation();
						$optionsContainer.toggle();
					});
				}
			}

			updateDisabledState();

			$select.on("showCustomSelect", function() {
				$customSelect.show();
			});

			$select.on("hideCustomSelect", function() {
				$customSelect.hide();
			});

			$select.on("updateDisabledState", function() {
				updateDisabledState();
			});

			$(document).on("click", function(e) {
				if (!$(e.target).closest($customSelect).length) {
					$optionsContainer.hide();
				}
			});

			$select.on("change", function() {
				var selectedIndex = $select.prop("selectedIndex");
				var selectedText = $select.find("option").eq(selectedIndex).text();
				$selectedOption.text(selectedText);
				$selectedOption.append($arrow);
			});
		});
	};
}(window.jQuery));