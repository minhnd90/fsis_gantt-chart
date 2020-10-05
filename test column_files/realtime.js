var Realtime = {

    started: false,
    starting: false,
    callbacks: [],
    processer: null,


    start: function (callback, beforeCallback) {
        if (Realtime.started) {
            if (Utils.notEmpty(beforeCallback))
                beforeCallback();
            if (Utils.notEmpty(callback))
                callback();
            return;
        }
        if (Utils.notEmpty(callback)) {
            Realtime.callbacks.push(callback);
        }
        if (Realtime.starting) {
            if (typeof Realtime.processer == "undefined" && Utils.notEmpty(beforeCallback))
                beforeCallback();
            return;
        }
        Realtime.starting = true;
        Realtime.processer = jQuery.connection.Realtime;

        if (typeof Realtime.processer == "undefined")
            return;

        if (Utils.notEmpty(beforeCallback))
            beforeCallback();

        Realtime.processer.client.pageResponse = function (response) {
            Utils.sectionBuilder(response);
        };
        Realtime.processer.client.jobDiscussReceiver = function (response) {
            try {
                console.log(response);
                jQuery(".frmDiscuss[data-id='" + response.ID + "']").find(".lsDiscuss").prepend(response.Html);
            } catch (e) {
                console.log(e);
            }
        };
        Realtime.processer.client.reloadPage = function (response) {
            try {
                jQuery("#Breadcrumbdoc")
                    .find(".docParent")
                    .last().trigger("click");
            } catch (e) {
                console.log(e);
            }
        };
        jQuery.connection.hub.disconnected(function () {
            setTimeout(function () {
                jQuery.connection.hub.start({
                    jsonp: Utils.isChrome()
                }).done(function () {
                    Realtime.started = true;
                    Realtime.excCallback();
                });
            }, 5000);
        });
        jQuery.connection.hub.exceptionHandler = function (message) {
            
        };
        jQuery.connection.hub.start({
            jsonp: Utils.isChrome()
        }).done(function () {
            Realtime.started = true;
            Realtime.excCallback();
        }).fail(function () {
            Realtime.started = false;
            Realtime.starting = false;
        });
        window.onbeforeunload = function () {
            jQuery.connection.hub.stop();
        };
    },

    excCallback: function () {
        if (Utils.notEmpty(Realtime.callbacks)) {
            for (var i in Realtime.callbacks) {
                try {
                    Realtime.callbacks[i]();
                } catch (e) {
                    console.log(e);
                }
                try{
                    delete Realtime.callbacks[i];
                } catch (e) {
                    console.log(e);
                }
            }
        }
    }
};
