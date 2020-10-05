var JobPage = {

    init: function () {
        JobPage.upEvent();
        JobPage.onEvent();
    },

    validateFormWorkflow: function () {
        console.log(form);
    },

    setDrag: function (obj) {
        obj.unbind("draggable").draggable({
            cursor: "move",
            helper: function () {
                return obj.clone().appendTo('body').css({
                    'zIndex': 500,
                    'width': obj.width()
                });
            },
            containment: "document",
            start: function (e, ui) {
            },
            stop: function (e, ui) {
                jQuery(e.target).closest(".accordC")
                    .find(".colJobTodo, .colJobProgress, .colJobDone, .colJobReject").removeClass("dropHandle");
            },
            drag: function (e, ui) {
                jQuery(e.target).closest(".accordC")
                    .find(".colJobTodo, .colJobProgress, .colJobDone, .colJobReject").addClass("dropHandle");
            }
        });

        return obj;
    },
    isAllow: function (colDrag, colDrop) {
        if (colDrag.hasClass("colJobTodo") && colDrop.hasClass("colJobTodo"))
            return false;
        if (colDrag.hasClass("colJobProgress") && colDrop.hasClass("colJobProgress"))
            return false;
        if (colDrag.hasClass("colJobDone") && colDrop.hasClass("colJobDone"))
            return false;
        if (colDrag.hasClass("colJobReject") && colDrop.hasClass("colJobReject"))
            return false;
        if (colDrag.hasClass("colJobClose") && colDrop.hasClass("colJobClose"))
            return false;

        return true;
    },
    upEvent: function (container) {
        if (Utils.isEmpty(container))
            container = jQuery(document);

        container.find(".jobDrag").each(function () {
            JobPage.setDrag(jQuery(this));
        });
        container.find(".colJobTodo").unbind("droppable").droppable({
            greedy: true,
            accept: function (d) {
                return d.hasClass("jobDrag");
            },
            drop: function (d, ui) {
                //var tid = jQuery(this).closest(".accordC").attr("data-id");
                //var isAccept = tid == jQuery(ui.draggable).attr("data-rel");
                //if (!isAccept)
                //    return false;

                var colDrag = jQuery(this).closest(".ui-droppable");
                var colDrop = jQuery(ui.draggable).closest(".ui-droppable");
                if (!JobPage.isAllow(colDrag, colDrop)) {
                    return false;
                }
                var target = "dragid" + (new Date()).getTime();
                jQuery(ui.draggable).attr("id", target);
                jQuery(this).find(".placeholder").remove();
                jQuery("#TaskTodos").append(jQuery(ui.draggable));
                var data = jQuery(ui.draggable).getDataUppername();
                data.Status = 0;
                data.RedirectPath = Utils.getRedirect();
                jQuery.ajax({
                    type: "POST",
                    async: true,
                    url: Utils.getDomain() + "/" + Cdata.VirtualPath + "/job/change-status.html",
                    data: data,
                    success: function (response) {
                        Utils.sectionBuilder(response);
                        if (response.hasOwnProperty("isCust")) {
                            jQuery("#" + target).replaceWith(
                                JobPage.setDrag(jQuery(response.htCust))
                            );
                        }
                    }
                });
            }
        });
        container.find(".colJobProgress").unbind("droppable").droppable({
            greedy: true,
            accept: function (d) {
                return d.hasClass("jobitem");
            },
            drop: function (d, ui) {
                //var tid = jQuery(this).closest(".accordC").attr("data-id");
                //var isAccept = tid == jQuery(ui.draggable).attr("data-rel");
                //if (!isAccept)
                //    return false;

                var colDrag = jQuery(this).closest(".ui-droppable");
                var colDrop = jQuery(ui.draggable).closest(".ui-droppable");
                if (!JobPage.isAllow(colDrag, colDrop)) {
                    return false;
                }

                var target = "dragid" + (new Date()).getTime();
                jQuery(ui.draggable).attr("id", target);
                jQuery(this).find(".placeholder").remove();
                jQuery("#TaskProgress").append(jQuery(ui.draggable));

                var data = jQuery(ui.draggable).getDataUppername();
                data.Status = 2;
                data.RedirectPath = Utils.getRedirect();

                jQuery.ajax({
                    type: "POST",
                    async: true,
                    url: Utils.getDomain() + "/" + Cdata.VirtualPath + "/job/change-status.html",
                    data: data,
                    success: function (response) {
                        Utils.sectionBuilder(response);
                        if (response.hasOwnProperty("isCust")) {
                            jQuery("#" + target).replaceWith(
                                JobPage.setDrag(jQuery(response.htCust))
                            );
                        }
                    }
                });
            }
        });
        container.find(".colJobDone").unbind("droppable").droppable({
            greedy: true,
            accept: function (d) {
                return d.hasClass("jobitem");
            },
            drop: function (d, ui) {
                //var tid = jQuery(this).closest(".accordC").attr("data-id");
                //var isAccept = tid == jQuery(ui.draggable).attr("data-rel");
                //if (!isAccept)
                //    return false;

                var colDrag = jQuery(this).closest(".ui-droppable");
                var colDrop = jQuery(ui.draggable).closest(".ui-droppable");
                if (!JobPage.isAllow(colDrag, colDrop)) {
                    return false;
                }

                var target = "dragid" + (new Date()).getTime();
                jQuery(ui.draggable).attr("id", target);
                jQuery(this).find(".placeholder").remove();
                jQuery("#TaskDones").append(jQuery(ui.draggable));

                var data = jQuery(ui.draggable).getDataUppername();
                data.Status = 1;
                data.RedirectPath = Utils.getRedirect();

                jQuery.ajax({
                    type: "POST",
                    async: true,
                    url: Utils.getDomain() + "/" + Cdata.VirtualPath + "/job/change-status.html",
                    data: data,
                    success: function (response) {
                        Utils.sectionBuilder(response);
                        if (response.hasOwnProperty("isCust")) {
                            jQuery("#" + target).replaceWith(
                                JobPage.setDrag(jQuery(response.htCust))
                            );
                        }
                    }
                });
            }
        });

        container.find(".colJobClose").unbind("droppable").droppable({
            greedy: true,
            accept: function (d) {
                return d.hasClass("jobitem");
            },
            drop: function (d, ui) {
                //var tid = jQuery(this).closest(".accordC").attr("data-id");
                //var isAccept = tid == jQuery(ui.draggable).attr("data-rel");
                //if (!isAccept)
                //    return false;

                var colDrag = jQuery(this).closest(".ui-droppable");
                var colDrop = jQuery(ui.draggable).closest(".ui-droppable");
                if (!JobPage.isAllow(colDrag, colDrop)) {
                    return false;
                }

                var target = "dragid" + (new Date()).getTime();
                jQuery(ui.draggable).attr("id", target);
                jQuery(this).find(".placeholder").remove();
                jQuery("#TaskCloses").append(jQuery(ui.draggable));

                var data = jQuery(ui.draggable).getDataUppername();
                data.Status = 5;
                data.RedirectPath = Utils.getRedirect();

                jQuery.ajax({
                    type: "POST",
                    async: true,
                    url: Utils.getDomain() + "/" + Cdata.VirtualPath + "/job/change-status.html",
                    data: data,
                    success: function (response) {
                        Utils.sectionBuilder(response);
                        if (response.hasOwnProperty("isCust")) {
                            jQuery("#" + target).replaceWith(
                                JobPage.setDrag(jQuery(response.htCust))
                            );
                        }
                    }
                });
            }
        });

        container.find(".colJobReject").unbind("droppable").droppable({
            greedy: true,
            accept: function (d) {
                return d.hasClass("jobitem");
            },
            drop: function (d, ui) {
                //var tid = jQuery(this).closest(".accordC").attr("data-id");
                //var isAccept = tid == jQuery(ui.draggable).attr("data-rel");
                //if (!isAccept)
                //    return false;

                var colDrag = jQuery(this).closest(".ui-droppable");
                var colDrop = jQuery(ui.draggable).closest(".ui-droppable");
                if (!JobPage.isAllow(colDrag, colDrop)) {
                    return false;
                }

                var target = "dragid" + (new Date()).getTime();
                jQuery(ui.draggable).attr("id", target);
                jQuery(this).find(".placeholder").remove();
                jQuery("#TaskRejects").append(jQuery(ui.draggable));

                var data = jQuery(ui.draggable).getDataUppername();
                data.Status = 3;
                data.RedirectPath = Utils.getRedirect();

                jQuery.ajax({
                    type: "POST",
                    async: true,
                    url: Utils.getDomain() + "/" + Cdata.VirtualPath + "/job/change-status.html",
                    data: data,
                    success: function (response) {
                        Utils.sectionBuilder(response);
                        if (response.hasOwnProperty("isCust")) {
                            jQuery("#" + target).replaceWith(
                                JobPage.setDrag(jQuery(response.htCust))
                            );
                        }
                    }
                });
            }
        });

        //mở dialog sau
        container.find(".openDialogAfter").each(function () {
            var id = jQuery(this).attr("id");
            if (id == undefined || id == "") {
                var d = new Date();
                jQuery(this).attr("id", "fDl" + d.getTime());
            }
            Utils.autoOpenDialog(jQuery(this));
        });
    },

    onEvent: function () {

        jQuery(document).on("click", ".accordT", function () {
            var iconHandle = jQuery(this).find("i").first();
            var accordC = jQuery(this).closest(".accordB").find(".accordC").first();

            if (accordC.hasClass("hidden")) {
                accordC.removeClass("hidden");
                iconHandle.addClass("icon-expanded")
                    .removeClass("icon-collapses");
            } else {
                accordC.addClass("hidden");
                iconHandle.addClass("icon-collapses")
                    .removeClass("icon-expanded");
            }
            return false;
        });

        jQuery(document).on("change", ".autocompleteUserGetDefault", function () {
            var idDept = jQuery(this).val();
            var dataObject = jQuery(this).getDataUppername();

            if (!Utils.isEmpty(idDept)) {
                jQuery.ajax({
                    type: "POST",
                    async: true,
                    data: { IDDept: idDept, PositionCode: dataObject.PositionCode },
                    url: Utils.getDomain() + "/" + Cdata.VirtualPath + "/autocomplete/auser.html",
                    success: function (response) {

                        var el = jQuery(dataObject.AutocompleteInput);
                        var elData = el.getDataUppername();
                        var name = elData.Name;
                        var target = elData.Target;

                        if (!Utils.isEmpty(response.data)) {
                            for (var i in response.data) {
                                var user = response.data[i];
                                var item = jQuery(target).find(".scrollItem[data-id='" + user.ID + "']");
                                if (item.length == 0) {
                                    item = '<div class="scrollItem tickGroup isNew item" data-id="' + user.ID + '" style="display: none">' +
                                        '<div class="col-sm-12">' +
                                        '<div class="checkbox">' +
                                        '<label>' +
                                        '<input checked type="checkbox" value="' + user.ID + '" class="colored-success tickItem" name="' + name + '" id="Rand' + (new Date()).getTime() + '">' +
                                        '<span class="nowrap text">' + user.Name + '</span>' +
                                        '</label>' +
                                        '</div>' +
                                        '<button type="button" class="btn btn-xs btn-link close deleteItem">x</button>' +
                                        '</div>' +
                                        '</div>';
                                }
                                else {
                                    item.css('display', 'none').find("input[type='checkbox']").prop("checked", true);
                                }
                                jQuery(target).prepend(jQuery(item).fadeIn("1000"));
                            }

                            try {
                                var form = el.closest("form");
                                if (form.hasClass("bootstrapValidator")) {
                                    form.bootstrapValidator('revalidateField', jQuery(target).attr("name"));
                                }
                            } catch (e) { }
                        }
                    }
                });
            }
        });
        jQuery(document).on("keypress", ".txtDiscuss", function (e) {
            var key = e.charCode ? e.charCode : (e.keyCode ? e.keyCode : 0);
            if (key == 13) {
                var body = jQuery(this).val();
                if (Utils.isEmpty(body))
                    return false;

                var data = {
                    Body: body,
                    ID: jQuery(this)
                        .closest(".frmDiscuss")
                        .attr("data-id")
                };

                var el = jQuery(this);
                jQuery.ajax({
                    type: "POST",
                    async: true,
                    url: Utils.getDomain() + "/" + Cdata.VirtualPath + "/job/create-discuss.html",
                    data: data,
                    success: function (response) {
                        el.val("");
                    }
                });
                return false;
            }
            return true;
        });
        jQuery(document).on("click", ".jobDone", function () {

            var el = jQuery(this);
            var data = el.getData();
            jQuery.ajax({
                type: "POST",
                async: true,
                url: Utils.getDomain() + "/" + Cdata.VirtualPath + "/job/done.html",
                data: data,
                success: function (response) {
                    Utils.sectionBuilder(response);
                    if (response.hasOwnProperty("isErr") == false) {
                        el.closest(".jobBtns").addClass("hidden");
                        el.remove();
                    }
                }
            });
        });
        jQuery(document).on("click", ".jobReject", function () {

            var el = jQuery(this);
            var data = el.getData();
            jQuery.ajax({
                type: "POST",
                async: true,
                url: Utils.getDomain() + "/" + Cdata.VirtualPath + "/job/reject.html",
                data: data,
                success: function (response) {
                    Utils.sectionBuilder(response);
                    if (response.hasOwnProperty("isErr") == false) {
                        el.closest(".jobBtns").addClass("hidden");
                        el.remove();
                    }
                }
            });
        });
        jQuery(document).on("click", ".jobForward", function () {

            var el = jQuery(this);
            var data = el.getData();
            jQuery.ajax({
                type: "POST",
                async: true,
                url: Utils.getDomain() + "/" + Cdata.VirtualPath + "/job/forward.html",
                data: data,
                success: function (response) {
                    Utils.sectionBuilder(response);

                    Autocomplete.user(jQuery("#FrmJobCrSub"));
                    Utils.updateInputDate(jQuery("#FrmJobCrSub"));
                    Utils.updateFormState(jQuery("#FrmJobCrSub"));
                    Utils.updateScrollBar(jQuery("#FrmJobCrSub"));
                    UpfilePage.upEvent(jQuery("#FrmJobCrSub"));
                }
            });
        });
        jQuery(document).on("change", ".taskType", function () {

            var form = jQuery(this).closest("form");
            if (jQuery(this).prop("checked") && jQuery(this).hasClass("taskBug")) {
                form.removeClass("novalidatedate");
                form.find(".jobTimeContainner").removeClass("hidden");
                form.find(".jobDetailContainner").addClass("hidden");
                form.find(".jobDetailContainner").find("input").val("");
                var bootstrapValidator = form.data('bootstrapValidator');
                form.find(".jobTimeContainner").find("input, select, textarea").each(function () {
                    try {
                        bootstrapValidator.enableFieldValidators(jQuery(this).prop("name"), false);
                    } catch (e) { }
                });
            }
            else if (jQuery(this).prop("checked") && jQuery(this).hasClass("taskSuggest")) {
                form.addClass("novalidatedate");
                form.find(".jobDetailContainner").addClass("hidden");
                form.find(".jobDetailContainner").find("input").val("");
                form.find(".jobTimeContainner").addClass("hidden");
                form.find(".jobTimeContainner").find("input").val("");
                var bootstrapValidator = form.data('bootstrapValidator');
                form.find(".jobTimeContainner").find("input, select, textarea").each(function () {
                    try {
                        bootstrapValidator.enableFieldValidators(jQuery(this).prop("name"), false);
                    } catch (e) { }
                });
            }
            else {
                form.removeClass("novalidatedate");
                form.find(".jobDetailContainner").removeClass("hidden");
                form.find(".jobTimeContainner").removeClass("hidden");
                var bootstrapValidator = form.data('bootstrapValidator');
                form.find(".jobTimeContainner").find("input, select, textarea").each(function () {
                    try {
                        bootstrapValidator.enableFieldValidators(jQuery(this).prop("name"), true);
                    } catch (e) { }

                });
            }
        });
        jQuery(document).on("click", ".job_viewType", function () {
            var typeOfPage = jQuery(this).attr("data-typeOfPage");
            var data_url = window.location.href;
            var url = Utils.updateQueryStringParameter(data_url, "TypeOfPage", typeOfPage);
            window.location.href = url
        });
        jQuery(document).on('click', ".add_row", function () {
            var obj = jQuery(this);
            var form = jQuery(this).closest("form");
            var temp = jQuery(obj.attr("data-temp"));
            var tempPlate = $(temp.html());
            var cId = parseFloat(obj.attr("data-cid"));
            if (isNaN(cId))
                cId = 1;
            var target = form.find(obj.attr("data-target"));
            if (obj.hasClass("autoindex")) {
                var html = Utils.replaceAll(tempPlate.html(), "{autoindex}", cId);
                tempPlate.html(html);
            }
            obj.attr("data-cid", cId + 1);
            //Init lại bs validate
            Utils.destroyValidator(form);
            form = jQuery(this).closest("form");
            target.append(tempPlate);
            Utils.bootstrapValidator(jQuery(this).closest("form"));
            Utils.updateInputDate(form);
            Utils.autoResize();
            form.find(".selectpicker").not(".inited").selectpicker();
            form.find("select.autoSelect2 ").not(".select2-hidden-accessible").each(function () {
                $(this).select2();
            });
            Utils.updateIsNumber(form);
            Main.upEvent();
        });

        jQuery(document).on('click', ".add_child_row", function () {
            var obj = jQuery(this);
            var form = jQuery(this).closest("form");
            var temp = jQuery(obj.attr("data-temp"));
            var id = obj.attr("data-id");
            if (id == undefined)
                return false;
            var tempPlate = $(temp.html());
            var html = Utils.replaceAll(tempPlate.html(), "{parent}", id);
            tempPlate.html(html);
            tempPlate.find('input, select, textarea').each(function () {
                $(this).attr("name", $(this).attr("name") + "_" + id);
            });
            //Init lại bs validate
            Utils.destroyValidator(form);
            form = jQuery(this).closest("form");

            var tr = obj.closest("tr");
            var friends = tr.nextUntil("tr:not(.child)");
            if (friends.length > 0)
                friends.last().after(tempPlate);
            else
                tr.after(tempPlate);

            Utils.bootstrapValidator(jQuery(this).closest("form"));
            Utils.updateInputDate(form);
            Utils.autoResize();
            form.find(".selectpicker").not(".inited").selectpicker();
            form.find("select.autoSelect2 ").not(".select2-hidden-accessible").each(function () {
                $(this).select2();
            });
            Utils.updateIsNumber(form);
            Main.upEvent();
        });
        jQuery(document).on("change", ".switchDiv", function (e) {
            e.preventDefault();
            var obj = jQuery(this);
            var selected = obj.val();
            var target = obj.data("target");
            $(target).addClass("hidden");
            //show
            $(target).each(function () {
                if ($(this).data("selected") == selected) {
                    $(this).removeClass("hidden");
                    return;
                }
            });

        });
        jQuery(document).on("click", ".removeItem", function () {
            var form = jQuery(this).closest("form");
            Utils.destroyValidator(form);
            Utils.bootstrapValidator(jQuery(this).closest("form"));
            var target = jQuery(this).closest("tbody");

            jQuery(this).closest(".item").remove();
            var icIndex = jQuery(jQuery(this).attr("data-increase-index"));
            if (!icIndex) {
                icIndex = form.find("#fieldIndex");
            }
            if (icIndex) {
                var count = target.find("tr.item").length;
                icIndex.val(count);
            }
            Main.autoIndex(target);
        });

        jQuery(document).on("submit", ".get-form-designed", function () {
            var form = jQuery(this);
            if (!form.hasClass("submiting")) {
                form.addClass("submiting");
                var oContent = form.find(form.attr("data-content"));
                oContent.find("div.hasFocus").removeClass("hasFocus");
                var url = form.attr("action");
                if (url != undefined) {
                    var data = Utils.getSerialize(form);
                    data.HtmlLayout = oContent.html();
                    Cust.callAjax(data, url, form, function (response) {
                        form.removeClass("submiting");
                        Utils.sectionBuilder(response);
                        Utils.closeOverlay();
                        location.reload();
                    });
                }
            }
            return false;
        });

        jQuery(document).on("submit", ".quickSubmitImportFile", function () {
            var form = jQuery(this);
            if (!form.hasClass("submiting")) {
                form.addClass("submiting");
                var template = jQuery(form.data("template"));
                var target = jQuery(form.data("target"));
                var table = target.closest("table");
                var header = table.find("thead >tr:first");
                var index = target.find("tr").length;
                var url = form.attr("action");
                if (url != undefined) {
                    var data = Utils.getSerialize(form);
                    data.IDServiceType = form.data("id-service-type");

                    jQuery.ajax({
                        type: "POST",
                        async: true,
                        url: url,
                        data: data,
                        beforeSend: function () {

                        },
                        complete: function () {
                            form.removeClass("submiting");
                        },
                        error: function () {
                            form.removeClass("submiting");
                        },
                        success: function (response) {
                            form.removeClass("submiting");
                            var body = response.data.Body;
                            var header = Object.entries(response.data.Header).map(([key, value]) => ({ key, value }));
                            if (body.length > 0 && header.length > 0) {
                                for (var i = 0; i < body.length; i++) {
                                    var data = Object.entries(body[i]).map(([key, value]) => ({ key, value }));
                                    var ctemp = jQuery(template.html());
                                    for (var j = 0; j < data.length; j++) {
                                        var idata = data[j];
                                        var iindex = header.find(n => n.key === idata.key).value;
                                        if (iindex > 0) {
                                            ctemp.find("td:eq(" + iindex + ")").find("input, select").each(function () {
                                                var tagName = jQuery(this).prop("tagName").toLowerCase();
                                                var el = jQuery(this);
                                                if (!el.is('[readonly]') && !el.is(':disabled')) {
                                                    if (tagName == "input") {
                                                        if (el.attr("type") == "checkbox") {
                                                            el.prop("checked", idata.value)
                                                        } else if (el.hasClass("date")) {
                                                            el.val(moment(idata.value).format('DD/MM/YYYY'));
                                                        }
                                                        else if (el.hasClass("datetime")) {
                                                            el.val(moment(idata.value).format('DD/MM/YYYY HH:mm:ss'));
                                                        }
                                                        else {
                                                            el.val(idata.value);
                                                        }
                                                    }
                                                    else if (tagName == "select") {
                                                        //nếu có data icode nghĩa là dùng code
                                                        var sl = el.find("option[data-icode ='" + idata.value + "']");
                                                        if (sl.length > 0) {
                                                            el.val(sl.val());
                                                        }
                                                        else {
                                                            //sl = el.find("option[value ='" + idata.value + "']");
                                                            //if (sl.length > 0) {
                                                            //    el.val(idata.value);
                                                            //}
                                                            //else {
                                                            var isSelected = false;

                                                            el.find("option").each(function () {
                                                                if (jQuery(this).text().localeCompare(idata.value) == 0) {
                                                                    {
                                                                        //So sánh khác encode
                                                                        el.val(jQuery(this).val());
                                                                        isSelected = true;
                                                                        return false;
                                                                    }
                                                                }
                                                            });
                                                            if (!isSelected) //ko tìm thấy thì set mặc định
                                                                el.val(el.find("option:first").val());
                                                            //}
                                                        }
                                                    }
                                                }
                                            });
                                        }
                                    }
                                    target.append(ctemp);
                                    //Call lại sự kiện change
                                    target.find("tr:eq(" + index + ")").find(".f_change_row,.f_change").each(function () {
                                        var el = jQuery(this);
                                        el.trigger("change");
                                    });
                                    index++;
                                };
                                Utils.updateInputDate(target);
                                Main.upEvent(target);
                                if (target.find(".autoSelect2").is(":visible")) {
                                    $("select.autoSelect2").select2();
                                }
                                Utils.setSuccess(form.data("import-success-massage"));
                                Main.autoIndex(target);
                                Utils.autoResize();
                                var itemCount = parseInt(jQuery(form.data("increase-index")).val());
                                itemCount += body.length;
                                jQuery(form.data("increase-index")).val(itemCount);
                                Utils.resetValidator(target.closest("form"));
                            }
                            else {
                                Utils.setError(form.data("empty-data"));
                            }
                        }
                    });
                }

            }
            return false;
        });
    },


};
jQuery(document).ready(function () {
    JobPage.init();
});