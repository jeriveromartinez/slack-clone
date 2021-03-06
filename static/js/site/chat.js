/**
 * Created by julio on 14/10/16.
 */

$(document).ready(function () {
    //beginnings methods
    $(function () {
        initView();
        get_chanel();
        get_comuncation_me();

        setInterval(function () {
            get_comuncation_me();
        }, 10000);
        active_chat(userlogged, 'user');
        getUsersCompany();
        getTypesLanguage();
    });

    //show menu user logged
    $('#team_menu').on('click.team_menu', function () {
        var value = $('#hiddenMenuUser').html();
        var options = {height: '21rem'};
        positionMenu(this, value, 'right', options);
        $('#menu.menu').find('.member_preview_link.member_image.thumb_36')[0].href = userProfile;
    });

    //hide the menu
    $('.popover_mask').on('click.popover_mask', function () {
        $(this).parent().addClass('hidden');
        userFileStatus = false;
        $('#client-ui').removeClass('search_focused');
    });

    //shows menu headers
    $('.channel_header_icon').on('click.channel_header', function () {
        $('.channel_header_icon.active').removeClass('active');
        $(this).addClass('active');

        var obj = this.id;
        if (obj.indexOf('_toggle') !== -1) {
            obj = obj.replace('_toggle', '');

            if (obj != 'flex_menu') {
                var arr = (obj.split('_').length > 1) ? obj.split('_')[1] : obj.split('_')[0];
                $('.panel.active').removeClass('active');
                $('#' + arr + '_tab').addClass('active');
            } else {
                var value = $('#hiddenMenuFlexMenu').html();
                var options = {style: 'menu flex_menu', height: '10rem'};
                positionMenu(this, value, 'left', options);
            }
        }
    });

    //show profile right view
    $('#menu.menu').off('click.right_menu').on('click.right_menu', '#member_account_item', function () {
        showProfile($(this).data('user'));
    });

    //hidden menu
    $('#menu.menu').on('click.hide_menu', '#member_prefs_item', function () {
        $('#menu.menu').addClass('hidden');
    });

    //close flex panel
    $('.panel').on('click.close_panel', '.close_flexpane', function () {
        //change_chat_size('100%');
        $('.panel.active').removeClass('active');
        $('.channel_header_icon.active').removeClass('active');
        var closure = $(this).data('pannel');
        if (closure != 'undefined' && closure != null) {
            $('#' + closure).addClass('hidden');
        }
        $('#client-ui').removeClass('flex_pane_showing');
        $('input#search_terms').val('');
    });

    //flex panel go before action
    $('.panel').on('click.option_back', '#back_from_member_preview', function () {
        team_users();
    });

    //show user profile
    $('#member_account_item').on('click.show_profile', function () {
        showProfile($(this).attr('data-user'));
        $('#menu.menu').addClass('hidden');
        //change_chat_size('65%');
    });

    //show user detail
    $('#active_members_list').on('click.user_details', '[data-user]', function () {
        showProfile($(this).attr('data-user'));
    });

    //show user profile
    $('#active_members_list').on('click.user_profile', '.member_preview_link', function () {
        showProfile($(this).attr('data-user'));
    });

    $("#direct_messages_header, .new_dm_btn").on("click.direct_msg", function (e) {
        e.stopPropagation();
        $("#direct_messages_header, .channels_list_new_btn").tooltip("hide");
        openDirectModal();
    });

    $("#channels_header").on("click.channel_header", function (e) {
        e.stopPropagation();
        $("#channels_header").find(".channel_list_header_label").tooltip("hide");
        openDirectBrowse();
    });

    $(".new_channel_btn").on("click.channel_btn", function (e) {
        e.stopPropagation();
        $(".channels_list_new_btn").tooltip("hide");
        openNewChannel();
    });

    $("#channel_list_invites_link").on("click.user_invited", function (e) {
        e.stopPropagation();
        /*$("#direct_messages_header, .channels_list_new_btn").tooltip("hide");
         $('#channel_invite #fs_modal').removeClass('hidden').addClass('active');
         $('#fs_modal_bg').removeClass('hidden').addClass('active');*/
        showInvitations();
    });

    $('#menu.menu').on('click.show_invitations_menu', '#team_invitations', function (e) {
        e.stopPropagation();
        hide_menu_files();
        showInvitations();
    });

    $('#channel_list_invites_link').on('click.closed_user_invited', '#fs_modal_close_btn', function () {
        $('#channel_invite #fs_modal').removeClass('active').addClass('hidden');
        $('#fs_modal_bg').removeClass('active').addClass('hidden');
    });

    $("button.voice_call").on("click.voice_call", function (e) {
        e.stopPropagation();
        var urlapi = hostUrl + '/call/aa';
        $.redirect(urlapi,
            {
                usercall: activeChannel.name,
                csrfmiddlewaretoken: getCookie("csrftoken")
            },
            'POST', '_blank');
    });

    $('li button[data-qa="im_close"]').on('click.close_user_connect', function (e) {

        alert('close', this.attr('data-user'));


    });

    $('ul#im-list').on('click.remove_chat_user', 'button[data-user]', function (e) {
        var user = $(this).attr('data-user');
        var _this = this;
        var exc = function (response) {
            var element = $('ul#im-list').find('li[data-name= ' + $(_this).attr('data-user') + ']')[0];
            element.parentNode.removeChild(element);
            $('#msgs_div').html('');
        };
        var urlapi = apiUrl + 'deletecummunication/' + user + '/';
        request(urlapi, 'GET', null, null, exc, null);


        e.stopPropagation();
    });

    $('#details_toggle').on('click.showDetail', function () {
        $('.channel_header_icon.active').removeClass('active');
        $(this).addClass('active');
        $('.panel.active').removeClass('active');
        $('#details_tab').addClass('active');
        $('#client-ui').addClass('flex_pane_showing');

    });

    //hide invited users
    $('#channel_invite').on('click.user_invited', '#fs_modal_close_btn', function () {
        $('#fs_modal.active').removeClass('active').addClass('hidden');
        $('#fs_modal_bg').removeClass('active').addClass('hidden');
    });

    //hide all full screen menu
    $(document).on('keyup.hide_modal', function (e) {
        if (e.keyCode == 27) {
            $('#fs_modal.active').removeClass('active').addClass('hidden');
            $('#fs_modal_bg').removeClass('active').addClass('hidden');
        }
    });

    //add new row invitations
    $('a[data-action="admin_invites_add_row"]').on('click.add_user_invite', function () {
        var item = $($('#invite_rows').find('.admin_invite_row.clearfix:last')).clone().find("input:text").val("").end();
        var num = parseInt(item.prop("id").match(/\d+/g), 10) + 1;
        item.prop('id', 'invite_' + num);
        $(item).find('a.delete_row').prop('id', 'invite_' + num);
        $('#invite_rows').append(item);
        $('#individual_invites span.ladda-label').html('Invite ' + ++countInvited + ' Person');
        showDeleteInvitations();
    });

    //send invitations to server
    $('#individual_invites').submit(function () {
        var inputs = $('#individual_invites :input');
        var array = inputs.serializeArray(),
            send = [];

        for (var i = 0; i < array.length - 3; i += 3) {
            var object = {
                email: array[i].value,
                fName: array[i + 1].value,
                lName: array[i + 2].value
            };
            send.push(object);
        }

        var exc = function (response) {
            console.log(response);
            if (response.response == 'ok') {
                $('#fs_modal.active').removeClass('active').addClass('hidden');
                $('#fs_modal_bg').removeClass('active').addClass('hidden');
                send = [];
            } else {
                $('#fs_modal.active').removeClass('active').addClass('hidden');
                $('#fs_modal_bg').removeClass('active').addClass('hidden');
            }
        };

        var urlapi = apiUrl + 'email/send/';
        request(urlapi, 'POST', 'json', {invite: JSON.stringify(send)}, exc, null);
        return false;
    });

    //remove invitations
    $('#individual_invites').on('click.delete_invitaion_row', 'a.delete_row', function () {
        $('div#' + this.id).remove();
        $('#individual_invites span.ladda-label').html('Invite ' + --countInvited + ' Person');
        showDeleteInvitations();
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

    window.get_comuncation_me = function () {
        var exc = function (response) {
            var list = $('#im-list');
            $('#direct_messages_header #dm_header_count').html(response.length);

            if (response.length > 0)
                $('#direct_messages_header .header_count').removeClass('hidden');

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
            request(urlapi, 'GET', 'json', null, exc, null);
        });
    };

    window.active_chat = function (search, type) {
        sendTo.type = type;
        if (type == "channel") {
            $('#channel_title').html('#' + search);
            sendTo.to = search;
        } else {
            $('#channel_title').html('@' + search);
            $('#im_meta a.member_preview_link.member_name').html('@' + search);
            var exc = function (response) {
                var name = response.user.first_name + ' ' + response.user.last_name;
                name = (name != ' ') ? name : 'Unnamed';
                $('span.member_real_name').html(name);
                var image = (response.image != null) ? response.image : '/static/images/ava_0022-48.png';
                $('#im_meta a.member_preview_link.member_image').css('background-image', 'url(' + image + ')');
            };

            var urlapi = apiUrl + 'profile/' + search + '/';
            request(urlapi, 'GET', null, null, exc, null);
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

        var height = $(window).height() - $('header').height();
        $('#team_tab').css('height', height);

        var urlapi = apiUrl + companyuser + '/users/';
        request(urlapi, 'GET', null, null, exc, null);

        $('#menu.flex_menu').addClass('hidden');
    };

    window.getUserPath = function (username) {
        var urlapi = apiUrl + 'profile/' + username + '/path/';
        return $.ajax({type: "GET", url: urlapi, async: false}).responseJSON.url;
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
        var body = $('#menu .menu_body');
        $(body).html(items);
        $(menu).removeClass('hidden');
        var position = $(instance).offset();
        var heightInst = $(instance).height(), heightMenu = $(body).height();

        var values = {
            position: "absolute",
            left: (positionSide == 'right') ? (position.left + 15) + "px" : (position.left - 225) + "px",
            top: ((position.top + heightInst) < $(window).height()) ? (position.top + heightInst) + "px" : $(window).height() + "px",//471px
            'max-height': (options != undefined && options.height != undefined) ? options.height : '25rem'
        };
        //console.log(parseFloat(getComputedStyle(parentElement).height));

        if (options != undefined && options.bottom == true)
            values['top'] = (position.top - heightMenu - heightInst - 20) + "px";
        if (options != undefined && options.left != undefined)
            values['left'] = (Number(values.left.split('px')[0]) + Number(options.left)) + 'px';
        if (options != undefined && options.style != undefined) {
            $(menu).removeClass();
            $(menu).addClass(options.style);
        }

        $(menu).css(values);
    };

    window.copyToClipboard = function (str) {
        var $temp = $("<input>");
        $("body").append($temp);
        $temp.val(str).select();
        document.execCommand("copy");
        $temp.remove();
    };

    //Direct message Modal
    var openDirectModal = function () {
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

        if (!_selected_members) _selected_members = [];

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
            activeChannel.name = _selected_members[0];
            activeChannel.type = "private";
            Reload(activeChannel.name);

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
            var urlapi = apiUrl + 'usercompany/';
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

            if ($.inArray(member, _selected_members) == -1) {
                _selected_members.push(member);
                var input = $("#im_browser_filter").val();
                _filterListView(input);
                $("#im_browser_tokens").prepend(item_member_token(member, avatar));
                $("#im_browser_filter").focus().val('').removeAttr('placeholder');
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
    };

    //Browse Channel Modal
    var openDirectBrowse = function () { //todo: add channel selected to list
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
            $(".channels_list_new_btn").tooltip("hide");
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
        }

        function _filterListView(input) {
            var urlapi = apiUrl + 'company_room/';
            $.when(users_online()).done(function () {
                request(urlapi, 'POST', null, {term: input}, render, null);
            });
        }

        function render(data) {
            list.empty();
            $.each(data, function (index, item) {
                var pos = 100 * index;
                list.append(item_channel_browse(item, parseInt(pos)));
            });
        }

        function _selectRow(row) {
            var channel = row.attr('data-channel-id');

            _close();
        }
    };

    //Create Channel Modal
    var openNewChannel = function (back) {
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

            if (index > -1)
                invites.splice(index, 1);

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

            function exc(response) {
                var data = {un_reader_msg: 0, name: response.result};
                $('#channel-list').append(item_channel_list(data));
                _close();
            }

            var urlapi = apiUrl + 'create_room/';
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

            var urlapi = apiUrl + 'usercompany/';
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
    };

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
            list.append(item_user_profile(response, date));
        };

        $('.panel.active').removeClass('active');
        $('#team_list_container').addClass('hidden');

        var urlapi = apiUrl + 'profile/' + id + '/';
        request(urlapi, 'GET', null, null, exc, null);

        $('#member_preview_container').removeClass('hidden');
        $('#client-ui').addClass('flex_pane_showing');
        $('#team_tab').addClass('active');
        $('#menu.menu').addClass('hidden');
        //resize('team_tab');
    };

    //get caret position
    window.getCaretPosition = function (ctrl) {
        var start, end;
        if (ctrl.setSelectionRange) {
            start = ctrl.selectionStart;
            end = ctrl.selectionEnd;
        } else if (document.selection && document.selection.createRange) {
            var range = document.selection.createRange();
            start = 0 - range.duplicate().moveStart('character', -100000);
            end = start + range.text.length;
        }
        return {
            start: start,
            end: end
        }
    };

    window.active_chat = function (search, type) {
        sendTo.type = type;
        if (type == "channel") {
            $('#channel_title').html('#' + search);
            sendTo.to = search;
        } else {
            $('#channel_title').html('@' + search);
            sendTo.to = search;
        }
    };

    window.get_chanel = function () {
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

    var showDeleteInvitations = function () {
        var count = $('#invite_rows').find('.admin_invite_row.clearfix').length;
        if (count > 1)
            $('.delete_row.hidden').each(function (key, item) {
                $(item).removeClass('hidden');
            });
        else
            $('.delete_row').addClass('hidden');
    };

    var showInvitations = function () {
        $("#direct_messages_header, .channels_list_new_btn").tooltip("hide");
        $('#channel_invite #fs_modal').removeClass('hidden').addClass('active');
        $('#fs_modal_bg').removeClass('hidden').addClass('active');
    };

    window.hide_menu_files = function () {
        $('#menu.menu').addClass('hidden');
    };

    var awayCallback = function () {

        var urlapi = apiUrl + 'checkactive/';
        request(urlapi, 'POST', null, {status: "False"}, null, null);
    };

    var awayBackCallback = function () {
        var urlapi = apiUrl + 'checkactive/';
        request(urlapi, 'POST', null, {status: "True"}, null, null);
    };

    var hiddenCallback = function () {
        var urlapi = apiUrl + 'checkactive/';
        request(urlapi, 'POST', null, {status: "False"}, null, null);
    };

    var visibleCallback = function () {
        var urlapi = apiUrl + 'checkactive/';
        request(urlapi, 'POST', null, {status: "True"}, null, null);
    };

    var idle = new Idle({
        onHidden: hiddenCallback,
        onVisible: visibleCallback,
        onAway: awayCallback,
        onAwayBack: awayBackCallback,
        awayTimeout: '180000' //away with default value of the textbox300000
    }).start();
});

var showPannelLeft = function () {
    $('#client-ui').addClass('flex_pane_showing');
};

var hidePannelLeft = function () {
    $('.panel.active').removeClass('active');
};

var activeFilesTab = function () {
    $('#files_tab').addClass('active');
    var height = $(window).height() - $('header').height();
    $('#files_tab').css('height', height);
};

var detail_file = function (key) {
    var exc = function (response) {
        hidePannelLeft();
        activeFilesTab();
        $('#file_list_toggle_user').addClass('active');
        $('#file_preview_container').removeClass('hidden');

        var height = $(window).height() - $('header').height();
        $('#file_preview_container').css('height', height);

        var item = $('#monkey_scroll_wrapper_for_file_preview_scroller').html('');
        item.append(item_file_detail(response));
        var comments = function (response) {
            var comm = file_comments_msg(response);
            $('#monkey_scroll_wrapper_for_file_preview_scroller').find('.comments').html(comm);
        };
        if (response.code != undefined) {
            highlightCode(response.code, response.type);
        }

        var urlapi = apiUrl + 'files/comment/' + key;
        request(urlapi, 'GET', null, null, comments, null);
    };

    var urlapi = apiUrl + 'files/detail/' + key;
    request(urlapi, 'GET', null, null, exc, null);
    $('#file_list_container').addClass('hidden');
};