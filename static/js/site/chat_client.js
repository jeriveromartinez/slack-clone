/**
 * Created by victor on 31/10/16.
 */
var currentday = -1;
$(document).ready(function () {


    var socket = new io.Socket();

    setInterval(function () {
        socket.connect();

    }, 8000);

    socket.on('connect', function () {
        console.log(" connected")
        // socket.send({"hola": "hola", action: 'start'});
    });

    socket.on('message', messaged);

    //input
    $("#message-input").keypress(function (e) {
        if (e.which == 13) {
            var msg = $(this).val().trim();
            if (msg) {
                var message = $(this).val();

                socket.send({user_to: activeChannel, message: $(this).val().trim(), user_from: userlogged});
                $("#message-input").val("");
                e.preventDefault();

                if (currentday == new Date().getDate()) {
                    var elemt = $(".day_container:last").find('.day_msgs');
                    if (elemt.length) {
                        elemt.append(ts_message('ava_0022-48.png', userlogged, message));
                    }
                }
                else {
                    var day_container = $("<div class='day_container'></div>");
                    day_container.append(date_divider(new Date()));
                    var day_msgs = $("<div class='day_msgs'></div>");
                    day_msgs.append(ts_message('ava_0022-48.png', userlogged, message));
                    day_container.append(day_msgs);

                    $("#msgs_div").append(day_container);
                }

                var heigth = $("#msgs_scroller_div").offset().top + $("#msgs_div").height();

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
        case 'message':
            console.log('message', data);

            if (currentday == new Date().getDate()) {
                var elemt = $(".day_container:last").find('.day_msgs');
                if (elemt.length) {
                    elemt.append(ts_message('ava_0022-48.png', data.user_from, data.message));
                }
            }
            else {
                var day_container = $("<div class='day_container'></div>");
                day_container.append(date_divider(new Date()));
                var day_msgs = $("<div class='day_msgs'></div>");
                day_msgs.append(ts_message('ava_0022-48.png', data.user_from, data.message));
                day_container.append(day_msgs);

                $("#msgs_div").append(day_container);
            }


            var heigth = $("#msgs_scroller_div").offset().top + $("#msgs_scroller_div").height();
            $("#msgs_scroller_div").animate({scrollTop: heigth}, 200);

            break;
        case 'system':
            console.log('message', data);
            break;
    }
};

var onDataLoaded = function (data) {

    if (data.length > 0) {


        var container = $("#msgs_div");


        var currentday_container = "";


        $.each(data, function (index, item) {

            var date = new Date(item.date_pub);


            if (date.getDate() > currentday) {

                currentday_container = $("<div class='day_container'></div>");
                currentday_container.append(date_divider(item.date_pub));
                var day_msgs = $("<div class='day_msgs'></div>");
                switch (item.type) {
                    case 'message_int_event':
                        day_msgs.append(ts_message('ava_0022-48.png', item.user_from.username, item.msg));
                        break;
                    case 'file_shared_event':
                        console.log('event');
                        break;

                        break;
                }
                currentday_container.append(day_msgs);

                container.prepend(currentday_container);


            } else if (date.getDate() == currentday) {

                var day_msgs = $("<div class='day_msgs'></div>");
                day_msgs = $(".day_container:last").find('.day_msgs');

                switch (item.type) {
                    case 'message_int_event':
                        day_msgs.prepend(ts_message('ava_0022-48.png', item.user_from.username, item.msg, item.date_pub));
                        break;
                    case 'file_shared_event':
                        console.log('event');
                        break;

                        break;
                }


            }
            currentday = date.getDate();


        });


    }

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
var Reload = function (name) {
    $("#msgs_div").empty();
    currentday = -1;

    $.ajax({
        type: 'GET',
        url: "/api/messages/" + name + "/" + 1,
        // data: {page: 1},
        success: function (data, status, object) {

            $.when(success(data)).then(initScroll(name));


        },
        error: function (data, status, object) {
            console.log(data.message);
        }
    });
    var heigth = $("#msgs_scroller_div").offset().top + $("#msgs_scroller_div").height();

    $("#msgs_scroller_div").animate({scrollTop: heigth}, 200);

};
var success=function (data) {
    onDataLoaded(data.items)
        $("#msgs_div").find("ts-message.message:first").attr('data-next', data.has_next);
}