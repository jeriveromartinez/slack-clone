/**
 * Created by julio on 31/10/16.
 */

$(document).ready(function () {
    // $.ajax({
    //     type: 'GET',
    //     url: "/api/messages/julio/",
    //     data: {page: 1},
    //     success: function (data, status, object) {
    //         onDataLoaded(data);
    //     },
    //     error: function (data, status, object) {
    //         console.log(data.message);
    //     }
    // });
    //
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
                console.log(activeChannel);
                console.log(userlogged);
                socket.send({user_to: activeChannel, message: $(this).val().trim(),user_from:userlogged});
                $("#message-input").val("");
                e.preventDefault();
                var elemt = $(".day_container:last").find('.day_msgs');

                elemt.append(ts_message('ava_0022-48.png', userlogged, message));

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
            var elemt = $(".day_container:last").find('.day_msgs');
            elemt.append(ts_message('ava_0022-48.png', data.user_from, data.message));
            var heigth = $("#msgs_scroller_div").offset().top + $("#msgs_div").height();
            $("#msgs_scroller_div").animate({scrollTop: heigth}, 200);

            break;
        case 'system':
            console.log('message', data);
            break;
    }
};

var onDataLoaded = function (data) {
    var DAY = 24 * 60 * 60 * 1000;
    var contatiner = $("#msgs_div");
    var day_container = $("<div class='day_container'></div>")
    if (data) {
        var currentday = new Date(data[0].date_pub).getTime();
        var currentday_container = day_container;
        var day_msgs;

        $.each(data, function (index, item) {

            var date = new Date(item.date_pub).getTime();
            if (date >= currentday - DAY && date <= currentday) {
                currentday_container = day_container
                currentday.append(date_divider(item.date_pub));
                day_msgs = $("<div class='day_container'></div>");

                switch (item.type) {
                    case 'message_int_event':
                        day_msgs.append(ts_message('ava_0022-48.png', "julio", "mio"));
                        break;
                    case 'file_shared_event':
                        console.log('event');
                        break;

                        break;
                }
                currentday_container.append((day_msgs));
                contatiner.prepend()
            }


        });

    }

};