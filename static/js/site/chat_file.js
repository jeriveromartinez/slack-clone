/**
 * Created by julio on 31/10/16.
 */
$(document).ready(function () {

    //menu more items options
    $('#menu').on('click', '.flexpane_menu_item', function () {
        switch (this.id) {
            case 'list_team':
                team_users(); //get list of users from team
                break;
            case 'files_all':
                user_all_files(); //get all company's files
                break;
            case 'files_user':
                user_files(); //get all user's files
                break;
        }
        $('#client-ui').addClass('flex_pane_showing');
        change_chat_size('65%');
    });

    // get file details form user and company
    $('#file_list_by_user').on('click', '.file_list_item', function () {
        detail_file($(this).attr('data-url'));
    });

    //go from details to user select files
    $('#back_from_file_preview').on('click', function () {
        $('#file_preview_container').addClass('hidden');
        $('#file_list_container').removeClass('hidden');
        user_files(userFileActive);
    });

    //get all files from company
    $('#file_list_toggle_all').on('click', function () {
        user_all_files();
    });

    //list documents by user select in All Files Type
    $('#file_list_toggle_user').on('click', function (event) {
        var instance = this;
        if ($('#file_list_toggle_user').hasClass('active')) {
            if (!userFileStatus) {
                var elements = '<ul id="menu_items" role="menu" no-bootstrap="1">';
                var urlapi = apiUrl + companyuser + '/users/';
                var exc = function (request) {
                    /*var list = $('#menu_items[role="menu_users"]');
                     $(list).html('');*/
                    request.forEach(function (item) {
                        elements += item_user_menu(item.user.username, item.image);
                        //list.append(item_user_menu(item.user.username, item.image));
                    });
                    elements += '</ul>';
                    positionMenu(instance, elements, 'right', 'menu menu_user_list');
                };

                request(urlapi, 'GET', null, null, exc, null);
                //$('.menu.menu_user_list.hidden').removeClass('hidden');
                userFileStatus = true;
            }
        } else {
            user_files();
        }
        userFileStatus = false;
        event.stopPropagation();
    });

    //get files by user selected 
    $('.menu.menu_user_list').on('click', 'li.member_item', function () {
        var user = this.id;
        user_files(user);
        $('#file_list_toggle_user.active').find('a').html((userFileActive == userlogged) ? 'Just You' : userFileActive);
        $('.menu.menu_user_list').addClass('hidden');
        userFileStatus = false;
    });

    //launch files upload forms
    $('#primary_file_button').on('click', function () {
        var value = $('#hiddenMenuFileUpload').html();
        var options = {style: 'menu file_menu menu_file_create', bottom: true};
        positionMenu(this, value, 'right', options);
    });

    //select files from pc
    $('#menu .menu_body').on('click', '.file_menu_item', function () {
        hide_menu_files();
        $('#file-upload').click();
    });

    //save files uploaded
    $('#file-upload').on('change', function () {
        var data = new FormData();
        $.each($(this)[0].files, function (key, file) {
            data.append('file[' + key + ']', file);
        });

        var exc = function (response) {
            console.log(response);//TODO: agregar aqui el archivo a la lista si esta activa 
        };

        var urlapi = apiUrl + 'files/upload/' + userlogged + '/' + sendTo.type + '/' + sendTo.to + '/';
        request(urlapi, 'POST', 'html', data, exc, null, 'file');
    });

    //add comment to the file
    $('#monkey_scroll_wrapper_for_file_preview_scroller').on('click', '#file_comment_submit_btn', function () {
        var exc = function (request) {
            if (request.data == "save") {
                $('.file_body.post_body').append('<p>' + comment.comment + '</p>')
                $('#file_comment').val('');
            }
        };

        var comment = {comment: $('#file_comment').val()};
        var file = $('#file_preview_head_section').attr("data-file"),
            owner = $('#file_preview_head_section').attr("data-owner");

        var urlapi = apiUrl + 'files/detail/' + file + '/' + userlogged + '/';
        request(urlapi, 'POST', 'json', comment, exc, null);
    });

    //show file's menu
    $('#file_list_by_user').on('click', '.file_actions', function (event) {
        var options = {
            copyLink: $(this).attr('data-file-url'),
            opeNeWind: $(this).attr('data-file-url'),
            comment: $(this).attr('data-file'),
            edit: $(this).attr('data-file'),
            delete: $(this).attr('data-file'),
        };
        positionMenu(this, file_options($('#hiddenMenuFile').prop('innerHTML'), options), 'left');
        event.stopPropagation();
    });

    //select action from file's menu
    $('#menu .menu_body').on('click', 'a[data-url]', function () {
        var options = {data: $(this).attr('data-url')};
        $('#menu').addClass('hidden');
        action($(this).attr('data-action'), options);
    });

    //AUX
    var user_files = function (username) {
        clean_user_files();
        $('.panel.active').removeClass('active');
        $('#files_tab').addClass('active');
        $('#file_list_toggle_user').addClass('active');

        userFileActive = username = (username) ? username : userlogged;
        var urlapi = apiUrl + 'files/' + username + '/get/all_files/';
        request(urlapi, 'GET', null, null, user_files_exc, null);
        $('#menu.flex_menu').addClass('hidden');
    };

    var user_all_files = function () {
        clean_user_files();
        $('.panel.active').removeClass('active');
        $('#files_tab').addClass('active');
        $('#file_list_toggle_all').addClass('active');

        var urlapi = apiUrl + 'files/' + userlogged + '/all_files/' + companyuser + '/';
        request(urlapi, 'GET', null, null, user_files_exc, null);
    };

    var user_files_exc = function (response) {
        var list = $('#file_list_by_user').html('');
        response.forEach(function (item) {
            var author = item.author.user.first_name + ' ' + item.author.user.last_name;
            var date = moment(item.uploaded, moment.ISO - 8601).format("MMM Do \\at h:mm a");
            var pathProfile = getUserPath(item.author.user.username);
            list.append(item_file(item.slug, author, date, item.title, item.files_comments.length, pathProfile, item));
        });
        $('[data-toggle="tooltip"]').tooltip({placement: "left", delay: {show: 500, hide: 150}});
    };

    var clean_user_files = function () {
        $('#file_list_toggle_all').removeClass('active');
        $('#file_list_toggle_user').removeClass('active');
    };

    var hide_menu_files = function () {
        $('#menu.menu').addClass('hidden');
    };

    var action = function (action, properties) {
        switch (action) {
            case 'copy':
                copyToClipboard(hostUrl + properties.data);
                break;
            case 'open':
                window.open(properties.data, '_blank');
                break;
            case 'comment':
                detail_file(properties.data);
                break;
            case 'delete':
                delete_file(properties.data);
                break;
        }
    };

    var detail_file = function (key) {
        var exc = function (response) {
            $('#file_preview_container').removeClass('hidden');
            var item = $('#monkey_scroll_wrapper_for_file_preview_scroller').html(''),
                userurl = hostUrl + '/account/profile/' + response.author.user.username + '/';
            item.append(item_file_detail(response.author.user.username, userurl, response.author.image, response.title, response.slug, file_comments_msg(response.files_comments)));
        };

        $('.panel.active').removeClass('active');
        $('#files_tab').addClass('active');
        $('#file_list_toggle_user').addClass('active');

        var urlapi = apiUrl + 'files/detail/' + key;
        request(urlapi, 'GET', null, null, exc, null);
        $('#file_list_container').addClass('hidden');
    };

    var delete_file = function (key) {
        var exc = function (response) {
            console.log(response);
            if (response.success == 'ok') {
                if (userFileStatus)
                    user_files(userFileActive);
                else
                    user_all_files();
            }
        };

        var urlapi = apiUrl + 'files/delete/' + key + '/';
        request(urlapi, 'DELETE', null, null, exc, null);
    };
});