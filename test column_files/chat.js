var MessageProfile = {
    np: 4,
    ticker: 0,
    selectuser: null,
    insertBefore: false,

    init: function () {

        MessageProfile.setCurrentUser();

        Realtime.start(function () {
            MessageProfile.selectDefault();
            MessageProfile.onlines();
        }, function () {
            MessageProfile.chatEvents();
        });
        MessageProfile.ntfs();
        MessageProfile.send();
        MessageProfile.search();
        MessageProfile.filters();
        MessageProfile.formChat();
        MessageProfile.selectChat();
        MessageProfile.scrollbars();
        MessageProfile.loadMoreMsg();
    },
    
    filters: function(){

        jQuery("#slContactFilter").selectbox({
            effect: "slide",
            onChange: function (val, inst) {
                var req = {
                    type: val,
                    page: "pageUsChContact",
                    term: jQuery("#FindChat").val()
                }
                jQuery.ajax({
                    type: "POST",
                    async: false,
                    url: Utils.getDomain() + "/" + (Cdata.VirtualPath + "/chat/search-user.html").trim('/'),
                    data: req,
                    beforeSend: function () {
                    },
                    complete: function () {
                    },
                    error: function () {
                    },
                    success: function (response) {
                        try {
                            jQuery(".ifind-right").removeClass("hidden");
                            jQuery("#navigationContacts").find("ul").html(response.htCust);

                            MessageProfile.onlines();
                            MessageProfile.selectChat();
                            MessageProfile.scrollbars();

                        } catch (e) {
                            console.log(e);
                        }
                    }
                });
            }
        });
        jQuery("#slRecentFilter").selectbox({
            effect: "slide",
            onChange: function (val, inst) {
                var req = {
                    type: val,
                    page: "pageUsChRecent",
                    term: jQuery("#FindChat").val()
                }
                jQuery.ajax({
                    type: "POST",
                    async: false,
                    url: Utils.getDomain() + "/" + (Cdata.VirtualPath + "/chat/search-recent.html").trim('/'),
                    data: req,
                    beforeSend: function () {
                    },
                    complete: function () {
                    },
                    error: function () {
                    },
                    success: function (response) {
                        try {
                            jQuery(".ifind-right").removeClass("hidden");
                            jQuery("#navigationusers").find("ul").html(response.htCust);

                            MessageProfile.onlines();
                            MessageProfile.selectChat();
                            MessageProfile.scrollbars();

                        } catch (e) {
                            console.log(e);
                        }
                    }
                });
            }
        });

        jQuery("#navigationContacts").on("click", ".plPerfect", function () {
            Perfect.fire(jQuery(this), jQuery(this).getData(), function (response) {
                if (response.hasOwnProperty("isCust"))
                    jQuery("#navigationContacts").find("ul").html(response.htCust);
                    MessageProfile.onlines();
                    MessageProfile.scrollbars();
            });
            return false;
        });
        jQuery("#navigationusers").on("click", ".plPerfect", function () {
            Perfect.fire(jQuery(this), jQuery(this).getData(), function (response) {
                if (response.hasOwnProperty("isCust"))
                    jQuery("#navigationusers").find("ul").html(response.htCust);
                    MessageProfile.onlines();
                    MessageProfile.scrollbars();
            });
            return false;
        });
        jQuery(document).on("click", ".closechat", function () {
            jQuery("#BlockMyCh").removeClass("miniBox").addClass("hidden");
            return false;
        });
    },

    loadMoreMsg: function () {

        jQuery(document).on("click", ".load-more-msg", function () {

            var eventObject = jQuery(this);
            var msgCount = eventObject
                .closest(".ul-messages")
                .find(".item-message")
                .length;

            var pageIndex;
            var pageSize;
            var mod = msgCount % MessageProfile.np;
            if (mod === 0) {
                pageSize = MessageProfile.np;
                pageIndex = msgCount / MessageProfile.np + 1;
            } else {
                pageIndex = 2;
                pageSize = msgCount;
            }
            /*get message*/
            MessageProfile.insertBefore = true;
            Realtime.processer.server.messageGet({
                Sender: MessageProfile.selectuser,
                TotalNew: 0,
                Pagination: { PageIndex: pageIndex, PageSize: pageSize }
            });

            eventObject.addClass("loading");
            return false;
        });
    },

    chatEvents: function () {
        /*online listener*/
        Realtime.processer.client.online = function (uids) {
            for (var i in uids) {
                if (uids.hasOwnProperty(i)) {
                    if (uids[i]) {
                        jQuery(".user-online-status[data-id='" + i + "']").addClass("is_online");
                    } else {
                        jQuery(".user-online-status[data-id='" + i + "']").removeClass("is_online");
                    }
                }
            }
        };

        Realtime.processer.client.notificationReceiver = function (response) {

            var currTotal = jQuery("#NtfUnread").attr('data-value');
            if (currTotal == "") currTotal = 0;
            var unreadTotal = parseInt(currTotal) + parseInt(response.Total);
            jQuery("#NtfUnread").attr("data-value", unreadTotal).text("+ " + unreadTotal);
            jQuery("#NtfContainer").prepend(jQuery(response.Html).hide().delay(1000).fadeIn("2000")).scrollTop(0);
        };

        Realtime.processer.client.messageView = function (response) {
            MessageProfile.view(response);
        };

        Realtime.processer.client.messageReceive = function (response) {
            /*
             * Append message realtime 
             * vào trong formchat
             * */
            var setting = {
                Message: response.Message,
                Sender: response.Sender,
                ReceiverId: response.Sender.Uid
            };
            MessageProfile.appendmsg(setting);
            MessageProfile.scrollbars();

            /*
             * Nếu sender message khác với user đang chat cùng owner
             * Cộng số message chưa đọc vào thông tin sender, Và cộng tổng số message chưa đọc vào header.
             * Ngược lại thì update message đã read.
             * */
            var inputChat = jQuery("#boxmessagelist");
            var chatCurrent = jQuery("#chatarea").find("input[name='receiver']").val();
            if (parseInt(chatCurrent) !== parseInt(response.Sender.Uid) || !inputChat.is(":visible")) {
                /*increment unread*/
                var numNewMessage = jQuery("#navigationusers").find("li[data-id='" + response.Sender.Uid + "']").find(".num-new-message");
                var txtNewMessage = jQuery("#navigationusers").find("li[data-id='" + response.Sender.Uid + "']").find(".txt-new-message");
                if (numNewMessage.length > 0) {
                    var count = parseInt(numNewMessage.text()) + 1;
                    if (isNaN(count)) {
                        count = 1;
                    }
                    numNewMessage
                        .attr("data-value", count)
                        .text(count)
                        .removeClass("hidden");
                    txtNewMessage.html(Smile.smiles(Utils.getSumary(response.Message, 20)));
                }
                else
                {
                    MessageProfile.appendUser(response);
                }

                var totalNumNewMessage = parseInt(jQuery("#ChatUnread").attr("data-value")) + 1;
                if (isNaN(totalNumNewMessage)) {
                    totalNumNewMessage = 1;
                }
                jQuery("#ChatUnread")
                    .attr("data-value", totalNumNewMessage)
                    .text(totalNumNewMessage)
                    .removeClass("hidden");
                MessageProfile.beep();
            }
            else {
                /*update read*/
                var numNewMessage = jQuery("#navigationusers").find("li[data-id='" + response.Sender.Uid + "']").find(".num-new-message");
                var txtNewMessage = jQuery("#navigationusers").find("li[data-id='" + response.Sender.Uid + "']").find(".txt-new-message");
                if (numNewMessage.length > 0) {
                    var count = parseInt(numNewMessage.text());
                    if (isNaN(count)) {
                        count = 0;
                    }
                    numNewMessage
                        .attr("data-value", count)
                        .text(count)
                        .removeClass("hidden");
                    txtNewMessage.html(Smile.smiles(Utils.getSumary(response.Message, 20)));

                    var totalNumNewMessage = parseInt(jQuery("#ChatUnread").attr("data-value")) - count;
                    if (isNaN(totalNumNewMessage)) {
                        totalNumNewMessage = 0;
                    }
                    totalNumNewMessage = totalNumNewMessage < 0 ? 0 : totalNumNewMessage;
                    jQuery("#ChatUnread")
                        .attr("data-value", totalNumNewMessage)
                        .text(totalNumNewMessage)
                        .removeClass("hidden");
                }

                Realtime.processer.server.messageRead({
                    SenderId: response.Sender.Uid
                });
            }
        };

    },

    beep: function () {
        jQuery("#AudioChat")[0].play();
    },

    isChrome: function () {
        return navigator.userAgent.toLowerCase().indexOf("chrome") > -1;
    },

    setCurrentUser: function () {
        MessageProfile.currentuser = Cdata.CUser;
    },

    view: function (data) {
        /*
		 * Sắp xếp lại message
		 * theo thời gian từ trên xuống dưới
		 * (Bởi vì khi lấy ra là lấy từ mới tới cũ nên cần sắp xếp lại trước khi show ra)
		 * */
        var messages = [];
        var i;
        if (MessageProfile.insertBefore) {
            messages = data.Messages;
        } else {
            for (i in data.Messages) {
                if (data.Messages.hasOwnProperty(i)) {
                    messages.unshift(data.Messages[i]);
                }
            }
        }
        var setting;
        for (i in messages) {
            if (messages.hasOwnProperty(i)) {

                var item = messages[i];
                var user;
                if (parseInt(item.Sender) === parseInt(data.Sender.Uid)) {
                    user = data.Sender;
                } else {
                    user = data.Receiver;
                }
                setting = {
                    Created: (new Date(Date.parse(item.Created.replace(" ", "T")))),
                    Message: item.Message,
                    Sender: user,
                    ReceiverId: data.Sender.Uid
                };
                MessageProfile.appendmsg(setting);
            }
        }
        /*
		 * Nếu không tồn tại message
		 * Show formchat empty.
		 * */
        var length = messages.length;
        if (length === 0) {
            setting = {
                Message: null,
                Sender: data.Sender,
                ReceiverId: data.Sender.Uid
            };
            MessageProfile.appendmsg(setting);
        }
            /*
             *Hien thi nut xem them
             **/
        else if (length === parseInt(data.Pagination.PageSize)) {
            jQuery("#multiboxchat")
                .find(".ul-messages[data-id='" + data.Sender.Uid + "']")
                .prepend("<li class='load-more-msg'>xem thêm</li>");
        }
        /*
         *Trang thai online
         **/
        if (data.IsOnline) {
            jQuery(".user-online-status[data-id='" + data.Sender.Uid + "']").addClass("is_online");
        } else {
            jQuery(".user-online-status[data-id='" + data.Sender.Uid + "']").removeClass("is_online");
        }
        MessageProfile.scrollbars();
        MessageProfile.insertBefore = false;
    },

    appendUser: function (response) {

        jQuery("#navigationusers").find("ul").prepend("<li data-value='" + JSON.stringify(response.Sender) + "' data-id='" + response.Sender.Uid + "' >" +
	        "<div class='line-item-user'>" +
		        "<span class='left-avatar-user'>" +
			        "<img height='35' src='/Thumb/60x60/" + response.Sender.Avatar + "'>" +
		        "</span>" +
		        "<span class='left-info-user'>" +
			        "<span class='left-user-name'>" + response.Sender.Name + "</span>" +
			        "<span data-id='" + response.Sender.Uid + "' class='user-online-status is_online'></span>"+
                    "<span class='left-user-msg'>" +
				        "<span class='txt-new-message'>" + response.Message + "</span>" +
				        "<sup class='num-new-message' value='1'>1</sup>" +
			        "</span>" +
		        "</span>" +
	        "</div>" +
        "</li>");
    },

    appendmsg: function (setting) {

        var html = "";
        var css = "left";
        /*
		 * Nếu tồn tại message
		 * thì định dạng message html trước khi append.
		 * */
        if (setting.Message != null) {
            /*
			 * Nếu là message owner gửi đi,
			 * Show message đó bên phải.
			 * */
            if (parseInt(setting.Sender.Uid) === parseInt(MessageProfile.currentuser.Uid)) {
                css = "right";
            }
            if (typeof setting.Created == "undefined") {
                setting.Created = (new Date());
            }
            /*
			 * Định dạng datetime 
			 * theo dạng form chat.
			 * */
            if (jQuery("#chatarea").hasClass("chat-single")) {
                setting.CreatedTitle = jQuery.format.date(setting.Created, "dd-MM-yyyy HH:mm:ss");
                setting.Created = jQuery.format.date(setting.Created, "HH:mm:ss");
            } else {
                setting.CreatedTitle = jQuery.format.date(setting.Created, "dd-MM-yyyy HH:mm:ss");
                setting.Created = jQuery.format.date(setting.Created, "dd-MM-yyyy HH:mm:ss");
            }

            html = "<li class='item-message'><div class='line-item-user'>" +
                        "<span class='rightchat-info-user " + css + "' >" +
                            "<span class='arrow'></span>" +
                            "<span class='rightchat-user-name '><a class='rightchat-link-profile plPerfect' title='" + setting.Sender.Name + "'  href='#' data-id='" + setting.Sender.Uid + "' data-page='pageUsPrHome' ><img height='35px' src='" + Cdata.Storage.domain + "/Thumb/120x120/" + setting.Sender.Avatar + "' /></a></span>" +
                            "<span class='rightchat-user-msg'>" + Smile.smiles(setting.Message) + "</span>" +
                            "<span class='chat-time' title='" + setting.CreatedTitle + "'>" + setting.Created + "</span>" +
                        "</span>" +
                    "</div></li>";
        }

        /*
		 * Nếu  tồn tại boxchat giữa user và sender thì sẽ append message
		 * Còn ngược lại, tạo mới sau đó append message
		 * */
        var boxchat = jQuery("#multiboxchat").find("ul[data-id='" + setting.ReceiverId + "'].ul-messages");
        if (boxchat.length > 0) {

            boxchat
                .removeClass("hidden")
                .find(".load-more-msg")
                .remove();
            if (MessageProfile.insertBefore) {
                boxchat.prepend(html);
            } else {
                boxchat.append(html);
            }
        } else {
            jQuery("#multiboxchat").append("<ul class='ul-messages hidden' data-id='" + setting.ReceiverId + "'>" + html + "</ul>");
        }

        /*Nếu chat hiện tại không phải là sender của message thì sẽ hidden*/
        var chatCurrent = jQuery("#chatarea").find("input[name='receiver']").val();
        if (parseInt(chatCurrent) !== parseInt(setting.ReceiverId)) {
            jQuery("#multiboxchat").find("ul[data-id='" + setting.ReceiverId + "'].ul-messages").addClass("hidden");
        } else {
            jQuery("#multiboxchat").find("ul[data-id='" + setting.ReceiverId + "'].ul-messages").removeClass("hidden");
        }
        return;
    },

    ntfs: function(){

        jQuery(document).on('mouseover', ".ntfit.unread", function () {
            try {
                var data = jQuery(this).removeClass("unread").getData();
                var currTotal = jQuery("#NtfUnread").attr('data-value');
                if (currTotal == "" || currTotal == "0")
                    return;

                var unreadTotal = parseInt(currTotal) - 1;
                jQuery("#NtfUnread").attr("data-value", unreadTotal).text(unreadTotal);
                Realtime.processer.server.notificationRead({
                    Id: data.id
                });
            } catch (e) {
                console.log(e);
            }
        });
    },

    send: function () {

        jQuery(document).on("submit", "form.form-chat-data", function () {

            try {
                var message = jQuery(this).find("textarea[name='message']").val();
                var receiverId = jQuery("#chatarea").find("input[name='receiver']").val();

                if (jQuery.trim(message) === "") {
                    return false;
                }

                /*
				 * Append message vào trong box chat giữ user và receiver,
				 * và scrollto bottom
				 * */
                var setting = {
                    Message: message,
                    Sender: MessageProfile.currentuser,
                    ReceiverId: receiverId
                };
                MessageProfile.appendmsg(setting);
                MessageProfile.scrollbars();

                /*
				 * Gửi message cho receiver 
				 * thông qua nodejs nếu connected.
				 * Nếu connected = false, 
				 * emit sẽ tự động send message thông qua ajax.
				 * */
                Realtime.processer.server.messageSent({
                    ReceiverId: receiverId,
                    Message: message
                });

                /*
				 * Reset message text
				 * Disable form submit.
				 * */
                jQuery(this).find("textarea[name='message']").val("");

            } catch (e) {
                console.log(e);
            }

            return false;
        });
    },

    entersend: function (textarea, frmChat) {

        /*
		 * Gán sự kiện enter send message
		 * */
        textarea.unbind("keydown");
        jQuery("#SecRtContent").on("keydown", textarea, function (e) {
            var key = e.charCode ? e.charCode : e.keyCode ? e.keyCode : 0;
            if (key === 13) {
                try {
                    frmChat.trigger("submit");
                } catch (ex) {
                }
                return false;
            }
            return true;
        });
    },

    formChat: function () {

        /*
		 * Kiểm tra nếu entersend = checked
		 * Gán sự kiện enter cho textarea.
		 * Ngược lại, sự kiện enter đó sẽ được remove.
		 * */
        jQuery("textarea[name='message']").unbind();
        jQuery("form.form-chat-data").each(function () {
            if (jQuery(this).find("input[name='entersend']").prop("checked")) {
                MessageProfile.entersend(jQuery(this).find("textarea[name='message']"), jQuery(this));
            }
        });

        /*
		 * Khi entersend thay đổi lựa chọn,
		 * Nếu entersend = check, gán sự kiện enter cho textarea và hidden button send.
		 * Ngược lại thì remove sự kiện enter của textarea và show button send.
		 * */
        jQuery(document).on("change", "input[name='entersend']", function () {
            var formChat = jQuery(this).closest("form.form-chat-data");
            if (jQuery(this).prop("checked")) {
                formChat.find(".box-btn-send").addClass("hidden");
                MessageProfile.entersend(formChat.find("textarea[name='message']"), formChat);
            } else {
                formChat.find(".box-btn-send").removeClass("hidden");
                formChat.find("textarea[name='message']").unbind("keydown");
            }
        });
        jQuery("input[name='entersend']").trigger("change");
    },

    isDefault: true,
    selectChat: function () {

        /*
		 * Chọn user nào thì show message 
		 * & thông tin tương ứng với user đó.
		 * */
        jQuery(document).on("click", "#navigationusers li, #navigationContacts li", function () {

            if (MessageProfile.isDefault == false) {
                var blockItem = jQuery(this).closest(".blockitem");
                if (blockItem.hasClass("zoom-in")) {
                    blockItem.find(".btn-zoom").trigger("click");
                }
            }
            MessageProfile.isDefault = false;
            if (jQuery(this).hasClass("active")) {
                MessageProfile.updateTotal();
                return false;
            };
            MessageProfile.focusChat(jQuery(this));

            return false;
        });

        /*
		 * Trong trường hợp gửi message 
		 * ở bất kỳ page nào
		 * */
        jQuery(document).on("click", ".sendmessage", function () {
            MessageProfile.focusChat(jQuery(this));
            return false;
        });
        jQuery(document).on("click", ".chat-close", function () {
            jQuery(this).closest("#chatarea").addClass("hidden").find("input[name='receiver']").val("");
        });
    },

    isLoading: function (isLoad) {
        if (isLoad)
            jQuery("#boxmessagelist").addClass("loading");
        else
            jQuery("#boxmessagelist").removeClass("loading");
    },

    selectDefault: function () {

        /*Hiển thị mặc định user chat trên cùng*/
        if (jQuery("#navigationusers").is(":visible") && jQuery("#navigationusers").find("li").length > 0) {
            MessageProfile.isLoading(true);
            jQuery("#navigationusers").find("li").first().trigger("click");
        }
        else if (jQuery("#navigationContacts").is(":visible") && jQuery("#navigationContacts").find("li").length > 0) {
            MessageProfile.isLoading(true);
            jQuery("#navigationContacts").find("li").first().trigger("click");
        }
    },


    focusChat: function (element) {

        if (element == null || element.length === 0) {
            return;
        }

        /*
		 * Thiết lập thông tin tương ứng user được chọn 
		 * vào trong form chat.
		 * */
        var flag = true;
        var count = 0;
        var totalNumNewMessage = parseInt(jQuery(".total-num-new-message").text());
        var selectuser = jQuery.parseJSON(element.attr("data-value"));

        /*
		 * Update trạng thái message đã đọc 
		 * nếu tồn tại message chưa đọc
		 * */
        jQuery("#chatarea").removeClass("hidden");
        jQuery("#chatarea").find(".chat-name").attr("data-id", selectuser.Uid);
        jQuery("#chatarea").find(".chat-name").html("<a data-id='" + selectuser.Uid + "' data-page='pageUsPrHome' class='plPerfect' href='#' title='" + selectuser.Name + "' >" + selectuser.Name + "</a>");
        jQuery("#chatarea").find("input[name='receiver']").val(selectuser.Uid);
        jQuery("#navigationusers").find("li").removeClass("active");
        jQuery("#navigationContacts").find("li").removeClass("active");
        
        /*
		 * Nếu có hiện thì số message mới
		 * Khi đó cần update lại số lượng message mới
		 * */

        if (element.find(".num-new-message").length > 0) {
            count = element.find(".num-new-message").text();
            totalNumNewMessage = (totalNumNewMessage - parseInt(count));
            jQuery(".box-userlist").find("li[data-id='" + element.attr("data-id") + "']")
                .addClass("active").find(".num-new-message").addClass("hidden").text(0);

            if (totalNumNewMessage > 0) {
                jQuery(".total-num-new-message").text(totalNumNewMessage).removeClass("hidden");
            } else {
                jQuery(".total-num-new-message").text(0).addClass("hidden");
            }
        }

        /*
		 * Kiểm tra
		 * Nếu tồn tại formchat gữa user và receiver thì show formchat đó.
		 * Ngược lại, lấy thông tin message thông qua nodejs.
		 * */
        jQuery("#multiboxchat").find(".ul-messages").addClass("hidden").each(function () {
            if (parseInt(jQuery(this).attr("data-id")) === parseInt(selectuser.Uid)) {
                flag = false;
                jQuery(this).removeClass("hidden");
            }
        });

        if (flag) {
            /*get message*/
            Realtime.processer.server.messageGet({
                Sender: selectuser,
                TotalNew: parseInt(count),
                Pagination: { PageIndex: 1, PageSize: MessageProfile.np }
            }).done(function () {
                MessageProfile.isLoading(false);
            });
            /*
            .done(function (result) {
                MessageProfile.view(result);
            });
            */
        } else if (parseInt(count) > 0) {
            /*update read*/
            Realtime.processer.server.messageRead({
                SenderId: selectuser.Uid
            }).done(function () {
                MessageProfile.isLoading(false);
            });
            MessageProfile.updateTotal();
            jQuery("#multiboxchat")
                .find(".ul-messages[data-id='" + selectuser.Uid + "']")
                .prepend("<li class='load-more-msg'>xem thêm</li>");
        }
        MessageProfile.selectuser = selectuser;
        MessageProfile.scrollbars();

        if (element.hasClass("miniChat")) {
            jQuery("#BlockMyCh").addClass("miniBox zoom-in")
                .removeClass("hidden zoom-out")
                .find(".btn-zoom")
                .removeClass("zooming");
        }
    },

    updateTotal: function(){

        var totalUnread = 0;
        jQuery(".num-new-message").each(function () {
            totalUnread += parseInt(jQuery(this).text());
        });
        jQuery("#ChatUnread").attr("data-value", totalUnread).text(totalUnread);
    },

    onlines: function () {

        var uids = new Array();
        jQuery(".user-online-status").each(function () {
            var uid = jQuery(this).attr("data-id");
            uids.push(uid);
        });
        if (uids.length > 0) {
            Realtime.processer.server.online({
                Sender: MessageProfile.currentuser,
                Uids: uids
            });
        }
    },
    search: function () {

        jQuery("#FindChat").unbind();
        jQuery("#FindChat").autocomplete({
            source: function (req, res) {
                
                jQuery.ajax({
                    type: "POST",
                    async: false,
                    url: Utils.getDomain() + "/" + (Cdata.VirtualPath + "/chat/search-user.html").trim('/'),
                    data: req,
                    beforeSend: function () {
                    },
                    complete: function () {
                    },
                    error: function () {
                    },
                    success: function (response) {
                        try {
                            jQuery(".ifind-right").removeClass("hidden");
                            jQuery("#navigationContacts").find("ul").html(response.htCust);
                            jQuery(".tabitem[data-tab='#navigationContacts']").trigger("click");
                            var sb = jQuery("#slContactFilter").val(1).attr("sb");
                            jQuery("#sbSelector_" + sb).text(jQuery("#slContactFilter").find("option").first().text());

                            MessageProfile.onlines();
                            MessageProfile.selectChat();
                            MessageProfile.scrollbars();
                        } catch (e) {
                            console.log(e);
                        }
                        res([]);
                    }
                });
            },
            delay: 350,
            minLength: 0,
            select: function () {
                return false;
            },
            focus: function () {
                return false;
            }
        });
    },

    scrollbars: function () {

        if (!MessageProfile.insertBefore) {
            jQuery("#boxmessagelist").perfectScrollbar({}, "destroy");
            jQuery("#navigationusers").perfectScrollbar({}, "destroy");
            jQuery("#navigationContacts").perfectScrollbar({}, "destroy");
            jQuery("#boxmessagelist").scrollTop(jQuery("#multiboxchat").height());

            jQuery("#boxmessagelist").perfectScrollbar();
            jQuery("#navigationusers").perfectScrollbar();
            jQuery("#navigationContacts").perfectScrollbar();
        }
    }
};
jQuery(document).ready(function () {
    try {
        MessageProfile.init();
    } catch (e) {
    }
});