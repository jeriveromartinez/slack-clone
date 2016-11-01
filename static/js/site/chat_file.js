/**
 * Created by julio on 31/10/16.
 */
$(document).ready(function () {

    $('.flexpane_menu_item').on('click', function () {
        switch (this.id) {
            case 'list_team':
                team_users();
                break;
            case 'files_all':
                console.log('All files');
                break;
            case 'files_user':
                user_files();
                break;
        }

        change_chat_size('65%');
    });

    $('#file_list_by_user').on('click', '.file_list_item', function () {
        var exc = function (response) {
            $('#file_preview_container').removeClass('hidden');
            var item = $('#monkey_scroll_wrapper_for_file_preview_scroller').html('');
            var file = response[0];
            item.append(item_file_detail(file.author.user.username, file.author.image, file.title, file_comments_msg(file.files_comments)));
        };

        $('.panel.active').removeClass('active');
        $('#files_tab').addClass('active');

        var urlapi = apiUrl + 'files/' + userlogged + '/detail/' + this.id;
        request(urlapi, 'GET', null, null, exc, null);
        $('#file_list_container').addClass('hidden');
    });

    $('#back_from_file_preview').on('click', function () {
        $('#file_preview_container').addClass('hidden');
        $('#file_list_container').removeClass('hidden');
        user_files();
    });

    //AUX
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

    var user_files = function () {
        $('.panel.active').removeClass('active');
        $('#files_tab').addClass('active');

        var exc = function (response) {
            var list = $('#file_list_by_user').html('');
            response.forEach(function (item) {
                var author = item.author.user.first_name + ' ' + item.author.user.last_name;
                var date = moment(item.uploaded, moment.ISO - 8601).format("MMM Do \\at h:mm a");
                list.append(item_file(item.slug, author, date, item.title, null, null));
            });
        };

        var urlapi = apiUrl + 'files/' + userlogged + '/';
        request(urlapi, 'GET', null, null, exc, null);
        $('#menu.flex_menu').addClass('hidden');
    };
});