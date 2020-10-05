(function ($) {
	$.fn.gantt = function (data, options) {
		var defaults = {};
		options = $.extend({}, defaults, options);
		var gantt = new Gantt(data, options);
		this.length && gantt.build();
	};
})(jQuery);

class Gantt {
	'use strict';
	constructor(data, options) {
		this.data = data;
		this.options = options;
	}
	build() {
		console.log(this.options);
	}
	getUserData() {
		console.log(this.data);
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
