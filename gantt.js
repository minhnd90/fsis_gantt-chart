(function ($) {
	$.fn.gantt = function (options) {
		var defaults = {};
		var opts = $.extend({}, defaults, options);
		var gantt = new Gantt(opts);
		this.length && gantt.build();
	};
})(jQuery);

class Gantt {
	'use strict';
	constructor(option) {
		this.option = option;
		this.default = [];
	}
	build() {
		console.log(this.option);
	}
	countOccurrences(arr, val) {
		arr.reduce((a, v) => (v === val ? a + 1 : a), 0);
	}
	horizontalScroll(element) {
		element.bind('mousewheel DOMMouseScroll', (event) => {
			event = window.event || event;
			var delta = Math.max(-1, Math.min(1, event.wheelDelta || -event.detail));
			element.scrollLeft -= delta * 40;
			event.preventDefault();
		});
	}
}
