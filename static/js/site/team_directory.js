/**
 * Created by julio on 8/12/16.
 */

$(document).ready(function () {
    loadPage();

    $('input[name="team_filter"]').bind('keypress', function (e) {
        if (e.keyCode == 13) {
            loadPage($(this).val());
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
            crossDomain: true,
            dataType: dataType,
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

var loadPage = function (search) {
    var exc = function (response) {
        var list = $('#active_members_list');
        $(list).html('');
        $('#active_members_count_value').html(response.length);
        $.each(response, function (key, item) {
            var date = moment(item.uploaded, moment.ISO - 8601).format("MMM Do \\at h:mm a"),
                userUrl = '/account/profile/' + item.user.username + '/',
                names = item.user.first_name + ' ' + item.user.last_name;
            $(list).append(userTeamComponent(userUrl, item.image, item.user.email, names, item.user.username));
        });
    };

    var urlapi = apiUrl + companyuser + '/users/';
    (search != undefined && search != '') ? urlapi += search + '/' : '';
    request(urlapi, 'GET', null, null, exc, null);
};