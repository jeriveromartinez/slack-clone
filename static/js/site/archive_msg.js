/**
 * Created by julio on 11/12/16.
 */
var typeSelect = 'channel';
$(document).ready(function () {
    loadPageChannel();

    $('input[name="team_filter"]').bind('keypress', function (e) {
        if (e.keyCode == 13) {
            if (typeSelect == 'channel')
                loadPageChannel($(this).val());
            else
                loadPageUser($(this).val());
            $(this).val('');
        }
    });
});

window.request = function (urlSend, typeRequest, dataType, dataSend, doneFunction, errorFunction, type) {
    $('#convo_loading_indicator').show();
    if (type == 'file') {
        $.ajax({
            type: typeRequest,
            url: urlSend,
            data: dataSend,
            cache: false,
            contentType: false,
            processData: false,
            dataType: dataType,
            crossDomain: true,
            headers: {"X-CSRFToken": getCookie("csrftoken")},
            success: doneFunction,
            error: errorFunction,
            complete: function () {
                $('#convo_loading_indicator').hide();
            }
        });
    } else {
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
    }
};

window.getCookie = function (c_name) {
    if (document.cookie.length > 0) {
        c_start = document.cookie.indexOf(c_name + "=");
        if (c_start != -1) {
            c_start = c_start + c_name.length + 1;
            c_end = document.cookie.indexOf(";", c_start);
            if (c_end == -1) c_end = document.cookie.length;
            return unescape(document.cookie.substring(c_start, c_end));
        }
    }
    return "";
};

var loadPageUser = function (search) {
    var exc = function (response) {
        var list = $('#im_list');
        $(list).html('');
        $('#active_members_count_value').html(response.length);
        $.each(response, function (key, item) {
            var date = moment(item.date_pub, moment.ISO - 8601).format("MMM Do \\at h:mm a"),
                userUrl = '/account/profile/' + item.user_from.username + '/',
                names = item.user_from.first_name + ' ' + item.user_from.last_name;
            var style;
            if (key + 1 == response.length)
                style = 'top_padding';
            else if (key == 0)
                style = 'bottom_border';
            else
                style = null;
            $(list).append(msgArchiveComponent(date, null, item.user_from.username, style));
        });
    };

    var urlapi = apiUrl + 'messages-archived/user/' + userlogged + '/1/';
    (search != undefined && search != '') ? urlapi += search + '/' : '';
    request(urlapi, 'GET', null, null, exc, null);
};

var loadPageChannel = function (search) {
    var exc = function (response) {
        var list = $('#im_list');
        $(list).html('');
        $('#active_members_count_value').html(response.length);
        $.each(response, function (key, item) {
            var date = moment(item.date_pub, moment.ISO - 8601).format("MMM Do \\at h:mm a"),
                userUrl = '/account/profile/' + item.user_from.username + '/',
                names = item.user_from.first_name + ' ' + item.user_from.last_name;
            var style;
            if (key + 1 == response.length)
                style = 'top_padding';
            else if (key == 0)
                style = 'bottom_border';
            else
                style = null;
            $(list).append(msgArchiveComponent(date, null, item.user_from.username, style));
        });
    };
    search = (search != undefined) ? search : 'everyBody';
    var urlapi = apiUrl + 'messages-archived/channel/' + search + '/1/';
    request(urlapi, 'GET', null, null, exc, null);
};