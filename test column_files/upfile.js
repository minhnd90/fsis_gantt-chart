var UpfilePage = {

    init: function () {

        UpfilePage.onEvent();
        UpfilePage.upEvent();
        jQuery(document).find(".clickAttachFile").each(function () {
            var parent = $(this).parent();
            $("input#QuickAttachfiles").remove();
            var file = "<input class=\"inputQuickImport hidden\" id=\"QuickAttachfiles\" multiple=\"multiple\" type=\"file\">";
            parent.append(file);
        });
    },

    onEvent: function () {

        jQuery(document).on("click", ".attachFile", function () {
            var target = jQuery(jQuery(this).attr("data-target"));
            if (jQuery(this).hasClass("attachSignFileBtn")) {
                target.attr("data-sign-check", 1);
            }
            else {
                target.attr("data-sign-check", 0);
            }
            var data = jQuery(this).getData();
            jQuery(data.rel).attr("data-target", data.target);
            jQuery(data.rel).attr("data-file-name", data.fileName);
            jQuery(data.rel).attr("data-file-path", data.filePath);
            jQuery(data.rel).attr("data-file-title", data.fileTitle);
            jQuery(data.rel).attr("data-file-url", data.fileUrl);
            jQuery(data.rel).attr("data-file-url", data.fileUrl);
            jQuery(data.rel).val("").trigger("click");

        });
        jQuery(document).on("click", ".attachMetadata", function () {
            var data = jQuery(this).getData();
            jQuery(data.rel).attr("data-href", data.href);
            jQuery(data.rel).attr("data-target", data.target);
            jQuery(data.rel).val("").trigger("click");
        });
        jQuery(document).on("click", ".delMember", function () {
            jQuery(this).closest(".member").slideUp("slow", function () {
                var form = jQuery(this).closest("form");
                var field = jQuery(this).closest("[data-bv-field]");
                var parent = jQuery(this).parent();
                if (!jQuery(this).hasClass("noRemoveParent")) {
                    if (parent.find(".member").length == 1) {
                        parent.addClass("hidden");
                    }
                }
                jQuery(this).remove();

                try {
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
        });
        jQuery(document).on("click", ".clickAttachFile", function () {
            var data = jQuery(this).getData();
            var inputUpfile = jQuery(data.rel);
            inputUpfile.attr("data-file-name", data.fileName);
            inputUpfile.attr("data-file-path", data.filePath);
            inputUpfile.attr("data-target", data.target);
            inputUpfile.attr("data-file-content", data.fileContent);
            inputUpfile.attr("data-click-by", data.clickBy);
            inputUpfile.attr("data-valid-extension", data.validExtension);
            inputUpfile.attr("data-valid-extension-mss", data.validExtensionMss);
            inputUpfile.attr("data-title", data.title);
            inputUpfile.attr("data-action", data.action);
            inputUpfile.attr("data-id-service-type", data.idServiceType);
            inputUpfile.val("").trigger("click");
            UpfilePage.upEvent();
        });

    },
    upEvent: function (container) {
        if (Utils.isEmpty(container))
            container = jQuery(document);

        container.find(".inputUpMetadata").each(function () {
            var obj = jQuery(this);
            if (!obj.hasClass("setUpFiled")) {
                obj.hasClass("setUpFiled");
                obj.ajaxUploader({
                    name: "FileDocument",
                    postUrl: function () {
                        return obj.attr("data-href");
                    },
                    onBegin: function (e, t) {
                        return true;
                    },
                    onClientLoadStart: function (e, file, t) {
                    },
                    onClientProgress: function (e, file, t) {
                    },
                    onServerProgress: function (e, file, t) {
                    },
                    onClientAbort: function (e, file, t) {
                    },
                    onClientError: function (e, file, t) {
                    },
                    onServerAbort: function (e, file, t) {
                    },
                    onServerError: function (e, file, t) {
                    },
                    onSuccess: function (e, file, t, data) {
                        var form = jQuery(obj.attr("data-target"));
                        for (var i in data) {
                            form.find("[name='" + i + "']").each(function () {
                                var type = jQuery(this).prop("type");
                                if ((type == "radio" || type == "checkbox") && jQuery(this).prop("value") == data[i]) {
                                    jQuery(this).prop("checked", true);
                                }
                                else if (jQuery(this).hasClass("editorSummernote")) {
                                    jQuery(this).val(data[i]);
                                    jQuery(this).code(data[i]);
                                }
                                else {
                                    jQuery(this).val(data[i]);
                                }
                            });
                            try {
                                if (form.hasClass("bootstrapValidator")) {
                                    form.bootstrapValidator('revalidateField', i);
                                }
                            } catch (e) { }
                        }
                    }
                });
            }
        });

        container.find(".inputUpFile").each(function (e) {
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
                        var targetObj = jQuery(dataObj.target);
                        targetObj.closest(".hidden").removeClass("hidden");
                        var rand = Date.now();
                        var maxItem = targetObj.attr("data-max-item");
                        if (Utils.isInteger(maxItem)) {
                            maxItem = parseInt(maxItem);
                            if (maxItem > 0) {
                                var fileItems = targetObj.find(".member");
                                var totalItem = fileItems.length;
                                if (totalItem >= maxItem) {
                                    var totalDel = maxItem - totalItem;
                                    for (var i in fileItems) {
                                        if (i <= totalDel) {
                                            jQuery(fileItems[i]).remove();
                                        }
                                    }
                                }
                            }
                        }

                        if (targetObj.hasClass("ui-group-item")) {
                            var item1 = jQuery(
                                "<div class='form-group has-feedback member isNew'>" +
                                "<div class='col-lg-12'>" +
                                "<input name='" + dataObj.filePath + "' type='hidden' value='" + data.FilePath + "'/>" +
                                "<input name='" + dataObj.fileName + "' type='text' class='form-control' data-bv-notempty-message='" + dataObj.bvNotemptyMessage + "' data-bv-notempty='true' data-bv-field='" + dataObj.fileName + "' value='" + data.FileName + "' />" +
                                "<i class='glyphicon glyphicon-remove delMember'></i>" +
                                "</div>" +
                                "</div>"
                            );
                            targetObj.removeClass("loading").append(item);
                            item.bootstrapValidator();
                        }
                        else {
                            var signCheckbox = "";
                            var isSignFile = targetObj.attr("data-is-sign");
                            var isSignCheck = targetObj.attr("data-sign-check");
                            var isdisabledCheck = targetObj.attr("data-disabled-check");
                            isSignFile = parseInt(isSignFile);
                            isSignCheck = parseInt(isSignCheck);
                            isdisabledCheck = parseInt(isdisabledCheck);
                            if (isSignFile == 1) {
                                console.log(isdisabledCheck);
                                var check = isSignCheck == 1 ? "checked" : null;
                                var disable = isdisabledCheck == 1 ? "disabled" : null;
                                signCheckbox =
                                    `<td class="wpx100">
                                        <label class="no-margin">
                                            <input type="checkbox" value="1" ${check} class="colored-success" ${disable} name="IsSignFile_${data.FilePath}">
                                            <span class="text">Trình ký</span>
                                        </label>
                                    </td>`;
                                var content = `<td class='wpx300'>
                                                    <span>
                                                        <input name='${dataObj.fileName}' class='fileNames' type='text' value='${data.FileName}' />
                                                    </span>
                                                        <input name='${dataObj.filePath}' class='filePaths' type='hidden' value='${data.FilePath}'/>
                                                </td>` +
                                    signCheckbox +
                                    `<td class='wpx50'>
                                                    <ul class='important_action_btn'>
                                                        <li>
                                                            <a class=' close delMember'>
                                                                <i class='btn fa fa-trash btn-danger'></i>
                                                            </a>
                                                        </li>
                                                    </ul>
                                                </td>`;
                                var wrapper = "<tr class='fileitem member isNew noRemoveParent'>" + content + "</tr>";
                                var item2 = jQuery(wrapper);
                                targetObj.removeClass("loading").append(item2);
                            }
                            else {
                                var serviceInfoFileID = parseInt(targetObj.attr('data-sInfoFile'));
                                var inputName = targetObj.attr('data-file-inputname')
                                var content = "";
                                if (serviceInfoFileID > 0) {
                                    content = "<img class='img-thumbnail' src='" + Cdata.SrcPath(data.FilePath) + "' title='" + data.FileName + "' />" +
                                        "<input name='" + dataObj.fileName + "' class='fileNames' type='text' value='" + data.FileName + "' />" +
                                        "<input name='" + dataObj.filePath + "' class='filePaths' type='hidden' value='" + data.FilePath + "'/>" +
                                        "<input name='" + inputName + "' class='filePaths' type='hidden' value='" + serviceInfoFileID + "'/>" +
                                        "<button type='button' class='btn btn-xs btn-link close delMember'>x</button>";
                                }
                                else {
                                    content = "<img class='img-thumbnail' src='" + Cdata.SrcPath(data.FilePath) + "' title='" + data.FileName + "' />" +
                                        "<input name='" + dataObj.fileName + "' class='fileNames' type='text' value='" + data.FileName + "' />" +
                                        "<input name='" + dataObj.filePath + "' class='filePaths' type='hidden' value='" + data.FilePath + "'/>" +
                                        "<button type='button' class='btn btn-xs btn-link close delMember'>x</button>";

                                }
                                var wrapper = "<span class='fileitem member isNew'>" + content + "</span>";
                                var item2 = jQuery(wrapper);
                                targetObj.removeClass("loading").append(item2);
                            }
                            Utils.autoResize();
                        }

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

        container.find(".inputUpFiles").each(function () {
            var obj = jQuery(this);
            if (!obj.hasClass("setUpFiled")) {
                obj.hasClass("setUpFiled");
                obj.ajaxUploader({
                    name: "FileDocument",
                    postUrl: Cdata.Storage.domain + "/uploader/upfile",
                    //elTarget: obj.attr("data-target"),
                    onBegin: function (e, elTarget) {
                        return true;
                    },
                    onClientLoadStart: function (e, file, t) {

                    },
                    onClientProgress: function (e, file) {
                        UpfilePage.onProgress(e, file);
                    },
                    onServerProgress: function (e, file, t) {
                        UpfilePage.onProgress(e, file);
                    },
                    onClientAbort: function (e, file) {
                        UpfilePage.onAbort(e, file);
                    },
                    onClientError: function (e, file) {
                        UpfilePage.onAbort(e, file);
                    },
                    onServerAbort: function (e, file, t) {
                        UpfilePage.onAbort(e, file);
                    },
                    onServerError: function (e, file, t) {
                        UpfilePage.onAbort(e, file);
                    },
                    onSuccess: function (e, file, t, data) {

                    }
                });
            }
        });
        container.find("#InputAvatar").each(function () {
            var obj = jQuery(this);
            if (!obj.hasClass("setUpFiled")) {
                obj.ajaxUploader({
                    name: "FileDocument",
                    dragBox: "#AvatarDrager",
                    postUrl: Cdata.Storage.domain + "/uploader/upfile",
                    onBegin: function () {
                        jQuery("#AvatarDrager").addClass("loading");
                        return true;
                    },
                    onChange: function () {
                        return true;
                    },
                    onDrop: function () {
                        return true;
                    },
                    onClientLoadStart: function () {
                    },
                    onClientProgress: function () {
                    },
                    onClientAbort: function () {
                        jQuery("#AvatarDrager").removeClass("loading");
                    },
                    onClientError: function () {
                        jQuery("#AvatarDrager").removeClass("loading");
                    },
                    onSuccess: function (e, file, dragbox, data) {
                        var html = "";
                        var thumbPath = "/thumb/120xauto/" + data.FilePath;
                        var avatarUrl = Cdata.Storage.domain + thumbPath + "?" + (new Date).getTime();
                        html += "<a class='imgavt'>";
                        html += "<img id='ImageAvatar' src='" + avatarUrl + "' />";
                        html += "</a>";
                        html += "<input type='hidden' name='Avatar' value='" + thumbPath + "' />";

                        jQuery("#AvatarDrager").removeClass("loading");
                        jQuery("#AvatarDrager").html(html);
                        jQuery("#ImageAvatar").load(function () {
                            AvatarPage.initCrop();
                        });
                    }
                });
            }
        });

        container.find(".inputQuickImport").each(function () {
            var obj = jQuery(this);
            var target = $(obj.attr("data-target"));
            var fileItemContain = $(obj.data("file-content"));
            var fileName = obj.data("file-name");
            var filePath = obj.data("file-path");
            var ext = obj.data("valid-extension");
            var extMss = obj.data("valid-extension-mss");
            if (!obj.hasClass("setUpFiled")) {
                obj.hasClass("setUpFiled");
                obj.ajaxUploader({
                    name: "FileDocument",
                    postUrl: Cdata.Storage.domain + "/uploader/upfile",
                    onBegin: function (e, t) {
                        return true;
                    },
                    onClientLoadStart: function (e, file, t) {
                    },
                    onClientProgress: function (e, file) {
                        target.addClass("loading");
                    },
                    onServerProgress: function (e, file, t) {
                        target.addClass("loading");
                    },
                    onClientAbort: function (e, file) {
                        target.addClass("loading");
                    },
                    onClientError: function (e, file) {
                        target.addClass("loading");
                    },
                    onServerAbort: function (e, file, t) {
                        target.addClass("loading");
                    },
                    onServerError: function (e, file, t) {
                        target.addClass("loading");
                    },
                    onSuccess: function (e, file, t, data) {

                        if (ext != undefined) {
                            if (!Utils.getExtension(data.FileName).split(",").includes(ext)) {
                                Utils.setError(extMss);
                                return;
                            }
                        }
                        target.removeClass("loading");
                        fileItemContain.html(
                            "<span class='fileitem member sortitem isNew'>" + "</br>" +
                            "<a class='text-blue'  target='_blank' href='" + Cdata.SrcPath(data.FilePath) + "' title='" + data.FileName + "'> " + data.FileName + "</a>" +
                            "<input name='" + fileName + "' class='fileNames' type='hidden' value='" + data.FileName + "'  />" +
                            "<input name='" + filePath + "' class='filePaths' type='hidden' value='" + data.FilePath + "'/>" +
                            "<button type='button' class='btn btn-xs btn-link close delMember'>x</button>" +
                            "</span>"
                        );
                        Utils.autoCloseAllFlash();
                        fileItemContain.removeClass("hidden");
                        var frm = jQuery(target);
                        Utils.resetValidator(frm);
                        frm.attr("title", obj.data("title"));
                        frm.attr("action", obj.data("action"));
                        frm.attr("data-id-service-type", obj.data("id-service-type"));

                        frm.trigger("submit");
                        //UpfilePage.dialogUp(frm, 600);
                    }
                });
            }
        });

    },
    upEventRow: function (row) {
        row.find(".datetime").datetimepicker({
            format: "d-m-Y H:i",
            lang: "vi",
            scrollInput: false
        });
    },
    onProgress: function (e, file) {
        var pc = Math.floor(100 * (e.loaded / e.total));
        var rowId = UpfilePage.getRowId(file.id, true);
        jQuery(rowId).find(".progress-bar").css("width", pc + "%");
        jQuery(rowId).find(".progress-label").text(pc + "%");
    },
    onAbort: function (e, file) {
        jQuery(UpfilePage.getRowId(file.id, true))
            .find(".upStatus")
            .html("<a href='#' class='loadfail' title='Tải tài liệu lên không thành công' ></a>");
    },
    getRowId: function (fileId, isSelector) {
        return (isSelector ? "#" : "") + "DocUploadR" + fileId;
    },
    dialogUp: function (elTarget, width) {
        elTarget.dialog({
            width: width || 350,
            autoOpen: true,
            resizable: false,
            open: function () {
                elTarget.fadeIn();
                Utils.openOverlay();
            },
            close: function () {
                jQuery(this).closest(".ui-dialog").removeClass("hiddenDialog");
                var hiddenDialogs = jQuery(document).find(".hiddenDialog");
                if (hiddenDialogs.length > 0) {
                    hiddenDialogs.last().removeClass("hidden");
                } else {
                    Utils.closeOverlay();
                }
            }
        });
    }
};
jQuery(document).ready(function () {
    UpfilePage.init();
})