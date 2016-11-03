/**
 * Created by julio on 31/10/16.
 */
$(document).ready(function () {
    var userFileStatus = false, userFileActive = userlogged;

    /*$(document).click(function (event) {
     var target = $(event.target)[0];
     var outside = $('.menu.my_menu');
     var span = $('span.name')[0], a = $('a')[0];

     if (target != span && target != a && !$(outside).hasClass('hidden')) {
     $(outside).addClass('hidden');
     userFileStatus = false;
     }
     });*/

    //menu more items options
    $('.flexpane_menu_item').on('click', function () {
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

        change_chat_size('65%');
    });

    // get file details form user and company
    $('#file_list_by_user').on('click', '.file_list_item', function () {
        var exc = function (response) {
            $('#file_preview_container').removeClass('hidden');
            var item = $('#monkey_scroll_wrapper_for_file_preview_scroller').html('');
            var file = response[0];
            item.append(item_file_detail(file.author.user.username, file.author.image, file.title, file_comments_msg(file.files_comments)));
        };

        $('.panel.active').removeClass('active');
        $('#files_tab').addClass('active');
        $('#file_list_toggle_user').addClass('active');

        var urlapi = apiUrl + 'files/' + userFileActive + '/detail/' + this.id;
        request(urlapi, 'GET', null, null, exc, null);
        $('#file_list_container').addClass('hidden');
    });

    //go from details to user select files
    $('#back_from_file_preview').on('click', function () {
        $('#file_preview_container').addClass('hidden');
        $('#file_list_container').removeClass('hidden');
        user_files(userFileActive);
    });

    $('#file_list_toggle_all').on('click', function () {
        user_all_files();
    });

    $('#file_list_toggle_user').on('click', function (event) {
        if ($('#file_list_toggle_user').hasClass('active')) {
            if (!userFileStatus) {
                var urlapi = apiUrl + companyuser + '/users/';
                var exc = function (request) {
                    var list = $('#menu_items[role="menu_users"]');
                    $(list).html('');
                    request.forEach(function (item) {
                        list.append(item_user_menu(item.user.username, item.image));
                    });
                };

                request(urlapi, 'GET', null, null, exc, null);
                $('.menu.my_menu.hidden').removeClass('hidden');
                userFileStatus = true;
            } else {
                $('.menu.my_menu').addClass('hidden');
                userFileStatus = false;
            }
        } else {
            user_files();
        }

        event.stopPropagation();
    });

    //get files by user selected 
    $('.menu.my_menu').on('click', 'li.member_item', function () {
        var user = this.id;
        user_files(user);
        $('#file_list_toggle_user.active').find('a').html((userFileActive == userlogged) ? 'Just You' : userFileActive);
        $('.menu.my_menu').addClass('hidden');
    });

    //AUX
    var user_files = function (username) {
        clean_user_files();
        $('.panel.active').removeClass('active');
        $('#files_tab').addClass('active');
        $('#file_list_toggle_user').addClass('active');

        userFileActive = username = (username) ? username : userlogged;
        var urlapi = apiUrl + 'files/' + username + '/';
        request(urlapi, 'GET', null, null, user_files_exc, null);
        $('#menu.flex_menu').addClass('hidden');
    };

    var user_all_files = function () {
        clean_user_files();
        $('.panel.active').removeClass('active');
        $('#files_tab').addClass('active');
        $('#file_list_toggle_all').addClass('active');

        var urlapi = apiUrl + 'files/' + userlogged + '/' + companyuser + '/';
        request(urlapi, 'GET', null, null, user_files_exc, null);
        $('#menu.flex_menu').addClass('hidden');
    };

    var user_files_exc = function (response) {
        var list = $('#file_list_by_user').html('');
        response.forEach(function (item) {
            var author = item.author.user.first_name + ' ' + item.author.user.last_name;
            var date = moment(item.uploaded, moment.ISO - 8601).format("MMM Do \\at h:mm a");
            var pathProfile = getUserPath(item.author.user.username);
            list.append(item_file(item.slug, author, date, item.title, item.files_comments.length, pathProfile));
        });
    };

    var clean_user_files = function () {
        $('#file_list_toggle_all').removeClass('active');
        $('#file_list_toggle_user').removeClass('active');
    };
});