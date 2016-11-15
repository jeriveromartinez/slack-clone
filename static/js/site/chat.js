/**
 * Created by julio on 14/10/16.
 */
var panel = null, channels = '', activeChannel = 'public', users = new Array(),
    apiUrl = window.location.protocol + '//' + window.location.host + '/api/',
    hostUrl = window.location.protocol + '//' + window.location.host;
window.users_logged = 0,
    window.userFileStatus = false;

$('body').prepend(itemLoad);

$(document).ready(function () {
    //beginnings methods
    var socket;
    $(function () {
        initView();
        get_chanel();
        get_comuncation_me();
        active_chat(userlogged, 'user');
    });

    //actions methods
    $('#team_menu').on('click', function () {
        $('#menu.slack_menu.team_menu').removeClass('hidden');
    });

    //hidden all menus
    $('.popover_mask').on('click', function () {
        $('#menu.slack_menu.team_menu').addClass('hidden');
        $('#menu.flex_menu').addClass('hidden');
        $('#menu.menu_file_create').addClass('hidden');
        $('#menu.menu_user_list').addClass('hidden');
        userFileStatus = false;
    });

    $('.channel_header_icon').on('click', function () {
        $('.channel_header_icon.active').removeClass('active');

        $(this).addClass('active');

        //aqui lo demas
        var obj = this.id;
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

    $('.panel').on('click', '.close_flexpane', function () {

        change_chat_size('100%');
        $('.panel.active').removeClass('active');
        var closure = $(this).data('pannel');
        if (closure != 'undefined' && closure != null) {
            $('#' + closure).addClass('hidden');
        }
        $('#client-ui').removeClass('flex_pane_showing');
    });

    $('.panel').on('click', '#back_from_member_preview', function () {
        team_users();
    });

    $('#channel-list').on('click', '.channel', function () {
        active_chat(this.id, 'channel');
        activeChannel = this.id;
        Reload(activeChannel);


    });

    $('#im-list').on('click', '.member', function () {
        active_chat(this.id, 'user');
        activeChannel = $(this).attr("data-name");
        Reload(activeChannel);

    });

    $('#member_account_item').on('click', function () {
        showProfile(this);
        $('#menu.menu').addClass('hidden');

        change_chat_size('65%');
    });

    $('#active_members_list').on('click', '.member_preview_link', function () {
        showProfile(this);
    });

    $("#direct_messages_header, .new_dm_btn").on("click", function (e) {
        e.stopPropagation();

        openDirectModal();
    });

    //aux methods
    var get_chanel = function () {
        var exc = function (response) {
            var list = $('#channel-list').html('');
            $('#channel_header_count').html(response.length);
            response.forEach(function (item) {
                list.append(item_channel_list(item.name));
            });
        };

        var urlapi = apiUrl + companyuser + '/room/all/';
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
    var get_comuncation_me = function () {
        var exc = function (response) {
            window.usercomunication = response;

            var list = $('#im-list').html('');
            $('#dm_header_count').html(response.length);
            $('span#active_members_count_value').html(response.length);
            $('#channel_members_toggle_count.blue_hover').html(response.length + ' members<span class="ts_tip_tip">View member list (' + Number(window.users_logged - 1) + '/' + Number(response.length - 1) + ' online)</span>');
            response.forEach(function (item) {
                list.append(item_user_list(item));
            });
        };

        var urlapi = apiUrl + 'cummunication_me/' + userlogged;
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

    var active_chat = function (search, type) {
        sendTo.type = type;
        if (type == "channel") {
            $('#channel_title').html('#' + search);
            sendTo.to = search;
        } else {
            $('#channel_title').html('@' + search);
            sendTo.to = search;
        }
    };

    var users_online = function () {
        var exc = function (response) {
            $('#active_members_count_value').html(response.length);
            window.users_logged = response.length;
        };

        var urlapi = apiUrl + companyuser + '/users-logged/';
        request(urlapi, 'GET', null, null, exc, null);
    };

    window.showProfile = function (object) {
        var exc = function (response) {
            var list = $('#member_preview_container').html('');
            var date = moment(new Date(), moment.ISO - 8601).format("h:mm a");
            list.append(item_user_profile(response[0], date));
        };

        $('.panel.active').removeClass('active');
        $('#team_list_container').addClass('hidden');
        var urlapi = apiUrl + 'profile/' + $(object).data('user');
        request(urlapi, 'GET', null, null, exc, null);
        $('#member_preview_container').removeClass('hidden');
        $('#client-ui').addClass('flex_pane_showing');
        $('#team_tab').addClass('active');
    };

    window.change_chat_size = function (size) {

        $('#msgs_scroller_div').css('width', size);
    };

    window.team_users = function () {
        var exc = function (response) {
            $('span#active_members_count_value').html(response.length);
            var list = $('#active_members_list').html('');
            response.forEach(function (item) {
                list.append(item_directory_list(item.user.username, item.user.first_name + ' ' + item.user.last_name, item.image, userlogged))
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

    window.getUserPath = function (username) {
        var urlapi = apiUrl + 'profile/' + username + '/path/';
        return $.ajax({type: "GET", url: urlapi, async: false}).responseJSON.url;
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

    var initView = function () {
        $("a.clear_unread_messages").tooltip({placement: "bottom", delay: {show: 500, hide: 150}});
        $(".channels_list_new_btn").tooltip({container: "body", delay: {show: 400, hide: 150}});
        $(".channel_list_header_label, #direct_messages_header").tooltip({
            placement: "top-left",
            container: "body",
            delay: {show: 400, hide: 150}
        });
    }

//Direct message Modal
    function openDirectModal() {

        var modal = $("#direct-message").find("#fs_modal");
        var modal_bg = $("#fs_modal_bg");
        modal_bg.removeClass("hidden");
        modal_bg.addClass("active");
        modal.removeClass("hidden");
        modal.addClass("active");
        modal.find("#im_browser_tokens").addClass("active");
        var _$im_browser = $("#im_browser");
        var _$list_container = $("#im_list_container");
        var list = $("#im_browser").find('.list_items');
        var _selected_members = [];
        var _MAX = 8;


        $("body").on("click", "#fs_modal_close_btn", function () {
            _close();

        });

        function _close() {
            modal_bg.removeClass("active");
            modal_bg.addClass("hidden");
            modal.removeClass("active");
            modal.addClass("hidden");
            modal.find("#im_browser_tokens").removeClass("active");
            
            _$list_container.unbind().off("click", ".im_browser_row", function () {

                _selected_members = [];


            });
            _$im_browser.off('click', '.member_token .remove_member_icon', function () {

            });
            $("body").off("click", "#fs_modal_close_btn", function () {

            });


        }

        _startListView();
        _clear();
        if (!_selected_members)_selected_members = [];


        _$list_container.on("click", ".im_browser_row", function () {

            _selectRow($(this));
        });
        _$im_browser.on("input", "#im_browser_filter", function () {
            var input = $("#im_browser_filter").val();
            _filterListView(input);
        });
        _$im_browser.on('click', '.member_token .remove_member_icon', function () {
            var item = $(this).parent();
            var member = item.attr('data-member-id');
            var index = _selected_members.indexOf(member);
            if (index > -1) {
                _selected_members.splice(index, 1);
            }
            item.remove();

            var input = $("#im_browser_filter").val();
            _filterListView(input);
            _updateGo();
        });

        $("#direct_messages_header, .channels_list_new_btn").tooltip("hide")


        function _filterListView(input) {
            var exc = function (data) {

                list.empty();

                $.each(data, function (index, item) {

                    var pos = 64 * index;

                    if ($.inArray(item.user.username, _selected_members) == -1) {
                        list.append(item_direct_filter(item, parseInt(pos)));
                    }
                    else {
                        pos -= 64 * index;
                    }
                });


            };
            var urlapi = apiUrl + 'usercomapny';
            $.when(users_online()).done(function () {
                request(urlapi, 'POST', null, {term: input}, exc, null);
            });
        };
        function _startListView() {
            var exc = function (data) {

                list.empty();
                $.each(data.items, function (index, item) {
                    var pos = 64 * index;

                    list.append(item_direct_message(item, parseInt(pos)));

                });

            };
            var urlapi = apiUrl + 'resent/' + userlogged;

            request(urlapi, 'GET', null, null, exc, null);
        };

        function _selectRow(row) {
            var member = row.attr('data-member-id');


            if (member == userlogged) {

                active_chat(member, 'user');
                activeChannel = member;
                Reload(activeChannel);

                _selected_members.pop();
                _close();
            }
            else {
                if ($.inArray(member, _selected_members) == -1) {
                    _selected_members.push(member);
                    var input = $("#im_browser_filter").val();
                    _filterListView(input);

                    $("#im_browser_tokens").prepend(item_member_token(member));
                }


            }
            _updateGo();
            _updateParticipantCountHint();


        }

        function _updateGo() {
            if (_selected_members.length) {
                _$im_browser.find(".im_browser_go").removeClass("disabled")
            } else {
                _$im_browser.find(".im_browser_go").addClass("disabled")
            }
            if (_selected_members.length >= _MAX) {
                _$im_browser.addClass("reached_maximum")
            } else {
                _$im_browser.removeClass("reached_maximum")
            }

        };

        function _updateParticipantCountHint() {
            var max = _MAX;
            var remaining = Math.max(0, max - _selected_members.length
                )
                ;
            var $div = _$im_browser.find(".remaining_participant_hint");
            if (remaining) {
                if (remaining === 1) {
                    $div.text("You can add 1 more person")
                } else {
                    $div.text("You can add " + remaining + " more people")
                }
            } else {
                $div.text("You have reached the maximum number of participants")
            }
        };

        function _clear() {
            var select = $('#im_browser_tokens').find("div.member_token")

            $.each(select, function (index, item) {
                item.parentNode.removeChild(item);

            });

        }


    };
});