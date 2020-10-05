var JobGroup = {
	init: function () {
		JobGroup.LoadMemberOfGroup();
		JobGroup.GetInfoOfEmp();
		JobGroup.AddMoreRow();
		JobGroup.RemoveRow();
		JobGroup.ValidateStartDate();
		JobGroup.ValidateStatus();
		JobGroup.CreateColumn();
	},
	LoadMemberOfGroup: function () {
		$(document).on('change', '.changeIdOfDept', function () {
			var row = jQuery(this).closest('tr');
			var idOfDept = jQuery(this).val();
			var url = jQuery(this).attr('data-url');
			var listEmp = $('.listEmpExist').toArray();
			var listEmpExist = new Array();
			$.each(listEmp, function (index, item) {
				listEmpExist.push(item.value);
			});
			var target = row.find(jQuery(this).attr('data-target'));
			$.ajax({
				type: 'POST',
				async: false,
				data: { idOfDept: idOfDept, listEmpExist: listEmpExist },
				url: url,
				success: function (data) {
					if (data != null) {
						target.html(data.htCust);
						if (target.hasClass('autoSelect2')) {
							target.select2();
						} else if (target.hasClass('selectpicker')) {
							target.selectpicker('refresh');
						}
						row.children('.email').text('');
						row.children('.roleOfEmp').text('');
					} else {
						console.log('data null');
					}
				},
			});
		});
	},
	GetInfoOfEmp: function () {
		$(document).on('change', '.slUser', function () {
			var idEmp = $(this).val();
			var url = $(this).attr('data-url');
			var parent = $(this).parent().parent();
			$.ajax({
				type: 'POST',
				async: false,
				data: { idEmp: idEmp },
				url: url,
				success: function (data) {
					if (data != null) {
						parent.children('.roleOfEmp').text(data.Name);
						parent.children('.email').text(data.Email);
						parent.children('.idEmp').children('.listEmpExist').val(data.ID);
					}
				},
			});
		});
	},
	AddMoreRow: function () {
		$(document).on('click', '.quickAdd', function () {
			var stt = parseInt($(this).attr('data-id')) + 1;

			tbody.find('.autoSelect2').select2();
			tbody.find('.selecpicker').selectpicker();
			var div = tbody.closest('div');
			div.append("<input class='listEmpExist' type='hidden' value='' />");
		});
	},
	RemoveRow: function () {
		$(document).on('click', '.quickDeleteRow', function () {
			var tr = $(this).closest('tr');
			tr.remove();
		});
	},
	ValidateStatus: function () {
		$(document).on('change', '#Status', function () {
			var strStartDate = $('#startDate').val();
			var listStartDate = strStartDate.split('-');
			var startDate = new Date(listStartDate[0], listStartDate[1] - 1, listStartDate[2]);
			var status = $('#Status');
			var dateNow = new Date();
			var Now = new Date(dateNow.getFullYear(), dateNow.getMonth(), dateNow.getDate());
			if (startDate <= Now && status.val() == 1) {
				Utils.setError('Ngày bắt đầu phải lớn hơn ngày hiện tại');
				$('#select2-Status-container').text('Hoạt động');
				status.val('2');
			} else if (startDate > dateNow && status.val() == 2) {
				Utils.setError('Ngày bắt đầu phải nhỏ hơn hoặc bằng ngày hiện tại');
				$('#select2-Status-container').text('Chưa hoạt động');
				status.val('1');
			} else {
				$('#validateStatus').text('');
			}
		});
	},
	ValidateStartDate: function () {
		$(document).on('change', '#startDate', function () {
			var strStartDate = $('#startDate').val();
			var listStartDate = strStartDate.split('-');
			var startDate = new Date(listStartDate[0], listStartDate[1] - 1, listStartDate[2]);
			var status = $('#Status');
			var dateNow = new Date();
			var Now = new Date(dateNow.getFullYear(), dateNow.getMonth(), dateNow.getDate());
			if (startDate <= Now) {
				$('#select2-Status-container').text('Hoạt động');
				status.val('2');
			} else if (startDate > dateNow || startDate == null) {
				$('#select2-Status-container').text('Chưa hoạt động');
				status.val('1');
			}
		});
	},
	ChangeTitle: function () {
		$(document).on('focusout', '.colTitle', function () {
			var newTitle = $(this).val();
			var id = $(this).attr('data-id');
			var url = $(this).attr('data-url');
			$.ajax({
				type: 'POST',
				async: false,
				data: { newTitle: newTitle, id: id },
				url: url,
				success: function (data) {
					if (data != null) {
					}
				},
			});
		});
	},
	ChangeColor: function () {
		$(document).on('focusout', '.classColor', function () {
			var newColor = $(this).val();
			var id = $(this).attr('data-id');
			var url = $(this).attr('data-url');
			$.ajax({
				type: 'POST',
				async: false,
				data: { newTitle: newTitle, id: id },
				url: url,
				success: function (data) {
					if (data != null) {
					}
				},
			});
		});
	},
	CreateColumn: function () {
		jQuery(document).on('click', '.append_template_jobgroup', function () {
			var obj = jQuery(this);
			var form = jQuery(this).closest('.col_kanban');
			var temp = jQuery(obj.attr('data-temp')).html();

            $(temp).clone().insertAfter(form);
		});
	},
};

$(document).ready(function () {
	JobGroup.init();
});
