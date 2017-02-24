var accountapi = window.location.protocol + '//' + window.location.host + '/account/';
$(document).ready(function () {
    $("#save").click(function () {
        if ($("#post_title").val().length > 0 && $("#post_text").val().length > 0) {
            var url = accountapi + 'file/post/';

            var exc = function (response) {
                console.log(response)
                window.location.href = referer;
            };
            console.log("url", url);
            request(url, 'POST', null, {
                post_title: $("#post_title").val(),
                post_text: $("#post_text").val()
            }, exc, null);
        }

    })
});
window.request = function (urlSend, typeRequest, dataType, dataSend, doneFunction, errorFunction, type) {
    $('#convo_loading_indicator').show();

    $.ajax({
        type: typeRequest,
        url: urlSend,
        data: dataSend,
        dataType: dataType,
        headers: {"X-CSRFToken": getCookie("csrftoken")},
        success: doneFunction,
        error: errorFunction,
        complete: function () {
            $('#convo_loading_indicator').hide();
        }
    });

};