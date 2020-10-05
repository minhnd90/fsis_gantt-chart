var Admin = {
    init: function () {

        Admin.upEvent();
        Admin.onEvent();
        Admin.triggers();
    },
    upEvent: function (container) {

    },
    onEvent: function () {

        jQuery(document).on("change", ".changeSLUpdate", function () {
            var data = jQuery(this).getDataUppername();
            var url = jQuery(this).attr("data-url");
            if (!Utils.isEmpty(url))
            {
                data["Value"] = jQuery(this).val();
                jQuery.ajax({
                    type: "POST",
                    async: true,
                    url: url,
                    data: data,
                    success: function (response) {

                    }
                });
            }
        });
        
        jQuery(document).on("click", ".addFormItem", function () {

            var form = jQuery(this).closest("form");
            var tpl = form.find(".tplFormItem").last().clone();
            tpl.removeClass("has-error");
            tpl.find(".form-control").each(function(){
                jQuery(this).val("");
                var orginName = jQuery(this).attr("data-originname");
                jQuery(this).attr("Name", orginName);
                jQuery(this).attr("data-bv-field", orginName);
            });
            tpl.find(".deleteAnswer").removeClass("hidden");
            tpl.find(".help-block").css("display", "none");
            tpl.find(".form-control-feedback").css("display", "none").removeClass("glyphicon").removeClass("glyphicon-remove");
            jQuery(tpl).insertAfter(form.find(".tplFormItem").last());
        });
        jQuery(document).on("click", ".deleteAnswer", function () {
            jQuery(this).closest(".answerItem").remove();
        });
    },

    triggers: function () {
    }
};
jQuery(document).ready(function () {
    Admin.init();
});