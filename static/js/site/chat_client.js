$(document).ready(function () {
    var socket = io.connect("/chat");

    socket.on('connect', function () {
        console.log(" connected");
        socket.emit('join', {"user": userlogged});
    });

    socket.on('message', messaged);

    socket.on('disconnect', function () {
        console.log(" disconnect")
    });

    $('#channel-list').on('click', '.channel', function () {
        active_chat(this.id, 'channel');
        activeChannel.name = this.id;
        activeChannel.type = "room";
        ReloadRoom(activeChannel.name);
        socket.emit('subcribe', {"room": activeChannel.name});
        CheckReadedRoom(activeChannel.name);
    });

    $('#im-list').on('click.select_member', '.member', function () {
        active_chat($(this).attr('data-name'), 'user');
        if (activeChannel.type == 'room') {
            socket.emit('unsubcribe', {"room": activeChannel.name});
        }
        activeChannel.name = $(this).attr("data-name");
        activeChannel.type = "private";
        Reload(activeChannel.name);
        CheckReaded(activeChannel.name);
    });

    //input
    $("#message-input").keypress(function (e) {
        if (e.which == 13) {
            var msg = $(this).val().trim();
            if (msg) {
                var message = $(this).val();
                if (activeChannel.type == "private") {
                    socket.emit('message', {
                        action: "message",
                        user_to: activeChannel.name,
                        message: $(this).val().trim(),
                        user_from: userlogged
                    });
                }
                if (activeChannel.type == "room") {
                    socket.emit('messagechanel', {
                        action: "message",
                        room: activeChannel.name,
                        message: $(this).val().trim(),
                        user_from: userlogged
                    });
                }

                $("#message-input").val("");
                e.preventDefault();
                var date = $(".day_container:last").find('ts-message:last').attr('data-date');
                var day = new Date(date).getDate();
                if (day == new Date().getDate()) {
                    var elemt = $(".day_container:last").find('.day_msgs');
                    if (elemt.length) {
                        elemt.append(ts_message(userImage, userlogged, message, new Date().toISOString()));
                    }
                }
                else {
                    var day_container = $("<div class='day_container'></div>");
                    day_container.append(date_divider(new Date()));
                    var day_msgs = $("<div class='day_msgs'></div>");
                    day_msgs.append(ts_message(userImage, userlogged, message, new Date().toISOString()));
                    day_container.append(day_msgs);

                    $("#msgs_div").append(day_container);
                }

                var heigth = $("#msgs_scroller_div").offset().top + $("#msgs_div").height() + $('#end_div').height();

                $("#msgs_scroller_div").animate({scrollTop: heigth}, 200);

            }

        }

    });
});

var messaged = function (data) {
    switch (data.action) {
        case 'error':
            console.log('error', data);
            break;
        case 'join':
            console.log('join', data);
            break;
        case 'connected':
            console.log('connected', data);
            break;
        case 'leave':
            console.log('leave', data);
            break;
        case 'call_join_request':
            console.log('call_join_request', data);
            openIncomingCall(data);
            break;
        case 'message':
            console.log('message', data);
            if (( data.room == activeChannel.name) || ( data.user_from == activeChannel.name)) {

                var date = $(".day_container:last").find('ts-message:last').attr('data-date');
                var day = new Date(date).getDate();

                if (day == new Date().getDate()) {
                    var elemt = $(".day_container:last").find('.day_msgs');
                    if (elemt.length) {
                        elemt.append(ts_message(data.image, data.user_from, data.message, data.date_pub));
                    }
                } else {
                    var day_container = $("<div class='day_container'></div>");
                    day_container.append(date_divider(new Date()));
                    var day_msgs = $("<div class='day_msgs'></div>");
                    day_msgs.append(ts_message(data.image, data.user_from, data.message, data.date_pub));
                    day_container.append(day_msgs);

                    $("#msgs_div").append(day_container);
                }

                var heigth = $("#msgs_scroller_div").offset().top + $("#msgs_div").height() + $('#end_div').height();
                $("#msgs_scroller_div").animate({scrollTop: heigth}, 200);
            }

            break;
        case 'system':
            console.log('message', data);
            break;
    }
};

var onDataLoaded = function (data) {
    if (data.length > 0) {
        var container = $("#msgs_div");
        var currentday = -1;
        var currentday_container = "";
        var date = $(".day_container:first").find('ts-message:first').attr('data-date');
        if (date)
            currentday = new Date(date).getDate();

        $.each(data, function (index, item) {
            var date = new Date(item.date_pub);

            if (date.getDate() != currentday) {
                currentday_container = $("<div class='day_container'></div>");
                currentday_container.append(date_divider(item.date_pub));
                var day_msgs = $("<div class='day_msgs'></div>");

                switch (item.type) {
                    case 'message_int_event':
                        day_msgs.append(ts_message(item.user_from.image, item.user_from.user.username, item.msg, item.date_pub));
                        break;
                    case 'file_shared_event':
                        console.log('event');
                        break;
                }

                currentday_container.append(day_msgs);
                container.prepend(currentday_container).fadeIn('slow');
            } else if (date.getDate() == currentday) {
                //var day_msgs = $("<div class='day_msgs'></div>");
                day_msgs = $(".day_container:first").find('.day_msgs');

                switch (item.type) {
                    case 'message_int_event':
                        day_msgs.prepend(ts_message(item.user_from.image, item.user_from.user.username, item.msg, item.date_pub)).fadeIn('slow');
                        break;
                    case 'file_shared_event':
                        console.log('event');
                        break;
                }
            }

            var date = $(".day_container:first").find('ts-message:first').attr('data-date');
            currentday = new Date(date).getDate();
        });
    }
    var heigth = $("#msgs_scroller_div").offset().top + $("#msgs_div").height() + $('#end_div').height();
    $("#msgs_scroller_div").animate({scrollTop: heigth}, 200);
};

var initScroll = function (name) {
    var url = "/api/messages/" + name + "/";

    $("#msgs_scroller_div").infiniteScroll({
        dataPath: url,
        itemSelector: 'ts-message.message:first',
        onDataLoading: null,// function (page),
        onDataLoaded: onDataLoaded, // function (data)
        onDataError: null // function (page)
    });

};

var CheckReaded = function (channel) {
    var exc = function (response) {
        window.get_comuncation_me();
    };
    var urlapi = apiUrl + 'checkreaded/';
    // request(urlapi, 'POST', null, {channel: channel}, exc, null);

};
var CheckReaded = function (channel) {
    var exc = function (response) {
        window.get_comuncation_me();
    };
    var urlapi = apiUrl + 'checkreaded/';
    request(urlapi, 'POST', null, {channel: channel}, exc, null);

};
var CheckReadedRoom = function (room) {
    var exc = function (response) {
        get_chanel();
    };
    var urlapi = apiUrl + 'checkreadedroom/';
    request(urlapi, 'POST', null, {room: room}, exc, null);

};

var Reload = function (name) {
    $("#msgs_div").empty();
    $.ajax({
        type: 'GET',
        url: "/api/messages/" + name + "/" + 1 + '/',
        // data: {page: 1},
        success: function (data, status, object) {
            $.when(success(data)).then(initScroll(name));
        },
        error: function (data, status, object) {
            //console.log(data.message);
        }
    });


};

var ReloadRoom = function (name) {
    $("#msgs_div").empty();
    $.ajax({
        type: 'GET',
        url: "/api/messagesroom/" + name + "/" + 1 + '/',
        // data: {page: 1},
        success: function (data, status, object) {
            $.when(success(data)).then(initScroll(name));
        },
        error: function (data, status, object) {
            //console.log(data.message);
        }
    });


};

var success = function (data) {
    onDataLoaded(data.items)
    $("#msgs_div").find("ts-message.message:first").attr('data-next', data.has_next);
};

function openIncomingCall(data) {
    var room = data.room;
    var modal = $('#incoming_call');
    var div_avatar = modal.find('.avatar_holder');
    var div_name = modal.find('.name');
    var accept = modal.find('a.accept');
    var reject = modal.find('a.reject');

    var image = ' url(' + data.avatar + ')';
    var avatar = '<span  class="member_preview_link member_image thumb_512" style="background-image: ' + image + '" aria-hidden="true"></span>';


    init();

    accept.on("click", function (e) {
        e.preventDefault();
        e.stopPropagation();
        console.log("room", room);
        var urlapi = hostUrl + '/call/' + room;
        window.open(urlapi, '_blank');


        _close();
    });

    reject.on("click", function (e) {
        e.preventDefault();
        e.stopPropagation();
        console.log("room", room);
        socket.send({action: "calldecline", user_from: userlogged, room: data.roomname});

        _close();
    });
    function init() {
        modal.removeClass("hidden");
        modal.addClass("active");
        div_avatar.append(avatar);
        div_name.text(data.user_from);
    }

    function _close() {
        modal.removeClass("active");
        modal.addClass("hidden");
        div_avatar.empty();
        div_name.empty();
    }


}

