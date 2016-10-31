/**
 * Created by julio on 31/10/16.
 */

$(document).ready(function () {
    //input
    $("#message-input").keypress(function (e) {
        if (e.which == 13) {
            var msg = $(this).val().trim();
            if (msg) {
                socket.send({"username": activeChannel, message: $(this).val().trim()});
                $("#message-input").val("");
                event.preventDefault();
            }

        }

    });
});