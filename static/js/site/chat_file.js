/**
 * Created by julio on 31/10/16.
 */

File.prototype.convertToBase64 = function (callback) {
    var reader = new FileReader();
    reader.onload = function (e) {
        callback(e.target.result)
    };
    reader.onerror = function (e) {
        callback(null);
    };
    reader.readAsDataURL(this);
};

window.getArrayByObject = function (arrayObjects) {
    var ret = [];
    arrayObjects.forEach(function (item) {
        ret[item.key] = item.value;
    });

    return ret;
};

$(document).ready(function () {
    //menu more items options
    $('#menu').on('click.menu_items', 'li[role="menuitem"]', function () {
        switch (this.id) {
            case 'list_team':
                team_users(); //get list of users from team
                break;
            case 'files_all':
                user_all_files(); //get all company's files
                break;
            case 'files_user':
                user_files(userFileActive); //get all user's files
                break;
        }
        $('#client-ui').addClass('flex_pane_showing');
        change_chat_size('65%');
    });

    // get file details form user and company //show file's menu
    $('#file_list_by_user').on('click.file_detail', '.file_list_item', function () {
        detail_file(this.id);
    }).on('click.file_action', '.file_actions', function (event) {
        var options = {
                copyLink: $(this).attr('data-file-url'),
                opeNeWind: $(this).attr('data-file-url'),
                comment: $(this).attr('data-file'),
                edit: $(this).attr('data-file'),
                delete: $(this).attr('data-file'),
            },
            optionMenu = {height: '32%'};
        positionMenu(this, file_options_file($('#hiddenMenuFile').prop('innerHTML'), options), 'left', optionMenu);
        event.stopPropagation();
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
    $('#file_list_toggle_user').on('click', function () {
        var instance = this;
        if ($('#file_list_toggle_user').hasClass('active')) {
            if (!userFileStatus) {
                var elements = '<ul id="menu_items" role="menu" no-bootstrap="1">';
                var urlapi = apiUrl + companyuser + '/users/';
                var exc = function (request) {
                    request.forEach(function (item) {
                        elements += item_user_menu(item.user.username, item.image);
                    });
                    elements += '</ul>';
                    positionMenu(instance, elements, 'right', 'menu menu_user_list');
                };

                request(urlapi, 'GET', null, null, exc, null);
                userFileStatus = true;
            }
        } else {
            user_files(userFileActive);
        }
        userFileStatus = false;
    });

    //get files by user selected 
    $('#menu.menu').on('click', 'li.member_item', function () {
        var user = this.id;
        user_files(user);
        $('#file_list_toggle_user.active').find('a').html((userFileActive == userlogged) ? 'Just You' : userFileActive);
        $('.menu.menu_user_list').addClass('hidden');
        userFileStatus = false;
    });

    //launch files upload forms
    $('#primary_file_button').on('click', function () {
        var value = $('#hiddenMenuFileUpload').html();
        var options = {style: 'menu file_menu menu_file_create', bottom: true, height: '26%'};
        positionMenu(this, value, 'right', options);
    });

    //add comment to the file
    $('#monkey_scroll_wrapper_for_file_preview_scroller').on('click.add_comment', '#file_comment_submit_btn', function () {
        var exc = function (request) {
            if (request.data == "save") {
                var userUrl = '/account/profile/' + userlogged + '/',
                    date = moment(new Date(), moment.ISO - 8601).format("MMM Do \\at h:mm a");
                $('#monkey_scroll_wrapper_for_file_preview_scroller').find('#file_preview_comments_section .comments')
                    .prepend(item_file_comment(userlogged, userUrl, userImage, date, comment.comment));
                $('#file_comment').val('');
            }
        };

        var comment = {comment: $('#file_comment').val()};
        var file = $('#file_preview_head_section').attr("data-file");

        var urlapi = apiUrl + 'files/detail/' + file + '/' + userlogged + '/';
        request(urlapi, 'POST', 'json', comment, exc, null);
    });

    //select action from file's menu
    $('#menu.menu').on('click.action', 'a[data-url]', function () {
        var options = {data: $(this).attr('data-url')};
        $('#menu').addClass('hidden');
        action($(this).attr('data-action'), options);//TODO: falta el edit del archivo.
    });

    //select files from pc
    $('#menu.menu').off('click.upload_file').on('click.upload_file', '#create-file', function () {
        hide_menu_files();
        var instance = this;
        this.options = userListForModal(channels, users),
            this.data = null;

        var modal = new Modal('Upload a file?', 'Upload', uploadComponent(this.options), this.data);

        $('#file-upload').click();

        $('#file-upload').on('change.file', function () {
            instance.data = new FormData();
            var file = this.files[0];

            if (file.type.indexOf('image') !== -1)
                file.convertToBase64(function (img) {
                    $('#modal').find('#img64').attr('src', img);
                });
            else
                $('#upload_image_preview').remove();

            $('#modal').find('#upload_file_title').val(file.name);

            if ($('select.chosen-select').length > 0)
                $('#share_to.chosen-select').chosen({
                    width: '24rem',
                    no_results_text: "Oops, nothing found!",
                });
            instance.data.append('file', file);
            modal.show();
        });

        $('#go.btn').off('click.file_send').on('click.file_send', function () {
            instance.data.append('title', $('.modal-body').find('#upload_file_title').val());
            instance.data.append('shared', $('.modal-body').find('#share_to').val());
            instance.data.append('comment', $('.modal-body').find('#file_comment_textarea').val());

            var exc = function (response) {
                modal.destroy();
                if (response.success == "ok") {
                    if ($('#file_list_toggle_all.active').length > 0)
                        user_all_files();
                    if ($('#file_list_toggle_user.active').length > 0)
                        user_files(userFileActive);
                }
            };

            var urlapi = apiUrl + 'files/upload/' + userlogged + '/';
            request(urlapi, 'POST', 'json', instance.data, exc, null, 'file');
        });
    });

    //create snippet from chat
    $('#menu.menu').off('click.snippet_create').on('click.snippet_create', '#create-snippet', function () {
        hide_menu_files();
        var optionsType = '';

        typesL.forEach(function (item) {
            optionsType += '<option value="' + item.key + '">' + item.value + '</option>';
        });

        var data = new FormData(),
            modal = new Modal('Create Snippet', 'Create Snippet', createSnippet(optionsType, userListForModal(channels, users)));

        var editor = 'lol'//codeMirror('client_file_snippet_textarea');

        var select = $('#modal .modal-body').find('#client_file_snippet_select.chosen-select');
        if ($(select).length > 0)
            $(select).chosen({
                width: '11rem',
                no_results_text: "Oops, nothing found!",
            });
        select = $('#modal .modal-body').find('#client_chared_select.chosen-select');
        if ($(select).length > 0)
            $(select).chosen({
                width: '11rem',
                no_results_text: "Oops, nothing found!",
            });

        modal.show();

        $('#go.btn').off('click.snippet_send').on('click.snippet_send', function () {
            data.append('title', $('#modal .modal-body').find('#client_file_snippet_title_input').val());
            data.append('type', $('#modal .modal-body').find('#client_file_snippet_select').val());
            data.append('comment', $('#modal .modal-body').find('#file_comment_textarea').val());
            data.append('shared', $('#modal .modal-body').find('#share_cb').is(':checked') ? $('#modal .modal-body').find('#client_chared_select').val() : '');
            data.append('code', editor/*editor.getValue()*/);

            var exc = function (response) {
                modal.destroy();
                if (response.success == "ok") {
                    if ($('#file_list_toggle_all.active').length > 0)
                        user_all_files();
                    if ($('#file_list_toggle_user.active').length > 0)
                        user_files(userFileActive);
                }
            };

            var urlapi = apiUrl + 'snippet/create/';
            request(urlapi, 'POST', 'json', data, exc, null, 'file');
        });
    });

    //show menu in details files
    $('#monkey_scroll_wrapper_for_file_preview_scroller').on('click.file_action', 'li[data-action="more"]', function (e) {
        var options = {
            copyLink: $(this).attr('data-url'),
            share: 'edit',
            delete: $(this).attr('data-slug')
        };
        var menu = $('#menu.menu').css('max-height', '32%');
        positionMenu(this, file_options_file_detail($('#hiddenMenuFileDetails').prop('innerHTML'), options), 'left');
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
        $('#menu.menu').addClass('hidden');
    };

    var user_all_files = function () {
        clean_user_files();
        $('.panel.active').removeClass('active');
        $('#files_tab').addClass('active');
        $('#file_list_toggle_all').addClass('active');

        var urlapi = apiUrl + 'files/' + userlogged + '/all_files/' + companyuser + '/';
        request(urlapi, 'GET', null, null, user_files_exc, null);
        $('#menu.menu').addClass('hidden');
    };

    var user_files_exc = function (response) {
        var list = $('#file_list_by_user').html('');
        response.forEach(function (item) {
            var author = item.author.user.first_name + ' ' + item.author.user.last_name;
            var date = moment(item.uploaded, moment.ISO - 8601).format("MMM Do \\at h:mm a");
            var pathProfile = getUserPath(item.author.user.username);
            list.append(item_file(item.slug, author, date, item.title, item.count_comment, pathProfile, item));
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
            var item = $('#monkey_scroll_wrapper_for_file_preview_scroller').html('');
            item.append(item_file_detail(response));
            var comments = function (response) {
                var comm = file_comments_msg(response);
                $('#monkey_scroll_wrapper_for_file_preview_scroller').find('.comments').html(comm);
            };
            //codeMirrorReadOnly('csharp', response.code);
            var urlapi = apiUrl + 'files/comment/' + key;
            request(urlapi, 'GET', null, null, comments, null);
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
            if (response.success == 'ok') {
                $('#file_preview_container').addClass('hidden');
                $('#file_list_container').removeClass('hidden');
                if (userFileStatus)
                    user_files(userFileActive);
                else
                    user_all_files();
            }
        };

        var urlapi = apiUrl + 'files/delete/' + key + '/';
        request(urlapi, 'DELETE', null, null, exc, null);
    };

    var codeMirrorReadOnly = function (type, value) {
        var wrap_long_lines = true;

        var g_editor = CodeMirror.fromTextArea(document.getElementById("read-only-code"), {
            lineNumbers: true,
            matchBrackets: true,
            indentUnit: 4,
            indentWithTabs: true,
            enterMode: "keep",
            tabMode: "shift",
            viewportMargin: 10,
            mode: type,
            readOnly: true
        });

        // setup wrap checkbox
        $('#file_create_wrap_cb').bind('change', function (e) {
            var wrap = $(this).is(":checked");
            g_editor.setOption('lineWrapping', wrap);
        });
    };

    var codeMirror = function (id) {
        var wrap_long_lines = true;
        var g_editor;
        g_editor = CodeMirror.fromTextArea($('#modal .modal-body').find('#' + id)[0], {
                lineNumbers: true,
                matchBrackets: true,
                indentUnit: 4,
                indentWithTabs: true,
                enterMode: "keep",
                tabMode: "shift",
                viewportMargin: 10,
                lineWrapping: wrap_long_lines,
            }
        );

        $('select#client_file_snippet_select').change(function (evt) {
            CodeMirror.switchSlackMode(g_editor, $(this).val());
        }).change();

        // setup wrap checkbox
        $('.modal-body').find('#file_create_wrap_cb').bind('change', function (e) {
            var wrap = $(this).is(":checked");
            g_editor.setOption('lineWrapping', wrap);
        });
        return g_editor;
    };

    var Modal = function (title, btnGo, html, data) {
        this.modal = $('#modal');
        $(this.modal).find('#modal-title').html(title);
        $(this.modal).find('.modal-body').html(html);
        $(this.modal).find('#go.btn').html(btnGo);

        var context = this;
        $(this.modal).on('click', 'button[data-dismiss="modal"]', function () {
            context.destroy();
        });

        $(this.modal).on('click', '#cancel', function () {
            context.destroy();
        });

        this.show = function () {
            $(this.modal).removeClass('hidden');
        };

        this.destroy = function () {
            $(context.modal).addClass('hidden');
            data = new FormData();
            if ($('select.chosen-select').length > 0)
                $('select.chosen-select').chosen('destroy');
        }
    };

    var userListForModal = function (listGroup, listUser) {
        var options = '<optgroup label="Channels">';
        listGroup.forEach(function (item) {
            options += '<option value="channel_' + item.slug + '"> # ' + item.name + '</option>';
        });
        options += '</optgroup>';
        options += '<optgroup label="Direct Messages">';
        listUser.forEach(function (item) {
            options += '<option value="user_' + item + '">' + item + '</option>';
        });
        options += '</optgroup>';
        return options;
    };
});