/**
 * Created by julio on 14/10/16.
 */
var panel = null, channels = [], activeChannel = 'public', users = [], typesL = [];
window.users_logged = 0;
window.userFileStatus = false;

$('body').prepend(itemLoad);

$(document).ready(function () {
    //beginnings methods
    var socket;
    $(function () {
        initView();
        get_chanel();
        window.get_comuncation_me();

        setInterval(function () {
            window.get_comuncation_me();
        }, 10000);
        active_chat(userlogged, 'user');
        getUsersCompany();
        getTypesLanguage();
    });

    //show menu user logged
    $('#team_menu').on('click.team_menu', function () {
        var value = $('#hiddenMenuUser').html();
        positionMenu(this, value, 'right');
        $('#menu.menu').find('.member_preview_link.member_image.thumb_36')[0].href = userProfile;
    });

    //hide the menu
    $('.popover_mask').on('click.popover_mask', function () {
        $(this).parent().addClass('hidden');
        userFileStatus = false;
    });

    //shows menu headers
    $('.channel_header_icon').on('click', function () {
        $('.channel_header_icon.active').removeClass('active');
        $(this).addClass('active');

        //aqui lo demas
        var obj = this.id;
        if (obj.indexOf('_toggle') !== -1) {
            obj = obj.replace('_toggle', ''); //TODO: arreglar la morzillera esta

            if (obj != 'flex_menu') {
                var arr = (obj.split('_').length > 1) ? obj.split('_')[1] : obj.split('_')[0];
                $('.panel.active').removeClass('active');
                $('#' + arr + '_tab').addClass('active');
                change_chat_size('65%');
            } else {
                var value = $('#hiddenMenuFlexMenu').html();
                var options = {style: 'menu flex_menu', height: '32%'};
                positionMenu(this, value, 'left', options);
            }
        }
    });

    //show profile right view
    $('#menu.menu').off('click.right_menu').on('click.right_menu', '#member_account_item', function () {
        showProfile($(this).data('user'));
    });

    //hidden menu
    $('#menu.menu').on('click', '#member_prefs_item', function () {
        $('#menu.menu').addClass('hidden');
    });

    //search option
    $('input#search_terms').on('focus', function () {
        $('#search_autocomplete_popover').removeClass('hidden');
        $('#client-ui').addClass('search_focused');
        $('#search_autocomplete_popover').trigger('focus');
    });

    //search option
    $('#search_autocomplete_popover').focusout(function () {
        $('#search_autocomplete_popover').addClass('hidden');
        $('#client-ui').removeClass('search_focused');
    });

    //close flex panel
    $('.panel').on('click', '.close_flexpane', function () {
        change_chat_size('100%');
        $('.panel.active').removeClass('active');
        $('.channel_header_icon.active').removeClass('active');
        var closure = $(this).data('pannel');
        if (closure != 'undefined' && closure != null) {
            $('#' + closure).addClass('hidden');
        }
        $('#client-ui').removeClass('flex_pane_showing');
    });

    //flex panel go before action
    $('.panel').on('click', '#back_from_member_preview', function () {
        team_users();
    });

    $('#channel-list').on('click', '.channel', function () {
        active_chat(this.id, 'channel');
        activeChannel = this.id;
        Reload(activeChannel);
    });

    $('#im-list').on('click', '.member', function () {
        active_chat($(this).attr('data-name'), 'user');
        activeChannel = $(this).attr("data-name");
        Reload(activeChannel);
        CheckReaded(activeChannel);
    });

    //show user profile
    $('#member_account_item').on('click', function () {
        showProfile(this);
        $('#menu.menu').addClass('hidden');
        change_chat_size('65%');
    });

    //show user detail
    $('#active_members_list').on('click', '[data-user]', function () {
        showProfile($(this).attr('data-user'));
    });

    //show user profile
    $('#active_members_list').on('click', '.member_preview_link', function () {
        showProfile(this);
    });

    $("#direct_messages_header, .new_dm_btn").on("click", function (e) {
        e.stopPropagation();
        $("#direct_messages_header, .channels_list_new_btn").tooltip("hide");
        openDirectModal();
    });

    $("#channels_header").on("click", function (e) {
        e.stopPropagation();
        $("#channels_header").find(".channel_list_header_label").tooltip("hide");
        openDirectBrowse();
    });

    $(".new_channel_btn").on("click.channel_btn", function (e) {
        e.stopPropagation();
        $(".channels_list_new_btn").tooltip("hide");
        openNewChannel();
    });

    $("button.voice_call").on("click.voice_call", function (e) {
        e.stopPropagation();
        var urlapi = hostUrl + '/call/aa';
        $.redirect(urlapi, {usercall: activeChannel, csrfmiddlewaretoken: getCookie("csrftoken")}, 'POST', '_blank');
    });

    $('li button[data-qa="im_close"]').on('click.close_user_connect', function (e) {
        /*e.preventDefault();
        alert('close');
        console.log($(this).parent('li'));*/
        e.stopPropagation();
    });

    $('ul#im-list').on('click.remove_chat_user', 'button[data-user]', function (e) {
        console.log($(this).attr('data-user'));
        var element = $('ul#im-list').find('li[data-name= ' + $(this).attr('data-user') + ']')[0];
        element.parentNode.removeChild(element);
        $('#msgs_div').html('');
        e.stopPropagation();
    });

    $('#details_toggle').on('click.showDetail', function () {
        $('.channel_header_icon.active').removeClass('active');
        $(this).addClass('active');
        $('.panel.active').removeClass('active');
        $('#details_tab').addClass('active');
        $('#client-ui').addClass('flex_pane_showing');
        change_chat_size('65%');
    });

    //aux methods
    var get_chanel = function () {
        var exc = function (response) {
            var list = $('#channel-list').html('');
            $('#channel_header_count').html(response.items.length);
            response.items.forEach(function (item) {
                var obj = {slug: item.slug, name: item.name};
                channels.push(obj);
                list.append(item_channel_list(item));
            });
        };

        var urlapi = apiUrl + 'room_user_list/' + userlogged + '/';
        request(urlapi, 'GET', null, null, exc, null);
    };

    /*var get_users = function () {
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
     };*/

    window.get_comuncation_me = function () {
        var exc = function (response) {
            window.usercomunication = response;

            var list = $('#im-list');
            $('#dm_header_count').html(response.length);
            $('span#active_members_count_value').html(response.length);
            $('#channel_members_toggle_count.blue_hover').html(response.length + ' members<span class="ts_tip_tip">View member list ('
                + Number(window.users_logged - 1) + '/' + Number(response.length - 1) + ' online)</span>');
            response.forEach(function (item) {
                var exist = $(list).find('li[data-name="' + item.user_connect.username.toLowerCase() + '"]');
                if (exist.length == 0)
                    list.append(item_user_list(item));
                else {
                    var test = item_user_list(item);
                    var div = document.createElement('div');
                    div.innerHTML = test;
                    exist[0].innerHTML = div.children[0].innerHTML;
                }
            });
        };

        var urlapi = apiUrl + 'cummunication_me/' + userlogged + '/';

        $.when(users_online()).done(function () {
            request(urlapi, 'GET', 'jsonp', null, exc, null);
        });
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
    };

    window.positionMenu = function (instance, items, positionSide, options) {
        var menu = $('#menu.menu');
        var position = $(instance).offset();
        var height = $(instance).outerHeight();
        if (options != undefined && options.style != undefined) {
            $(menu).removeClass();
            $(menu).addClass(options.style);
        }

        var values = {
            position: "absolute",
            left: (positionSide == 'right') ? (position.left + 15) + "px" : (position.left - 225) + "px",
            top: ((position.top + height) < 471) ? (position.top + height) + "px" : 471 + "px",//471px
            'max-height': (options != undefined && options.height != undefined) ? options.height : '46%'
        };

        if (options != undefined && options.bottom == true)
            values['top'] = (position.top - 200) + "px";

        $(menu).css(values);
        $('#menu .menu_body').html(items);
        $(menu).removeClass('hidden');
    };

    window.copyToClipboard = function (str) {
        var $temp = $("<input>");
        $("body").append($temp);
        $temp.val(str).select();
        document.execCommand("copy");
        $temp.remove();
    };

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
        $('html').addClass("fs_modal_active");
        var _selected_members = [];
        var _MAX = 8;

        $('#direct-message').on("click", "#fs_modal_close_btn", function () {
            _close();
        });

        function _close() {
            modal_bg.removeClass("active");
            modal_bg.addClass("hidden");
            modal.removeClass("active");
            modal.addClass("hidden");
            modal.find("#im_browser_tokens").removeClass("active");
            $('html').removeClass("fs_modal_active");

            _$list_container.unbind().off("click", ".im_browser_row", function () {
                _selected_members = [];
            });

            _$im_browser.off('click', '.member_token .remove_member_icon', function () {

            });

            _$im_browser.unbind().off("click", ".im_browser_go", function () {

            });
        }

        _startListView();

        _clear();

        if (!_selected_members)_selected_members = [];

        _$list_container.on("click.browser", ".im_browser_row", function () {
            _selectRow($(this));
        });

        _$im_browser.on("input.filter", "#im_browser_filter", function () {
            var input = $("#im_browser_filter").val();
            _filterListView(input);
        });

        _$im_browser.on('click.member', '.member_token .remove_member_icon', function () {
            var item = $(this).parent();
            var member = item.attr('data-member-id');
            var index = _selected_members.indexOf(member);
            if (index > -1)
                _selected_members.splice(index, 1);

            item.remove();
            var input = $("#im_browser_filter").val();
            _filterListView(input);
            _updateGo();
        });

        _$im_browser.on("click.push_user", ".im_browser_go", function () {
            active_chat(_selected_members[0], 'user');
            activeChannel = _selected_members[0];
            Reload(activeChannel);

            _selected_members.forEach(function (item) {
                var data = {user_connect: {username: item}, un_reader_msg: 0};
                //_selected_members.pop();

                if ($('ul#im-list').find('li[data-name= ' + data.user_connect.username + ']').length == 0)
                    $('ul#im-list').append(item_user_list(data));
            });
            _selected_members = [];
            /*var data = {user_connect: {username: _selected_members[0]}, un_reader_msg: 0};
             _selected_members.pop();

             if ($('ul#im-list').find('li[data-name= ' + data.user_connect.username + ']').length == 0)
             $('ul#im-list').append(item_user_list(data));*/
            _close();
        });

        $("#direct_messages_header, .channels_list_new_btn").tooltip("hide");

        function _filterListView(input) {
            var exc = function (data) {
                list.empty();

                $.each(data, function (index, item) {
                    var pos = 64 * index;
                    if ($.inArray(item.user.username, _selected_members) == -1)
                        list.append(item_direct_filter(item, parseInt(pos)));
                    else
                        pos -= 64 * index;
                });
            };
            var urlapi = apiUrl + 'usercomapny/';
            $.when(users_online()).done(function () {
                request(urlapi, 'POST', null, {term: input}, exc, null);
            });
        }

        function _startListView() {
            var exc = function (data) {
                list.empty();
                $.each(data, function (index, item) {
                    var pos = 64 * index;
                    list.append(item_direct_message(item, parseInt(pos)));
                });
            };
            var urlapi = apiUrl + companyuser + '/users/';

            request(urlapi, 'GET', null, null, exc, null);
        }

        function _selectRow(row) {
            var member = row.attr('data-member-id');
            var avatar = row.attr('data-img');

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
                    $("#im_browser_tokens").prepend(item_member_token(member, avatar));
                    $("#im_browser_filter").focus().val('').removeAttr('placeholder');
                }
            }
            _updateGo();

            _updateParticipantCountHint();
        }

        function _updateGo() {
            if (_selected_members.length)
                _$im_browser.find(".im_browser_go").removeClass("disabled");
            else
                _$im_browser.find(".im_browser_go").addClass("disabled");

            if (_selected_members.length >= _MAX)
                _$im_browser.addClass("reached_maximum");
            else
                _$im_browser.removeClass("reached_maximum");
        }

        function _updateParticipantCountHint() {
            var remaining = Math.max(0, _MAX - _selected_members.length);
            var $div = _$im_browser.find(".remaining_participant_hint");
            if (remaining)
                if (remaining === 1)
                    $div.text("You can add 1 more person");
                else
                    $div.text("You can add " + remaining + " more people");
            else
                $div.text("You have reached the maximum number of participants");
        }

        function _clear() {
            var select = $('#im_browser_tokens').find("div.member_token");
            $.each(select, function (index, item) {
                item.parentNode.removeChild(item);
            });
        }
    }

    //Browse Channel Modal
    function openDirectBrowse() {
        var modal = $("#browse-chanel").find("#fs_modal");
        var modal_bg = $("#fs_modal_bg");
        modal_bg.removeClass("hidden");
        modal_bg.addClass("active");
        modal.removeClass("hidden");
        modal.addClass("active");
        var list = $("#channel_browser").find('.list_items');
        var _$browse_chanel = $("#browse-chanel");
        var _$channel_list_container = $("#channel_list_container");

        $('html').addClass("fs_modal_active");

        _$browse_chanel.on("input", "#channel_browser_filter", function () {
            var input = $("#channel_browser_filter").val();
            _filterListView(input);
        });

        _$channel_list_container.on("click", ".channel_browser_row", function () {
            _selectRow($(this));
        });

        _$browse_chanel.on("click", "#fs_modal_close_btn", function () {
            _close();
        });

        _$browse_chanel.on("click", ".new_channel", function () {
            _close();
            $(".channels_list_new_btn").tooltip("hide")
            openNewChannel(true);
        });

        function _close() {
            modal_bg.removeClass("active");
            modal_bg.addClass("hidden");
            modal.removeClass("active");
            modal.addClass("hidden");
            $('html').removeClass("fs_modal_active");

            _$channel_list_container.unbind().off("click", ".channel_browser_row", function () {

            });
        }

        _startListView();

        function _startListView() {
            var urlapi = apiUrl + companyuser + '/room/all/';
            request(urlapi, 'GET', null, null, render, null);
        };

        function _filterListView(input) {
            var urlapi = apiUrl + 'company_room';
            $.when(users_online()).done(function () {
                request(urlapi, 'POST', null, {term: input}, render, null);
            });
        };

        function render(data) {
            list.empty();
            $.each(data, function (index, item) {
                var pos = 100 * index;
                list.append(item_channel_browse(item, parseInt(pos)));
            });
        };

        function _selectRow(row) {
            var channel = row.attr('data-channel-id');
            alert("channel");
            //ReloadChanel(channel);
        }
    }

    //Create Channel Modal
    function openNewChannel(back) {
        var modal = $("#create-channel").find("#fs_modal");
        var modal_bg = $("#fs_modal_bg");
        modal_bg.removeClass("hidden");
        modal_bg.addClass("active");
        modal.removeClass("hidden");
        modal.addClass("active");
        var list = $("#create-channel").find('.list_items');
        var _$create_chanel = $("#create-channel");
        var _$channel_list_container = $("#channel_list_container");
        var btn_back = $("#create-channel").find("#fs_modal_back_btn");
        var ts_toggle_button = $('.ts_toggle_button');

        if (back) {
            btn_back.removeClass("hidden");
            btn_back.addClass("active");
        }

        var visibility = true;
        var title = "";
        var purpose = "";
        var invites = [];

        ts_toggle_button.click(function () {
            var ts_toggle = $('.ts_toggle');
            if (visibility) {
                visibility = false;
                ts_toggle.removeClass("checked");
            }
            else {
                visibility = true;
                ts_toggle.addClass("checked");
            }
        });

        _$create_chanel.on("click", "#fs_modal_close_btn", function () {
            _close();

        });

        _$create_chanel.on("input", "#channel_create_title", function () {
            var input = $("#channel_create_title").val();

            if (input.length > 0) {
                $('#save_channel').removeAttr('disabled');
            }
            else if (input.length == 0) {
                $('#save_channel').attr('disabled', "disabled");
            }
        });

        _$create_chanel.on("input", ".lfs_input", function () {
            var input = $(".lfs_input").val();
            _filter(input);
        });

        $('.list_items').on('click', ".lfs_item", function () {
            _selectRow($(this));
        });
        _$create_chanel.on('click', '.channel_invite_member_token', function () {
            var item = $(this);
            var member = item.attr('data-member-id');
            var index = invites.indexOf(member);

            if (index > -1) {
                invites.splice(index, 1);
            }

            item.remove();

            var input = $(".lfs_input").val();
            _filter(input);
            $(".lfs_item").removeClass('lfs_token selected');
            $('.lfs_input_container').addClass('empty');
            $(".lfs_input").focus().val('').attr('placeholder', "Search by name");
        });
        $('#save_channel').click(function () {
            title = $('#channel_create_title').val();
            purpose = $('#channel_purpose_input').val();
            var data = {title: title, purpose: purpose, visibility: visibility, invites: JSON.stringify(invites)};

            function exc() {
                alert(data.result);
            };

            var urlapi = apiUrl + 'create_room';
            request(urlapi, 'POST', null, data, exc, null);

        });
        btn_back.click(function () {
            _close();
            openDirectBrowse();
        });

        function _filter(input) {
            function exc(data) {
                if (data.length > 0) {
                    $(".lazy_filter_select").addClass('list_invite')
                    $(".lfs_input_container").addClass('active')
                    $(".lfs_list_container").addClass('visible');
                } else {
                    $('.lfs_empty').addClass('active');
                }

                $('.list_items').empty();
                var count = 0;
                $.each(data, function (index, item) {
                    var pos = 64 * index;

                    if ($.inArray(item.user.username, invites) == -1) {
                        $('.lfs_list .list_items').append(item_search_user(item, parseInt(pos)));
                        count += 1;
                    }
                    else {
                        pos -= 64 * index;
                        count -= 1;
                    }

                    if (count > 1)
                        $('.list_items').css('height', '120px')
                    else
                        $('.list_items').css('height', '50px')

                });
            }

            var urlapi = apiUrl + 'usercomapny/';
            request(urlapi, 'POST', null, {term: input}, exc, null);
        }

        function _close() {
            modal_bg.removeClass("active");
            modal_bg.addClass("hidden");
            modal.removeClass("active");
            modal.addClass("hidden");
            btn_back.removeClass("active");
            btn_back.addClass("hidden");
            $('html').removeClass("fs_modal_active");
            $(".lazy_filter_select").removeClass('list_invite')
            $(".lfs_input_container").removeClass('active')
            $(".lfs_list_container").removeClass('visible');
            invites = [];
            $('.list_items').empty();
            $(".lfs_item").empty();
            $(".lfs_item").removeClass('lfs_token selected');
            $('.lfs_input_container').addClass('empty');
            $(".lfs_input").focus().val('').attr('placeholder', "Search by name");
            $('#channel_create_title').val("");
            $('#channel_purpose_input').val('');
            _$create_chanel.unbind().off('click', '.channel_invite_member_token', function () {

            });
            $('.list_items').unbind().off('click', ".lfs_item", function () {

            });
        }

        function _selectRow(row) {
            var member = row.attr('data-member-id');
            if ($.inArray(member, invites) == -1) {
                invites.push(member);

                $('.list_items').empty();
                $(".lazy_filter_select").removeClass('list_invite')
                $(".lfs_input_container").removeClass('active')
                $(".lfs_list_container").removeClass('visible');

                $(".lfs_item").prepend(item_member_channel(member));
                $(".lfs_item").addClass('lfs_token selected');
                $('.lfs_input_container').removeClass('empty');

                $(".lfs_input").focus().val('').removeAttr('placeholder');
            }
        }
    }

    var getUsersCompany = function () {
        var exc = function (response) {
            response.forEach(function (item) {
                users.push(item.user.username);
            });
        };
        var urlapi = apiUrl + companyuser + '/users/';
        request(urlapi, 'GET', 'json', null, exc, null, 'other');
    };

    var getTypesLanguage = function () {
        var exc = function (response) {
            response.forEach(function (item) {
                obj = {key: item[0], value: item[1]};
                typesL.push(obj);
            });
        };
        var urlapi = apiUrl + 'snippet/languages/';
        request(urlapi, 'GET', 'json', null, exc, null, 'other');
    };

    var showProfile = function (id) {
        var exc = function (response) {
            var list = $('#member_preview_container').html('');
            var date = moment(new Date(), moment.ISO - 8601).format("h:mm a");
            list.append(item_user_profile(response[0], date));
        };

        $('.panel.active').removeClass('active');
        $('#team_list_container').addClass('hidden');

        var urlapi = apiUrl + 'profile/' + id + '/';
        request(urlapi, 'GET', null, null, exc, null);

        $('#member_preview_container').removeClass('hidden');
        $('#client-ui').addClass('flex_pane_showing');
        $('#team_tab').addClass('active');
        $('#menu.menu').addClass('hidden');
    };
});