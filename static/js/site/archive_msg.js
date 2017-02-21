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
    $("[data-select]").click(function () {
        var value = $(this).attr('data-select');
        if (value == "user") {
            $('[data-select="user"]').addClass('selected');
            $('[data-select="channel"]').removeClass('selected');
            $('[data-tab="direct-messages"]').addClass('selected');
            $('[data-tab="channels"]').removeClass('selected');
             loadPageUser('');
        }
        if (value == "channel") {
            $('[data-select="channel"]').addClass('selected');
            $('[data-select="user"]').removeClass('selected');
            $('[data-tab="channels"]').addClass('selected');
            $('[data-tab="direct-messages"]').removeClass('selected');
            loadPageChannel('');
        }
    })
});

//AUX
var loadPageUser = function (search) {
    var exc = function (response) {
        var list = $('#im_list');
        $(list).html('');
        $('#active_members_count_value').html(response.length);
        $.each(response.items, function (key, item) {
            var date = moment(item.date_pub, moment.ISO - 8601).format("MMM Do \\at h:mm a");
                // userUrl = '/account/profile/' + item.user_from.user.username + '/',
                // names = item.user_from.user.first_name + ' ' + item.user_from.user.last_name;
            var style;
            if (key + 1 == response.length)
                style = 'top_padding';
            else if (key == 0)
                style = 'bottom_border';
            else
                style = null;
            $(list).append(msgArchiveComponent(date, item, style));
        });
    };

    var urlapi = apiUrl + 'userhistory/';
    (search != undefined && search != '') ? urlapi += search + '/' : '';
    request(urlapi, 'GET', null, null, exc, null);
};

var loadPageChannel = function (search) {
    var exc = function (response) {
        var list = $('#channel_list');
        $(list).html('');
        $('#active_members_count_value').html(response.length);
        $.each(response.items, function (key, item) {
            var date = moment(item.date_pub, moment.ISO - 8601).format("MMM Do \\at h:mm a");
            // userUrl = '/account/profile/' + item.user_from.user.username + '/',
            // names = item.user_from.user.first_name + ' ' + item.user_from.user.last_name;
            var style;
            if (key + 1 == response.length)
                style = 'top_padding';
            else if (key == 0)
                style = 'bottom_border';
            else
                style = null;
            $(list).append(msgChanelComponent(date, item, style));
        });
    };
    search = (search != undefined) ? search : 'everyBody';
    var urlapi = apiUrl + 'roomhistory/';
    request(urlapi, 'GET', null, null, exc, null);
};