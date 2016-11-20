$(document).ready(function () {


    var socket = new io.Socket(document.domain, {transports: ['websocket']});


    socket.connect();
    setInterval(function () {
        socket.connect();
    }, 5000);

    socket.on('connect', function () {
        console.log(" connected")
        // socket.send({"hola": "hola", action: 'start'});
    });

    socket.on('message', messaged);
    socket.on('disconnect', function () {
        console.log(" disconnect")
    });

    //input
    $("#message-input").keypress(function (e) {
        if (e.which == 13) {
            var msg = $(this).val().trim();
            if (msg) {
                var message = $(this).val();

                socket.send({user_to: activeChannel, message: $(this).val().trim(), user_from: userlogged});
                $("#message-input").val("");
                e.preventDefault();
                var date = $(".day_container:last").find('ts-message:last').attr('data-date');
                var day = new Date(date).getDate();
                if (day == new Date().getDate()) {
                    var elemt = $(".day_container:last").find('.day_msgs');
                    if (elemt.length) {
                        elemt.append(ts_message('ava_0022-48.png', userlogged, message, new Date().toISOString()));
                    }
                }
                else {
                    var day_container = $("<div class='day_container'></div>");
                    day_container.append(date_divider(new Date()));
                    var day_msgs = $("<div class='day_msgs'></div>");
                    day_msgs.append(ts_message('ava_0022-48.png', userlogged, message, new Date().toISOString()));
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
        case 'message':
            console.log('message', data);
            var date = $(".day_container:last").find('ts-message:last').attr('data-date');
            var day = new Date(date).getDate();
            if (day == new Date().getDate()) {
                var elemt = $(".day_container:last").find('.day_msgs');
                if (elemt.length) {
                    elemt.append(ts_message('ava_0022-48.png', data.user_from, data.message, data.date_pub));
                }
            }
            else {
                var day_container = $("<div class='day_container'></div>");
                day_container.append(date_divider(new Date()));
                var day_msgs = $("<div class='day_msgs'></div>");
                day_msgs.append(ts_message('ava_0022-48.png', data.user_from, data.message, data.date_pub));
                day_container.append(day_msgs);

                $("#msgs_div").append(day_container);
            }


            var heigth = $("#msgs_scroller_div").offset().top + $("#msgs_div").height() + $('#end_div').height();
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

        var currentday = -1;
        var currentday_container = "";
        var date = $(".day_container:first").find('ts-message:first').attr('data-date');
        if (date) {
            currentday = new Date(date).getDate();
        }


        $.each(data, function (index, item) {

            var date = new Date(item.date_pub);


            if (date.getDate() != currentday) {

                currentday_container = $("<div class='day_container'></div>");
                currentday_container.append(date_divider(item.date_pub));
                var day_msgs = $("<div class='day_msgs'></div>");
                switch (item.type) {
                    case 'message_int_event':
                        day_msgs.append(ts_message('ava_0022-48.png', item.user_from.username, item.msg, item.date_pub));
                        break;
                    case 'file_shared_event':
                        console.log('event');
                        break;

                        break;
                }
                currentday_container.append(day_msgs);

                container.prepend(currentday_container).fadeIn('slow');


            } else if (date.getDate() == currentday) {

                var day_msgs = $("<div class='day_msgs'></div>");
                day_msgs = $(".day_container:first").find('.day_msgs');

                switch (item.type) {
                    case 'message_int_event':
                        day_msgs.prepend(ts_message('ava_0022-48.png', item.user_from.username, item.msg, item.date_pub)).fadeIn('slow');
                        break;
                    case 'file_shared_event':
                        console.log('event');
                        break;

                        break;
                }


            }
            var date = $(".day_container:first").find('ts-message:first').attr('data-date');

            currentday = new Date(date).getDate();


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

var CheckReaded = function (channel) {
    var exc = function (response) {
        window.get_comuncation_me();
    };
    var urlapi = apiUrl + 'checkreaded';
    request(urlapi, 'POST', null, {channel: channel}, exc, null);

};
var Reload = function (name) {
    $("#msgs_div").empty();

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

    var heigth = $("#msgs_scroller_div").offset().top + $("#msgs_div").height() + $('#end_div').height();

    $("#msgs_scroller_div").animate({scrollTop: heigth}, 200);

};
var success = function (data) {
    onDataLoaded(data.items)
    $("#msgs_div").find("ts-message.message:first").attr('data-next', data.has_next);
}

