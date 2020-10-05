var Page = {

    init: function () {
        Page.onEvent();
        Page.upEvent();
    },

    upEvent: function (container) {
        if (Utils.isEmpty(container))
            container = jQuery(document);
    },

    onEvent: function () {

        jQuery(document).on("click", ".clickSort", function () {
            var data = jQuery(this).getData();
            window.location.href = Utils.getSorthref(data.sortname, data.sorttype == "1" ? 0 : 1);
        });

        jQuery(document).on("click", ".quickMore", function () {
            try {
                var node = jQuery(this);
                var data = jQuery(this).getData();
                if (typeof data.skip == 'undefined') {
                    data.skip = 0;
                }
                if (typeof data.take == 'undefined') {
                    data.take = 5;
                }
                data.skip = parseInt(data.skip) + parseInt(data.take);

                var target = node.attr("data-target");
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
                    },
                    complete: function () {
                    },
                    error: function () {

                    },
                    success: function (response) {
                        Utils.sectionBuilder(response);
                        if (response.hasOwnProperty("isCust"))
                        {
                            if (typeof data.isBefore == 'undefined')
                            {
                                jQuery(target).append(response.htCust);
                            }
                            else
                            {
                                jQuery(target).prepend(response.htCust);
                            }
                        }
                        if (parseInt(data.skip) + parseInt(data.take) >= parseInt(data.total)) {
                            node.addClass("hidden")
                        }
                        node.attr("data-skip", data.skip);
                        node.attr("data-take", data.take);
                    }
                });
            } catch (e) {

            }
            return false;
        });
    }
};
jQuery(document).ready(function () {
    Page.init();
});