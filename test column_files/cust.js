$(document).on('DOMNodeInserted', function (e) {
	if ($(e.target).hasClass('flash')) {
		Utils.flash_position();
	}
});
jQuery(document).on('change', '.UpdateServiceFormInfo', function (e) {
	e.stopPropagation();
	var select = jQuery(this);
	var value = parseInt(select.val());

	if (value || value > 0) {
		jQuery('.ServiceFormUp').show();
		jQuery('.ServiceFormUp').attr('data-id', select.val());
		var href = jQuery('.ServiceFormUp').attr('href');
		jQuery('.ServiceFormUp').attr('href', href + '?ID=' + select.val());
	} else {
		jQuery('.ServiceFormUp').hide();
	}
});
jQuery(document).on('click', '.btnClose', function (e) {
	var btn = jQuery(this);
	var parent = btn.parent();
	if (parent) {
		parent.remove();
	}
});
jQuery(document).on('click', '.resize', function (e) {});

jQuery(document).on('click', '#saveRegisterFormExport', function (e) {
	e.preventDefault();
	var url = jQuery(this).attr('href');
	var obj = jQuery(this).attr('data-form-submit');
	var target = jQuery(this).attr('data-target');
	var data = Utils.getSerialize(jQuery(obj));
	console.log(data);
	if (url) {
		Cust.callAjax(data, url, jQuery(target), function (res) {
			Utils.sectionBuilder(res, null, Cust.registerEvents);
		});
	} else {
		return;
	}
});
jQuery(document).on('click', '#addField', function () {
	var btn = jQuery(this);
	var url = btn.attr('data-url');
	var target = btn.attr('data-target');
	if (url) {
		Cust.callAjax({}, url, btn, function (res) {
			if (res.htCust) {
				jQuery(target).append(res.htCust);
				jQuery(target).find('select').selectpicker();
			}
		});
	}
});

jQuery(document).on('click', '.settingFieldBtn', function () {
	Cust.customDialog(jQuery(this));
});
jQuery(document).on('click', '.autoRunBtn', function () {
	Cust.customDialog(jQuery(this));
});
jQuery(document).on('click', '.customClick', function (e) {
	var target = jQuery(this).attr('data-target');
});

jQuery(document).on('click', '.attachSignFileBtn', function (e) {
	var target = jQuery(jQuery(this).attr('data-target'));
	target.attr('data-is-sign', 1);
	target.attr('data-sign-check', 1);
});
jQuery(document).on('click', '.attachFileBtn', function (e) {
	var target = jQuery(jQuery(this).attr('data-target'));
	target.attr('data-is-sign', 1);
	target.attr('data-sign-check', 0);
});

jQuery(document).on('click', '#resizeFixBtn', function (e) {
	var dialog = $('.ui-dialog');
	if (!dialog.hasClass('maxsize')) {
		$('.ui-dialog').css({
			width: '100%',
			display: 'block',
			position: 'fixed',
			top: '0',
			left: '0',
		});

		$('#RegisterSvr').css('height', '100vh');
		dialog.addClass('maxsize');
	} else {
		dialog.removeClass('maxsize');
		$('#RegisterSvr').css('height', 'auto');
		$('.ui-dialog').css({
			width: '1200px',
			display: 'block',
			position: 'absolute',
			top: '50px',
			left: 'calc((100% - 1200px)/2)',
			height: 'auto',
			margin: 'auto',
		});
	}
});
jQuery(document).on('click', '.checkedSignatureStep', function (e) {
	var checkbox = jQuery(this);
	var value = parseInt(checkbox.val());
	var target = jQuery(this).attr('data-target');
	if (jQuery(this).is(':checked')) {
		jQuery(target).show();
	} else {
		jQuery(target).hide();
		var inputs = jQuery(target).find('input');
		inputs.each(function () {
			jQuery(this).prop('checked', false);
		});
	}
	var holder = jQuery('.stepSpaceHolder');
	var checkers = holder.find('input');
	checkers.each(function () {
		var targetx = jQuery(this).attr('data-target');
		if (!jQuery(this).is(':checked')) {
			jQuery(targetx).hide();
		} else {
			jQuery(targetx).show();
		}
	});
});
jQuery(document).on('dialogclose', '#ConfigSignature', function (event) {
	jQuery('#ConfigSignature').remove();
});

jQuery(document).on('click', '.saveSignatureConfiguration', function () {
	var serviceFormHolder = jQuery('.serviceFormHolder');
	var postData = [];
	serviceFormHolder.each(function () {
		var stepData = {};
		stepData['IDServiceForm'] = jQuery(this).attr('data-id');
		stepData['IDWorkflowStepUpload'] = jQuery(this).attr('data-step-upload');
		var stepCheckboxs = jQuery(this).find('.StepExecutorSignature');
		var dataArr = [];
		stepCheckboxs.each(function () {
			var checkeds = jQuery(this).find('input:checked');
			checkeds.each(function () {
				var stepInfo = {};
				var arrExecutors = [];
				var target = jQuery(this).attr('data-target');
				var checkedExecutors = jQuery(target).find('input:checked');
				checkedExecutors.each(function () {
					if (jQuery(this).hasClass('User')) {
						arrExecutors.push({ IDUser: jQuery(this).val() });
					}
					if (jQuery(this).hasClass('Dept')) {
						arrExecutors.push({ IDDept: jQuery(this).val() });
					}
					if (jQuery(this).hasClass('Position')) {
						arrExecutors.push({ IDPosition: jQuery(this).val() });
					}
				});
				stepInfo['IDWorkflowStepSignature'] = jQuery(this).val();
				stepInfo['StepDatas'] = arrExecutors;
				dataArr.push(stepInfo);
			});

			stepData['Data'] = dataArr;
		});
		if (stepData.Data.length > 0) postData.push(stepData);
	});
	Cust.callAjax(
		{
			ServiceFormData: postData,
			IDService: jQuery(this).attr('data-id'),
			IDWorkflow: jQuery(this).attr('data-wokflow-id'),
		},
		serviceFormHolder.attr('data-url'),
		serviceFormHolder,
		function (response) {
			Utils.sectionBuilder(response, response.isErr);
			if (response.isErr) {
				Utils.setError(response.ctMeg);
				form.find('#messeage_err').html(response.ctMeg);
				form.find('#messeageadd_err').html('');
				form.find("[type='submit']").prop('disabled', false);

				return;
			}

			if (response.hasOwnProperty('isCust')) {
				jQuery(target).html(response.htCust);
				Utils.setSuccess(response.ctMeg);
			}
			Utils.closeOverlay(true);
		}
	);
});
jQuery(document).on('click', '#saveSignatureConfig', function () {
	var IDService = jQuery('input[name="IDService"]').val();
	var IDWorkflowStep = jQuery('#FrmSrStepChoose').val();
	var IDWorkflowStepFileSample = jQuery('input[name="IDWorkflowStepFileSample"]').val();
	var executorHolderOptions = jQuery('.signatureExecutor');
	var idUsers = [0];
	var idDepts = [0];
	var idPositions = [];

	executorHolderOptions.find('.IsUser').each(function () {
		if (jQuery(this).is(':checked')) {
			idUsers.push(parseInt(jQuery(this).val()));
		}
	});
	executorHolderOptions.find('.IsDept').each(function () {
		if (jQuery(this).is(':checked')) {
			idDepts.push(parseInt(jQuery(this).val()));
		}
	});
	executorHolderOptions.find('.IsPosition').each(function () {
		if (jQuery(this).is(':checked')) {
			idPositions.push(parseInt(jQuery(this).val()));
		}
	});

	Cust.callAjax(
		{
			IDService: IDService,
			IDWorkflowStep: IDWorkflowStep,
			IDWorkflowStepFileSample: IDWorkflowStepFileSample,
			IDUsers: idUsers.length > 0 ? idUsers : [0],
			IDDepts: idDepts.length > 0 ? idDepts : [0],
			IDPositions: idPositions.length > 0 ? idPositions : [0],
		},
		jQuery(this).attr('data-url'),
		jQuery(this),
		function (response) {
			Utils.sectionBuilder(response, response.isErr);
			if (response.isErr) {
				Utils.setError(response.ctMeg);
				form.find('#messeage_err').html(response.ctMeg);
				form.find('#messeageadd_err').html('');
				form.find("[type='submit']").prop('disabled', false);

				return;
			}

			if (response.hasOwnProperty('isCust')) {
				jQuery(target).html(response.htCust);
				Utils.setSuccess(response.ctMeg);
			}
			Utils.closeOverlay(true);
		}
	);
});
jQuery(document).on('changed.bs.select', '#FrmSrStepChoose', function (e) {
	var select = jQuery(this);
	var url = select.attr('data-url');
	var target = select.attr('data-target');
	var stepFileID = parseInt(select.attr('data-id'));
	if (select.hasClass('bootstrap-select')) {
		return false;
	}
	jQuery.ajax({
		type: 'POST',
		async: true,
		url: url,
		data: {
			IDType: select.val() || 0,
			id: select.val() || 0,
			stepFileID: stepFileID || 0,
		},
		beforeSend: function () {
			jQuery(target).addClass('loading').html('');
		},
		complete: function () {
			jQuery(target).removeClass('loading');
		},
		error: function () {
			jQuery(target).removeClass('loading');
		},
		success: function (data) {
			Utils.sectionBuilder(data);
			if (data.hasOwnProperty('isCust')) {
				jQuery(target).html(data.htCust);
			}
		},
		error: function (XMLHttpRequest, textStatus, errorThrown) {},
	});
});
jQuery(document).on('success.form.bv', '#FrmUpServiceTypeInService', function (e) {
	e.preventDefault();
	e.stopPropagation();
	var obj = jQuery(this);
	var target = jQuery(this).attr('data-target');
	var data = Utils.getSerialize(obj);
	Cust.callAjax(data, obj.attr('action'), obj, function (response) {
		Utils.sectionBuilder(response, response.isErr);
		if (response.isErr) {
			Utils.setError(response.ctMeg);
			form.find('#messeage_err').html(response.ctMeg);
			form.find('#messeageadd_err').html('');
			form.find("[type='submit']").prop('disabled', false);
			Utils.closeOverlay(true);
			return;
		}

		if (response.hasOwnProperty('isCust')) {
			jQuery(target).html(response.htCust);
		}
		Utils.closeOverlay(true);
	});
});
jQuery(document).on('click', '.chooseCategories', function () {
	var removeTarget = jQuery(this).attr('data-remove-target');
	jQuery(removeTarget).remove();
	Utils.closeOverlay(true);
});
jQuery(document).on('click', '.chooseCategoriesService', function () {
	var removeTarget = jQuery(this).attr('data-remove-target');
	window.location.href = jQuery(this).attr('href');
	jQuery(removeTarget).remove();
	Utils.closeOverlay(true);
});

jQuery(document).on('success.form.bv', '#FrmCrServiceTypeInService', function (e) {
	e.preventDefault();
	var obj = jQuery(this);
	var target = jQuery(this).attr('data-target');
	var data = Utils.getSerialize(obj);
	Cust.callAjax(data, obj.attr('action'), obj, function (response) {
		Utils.sectionBuilder(response, response.isErr);
		if (response.isErr) {
			Utils.setError(response.ctMeg);
			form.find('#messeage_err').html(response.ctMeg);
			form.find('#messeageadd_err').html('');
			form.find("[type='submit']").prop('disabled', false);
			Utils.closeOverlay(true);
			dialog.remove();
			return;
		}
		if (response.hasOwnProperty('isCust')) {
			jQuery(target).prepend(response.htCust);
			jQuery(target).selectpicker('refresh');
		}

		Utils.closeOverlay(true);
	});
});

jQuery(document).on('click', '.registerAppBlockChoose', function (e) {
	e.preventDefault();
	jQuery('.previousStepRegister').show();
	jQuery('.steps').find('li[data-target="#simplewizardstep2"]').addClass('active');
	var index = jQuery('.previousStepRegister').attr('data-index');
	if (index == 1) {
		jQuery('.previousStepRegister').attr('data-index', parseInt(index) + 1);
	}

	jQuery('.steps').find('li[data-target="#simplewizardstep2"]').addClass('active');
	var obj = jQuery(this);
	var target = jQuery(this).attr('data-target');
	var hideTarget = jQuery(this).attr('data-hide');
	var IDType = jQuery(this).attr('data-id');
	Cust.callAjax(
		{
			IDType: IDType,
		},
		jQuery(this).attr('href'),
		obj,
		function (response) {
			Utils.sectionBuilder(response);
			if (response.hasOwnProperty('isCust')) {
				jQuery(target).html(response.htCust);
				jQuery(hideTarget).hide();
				jQuery(target).show();
			}
			if (response.isErr && response.ctMeg) {
				Utils.closeOverlay();
			} else {
				Utils.updateTab(jQuery(target));
				Utils.updateInputDate(jQuery(target));
				Utils.updateFormState(jQuery(target));
				Utils.updateScrollBar(jQuery(target));
				Autocomplete.init(jQuery(target));
				Main.upEvent(jQuery(target));
				Cust.check_required_input();
				Utils.autoResize();
			}
		}
	);
});
//registerServiceFr
jQuery(document).on('click', '.registerServiceFr', function (e) {
	e.preventDefault();
	var obj = jQuery(this);
	jQuery('.btnRegisterDone').show();
	var index = jQuery('.previousStepRegister').attr('data-index');
	if (index == 2) {
		jQuery('.previousStepRegister').attr('data-index', parseInt(index) + 1);
	}

	jQuery('.steps').find('li[data-target="#simplewizardstep3"]').addClass('active');
	var target = jQuery(this).attr('data-target');
	var hideTarget = jQuery(this).attr('data-hide');
	var targetFlowchart = jQuery(this).attr('data-flowchart');
	var targetFlowchartModel = jQuery(this).attr('data-flowchart-source');
	var IDType = jQuery(this).attr('data-id');
	Cust.callAjax(
		{
			IDType: IDType,
		},
		jQuery(this).attr('href'),
		obj,
		function (response) {
			Utils.sectionBuilder(response);
			if (response.hasOwnProperty('isCust')) {
				jQuery(target).html(response.htCust);
				jQuery(hideTarget).hide();
				jQuery(target).show();
			}
			if (response.isErr && response.ctMeg) {
				Utils.closeOverlay();
			} else {
				Utils.updateTab(jQuery(target));
				Utils.updateInputDate(jQuery(target));
				Utils.updateFormState(jQuery(target));
				Utils.updateScrollBar(jQuery(target));
				Autocomplete.init(jQuery(target));
				Main.upEvent(jQuery(target));
				//FieldEvents.init();
				Cust.check_required_input();
				Cust.initAutoFillForm(jQuery(target));
				jQuery(target)
					.find('select.autoSelect2 ')
					.not('.select2-hidden-accessible')
					.each(function () {
						$(this).select2();
					});
				// registerServiceFr
				Utils.autoResize();

				FlowChart.init(targetFlowchart, targetFlowchartModel);
				Calendar.init(jQuery(target));
				Proto.updateFormLayout();
			}
		}
	);
});
jQuery(document).on('click', '.previousStepRegister', function () {
	var index = jQuery(this).attr('data-index');
	jQuery('.btnRegisterDone').hide();
	jQuery(`#simplewizardstep${index}`).hide();
	jQuery(`#simplewizardstep${index - 1}`).show();
	if (index > 2) {
		jQuery('.previousStepRegister').attr('data-index', parseInt(index) - 1);
	} else {
		jQuery('.previousStepRegister').hide();
	}
	var next = jQuery(`li[data-target="#simplewizardstep${parseInt(index)}"]`);
	next.removeClass('active');
});
jQuery(document).on('click', '.tabButton', function () {
	var self = jQuery(this);
	var index = self.attr('data-index');
	var isActive = self.hasClass('active');
	jQuery('.previousStepRegister').attr('data-index', parseInt(index));
	if (self.hasClass('active')) {
		if (index == 2) {
			jQuery(`#simplewizardstep2`).show();
			jQuery(`#simplewizardstep3`).hide();
			jQuery(`#simplewizardstep1`).hide();
			jQuery('.previousStepRegister').show();
			jQuery(`li[data-target="#simplewizardstep3"]`).removeClass('active');
			jQuery('.btnRegisterDone').hide();
		}
		if (index == 3) {
			jQuery('.btnRegisterDone').show();
			jQuery('.previousStepRegister').show();
			jQuery(`#simplewizardstep2`).hide();
			jQuery(`#simplewizardstep3`).show();
			jQuery(`#simplewizardstep1`).hide();
		}
		if (index == 1) {
			jQuery('.previousStepRegister').hide();
			jQuery(`#simplewizardstep2`).hide();
			jQuery(`#simplewizardstep3`).hide();
			jQuery(`#simplewizardstep1`).show();
			jQuery(`li[data-target="#simplewizardstep2"]`).removeClass('active');
			jQuery(`li[data-target="#simplewizardstep3"]`).removeClass('active');
			jQuery('.btnRegisterDone').hide();
		}
	}
});

jQuery(document).on('submit', '.quickSubmitCustom', function (e) {
	e.preventDefault();

	try {
		var form = jQuery(this);
		var url = form.attr('action');
		var target = form.attr('data-target');
		var targetDelete = form.attr('data-target-delete');
		var type = form.attr('data-insert-type');
		var isScroll = form.attr('data-scroll');
		var data = Utils.getSerialize(form);
		if (Utils.isEmpty(url)) {
			return false;
		}
		Utils.autoResize();
		if (!form.hasClass('bootstrapValidator')) {
			form.addClass('bootstrapValidator').bootstrapValidator();
		}
		if (!form.hasClass('bootstrapValidatored')) {
			form.addClass('bootstrapValidatored');
			var bootstrapValidator = form.data('bootstrapValidator');
			bootstrapValidator.validate();
			if (!bootstrapValidator.isValid(true)) {
				return false;
			}
		}
		if (!form.hasClass('novalidatedate')) {
			if (!Utils.validateDataForm(form)) {
				return false;
			}
		}
		if (form.find('.has-error').length > 0) {
			return false;
		}
		if (form.hasClass('submited')) {
			return false;
		}
		jQuery.ajax({
			type: 'POST',
			async: true,
			url: url,
			data: data,
			beforeSend: function () {
				form.addClass('submited').find("[type='submit']").prop('disabled', true);
			},
			complete: function () {
				form.removeClass('submited').find("[type='submit']").prop('disabled', false);
			},
			error: function () {
				form.removeClass('submited').find("[type='submit']").prop('disabled', false);
			},
			success: function (response) {
				try {
					Utils.sectionBuilder(response, response.isErr);
					if (response.hasOwnProperty('isCust')) {
						if (type == 'append') {
							jQuery(target).append(response.htCust);
						} else if (type == 'prepend') {
							jQuery(target).prepend(response.htCust);
						} else if (type == 'replaceWith') {
							jQuery(target).replaceWith(response.htCust);
						} else {
							jQuery(target).html(response.htCust);
						}
					}
					if (isScroll) {
						jQuery(target).scrollTop(jQuery(target)[0].scrollHeight);
					}
					if (response.hasOwnProperty('isErr')) {
						Utils.setError(response.ctMeg);
						return;
					} else {
						if (response.ctMeg != undefined) Utils.setError(response.ctMeg);

						Utils.reloadPage();
					}
				} catch (e) {}
				try {
					form.reset();
					form.find("[type='submit']").prop('disabled', false);
				} catch (e) {
					console.log(e);
				}
				form.find('.editorSummernote').each(function () {
					try {
						jQuery(this).code('');
					} catch (e) {}
				});
			},
		});
	} catch (e) {
		console.log(e);
	}

	return false;
});

$(document).on('change', '.CrWorkflowServiceForm', function () {
	var value = $(this).val();
	var stepExecutor = jQuery(this).closest('.task-container').find("input[name='StepExecutor']").val();
	var target = jQuery(this).closest('div.form-group').find($(this).data('target'));
	$.ajax({
		type: 'POST',
		url: Utils.getDomain() + '/' + Cdata.VirtualPath + '/workflow/filter-create-form.html',
		async: true,
		data: {
			id: value,
			rand: stepExecutor,
		},
		beforeSend: function () {
			jQuery(target).addClass('loading').html('');
		},
		complete: function () {
			jQuery(target).removeClass('loading');
		},
		error: function () {
			jQuery(target).removeClass('loading');
		},
		success: function (data) {
			$(target).children().remove();
			if (data.hasOwnProperty('isCust')) {
				jQuery(target).html(data.htCust);
			}
		},
	});
});

$(document).on('change', '#UpServiceIDWorkflow', function () {
	var value = $(this).val();
	if (value == '') value = 0;
	var target = jQuery('#FlowchartHolder');
	$.ajax({
		type: 'GET',
		url: Utils.getDomain() + '/' + Cdata.VirtualPath + '/service/flowchart.html',
		async: true,
		contentType: 'application/json; charset=utf-8',
		dataType: 'json',
		data: {
			id: value,
		},
		success: function (data) {
			FlowChart.load(data);
			if (data == '') jQuery('.btn-view-detail').attr('href', 'javascript:void(0)');
			else jQuery('.btn-view-detail').attr('href', data.linkViewWflDetail);
		},
	});
});
jQuery(document).on('click', '.nextStepRegister', function () {
	var self = jQuery(this);

	var index = self.attr('data-register-now');
	if (index < 3) {
		index++;
	}
	self.attr('data-register-now', index);
	if (index == 2) {
		self.hide();
		jQuery('.btnRegisterDone').show();
	}
});
jQuery(document).on('click', '.previousStepRegister', function () {
	var next = jQuery('.nextStepRegister');
	var index = next.attr('data-register-now');
	if (index > 0) {
		index--;
	}
	jQuery('.btnRegisterDone').hide();
	next.show();
	next.attr('data-register-now', index);
});
jQuery(document).on('click', '.btnRegisterDone', function () {
	//var startDate = jQuery('.StartDateValidate').val();
	//var endDate = jQuery('.EndDateValidate').val();
	//var sumDate = jQuery('.sumDateValidate').val();
	//var startDateVal = jQuery.trim(startDate).length > 0 ? startDate : null;
	//var endDateVal = jQuery.trim(endDate).length > 0 ? endDate : null;
	//var sumDateVal = jQuery.trim(sumDate).length > 0 ? sumDate : 0;
	//moment.locale('vi');
	//if ((jQuery('.sumDateValidate').length > 0 && sumDate)) {
	//    if (parseFloat(sumDateVal) <= 0) {
	//        Utils.setError(jQuery('.sumDateValidate').attr("data-error-name"));
	//        return false;
	//    }
	//}
	//if ((jQuery('.StartDateValidate').length > 0 && startDate) || (jQuery('.EndDateValidate').length > 0 && endDate)) {
	//    var startDateArr = (startDate || startDate !== '') ? startDate.split(" ") : null;
	//    var endDateArr = (endDate || endDate !== '') ? endDate.split(" ") : null;
	//    if (startDateArr && endDateArr) {
	//        var startArr = startDateArr[0].split("/");
	//        var endArr = endDateArr[0].split("/");
	//        startArr.reverse();
	//        endArr.reverse();
	//        var startDate = moment(startArr.join("/") + " " + startDateArr[1]);
	//        var endDate = moment(endArr.join("/") + " " + endDateArr[1]);
	//        if (startDate >= endDate) {
	//            Utils.setError(jQuery('.StartDateValidate').attr("data-error-name") + " phải nhỏ hơn " + jQuery('.EndDateValidate').attr("data-error-name"));
	//            return false;
	//        }
	//    }
	//}
	jQuery('#FrmCrRegService').submit();
});

jQuery(document).on('click', '.btnRegisterUpDone', function (e) {
	var startDate = jQuery('.StartDateValidate').val();
	var endDate = jQuery('.EndDateValidate').val();
	var sumDate = jQuery('.sumDateValidate').val();
	var startDateVal = jQuery.trim(startDate).length > 0 ? startDate : null;
	var endDateVal = jQuery.trim(endDate).length > 0 ? endDate : null;
	var sumDateVal = jQuery.trim(sumDate).length > 0 ? sumDate : 0;
	moment.locale('vi');
	if (jQuery('.sumDateValidate').length > 0 && sumDate) {
		if (parseInt(sumDateVal) <= 0) {
			Utils.setError(jQuery('.sumDateValidate').attr('data-error-name'));
			return false;
		}
	}
	if ((jQuery('.StartDateValidate').length > 0 && startDate) || (jQuery('.EndDateValidate').length > 0 && endDate)) {
		var startDateArr = startDate || startDate !== '' ? startDate.split(' ') : null;
		var endDateArr = endDate || endDate !== '' ? endDate.split(' ') : null;
		if (startDateArr && endDateArr) {
			var startArr = startDateArr[0].split('/');
			var endArr = endDateArr[0].split('/');
			startArr.reverse();
			endArr.reverse();
			var startDate = moment(startArr.join('/') + ' ' + startDateArr[1]);
			var endDate = moment(endArr.join('/') + ' ' + endDateArr[1]);
			if (startDate >= endDate) {
				Utils.setError(jQuery('.StartDateValidate').attr('data-error-name') + ' phải nhỏ hơn ' + jQuery('.EndDateValidate').attr('data-error-name'));
				return false;
			}
		}
	}
	jQuery('#FrmUpRegService').submit();
});
jQuery(document).on('onblur', '.StartDateValidate', function () {
	alert(1);
	var startDate = moment(jQuery(this).val());
	var endDate = moment(jQuery('.EndDateValidate').val());
	if (startDate <= endDate) {
		Utils.setError(jQuery(this).attr('data-error-name') + ' phải nhỏ hơn ' + jQuery('.EndDateValidate').attr('data-error-name'));
	}
});
jQuery(document).on('onblur', '.EndDateValidate', function () {
	alert(2);
	var endDate = moment(jQuery(this).val());
	var startDate = moment(jQuery('.StartDateValidate').val());
	if (startDate <= endDate) {
		Utils.setError(jQuery('.StartDateValidate').attr('data-error-name') + ' phải nhỏ hơn ' + jQuery(this).attr('data-error-name'));
	}
});

//jQuery(document).on("click", ".registerAppBlock", function () {
//    var self = jQuery(this);
//    self.addClass("quickUpdate");
//    jQuery(".registerAppBlock").each(function () {
//        jQuery(this).removeClass("active");
//    });
//    if (!self.hasClass("active")) {
//        jQuery(this).addClass("active");
//    }
//    var dataTargets = jQuery("#nextStep").attr("data-target1");
//    jQuery("#nextStep").attr("data-target", dataTargets);
//    var href = jQuery("#nextStep").attr("data-href");
//    jQuery("#nextStep").attr("href", href + '?IDType=' + jQuery(this).attr('data-id'));
//});
jQuery(document).on('click', '.registerCheckbox', function () {
	//jQuery(".registerCheckbox").each(function () {
	//    jQuery(this).removeAttr("checked");
	//});
	//jQuery(this).attr("checked");
	var href = jQuery('#nextStep').attr('data-href2');
	var dataTarget = jQuery('#nextStep').attr('data-target2');
	jQuery('#nextStep').attr('href', href + '?ID=' + jQuery(this).val());
	jQuery('#nextStep').attr('data-target', dataTarget);
});
jQuery(document).on('click', '#dataFilter_Dropdown', function () {
	jQuery(this).parents('.dataFilter_Dropdown').toggleClass('open');
	jQuery(this).parents('.quickSearch ').find('.dataFilter_Dropdown_target').toggleClass('open');
});
jQuery(document).on('click', '.dataFilter_Dropdown_close', function (e) {
	e.preventDefault();
	jQuery(this).parents('.quickSearch').find('.dataFilter_Dropdown').toggleClass('open');
	jQuery(this).parents('.quickSearch').find('.dataFilter_Dropdown_target').toggleClass('open');
});

//jQuery(document).on("click", "#flowchartTab", function () {
//    //FlowChart.load(JSON.parse(FlowChart.save()));
//});
//jQuery(document).on("click", "#flowchartTab", function () {
//    FlowChart.init();
//});
jQuery(document).on('click', '.flowchartTab', function () {
	var flowchart = jQuery(this).attr('data-flowchart');
	var flowchartSource = jQuery(this).attr('data-flowchart-source');
	FlowChart.init(flowchart, flowchartSource);
});
if (jQuery(document).find('.autoSelect2').is(':visible')) {
	$('select.autoSelect2').select2();
}
$('.FileNotification_btn').click(function () {
	$(this).parents('.FileNotification').toggleClass('is-opened');
});
$('.FileNotiClose').click(function () {
	$(this).parents('.FileNotification').toggleClass('is-opened');
});
$('[data-toggle="tooltip"]').tooltip();
//advanced_search_bar
$('.advanced_search_bar .show_form_btn').focus(function () {
	$(this).parents('.advanced_search_bar').addClass('active');
	$(this).parents('.advanced_search_bar').find('.option_search').fadeIn();
});
$('.advanced_search_bar .hide_form_btn').click(function () {
	$(this).parents('.advanced_search_bar').removeClass('active');
	$(this).parents('.option_search').fadeOut();
});
//notification
$('.notifies-dropdown-toggle').click(function () {
	if ($(this).parents('li').hasClass('open')) {
		$(this).parents('li').removeClass('open');
	} else {
		$(this).parents('li').addClass('open');
	}
});

$(document).mouseup(function (e) {
	var container = $('.notifies-dropdown-toggle').parents('li');
	if (container.is(':visible')) {
		if (
			!container.is(e.target) && // if the target of the click isn't the container...
			container.has(e.target).length === 0
		) {
			// ... nor a descendant of the container
			$('.notifies-dropdown-toggle').parents('li').removeClass('open');
		}
	}
});
jQuery('.navbar .navbar-inner .navbar-header .navbar-account .account-area li.dropdown-hover a .dropdown-expand').click(function (event) {
	event.stopPropagation();
	event.preventDefault();
	jQuery(this).toggleClass('inited');
	jQuery(".navbar .navbar-inner .navbar-header .navbar-account .account-area li.dropdown-hover a .dropdown-expand:not('.inited')").removeClass('active');
	jQuery(this).toggleClass('active');
	jQuery(this).removeClass('inited');

	jQuery(this).parents('.dropdown-hover').toggleClass('inited');
	jQuery(".navbar .navbar-inner .navbar-header .navbar-account .account-area li.dropdown-hover:not('.inited')").find('.dropdown-menu').slideUp(300);
	jQuery(this).parents('.dropdown-hover').find('.dropdown-menu').slideToggle(300);
	jQuery(this).parents('.dropdown-hover').removeClass('inited');
});
//End Sidebar Menu Handle
var dragTimer;
$(window).on('dragenter', function (e) {
	// $(this).preventDefault();
	e.preventDefault();
});
$(document).on('dragover', function (e) {
	var dt = e.originalEvent.dataTransfer;
	if (dt.types && (dt.types.indexOf ? dt.types.indexOf('Files') != -1 : dt.types.contains('Files'))) {
		$('#drap_drop_fixed').addClass('active');
		$('.drap_drop_fixed_ov').addClass('active');
		window.clearTimeout(dragTimer);
	}
});

jQuery('.widget-buttons > [data-toggle="maximize"]').on('click', function () {
	jQuery('body').toggleClass('maximize');
});
jQuery(document).on('click', '.expand-dt-tt', function () {
	jQuery('.useScrollBar').toggleClass('maximized');
	jQuery('body').toggleClass('maximize');
});
// JS click user
$('.click_caret').click(function (event) {
	event.preventDefault();
	$('.drop_click_caret').toggleClass('open');
});
$(document).click(function (e) {
	var target = e.target;
	if (!$(target).is('.click_caret') && !$(target).is('.click_caret')) {
		$('.drop_click_caret').removeClass('open');
	}
});

// JS ADV SEARCH
$(document).on('click', '.AdvSearchLink', function (e) {
	e.preventDefault();
	var url = $(this).attr('myhref');
	window.location = url;
});

$('.advanced_search_bar .btn-searchs .btn-group').on('shown.bs.dropdown', function () {
	$(this).find('.bootstrap-select > .dropdown-menu > .dropdown-menu.inner').addClass('useScrollbar');
	$(this).find('.bootstrap-select > .dropdown-menu > .dropdown-menu.inner.useScrollbar').perfectScrollbar();
});

//JS TAB QUY TRÌNH THỦ TỤC
$('#WiredWizard').wizard();

//jQuery(document).on('click', '.dataFilter_Dropdown .dropdown-toggle', function () {
//    jQuery(this).parents(".dataFilter_Dropdown").toggleClass("open");
//    jQuery(this).parents(".quickSearch ").find(".dataFilter_Dropdown_target").toggleClass("open");
//});
//jQuery(document).on('click', '.dataFilter_Dropdown_close', function (e) {
//    e.preventDefault();
//    jQuery(this).parents(".quickSearch").find(".dataFilter_Dropdown").toggleClass("open");
//    jQuery(this).parents(".quickSearch").find(".dataFilter_Dropdown_target").toggleClass("open");
//});

//});
//--DOCUMENT READY FUNCTION END
if (jQuery('.databox span.databox-text').is(':visible')) {
	jQuery('.databox span.databox-text').each(function () {
		var databox_text = jQuery(this).text();
		jQuery(this).attr('title', databox_text);
	});
}
if (jQuery('.sidebar-menu .menu-text').is(':visible')) {
	jQuery('.sidebar-menu .menu-text').each(function () {
		var menu_text = jQuery(this).text();
		jQuery(this).attr('title', menu_text);
	});
}

jQuery(document).on('change', '.cust_select_change', function (e) {
	var obj = jQuery(this);
	var data = obj.getDataUppername();
	if (obj.val()) {
		var target = jQuery(data.Target);
		var url = data.Url;
		if (url == undefined) return;
		data.ID = obj.val();
		delete data.Url;
		delete data.Target;
		delete data.Svf;
		delete data.SvfSource;
		console.log(data);
		Cust.callAjax(data, url, target, function (res) {
			var html = res.htCust;
			target.html(html);
			Main.upEvent(target);
			Utils.autoResize();
			if (target.prop('tagName').toLowerCase() == 'select') {
				target.closest('form,.form').find('.selectpicker').selectpicker('refresh');
			}
		});
	}
});

jQuery(document).on('change', '.change_selected', function () {
	var select = jQuery(this).find('option:selected');
	jQuery(this).find('option').removeAttr('selected');
	jQuery(this).val(select.val());
	select.attr('selected', true);
	if (jQuery(this).hasClass('selectpicker')) {
		jQuery(this).selectpicker('refresh');
	}
	return false;
});
var Cust = {
	customDialog: function (e) {
		var s = jQuery(e).attr('data-target');
		var isDisableClose = jQuery(e).attr('data-disable-close');
		var maxH = jQuery(window).height();
		jQuery(s).find('.selectpicker').removeClass('inited').selectpicker('destroy').addClass('selectpicker');
		var dialoger = jQuery(s).clone();
		var idDialoger = dialoger.attr('id');
		if (Utils.notEmpty(idDialoger)) {
			jQuery('.ui-dialog:visible').addClass('hidden hiddenDialog');
			jQuery('div[aria-describedby="' + idDialoger + '"]').detach();
			var btns = [
				{
					text: 'Xong',
					class: 'btn btn-primary',
					click: function () {
						$(this).dialog('close');
					},
				},
			];
			if (isDisableClose && isDisableClose == '1') {
				btns = [];
			}
			dialoger.dialog({
				width: 900,
				resizable: true,
				buttons: btns,
				open: function () {
					Utils.openOverlay();
					jQuery(s).empty();
					dialoger.removeClass('hidden');
					//var selects = dialoger.find("select");
					//selects.each(function () {
					//    if (!jQuery(this).hasClass("inited")) {
					//        jQuery(this).addClass("inited").selectpicker();
					//    }
					//});
					jQuery('#Overlay').removeClass('loading');
					if (maxH < dialoger.height()) {
						dialoger.css('height', maxH - 50);
					}
					Cust.registerEvents(dialoger);
					Cust.registerCusEvents(dialoger);
					Utils.autoResize();
					Autocomplete.reinit(dialoger);
				},
				close: function () {
					dialoger.removeClass('ui-dialog-content ui-widget-content');
					jQuery(s).html(dialoger.children().first('div'));
					dialoger.remove();
					Utils.closeCDialog(jQuery(this));
					if (dialoger.hasClass('closeRemove')) {
						dialoger.closest('.ui-dialog').remove();
					}
					jQuery('html').css('overflow', 'auto');
					Utils.closeOverlay();
				},
			});
		}
	},
	custom2Dialog: function (e) {
		var s = jQuery(e).attr('data-target');
		var maxH = jQuery(window).height();
		var dialoger = jQuery(s).clone();
		var idDialoger = dialoger.attr('id');
		if (Utils.notEmpty(idDialoger)) {
			jQuery('.ui-dialog:visible').addClass('hidden hiddenDialog');
			jQuery('div[aria-describedby="' + idDialoger + '"]').detach();

			dialoger.dialog({
				width: 900,
				resizable: true,
				buttons: [
					{
						text: 'Xong',
						class: 'btn btn-primary',
						click: function () {
							$(this).dialog('close');
						},
					},
				],
				open: function () {
					Utils.openOverlay();
					dialoger.removeClass('hidden');
					dialoger.find('select').selectpicker();
					jQuery('#Overlay').removeClass('loading');
					if (maxH < dialoger.height()) {
						dialoger.css('height', maxH - 50);
					}
					Cust.registerEvents();
					Utils.autoResize();
				},
				close: function () {
					dialoger.removeClass('ui-dialog-content ui-widget-content');
					jQuery(s).empty();
					jQuery(s).html(dialoger.children().first('div'));
					dialoger.remove();

					if (dialoger.hasClass('closeRemove')) {
						dialoger.closest('.ui-dialog').remove();
					}
					Utils.closeCDialog(jQuery(this));
					jQuery('html').css('overflow', 'auto');
				},
			});
		}
	},
	registerCusEvents: function (target) {
		if (target) {
			target.find('select').on('change', function () {
				var selected = jQuery(this);
				var target = jQuery(selected.attr('data-target'));

				if (selected.hasClass('dropDownTypeChange')) {
					if (selected.val() == 'dropdown' || selected.val() == 'select2' || selected.val() == 'inputdata') {
						target.removeClass('hidden');
						target.show();
					} else {
						target.addClass('hidden');
						var select = target.find('select').first();
					}
				}
				if (selected.hasClass('fieldSettingSelect')) {
					var idStep = parseInt(selected.val());
					var idService = parseInt(selected.attr('data-param-idService'));
					var idApiDoc = parseInt(selected.attr('data-param-idApiDoc'));
					var idApiParam = parseInt(selected.attr('data-param-idApiparam'));
					var url = selected.attr('data-action');

					Cust.callAjax(
						{
							IDStep: idStep,
							IDService: idService,
							IDApiDoc: idApiDoc,
							IDApiParam: idApiParam,
						},
						url,
						selected,
						function (res) {
							target.html(res.htCust);
							target.find('.selectpicker').selectpicker();
						}
					);
					target.removeClass('hidden');
				}
			});
		}
	},
	registerEvents: function (target) {
		var link = jQuery(target).find('#linkWf');
		if (link) {
			link.on('click', function () {
				window.open(link.attr('href'), '_blank');
			});
		}
		if (target) {
			target.find('#saveFormExport').on('click', function () {
				var sortedField = target.find('#sortedField');
				var url = jQuery(this).attr('data-url');
				var inputs = sortedField.find('.IDServiceFieldSetting');
				var inputServiceTypes = sortedField.find('.IDServiceType');
				if (inputs.length > 0 && inputServiceTypes.length > 0) {
					var values = [];
					var value2s = [];
					inputs.each(function () {
						var s = jQuery(this);
						values.push(s.val());
					});
					inputServiceTypes.each(function () {
						var s = jQuery(this);
						value2s.push(s.val());
					});

					var data = {};
					data['IDServiceFieldSetting'] = values;
					data['IDServiceType'] = value2s;
					data['Name'] = jQuery('#Name').val();
					data['IDType'] = jQuery('#IDType').val();
					data['Describe'] = jQuery('#Describe').val();
					data['IDServiceExportForm'] = jQuery('#IDServiceExportForm').val();
					console.log(data);
					if (values.length > 0) {
						Cust.callAjax(data, url, target, function (res) {
							if (res) {
								Utils.closeOverlay(true);
								location.reload(true);
							}
						});
					}
				} else {
					Utils.setError('Bạn cần cấu hình trường thông tin của biểu');
					return;
				}
			});

			$('#templateField')
				.sortable({
					connectWith: '#sortedField',
				})
				.disableSelection();

			$('#sortedField')
				.sortable({
					connectWith: '#templateField',
				})
				.disableSelection();
			target.find('.closeDlgr').on('click', function () {
				var target = jQuery(jQuery(this).attr('data-target'));
			});
			target.find('select').on('changed.bs.select', function () {
				var selected = jQuery(this);
				var targetB = jQuery(selected.attr('data-target'));
				if (selected.hasClass('apiDoc')) {
					var idservice = parseInt(selected.attr('data-param-idService'));
					var idApiDoc = parseInt(selected.val());
					var url = selected.attr('data-action');

					Cust.callAjax(
						{
							IDService: idservice,
							IDApiDoc: idApiDoc,
						},
						url,
						selected,
						function (res) {
							targetB.html(res.htCust);
							Utils.autoResize();
						}
					);
					targetB.removeClass('hidden');
				}
				if (selected.hasClass('moduleSelect')) {
					var url = selected.attr('data-url');
					var defaultParam = selected.attr('data-param-name');
					var idParam = selected.attr('data-api-param-id');
					var idApiDoc = selected.attr('data-api-doc-id');
					var idIntergratedConfig = selected.attr('data-intergrated-config-id');
					var extendParam = selected.attr('data-param-extend-name');
					var dataRef = selected.attr('data-reference-id');
					var refParam = selected.attr('data-reference-param-name');
					var ref = jQuery(dataRef);

					var valExtendParam = parseInt(selected.attr(`data-${extendParam}-value`));
					var data = {};
					data[defaultParam] = parseInt(selected.val());
					data[extendParam] = valExtendParam;
					data[refParam] = parseInt(ref.val());
					data['IDParam'] = parseInt(idParam);
					data['IDApiDoc'] = parseInt(idApiDoc);
					data['IDIntergratedConfig'] = parseInt(idIntergratedConfig);
					console.log(data);
					Cust.callAjax(data, url, selected, function (res) {
						targetB.html(res.htCust);
						targetB.selectpicker('refresh');
						Cust.registerCusEvents(targetB);
						Utils.updateScrollBar(targetB);
						Utils.autoResize();
					});
				}

				if (selected.hasClass('switchDivExport')) {
					var url = selected.attr('data-url');
					var data = {};
					data['IDServiceType'] = selected.val();
					Cust.callAjax(data, url, selected, function (res) {
						targetB.html(res.htCust);

						$('#templateField')
							.sortable({
								connectWith: '#sortedField',
							})
							.disableSelection();

						$('#sortedField')
							.sortable({
								connectWith: '#templateField',
							})
							.disableSelection();

						targetB.find('#saveFormExport').on('click', function () {
							var sortedField = targetB.find('#sortedField');
							var url = jQuery(this).attr('data-url');
							var inputs = sortedField.find('.IDServiceFieldSetting');
							var inputServiceTypes = sortedField.find('.IDServiceType');
							if (inputs.length > 0 && inputServiceTypes > 0) {
								var values = [];
								var value2s = [];
								inputs.each(function () {
									var s = jQuery(this);
									values.push(s.val());
								});
								inputServiceTypes.each(function () {
									var s = jQuery(this);
									value2s.push(s.val());
								});
								var data = {};
								data['IDServiceFieldSetting'] = values;
								data['IDServiceType'] = value2s;
								data['Name'] = jQuery('#Name').val();
								data['IDType'] = jQuery('#IDType').val();
								data['Describe'] = jQuery('#Describe').val();
								data['IDServiceExportForm'] = jQuery('#IDServiceExportForm').val();
								if (values.length > 0) {
									Cust.callAjax(data, url, targetB, function (res) {
										if (res) {
											Utils.closeOverlay(true);
											location.reload(true);
										}
									});
								}
							} else {
								Utils.setError('Bạn cần cấu hình trường thông tin của biểu');
								return;
							}
						});

						Cust.registerCusEvents(targetB);
						Utils.updateScrollBar(targetB);
						Utils.autoResize();
					});
				}
				if (selected.hasClass('formExportView')) {
					var url = selected.attr('data-url');
					var data = {};
					data['IDServiceExportForm'] = selected.val();
					Cust.callAjax(data, url, selected, function (res) {
						targetB.html(res.htCust);
						Cust.registerCusEvents(targetB);
						Utils.updateScrollBar(targetB);
						Utils.autoResize();
					});
				}
			});
			target.find('#Describe').on('change', function () {
				var describe = jQuery(this);
				var targetBtn = jQuery(describe.attr('data-target'));
				targetBtn.attr('data-describe', describe.val());
			});
			var checkBoxes = target.find('.checkboxAssign');
			if (checkBoxes.length > 0) {
				checkBoxes.each(function () {
					var check = jQuery(this);
					check.on('change', function () {
						if (jQuery(this).prop('checked') == true) {
							var url = jQuery(this).attr('data-url');
							var executor = jQuery(this).attr('data-executor');
							var cusAttr = jQuery(this).attr('data-customAttr');
							var selectPmTeam = jQuery(jQuery(this).attr('data-target'));

							jQuery.ajax({
								type: 'POST',
								url: url,
								beforeSend: function () {
									selectPmTeam.empty();
									selectPmTeam.closest('.container-fluid').addClass('loading');
								},
								complete: function () {
									selectPmTeam.closest('.container-fluid').removeClass('loading');
								},
								error: function () {
									selectPmTeam.closest('.container-fluid').removeClass('loading');
								},
								success: function (response) {
									if (response.isCust) {
										var newSelect = jQuery(response.htCust);
										var name = newSelect.attr('data-name');
										newSelect.attr('data-name', name + executor);
										newSelect.attr('data-target', '#btnSendMail');
										selectPmTeam.html(newSelect);
										selectPmTeam.find('select').selectpicker();

										selectPmTeam.find('select').on('changed.bs.select', function () {
											var selected = jQuery(this);
											var target = jQuery(selected.attr('data-target'));
											var stepEx = target.attr('data-step-executor');
											if (selected && selected.val()) {
												target.attr('data-id-user' + stepEx, selected.val());
											}
										});
									} else {
										return;
									}
								},
							});
						}
					});
				});
			}
		}

		jQuery('#IDDeptSelect').on('changed.bs.select', function () {
			var selected = jQuery(this).val();
			if (selected && selected == '-2') {
				jQuery('#StepSelect').removeClass('hidden');
				jQuery('#StepSelect').find('select').attr('disabled', false);
			} else {
				jQuery('#StepSelect').addClass('hidden');
				jQuery('#StepSelect').find('select').attr('disabled', true);
			}
		});
		jQuery('#StepAutoRunOption').on('changed.bs.select', function (e) {
			var selected = jQuery(this).val();
			var holder = jQuery('#SelectAutoRunHolder');
			if (selected && holder) {
				switch (selected) {
					case '1':
						jQuery('#AutoRunOptionsSelectUser').removeClass('hidden');
						jQuery('#AutoRunOptionsSelectDeptPos').addClass('hidden');
						// An chon buoc
						jQuery('#AutoRunOptionsSelectStep').addClass('hidden');

						break;
					case '2':
						jQuery('#AutoRunOptionsSelectUser').addClass('hidden');
						jQuery('#AutoRunOptionsSelectDeptPos').removeClass('hidden');
						break;
					default:
						return;
				}
			}
		});
	},
	callJsonAjax: function (_data, url, callbackSuccess, callbackErr) {
		jQuery.ajax({
			type: 'POST',
			async: true,
			url: url,
			contentType: 'application/json',
			dataType: 'json',
			data: JSON.stringify(_data),
			beforeSend: function () {},
			complete: function () {},
			error: callbackErr,
			success: callbackSuccess,
		});
	},
	callAjax: function (data, url, obj, callback) {
		jQuery.ajax({
			type: 'POST',
			async: true,
			url: url,
			data: data,
			beforeSend: function () {
				if (obj != undefined && !obj.hasClass('not-overlay')) {
					Utils.openOverlay();
				}
			},
			complete: function () {
				if (obj != undefined && !obj.hasClass('not-overlay')) {
					Utils.openOverlay();
				}
			},
			error: function () {
				if (obj != undefined && !obj.hasClass('not-overlay')) {
					Utils.openOverlay();
				}
			},
			success: function (response) {
				callback(response);
			},
		});
	},
	callAjaxFor: function (data, url, callback) {
		jQuery.ajax({
			type: 'POST',
			async: true,
			url: url,
			data: data,
			beforeSend: function () {
				if (!obj.hasClass('not-overlay')) {
					Utils.openOverlay();
				}
			},
			complete: function () {
				if (!obj.hasClass('not-overlay')) {
					Utils.openOverlay();
				}
			},
			error: function () {
				if (!obj.hasClass('not-overlay')) {
					Utils.openOverlay();
				}
			},
			success: callback,
		});
	},
	_initTabRecordClick: function () {
		jQuery('#flowchartTab').on('click', function () {
			FlowChart.load(JSON.parse(FlowChart.save()));
		});
	},
	dataTables_filter_col: function () {
		//Fix col sm as col md
		if ($(document).find('.dataTables_filter > .quickSearch > div[class*="col"]').is(':visible')) {
			jQuery(document)
				.find('.dataTables_filter > .quickSearch div[class*="col"]')
				.each(function () {
					var obj = $(this);
					var arr = obj.attr('class').split(' ');
					for (var i = 0; i < arr.length; i++) {
						var class_sm = arr[i];
						var col_sm = 'col-sm-';
						if (class_sm.indexOf(col_sm) !== -1) {
							obj.removeClass(class_sm);
						}
					}
					for (var j = 0; j < arr.length; j++) {
						var class_md = arr[j];
						var col_md = 'col-md-';
						if (class_md.indexOf(col_md) !== -1) {
							var res = class_md.replace('md', 'sm');
							obj.addClass(res);
						}
					}
				});
		}
	},
	check_required_input: function () {
		jQuery(document)
			.find('.form-control')
			.each(function () {
				var attr = $(this).attr('data-bv-notempty');
				if (typeof attr !== typeof undefined && attr !== false && attr === 'true') {
					if (jQuery(this).parent().prev('label').is(':visible') && jQuery(this).parent().prev('label').find('.red').size() === 0) {
						var label_text = jQuery(this).parent().prev('label').html();
						jQuery(this)
							.parent()
							.prev('label')
							.html(label_text + ' <span class="red">*</span>');
					}
				}
			});
	},
	//ToDo
	initAutoFillForm: function (target) {
		var dropdowns = target.find('.dropdownRegister');
		dropdowns.each(function () {
			var drop = jQuery(this);
			drop.on('changed.bs.select', function (e) {
				var data;
				var selected = jQuery(this);
				if (selected && selected.val()) {
					var item = parseInt(selected.val());
					var name = selected.attr('data-name');
					var idSR = selected.attr('data-service-record');
					var idService = selected.attr('data-service');
					var url = selected.attr('data-url');
					var target = jQuery(selected.attr('data-target'));
					console.log(drop);
					console.log(drop.hasClass('meetingQLDA'));
					if (drop.hasClass('meetingQLDA')) {
						if (drop.hasClass('ProjectCode')) {
							data = {
								IDContract: item,
							};
						} else if (drop.hasClass('ProjectType')) {
							data = {
								IDProjectType: item,
								IDServiceRecord: idSR,
								IDService: idService,
							};
						}
					} else {
						if (drop.hasClass('ProjectCode')) {
							data = {
								IDContract: item,
								IDServiceRecord: idSR,
								IDService: idService,
							};
						} else if (drop.hasClass('ProjectType')) {
							data = {
								IDProjectType: item,
								IDServiceRecord: idSR,
								IDService: idService,
							};
						}
					}
					if (url) {
						Cust.callAjax(data, url, selected, function (res) {
							if (drop.hasClass('meetingQLDA')) {
								if (drop.hasClass('ProjectCode')) {
									if (res) {
										var resx = JSON.parse(res);
										if (resx.Name) target.find('.ProjectName').val(resx.Name);
									}
								}
							} else {
								if (res && res.htCust) {
									target.empty();
									target.append(jQuery(res.htCust));

									target.find('select').selectpicker();
								}
							}
							Utils.updateInputDate(target);
							Cust.initAutoFillForm(target);
						});
					}
				}
			});
		});
	},
	fileViewer_height_fn: function () {
		if ($('#FileViewer').is(':visible')) {
			$('#FileViewer').css('height', 'auto');
			$('#FileViewer #outerContainer').css('height', 'auto');
			$('#FileViewer .group-tab .tab-data').css('height', 'auto');
			var window_height = $(window).outerHeight(true);
			var navbar_height = 0;
			if ($('.header_banner').is(':visible')) {
				navbar_height = $('.navbar').outerHeight(true) + $('.header_banner').outerHeight(true);
			} else {
				navbar_height = $('.navbar').outerHeight(true);
			}
			var breadcrumbs_height = $('.page-breadcrumbs').outerHeight(true);
			var file_button_action_height = $('#FileViewer .file_button_action').outerHeight(true);
			var toolbarViewer_Scanfile_height = $('#FileViewer .toolbarViewer_Scanfile').outerHeight(true);
			var label_group_tab_custom_height = $('#FileViewer .label_group_tab_custom').outerHeight(true);
			var fileViewer_height = window_height - (navbar_height + breadcrumbs_height + 2);
			var outerContainer_height = fileViewer_height - (file_button_action_height + 2);
			var items_Scan_height = fileViewer_height - (toolbarViewer_Scanfile_height + 2);
			var tab_data_height = fileViewer_height - (label_group_tab_custom_height + 2);
			var sidebar_menu_height = window_height - (navbar_height + 2);
			var outerContainer_height_i = 0;
			if ($('#InfoStatus .wizard').is(':visible')) {
				var wizard_height = $('#InfoStatus .wizard').outerHeight(true);
				var tabs_flat_height = $('#FileViewer .tabs-flat').outerHeight(true);
				outerContainer_height_i = 'height: ' + parseInt(outerContainer_height - wizard_height - tabs_flat_height) + 'px !important';
			} else {
				outerContainer_height_i = 'height: ' + outerContainer_height + 'px !important';
			}
			$('#FileViewer').css('height', fileViewer_height);
			$('#FileViewer .secrtc2 .widget').css('height', fileViewer_height);
			$('#FileViewer .secrtc1 .ScanResult').css('height', fileViewer_height);
			$('#FileViewer .secrtc1 .ScanResult .items_Scan').css('height', items_Scan_height);
			$('#FileViewer #outerContainer').attr('style', outerContainer_height_i);
			$('#FileViewer #DocProIMGMap').attr('style', outerContainer_height_i);
			$('#FileViewer .doc-viewer').attr('style', outerContainer_height_i);
			$('#FileViewer .group-tab .tab-data').css('height', tab_data_height);
			$('.page-sidebar .sidebar-menu').css('height', sidebar_menu_height);
		}
	},
	newsfeedimg: function () {
		// NewsFeed image grid
		$('.timeline-body').each(function () {
			if ($(this).find('.card-image').is(':visible')) {
				var NewsFeed_Image_Count = $(this).find('.card-image').length;
				//alert(NewsFeed_Image_Count);
				if (parseInt(NewsFeed_Image_Count) > 2) {
					$(this).find('.card-image').addClass('multi_card_img');
					$(this).find('.card-image').addClass('hidden');
					$(this).find('.card-image:eq(0)').removeClass('hidden');
					$(this).find('.card-image:eq(1)').removeClass('hidden').addClass('equal_height');
					$(this).find('.card-image:eq(2)').removeClass('hidden').addClass('equal_height');
					var temp_img_heights = 0;
					$(this)
						.find('.card-image.equal_height img')
						.each(function () {
							var temp_img_height = jQuery(this).height();
							if (parseInt(temp_img_height) > parseInt(temp_img_heights)) {
								temp_img_heights = temp_img_height;
							}
						});
					$(this).find('.card-image.equal_height').css('height', temp_img_heights);
					$(this).find('.card-image.equal_height img').css('height', temp_img_heights);
					$(this).find('.card-image.equal_height').addClass('fit_thumbnail');
					if (parseInt(NewsFeed_Image_Count - 3) > 0) {
						var other_img_count_msg = "<div class='other_img_count'>" + (NewsFeed_Image_Count - 3) + "<i class='ion-plus-round'></i></div>";
						$(this).find('.card-image.equal_height:eq(1) img').after(other_img_count_msg);
						var other_img_count = $(this).find('.other_img_count').width();
						$(this)
							.find('.other_img_count')
							.css('margin-left', -(other_img_count / 2));
					}
				} else if (parseInt(NewsFeed_Image_Count) == 2) {
					$(this).find('.card-image').addClass('two_card_img');
				} else {
					$(this).find('.card-image').addClass('one_card_img');
				}
			}
		});
	},
	toogle_steps: function () {
		jQuery('.toogle_steps').on('click', function (e) {
			e.preventDefault();
			jQuery(this).parents('.wizard').find('.steps_parent').slideToggle();
			jQuery(this).find('i').toggleClass('fa-angle-double-up fa-angle-double-down');
			setTimeout(function () {
				Cust.fileViewer_height_fn();
			}, 500);
		});
	},
	Scroll_table: function () {
		if ($('table.table').is(':visible')) {
			jQuery('table.table').each(function () {
				var obj = jQuery(this);
				if (!obj.parent().hasClass('over_auto')) {
					obj.wrapAll('<div class="over_auto"></div>');
				}
				obj.find('tbody tr').each(function () {
					$(this)
						.find('td')
						.each(function (index) {
							var data_title = $(this).parents('tbody').prev('thead').find('tr').find('th').eq(index).clone().children().remove().end().text();
							if (data_title.trim()) {
								//$(this).attr("data-title",data_title);
							}
						});
				});
			});
		}
	},
	Scroll_tab_group: function () {
		if ($('.group_tab_scroll').is(':visible')) {
			var group_tab_scroll_w = 0;
			group_tab_scroll_w = $('.group_tab_scroll').outerWidth(true);

			var group_tab_w = 0;
			$('.group_tab_scroll .tabitem:not(.hidden)').each(function () {
				var group_tab_item_w = $(this).outerWidth(true) + 2;
				$(this).addClass('tab_show');
				group_tab_w = group_tab_w + group_tab_item_w;
			});
			if (group_tab_w > group_tab_scroll_w) {
				jQuery('.group_tab_scroll_prev').removeClass('hidden');
				var tab_each_itemt = 0;
				jQuery('.group_tab_scroll > .tab_show').each(function () {
					var tab_show_w = jQuery(this).outerWidth(true);
					if (parseInt(tab_show_w) > parseInt(tab_each_itemt)) {
						tab_each_itemt = tab_show_w;
					}
				});
				jQuery('.group_tab_scroll > .tab_show').css('width', tab_each_itemt);
				var tab_length = jQuery('.group_tab_scroll > .tab_show').length;
				$('.group_tab_scroll').css('width', tab_each_itemt * tab_length);
				var translate_css_px = 0;
				var tem_w = tab_each_itemt * tab_length;

				$('.group_tab_scroll_prev').click(function () {
					jQuery('.group_tab_scroll_next').removeClass('hidden');
					translate_css_px = translate_css_px - tab_each_itemt;
					var translate_css = 'translateX(' + translate_css_px + 'px)';
					$('.group_tab_scroll').css({ transform: translate_css });
					tem_w = tem_w - tab_each_itemt;
					$('.group_tab_scroll_next').show();
					if (tem_w <= group_tab_scroll_w) {
						$(this).hide();
					}
				});
				$('.group_tab_scroll_next').click(function () {
					translate_css_px = translate_css_px + tab_each_itemt;
					var translate_css = 'translateX(' + translate_css_px + 'px)';
					$('.group_tab_scroll').css({ transform: translate_css });
					tem_w = tem_w + tab_each_itemt;
					$('.group_tab_scroll_prev').show();
					if (tem_w >= tab_each_itemt * tab_length) {
						$(this).hide();
					}
				});
			}
		}
	},
	Table_sort: function () {
		if ($('table .sortitem').is(':visible')) {
			$(document).find('.sortitem').parents('th').addClass('sortitem_th');
		}
	},

	gotoStep: function () {
		if (jQuery('.steps_slide_parent').length != 0) {
			$('#steps_slide').owlCarousel({
				nav: true,
				navText: ["<i class='fa fa-angle-left steps_slide_left' aria-hidden='true'></i>", "<i class='fa fa-angle-right steps_slide_right' aria-hidden='true'></i>"],
				autoplay: false,
				autoplayTimeout: 6000,
				autoplayHoverPause: false,
				loop: false,
				dots: true,
				responsive: {
					0: {
						items: 1,
						slideBy: 1,
					},
					480: {
						items: 2,
						slideBy: 2,
					},
					768: {
						items: 3,
						slideBy: 3,
					},
					979: {
						items: 4,
						slideBy: 4,
					},
					1199: {
						items: 4,
						slideBy: 4,
					},
				},
			});
			jQuery('#steps_slide .owl-item').removeClass('active');
			jQuery('#steps_slide .list_step_item.active').parents('.owl-item').addClass('active');
			jQuery('#steps_slide .list_step_item.active').parents('.owl-item').attr('id', 'gotostep_index');
			jQuery('#steps_slide').owlCarousel();
			var index = jQuery('#gotostep_index');
			var gotostepid = jQuery('#steps_slide .owl-item').index(index);
			//jQuery("#steps_slide").data('owlCarousel').goTo(gotostepid);
			jQuery('#steps_slide').trigger('to.owl.carousel', gotostepid);
		}
	},
	signMoveHelper: function () {
		$('.isClone').remove();
		var clone = $('.dragToViewer').clone();
		var pageHeight = $('.canvasWrapper').height();
		var pageWidth = $('.canvasWrapper').width();
		var imgWidth = 350;
		var imgHeight = 208;
		var pageNumber = $('#pageContainer1').attr('id').replace('pageContainer', '');
		var top = (pageHeight - imgHeight) / 2;
		var left = (pageWidth - imgWidth) / 2;
		var bottom = $('#pageContainer1').height() - top - imgHeight;

		var IDSignature = clone.find('input[name="IDSignature"]').val();
		clone.append("<a href='#' class='delSignature'> </a> ");
		clone.addClass('isClone resize-signature confirmed ui-resizable active-ui-resize');
		clone.removeAttr('data-is-protected');
		clone.css({ top: (pageHeight - imgHeight) / 2, left: (pageWidth - imgWidth) / 2, position: 'absolute', bottom: 'auto' });
		clone.appendTo('#pageContainer1');
		var IDFileInfo = $('#IDFileInfo').val();
		var IDRecord = $('#IDRecord').val();
		var link = $('#link').val();

		var url = `${link}?Page=${pageNumber}&Signed=1&Id=${IDRecord}&IDFileInfo=${IDFileInfo}&Left=399.00001525878906&Bottom=595.4999771118164&ImgWidth=${imgWidth}&ImgHeight=${imgHeight}&Width=${pageWidth}&Height=${pageHeight}&IDSignature=${IDSignature}`;
		$('#complete').attr('href', url);
		clone.draggable();
	},
	initChart: function () {
		if ($('.tkqt_pie_chart_tttt').length != 0) {
			var obj = JSON.parse($('.tkqt_pie_chart_tttt').val());
			var totalPage = obj.data[0].y + obj.data[1].y + obj.data[2].y;
			var total = $('.TotalReport').val();
			total = 'Tổng số: ' + ' ' + total + ' ' + 'hồ sơ năm 2019';
			if (totalPage != 0) {
				var model = {
					chart: {
						plotBackgroundColor: null,
						plotBorderWidth: null,
						plotShadow: false,
						type: 'pie',
						height: '230px',
					},
					title: {
						text: obj.title,
					},
					subtitle: {
						text: 'Tổng số: ' + ' ' + totalPage + ' ' + 'hồ sơ năm 2019',
					},
					colors: obj.colors,
					tooltip: {
						pointFormat: '<b>{point.percentage:.2f}%</b>',
					},
					plotOptions: {
						pie: {
							allowPointSelect: true,
							cursor: 'pointer',
							dataLabels: {
								enabled: true,
								format: '{point.percentage:.2f} %',
								distance: -50,
								filter: {
									property: 'percentage',
									operator: '>',
									value: 4,
								},
							},
							showInLegend: true,
						},
					},
					legend: {
						align: 'right',
						verticalAlign: 'middle',
						floating: true,
						layout: 'vertical',
					},
					series: [
						{
							name: 'Brands',
							colorByPoint: true,

							data: [obj.data[0], obj.data[1], obj.data[2]],
						},
					],
				};
				Highcharts.chart('container_2', model);
			}
		}
		if ($('.tkqt_colum_chart_dttt').length != 0) {
			/*QLTL_TTND*/
			var obj2 = JSON.parse($('.tkqt_colum_chart_dttt').val());
			var sum1 = obj2.series[0].data.reduce(function (a, b) {
				return a + b;
			});
			var sum2 = obj2.series[1].data.reduce(function (a, b) {
				return a + b;
			});
			var sum3 = obj2.series[2].data.reduce(function (a, b) {
				return a + b;
			});
			if (sum1 != 0 || sum2 != 0 || sum3 != 0) {
				var model = Highcharts.chart('container', {
					chart: {
						type: 'column',
					},
					title: {
						text: obj2.title,
					},
					subtitle: {
						text: total,
					},
					colors: obj2.colors,
					xAxis: {
						categories: obj2.categories,
					},
					yAxis: {
						min: 0,
						title: {
							text: '',
						},
						stackLabels: {
							enabled: true,
							style: {
								fontWeight: 'bold',
								shadow: false,
								color: obj.colors,
							},
						},
					},
					legend: {
						align: 'right',
						x: -30,
						verticalAlign: 'top',
						y: 25,
						floating: false,
						backgroundColor: (Highcharts.theme && Highcharts.theme.background2) || 'white',
						borderColor: '#CCC',
						borderWidth: 1,
						layout: 'horizontal',
						shadow: false,
						enabled: true,
					},
					tooltip: {
						headerFormat: '<b>{point.x}</b><br/>',
						pointFormat: '{series.name}: {point.y}<br/>Total: {point.stackTotal}',
					},
					plotOptions: {
						column: {
							stacking: 'normal',
							dataLabels: {
								enabled: true,
								shadow: false,
								color: (Highcharts.theme && Highcharts.theme.dataLabelsColor) || 'white',
							},
						},
					},
					series: [
						{
							name: obj2.series[0].name,
							data: obj2.series[0].data,
						},
						{
							name: obj2.series[1].name,
							data: obj2.series[1].data,
						},
						{
							name: obj2.series[2].name,
							data: obj2.series[2].data,
						},
					],
				});
				Highcharts.chart('container', model);
			}
		}

		//if ($(".tkqt_colum_chart").length != 0) {
		//    var obj = JSON.parse($(".TKTheoLoaiTTChart").val());
		//    var arrayName = obj.data.map(e => { return e.Name });
		//    var arrayTotalCXL = obj.data.map(e => { return parseInt(e.TotalCXL) });
		//    var arrayTotalXL = obj.data.map(e => { return parseInt(e.TotalXL) });
		//    var arrayTotalDXL = obj.data.map(e => { return parseInt(e.TotalDXL) });
		//    var model = Highcharts.chart('container_1', {
		//        chart: {
		//            type: 'column'
		//        },
		//        title: {
		//            text: obj.title
		//        },
		//        xAxis: {
		//            categories: arrayName
		//        },
		//        yAxis: {
		//            title:''
		//        },
		//        credits: {
		//            enabled: false
		//        },
		//        colors: obj.colors,
		//        series: [{
		//            name: 'Chưa xử lý',
		//            data: arrayTotalCXL
		//        }, {
		//            name: 'Đang xử lý',
		//            data: arrayTotalXL
		//        }, {
		//            name: 'Đã xử lý',
		//            data: arrayTotalDXL
		//        }]
		//    });
		//    Highcharts.chart(container_1, model);
		//}

		//if ($(".tkqt_colum_chart").length != 0) {
		//    Highcharts.chart('dk_container', {
		//        chart: {
		//            type: 'column'
		//        },
		//        title: {
		//            text: 'THỐNG KÊ SỐ LƯỢNG HỒ SƠ ĐĂNG KÝ THEO THÁNG'
		//        },
		//        xAxis: {
		//            categories: ['Tháng Một', 'Tháng Hai', 'Tháng Ba', 'Tháng Bốn', 'Tháng Năm', 'Tháng Sáu', 'Tháng Bảy', 'Tháng Tám', 'Tháng Chín', 'Tháng Mười', 'Tháng Mười Một', 'Tháng Mười Hai']
		//        },
		//        yAxis: {
		//            title: {
		//                text: 'Số lượng'
		//            }
		//        },
		//        series: [{
		//            name: 'Chưa xử lý',
		//            data: [7.0, 6.9, 9.5, 14.5, 18.4, 21.5, 25.2, 26.5, 23.3, 18.3, 13.9, 9.6]
		//        }, {
		//            name: 'Đang xử lý',
		//            data: [3.9, 4.2, 5.7, 8.5, 11.9, 15.2, 17.0, 16.6, 14.2, 10.3, 6.6, 4.8]
		//        }, {
		//            name: 'Đã xử lý',
		//            data: [3.9, 4.2, 5.7, 8.5, 11.9, 15.2, 17.0, 16.6, 14.2, 10.3, 6.6, 4.8]
		//        }]
		//    });
		//}
	},
};
Cust.check_required_input();
jQuery(document).on('show.bs.tab', '[data-toggle="tab"]', function () {
	if ($('table.table').is(':visible')) {
		jQuery('table.table').each(function () {
			var obj = jQuery(this);
			if (!obj.parent().hasClass('over_auto')) {
				obj.wrapAll('<div class="over_auto"></div>');
				obj.find('tbody tr').each(function () {
					$(this)
						.find('td')
						.each(function (index) {
							var data_title = $(this).parents('tbody').prev('thead').find('tr').find('th').eq(index).clone().children().remove().end().text();
							if (data_title.trim()) {
								//$(this).attr("data-title",data_title);
							}
						});
				});
			}
		});
	}
});
$(document).on('dialogopen', function (event, ui) {
	if (jQuery(document).find('.date').is(':visible')) {
		jQuery('.date').datetimepicker({
			format: 'd/m/Y',
			timepicker: false,
		});
	}
	if (jQuery(document).find('[data-toggle="popover"]').is(':visible')) {
		jQuery(document).find('[data-toggle="popover"]').popover();
	}
	if (jQuery(document).find('.autoSelect2').is(':visible')) {
		$('select.autoSelect2').select2();
	}
	if (jQuery(document).find('.useScrollBar').is(':visible')) {
		Utils.updateScrollBar($('.useScrollBar'));
	}
	$('select.selectpicker').not('.inited').selectpicker();
	// lock scroll position, but retain settings for later
	var scrollPosition = [self.pageXOffset || document.documentElement.scrollLeft || document.body.scrollLeft, self.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop];
	var html = jQuery('html'); // it would make more sense to apply this to body, but IE7 won't have that
	html.data('scroll-position', scrollPosition);
	html.data('previous-overflow', html.css('overflow'));
	html.css('overflow', 'hidden');
	window.scrollTo(scrollPosition[0], scrollPosition[1]);
	if (jQuery(document).find('#Overlay').is(':visible') && jQuery(document).find('#Overlay').hasClass('loadingc')) {
		jQuery(document).find('#Overlay').removeClass('loadingc');
	}

	Cust.check_required_input();
});
$(document).on('dialogclose', function (event, ui) {
	// un-lock scroll position
	var html = jQuery('html');
	var scrollPosition = html.data('scroll-position');
	html.css('overflow', html.data('previous-overflow'));
	if (scrollPosition) window.scrollTo(scrollPosition[0], scrollPosition[1]);
});
Cust.dataTables_filter_col();
Cust.fileViewer_height_fn();
Cust.toogle_steps();
Cust.Scroll_table();
Cust.Scroll_tab_group();
Cust.gotoStep();
Cust.initChart();
// =========== Resopnsive member 2 colum equal height ==========
if ($(window).width() > 463) {
	$('.timeline_job_item_body .member').css('height', 'auto');
	var member_temp_height = 0;
	$('.timeline_job_item_body .member').each(function () {
		var member_height = $(this).innerHeight();
		if (parseInt(member_height) > parseInt(member_temp_height)) {
			member_temp_height = member_height;
		}
	});
	$('.timeline_job_item_body .member').css('height', member_temp_height);
} else {
	$('.timeline_job_item_body .member').css('height', 'auto');
}

// =========== Resopnsive timeline job item status &  star box rating colum equal height ==========
if ($(window).width() > 463) {
	$('.star_rate.box-rating').css('height', 'auto');
	$('.timeline_job_item_status').css('height', 'auto');
	var timeline_job_item_status_height = $('.timeline_job_item_status').innerHeight();
	var star_rate_box_rating_height = $('.star_rate.box-rating').innerHeight();
	if (parseInt(timeline_job_item_status_height) > parseInt(star_rate_box_rating_height)) {
		$('.star_rate.box-rating').css('height', timeline_job_item_status_height);
	} else {
		$('.timeline_job_item_status').css('height', star_rate_box_rating_height);
	}
} else {
	$('.star_rate.box-rating').css('height', 'auto');
	$('.timeline_job_item_status').css('height', 'auto');
}

function display_dock() {
	//dock
	var dock = $('.dock #dockWrapper');
	dock.css('margin-top', '0px');
	dock.css('opacity', '1');
	//toggle_dock
	var toggle_dock = $('.toggle_dock');
	toggle_dock.css('opacity', '0');
	$('.dock').css('visibility', 'visible');
	jQuery('.toggle_dock').addClass('is_hidden');
	jQuery('.toggle_dock').removeClass('is_show');
	localStorage.setItem('toggle_dock_stt', 'dock_is_show');
}
function hide_dock() {
	//dock
	var dock = $('.dock #dockWrapper');
	dock.css('margin-top', '100px');
	dock.css('opacity', '0');
	//toggle_dock
	var toggle_dock = $('.toggle_dock');
	toggle_dock.css('opacity', '1');

	$('.dock').css('visibility', 'hidden');
	jQuery('.toggle_dock').removeClass('is_hidden');
	jQuery('.toggle_dock').addClass('is_show');
	localStorage.setItem('toggle_dock_stt', 'dock_is_hide');
}
jQuery('.btn_show_dock').click(function (e) {
	e.preventDefault();
	//dock
	var dock = $('.dock #dockWrapper');
	dock.animate({ opacity: '1', 'margin-top': '0px' }, 300);

	//toggle_dock
	var toggle_dock = $('.toggle_dock');
	toggle_dock.animate({ opacity: '0' }, 300);
	toggle_dock.css({
		transition: 'all .3s',
		transform: 'scale(0)',
	});

	jQuery('.toggle_dock').addClass('is_hidden');
	jQuery('.toggle_dock').removeClass('is_show');
	$('.dock').css('visibility', 'visible');
	localStorage.setItem('toggle_dock_stt', 'dock_is_show');
});
jQuery('.btn_hide_dock').click(function (e) {
	e.preventDefault();
	//dock
	var dock = $('.dock #dockWrapper');
	dock.animate({ 'margin-top': '100px', opacity: '0' }, 300);

	//toggle_dock
	var toggle_dock = $('.toggle_dock');
	toggle_dock.animate({ opacity: '1' }, 300);

	toggle_dock.css({
		transition: 'all .3s',
		transform: 'scale(1)',
	});

	jQuery('.toggle_dock').removeClass('is_hidden');
	jQuery('.toggle_dock').addClass('is_show');
	$('.dock').css('visibility', 'hidden');
	localStorage.setItem('toggle_dock_stt', 'dock_is_hide');
});
if (localStorage.getItem('toggle_dock_stt') == 'dock_is_show') {
	display_dock();
} else {
	hide_dock();
}
$('.multi-action .action-button').on('click', function () {
	$(this).toggleClass('active');
	if ($(this).parents().attr('data-original-title') == '') {
		$(this).parents().attr('data-original-title', 'Danh sách ghim');
		$(this).parents().next('.tooltip').show();
	} else {
		$(this).parents().attr('data-original-title', '');
		$(this).parents().next('.tooltip').hide();
	}
});

$('.task_Job .todoJob_User').on('click', function () {
	$(this).toggleClass('active');
	//$(this).parents(".allJob_Board").find('.todoJob_info').toggle();
	$(this).parent().next().toggle();
});

//--WINDOW RESIZE FUNCTION BEGIN
$(window).resize(function () {
	list_pagi(0, 'resize');
	Cust.fileViewer_height_fn();
	Cust.Scroll_tab_group();
	Cust.gotoStep();
	// =========== Resopnsive member 2 colum equal height ==========
	if ($(window).width() > 463) {
		$('.timeline_job_item_body .member').css('height', 'auto');
		var member_temp_height = 0;
		$('.timeline_job_item_body .member').each(function () {
			var member_height = $(this).innerHeight();
			if (parseInt(member_height) > parseInt(member_temp_height)) {
				member_temp_height = member_height;
			}
		});
		$('.timeline_job_item_body .member').css('height', member_temp_height);
	} else {
		$('.timeline_job_item_body .member').css('height', 'auto');
	}

	// =========== Resopnsive timeline job item status &  star box rating colum equal height ==========
	if ($(window).width() > 463) {
		$('.star_rate.box-rating').css('height', 'auto');
		$('.timeline_job_item_status').css('height', 'auto');
		var timeline_job_item_status_height = $('.timeline_job_item_status').innerHeight();
		var star_rate_box_rating_height = $('.star_rate.box-rating').innerHeight();
		if (parseInt(timeline_job_item_status_height) > parseInt(star_rate_box_rating_height)) {
			$('.star_rate.box-rating').css('height', timeline_job_item_status_height);
		} else {
			$('.timeline_job_item_status').css('height', star_rate_box_rating_height);
		}
	} else {
		$('.star_rate.box-rating').css('height', 'auto');
		$('.timeline_job_item_status').css('height', 'auto');
	}
});
//--WINDOW RESIZE FUNCTION END

//--WINDOW LOADED FUNCTION BEGIN
$(document).ready(function () {
	jQuery(document)
		.find('.changeRel')
		.each(function (e) {
			jQuery(e).on('change', function () {
				alert(e);
			});
		});

	jQuery(document).on('click', '.popupCmt', function () {
		$('.popupCmt').toggleClass('main_1');
		$('.popupCmt_content').toggleClass('main');

		$('.popupCks').removeClass('main_1');
		$('.popupCks_content').removeClass('main');
	});
	jQuery(document).on('click', '.popupCks', function () {
		if ($('#isSignedFile').val() === '0') {
			Utils.setError(jQuery(this).attr('data-msgsign'));
			return false;
		} else {
			if ($('.popupCks_content img').length === 1 && $('.dragToViewer').attr('data-is-protected') === 'true') {
				var target = $(this).attr('data-confirm-target');
				var signID = $('.dragToViewer').find('input[name="IDSignature"]').val();
				var d = new Date();
				var dropId = 'droped_' + signID + d.getHours() + d.getMinutes() + d.getSeconds() + d.getMilliseconds();
				var dialoger = $(target);
				dialoger.reset();
				dialoger.find('input[name="SignID"]').val(signID);
				dialoger.find('input[name="DelTartgetID"]').val('#' + dropId);
				var maxH = jQuery(window).height();
				if (!dialoger.hasClass('.ui-dialog-content')) {
					jQuery(".ui-dialog[aria-describedby='" + dialoger.attr('id') + "']").remove();
				}
				Utils.openOverlay();
				dialoger.dialog({
					width: 500,
					resizable: false,
					open: function () {
						if (maxH < dialoger.height()) {
							dialoger.css('height', maxH - 50);
						}
					},
					close: function () {
						Utils.closeOverlay();
					},
				});
				resetValidator(dialoger);
				return false;
			} else if ($('.dragToViewer').attr('data-is-protected') !== 'true') {
				Cust.signMoveHelper();
			}
		}
	});
	var resetValidator = function (container) {
		try {
			if (container.hasClass('bootstrapValidator')) {
				container.removeClass('bootstrapValidator').bootstrapValidator('destroy');
			}
		} catch (e) {
			//Ignore
		}
		Utils.bootstrapValidator(container);
	};
	//var signMoveHelper = function () {
	//    $(".isClone").remove();
	//    var clone = $(".dragToViewer").clone();
	//    var pageHeight = $('.canvasWrapper').height();
	//    var pageWidth = $('.canvasWrapper').width();
	//    var imgWidth = $('.dragToViewer img').width();
	//    var imgHeight = $('.dragToViewer img').height();
	//    clone.append("<a href='#' class='delSignature'> </a> ");
	//    clone.addClass('isClone resize-signature confirmed ui-resizable active-ui-resize');
	//    clone.css({ top: (pageHeight - imgHeight) / 2, left: (pageWidth - imgWidth) / 2, position: 'absolute', bottom: 'auto' });
	//    clone.appendTo('#pageContainer1');
	//    //var link = $("#link").val();
	//    //var url = `${link}?Page=${pageNumber}&Signed=1&Id=${IDRecord}&IDFileInfo=${IDFileInfo}&Left=${left}&Bottom=${bottom}&ImgWidth=${cloneItem.width() || ui.draggable.width()}&ImgHeight=${cloneItem.height() || ui.draggable.height()}&Width=${$(this).width()}&Height=${$(this).height()}&IDSignature=${IDSignature}`;
	//    //$("#complete").attr("href", url);
	//    clone.draggable();
	//}
	jQuery(document).on('click', '.ts_toggle_table', function (e) {
		e.preventDefault();
		$(this).closest('.timesheet_table_header').next('.timesheet_table').slideToggle();
		$(this).closest('.timesheet_table_header').toggleClass('active');
		$(this).children('i').toggleClass('fa-angle-down fa-angle-right');
	});
	Utils.flash_position();
	if ($('.fsi_group_tabs .nav-tabs').length != 0) {
		$('.fsi_group_tabs .nav-tabs').each(function () {
			var length = $(this).children('li:not(.hidden)').length;
			if (length > 1) {
				$(this).css('display', 'block');
			}
		});
	}

	list_pagi(0, '');
	jQuery(document).on('click', '.more_slide_next', function () {
		var target = $('#' + $(this).parent('.useMoreSlide').attr('data-target'));
		var index = parseInt($(this).attr('data-index'));
		list_pagi(index, '');
	});
	jQuery(document).on('click', '.more_slide_prev', function () {
		var target = $('#' + $(this).parent('.useMoreSlide').attr('data-target'));
		var index = parseInt($(this).attr('data-index'));
		list_pagi(index, '');
	});
	jQuery(document).on('submit', '.quickSubmitPoint', function (e) {
		e.preventDefault();
		try {
			var form = jQuery(this);
			var table = form.find('table:visible');
			if (!$(form).hasClass('submiting')) {
				$(form).addClass('submiting');
				var url = form.attr('action');
				var target = form.attr('data-target');
				var containmes = form.find('#messeage_err');
				var targetDelete = form.attr('data-target-delete');
				var type = form.attr('data-insert-type');
				var data = Utils.getSerialize(table);
				if (Utils.isEmpty(url)) {
					$(form).removeClass('submiting');
					return false;
				}
				if (!Utils.validateDataForm(form)) {
					$(form).removeClass('submiting');
					return false;
				}
				if (!form.hasClass('bootstrapValidator')) {
					form.addClass('bootstrapValidator').bootstrapValidator();
				}
				var bootstrapValidator = form.data('bootstrapValidator');
				bootstrapValidator.validate(true);
				if (!bootstrapValidator.isValid()) {
					$(form).removeClass('submiting');
					return false;
				}
				jQuery.ajax({
					type: 'POST',
					async: true,
					url: url,
					data: data,
					beforeSend: function () {},
					complete: function () {},
					error: function () {},
					success: function (response) {
						if (!response.isErr) window.location.reload();
						Utils.sectionBuilder(response, response.isErr);
						if (response.hasOwnProperty('isCust')) {
							if (type == 'append') {
								jQuery(target).append(response.htCust);
							} else if (type == 'prepend') {
								jQuery(target).prepend(response.htCust);
							} else if (type == 'replaceWith') {
								jQuery(target).replaceWith(response.htCust);
							} else {
								jQuery(target).html(response.htCust);
							}
						}
						if (containmes.length > 0) containmes.text(response.ctMeg);
						Utils.updateInputDate(jQuery(target));
						Utils.updateFormState(jQuery(target));
						Utils.updateScrollBar(jQuery(target));
						Autocomplete.init(jQuery(target));
						Main.upEvent();
						if (!Utils.isEmpty(targetDelete)) {
							jQuery(targetDelete).fadeOut('fast', function () {
								jQuery(this).remove();
							});
						}
						if (form.hasClass('closeOnSubmit')) {
							Utils.closeOverlay(true);
						}
						form.find("[type='submit']").prop('disabled', false);
						$(form).removeClass('submiting');
					},
				});
			}
		} catch (e) {}
		return false;
	});
	//jQuery(document).on("click", ".uphourtimesheet", function (e) {
	//    jQuery(".uphourtimesheet").removeClass("checkinput");
	//    jQuery(this).addClass("checkinput");
	//});

	jQuery(document).on('keydown', '.uphourtimesheet', function (e) {
		var code = e.keyCode || e.which;
		if (code == 13) {
			//enter
			// alert('dac');
			var time = jQuery(this).attr('data-time');
			var task = jQuery(this).attr('data-idtask');
			var value = jQuery(this).val();
			var saved = jQuery(this).attr('saved');
			var url = jQuery(this).attr('data-href');
			jQuery.ajax({
				type: 'POST',
				async: true,
				url: url,
				data: { Time: time, IDTask: task, Value: value, Saved: saved },
				beforeSend: function () {},
				complete: function () {},
				error: function () {},
				success: function (response) {
					Utils.sectionBuilder(response, response.isErr);
					Utils.updateInputDate(jQuery(target));
					Utils.updateFormState(jQuery(target));
					Utils.updateScrollBar(jQuery(target));
					Autocomplete.init(jQuery(target));
					Main.upEvent();
					//if (!Utils.isEmpty(targetDelete)) {
					//    jQuery(targetDelete).fadeOut("fast", function () {
					//        jQuery(this).remove();
					//    });
					//}
					//if (form.hasClass("closeOnSubmit")) {
					//    Utils.closeOverlay(true);
					//}
					//form.find("[type='submit']").prop("disabled", false);
					//$(form).removeClass('submiting');
				},
			});
			e.preventDefault();
			return false;
		}

		//else if (e.ctrlKey && code == 39) //
		//{
		//    jQuery(".popupEdit_next").trigger("click");
		//    return false;
		//}
		//else if (e.ctrlKey && code == 37) {
		//    jQuery(".popupEdit_prev").trigger("click");
		//    return false;
		//}
	});
	jQuery(document).on('click', '.dataTable .edit1', function (e) {
		var item = jQuery(this).closest('tr').find('.edit_input');
		jQuery(this).closest('td').find('.save1,.cancel1').toggleClass('hidden');
		jQuery(this).closest('td').find('.edit1,.quickDelete').toggleClass('hidden');
		item.each(function () {
			var value = jQuery(this).text().trim();
			var href = jQuery(this).find('a').first().attr('href');
			var name = jQuery(this).attr('data-name');
			var newText = "<textarea name='" + name + "' data-href+'" + href + "' class='form-control noresize' rows='3' style='width:100%'>" + value + '</textarea>';
			jQuery(this).html(newText);
		});
	});

	jQuery(document).on('click', '.dataTable .cancel1', function (e) {
		var item = jQuery(this).closest('tr').find('.edit_input');
		var tdparent = jQuery(this).closest('td');
		tdparent.find('.save1,.cancel1').toggleClass('hidden');
		tdparent.find('.edit1,.quickDelete').toggleClass('hidden');
		item.each(function () {
			var value = jQuery(this).children('textarea').html();
			//var newText = "<input type='text' class='form-control input-small' value=" + value + ">";

			//window.location.reload();
			//var href = jQuery(this).children("textarea").attr("data-href");
			//var html = "<a href='" + href + "'>" + value + "</a>";
			jQuery(this).html(value);
		});
	});
	jQuery(document).on('click', '.dataTable .save1', function (e) {
		var item = jQuery(this).closest('tr').find('.edit_input');
		var tdparent = jQuery(this).closest('td');
		var url = jQuery(this).attr('data-href');
		var obj = jQuery(this).closest('tr').find('td.edit_input');
		var data = Utils.getSerialize(obj);
		//var data = obj.getDataUppername();
		jQuery.ajax({
			type: 'POST',
			async: true,
			url: url,
			data: data,
			beforeSend: function () {},
			complete: function () {},
			error: function () {},
			success: function (response) {
				//if (!response.isErr)
				//    window.location.reload();
				//if (!response.isErr) {
				//    Utils.reloadPage();
				//}
				Utils.sectionBuilder(response, response.isErr);
				tdparent.find('.save1,.cancel1').toggleClass('hidden');
				tdparent.find('.edit1,.quickDelete').toggleClass('hidden');
				item.each(function () {
					var value = jQuery(this).children('textarea').val();
					//var newText = "<input type='text' class='form-control input-small' value=" + value + ">";
					//var href = jQuery(this).children("textarea").attr("data-href");
					//var html = "<a href='" + href + "'>" + value + "</a>";
					jQuery(this).html(value);
				});
			},
		});
	});
	jQuery(document).on('click', '.append_template2', function () {
		//var obj = jQuery(this);
		//var form = jQuery(this).closest("form");
		//var table = form.find("table:first");
		//var target = jQuery(obj.attr("data-target"));
		//var temp = jQuery(obj.attr("data-temp"));
		//var jobdetail = jQuery("input#JobDetail").val();
		//var jobexcuter = jQuery("select#idJobDetailExcuter").val();
		//var jobexcutername = jQuery("select#idJobDetailExcuter option:selected").text();
		//var datejob = jQuery("input#DateJobDetail").val();
		//var startdatejob = jQuery("input#StartDateJobDetail").val();
		//var enddatejob = jQuery("input#EndDateJobDetail").val();
		//var starttime = form.find("#JobCrStartDate").val();
		//var enddate = form.find("#JobCrEndDate").val();
		//if (!(Utils.isEmpty(jobdetail) || Utils.isEmpty(datejob) || Utils.isEmpty(startdatejob) || Utils.isEmpty(enddatejob) || Utils.isEmpty(jobexcuter))) {
		//    jQuery("#detailTemplate .IDJobDetail").attr("name", "IDJobDetail");
		//    jQuery("#detailTemplate .JobDetailName").attr("name", "JobDetailName");
		//    jQuery("#detailTemplate .JobDetailExcuter").attr("name", "JobDetailExcuter");
		//    jQuery("#detailTemplate .DateJobDetail").attr("name", "DateJobDetail");
		//    jQuery("#detailTemplate .StartDateJobDetail").attr("name", "StartDateJobDetail");
		//    jQuery("#detailTemplate .EndDateJobDetail").attr("name", "EndDateJobDetail");
		//    jQuery("#detailTemplate .idJobDetail").html(jobdetail);
		//    jQuery("#detailTemplate .jobDetailDatetime").html("(Từ: " + datejob + " : " + startdatejob + " -  Đến: " + datejob + " : " + enddatejob + ") -  " + "Người thực hiện: " + jobexcutername);
		//    jQuery("#detailTemplate .JobDetailName").val(jobdetail);
		//    jQuery("#detailTemplate .JobDetailExcuter").val(jobexcuter);
		//    jQuery("#detailTemplate .DateJobDetail").val(datejob);
		//    jQuery("#detailTemplate .StartDateJobDetail").val(startdatejob);
		//    jQuery("#detailTemplate .EndDateJobDetail").val(enddatejob);
		//    jQuery("input#JobDetail").val('');
		//    Utils.destroyValidator(table);
		//    target.append(temp.html());
		//    //  Utils.updateInputDate(form);
		//    Utils.bootstrapValidator(table);
		//    Utils.autoResize();
		//    Utils.resetTableFix(table);
		//    // Utils.updateIsNumber(form);
		//    Autocomplete.init(jQuery(target));
		//    jQuery("#detailTemplate .IDJobDetail").removeAttr("name", "IDJobDetail");
		//    jQuery("#detailTemplate .JobDetailName").removeAttr("name", "JobDetailName");
		//    jQuery("#detailTemplate .DateJobDetail").removeAttr("name", "DateJobDetail");
		//    jQuery("#detailTemplate .JobDetailExcuter").removeAttr("name", "JobDetailExcuter");
		//    jQuery("#detailTemplate .StartDateJobDetail").removeAttr("name", "StartDateJobDetail");
		//    jQuery("#detailTemplate .EndDateJobDetail").removeAttr("name", "EndDateJobDetail");
		//    form.find('#messeageadd_err').html("");
		//}
		//else if (Utils.isEmpty(jobdetail)) {
		//    form.find('#messeage_err').html("");
		//    form.find('#messeageadd_err').html("Việc cần làm không được để trống");
		//}
		//else if (Utils.isEmpty(jobexcuter)) {
		//    form.find('#messeage_err').html("");
		//    form.find('#messeageadd_err').html("Bạn chưa chọn người thực hiện việc cần làm");
		//}
		//else if (Utils.isEmpty(datejob)) {
		//    form.find('#messeage_err').html("");
		//    form.find('#messeageadd_err').html("Bạn chưa chọn ngày thực hiện việc cần làm");
		//}
		//else {
		//    form.find('#messeage_err').html("");
		//    form.find('#messeageadd_err').html("Bạn chưa chọn giờ thực hiện việc cần làm");
		//}
		// var el1 = table.find("tbody tr:last td:eq(1)").
	});
	jQuery(document).on('click', '.updateJobdetailComplete', function () {
		try {
			var data = jQuery(this).getDataUppername();
			if (typeof data.RedirectPath == 'undefined') data.RedirectPath = Utils.getRedirect();
			jQuery.ajax({
				type: 'POST',
				async: true,
				url: jQuery(this).attr('href'),
				data: data,
				success: function (response) {
					Utils.sectionBuilder(response);
					if (response.hasOwnProperty('isCust')) {
						Utils.closeOverlay();
						jQuery(data.Target).html(response.htCust);
					}
					if (!Utils.isEmpty(data.TargetDeleteClick)) {
						jQuery(data.TargetDeleteClick).fadeOut('fast', function () {
							jQuery(this).remove();
						});
					}
					Utils.updateFormState(jQuery(data.Target));
					Utils.updateScrollBar(jQuery(data.Target));
					Autocomplete.init(jQuery(data.Target));
					Main.upEvent(jQuery(data.Target));
				},
			});
		} catch (e) {}
		return false;
	});
	jQuery(document).on('click', '.searchtabclick', function () {
		var obj = jQuery(this);
		var tabindex = obj.attr('tabindex');
		jQuery('#searchtab').val(tabindex);
	});
	//DASHBOARD QTTT
	if ($('#QTHT_TKxuatBan').length != 0) {
		/*QLTL_TTND*/
		Highcharts.chart('QTHT_TKxuatBan', {
			chart: {
				plotBackgroundColor: null,
				plotBorderWidth: null,
				plotShadow: false,
				type: 'pie',
				height: '380px',
			},
			title: {
				text: 'THỐNG KÊ ĐĂNG KÝ HỒ SƠ',
			},
			// colors: ['#8cc474', '#df5138'],
			tooltip: {
				pointFormat: '<b>{point.percentage:.2f}%</b>',
			},
			plotOptions: {
				pie: {
					allowPointSelect: true,
					cursor: 'pointer',
					dataLabels: {
						enabled: true,
						format: '{point.percentage:.2f} %',
						distance: -50,
						filter: {
							property: 'percentage',
							operator: '>',
							value: 4,
						},
					},
					showInLegend: true,
				},
			},
			legend: {
				alignColumns: false,
				maxHeight: 60,
			},
			series: [
				{
					name: 'Brands',
					colorByPoint: true,

					data: [
						{ name: 'Đăng ký mới', y: 20 },
						{ name: 'Đã đăng ký', y: 20 },
						{ name: 'Hồ sơ thiếu', y: 10 },
						{ name: 'Hồ sơ không hợp lệ', y: 10 },
						{ name: 'Hồ sơ quá hạn', y: 10 },
						{ name: 'Hồ sơ gần đến hạn', y: 20 },
						{ name: 'Hồ sơ hoàn thành', y: 10 },
					],
				},
			],
		});
	}

	if ($('#QTHT_TKkiemDuyet').length != 0) {
		/*QLTL_TTND*/
		Highcharts.chart('QTHT_TKkiemDuyet', {
			chart: {
				plotBackgroundColor: null,
				plotBorderWidth: null,
				plotShadow: false,
				type: 'pie',
				height: '380px',
			},
			title: {
				text: 'THỐNG KÊ KIỂM DUYỆT',
			},
			colors: ['#8cc474', '#df5138'],
			tooltip: {
				pointFormat: '<b>{point.percentage:.2f}%</b>',
			},
			plotOptions: {
				pie: {
					allowPointSelect: true,
					cursor: 'pointer',
					dataLabels: {
						enabled: true,
						format: '{point.percentage:.2f} %',
						distance: -50,
						filter: {
							property: 'percentage',
							operator: '>',
							value: 4,
						},
					},
					showInLegend: true,
				},
			},
			legend: {
				alignColumns: false,
				maxHeight: 60,
			},
			series: [
				{
					name: 'Brands',
					colorByPoint: true,

					data: [
						{ name: 'Thông thường', y: 50 },
						{ name: 'Quan trọng', y: 50 },
					],
				},
			],
		});
	}
	$(document).click(function (e) {
		if (e.target.className.indexOf('form-control1') == -1) {
			$('.btnHover').addClass('hidden');
		}
	});
	jQuery(document).on('click', '.FixHover', function (e) {
		$('.btnHover').addClass('hidden');
		$(this).closest('div').find('.btnHover').removeClass('hidden');
	});

	if ($('#QTHT_TKgiaiQuyet').length != 0) {
		/*QLTL_TTND*/
		Highcharts.chart('QTHT_TKgiaiQuyet', {
			chart: {
				plotBackgroundColor: null,
				plotBorderWidth: null,
				plotShadow: false,
				type: 'pie',
				height: '380px',
			},
			title: {
				text: 'THỐNG KÊ GIẢI QUYẾT HỒ SƠ',
			},
			// colors: ['#8cc474', '#df5138'],
			tooltip: {
				pointFormat: '<b>{point.percentage:.2f}%</b>',
			},
			plotOptions: {
				pie: {
					allowPointSelect: true,
					cursor: 'pointer',
					dataLabels: {
						enabled: true,
						format: '{point.percentage:.2f} %',
						distance: -50,
						filter: {
							property: 'percentage',
							operator: '>',
							value: 4,
						},
					},
					showInLegend: true,
				},
			},
			legend: {
				alignColumns: false,
				maxHeight: 60,
			},
			series: [
				{
					name: 'Brands',
					colorByPoint: true,
					data: [
						{ name: 'Hồ sơ mới', y: 20 },
						{ name: 'Hồ sơ thiếu', y: 30 },
						{ name: 'Hồ sơ không hợp lệ', y: 10 },
						{ name: 'Hồ sơ quá hạn', y: 5 },
						{ name: 'Hồ sơ gần đến hạn', y: 15 },
						{ name: 'Hồ sơ hoàn thành', y: 10 },
					],
				},
			],
		});
	}

	jQuery(document).on('click', '.dataFilter_Dropdown .dropdown-toggle', function () {
		setTimeout(function () {
			jQuery(this).parents('.dataFilter_Dropdown').toggleClass('open');
			jQuery(this).parents('.quickSearch ').find('.dataFilter_Dropdown_target').toggleClass('open');
		}, 1000);
	});
	jQuery(document).on('click', '.dataFilter_Dropdown_close', function (e) {
		e.preventDefault();
		jQuery(this).parents('.quickSearch').find('.dataFilter_Dropdown').toggleClass('open');
		jQuery(this).parents('.quickSearch').find('.dataFilter_Dropdown_target').toggleClass('open');
	});
	$('.useSortable').sortable();
	$('.useSortable').disableSelection();

	/* Calendar js */
	/* initialize the external events
            -----------------------------------------------------------------*/
});

function list_gen(container, resize, n, width) {
	container.find('.more_slide_item.curent_slide').last().nextAll().addClass('temp_next');
	container.find('.more_slide_item.temp_next').css('opacity', '.01');
	var temp_next_length = container.find('.more_slide_item.temp_next').length;
	var next_index = container.children('.more_slide').children('.more_slide_item').index(container.children('.more_slide').children('.more_slide_item.temp_next').first());
	if (!container.attr('data-first-index') && resize != 'resize') {
		container.attr('data-first-index', next_index);
	} else if (container.attr('data-first-index') && resize == 'resize') {
		container.attr('data-first-index', next_index);
	}
	var first_index = container.attr('data-first-index');
	container.find('.more_slide_next').attr('data-index', next_index);
	container.find('.more_slide_prev').attr('data-index', n - first_index);
	if (temp_next_length != 0) {
		container.find('.more_slide_next').show();
		container.find('.next_count').html('+' + temp_next_length);
	} else {
		container.find('.more_slide_next').hide();
	}
	container.find('.more_slide_item.curent_slide').first().prevAll().addClass('temp_prev');
	container.find('.more_slide_item.temp_prev').css('opacity', '.01');
	var temp_prev_length = container.find('.more_slide_item.temp_prev').length;
	if (temp_prev_length != 0) {
		container.find('.more_slide_prev').show();
		container.find('.prev_count').html('+' + temp_prev_length);
	} else {
		container.find('.more_slide_prev').hide();
	}
	var translate_x = 0;
	for (i = 0, len = temp_prev_length; i < len; i++) {
		translate_x = translate_x + parseInt(container.find('.more_slide_item.temp_prev').eq(i).attr('data-width'));
	}
	var curent_x = 0;
	for (i = 0, len = container.find('.more_slide_item.curent_slide').length; i < len; i++) {
		curent_x = curent_x + parseInt(container.find('.more_slide_item.curent_slide').eq(i).attr('data-width'));
	}
	var half_x = 0;
	if (temp_next_length != 0 || temp_prev_length != 0) {
		half_x = (width - curent_x) / 2;
	}
	container.children('.more_slide').css('transform', 'translateX(' + -(translate_x - half_x) + 'px)');
}
function list_pagi(n, resize) {
	var width = 0,
		more_slide_width = 0,
		item_width = 0,
		page_width = 0,
		next_count = 0;
	jQuery(document)
		.find('.useMoreSlide')
		.each(function () {
			var target = $('#' + $(this).attr('data-target'));
			target.attr('data-width', target.outerWidth(true));
			target.children('.more_slide').attr('data-width', target.children('.more_slide').outerWidth(true));
			target.find('.more_slide_item').each(function () {
				$(this).attr('data-width', $(this).outerWidth(true));
			});
			width = parseInt(target.attr('data-width'));
			more_slide_width = parseInt(target.children('.more_slide').attr('data-width'));
			target.find('.more_slide_item').removeClass('temp_prev');
			target.find('.more_slide_item').removeClass('temp_next');
			target.find('.more_slide_item').removeClass('curent_slide');
			var length = target.find('.more_slide_item').length;
			for (i = n, len = length; i < len; i++) {
				item_width = parseInt(target.find('.more_slide_item').eq(i).attr('data-width'));
				if (page_width + item_width < width) {
					page_width = page_width + item_width;
					target.find('.more_slide_item').eq(i).addClass('curent_slide');
					target.find('.more_slide_item').eq(i).css('opacity', '1');
					if (i == len - 1) {
						list_gen(target, resize, n, width);
					}
				} else {
					list_gen(target, resize, n, width);
					break;
				}
			}
		});
}

$(window).bind('load', function () {
	if (jQuery(document).find('.useScrollBar').is(':visible')) {
		Utils.updateScrollBar($('.useScrollBar'));
	}
	$('select.selectpicker').selectpicker();

	if ($(document).find('input[class*="autocomplete"]').length != 0) {
		$(document)
			.find('input[class*="autocomplete"]')
			.each(function () {
				jQuery(this).attr('autocomplete', 'new-password');
			});
	}

	if ($('[data-fancybox]').length != 0) {
		$('[data-fancybox]').fancybox({
			margin: [44, 0, 22, 0],
			loop: true,
			buttons: [
				'zoom',
				//"share",
				//"slideShow",
				'fullScreen',
				'download',
				//"thumbs",
				'close',
			],
		});
	}
	$('.jobFile_Fancybox').click(function () {
		$(this).parents('.jobFile_Attach').find('.jobFile_Name').click();
	});

	$(document)
		.find('.dataTables_wrapper .table:not(.useTreegrid)')
		.each(function () {
			if (!$(this).hasClass('stacktable_inited') && !$(this).hasClass('not_js_responsive')) {
				$(this).addClass('stacktable_inited');
				$(this).stacktable();
			}
		});
	Cust.fileViewer_height_fn();
	Cust.newsfeedimg();
	Cust.Scroll_table();
	Cust.Table_sort();
	Cust.gotoStep();

	jQuery(document).on('change', '.select_change', function (e) {
		var select = jQuery(this);
		var id = select.val();
		var idService = null;
		if (jQuery("input[name='ID']").val()) {
			idService = jQuery("input[name='ID']").val();
		} else if (jQuery("input[name='IDService']").val()) {
			idService = jQuery("input[name='IDService']").val();
		}
		var url = select.attr('data-url');
		var target = select.attr('data-target');
		if (select.hasClass('bootstrap-select') || url == undefined || url == '') {
			return false;
		}
		jQuery.ajax({
			type: 'POST',
			async: true,
			url: url,
			data: {
				id: id,
				IdService: idService,
			},
			beforeSend: function () {
				jQuery(target).addClass('loading').html('');
			},
			complete: function () {
				jQuery(target).removeClass('loading');
			},
			error: function () {
				jQuery(target).removeClass('loading');
			},
			dataType: 'json',
			success: function (data) {
				Utils.sectionBuilder(data);
				if (data.hasOwnProperty('isCust')) {
					jQuery(target).html(data.htCust);
				}
				$(target).find('.selectpicker').selectpicker({
					showTick: true,
				});
				if ($(target).prop('tagName').toLowerCase() == 'select') {
					$(target).closest('form,.form').find('.selectpicker').selectpicker('refresh');
				}
				$(target)
					.find('select.autoSelect2 ')
					.not('.select2-hidden-accessible')
					.each(function () {
						$(this).select2();
					});
				if ($(target).hasClass('change_compare_svtype') || $(target).hasClass('cust_select_change')) {
					$(target).trigger('change');
				}
			},
			error: function (XMLHttpRequest, textStatus, errorThrown) {},
		});
	});
	jQuery(document).on('change', '.select_change_global', function (e) {
		var select = jQuery(this);
		var id = select.val();
		var url = select.attr('data-url');
		var target = select.attr('data-target');
		if (select.hasClass('bootstrap-select')) {
			return false;
		}
		jQuery.ajax({
			type: 'POST',
			contentType: 'application/json; charset=utf-8',
			async: true,
			url: url,
			data: JSON.stringify({
				id: id,
			}),
			beforeSend: function () {
				jQuery(target).addClass('loading').html('');
			},
			complete: function () {
				jQuery(target).removeClass('loading');
			},
			error: function () {
				jQuery(target).removeClass('loading');
			},
			dataType: 'json',
			success: function (data) {
				Utils.sectionBuilder(data);
				if (data.hasOwnProperty('isCust')) {
					jQuery(target).html(data.htCust);
				}
				$(target).find('.selectpicker').selectpicker({
					showTick: true,
				});
			},
			error: function (XMLHttpRequest, textStatus, errorThrown) {},
		});
	});
	jQuery(document).on('change', '.selected_Changed', function (e) {
		var select = jQuery(this);
		var id = select.val();
		var IDWorkflowStep = select.attr('data-param2');
		var params = select.attr('data-param');
		var url = select.attr('data-url');
		var target = select.attr('data-target');
		if (select.hasClass('bootstrap-select')) {
			return false;
		}
		jQuery.ajax({
			type: 'POST',
			async: true,
			url: url,
			data: {
				id: id,
				param: params,
				IDWorkflowStep: IDWorkflowStep,
			},
			beforeSend: function () {
				jQuery(target).addClass('loading').html('');
			},
			complete: function () {
				jQuery(target).removeClass('loading');
			},
			error: function () {
				jQuery(target).removeClass('loading');
			},
			success: function (data) {
				Utils.sectionBuilder(data);
				if (data.hasOwnProperty('isCust')) {
					jQuery(target).html(data.htCust);
				}
			},
			error: function (XMLHttpRequest, textStatus, errorThrown) {},
		});
	});

	//Cập nhật text box theo giá trị text box khác
	jQuery(document).on('changed.bs.select', '.selected_change_Custom', function (e) {
		alert(1);
		e.stopPropagation();
		var select = jQuery(this);
		var url = select.attr('data-url');
		var target = select.attr('data-target');
		if (select.hasClass('bootstrap-select')) {
			return false;
		}
		jQuery.ajax({
			type: 'POST',
			async: true,
			url: url,
			data: {
				IDType: select.val() || 0,
				id: select.val() || 0,
			},
			beforeSend: function () {
				jQuery(target).addClass('loading').html('');
			},
			complete: function () {
				jQuery(target).removeClass('loading');
			},
			error: function () {
				jQuery(target).removeClass('loading');
			},
			success: function (data) {
				Utils.sectionBuilder(data);
				if (data.hasOwnProperty('isCust')) {
					jQuery(target).html(data.htCust);
					jQuery('.selectpicker').selectpicker('refresh');
				}
			},
			error: function (XMLHttpRequest, textStatus, errorThrown) {},
		});
	});

	jQuery(document).on('change', '.selected_change_S', function (e) {
		e.stopPropagation();
		var select = jQuery(this);
		var url = select.attr('data-url');
		var target = select.attr('data-target');
		if (select.hasClass('bootstrap-select')) {
			return false;
		}
		jQuery.ajax({
			type: 'POST',
			async: true,
			url: url,
			data: {
				IDType: select.val() || 0,
				id: select.val() || 0,
			},
			beforeSend: function () {
				jQuery(target).addClass('loading').html('');
			},
			complete: function () {
				jQuery(target).removeClass('loading');
			},
			error: function () {
				jQuery(target).removeClass('loading');
			},
			success: function (data) {
				Utils.sectionBuilder(data);
				if (data.hasOwnProperty('isCust')) {
					jQuery(target).html(data.htCust);
					jQuery('.selectpicker').selectpicker('refresh');
				}
			},
			error: function (XMLHttpRequest, textStatus, errorThrown) {},
		});
	});

	jQuery(document).on('change', '.select_Employee', function (e) {
		var select = jQuery(this);
		var id = select.val();
		var child = select.find('select').val();
		var url = select.find('select').attr('data-url');
		var target = select.find('select').attr('data-target');
		jQuery.ajax({
			type: 'POST',
			async: false,
			url: url,
			data: { Ids: child },
			beforeSend: function () {
				jQuery(target).addClass('loading').html('');
			},
			complete: function () {
				jQuery(target).removeClass('loading');
			},
			error: function () {
				jQuery(target).removeClass('loading');
			},
			dataType: 'json',
			success: function (data) {
				Utils.sectionBuilder(data);
				if (data.hasOwnProperty('isCust')) {
					jQuery(target).html(data.htCust);
					Utils.updateScrollBar(jQuery(target));
				}
				// $('.autoSelect2').select2();
			},
			error: function (XMLHttpRequest, textStatus, errorThrown) {},
		});
	});
	$('.toggle_notifications').on('click', function () {
		if (!$(this).hasClass('inited')) {
			$(this).addClass('inited');
			var Ntf_less_count = 0;
			jQuery(document)
				.find('#NtfContainer')
				.find('.user_item')
				.each(function () {
					Ntf_less_count = Ntf_less_count + 1;
					var obj = $(this);
					obj.find('.user_item_info > em').attr('id', 'Ntf_less_' + Ntf_less_count);
					var elm = document.getElementById('Ntf_less_' + Ntf_less_count);
					if (elm.offsetHeight < elm.scrollHeight) {
						obj.find('.user_item_info > em').addClass('active');
						obj.find('.user_item_info > em').append('<a class="icon_show_full_content" href="#" alt="Xem đầy đủ nội dung" title="Xem đầy đủ nội dung"><i class="fa fa-plus-square" aria-hidden="true"></i></a>');
					}
				});
		}
	});
	jQuery(document).on('click', '#NtfContainer .icon_show_full_content', function (e) {
		e.preventDefault();
		$(this).parent('em').toggleClass('open');
	});
	//Header right dropdown menu
	$('.header_mainMenu').on('show.bs.dropdown', function () {
		var length = $(this).find('.dropdown-notifications>li').length;
		if (!$(this).hasClass('inited') && length > 5) {
			$(this).addClass('inited');
			$(this).addClass('is_full');
			$(this).parents('.account-area').addClass('is_full');
		}
	});
	//Header left menu when sidebar is empty
	if (!$('.page-sidebar').size() == 0) {
		$('#sidebar-collapse').addClass('is_show');
	}

	/*---------- CHART ------------*/
	// Thống kê công việc cty
	if ($('#QLCVtkeCty').length > 0) {
		Highcharts.chart('QLCVtkeCty', {
			chart: {
				type: 'column',
			},

			title: {
				text: 'THỐNG KÊ CÔNG VIỆC CTY',
			},
			colors: ['#53a93f', '#57b5e3', '#cccccc'],

			xAxis: {
				categories: ['Tổng số công việc', 'Tháng 2', 'Tháng 3'],
			},

			yAxis: {
				allowDecimals: false,
				min: 0,
				title: {
					text: '',
				},
			},

			tooltip: {
				formatter: function () {
					return '<b>' + this.x + '</b><br/>' + this.series.name + ': ' + this.y + '<br/>' + 'Tổng: ' + this.point.stackTotal;
				},
			},

			plotOptions: {
				column: {
					stacking: 'normal',
				},
				series: {
					pointWidth: 30,
				},
			},

			series: [
				{
					name: 'Hoàn Thành',
					data: [34, 7, 2],
					stack: 'male',
				},
				{
					name: 'Đang xử lý',
					data: [19, 12, 0],
					stack: 'male',
				},
				{
					name: 'Chưa xử lý',
					data: [138, 44, 8],
					stack: 'male',
				},
			],
		});
	}

	// Thống kê công việc Pban
	if ($('#QLCVtkePban').length > 0) {
		Highcharts.chart('QLCVtkePban', {
			chart: {
				type: 'column',
			},
			title: {
				text: 'THỐNG KÊ CÔNG VIỆC PHÒNG BAN',
			},
			colors: ['#53a93f', '#57b5e3', '#cccccc'],
			xAxis: {
				categories: ['Tổng số công việc', 'Tháng 2', 'Tháng 3'],
			},
			yAxis: {
				allowDecimals: false,
				min: 0,
				title: {
					text: '',
				},
			},
			tooltip: {
				formatter: function () {
					return '<b>' + this.x + '</b><br/>' + this.series.name + ': ' + this.y + '<br/>' + 'Tổng: ' + this.point.stackTotal;
				},
			},
			plotOptions: {
				column: {
					stacking: 'normal',
				},
				series: {
					pointWidth: 30,
				},
			},
			series: [
				{
					name: 'Hoàn Thành',
					data: [34, 7, 2],
					stack: 'male',
				},
				{
					name: 'Đang xử lý',
					data: [19, 12, 0],
					stack: 'male',
				},
				{
					name: 'Chưa xử lý',
					data: [138, 44, 8],
					stack: 'male',
				},
			],
		});
	}

	// Thống kê công việc NV
	if ($('#QLCVtkeNV').length > 0) {
		Highcharts.chart('QLCVtkeNV', {
			chart: {
				type: 'column',
			},

			title: {
				text: 'THỐNG KÊ CÔNG VIỆC NHÂN VIÊN',
			},
			colors: ['#53a93f', '#57b5e3', '#cccccc'],

			xAxis: {
				categories: ['Tổng số công việc', 'Tháng 2', 'Tháng 3'],
			},

			yAxis: {
				allowDecimals: false,
				min: 0,
				title: {
					text: '',
				},
			},

			tooltip: {
				formatter: function () {
					return '<b>' + this.x + '</b><br/>' + this.series.name + ': ' + this.y + '<br/>' + 'Tổng: ' + this.point.stackTotal;
				},
			},

			plotOptions: {
				column: {
					stacking: 'normal',
				},
				series: {
					pointWidth: 30,
				},
			},

			series: [
				{
					name: 'Hoàn Thành',
					data: [10, 6, 2],
					stack: 'male',
				},
				{
					name: 'Đang xử lý',
					data: [4, 2, 0],
					stack: 'male',
				},
				{
					name: 'Chưa xử lý',
					data: [75, 14, 3],
					stack: 'male',
				},
			],
		});
	}
	//-QLCVcmt
	if ($('#QLCVcmtCty').length > 0) {
		Highcharts.chart('QLCVcmtCty', {
			chart: {
				plotBackgroundColor: null,
				plotBorderWidth: null,
				plotShadow: false,
				type: 'pie',
			},
			title: {
				text: 'THỐNG KÊ ĐÁNH GIÁ CÔNG VIỆC CTY',
			},
			colors: ['#53a93f', '#57b5e3', '#d73d32', '#cccccc'],
			tooltip: {
				pointFormat: '<b>{point.percentage:.2f}%</b>',
			},
			plotOptions: {
				pie: {
					allowPointSelect: true,
					cursor: 'pointer',
					dataLabels: {
						enabled: true,
						format: '{point.percentage:.2f} %',
						distance: -50,
						filter: {
							property: 'percentage',
							operator: '>',
							value: 4,
						},
					},
					showInLegend: true,
				},
			},
			series: [
				{
					name: 'Brands',
					colorByPoint: true,

					data: [
						{ name: 'Xuất sắc', y: 10 },
						{ name: 'Đạt', y: 20 },
						{ name: 'Không đạt', y: 10 },
						{ name: 'Chưa xác định', y: 60 },
					],
				},
			],
		});
	}
	//-QLCVcmt
	if ($('#QLCVcmtPban').length > 0) {
		Highcharts.chart('QLCVcmtPban', {
			chart: {
				plotBackgroundColor: null,
				plotBorderWidth: null,
				plotShadow: false,
				type: 'pie',
			},
			title: {
				text: 'THỐNG KÊ ĐÁNH GIÁ CÔNG VIỆC PHÒNG BAN',
			},
			colors: ['#53a93f', '#57b5e3', '#d73d32', '#cccccc'],
			tooltip: {
				pointFormat: '<b>{point.percentage:.2f}%</b>',
			},
			plotOptions: {
				pie: {
					allowPointSelect: true,
					cursor: 'pointer',
					dataLabels: {
						enabled: true,
						format: '{point.percentage:.2f} %',
						distance: -50,
						filter: {
							property: 'percentage',
							operator: '>',
							value: 4,
						},
					},
					showInLegend: true,
				},
			},
			series: [
				{
					name: 'Brands',
					colorByPoint: true,

					data: [
						{ name: 'Xuất sắc', y: 10 },
						{ name: 'Đạt', y: 20 },
						{ name: 'Không đạt', y: 10 },
						{ name: 'Chưa xác định', y: 60 },
					],
				},
			],
		});
	}

	//-QLCVcmt
	if ($('#QLCVcmtTTuc').length > 0) {
		Highcharts.chart('QLCVcmtTTuc', {
			chart: {
				type: 'line',
			},
			title: {
				text: 'THỐNG KÊ GIẢI QUYẾT THỦ TỤC',
			},
			subtitle: {
				text: '',
			},
			xAxis: {
				categories: ['Tháng 1', 'Tháng 2', 'Tháng 3', 'Tháng 4', 'Tháng 5', 'Tháng 6', 'Tháng 7', 'Tháng 8', 'Tháng 9', 'Tháng 10', 'Tháng 11', 'Tháng 12'],
			},
			yAxis: {
				title: {
					text: '',
				},
			},
			plotOptions: {
				line: {
					dataLabels: {
						enabled: true,
					},
					enableMouseTracking: false,
				},
			},
			series: [
				{
					name: 'Hồ sơ mới',
					data: [43934, 52503, 57177, 69658, 97031, 119931, 137133, 154175, 97031, 119931, 137133, 154175],
				},
				{
					name: 'Hồ sơ quá hạn',
					data: [24916, 24064, 29742, 29851, 32490, 30282, 38121, 40434, 24916, 24064, 29742, 29851],
				},
				{
					name: 'Hồ sơ đã hoàn thành',
					data: [11744, 17722, 16005, 19771, 20185, 24377, 32147, 39387, 16005, 19771, 20185, 24377],
				},
			],
			colorAxis: {
				gridLineColor: '#ffffff',
				maxColor: '#e91e63',
				lineColor: '#ccd6eb',
				minorTickColor: '#999999',
			},
			pane: {
				background: [],
			},
			colors: ['#5bc0de', '#d9534f', '#5cb85c'],
		});
	}

	//-QLCVcmt
	if ($('#QLCVcmtCty').length > 0) {
		Highcharts.chart('QLCVcmtTTin', {
			chart: {
				plotBackgroundColor: null,
				plotBorderWidth: null,
				plotShadow: false,
				type: 'pie',
			},
			title: {
				text: 'MỨC ĐỘ THÔNG TIN THỦ TỤC',
			},
			colors: ['#ccc', '#ffce55'],
			tooltip: {
				pointFormat: '<b>{point.percentage:.2f}%</b>',
			},
			plotOptions: {
				pie: {
					allowPointSelect: true,
					cursor: 'pointer',
					dataLabels: {
						enabled: true,
						format: '{point.percentage:.2f} %',
						distance: -50,
						filter: {
							property: 'percentage',
							operator: '>',
							value: 4,
						},
					},
					showInLegend: true,
				},
			},
			series: [
				{
					name: 'Brands',
					colorByPoint: true,

					data: [
						{ name: 'Thông thường', y: 50 },
						{ name: 'Quan trọng', y: 50 },
					],
				},
			],
		});
	}

	//-QLCVcmt
	if ($('#QLCVcmtCty').length > 0) {
		Highcharts.chart('QLCVcmtSTTuc', {
			chart: {
				plotBackgroundColor: null,
				plotBorderWidth: null,
				plotShadow: false,
				type: 'pie',
			},
			title: {
				text: 'SỐ THỦ TỤC',
			},
			colors: ['#70CEFC', '#6CC258'],
			tooltip: {
				pointFormat: '<b>{point.percentage:.2f}%</b>',
			},
			plotOptions: {
				pie: {
					allowPointSelect: true,
					cursor: 'pointer',
					dataLabels: {
						enabled: true,
						format: '{point.percentage:.2f} %',
						distance: -50,
						filter: {
							property: 'percentage',
							operator: '>',
							value: 4,
						},
					},
					showInLegend: true,
				},
			},
			series: [
				{
					name: 'Brands',
					colorByPoint: true,

					data: [
						{ name: 'Đã đăng ký', y: 50 },
						{ name: 'Đã giải quyết', y: 50 },
					],
				},
			],
		});
	}

	if ($('#QLCVcmtNV').length != 0) {
		//-QLCVcmt
		Highcharts.chart('QLCVcmtNV', {
			chart: {
				plotBackgroundColor: null,
				plotBorderWidth: null,
				plotShadow: false,
				type: 'pie',
			},
			title: {
				text: 'THỐNG KÊ ĐÁNH GIÁ CÔNG VIỆC NHÂN VIÊN',
			},
			colors: ['#53a93f', '#57b5e3', '#d73d32', '#cccccc'],
			tooltip: {
				pointFormat: '<b>{point.percentage:.2f}%</b>',
			},
			plotOptions: {
				pie: {
					allowPointSelect: true,
					cursor: 'pointer',
					dataLabels: {
						enabled: true,
						format: '{point.percentage:.2f} %',
						distance: -50,
						filter: {
							property: 'percentage',
							operator: '>',
							value: 4,
						},
					},
					showInLegend: true,
				},
			},
			series: [
				{
					name: 'Brands',
					colorByPoint: true,

					data: [
						{ name: 'Xuất sắc', y: 10 },
						{ name: 'Đạt', y: 20 },
						{ name: 'Không đạt', y: 10 },
						{ name: 'Chưa xác định', y: 60 },
					],
				},
			],
		});
	}
});
//--WINDOW LOADED FUNCTION END
if (jQuery('.selectpicker').is(':visible')) {
	$('.selectpicker').selectpicker({
		showTick: true,
	});
}

jQuery('.cmt_divTarget').click(function (e) {
	e.preventDefault();
	var elem = $('.module_cmt');
	if (elem.length && elem.position().top) {
		$('.job_search_quickview_content').animate({ scrollTop: elem.position().top }, { duration: 100, easing: 'swing' });
		jQuery('.cmt-content > .form-control').focus();
	}
});
$('.js_sort_select .selectpicker').on('changed.bs.select', function (e) {
	var val = 'Sắp xếp theo ' + jQuery(this).selectpicker('val').toLowerCase();
	jQuery('.js_sort_order > .clickSort > .sr-only').text(val);
});
jQuery('.display_job_search_list').click(function () {
	jQuery('.job_search_list').toggleClass('active');
});

$('.jSearch_tree').treegrid({
	initialState: 'collapsed',
	saveState: true,
});

//$(document).on("change", ".CrWorkflowServiceForm", function () {
//        var value = $(this).val();
//        var stepExecutor = jQuery(this).closest(".task-container").find("input[name='StepExecutor']").val();

//        var target = jQuery(this).closest("div").siblings("div" + $(this).data("target"));
//        console.log(stepExecutor);
//        $.ajax({
//            type: "POST",
//            url: Utils.getDomain() + "/" + Cdata.VirtualPath + "/service/FilterCreateForm.html",
//            async: true,
//            data: {
//                id: value,
//                rand: stepExecutor
//            },
//            beforeSend: function () {
//                jQuery(target).addClass("loading").html("")
//            },
//            complete: function () {
//                jQuery(target).removeClass("loading");
//            },
//            error: function () {
//                jQuery(target).removeClass("loading");
//            },
//            success: function (data) {
//                $(target).children().remove();
//                if (data.hasOwnProperty("isCust")) {
//                    jQuery(target).html(data.htCust);
//                }
//            }
//        });
// });

/*-----Orks-----*/
/*QLTL_TTND*/
if ($('.chart').length != 0) {
	$(function () {
		$('.chart').easyPieChart({
			//your options goes here
		});
	});
}
