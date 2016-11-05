/**
 * Created by julio on 31/10/16.
 */
var currentday = -1;
$(document).ready(function () {


    var socket = new io.Socket();
    socket.connect();
    socket.on('connect', function () {

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

                if (currentday == new Date().getDay()) {
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

            if (currentday == new Date().getDay()) {
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


            var heigth = $("#msgs_scroller_div").offset().top + $("#msgs_div").height();
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


            if (date.getDay() > currentday) {

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

                container.append(currentday_container);


            } else if (date.getDay() == currentday) {

                var day_msgs = $("<div class='day_msgs'></div>");
                day_msgs = $(".day_container:last").find('.day_msgs');

                switch (item.type) {
                    case 'message_int_event':
                        day_msgs.append(ts_message('ava_0022-48.png', item.user_from.username, item.msg));
                        break;
                    case 'file_shared_event':
                        console.log('event');
                        break;

                        break;
                }


            }
            currentday = date.getDay();


        });
        var heigth = $("#msgs_scroller_div").offset().top + $("#msgs_div").height();
        $("#msgs_scroller_div").animate({scrollTop: heigth}, 200);

    }

};

var Reload = function (name) {
    $("#msgs_div").html('');
    $.ajax({
        type: 'GET',
        url: "/api/messages/" + name + "/" + 1,
        // data: {page: 1},
        success: function (data, status, object) {

            onDataLoaded(data);
        },
        error: function (data, status, object) {
            console.log(data.message);
        }
    });

}