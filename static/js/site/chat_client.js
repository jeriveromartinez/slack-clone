/**
 * Created by julio on 31/10/16.
 */

$(document).ready(function () {
    socket = new io.Socket();
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
                console.log(activeChannel);
                socket.send({"username": activeChannel, message: $(this).val().trim()});
                $("#message-input").val("");
                event.preventDefault();
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
            break;
        case 'system':
            console.log('message', data);
            break;
    }
};