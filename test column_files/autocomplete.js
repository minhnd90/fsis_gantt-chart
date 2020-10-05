var Autocomplete = {

    init: function (container) {
        Autocomplete.category(container);
        Autocomplete.user(container);
        Autocomplete.position(container);
        Autocomplete.positionCustom(container);
        Autocomplete.deptInPosition(container);
        Autocomplete.dept(container);
        Autocomplete.team(container);
        Autocomplete.provider(container);
        Autocomplete.role(container);
        Autocomplete.channel(container);
        Autocomplete.organ(container);
        Autocomplete.link(container);
        Autocomplete.item(container);
        Autocomplete.ocrForm(container);
        Autocomplete.htmlOthers(container);
        Autocomplete.doctype(container);
        Autocomplete.job(container);
        Autocomplete.step(container);
        Autocomplete.employee(container);
        Autocomplete.employeepart(container);
        Autocomplete.apiCategories(container);
    },
    default: function (container) {
        container.find(".autocompleteRoot").each(function () {
            var obj = jQuery(this);
            if (!jQuery(this).hasClass("inited")) {
                Utils.disableEnter(this);

                jQuery(this).addClass("inited");
                var dt = new Date().getTime();
                obj.nextAll().addBack().wrapAll("<div class='autocompleteRoot_parent" + dt + "'></div>");
                jQuery(this).autocomplete({
                    appendTo: ".autocompleteRoot_parent" + dt,
                    source: function (req, res) {
                        var dataPost = Utils.mergeFilter(obj, {
                            Term: req.term,
                            IDProject: obj.attr("data-id-project")
                        });

                        jQuery.ajax({
                            type: "POST",
                            async: true,
                            data: dataPost,
                            url: obj.attr("data-url"),
                            success: function (response) {
                                Autocomplete._source(res, response);
                                obj.next(".ui-autocomplete").perfectScrollbar();
                            }
                        });
                    },
                    open: function (event, ui) {
                        Autocomplete._open(event, ui);
                    },
                    select: function (a, b) {
                        if (!jQuery(this).hasClass("selectandadd")) {
                            return Autocomplete._selectItem(a, b, jQuery(this));
                        }
                        else {
                            return Autocomplete._selectItemAndAdd(a, b, jQuery(this));
                        }
                    },
                    delay: 350,
                    minLength: 0
                }).click(function () {
                    jQuery(this).autocomplete("search", "");
                }).autocomplete("instance")._renderItem = function (ul, item) {
                    return Autocomplete._renderItem(ul, item, jQuery(this.element));
                };
            }
        });
    },
    step: function (container) {

        container.find(".autocompleteStep").each(function () {
            if (!jQuery(this).hasClass("inited")) {
                Utils.disableEnter(this);

                jQuery(this).addClass("inited");
                jQuery(this).autocomplete({
                    appendTo: "body",
                    source: Autocomplete._sourceStep(),
                    open: function (event, ui) {
                        Autocomplete._open(event, ui);
                    },
                    select: function (a, b) {
                        return Autocomplete._selectAndClearAllItem(a, b, jQuery(this));
                    },
                    delay: 350,
                    minLength: 0
                }).click(function () {
                    jQuery(this).autocomplete("search", "");
                }).autocomplete("instance")._renderItem = function (ul, item) {
                    return Autocomplete._renderItem(ul, item, jQuery(this.element));
                };
            }
        });
    },
    job: function (container) {

        container.find(".autocompleteJob").each(function () {
            if (!jQuery(this).hasClass("inited")) {
                Utils.disableEnter(this);

                jQuery(this).addClass("inited");
                jQuery(this).autocomplete({
                    appendTo: "body",
                    source: function (req, res) {
                        jQuery.ajax({
                            type: "POST",
                            async: true,
                            data: { Term: req.term },
                            url: Utils.getDomain() + "/" + Cdata.VirtualPath + "/autocomplete/job.html",
                            success: function (response) {
                                Autocomplete._source(res, response);
                            }
                        });
                    },
                    open: function (event, ui) {
                        Autocomplete._open(event, ui);
                    },
                    select: function (a, b) {
                        return Autocomplete._selectItem(a, b, jQuery(this));
                    },
                    delay: 350,
                    minLength: 0
                }).click(function () {
                    jQuery(this).autocomplete("search", "");
                }).autocomplete("instance")._renderItem = function (ul, item) {
                    return Autocomplete._renderItem(ul, item, jQuery(this.element));
                };
            }
        });
    },

    channel: function (container) {

        container.find(".autocompleteChannel").each(function () {
            if (!jQuery(this).hasClass("inited")) {
                Utils.disableEnter(this);

                jQuery(this).addClass("inited");
                jQuery(this).autocomplete({
                    appendTo: "body",
                    source: function (req, res) {
                        jQuery.ajax({
                            type: "POST",
                            async: true,
                            data: { Term: req.term },
                            url: Utils.getDomain() + "/" + Cdata.VirtualPath + "/autocomplete/channel.html",
                            success: function (response) {
                                Autocomplete._source(res, response);
                            }
                        });
                    },
                    open: function (event, ui) {
                        Autocomplete._open(event, ui);
                    },
                    select: function (a, b) {
                        return Autocomplete._selectItem(a, b, jQuery(this));
                    },
                    delay: 350,
                    minLength: 0
                }).click(function () {
                    jQuery(this).autocomplete("search", "");
                }).autocomplete("instance")._renderItem = function (ul, item) {
                    return Autocomplete._renderItem(ul, item, jQuery(this.element));
                };
            }
        });
    },

    role: function (container) {

        container.find(".autocompleteRole").each(function () {
            if (!jQuery(this).hasClass("inited")) {
                Utils.disableEnter(this);

                var obj = jQuery(this);
                obj.addClass("inited");
                obj.autocomplete({
                    appendTo: "body",
                    source: function (req, res) {
                        jQuery.ajax({
                            type: "POST",
                            async: true,
                            data: { Term: req.term, IDNotIn: obj.attr("data-id-not-in") },
                            url: Utils.getDomain() + "/" + Cdata.VirtualPath + "/autocomplete/role.html",
                            success: function (response) {
                                Autocomplete._source(res, response);
                            }
                        });
                    },
                    open: function (event, ui) {
                        Autocomplete._open(event, ui);
                    },
                    select: function (a, b) {
                        return Autocomplete._selectItem(a, b, jQuery(this));
                    },
                    delay: 350,
                    minLength: 0
                }).click(function () {
                    jQuery(this).autocomplete("search", "");
                }).autocomplete("instance")._renderItem = function (ul, item) {
                    return Autocomplete._renderItem(ul, item, jQuery(this.element));
                };
            }
        });
    },

    provider: function (container) {

        container.find(".autocompleteProvider").each(function () {
            if (!jQuery(this).hasClass("inited")) {
                Utils.disableEnter(this);

                jQuery(this).addClass("inited");
                jQuery(this).autocomplete({
                    appendTo: "body",
                    source: function (req, res) {
                        jQuery.ajax({
                            type: "POST",
                            async: true,
                            data: { Term: req.term },
                            url: Utils.getDomain() + "/" + Cdata.VirtualPath + "/autocomplete/provider.html",
                            success: function (response) {
                                Autocomplete._source(res, response);
                            }
                        });
                    },
                    open: function (event, ui) {
                        Autocomplete._open(event, ui);
                    },
                    select: function (a, b) {
                        return Autocomplete._selectItem(a, b, jQuery(this));
                    },
                    delay: 350,
                    minLength: 0
                }).click(function () {
                    jQuery(this).autocomplete("search", "");
                }).autocomplete("instance")._renderItem = function (ul, item) {
                    return Autocomplete._renderItem(ul, item, jQuery(this.element));
                };
            }
        });
    },

    dept: function (container) {

        container.find(".autocompleteDept").each(function () {
            if (!jQuery(this).hasClass("inited")) {
                Utils.disableEnter(this);

                var obj = jQuery(this);
                obj.addClass("inited");
                obj.autocomplete({
                    appendTo: "body",
                    source: function (req, res) {
                        jQuery.ajax({
                            type: "POST",
                            async: true,
                            data: { Term: req.term, IDNotIn: obj.attr("data-id-not-in") },
                            url: Utils.getDomain() + "/" + Cdata.VirtualPath + "/autocomplete/dept.html",
                            success: function (response) {
                                Autocomplete._source(res, response);
                            }
                        });
                    },
                    open: function (event, ui) {
                        Autocomplete._open(event, ui);
                    },
                    select: function (a, b) {
                        return Autocomplete._selectItem(a, b, jQuery(this));
                    },
                    delay: 350,
                    minLength: 0
                }).click(function () {
                    jQuery(this).autocomplete("search", "");
                }).autocomplete("instance")._renderItem = function (ul, item) {
                    return Autocomplete._renderItem(ul, item, jQuery(this.element));
                };
            }
        });
    },

    team: function (container) {

        container.find(".autocompleteTeam").each(function () {
            if (!jQuery(this).hasClass("inited")) {
                Utils.disableEnter(this);

                var obj = jQuery(this);
                obj.addClass("inited");
                obj.autocomplete({
                    appendTo: "body",
                    source: function (req, res) {
                        jQuery.ajax({
                            type: "POST",
                            async: true,
                            data: { Term: req.term, IDNotIn: obj.attr("data-id-not-in") },
                            url: Utils.getDomain() + "/" + Cdata.VirtualPath + "/autocomplete/team.html",
                            success: function (response) {
                                Autocomplete._source(res, response);
                            }
                        });
                    },
                    open: function (event, ui) {
                        Autocomplete._open(event, ui);
                    },
                    select: function (a, b) {
                        return Autocomplete._selectItem(a, b, jQuery(this));
                    },
                    delay: 350,
                    minLength: 0
                }).click(function () {
                    jQuery(this).autocomplete("search", "");
                }).autocomplete("instance")._renderItem = function (ul, item) {
                    return Autocomplete._renderItem(ul, item, jQuery(this.element));
                };
            }
        });
    },
    position: function (container) {

        container.find(".autocompletePosition").each(function () {
            if (!jQuery(this).hasClass("inited")) {
                Utils.disableEnter(this);

                var obj = jQuery(this);
                obj.addClass("inited");
                obj.autocomplete({
                    appendTo: "body",
                    source: function (req, res) {
                        jQuery.ajax({
                            type: "POST",
                            async: true,
                            data: { Term: req.term, IDNotIn: obj.attr("data-id-not-in") },
                            url: Utils.getDomain() + "/" + Cdata.VirtualPath + "/autocomplete/position.html",
                            success: function (response) {
                                console.log(response)
                                Autocomplete._source(res, response);
                            }
                        });
                    },
                    open: function (event, ui) {
                        Autocomplete._open(event, ui);
                    },
                    select: function (a, b) {
                        return Autocomplete._selectItem(a, b, jQuery(this));
                    },
                    delay: 350,
                    minLength: 0
                }).click(function () {
                    jQuery(this).autocomplete("search", "");
                }).autocomplete("instance")._renderItem = function (ul, item) {
                    return Autocomplete._renderItem(ul, item, jQuery(this.element));
                };
            }
        });
    },
    positionCustom: function (container) {

        container.find(".autocompletePositionCustom").each(function () {
            if (!jQuery(this).hasClass("inited")) {
                Utils.disableEnter(this);

                var obj = jQuery(this);
                obj.addClass("inited");
                obj.autocomplete({
                    appendTo: "body",
                    source: function (req, res) {
                        jQuery.ajax({
                            type: "POST",
                            async: true,
                            data: { Term: req.term, IDNotIn: obj.attr("data-id-not-in") },
                            url: Utils.getDomain() + "/" + Cdata.VirtualPath + "/autocomplete/position.html",
                            success: function (response) {
                                Autocomplete._source(res, response);

                            }
                        });
                    },
                    open: function (event, ui) {
                        Autocomplete._open(event, ui);
                    },
                    select: function (a, b) {
                        return Autocomplete._selectItemCustom(a, b, jQuery(this));
                    },
                    delay: 350,
                    minLength: 0
                }).click(function () {
                    jQuery(this).autocomplete("search", "");
                }).autocomplete("instance")._renderItem = function (ul, item) {
                    return Autocomplete._renderItem(ul, item, jQuery(this.element));
                };
            }
        });
    },
    deptInPosition: function (container) {
        container.find(".autocompleteDeptInPosition").each(function () {
            if (!jQuery(this).hasClass("inited")) {
                Utils.disableEnter(this);

                var obj = jQuery(this);
                obj.addClass("inited");
                obj.autocomplete({
                    appendTo: "body",
                    source: function (req, res) {
                        jQuery.ajax({
                            type: "POST",
                            async: true,
                            data: { Term: req.term, IDNotIn: obj.attr("data-id-not-in") },
                            url: Utils.getDomain() + "/" + Cdata.VirtualPath + "/autocomplete/dept.html",
                            success: function (response) {
                                console.log(response)
                                Autocomplete._source(res, response);
                            }
                        });
                    },
                    open: function (event, ui) {
                        Autocomplete._open(event, ui);
                    },
                    select: function (a, b) {
                        return Autocomplete._selectItem(a, b, jQuery(this));
                    },
                    delay: 350,
                    minLength: 0
                }).click(function () {
                    jQuery(this).autocomplete("search", "");
                }).autocomplete("instance")._renderItem = function (ul, item) {
                    return Autocomplete._renderItem(ul, item, jQuery(this.element));
                };
            }
        });
    },
    user: function (container) {

        container.find(".autocompleteUser").each(function () {
            var obj = jQuery(this);
            if (!jQuery(this).hasClass("inited")) {
                Utils.disableEnter(this);

                jQuery(this).addClass("inited");
                var dt = new Date().getTime();
                obj.nextAll().addBack().wrapAll("<div class='autocompleteUser_parent" + dt + "'></div>");
                jQuery(this).autocomplete({
                    appendTo: ".autocompleteUser_parent" + dt,
                    source: function (req, res) {
                        var dataPost = Utils.mergeFilter(obj, {
                            Term: req.term,
                            IDProject: obj.attr("data-id-project")
                        });

                        jQuery.ajax({
                            type: "POST",
                            async: true,
                            data: dataPost,
                            url: Utils.getDomain() + "/" + Cdata.VirtualPath + "/autocomplete/auser.html",
                            success: function (response) {
                                Autocomplete._source(res, response);
                                obj.next(".ui-autocomplete").perfectScrollbar();
                                //console.log("DONE");
                            }
                        });
                    },
                    open: function (event, ui) {
                        Autocomplete._open(event, ui);
                    },
                    select: function (a, b) {
                        if (!jQuery(this).hasClass("selectandadd")) {
                            return Autocomplete._selectItem(a, b, jQuery(this));
                        }
                        else {
                            return Autocomplete._selectItemAndAdd(a, b, jQuery(this));
                        }
                    },
                    delay: 350,
                    minLength: 0
                }).click(function () {
                    jQuery(this).autocomplete("search", "");
                }).autocomplete("instance")._renderItem = function (ul, item) {
                    return Autocomplete._renderItem(ul, item, jQuery(this.element));
                };
            }
        });
    },

    category: function (container) {

        container.find(".autocompleteCategory").each(function () {
            var obj = jQuery(this);
            if (!jQuery(this).hasClass("inited")) {
                Utils.disableEnter(this);

                jQuery(this).addClass("inited");
                jQuery(this).autocomplete({
                    appendTo: "body",
                    source: function (req, res) {
                        jQuery.ajax({
                            type: "POST",
                            async: true,
                            data: { Term: req.term, type: obj.attr("data-type"), Code: obj.attr("data-code"), IDNotIn: obj.attr("data-id-not-id") },
                            url: Utils.getDomain() + "/" + Cdata.VirtualPath + "/autocomplete/category.html",
                            success: function (response) {
                                Autocomplete._source(res, response);
                            }
                        });
                    },
                    open: function (event, ui) {
                        Autocomplete._open(event, ui);
                    },
                    select: function (a, b) {
                        return Autocomplete._selectItem(a, b, jQuery(this));
                    },
                    delay: 350,
                    minLength: 0
                }).click(function () {
                    jQuery(this).autocomplete("search", "");
                }).autocomplete("instance")._renderItem = function (ul, item) {
                    return Autocomplete._renderItem(ul, item, jQuery(this.element));
                };
            }
        });
    },

    organ: function (container) {

        container.find(".autocompleteOrgan").each(function () {
            if (!jQuery(this).hasClass("inited")) {
                Utils.disableEnter(this);

                jQuery(this).addClass("inited");
                jQuery(this).autocomplete({
                    appendTo: "body",
                    source: function (req, res) {
                        jQuery.ajax({
                            type: "POST",
                            async: true,
                            data: { Term: req.term },
                            url: Utils.getDomain() + "/" + Cdata.VirtualPath + "/autocomplete/organ.html",
                            success: function (response) {
                                Autocomplete._source(res, response);
                            }
                        });
                    },
                    open: function (event, ui) {
                        Autocomplete._open(event, ui);
                    },
                    select: function (a, b) {
                        return Autocomplete._selectItem(a, b, jQuery(this));
                    },
                    delay: 350,
                    minLength: 0
                }).click(function () {
                    jQuery(this).autocomplete("search", "");
                }).autocomplete("instance")._renderItem = function (ul, item) {
                    return Autocomplete._renderItem(ul, item, jQuery(this.element));
                };
            }
        });
    },

    link: function (container) {

        container.find(".autocompleteLink").each(function () {
            if (!jQuery(this).hasClass("inited")) {
                Utils.disableEnter(this);

                jQuery(this).addClass("inited");
                jQuery(this).autocomplete({
                    appendTo: "body",
                    source: function (req, res) {
                        jQuery.ajax({
                            type: "POST",
                            async: true,
                            data: { Term: req.term },
                            url: Utils.getDomain() + "/" + Cdata.VirtualPath + "/autocomplete/link.html",
                            success: function (response) {
                                Autocomplete._source(res, response);
                            }
                        });
                    },
                    open: function (event, ui) {
                        Autocomplete._open(event, ui);
                    },
                    select: function (a, b) {
                        return Autocomplete._selectItem(a, b, jQuery(this));
                    },
                    delay: 350,
                    minLength: 0
                }).click(function () {
                    jQuery(this).autocomplete("search", "");
                }).autocomplete("instance")._renderItem = function (ul, item) {
                    return Autocomplete._renderItem(ul, item, jQuery(this.element));
                };
            }
        });
    },

    item: function (container) {

        container.find(".autocompleteItem").each(function () {
            var obj = jQuery(this);
            if (!obj.hasClass("inited")) {
                Utils.disableEnter(this);

                obj.addClass("inited");
                obj.autocomplete({
                    appendTo: "body",
                    source: function (req, res) {
                        jQuery.ajax({
                            type: "POST",
                            async: true,
                            data: { Term: req.term, type: obj.attr("data-type") },
                            url: Utils.getDomain() + "/" + Cdata.VirtualPath + "/autocomplete/item.html",
                            success: function (response) {
                                Autocomplete._source(res, response);
                            }
                        });
                    },
                    open: function (event, ui) {
                        Autocomplete._open(event, ui);
                    },
                    select: function (a, b) {
                        return Autocomplete._selectItem(a, b, jQuery(this));
                    },
                    delay: 350,
                    minLength: 0
                }).click(function () {
                    jQuery(this).autocomplete("search", "");
                }).autocomplete("instance")._renderItem = function (ul, item) {
                    return Autocomplete._renderItem(ul, item, jQuery(this.element));
                };
            }
        });
    },
    ocrForm: function (container) {

        container.find(".autocompleteOcrForm").each(function () {
            Utils.disableEnter(this);

            var obj = jQuery(this);
            if (obj.data('uiAutocomplete')) {
                jQuery(this).autocomplete("destroy");
            }
            obj.autocomplete({
                appendTo: "body",
                source: function (req, res) {
                    jQuery.ajax({
                        type: "POST",
                        async: true,
                        data: { Term: req.term, IDNotIn: obj.attr("data-id-not-in") },
                        url: Utils.getDomain() + "/" + Cdata.VirtualPath + "/autocomplete/ocr-form.html",
                        success: function (response) {
                            Autocomplete._source(res, response);
                        }
                    });
                },
                open: function (event, ui) {
                    Autocomplete._open(event, ui);
                },
                select: function (a, b) {
                    return Autocomplete._selectItem(a, b, jQuery(this));
                },
                delay: 350,
                minLength: 0
            }).click(function () {
                jQuery(this).autocomplete("search", "");
            }).autocomplete("instance")._renderItem = function (ul, item) {
                return Autocomplete._renderItem(ul, item, jQuery(this.element));
            };
        });
    },
    employee: function (container) {

        container.find(".autocompleteEmployee").each(function () {
            var obj = jQuery(this);

            if (!jQuery(this).hasClass("inited")) {
                jQuery(this).addClass("inited");
                jQuery(this).autocomplete({
                    appendTo: "body",
                    source: function (req, res) {
                        jQuery.ajax({
                            type: "POST",
                            async: true,
                            data: {
                                Term: req.term,
                            },
                            url: Utils.getDomain() + "/" + Cdata.VirtualPath + "/ork/employee",
                            success: function (response) {
                                Autocomplete._source(res, response);
                                obj.next(".ui-autocomplete").perfectScrollbar();
                                console.log("DONE");
                            }
                        });
                    },
                    close: function () {
                        Autocomplete._closeDialog(jQuery(this));
                    },
                    open: function (event, ui) {
                        Autocomplete._open(event, ui);
                    },
                    select: function (a, b) {
                        return Autocomplete._selectItem(a, b, jQuery(this));
                    },
                    delay: 350,
                    minLength: 0
                }).click(function () {
                    jQuery(this).autocomplete("search", "");
                }).autocomplete("instance")._renderItem = function (ul, item) {
                    return Autocomplete._renderItem(ul, item, jQuery(this.element));
                };
            }
        });
    },
    employeepart: function (container) {

        container.find(".autocompleteEmployeepart").each(function () {
            var obj = jQuery(this);

            if (!jQuery(this).hasClass("inited")) {
                jQuery(this).addClass("inited");
                jQuery(this).autocomplete({
                    appendTo: "body",
                    source: function (req, res) {
                        jQuery.ajax({
                            type: "POST",
                            async: true,
                            data: {
                                Term: req.term,
                            },
                            url: Utils.getDomain() + "/" + Cdata.VirtualPath + "/ork/employeepart",
                            success: function (response) {
                                Autocomplete._source(res, response);
                                obj.next(".ui-autocomplete").perfectScrollbar();
                                console.log("DONE");
                            }
                        });
                    },
                    close: function () {
                        Autocomplete._closeDialog(jQuery(this));
                    },
                    open: function (event, ui) {
                        Autocomplete._open(event, ui);
                    },
                    select: function (a, b) {
                        return Autocomplete._selectItem(a, b, jQuery(this));
                    },
                    delay: 350,
                    minLength: 0
                }).click(function () {
                    jQuery(this).autocomplete("search", "");
                }).autocomplete("instance")._renderItem = function (ul, item) {
                    return Autocomplete._renderItem(ul, item, jQuery(this.element));
                };
            }
        });
    },
    doctype: function (container) {

        container.find(".autocompleteDoctype").each(function () {
            if (!jQuery(this).hasClass("inited")) {
                Utils.disableEnter(this);

                var obj = jQuery(this);
                obj.addClass("inited");
                obj.autocomplete({
                    appendTo: "body",
                    source: function (req, res) {
                        jQuery.ajax({
                            type: "POST",
                            async: true,
                            data: { Term: req.term, IDNotIn: obj.attr("data-id-not-in") },
                            url: Utils.getDomain() + "/" + Cdata.VirtualPath + "/autocomplete/doctype.html",
                            success: function (response) {
                                Autocomplete._source(res, response);
                            }
                        });
                    },
                    open: function (event, ui) {
                        Autocomplete._open(event, ui);
                    },
                    select: function (a, b) {
                        return Autocomplete._selectItem(a, b, jQuery(this));
                    },
                    delay: 350,
                    minLength: 0
                }).click(function () {
                    jQuery(this).autocomplete("search", "");
                }).autocomplete("instance")._renderItem = function (ul, item) {
                    return Autocomplete._renderItem(ul, item, jQuery(this.element));
                };
            }
        });
    },
    htmlOthers: function (container) {

        container.find(".autocompleteHtmlOther").each(function () {
            var obj = jQuery(this);
            Utils.disableEnter(this);

            if (obj.data('uiAutocomplete')) {
                jQuery(this).autocomplete("destroy");
            }
            obj.autocomplete({
                appendTo: "body",
                source: function (req, res) {
                    jQuery.ajax({
                        type: "POST",
                        async: true,
                        data: { Term: req.term, IDNotIn: obj.attr("data-id-not-in") },
                        url: Utils.getDomain() + "/" + obj.attr("data-href"),
                        success: function (response) {

                            Utils.sectionBuilder(response);
                            if (response.hasOwnProperty("isCust")) {
                                jQuery(obj.attr("data-target")).html(response.htCust);
                            }

                            res();
                        }
                    });
                },
                open: function (event, ui) {
                },
                select: function (a, b) {
                },
                delay: 350,
                minLength: 0
            });
        });
    },


    apiCategories: function (container) {

        container.find(".autocompleteApiCategories").each(function () {
            if (!jQuery(this).hasClass("inited")) {
                Utils.disableEnter(this);
                var obj = jQuery(this);
                var type = obj.attr('data-api-type');
                obj.addClass("inited");
                obj.autocomplete({
                    appendTo: "body",
                    source: function (req, res) {
                        jQuery.ajax({
                            type: "POST",
                            async: true,
                            data: { Term: req.term, Type: type },
                            url: Utils.getDomain() + "/" + Cdata.VirtualPath + "/autocomplete/api-categories.html",
                            success: function (response) {
                                Autocomplete._source(res, response);
                            }
                        });
                    },
                    open: function (event, ui) {
                        Autocomplete._open(event, ui);
                    },
                    select: function (a, b) {
                        return Autocomplete._selectItemApi(a, b, jQuery(this));
                    },
                    delay: 350,
                    minLength: 0
                }).click(function () {
                    jQuery(this).autocomplete("search", "");
                }).autocomplete("instance")._renderItem = function (ul, item) {
                    return Autocomplete._renderItem(ul, item, jQuery(this.element));
                };
            }
        });
        container.find(".autocompleteSelect2").each(function () {
            if (!jQuery(this).hasClass("inited")) {
                Utils.disableEnter(this);
                var obj = jQuery(this);
                var url = obj.attr("data-url");
                var token = obj.attr("data-token");
                console.log(url)
                var type = obj.attr('data-api-type');
                obj.addClass("inited");
                obj.autocomplete({
                    appendTo: "body",
                    source: function (req, res) {
                        jQuery.ajax({
                            type: "POST",
                            async: true,
                            data: { Term: req.term, Type: type, Token: token },
                            url: url,
                            success: function (response) {
                                console.log(response);
                                Autocomplete._sourceSelect2(res, response);
                            }
                        });
                    },
                    open: function (event, ui) {
                        Autocomplete._open(event, ui);
                    },
                    select: function (a, b) {
                        return Autocomplete._selectItemApi(a, b, jQuery(this));
                    },
                    delay: 350,
                    minLength: 0
                }).click(function () {
                    jQuery(this).autocomplete("search", "");
                }).autocomplete("instance")._renderItem = function (ul, item) {
                    return Autocomplete._renderItem(ul, item, jQuery(this.element));
                };
            }
        });
    },

    _sourceStep: function () {
        if (Utils.notEmpty(jQuery('input[name="StepData"]').val())) {
            var items = [];
            var data = JSON.parse(jQuery('input[name="StepData"]').val());
            for (var i in data) {
                var item = data[i];
                var itemA = {
                    value: item.Name,
                    label: item.Name,
                    id: item.ID,
                    desc: ""
                };
                if (typeof item.Parents != "undefined")
                    itemA.desc = item.Parents;

                items.push(itemA);
            }
            return items;
        } else {
            return [];
        }
    },
    _source: function (res, response) {
        if (Utils.notEmpty(response.data)) {
            var items = [];
            for (var i in response.data) {
                var item = response.data[i];
                var itemA = {
                    value: item.Name,
                    label: item.Name,
                    id: item.ID,
                    desc: ""
                };
                if (typeof item.Parents != "undefined")
                    itemA.desc = item.Parents;

                items.push(itemA);
            }
            res(items);
        } else {
            Utils.sectionBuilder(response);
            res();
        }
    },
    _sourceSelect2: function (res, response) {
        if (Utils.notEmpty(response.Data)) {
            var items = [];
            var datas = response.Data.Categories;
            for (var i in datas) {
                var item = datas[i];
                var itemA = {
                    value: item.Name,
                    label: item.Name,
                    id: item.ID,
                    desc: ""
                };
                if (typeof item.Parents != "undefined")
                    itemA.desc = item.Parents;

                items.push(itemA);
            }
            res(items);
        } else {
            Utils.sectionBuilder(response);
            res();
        }
    },
    _open: function (event, ui) {
        var $input = jQuery(event.target),
            $results = $input.autocomplete("widget"),
            top = $input.offset().top,
            height = $results.css({ height: "auto" }).height(),
            inputHeight = $input.height(),
            bodyHeight = jQuery('body').height();
        if ((top + height + inputHeight) > bodyHeight) {
            var h = (bodyHeight - top + inputHeight - 50);
            if (h > 150)
                $results.css({ height: h + "px" });
        }
    },

    _selectItem: function (a, b, el) {
        var isInWorkflow = el.attr("data-in-workflow");
        var name = el.attr("data-name");
        var target = el.attr("data-target");
        var targetId = el.attr("data-targetid");
        if (!Utils.isEmpty(targetId)) {
            jQuery(targetId).val(b.item.id);

            setTimeout(function () {
                try {
                    var form = el.closest("form");
                    if (form.hasClass("bootstrapValidator")) {
                        form.bootstrapValidator('revalidateField', el.attr("name"));
                    }

                } catch (e) { }
            }, 300);
        }
        if (!Utils.isEmpty(target)) {
            var item = jQuery(target).find(".scrollItem[data-id='" + b.item.id + "']");

            if (item.length == 0) {
                if (false) {
                    item = `<div class='scrollItem tickGroup isNew item' data-id='${b.item.id}'  style='display: none'>
                                <div class="col-sm-8">
                                    <div class="checkbox">
                                        <label>
                                            <input checked type="checkbox" value="${b.item.id}" class="colored-success tickItem" name="${name}" id="Rand${(new Date()).getTime()}">
                                                <span class="nowrap text">${b.item.label}</span>
                                        </label>
                                    </div>
                                </div>
                                <div class="col-sm-4">
                                    <div class="checkbox">
                                        <label>
                                            <input  type="checkbox" value="${b.item.id}" class="colored-success tickItem" name="Replace${name}" id="Rand${(new Date()).getTime()}">
                                                <span class="nowrap text">Luân chuyển</span>
                                        </label>
                                    </div>
                                    <button type="button" class="btn btn-xs btn-link close deleteItem">x</button>
                                </div>
                            </div>`;
                }
                else {
                    item = '<div class="scrollItem tickGroup isNew item" data-id="' + b.item.id + '" style="display: none">' +
                        '<div class="col-sm-12">' +
                        '<div class="checkbox">' +
                        '<label>' +
                        '<input checked type="checkbox" value="' + b.item.id + '" class="colored-success tickItem" name="' + name + '" id="Rand' + (new Date()).getTime() + '">' +
                        '<span class="nowrap text">' + b.item.label + '</span>' +
                        '</label>' +
                        '</div>' +
                        '<button type="button" class="btn btn-xs btn-link close deleteItem">x</button>' +
                        '</div>' +
                        '</div>';
                }

            }
            else {
                item.css('display', 'none').find("input[type='checkbox']").prop("checked", true);
            }
            jQuery(target).prepend(jQuery(item).fadeIn("1000"));

            try {
                var form = el.closest("form");
                if (form.hasClass("bootstrapValidator")) {
                    form.bootstrapValidator('revalidateField', jQuery(target).attr("name"));
                }
                var step = jQuery(el.attr("data-step"));
                FlowChart.validateStep(step, false);
            } catch (e) { }

            el.val("");
            return false;
        }
        return true;
    },
    _selectAndClearAllItem: function (a, b, el) {
        var name = el.attr("data-name");
        var target = el.attr("data-target");
        var targetId = el.attr("data-targetid");
        if (!Utils.isEmpty(targetId)) {
            jQuery(targetId).val(b.item.id);

            setTimeout(function () {
                try {
                    var form = el.closest("form");
                    if (form.hasClass("bootstrapValidator")) {
                        form.bootstrapValidator('revalidateField', el.attr("name"));
                    }

                } catch (e) { }
            }, 300);
        }
        if (!Utils.isEmpty(target)) {
            var item = jQuery(target).find(".scrollItem[data-id='" + b.item.id + "']");
            jQuery(target).empty();
            if (item.length == 0) {
                item = '<div class="scrollItem tickGroup isNew item" data-id="' + b.item.id + '" style="display: none">' +
                    '<div class="col-sm-12">' +
                    '<div class="checkbox">' +
                    '<label>' +
                    '<input checked type="checkbox" value="' + b.item.id + '" class="colored-success tickItem" name="' + name + '" id="Rand' + (new Date()).getTime() + '">' +
                    '<span class="nowrap text">' + b.item.label + '</span>' +
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

            try {
                var form = el.closest("form");
                if (form.hasClass("bootstrapValidator")) {
                    form.bootstrapValidator('revalidateField', jQuery(target).attr("name"));
                }
                var step = jQuery(el.attr("data-step"));
                FlowChart.validateStep(step, false);
            } catch (e) { }

            el.val("");
            return false;
        }
        return true;
    },
    _selectItemCustom: function (a, b, el) {
        var name = el.attr("data-name");

        var target = el.attr("data-target");
        var targetId = el.attr("data-targetid");
        var targetExecutor = el.attr("data-executor");
        var updateRegister = el.attr("data-is-updateRegister");
        var placeholder = el.attr("data-placeholder");
        if (!Utils.isEmpty(targetId)) {
            jQuery(targetId).val(b.item.id);

            setTimeout(function () {
                try {
                    var form = el.closest("form");
                    if (form.hasClass("bootstrapValidator")) {
                        form.bootstrapValidator('revalidateField', el.attr("name"));
                    }
                } catch (e) { }
            }, 300);
        }
        if (!Utils.isEmpty(target)) {
            var d = new Date();//undefined
            var item = jQuery(target).find(".scrollItem[data-id='" + b.item.id + "']");
            var clone = jQuery("#DeptSelectTemplate").clone();
            var select = clone.find("select");
            select.attr('name', 'DeptofIDPosition' + b.item.id + '_Executor' + targetExecutor);
            select.attr('id', 'DeptofIDPosition' + b.item.id + '_' + d.getTime());
            if (!select.hasClass('DeptofIDPosition' + b.item.id))
                select.addClass('DeptofIDPosition' + b.item.id);
            var clone2 = jQuery("#StepSelectTemplate").clone();
            var select2 = clone2.find("select");

            select2.attr('name', 'StepofIDPosition' + b.item.id + '_Executor' + targetExecutor);
            select2.attr('id', 'StepofIDPosition' + b.item.id);
            updateRegister = parseInt(updateRegister);
            if (updateRegister == 1) {
                select.attr('name', 'DeptofIDPosition' + b.item.id);
                select2.attr('name', 'StepofIDPosition' + b.item.id);

            }
            if (item.length == 0) {
                item = `<div class="scrollItem tickGroup isNew item" data-id="${b.item.id}" style="display: none">
                            <div class="col-sm-12">
                                <div class="checkbox col-sm-4">
                                   <label>
                                        <input checked type="checkbox" value=" ${b.item.id}" class="colored-success tickItem" name="${name}" id="${"Rand" + (new Date()).getTime()}"/>
                                        <span class="nowrap text">${ b.item.label}</span>
                                    </label> 
                                </div>
                                <div class="col-sm-6">
                                    ${clone.html()}
                                </div>
                                <div class="col-sm-6 hidden" id="hiddenObject${b.item.id}">
                                    ${clone2.html()}
                                </div>
                                <button type="button" class="btn btn-xs btn-link close deleteItem">x</button>
                            </div>
                        </div>`;

            }
            else {
                item.css('display', 'none').find("input[type='checkbox']").prop("checked", true);
            }
            if (jQuery(target).hasClass("acceptOnce")) {
                jQuery(target).empty();
                jQuery(target).append(jQuery(item).fadeIn("1000"));
            }
            else {
                jQuery(target).prepend(jQuery(item).fadeIn("1000"));
            }

            jQuery('.' + 'DeptofIDPosition' + b.item.id).selectpicker();
            jQuery('#' + 'StepofIDPosition' + b.item.id).selectpicker();
            jQuery('#' + 'StepofIDUserPosition' + b.item.id).selectpicker();

            jQuery('.' + 'DeptofIDPosition' + b.item.id).on("changed.bs.select", function () {
                var selected = jQuery(this);
                jQuery('#' + 'hiddenObject' + b.item.id).addClass("hidden");
                if (selected && selected.val() == "-2" && selected.hasClass("hasDeptofStepExecutor")) {
                    jQuery('#' + 'hiddenObject' + b.item.id).removeClass("hidden");
                }
            });






            try {
                var form = el.closest("form");
                if (form.hasClass("bootstrapValidator")) {
                    form.bootstrapValidator('revalidateField', jQuery(target).attr("name"));
                }
                var step = jQuery(el.attr("data-step"));
                FlowChart.validateStep(step, false);
            } catch (e) { }

            el.val("");
            return false;
        }
        return true;
    },
    _selectItemAndAdd: function (a, b, el) {
        var name = el.attr("data-name");
        var target = el.attr("data-target");
        var targetId = el.attr("data-targetid");
        var addselector = el.attr("data-add-selector");
        if (!Utils.isEmpty(targetId)) {
            jQuery(targetId).val(b.item.id);

            setTimeout(function () {
                try {
                    var form = el.closest("form");
                    if (form.hasClass("bootstrapValidator")) {
                        form.bootstrapValidator('revalidateField', el.attr("name"));
                    }
                } catch (e) { }
            }, 300);
        }
        if (!Utils.isEmpty(target)) {
            var item = jQuery(target).find(".scrollItem[data-id='" + b.item.id + "']");
            if (item.length == 0) {
                item = '<div class="scrollItem tickGroup isNew item" data-id="' + b.item.id + '" style="display: none">' +
                    '<div class="col-sm-12">' +
                    '<div class="checkbox">' +
                    '<label>' +
                    '<input checked type="checkbox" value="' + b.item.id + '" class="colored-success tickItem" name="' + name + '" id="Rand' + (new Date()).getTime() + '">' +
                    '<span class="nowrap text">' + b.item.label + '</span>' +
                    '</label>' +
                    '</div>' +
                    '<button type="button" class="btn btn-xs btn-link close deleteItem removeonselect" data-add-selector="' + addselector + '">x</button>' +
                    '</div>' +
                    '</div>';
                if (!Utils.isEmpty(addselector)) {

                    jQuery(addselector).append('<option value="' + b.item.id + '">' + b.item.label + '</option>');
                }
            }
            else {
                item.css('display', 'none').find("input[type='checkbox']").prop("checked", true);
            }

            jQuery(target).prepend(jQuery(item).fadeIn("1000"));

            try {
                var form = el.closest("form");
                if (form.hasClass("bootstrapValidator")) {
                    form.bootstrapValidator('revalidateField', jQuery(target).attr("name"));
                }
            } catch (e) { }

            el.val("");
            return false;
        }
        return true;
    },
    _renderItem: function (ul, item, el) {
        return jQuery("<li class='itemf' style='width: " + el.width() + "px'>")
            .append("<div><a title='" + item.label + "'>" + item.label + "</a></div><div class='detail' title='" + item.desc + "'>" + item.desc + "</div>")
            .appendTo(ul);
    },

    _selectItemApi: function (a, b, el) {
        var url = el.attr("data-url");
        var target = el.attr("data-target");
        var targetId = el.attr("data-targetid");
        if (!Utils.isEmpty(targetId)) {
            jQuery(targetId).val(b.item.id);
            setTimeout(function () {
                try {
                    var form = el.closest("form");
                    if (form.hasClass("bootstrapValidator")) {
                        form.bootstrapValidator('revalidateField', el.attr("name"));
                    }

                } catch (e) { }
            }, 300);
        }
        if (!Utils.isEmpty(url)) {
            var data = el.getDataUppername();
            data.IDApi = b.item.id;

            jQuery.ajax({
                type: "POST",
                async: true,
                url: url,
                data: data,
                beforeSend: function () {
                    jQuery(target).html("").addClass("loading");
                },
                complete: function () {
                    jQuery(target).removeClass("loading");
                },
                error: function () {
                    jQuery(target).removeClass("loading");
                },
                success: function (response) {
                    jQuery(target).removeClass("loading");
                    if (response.hasOwnProperty("isCust")) {
                        jQuery(target).html(response.htCust);
                    }
                    Utils.updateScrollBar(jQuery(target).closest(".useScrollBar "));
                }
            });


        }
        return true;
    },
    reinit: function (container) {
        container.find(".inited.ui-autocomplete-input").each(function () {
            jQuery(this).removeClass("inited").removeClass("ui-autocomplete-input");
            Autocomplete.init(container);
        });
    }
};