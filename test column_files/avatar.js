var AvatarPage = {
    init: function () {

        AvatarPage.onEvent();
    },
    onEvent: function () {

        jQuery(document).on("submit", "#FrmAvatar", function () {
            return false;
        });
        jQuery(document).on("click", ".avatarSelecter", function () {
            jQuery("#InputAvatar").trigger("click");
            return false;
        });
        jQuery(document).on("click", ".avatarChanger", function () {
            jQuery("#FrmAvatar").dialog("open");
            return false;
        });
        jQuery(document).on("click", "#SmtAvatar", function () {

            var avatar = jQuery("#FrmAvatar").find("input[name='Avatar']");
            if (Utils.isEmpty(avatar)) {
                return false;
            }
            try
            {
                var data = jQuery("#FrmAvatar").serializeJSON();
                var action = jQuery("#FrmAvatar").attr("action");
                jQuery.ajax({
                    type: "POST",
                    async: true,
                    url: action,
                    data: data,
                    beforeSend: function () {
                    },
                    complete: function () {
                    },
                    error: function () {
                    },
                    success: function (response) {
                        Utils.sectionBuilder(response);
                        if (response.hasOwnProperty("isErr") == false) {
                            jQuery(".myavatar").attr("src", response.data.avatarUrl);
                        }
                    }
                });

            } catch (e) { }

            return false;
        });
    },

    initCrop: function () {

        jQuery(function () {
            jQuery("#ImageAvatar").Jcrop({
                onChange: function (c) {
                    jQuery("#X1").val(c.x);
                    jQuery("#Y1").val(c.y);
                    jQuery("#X2").val(c.x2);
                    jQuery("#Y2").val(c.y2);
                    jQuery("#Width").val(c.w);
                    jQuery("#Height").val(c.h);
                },
                onSelect: function (c) {
                    jQuery("#X1").val(c.x);
                    jQuery("#Y1").val(c.y);
                    jQuery("#X2").val(c.x2);
                    jQuery("#Y2").val(c.y2);
                    jQuery("#Width").val(c.w);
                    jQuery("#Height").val(c.h);
                },
                canResize: false,
                allowSelect: false,
                setSelect: [
                    (jQuery("#ImageAvatar").width() - 120) / 2,
                    (jQuery("#ImageAvatar").height() - 120) / 2,
                    120,
                    120
                ]
            });
        });
    },
};
jQuery(document).ready(function () {
    AvatarPage.init();
})