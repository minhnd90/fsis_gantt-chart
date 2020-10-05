$(document).ready(function () {
	// js tooltip
	$('[data-toggle="tooltip"]').tooltip();

	// js show/hide filter
	$('.toggle-item').click(function (event) {
		event.stopPropagation();
		$(this).next().toggle('fast');
		$(this).toggleClass('active');
	});
	$(document).on('click', function (e) {
		if (!$('.dropdown-list').is(e.target) && $('.dropdown-list').has(e.target).length === 0 && $('.active').has(e.target).length === 0) {
			$('.dropdown-list').hide();
			$('.toggle-item').removeClass('active');
		}
	});

	// Select checkall
	$('.table-content')
		.find('.checkitem')
		.click(function () {
			if ($(this).is(':checked')) {
				$('.table-content__top').show(200);
			} else {
				$('.table-content__top').hide(200);
			}
		});

	$('#checkall').change(function () {
		$('.checkitem').prop('checked', $(this).prop('checked'));
	});

	$('.checkitem').change(function () {
		if ($(this).prop('checked') === false) {
			$('#checkall').prop('checked', false);
		}
		if ($('.checkitem:checked').length === $('.checkitem').length) {
			$('#checkall').prop('checked', true);
		}
	});

	// Set heigh box div to top screen
	function contentHeight() {
		var winH = $(window).height(),
			offset = $('.content_page__board').offset(),
			contentHei = winH - offset.top;
		$('.content_page__board').css('height', contentHei);
	}
	contentHeight();
	$(window).resize(function () {
		contentHeight();
	});

	// Popover bootstrap
	$('[data-toggle="popover"]').popover();

	// Click Show/Hide More right List on Group Page
	$('.link-more__icon').click(function () {
		$('.link-more__list').show();
	});
	$('.btn-back').click(function () {
		$('.link-more__list').hide();
	});
});
