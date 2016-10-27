/**
 * Created by julio on 14/10/16.
 */
var panel = null, channels = '', activeChannel = 'public', users = new Array(),
    apiUrl = window.location.protocol + '//' + window.location.host + '/api/',
    hostUrl = window.location.protocol + '//' + window.location.host;
window.users_logged = 0;

$(document).ready(function () {
    //beginnings methods
    $(function () {
        get_chanel();
        get_users();
    });

    //actions methods
    $('#team_menu').on('click', function () {
        $('#menu').removeClass('hidden');
    });

    $('.popover_mask').on('click', function () {
        $('#menu').addClass('hidden');
        $('#menu.flex_menu').addClass('hidden');
    });

    $('.channel_header_icon').on('click', function () {
        $('.channel_header_icon.active').removeClass('active');

        $(this).addClass('active');

        //aqui lo demas
        var obj = this.id;//.replace().split('_');//.slice(1, -1);
        if (obj.indexOf('_toggle') !== -1) {
            obj = obj.replace('_toggle', '');

            if (obj != 'flex_menu') {
                var arr = (obj.split('_').length > 1) ? obj.split('_')[1] : obj.split('_')[0];
                $('.panel.active').removeClass('active');
                $('#' + arr + '_tab').addClass('active');
                change_chat_size('65%');
            } else {
                $('#menu.flex_menu').removeClass('hidden');
            }
        }
    });

    $('input#search_terms').on('focus', function () {
        $('#search_autocomplete_popover').removeClass('hidden');
        $('#client-ui').addClass('search_focused');
    });

    $('input#search_terms').focusout(function () {
        $('#search_autocomplete_popover').addClass('hidden');
        $('#client-ui').removeClass('search_focused');
    });

    $('#list_team').on('click', function () {
        team_users();
        change_chat_size('65%');
    });

    $('.panel').on('click', '.close_flexpane', function () {
        change_chat_size('100%');
        $('.panel.active').removeClass('active');
        var closure = $(this).data('pannel');
        if (closure != 'undefined' && closure != null) {
            $('#' + closure).addClass('hidden');
        }
    });

    $('.panel').on('click', '#back_from_member_preview', function () {
        team_users();
    });

    window.showProfile = function (object) {
        var exc = function (response) {
            var list = $('#member_preview_container').html('');
            list.append(item_user_profile(response[0]));
        };

        $('#team_list_container').addClass('hidden');
        var urlapi = apiUrl + 'profile/' + $(object).data('user');
        request(urlapi, 'GET', null, null, exc, null);
        $('#member_preview_container').removeClass('hidden');
    };

    //aux methods
    var get_chanel = function () {
        var exc = function (response) {
            var list = $('#channel-list').html('');
            $('#channel_header_count').html(response.length);
            response.forEach(function (item) {
                list.append(item_channel_list(item.name));
            });
        };

        var urlapi = apiUrl + companyuser + '/room/';
        request(urlapi, 'GET', null, null, exc, null);
    };

    var get_users = function () {
        var exc = function (response) {
            var list = $('#im-list').html('');
            $('#dm_header_count').html(response.length);
            $('span#active_members_count_value').html(response.length);
            $('#channel_members_toggle_count.blue_hover').html(response.length + ' members<span class="ts_tip_tip">View member list (' + Number(window.users_logged - 1) + '/' + Number(response.length - 1) + ' online)</span>');
            response.forEach(function (item) {
                list.append(item_user_list(item.user.username));
            });
        };

        var urlapi = apiUrl + companyuser + '/users/';
        $.when(users_online()).done(function () {
            request(urlapi, 'GET', null, null, exc, null);
        });
    };

    var users_online = function () {
        var exc = function (response) {
            $('#active_members_count_value').html(response.length);
            window.users_logged = response.length;
        };

        var urlapi = apiUrl + companyuser + '/users-logged/';
        request(urlapi, 'GET', null, null, exc, null);
    };

    var team_users = function () {
        var exc = function (response) {
            $('span#active_members_count_value').html(response.length);
            var list = $('#active_members_list').html('');
            response.forEach(function (item) {
                list.append(item_directory_list(item.user.username, item.user.first_name + ' ' + item.user.last_name, hostUrl + item.image, userlogged))
            });
        };

        $('.panel.active').removeClass('active');
        $('#team_tab').addClass('active');
        $('#team_list_container').removeClass('hidden');
        $('#member_preview_container').addClass('hidden');

        var urlapi = apiUrl + companyuser + '/users/';
        request(urlapi, 'GET', null, null, exc, null);

        $('#menu.flex_menu').addClass('hidden');
    };

    var change_chat_size = function (size) {
        $('#msgs_div').css('width', size);//'65%'
    };
});

window.request = function (urlSend, typeRequest, dataType, dataSend, doneFunction, errorFunction) {
    $.ajax({
        type: typeRequest,
        url: urlSend,
        data: dataSend,
        dataType: dataType,
        success: doneFunction,
        error: errorFunction
    });
};

