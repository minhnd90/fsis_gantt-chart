var Main = {
    init: function () {
        Main.onEvent();
        Main.upEvent();
        Main.initChart();
        Main.backLink();
        Main.setRefresh();
    },
    upEvent: function (container) {
        if (Utils.isEmpty(container))
            container = jQuery(document);

        container.find(".useSlider").each(function () {
            var obj = $(this);
            var SliderBar = obj.find(".SliderBar");
            var useSlider_percent = obj.find(".useSlider_percent");
            var SliderPercent = obj.find(".SliderPercentCount");
            var percentCompleted = obj.attr("data-percent-completed");
            var urlchange = obj.attr('data-urlchange');
            var id = obj.attr('data-id');
            SliderBar.noUiSlider({
                range: [0, 100],
                start: percentCompleted,
                step: 1,
                handles: 1,
                connect: "lower",
                serialization: {
                    resolution: 1,
                    to: [SliderPercent, 'html']
                }
            }).on('change', function (value, handler) {
                var value = jQuery(this).val();
                var data = {};
                data.ID = id;
                data.OldPercentCompleted = percentCompleted;
                if (percentCompleted != value) {
                    data.PercentCompleted = value;
                    jQuery.ajax({
                        type: "POST",
                        async: true,
                        url: urlchange,
                        data: data,
                        beforeSend: function () {
                        },
                        complete: function () {
                        },
                        error: function () {
                        },
                        success: function (response) {
                            location.reload();
                        }
                    });
                }
            });
            useSlider_percent.show();
        });

        container.find(".useDragable").draggable({
            cursorAt: { left: 5 }
        });
        //Cust.dataTables_filter_col();
        container.find('.dataTables_wrapper .table:not(.useTreegrid)').each(function () {
            if (!$(this).hasClass("stacktable_inited") && !$(this).hasClass("not_js_responsive")) {
                $(this).addClass("stacktable_inited");
                $(this).stacktable();
            }
        });
        var selects = container.find(".selectpicker");
        if (selects.length > 0) {
            selects.each(function () {
                var s = jQuery(this);
                if (!s.hasClass("inited")) {
                    s.selectpicker();
                    s.addClass("inited")
                }

            });
        }
        container.find(".useTableFix").each(function () {
            try {
                var left = $(this).attr("data-fix-left");
                var right = $(this).attr("data-fix-right");

                if (!$(this).hasClass("table_fix_inited")) {
                    $(this).tableHeadFixer({
                        "left": left,
                        "right": right
                    });
                    $(this).addClass("table_fix_inited");
                }
            } catch (e) {

            }
        });
        container.find(".editorSummernote").each(function () {
            if (!jQuery(this).hasClass("setSummernote")) {

                var summer = jQuery(this);
                jQuery(this).addClass("setSummernote").summernote({
                    height: '200px',
                    onpaste: function (e) {
                        var bufferText = ((e.originalEvent || e).clipboardData || window.clipboardData).getData('Text');

                        e.preventDefault();
                        if (bufferText) {
                            while (bufferText.indexOf("") != -1) {
                                bufferText = bufferText.replace("", "");
                            }
                            while (bufferText.indexOf("") != -1) {
                                bufferText = bufferText.replace("", "");
                            }
                        }
                        document.execCommand('insertText', false, bufferText);
                    },
                    onChange: function (contents, $editable) {
                        // Note that at this point, the value of the `textarea` is not the same as the one
                        // you entered into the summernote editor, so you have to set it yourself to make
                        // the validation consistent and in sync with the value.
                        summer.val(summer.summernote('isEmpty') ? "" : contents);

                        // You should re-validate your element after change, because the plugin will have
                        // no way to know that the value of your `textarea` has been changed if the change
                        // was done programmatically.
                        Utils.summernoteValidator.element(summernoteElement);
                    }
                });
            }
        });
        container.find(".useTableFix").each(function () {
            var left = $(this).attr("data-fix-left");
            var right = $(this).attr("data-fix-right");

            if (!$(this).hasClass("table_fix_inited")) {
                $(this).tableHeadFixer({
                    "left": left,
                    "right": right
                });
                $(this).hasClass("table_fix_inited");
            }

        });
        container.find(".useTreegrid").each(function () {
            var column = jQuery(this).attr('data-column');
            if (column == undefined) {
                jQuery(this).treegrid();
            }
            else {
                jQuery(this).treegrid({
                    treeColumn: column,
                    initialState: 'collapsed'
                });
            }
        });
        container.find(".nestable").each(function () {
            if (!jQuery(this).hasClass("setNestabled")) {
                var obj = jQuery(this);
                var maxDepth = obj.attr("data-max-depth") || 0;
                obj.addClass("setNestabled").nestable({
                    maxDepth: maxDepth
                }).on('change', function (e) {

                    var ids = [];
                    var idTheme = obj.attr("data-theme-id");
                    var idRegion = obj.attr("data-region-id");
                    var idPage = obj.attr("data-page-id");
                    var url = obj.attr("data-url");
                    var data = obj.nestable('serialize');

                    for (var i in data) {
                        var item = data[i];
                        ids.push(item.id);
                    }
                    if (!Utils.isEmpty(url)) {
                        var dataPost = {};
                        if (obj.hasClass("regions")) {
                            dataPost = {
                                IDTheme: idTheme,
                                IDPage: idPage || 0,
                                IDRegions: JSON.stringify(ids)
                            };
                        }
                        else {
                            dataPost = {
                                IDTheme: idTheme,
                                IDRegion: idRegion,
                                IDPage: idPage || 0,
                                IDBlocks: JSON.stringify(ids)
                            };
                            console.table(dataPost);
                        }

                        jQuery.ajax({
                            type: "POST",
                            async: true,
                            url: url,
                            data: dataPost,
                            success: function (response) {
                                obj.closest(".ui-dialog").addClass("refresh");
                            }
                        });
                    }
                });
            }
        });

        container.find(".useSortable").each(function () {
            if (jQuery(this).hasClass("inited")) {
                jQuery(this).sortable("destroy");
            }
            jQuery(this).sortable({
                items: ".sortitem"
            });
        });
        container.find('.useRate').each(function () {
            var obj = jQuery(this);
            if (!obj.hasClass("inited")) {
                obj.addClass("inited").rating({
                    min: 0,
                    max: 5,
                    step: 1,
                    size: 'xs',
                    showClear: false,
                    hoverOnClear: false,
                    theme: 'krajee-svg'
                }).on("rating.change", function (event, value, caption) {

                    var data = obj.getDataUppername();
                    data.Rating = value;
                    jQuery.ajax({
                        type: "POST",
                        async: true,
                        url: data.Href,
                        data: data,
                        beforeSend: function () {
                        },
                        complete: function () {
                        },
                        error: function () {
                        },
                        success: function (response) {
                        }
                    });
                });
            }
        });
        container.find(".inputUpFileImport").each(function () {
            var obj = jQuery(this);
            if (!obj.hasClass("setUpFiled")) {
                obj.hasClass("setUpFiled");
                obj.ajaxUploader({
                    name: "FileDocument",
                    postUrl: Cdata.Storage.domain + "/uploader/upfile",
                    //elTarget: obj.attr("data-target"),
                    onBegin: function (e, t) {
                        return true;
                    },
                    onClientLoadStart: function (e, file, t) {
                    },
                    onClientProgress: function (e, file, t) {
                        jQuery(obj.attr("data-target")).addClass("loading");
                    },
                    onServerProgress: function (e, file, t) {
                        jQuery(obj.attr("data-target")).addClass("loading");
                    },
                    onClientAbort: function (e, file, t) {
                        jQuery(obj.attr("data-target")).removeClass("loading");
                    },
                    onClientError: function (e, file, t) {
                        jQuery(obj.attr("data-target")).removeClass("loading");
                    },
                    onServerAbort: function (e, file, t) {
                        jQuery(obj.attr("data-target")).removeClass("loading");
                    },
                    onServerError: function (e, file, t) {
                        jQuery(obj.attr("data-target")).removeClass("loading");
                    },
                    onSuccess: function (e, file, t, data) {
                        var dataObj = obj.getData();
                        jQuery.ajax({
                            type: "POST",
                            async: true,
                            url: dataObj.url,
                            data: data,
                            beforeSend: function () {
                                obj.addClass("loading-btn");
                            },
                            complete: function () {
                                obj.removeClass("loading-btn");
                            },
                            error: function () {
                                obj.removeClass("loading-btn");
                            },
                            success: function (response) {
                                Utils.sectionBuilder(response);
                                if (response.hasOwnProperty("isCust")) {
                                    jQuery(dataObj.target).html(response.htCust);
                                    if ($("#ConfirmImport").length != 0) {
                                        $("#ConfirmImport").removeClass("hidden");
                                    }
                                }
                                Utils.updateInputDate(jQuery(dataObj.target));
                                Utils.updateFormState(jQuery(dataObj.target));
                                Utils.updateScrollBar(jQuery(dataObj.target));
                                Autocomplete.init(jQuery(dataObj.target));
                                Main.upEvent(jQuery(dataObj.target));
                                //Utils.sectionBuilder(response);
                                //Utils.updateScrollBar(jQuery(".ui-dialog:visible"));
                            }
                        });

                        try {
                            var form = jQuery(dataObj.target).closest("form");
                            if (form.hasClass("bootstrapValidator")) {
                                form.bootstrapValidator('revalidateField', jQuery(dataObj.target).attr("data-bv-field"));
                            }
                        } catch (e) { }
                    }
                });
            }
        });
        container.find(".useMoney").each(function () {
            jQuery(this).simpleMoneyFormat();
        });

    },
    onEvent: function () {
        jQuery(document).on("change", ".datetime, .date, .timepicker", function (e) {
            try {
                var dateInput = jQuery(e.currentTarget);
                var form = dateInput.closest("form");
                if (form.hasClass("bootstrapValidator")) {
                    form.bootstrapValidator('revalidateField', dateInput.attr("name"));
                }
                if (dateInput.hasClass("changeRemindDate")) {

                    var inputStart = jQuery(dateInput.attr("data-rel-start"));
                    var inputEnd = jQuery(dateInput.attr("data-rel-end"));

                    var start_dateString = inputStart.val();
                    var start_args = start_dateString.split(" ");
                    var start_ddMMyyyy = start_args[0].split("-");
                    var start_HHmm = start_args[1].split(":");
                    var startDate = new Date(start_ddMMyyyy[2], parseInt(start_ddMMyyyy[1]) - 1, start_ddMMyyyy[0], start_HHmm[0], start_HHmm[1]);


                    var end_dateString = inputEnd.val();
                    var end_args = end_dateString.split(" ");
                    var end_ddMMyyyy = end_args[0].split("-");
                    var end_HHmm = end_args[1].split(":");

                    var endDate = new Date(end_ddMMyyyy[2], parseInt(end_ddMMyyyy[1]) - 1, end_ddMMyyyy[0], end_HHmm[0], end_HHmm[1]);
                    var totalDay = DateDiff.inDays(startDate, endDate);
                    if (totalDay >= 1) {

                        var inputRemind = jQuery(dateInput.attr("data-rel-remind"));
                        var remindDay = inputRemind.attr("data-remind-day");
                        var remindDate = endDate.addDays(-parseFloat(remindDay));
                        inputRemind.val(remindDate.toDateFormat("dd-MM-yyyy HH:mm"));
                    }
                    else {
                        var inputRemind = jQuery(dateInput.attr("data-rel-remind"));
                        var remindHour = inputRemind.attr("data-remind-hour");
                        var remindDate = endDate.addHours(-parseFloat(remindHour));
                        inputRemind.val(remindDate.toDateFormat("dd-MM-yyyy HH:mm"));
                    }
                }
                /// Nghĩa viết thêm 
                try {
                    var data = dateInput.getDataUppername();
                    var inputTarget = data.IdInputCompared;
                    var operator = data.Operator;
                    var messageErr = data.MessageErr;
                    if (!Utils.isEmpty(inputTarget)) {
                        if (!Utils.isEmpty(operator)) {
                            if (operator == 'greater-or-equal') {
                                var dateInputConvert = new Date(inputTarget.val());
                                var dateInputTargetConvert = new Date(inputTarget.val());
                                if (dateInputConvert < dateInputTargetConvert) {
                                    Utils.setError(messageErr);
                                }
                            }
                        }
                    }
                } catch (e) {
                    console.log(e);
                }
            } catch (e) {
                console.log(e);
            }
        });
        jQuery(document).on("click", ".close-flash", function () {
            jQuery(this).closest(".flash").fadeOut("fast");
            jQuery(this).closest(".flash").remove();
            Utils.flash_position();
        });
        jQuery(document).on("click", ".closeDialog", function () {
            Utils.closeOverlay(true);
        });
        jQuery(document).on("click", ".closeDlgr2", function () {
            var clicker = jQuery(this);
            var target = jQuery(clicker.attr("data-target"));
            var appender = jQuery(clicker.attr("data-append"));
            Utils.closeCDialog(target);
            appender.html(target);
        });
        jQuery(document).on("click", ".closeForm", function () {
            jQuery(this).closest("form").slideUp("fast");
        });
        jQuery(document).on("click", ".deleteItem", function () {
            var form = jQuery(this).closest("form");
            var field = jQuery(this).closest("[data-bv-field]");

            if (jQuery(this).hasClass("removeonselect")) {
                var addselector = jQuery(this).closest(".removeonselect").attr("data-add-selector");
                var valueoption = jQuery(this).closest(".item").attr("data-id");
                jQuery(addselector + ' option[value=' + valueoption + ']').remove();
            }
            jQuery(this).closest(".item").remove();
            try {
                var step = jQuery(field.data('step'));
                FlowChart.validateStep(step, false);
                if (form.hasClass("bootstrapValidator")) {
                    var fieldName = field.attr("name") || field.attr("data-bv-field");
                    if (fieldName) {
                        form.bootstrapValidator('revalidateField', fieldName);
                    }
                    else {
                        var bootstrapValidator = form.data('bootstrapValidator');
                        //bootstrapValidator.validate(true);
                        if (bootstrapValidator.isValid()) {
                            form.bootstrapValidator('disableSubmitButtons', false);
                        }
                    }
                }
            } catch (e) {
                console.log(e);
            }
        });
        jQuery(document).on("click", ".clickSort", function () {
            var data = jQuery(this).getData();
            window.location.href = Utils.getSorthref(data.sortname, data.sorttype == "1" ? 0 : 1);
            return false;
        });
        jQuery(document).on("click", ".copyHtml", function () {
            try {
                var data = jQuery(this).getDataUppername();
                var html = jQuery(data.Template).clone(false);
                html.removeClass("hidden");
                html.removeClass(data.Template.replace(".", "")).appendTo(jQuery(data.Target));
            } catch (e) {
            }
        });
        jQuery(document).find(".autoOpenDialog").each(function () {
            Utils.autoOpenDialog(jQuery(this));
        });

        jQuery(document).on("click", ".openEditor", function () {
            jQuery(".gEditor").removeClass("gEditorActive");

            var title = jQuery(this).attr("title");
            var text = jQuery(this).closest(".gEditor").addClass("gEditorActive").find(".fEditor").val();
            jQuery("#dialogEditor").find("textarea").val(text);
            jQuery("#dialogEditor").dialog({
                dialogClass: "dialogEditor",
                title: title,
                resizable: false,
                height: "auto",
                width: 800,
                open: function () {
                    Utils.openOverlay();
                },
                buttons: {
                    "Ok": function () {
                        jQuery(this).dialog("close");
                        jQuery(".gEditorActive").find(".fEditor").val(jQuery("#dialogEditor").find("textarea").val());
                    },
                    Cancel: function () {
                        jQuery(this).dialog("close");
                    }
                },
                close: function () {
                    Utils.closeOverlay();
                }
            });
        });
        jQuery(document).on("click", ".openDialog", function () {
            var data = jQuery(this).getData();
            var dialoger = jQuery(data.target);
            var maxH = jQuery(window).height();
            if (!dialoger.hasClass("ui-dialog-content")) {
                jQuery(".ui-dialog[aria-describedby='" + dialoger.attr("id") + "']").remove();
            }

            dialoger.dialog({
                width: data.width,
                resizable: false,
                open: function () {
                    if (maxH < dialoger.height()) {
                        dialoger.css("height", maxH - 50);
                    }
                    if (jQuery(this).data("remove-hidden") == "true") {
                        dialoger.removeClass("hidden");

                    }
                    if (typeof data.formTarget != 'undefined') {
                        dialoger.attr("data-target", data.formTarget);
                    }
                    if (typeof data.formInsertType != 'undefined') {
                        dialoger.attr("data-insert-type", data.formInsertType);
                    }
                    if (typeof data.formClass != 'undefined') {
                        dialoger.addClass(data.formClass);
                    }
                    if (dialoger.hasClass("uhf50d")) {
                        dialoger.closest(".ui-dialog").addClass("hf50d");
                    }
                    if (dialoger.hasClass("bootstrapValidator")) {
                        dialoger
                            .bootstrapValidator('disableSubmitButtons', false)
                            .bootstrapValidator('resetForm', true);
                        dialoger.reset();

                        if (dialoger.hasClass("quickSubmit") && dialoger.hasClass("bootstrapValidator")) {
                            dialoger.removeClass("bootstrapValidator").bootstrapValidator('destroy');
                            dialoger.unbind();
                        }
                    }

                    Utils.openOverlay();
                    Utils.updateFormState(dialoger);
                    Utils.updateScrollBar(dialoger);
                    Utils.updateIsNumber(dialoger);
                    Autocomplete.init(dialoger);

                    if (typeof data.id != 'undefined') {
                        dialoger.find("input[name='ID']").val(data.id);
                    }
                    if (typeof data.parentId != 'undefined') {
                        dialoger.find("input[name='Parent']").val(data.parentId);
                    }
                    if (typeof data.parentName != 'undefined') {
                        dialoger.find("input[name='ParentName']").val(data.parentName);
                    }
                },
                close: function () {
                    Utils.closeOverlay();
                }
            });
            return false;
        });
        jQuery(document).on("click", ".quickTree", function () {
            try {
                var obj = jQuery(this);
                var data = obj.getDataUppername();
                jQuery.ajax({
                    type: "POST",
                    async: true,
                    url: data.Url,
                    data: data,
                    beforeSend: function () {
                        obj.addClass("loading-btn");
                    },
                    complete: function () {
                        obj.removeClass("loading-btn");
                    },
                    error: function () {
                        obj.removeClass("loading-btn");
                    },
                    success: function (response) {
                        Utils.sectionBuilder(response);
                        Utils.updateScrollBar(jQuery(".ui-dialog:visible"));
                    }
                });
            } catch (e) {

            }
            return false;
        });
        jQuery(document).on("click", ".clickViewer", function () {
            var data = jQuery(this).getDataUppername();
            if (jQuery(this).hasClass("tabOpen")) {
                jQuery("[href='" + data.TabOpen + "']").trigger("click");
            }
            Utils.viewer(data);
            return false;
        });
        jQuery(document).on("click", ".tabitem", function () {
            var tab = jQuery(this).attr("data-tab");
            jQuery(this).parent().find(".tabitem").removeClass("active");
            var container = jQuery(this).addClass("active").closest(".group-tab");
            container.children(".tab-data").addClass("hidden");
            container.find(tab).removeClass("hidden");
        });
        jQuery(document).on('change', '.tickAllFormGroup', function () {
            var checked = jQuery(this).is(":checked");
            jQuery(this).closest(".form-group").find(".tickItem").prop("checked", checked);
        });
        jQuery(document).on('change', '.tickKey', function () {

            if (jQuery(this).prop("checked")) {
                var checkeds = jQuery(this).closest(".tickGroup").find(".tickItem").filter(":checked");
                if (checkeds.length == 0) {
                    jQuery(this).closest(".form-group").find(".tickItem").first().prop("checked", true);
                }
            } else {
                jQuery(this).closest(".form-group").find(".tickItem").prop("checked", false);
            }
        });
        jQuery(document).on('change', '.tickItem', function () {

            if (jQuery(this).prop("checked")) {
                jQuery(this).closest(".tickGroup").find(".tickKey").prop("checked", true);
            } else {
                var checkeds = jQuery(this).closest(".tickGroup").find(".tickItem").filter(":checked");
                jQuery(this).closest(".form-group").find(".tickKey").first().prop("checked", checkeds.length != 0);
            }
            var field = jQuery(this).closest("[data-bv-field]");
            var step = jQuery(field.data('step'));
            FlowChart.validateStep(step, false);
            if (jQuery(this).hasClass("toogleSelect")) {
                var target = jQuery(this).attr("data-target");
                var tgz = jQuery(target);
                if (jQuery(this).is(':checked')) {
                    tgz.removeClass('hidden');
                    tgz.find('select').selectpicker();
                }
                else {
                    tgz.addClass('hidden');
                }
            }
        });

        jQuery(document).on('change', '.group-checkable', function () {

            var table = jQuery(this).closest("table");
            var set = table.find(".checkboxes");
            var checked = jQuery(this).is(":checked");
            jQuery(set).each(function () {
                if (checked) {
                    jQuery(this).prop("checked", true);
                    jQuery(this).closest('tr').addClass("active");
                } else {
                    jQuery(this).prop("checked", false);
                    jQuery(this).closest('tr').removeClass("active");
                }
            });
            Utils.toggleMultiTicks(table);
        });
        jQuery(document).on('change', '.checkboxes', function () {
            var table = jQuery(this).closest("table");
            var sets = table.find(".checkboxes");
            var isALlCheck = true;
            var size = sets.size();
            var count = 0;
            jQuery(sets).each(function () {
                if (!jQuery(this).is(":checked")) {
                    isALlCheck = false;
                }
                if (jQuery(this).is(":checked")) {
                    count++;
                }

            });
            if (count > 0) {
                jQuery(".group-btn").find("button").show();
            } else {
                jQuery(".group-btn").find("button").hide();
            }
            if (isALlCheck) {
                jQuery(".group-checkable").prop("checked", true);
            }
            else {
                jQuery(".group-checkable").prop("checked", false);
            }
            jQuery(this).closest('tr').toggleClass("active");
            Utils.toggleMultiTicks(jQuery(this).closest('table'));
        });
        jQuery(document).on("change", ".changeRel", function () {
            var v = jQuery(this).prop("checked") ? 1 : 0;
            var data = jQuery(this).getDataUppername();
            jQuery(data.Rel).val(v);
            if (v) {
                jQuery(jQuery(this).attr("data-rel-date")).removeClass("hidden");


            } else {
                jQuery(jQuery(this).attr("data-rel-date")).addClass("hidden");
                jQuery(jQuery(this).attr("data-rel-date")).find("input").val("");
            }
            if (typeof data.RelVisible != 'undefined') {
                var dataOptions = jQuery(this).find("option:selected").getDataUppername();
                if (dataOptions.IsVisible.toLowerCase() == "true") {
                    jQuery(data.RelVisible).removeClass("hidden")
                } else {
                    jQuery(data.RelVisible).addClass("hidden")
                }
            }
            if (data.Callback) {
                eval(data.Callback);
            }
            if (data.FlowChartStep && data.FlowchartStep == "1") {

                if (data.ToggleTarget && jQuery(data.ToggleTarget).length > 0) {
                    var toggle = jQuery(data.ToggleTarget);
                    if (v && toggle.hasClass('tabInActive')) {
                        toggle.show();
                        toggle.addClass("tabActive");
                        toggle.removeClass("tabInActive");
                    }
                    if (!v && toggle.hasClass('tabActive')) {
                        toggle.hide();
                        toggle.addClass("tabInActive");
                        toggle.removeClass("tabActive");
                    }
                }

            }

        });
        jQuery(".changeRel").trigger("change");

        jQuery(document).on("change", ".fieldRadio", function () {
            var obj = jQuery(this);
            if (obj.prop("checked")) {
                var data = obj.getDataUppername();
                obj.closest("form").find(".fieldRadio").each(function () {
                    if (obj.attr("name") != jQuery(this).attr("name")) {
                        if (data.Label == jQuery(this).attr("data-label")) {
                            jQuery(this).prop("checked", false);
                        }
                    }
                });
            }
        });
        jQuery(document).on("click", ".fieldRadio", function () {

            var obj = jQuery(this);
            var data = obj.getDataUppername();
            if (obj.is(":checked")) {
                if (data.Parent && data.HiddenTarget) {
                    if (!jQuery(data.Parent).find(data.HiddenTarget).hasClass("hidden")) {
                        jQuery(data.Parent).find(data.HiddenTarget).addClass("hidden");
                    }
                    if (jQuery(data.Parent).find(data.Target).hasClass("hidden")) {
                        jQuery(data.Parent).find(data.Target).removeClass("hidden");
                    }

                }
            }


        });

        jQuery(document).on("keydown", ".txtNumberOfPageCustom", function (e) {
            var key = e.charCode ? e.charCode : e.keyCode ? e.keyCode : 0;
            if (key === 13) {
                var np = jQuery(this).val();
                if (!Utils.isInteger(np) || parseInt(np) < 1) {
                    return false;
                }
                else {
                    var href = (jQuery(this).attr("data-href") + "&page=" + jQuery(this).val()).replace('&&', '&').replace('?&', '?');
                    window.location.href = href.replace('&&', '&').replace('?&', '?');
                }
            }
        });
        jQuery(document).on("keydown", ".pressSubmit", function (e) {
            var key = e.charCode ? e.charCode : e.keyCode ? e.keyCode : 0;
            if (key === 13) {
                try {
                    jQuery(this).closest("form").trigger("submit");
                } catch (ex) {
                }
                return false;
            }
            return true;
        });
        jQuery(document).on("submit", ".quickSearch", function () {
            try {
                var form = jQuery(this);
                var dataAttr = form.getDataUppername();

                var url = form.attr("action");
                var target = form.attr("data-target");
                var data = Utils.getSerialize(form);
                if (Utils.isEmpty(url)) {
                    return;
                }
                for (var i in data) {
                    if (Utils.isEmpty(data[i]))
                        delete data[i];
                }
                jQuery.ajax({
                    type: "POST",
                    async: true,
                    url: url,
                    data: data,
                    beforeSend: function () {
                        jQuery(target).addClass("loading").html("")
                    },
                    complete: function () {
                        jQuery(target).removeClass("loading");
                    },
                    error: function () {
                        jQuery(target).removeClass("loading");
                    },
                    success: function (response) {
                        jQuery(target).removeClass("loading");

                        try {
                            if (form.attr("data-state") != "0") {
                                window.history.pushState(null, response.title, Utils.builderQString(data, url));
                                jQuery(document).prop("title", response.title);
                            }
                        } catch (e) {
                            console.log(e);
                        }
                        Utils.sectionBuilder(response);
                        if (response.hasOwnProperty("isCust")) {
                            jQuery(target).html(response.htCust);
                        }
                        Utils.updateInputDate(jQuery(target));
                        Utils.updateFormState(jQuery(target));
                        Utils.updateScrollBar(jQuery(target));
                        Utils.updateChart(jQuery(target));
                        Autocomplete.init(jQuery(target));
                        Main.upEvent(jQuery(target));

                        if (!dataAttr.FlowchartInit || dataAttr.FlowchartInit != "0") {
                            FlowChart.init();
                        }

                        Cust.initChart();
                    }
                });
            } catch (e) {
            }
            return false;
        });
        jQuery(document).on("submit", ".quickSubmit", function (e) {
            e.preventDefault();

            try {
                var form = jQuery(this);
                var url = form.attr("action");
                var target = form.attr("data-target");
                var targetDelete = form.attr("data-target-delete");
                var type = form.attr("data-insert-type");
                var isScroll = form.attr("data-scroll");
                var data = Utils.getSerialize(form);
                if (Utils.isEmpty(url)) {
                    return false;
                }
                Utils.autoResize();
                if (!form.hasClass("bootstrapValidator")) {
                    form.addClass("bootstrapValidator").bootstrapValidator();
                }
                if (!form.hasClass("bootstrapValidatored")) {
                    form.addClass("bootstrapValidatored");
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
                console.log(form.find(".has-error"));
                if (form.find(".has-error").length > 0) {
                    return false;
                }
                if (form.hasClass("submited")) {
                    return false;
                }
                jQuery.ajax({
                    type: "POST",
                    async: true,
                    url: url,
                    data: data,
                    beforeSend: function () {
                        form.addClass("submited").find("[type='submit']").prop("disabled", true);
                    },
                    complete: function () {
                        form.removeClass("submited").find("[type='submit']").prop("disabled", false);
                    },
                    error: function () {
                        form.removeClass("submited").find("[type='submit']").prop("disabled", false);

                    },
                    success: function (response) {
                        try {
                            Utils.sectionBuilder(response, response.isErr);
                            if (response.hasOwnProperty("isCust")) {

                                if (type == "append") {
                                    jQuery(target).append(response.htCust);
                                }
                                else if (type == "prepend") {
                                    console.log(jQuery(target));
                                    jQuery(target).prepend(response.htCust);
                                }
                                else if (type == "replaceWith") {
                                    jQuery(target).replaceWith(response.htCust);
                                }
                                else {
                                    jQuery(target).html(response.htCust);
                                }
                            }
                            if (isScroll) {
                                jQuery(target).scrollTop(jQuery(target)[0].scrollHeight);
                            }
                            if (response.isErr) {
                                Utils.setError(response.ctMeg);
                                form.find('#messeage_err').html(response.ctMeg);
                                form.find('#messeageadd_err').html("");
                                form.find("[type='submit']").prop("disabled", false);
                                if (!form.hasClass("validate-in-form")) {
                                    Utils.closeOverlay(true);
                                    dialog.remove();
                                }
                                return;
                            }
                            else {
                                Utils.updateInputDate(jQuery(target));
                                Utils.updateFormState(jQuery(target));
                                Utils.updateScrollBar(jQuery(target));
                                Utils.updatePDFViewer(response);
                                Utils.updateImageViewer();
                                Autocomplete.init(jQuery(target));
                                Main.upEvent(jQuery(target));
                                if (!Utils.isEmpty(targetDelete)) {
                                    jQuery(targetDelete).fadeOut("fast", function () {
                                        jQuery(this).remove();
                                    });
                                }
                                if (form.hasClass("closeOnSubmit")) {
                                    Utils.closeOverlay(true);
                                }
                                if (form.hasClass("closeOnSubmit2Dialog")) {
                                    Utils.close2Dialog(form, true);
                                }
                                if (form.hasClass("reloadOnSubmit")) {
                                    window.location.reload();
                                }
                            }
                        }
                        catch (e) {
                        }
                        try {
                            form.reset();
                            form.find("[type='submit']").prop("disabled", false);
                        } catch (e) {
                            console.log(e);
                        }
                        form.find(".editorSummernote").each(function () {
                            try {
                                jQuery(this).code('');
                            } catch (e) {
                            }
                        });

                    }
                });
            } catch (e) {
            }

            return false;
        });

        jQuery(document).on("click", ".quickMore", function () {
            try {
                var node = jQuery(this);
                var data = jQuery(this).getDataUppername();
                if (typeof data.Skip == 'undefined') {
                    data.Skip = 0;
                }
                if (typeof data.Take == 'undefined') {
                    data.Take = 10;
                }
                data.Skip = parseInt(data.Skip) + parseInt(data.Take);

                var target = data.Target;
                var type = data.InsertType;
                var url = node.attr("href").replace("#", "");
                if (Utils.isEmpty(url)) {
                    return;
                }
                jQuery.ajax({
                    type: "POST",
                    async: true,
                    url: url,
                    data: data,
                    beforeSend: function () {
                        node.addClass("loading");
                    },
                    complete: function () {
                        node.removeClass("loading");
                    },
                    error: function () {
                        node.removeClass("loading");
                    },
                    success: function (response) {
                        Utils.sectionBuilder(response);
                        if (response.hasOwnProperty("isCust")) {
                            if (type == "prepend") {
                                jQuery(target).prepend(response.htCust);
                            }
                            else {
                                jQuery(target).append(response.htCust);
                            }
                        }
                        node.attr("data-skip", data.Skip);
                        node.attr("data-take", data.Take);
                        if (response.htCust == "" || jQuery(response.htCust).find(".itemMore").length < data.Take) {
                            node.addClass("hidden")
                        }
                    }
                });
            } catch (e) {
                //
            }
            return false;
        });
        jQuery(document).on("click", ".quickLike", function () {
            try {
                var node = jQuery(this);
                var data = jQuery(this).getDataUppername();
                var target = data.Target;
                jQuery.ajax({
                    type: "POST",
                    async: true,
                    url: node.attr("href"),
                    data: data,
                    beforeSend: function () {
                        node.addClass("loading");
                    },
                    complete: function () {
                        node.removeClass("loading");
                    },
                    error: function () {
                        node.removeClass("loading");
                    },
                    success: function (response) {
                        Utils.sectionBuilder(response);
                        node.toggleClass("active");
                        if (response.hasOwnProperty("isCust")) {
                            jQuery(target).html(response.htCust);
                        }
                    }
                });
            } catch (e) {
                //
            }
            return false;
        });
        jQuery(document).on("click", ".quickView", function () {
            try {
                var node = jQuery(this);
                var url = node.attr("href").replace("#", "");
                var data = node.getDataUppername();
                var target = node.Target || node.attr("data-target");

                if (Utils.isEmpty(url)) {
                    return;
                }
                if (window.history.pushState) {
                    jQuery.ajax({
                        type: "POST",
                        async: true,
                        url: url,
                        data: { RedirectPath: Utils.getRedirect() },
                        beforeSend: function () {
                            jQuery(target).addClass("loading").html("")
                        },
                        complete: function () {
                            jQuery(target).removeClass("loading");
                        },
                        error: function () {
                            jQuery(target).removeClass("loading");
                        },
                        success: function (response) {

                            if (data.State !== "0") {
                                window.history.pushState(null, response.title, url);
                                jQuery(document).prop("title", response.title);
                            }

                            Utils.sectionBuilder(response);
                            if (response.hasOwnProperty("isCust")) {
                                jQuery(target).html(response.htCust);
                            }

                            Utils.updatePDFViewer(response);
                            Utils.updateImageViewer();
                            Utils.updateChart(jQuery(target));
                            Utils.updateInputDate(jQuery(target));
                            Utils.updateFormState(jQuery(target));
                            Utils.updateScrollBar(jQuery(target));
                            Autocomplete.init(jQuery(target));
                            Main.upEvent(jQuery(target));
                            JobPage.upEvent(jQuery(target));
                            if (jQuery(target).find(".autoSelect2").is(":visible")) {
                                $("select.autoSelect2").select2();
                            }
                            if (location.href.indexOf("/record/info/") > -1 || location.href.indexOf("/register/info/") > -1) {
                                //Call màn hình giải quyết
                                Proto.updateFormLayout();
                                Proto.updateViewLayout();
                            }

                            Main.backLink();

                            //window.webViewerLoad(true);
                            //jQuery("#viewerContainer").scrollTop(0);

                            Cust.fileViewer_height_fn();
                            Cust.toogle_steps();
                            Cust.Scroll_table();
                            Cust.Scroll_tab_group();
                            Cust.Table_sort();
                            Cust.dataTables_filter_col(); //Responsive dataTables_filter Col
                            Cust.gotoStep();
                            Cust.check_required_input();

                            if (!data.FlowchartInit || data.FlowchartInit != "0") {
                                FlowChart.init();
                            }
                            SignatureFSI.init();
                            //Cust.reportPie();
                            //Cust.reportMonth();
                            //Cust.prev_next_group_button();
                            Cust.initChart();
                            Cust._initTabRecordClick();

                        }
                    });
                } else {
                    window.location.href = url;
                }
            } catch (e) {
                //
            }
            if (jQuery(this).hasClass("closeOpen")) {
                jQuery(this).closest(".open").removeClass("open");
            }
            return false;
        });
        jQuery(document).on("click", ".quickUpdate", function () {
            try {
                var obj = jQuery(this);
                var target = jQuery(this).attr("data-target");
                var customClass = jQuery(this).attr("data-custom-class");
                var flowchart = jQuery(this).attr("data-flowchart");
                var flowchartModelReg = jQuery(this).attr("data-flowchart-source");
                var flowchartInit = jQuery(this).attr("data-flowchart-init") || 0;

                var dialogWidth = jQuery(this).attr("data-width");
                var data = obj.getDataUppername();
                data.RedirectPath = Utils.getRedirect();
                jQuery.ajax({
                    type: "POST",
                    async: true,
                    url: jQuery(this).attr("href"),
                    data: data,
                    beforeSend: function () {
                        if (!obj.hasClass("not-overlay")) {
                            Utils.openOverlay();
                        }
                    },
                    complete: function () {
                        if (!obj.hasClass("not-overlay")) {
                            Utils.openOverlay();
                        }
                    },
                    error: function () {
                        if (!obj.hasClass("not-overlay")) {
                            Utils.closeOverlay();
                        }
                    },
                    success: function (response) {
                        if (dialogWidth) {
                            response.wDL = dialogWidth;
                        }
                        Utils.sectionBuilder(response, null, Cust.registerCusEvents, customClass);
                        Cust.registerCusEvents(jQuery(response.d));
                        if (response.hasOwnProperty("isCust")) {
                            Utils.closeOverlay();
                            jQuery(target).html(response.htCust);
                        }
                        if (!response.isErr && data.OnSuccessRefresh == "1") {
                            Utils.reloadPage();
                        }
                        if (!response.isErr && data.OnSuccessClose == "1") {
                            Utils.closeCDialog(obj, true);
                        }
                        if (response.isErr && response.ctMeg) {
                            Utils.closeOverlay();
                        }
                        else {
                            Utils.updateTab(jQuery(target));
                            Utils.updateInputDate(jQuery(target));
                            Utils.updateFormState(jQuery(target));
                            Utils.updateScrollBar(jQuery(target));
                            Utils.updateIsNumber(jQuery(target));
                            Autocomplete.init(jQuery(target));
                            Main.upEvent(jQuery(target));
                            Cust.check_required_input();
                            Cust.initAutoFillForm(jQuery(target));
                            Cust.registerEvents(jQuery(target));
                            Proto.updateFormLayout();
                            Utils.autoResize();
                            if (parseInt(flowchartInit) == 1) {
                                FlowChart.init(flowchart, flowchartModelReg);
                            }


                        }
                    }
                });
            } catch (e) {
            }
            return false;
        });
        //if (window.history.pushState) {
        //    $(window).on("popstate", function (event) {
        //        window.location = document.location;
        //    });
        //}
        jQuery(document).on("click", ".quickAppend", function () {
            try {
                var obj = jQuery(this);
                var target = jQuery(this)
                    .attr("data-target");
                jQuery.ajax({
                    type: "POST",
                    async: true,
                    url: jQuery(this).attr("href"),
                    beforeSend: function () {
                        if (!obj.hasClass("not-overlay")) {
                            Utils.openOverlay();
                        }
                    },
                    complete: function () {
                        if (!obj.hasClass("not-overlay")) {
                            Utils.openOverlay();
                        }
                    },
                    error: function () {
                        if (!obj.hasClass("not-overlay")) {
                            Utils.openOverlay();
                        }
                    },
                    success: function (response) {
                        Utils.sectionBuilder(response);
                        if (response.hasOwnProperty("isCust")) {
                            Utils.closeOverlay();
                            jQuery(target).append(response.htCust);
                        }
                        Utils.updateTab(jQuery(target));
                        Utils.updateInputDate(jQuery(target));
                        Utils.updateScrollBar(jQuery(target));
                        Utils.updateFormState(jQuery(target));
                        Autocomplete.init(jQuery(target));
                        Main.upEvent(jQuery(target));
                    }
                });
            } catch (e) {
            }
            return false;
        });
        jQuery(document).on("click", ".quickDelete", function () {
            try {
                var data = jQuery(this).getDataUppername();
                if (typeof data.RedirectPath == "undefined")
                    data.RedirectPath = Utils.getRedirect();
                var self = jQuery(this);
                jQuery.ajax({
                    type: "POST",
                    async: true,
                    url: jQuery(this).attr("href"),
                    data: data,
                    beforeSend: function () {
                        Utils.openOverlay();
                    },
                    complete: function () {
                        Utils.openOverlay();
                    },
                    error: function () {
                        Utils.openOverlay();
                    },
                    success: function (response) {
                        Utils.sectionBuilder(response);
                        if (response.hasOwnProperty("isCust")) {
                            Utils.closeOverlay();
                            jQuery(data.Target).html(response.htCust);
                        }
                        if (response.isErr)
                            Utils.closeOverlay(true);
                        if (!Utils.isEmpty(data.TargetDeleteClick)) {
                            jQuery(data.TargetDeleteClick).fadeOut("fast", function () {
                                jQuery(this).remove();
                            });
                        }
                        if (self.hasClass("onDeleteReload")) {
                            window.location.reload();
                        }
                        Utils.updateFormState(jQuery(data.Target));
                        Utils.updateScrollBar(jQuery(data.Target));
                    }
                });
            } catch (e) {

            }
            return false;
        });
        jQuery(document).on("click", ".quickDeletes, .quickConfirms", function () {
            try {
                var target = jQuery(this)
                    .attr("data-target");
                var href = jQuery(this)
                    .attr("data-href");
                var table = jQuery(this)
                    .closest(".dataTables_wrapper")
                    .find("table");

                var ids = [];
                var idFiles = [];
                table.find(".checkboxes").each(function () {
                    if (jQuery(this).prop("checked")) {
                        var id = jQuery(this).attr("data-id");
                        var idFile = jQuery(this).attr("data-id-file");
                        if (Utils.isInteger(id))
                            ids.push(id);
                        if (!Utils.isEmpty(idFile))
                            idFiles.push(idFile);
                    }
                });
                jQuery.ajax({
                    type: "POST",
                    async: true,
                    url: href,
                    data: { ID: ids, IDFile: idFiles, RedirectPath: Utils.getRedirect() },
                    beforeSend: function () {
                        Utils.openOverlay();
                    },
                    complete: function () {
                        Utils.openOverlay();
                    },
                    error: function () {
                        Utils.openOverlay();
                    },
                    success: function (response) {
                        Utils.sectionBuilder(response);
                        if (response.hasOwnProperty("isCust")) {
                            Utils.closeOverlay();
                            jQuery(target).html(response.htCust);
                        }
                        Utils.updateFormState(jQuery(target));
                        Utils.updateScrollBar(jQuery(target));
                    }
                });
            } catch (e) {

            }
            return false;
        });

        jQuery(document).on("click", ".attachFileImport", function () {
            var data = jQuery(this).getData();
            jQuery(data.rel).attr("data-target", data.target);
            jQuery(data.rel).attr("data-file-name", data.fileName);
            jQuery(data.rel).attr("data-file-path", data.filePath);
            jQuery(data.rel).attr("data-file-title", data.fileTitle);
            jQuery(data.rel).attr("data-file-url", data.fileUrl);
            jQuery(data.rel).attr("data-url", data.url);
            jQuery(data.rel).val("").trigger("click");
            Main.upEvent();

        });

        jQuery(document).on("submit", ".quickCmt", function (e) {
            try {
                var form = jQuery(this);
                var attrs = jQuery(this).getDataUppername();
                var container = form.closest(".container-cmts");
                var target = container.find(".cmts").first();
                var data = Utils.getSerialize(form);
                if (Utils.isEmpty(data.Body))
                    return false;

                jQuery.ajax({
                    type: "POST",
                    async: true,
                    url: form.attr("action"),
                    data: data,
                    beforeSend: function () {
                    },
                    complete: function () {
                    },
                    error: function () {
                    },
                    success: function (response) {

                        try {
                            Utils.sectionBuilder(response);
                            if (response.hasOwnProperty("isCust")) {
                                Utils.closeOverlay();
                                jQuery(target).append(response.htCust);
                                var dataInc = jQuery(attrs.IncTarget).getData();

                                var v = parseInt(dataInc.value) + 1;
                                jQuery(attrs.IncTarget).attr("data-value", v).val(v);
                            }
                            Utils.updateFormState(jQuery(target));
                            Utils.updateScrollBar(jQuery(target));
                            jQuery(target).scrollTop(jQuery(target).scrollHeight());
                        } catch (e) { }

                        form.reset();
                        form.find("[type='submit']").prop("disabled", false);
                    }
                });
            } catch (e) {
                console.log(e);
            }

            return false;
        });

        jQuery(document).on("click", ".nextChart", function () {

            var chartViewer = jQuery(this).closest(".chartViewer");
            var chart = chartViewer.highcharts();
            var data = chartViewer.getData();
            var from = parseInt(data.from);
            var to = parseInt(data.to);
            var max = parseInt(data.max);
            var step = parseInt(data.step);

            chart.xAxis[0].setExtremes(from + step, to + step);
            chartViewer.attr("data-from", from + step);
            chartViewer.attr("data-to", to + step);

            if (to + step >= max) {
                chartViewer.find(".nextChart").addClass("hidden");
            } else {
                chartViewer.find(".nextChart").removeClass("hidden");
            }
        });

        jQuery(document).on("click", ".prevChart", function () {
            var chartViewer = jQuery(this).closest(".chartViewer");
            var chart = chartViewer.highcharts();
            var data = chartViewer.getData();
            var from = parseInt(data.from);
            var to = parseInt(data.to);
            var max = parseInt(data.max);
            var step = parseInt(data.step);

            chart.xAxis[0].setExtremes(from - step, to - step);
            chartViewer.attr("data-from", from - step);
            chartViewer.attr("data-to", to - step);

            if (to - step >= max) {
                chartViewer.find(".nextChart").addClass("hidden");
            } else {
                chartViewer.find(".nextChart").removeClass("hidden");
            }
        });
        jQuery(document).on("change", ".slChangeFT", function () {
            if (jQuery(this).val() == "textarea") {
                jQuery(this).closest(".scrollItem").find(".ofTextarea").removeClass("hidden");
            } else {
                jQuery(this).closest(".scrollItem").find(".ofTextarea").addClass("hidden");
            }
        });
        jQuery(document).on("change", ".slChangeYearDate", function () {
            var year = jQuery(this).val();
            if (Utils.isInteger(year)) {
                var st = "01-01-" + year;
                var ed = "31-12-" + year;
                var data = jQuery(this).getDataUppername();
                jQuery(data.TargetStartDate).val(st);
                jQuery(data.TargetEndDate).val(ed);
            }
        });

        jQuery(window).resize(function () {
            Utils.autoResize();
        });
        //Change tab
        jQuery(document).on("click", ".btn-next", function () {
            Utils.updateScrollBar(jQuery(document));
            jQuery(".selectpicker").selectpicker();
        });
        jQuery(document).on("changed.bs.select", ".selectpicker.qlda-used", function () {
            var data = jQuery(this).getDataUppername();
            if (Utils.isEmpty(data.Url)) {
                return false;
            }
            var value = jQuery(this).val();
            var name = jQuery(this).attr("name");
            var sendName = jQuery(this).attr("send-name");
            data[name] = value;
            data[sendName] = value;
            if (!Utils.isEmpty(data.TargetCheck)) {
                var idExist = [];
                var targetCheck = $(data.TargetCheck);
                if (data.IsCheckExist) {
                    if (!Utils.isEmpty(targetCheck)) {
                        targetCheck.each(function (e) {
                            idExist.push(parseInt($(this).val()));
                        });
                        if (data.IsForcus) {
                            if (idExist.includes(parseInt(value))) {
                                Utils.setError(data.ErrMessage);
                                return;
                            } else {
                                idExist.push(parseInt($(this).val()));
                            }


                        }
                        data.NameIDExist = idExist;
                    }
                }
            }
            jQuery.ajax({
                type: "POST",
                async: true,
                url: data.Url,
                data: data,
                beforeSend: function () {
                },
                complete: function () {
                },
                error: function () {
                },
                success: function (response) {
                    try {
                        if (data.Type == "prepend") {
                            jQuery(data.Target).prepend(response.htCust);
                        }
                        else if (data.Type == "append") {
                            jQuery(data.Target).append(response.htCust);
                        }
                        else if (data.Type == "replaceWith") {
                            jQuery(data.Target).replaceWith(response.htCust);
                        }
                        else {
                            jQuery(data.Target).html(response.htCust);
                        }
                        if (response.data.ObjectRennders) {
                            var dataRenders = response.data.ObjectRennders;
                            for (var i = 0; i < dataRenders.length; i++) {
                                var item = dataRenders[i];
                                $(item.ID).html(item.HtmlRender);
                                $(item.ID).find(".selectpicker").selectpicker();
                            }
                        }
                        if (!Utils.isEmpty(data.IDExecutor)) {
                            var excutor = $(data.IDExecutor);
                            var executorTarget = $(excutor.attr("data-target"));
                            excutor.attr("data-id-project", value);
                            executorTarget.html("");
                        };
                        if (!Utils.isEmpty(data.IDSupervisor)) {
                            var suprervisor = $(data.IDSupervisor);
                            var suprervisorTarget = $(suprervisor.attr("data-target"));
                            suprervisor.attr("data-id-project", value);
                            suprervisorTarget.html("");
                        };
                    } catch (e) {
                        console.log(e);
                    }
                }
            });
        });
        jQuery(document).on('click', ".append_template", function () {
            var obj = jQuery(this);
            var form = jQuery(this).closest("form");
            var temp = jQuery(obj.attr("data-temp"));

            var date = new Date();

            //Init lại bs validate
            Utils.destroyValidator(form);
            form = jQuery(this).closest("form");
            var target = form.find(obj.attr("data-target"));
            var appendTo = jQuery(obj.attr("data-append-target"));
            var tempPlate = $(Utils.replaceAll(temp.html(), "{autoIndex}", date.getTime())); //replace {autoInde}
            tempPlate.find("select.autoSelect2").not(".select2-hidden-accessible").each(function () {
                $(this).select2();
            });
            tempPlate.find("select.selectpicker").not(".inited").addClass("inited").selectpicker().addClass("inited");
            target.append(tempPlate);
            if (appendTo.length > 0) {
                appendTo.append(tempPlate);
            }
            Utils.bootstrapValidator(jQuery(this).closest("form"));
            if (obj.hasClass("autoIndex")) {
                Main.autoIndex(target);
                Main.autoIndex(appendTo);
            }
            var icIndex = jQuery(obj.attr("data-increase-index")); //set tổng số bản ghi đã đăng ký
            if (icIndex) {
                var count = target.find("tr.item").length;
                icIndex.val(count);
            }
            if (target.length == 0)
                target = appendTo;
            Utils.autoResize();
            Utils.updateInputDate(form);
            Utils.updateIsNumber(form);

            Autocomplete.init(target);
            jQuery(target).find(".useMoney").each(function (i, el) { jQuery(el).simpleMoneyFormat(); });
        });
        jQuery(document).on("change", ".useMoney ", function () {
            var val = $(this).val();
            if (val === "" || Number.isNaN(val))
                val = "0";
            val = parseFloat(val.replace(/,/g, ''));
            $(this).val(val);
            $(this).simpleMoneyFormat();

            //var form = $(this).closest("form");
            //////check validate
            //if (form.hasClass("bootstrapValidator")) {
            //    form.bootstrapValidator('revalidateField', $(this).attr("name"));
            //}
        });

       
        jQuery(document).on("change", ".useMoney ", function () {
            var val = $(this).val();
            if (val === "" || Number.isNaN(val))
                val = "0";
            val = parseFloat(val.replace(/,/g, ''));
            $(this).val(val);
            $(this).simpleMoneyFormat();

            //var form = $(this).closest("form");
            //////check validate
            //if (form.hasClass("bootstrapValidator")) {
            //    form.bootstrapValidator('revalidateField', $(this).attr("name"));
            //}
        });
        //Set id về 0 khi xoá hết autocomplete
        jQuery(document).on("change", ".ui-autocomplete-input ", function () {
            var obj = jQuery(this);
            if (obj.val() == "") {
                var idtarget = jQuery(obj.attr("data-targetid"));
                idtarget.val("0");
            }
        });

        //Theo nhóm
        jQuery(document).on('click', ".append_template_group", function () {
            var obj = jQuery(this);
            var form = jQuery(this).closest("form");
            var temp = jQuery(obj.attr("data-temp"));
            var cTr = jQuery(this).closest("tr");
            //Init lại bs validate
            Utils.destroyValidator(form);
            form = jQuery(this).closest("form");
            var target = obj.closest("tbody");
            var tempPlate = $(temp.html());
            tempPlate.find("select.autoSelect2").not(".select2-hidden-accessible").each(function () {
                $(this).select2();
            });
            tempPlate.find("select.selectpicker").not(".inited").addClass("inited").selectpicker().addClass("inited");

            //Update idgroup
            tempPlate.find("input[name='" + obj.data("group-name") + "']").val(obj.data("id-group"));
            var nextRow = cTr.next();
            if (nextRow.hasClass("item")) { //dòng tiep là item
                cTr = cTr.nextUntil("tr.group-item").last();
            }
            cTr.after(tempPlate);

            Utils.bootstrapValidator(jQuery(this).closest("form"));
            if (obj.hasClass("autoIndex")) {
                Main.autoIndex(target, true);
            }
            var icIndex = jQuery(obj.attr("data-increase-index")); //set tổng số bản ghi đã đăng ký
            if (icIndex) {
                var count = target.find("tr.item").length;
                icIndex.val(count);
            }
            Utils.autoResize();
            Utils.updateInputDate(form);
            Utils.updateIsNumber(form);
            jQuery(target).find(".useMoney").each(function (i, el) { jQuery(el).simpleMoneyFormat(); });
        });

    },

    callRefresh: null,
    setRefresh: function () {
        if (document.getElementById("RefreshPage")) {
            try {
                var timeRefresh = parseInt(jQuery("#RefreshPage").val());
                if (timeRefresh > 0) {
                    Main.callRefresh = setTimeout(function () {
                        if (jQuery("#Overlay").is(":visible")) {
                            clearTimeout(Main.callRefresh);
                            Main.setRefresh();
                        }
                        else {
                            Utils.reloadPage();
                        }
                    }, timeRefresh * 1000);
                }
            }
            catch (e) {
                console.log(e);
            }
        }
    },

    backLink: function () {
        try {
            var bcItems = jQuery(".breadcrumb").find("li");
            var len = bcItems.length;
            if (len > 2) {

                var a = jQuery(bcItems[len - 2]).find("a");
                var attr_href = a.attr("href");
                var data_target = a.attr("data-target");
                jQuery(".widget_back_btn")
                    .removeClass("hidden")
                    .attr("href", attr_href)
                    .attr("data-target", data_target);
                if (a.hasClass("quickView")) {
                    jQuery(".widget_back_btn").addClass("quickView");
                }
                else {
                    jQuery(".widget_back_btn").removeClass("quickView");
                }
            } else {
                jQuery(".widget_back_btn").addClass("hidden");
            }
        } catch (e) { }
    },

    initChart: function () {
        var container = $(document);

        container.find(".morris-line-chart").each(function () {
            var w = jQuery(this).width();
            if (w == 0) {
                jQuery(this).css("width", '500px');
            }
            var mrdata = JSON.parse(jQuery(this).find('#txtdata').val());
            Morris.Line({
                element: jQuery(this),
                data: mrdata.data,
                xkey: mrdata.xkey,
                ykeys: mrdata.ykeys,
                labels: mrdata.labels,
                lineColors: mrdata.colors,
                parseTime: false,
                resize: true,
                redraw: true
            });
        });

        container.find(".QLCVtke-chart").each(function () {
            var obj = jQuery(this);
            var target = obj.attr("data-target");
            var mrdata = JSON.parse(obj.find('#txtdata').val());
            Highcharts.chart(target, {

                chart: {
                    type: 'column'
                },

                title: {
                    text: mrdata.title//'THỐNG KÊ CÔNG VIỆC NHÂN VIÊN'
                },
                colors: mrdata.colors,//['#53a93f', '#57b5e3', '#cccccc'],

                xAxis: {
                    categories: mrdata.categories//['Tổng số công việc', 'Tháng 2', 'Tháng 3']
                },

                yAxis: {
                    allowDecimals: false,
                    min: 0,
                    title: {
                        text: ''
                    }
                },

                tooltip: {
                    formatter: function () {
                        return '<b>' + this.x + '</b><br/>' +
                            this.series.name + ': ' + this.y + '<br/>' +
                            'Tổng: ' + this.point.stackTotal;
                    }
                },

                plotOptions: {
                    column: {
                        stacking: 'normal'
                    },
                    series: {
                        pointWidth: 30
                    }
                },

                series: mrdata.series
                //[{
                //    name: 'Hoàn Thành',
                //    data: [10, 6, 2],
                //    stack: 'mgf'
                //}, {
                //    name: 'Đang xử lý',
                //    data: [4, 2, 0],
                //    stack: 'male'
                //}, {
                //    name: 'Chưa xử lý',
                //    data: [75, 14, 3],
                //    stack: 'male'
                //}]
            });
        });

        container.find(".QLCVcmt-chart").each(function () {
            var obj = jQuery(this);
            var target = obj.attr("data-target");
            var mrdata = JSON.parse(obj.find('#txtdata').val());
            Highcharts.chart(target, {
                chart: {
                    plotBackgroundColor: null,
                    plotBorderWidth: null,
                    plotShadow: false,
                    type: 'pie'
                },
                title: {
                    text: mrdata.title//'THỐNG KÊ ĐÁNH GIÁ CÔNG VIỆC NHÂN VIÊN'
                },
                colors: mrdata.colors,//['#53a93f', '#57b5e3', '#d73d32', '#cccccc'],
                tooltip: {
                    pointFormat: '<b>{point.percentage:.2f}%</b>'
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
                                value: 4
                            }
                        },
                        showInLegend: true
                    }
                },
                legend: {
                    alignColumns: false,
                    maxHeight: 60
                },
                series: [{
                    name: 'Brands',
                    colorByPoint: true,

                    data: mrdata.data
                    //    [
                    //    { name: 'Xuất sắc', y: 10 },
                    //    { name: 'Đạt', y: 20 },
                    //    { name: 'Không đạt', y: 10 },
                    //    { name: 'Chưa xác định', y: 60 },
                    //]
                }]
            });
        });

        container.find(".QTHT_TK_chart").each(function () {
            var obj = jQuery(this);//#QTHT_TKxuatBan
            var target = obj.attr("data-target");//'QTHT_TKxuatBan'
            var mrdata = JSON.parse(obj.find('#txtdata').val());
            Highcharts.chart(target, {
                chart: {
                    plotBackgroundColor: null,
                    plotBorderWidth: null,
                    plotShadow: false,
                    type: 'pie',
                    //height: '380px'
                },
                title: {
                    text: mrdata.title,//''
                },
                colors: mrdata.colors,// ['#8cc474', '#df5138'],
                tooltip: {
                    pointFormat: '<b>{point.percentage:.2f}%</b>'
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
                                value: 4
                            }
                        },
                        showInLegend: true
                    }
                },
                legend: {
                    alignColumns: false,
                    maxHeight: 60
                },
                series: [{
                    name: 'Brands',
                    colorByPoint: true,

                    data: mrdata.data,
                    //[
                    //    { name: 'Đăng ký mới', y: 20 },
                    //    { name: 'Đã đăng ký', y: 20 },
                    //    { name: 'Hồ sơ thiếu', y: 10 },
                    //    { name: 'Hồ sơ không hợp lệ', y: 10 },
                    //    { name: 'Hồ sơ quá hạn', y: 10 },
                    //    { name: 'Hồ sơ gần đến hạn', y: 20 },
                    //    { name: 'Hồ sơ hoàn thành', y: 10 }
                    //]
                }]
            });
        });
    },

    resetChart: function () {
        var container = $(document);

        container.find(".morris-line-chart").find('*').not('#txtdata').remove();
        container.find(".morris-line-chart").removeAttr("style");

        container.find(".QLCVtke-chart").find('*').not('#txtdata').remove();
        container.find(".QLCVtke-chart").removeAttr("style");

        container.find(".QLCVcmt-chart").find('*').not('#txtdata').remove();
        container.find(".QLCVcmt-chart").removeAttr("style");

        container.find(".QTHT_TK_chart").find('*').not('#txtdata').remove();
        container.find(".QTHT_TK_chart").removeAttr("style");

        Main.initChart();
    },

    autoIndex: function (container, isgroup) {
        var index = 0;
        if (isgroup) {
            container.find("tr").each(function () {
                var tr = jQuery(this);
                if (tr.hasClass("group-item")) {
                    index = 0;
                }
                else {
                    var spanIndex = jQuery(this).find("td > span.autoIndex");
                    if (spanIndex != undefined) {
                        index++;
                        spanIndex.html(index);
                    }
                }
            });
        }
        else {
            container.find("tr.item").each(function () {
                var spanIndex = jQuery(this).find("td > span.autoIndex");
                if (spanIndex != undefined) {
                    index++;
                    spanIndex.html(index);
                }
            });
        }
    }
};
jQuery(document).ready(function () {
    Cdata.init();
    Smile.init();
    Main.init();
    try {
        //FieldEvents.init();
    } catch (e) {
        console.log(e);
    }
    Utils.autoCloseFlash();
    Utils.updateImageViewer();
    Utils.updatePlayer(jQuery(document));
    Utils.updateChart(jQuery(document));
    Utils.updateFormState(jQuery(document));
    Utils.updateInputDate(jQuery(document));
    Utils.updateScrollBar(jQuery(document));
    Utils.updateIsNumber(jQuery(document));
    Autocomplete.init(jQuery(document));

});