/**
 * Created by julio on 31/10/16.
 */

File.prototype.convertToBase64 = function (callback) {
    var reader = new FileReader();
    reader.onload = function (e) {
        callback(e.target.result)
    };
    reader.onerror = function () {
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

Array.prototype.subString = function (parameter) {
    var dev = [];
    this.forEach(function (item) {
        if (item.indexOf(parameter) !== -1) dev.push(item);
    });

    return dev;
};

var isCompany = true, collapsed = true, searchResult = null;

$(document).ready(function () {
    //menu more items options
    $('#menu').on('click.menu_items', 'li[role="menuitem"]', function () {
        switch (this.id) {
            case 'list_team':
                team_users(); //get list of users from team
                break;
            case 'files_all':
                user_all_files(); //get all company's files
                isCompany = true;
                break;
            case 'files_user':
                user_files(userFileActive); //get all user's files
                isCompany = false;
                break;
        }
        showPannelLeft();
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
            delete: $(this).attr('data-file')
        };

        optionsFiles(this, options);
        event.stopPropagation();
    });

    //go from details to user select files
    $('#back_from_file_preview').on('click', function () {
        $('#file_preview_container').addClass('hidden');
        $('#file_list_container').removeClass('hidden');
        if (!isCompany)
            user_files(userFileActive);
        else
            user_all_files();
    });

    //get all files from company
    $('#file_list_toggle_all').on('click', function () {
        user_all_files();
        isCompany = true;
    });

    //list documents by user select in All Files Type
    $('#file_list_toggle_user').on('click', function () {
        var instance = this;
        if ($('#file_list_toggle_user').hasClass('active')) {
            if (!userFileStatus) {
                var elements = '<ul id="menu_items" role="menu">';
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
        userFileStatus = isCompany = false;
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
                    date = moment(new Date(), moment.ISO - 8601).format("MMM Do \\at h:mm a"),
                    userImage = (userImage != "") ? userImage : '/static/images/ava_0022-48.png';
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
    $('#menu.menu').on('click.upload_file', '#create-file', function () {
        hide_menu_files();
        var instance = this;
        this.options = userListForModal(channels, users),
            this.data = new FormData();

        var modal = new Modal('Upload a file?', 'Upload', uploadComponent(this.options), this.data);

        $('#file-upload').click();

        $('#file-upload').off('change.file').on('change.file', function () {
            var file = this.files[0];

            if (file.type.indexOf('image') !== -1)
                file.convertToBase64(function (img) {
                    $('#modal').find('#img64').attr('src', img);
                });
            else
                $('#upload_image_preview').remove();

            $('#modal').find('#upload_file_title').val(file.name);

            instance.data.append('file', file);
            modal.show();
        });

        $('#go.btn').unbind('click.file_send').unbind('click.snippet_send').on('click.file_send', function (e) {
            e.preventDefault();
            instance.data.append('title', $('.modal-body').find('#upload_file_title').val());
            instance.data.append('shared', $('.modal-body').find('#shared_to').val());
            instance.data.append('comment', $('.modal-body').find('#file_comment_textarea').val());
            instance.data.set('isShared', $('.modal-body').find('#share_cb')[0].checked);

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
            e.stopPropagation();
        });
    });

    //create snippet from chat
    $('#menu.menu').on('click.snippet_create', '#create-snippet', function () {
        hide_menu_files();
        var optionsType = '';

        typesL.forEach(function (item) {
            optionsType += '<option value="' + item.key + '">' + item.value + '</option>';
        });

        var data = new FormData(),
            modal = new Modal('Create Snippet', 'Create Snippet', createSnippet(optionsType, userListForModal(channels, users)), data);

        var editor = codeMirror('client_file_snippet_textarea');

        var select = $('#modal .modal-body').find('#client_file_snippet_select.chosen-select');
        if ($(select).length > 0)
            $(select).chosen({
                width: '11rem',
                no_results_text: "Oops, nothing found!",
            });

        modal.show();

        $('#go.btn').unbind('click.file_send').unbind('click.snippet_send').on('click.snippet_send', function (e) {
            e.preventDefault();
            data.append('title', $('#modal .modal-body').find('#client_file_snippet_title_input').val());
            data.append('type', $('#modal .modal-body').find('#client_file_snippet_select').val());
            data.append('comment', $('#modal .modal-body').find('#file_comment_textarea').val());
            data.append('shared', $('#modal .modal-body').find('#share_cb').is(':checked') ? $('#modal .modal-body').find('#shared_to').val() : '');
            data.append('code', editor.getValue());

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
            e.stopPropagation();
        });
    });

    //show menu in details files
    $('#monkey_scroll_wrapper_for_file_preview_scroller').on('click.file_action', 'li[data-action="more"]', function () {
        var options = {
            copyLink: $(this).attr('data-url'),
            share: $(this).attr('data-slug'),
            delete: $(this).attr('data-slug')
        };
        positionMenu(this, file_options_file_detail($('#hiddenMenuFileDetails').prop('innerHTML'), options), 'left', {height: '13%'});
        if (userlogged != $(this).attr('data-owner'))
            $($('#menu.menu').find('#element_delete')[0]).hide();
    });

    $('div[data-collapse]').on('click.collapse', function () {
        if (collapsed) {
            collapseFiles(sendTo.type, sendTo.to);
            $(this).parent().addClass('expanded');
            collapsed = false;
        } else {
            $(this).parent().removeClass('expanded');
            collapsed = true;
        }
    });

    $('#details_tab').on('click.menufiledetail', '.file_actions', function () {
        var options = {
            copyLink: $(this).attr('data-file-url'),
            opeNeWind: $(this).attr('data-file-url'),
            comment: $(this).attr('data-file'),
            edit: $(this).attr('data-file'),
            delete: $(this).attr('data-file')
        };

        optionsFiles(this, options);
        event.stopPropagation();
    });

    $('#autocomplete_menu').on('click.autocomplete', 'li[data-replacement]', function (e) {
        var action = $(this).attr('data-replacement');
        $('input#search_terms').val(splitSearch(action));
        searchOptions(action);
        e.stopPropagation();
    });

    //complete string search
    $('.autocomplete_menu_scrollable').on('click.search_action', 'li[data-search-action]', function (e) {
        $('input#search_terms').val(splitSearch($('input#search_terms').val()) + $(this).attr('data-search-action'));
        blockSearch();

        //push the data
        //console.log($('input#search_terms').val());
        sendSearch($('input#search_terms').val());
    });

    $('body').on('pick.datepicker', function (e) {
        var search = $('input#search_terms');
        $(search).val(splitSearch($(search).val()) + moment(e.date, moment.ISO - 8601).format("YYYY-M-D"));
        $('[data-toggle="datepicker"]').datepicker("hide");
        blockSearch();

        //push the data
        //console.log($('input#search_terms').val());
        sendSearch($('input#search_terms').val());
    });

    $('#search_clear').on('click.clear_search', function (e) {
        $('input#search_terms').val('');
        $('.autocomplete_menu_scrollable').html(optionsSearch());
        $('form[role="search"]').removeClass('active');
        $('#search_autocomplete_popover').addClass('hidden');
        $('#client-ui').removeClass('search_focused');
    });

    //search option
    $('input#search_terms').on('focus', function (e) {
        var search = $('input#search_terms').val().split(':');
        if (search.length == 1)
            $('.autocomplete_menu_scrollable').html(optionsSearch());
        else
            searchOptions(search[0] + ':');

        var search = $('#search_autocomplete_popover');
        $(search).removeClass('hidden');
        $(search).trigger('focus');
        $('#client-ui').addClass('search_focused');
        e.stopPropagation();
    }).on('keyup.verify', function (e) {
        var items = $(this).val().split(':');
        if (items[0] == '' || items.length == 1) {
            $('[data-toggle="datepicker"]').datepicker("hide");
            $('.autocomplete_menu_scrollable').html(optionsSearch());
        } else if (items.length > 1) {
            searchOptions(items[0] + ':');
            if (items[0] == 'from') {
                items[1] = items[1].replace('@', '');
                $('.autocomplete_menu_scrollable').html(searchList(users.subString(items[1])));
            }
        }
    });

    //search option close
    $('#search_autocomplete_popover').focusout(function () {
        $('#search_autocomplete_popover').addClass('hidden');
        $('#client-ui').removeClass('search_focused');
    });

    //execute the search
    $('form#header_search_form').on('submit.search', function (e) {
        e.preventDefault();
        blockSearch();
        //push the data
        sendSearch($('input#search_terms').val());
    });

    $('#search_list_msg').on('click.search_msg', function (e) {
        $('#search_list_files').removeClass('active');
        $(this).addClass('active');
        var image = (searchResult.image != null) ? searchResult.image : '/static/images/ava_0022-48.png';
        addMsgResult(searchResult.msg, image);
        addUserResult(searchResult.user);
    });

    $('#search_list_files').on('click.search_msg', function (e) {
        $('#search_list_msg').removeClass('active');
        $(this).addClass('active');
        addFileResult(searchResult.file);
        addUserResult(searchResult.user);
    });

    $('textarea#message-input').on('keyup', function (e) {
        var caret = window.getCaretPosition($(this)[0]);
        var result = /\S+$/.exec($(this).val().slice(0, $(this).val().indexOf(' ', caret.end)));
        var lastWord = result ? result[0] : null;
        var open = /[@][a-z0-9_]/.test(lastWord);
        var pos = $(this).textareaHelper('caretPos');
        var closed = $(this).val().slice(caret.end - 1, caret.end) == ' ';

        if (open) {
            var item = lastWord.replace('@', '');
            var menuBody = searchList(users.subString(item));
            var OMenu = {style: 'menu flex_menu', height: '32%', bottom: true, left: pos.left};
            positionMenu(this, menuBody, 'right', OMenu);
        }
        if (closed || e.which == 13) {
            $('#menu.menu').addClass('hidden');
        }
    });

    $('#menu').on('click.complete_chat', 'li[data-search-action]', function (e) {
        var input = $('textarea#message-input'),
            text = $(input).val();
        var caret = window.getCaretPosition($(input)[0]);
        var index = /\S+$/.exec(text.slice(0, text.indexOf(' ', caret.end)));
        var word = text.slice(index.index, caret.end);
        var text = text.replace(word, $(this).attr('data-search-action'));
        $(input).val(text);
        $('#menu.menu').addClass('hidden');
        $('textarea#message-input').trigger('focus');
    });

    /* $('#recent_mentions_toggle').on('click.show_mentions', function (e) {
     clean_user_files();
     showPannelLeft();
     $('.panel.active').removeClass('active');
     $('#mentions_tab').addClass('active');


     });*/

    //AUX
    var user_files = function (username) {
        clean_user_files();
        $('.panel.active').removeClass('active');
        $('#files_tab').addClass('active');
        $('#file_list_toggle_user').addClass('active');
        getUserFiles(username, user_files_exc);
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

    var userFileDetails = function (to) {
        var exc = function (response) {
            response.forEach(function (item) {
                var author = item.author.user.first_name + ' ' + item.author.user.last_name,
                    date = moment(item.uploaded, moment.ISO - 8601).format("MMM Do \\at h:mm a"),
                    userUrl = '/account/profile/' + item.author.user.username + '/';
                $(list).append(item_file(item.slug, author, date, item.title, item.count_comment, userUrl, item));
            });
        };
        var list = $('div.section_content.bottom_margin')[0];
        list.innerHTML = '';
        var url = 'files/detail-conection/' + to + '/';
        getUserFiles(to, exc, url);
    };

    var clean_user_files = function () {
        $('#file_list_toggle_all').removeClass('active');
        $('#file_list_toggle_user').removeClass('active');
    };

    var showPannelLeft = function () {
        $('#client-ui').addClass('flex_pane_showing');
        //change_chat_size('65%');
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
            case 'share':
                share(properties.data)
                break;
        }
    };

    var detail_file = function (key) {
        var exc = function (response) {
            $('.panel.active').removeClass('active');
            $('#files_tab').addClass('active');
            $('#file_list_toggle_user').addClass('active');

            $('#file_preview_container').removeClass('hidden');
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

        $('#modal').off('click.shared_option').on('click.shared_option', '#share_cb', function () {
            data.set('isShared', this.checked);
            if (this.checked)
                $("#client_chared_select").attr('disabled', false).trigger("liszt:updated");
            else
                $("#client_chared_select").attr('disabled', false).trigger("liszt:updated");
        });

        this.select = $('#modal .modal-body').find('#shared_to.chosen-select');
        if ($(this.select).length > 0)
            $(this.select).chosen({width: '24em', no_results_text: "Oops, nothing found!"});

        this.destroy = function () {
            $(context.modal).addClass('hidden');
            data = new FormData();
            if ($(this.select).length > 0)
                $(this.select).chosen('destroy');
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
            if (item != userlogged)
                options += '<option value="user_' + item + '">' + item + '</option>';
        });
        options += '</optgroup>';
        return options;
    };

    var share = function (slug) {
        var exc = function (response) {
            var userUrl = '/account/profile/' + userlogged + '/',
                date = moment(response.uploaded, moment.ISO - 8601).format("MMM Do \\at h:mm a");

            modal = new Modal('Share file', 'Share', sharedFile(response, date, userUrl), instance.data);
            modal.show();
        };

        var modal = null;
        hide_menu_files();
        var instance = this;
        this.options = userListForModal(channels, users),
            this.data = new FormData();

        var urlapi = apiUrl + 'files/detail/' + slug + '/';
        request(urlapi, 'GET', 'json', null, exc, null, null);

        $('#go.btn').unbind('click.share_send').unbind('click.file_send').unbind('click.snippet_send').on('click.share_send', function (e) {
            e.preventDefault();
            instance.data.append('shared', $('.modal-body').find('#shared_to').val());
            instance.data.append('comment', $('.modal-body').find('#file_comment_textarea').val());

            var exc = function (response) {
                if (response.success == "ok") {
                    modal.destroy();
                }
            };

            var urlapi = apiUrl + 'files/share/' + $($('.modal-body [data-file-id]')).attr('id') + '/';
            request(urlapi, 'POST', 'json', instance.data, exc, null, 'file');
            e.stopPropagation();
        });
    };

    var highlightCode = function (codeString, type) {
        var code = CodeMirror();
        CodeMirror.switchSlackMode(code, type);
        setTimeout(
            function () {
                CodeMirror.runMode(codeString, CodeMirror.type_map[type][0], document.getElementById('code_snippet_view'));
            }, 250);
    };

    var collapseFiles = function (type, to) {
        if (type == "user")
            userFileDetails(to);
        else
            user_all_files();
    };

    var getUserFiles = function (username, to_exc, url) {
        userFileActive = username = (username) ? username : userlogged;
        var urlapi = (url != undefined) ? apiUrl + url : apiUrl + 'files/' + username + '/get/all_files/';
        request(urlapi, 'GET', null, null, to_exc, null);
    };

    var optionsFiles = function (instance, options) {
        var optionMenu = {height: '15rem'};
        //console.log(file_options_file($('#hiddenMenuFile').prop('innerHTML'), options));
        positionMenu(instance, file_options_file($('#hiddenMenuFile').prop('innerHTML'), options), 'left', optionMenu);
        if (userlogged != $(instance).attr('data-owner'))
            $($('#menu.menu').find('#element_delete')[0]).hide();
    };

    var blockSearch = function () {
        $('#search_autocomplete_popover').addClass('hidden');
        $('#client-ui').removeClass('search_focused');
    };

    var splitSearch = function (str) {
        var dev = str.split(':');
        if (dev.length > 1)
            return dev[0] + ':';
        return;
    };

    var searchOptionsDate = function (complete) {
        var offset = $('input#search_terms').offset(),
            picker = $('[data-toggle="datepicker"]');

        $(picker).datepicker({
            endDate: new Date()
        });
        $(picker).datepicker("show");
        $(complete).html('');
        $('.datepicker-container.datepicker-dropdown.datepicker-top-left').css({
            'left': offset.left + 'px',
            'top': (offset.top + 40) + 'px'
        });
    };

    var searchOptions = function (action) {
        var complete = $('.autocomplete_menu_scrollable');
        switch (action) {
            case 'from:':
                $(complete).html(searchList(users));
                break;
            case 'in:':
                break;
            case 'has:':
                break;
            case 'after:':
                searchOptionsDate(complete);
                break;
            case 'before:':
                searchOptionsDate(complete);
                break;
            case 'on:':
                break;
        }
        $('form[role="search"]').addClass('active');
        $('#search_autocomplete_popover').removeClass('hidden');
        //$('#client-ui').addClass('search_focused');
    };

    var sendSearch = function (data) {
        var exc = function (resp) {
            var dataUser = function (response) {
                searchResult = resp;
                var image = (response.image != null) ? response.image : '/static/images/ava_0022-48.png';
                addMsgResult(resp.msg, image);
                addUserResult(response);
                searchResult.user = response;
                searchResult.user.image = image;
            };

            var userSearch = (resp.msg.length > 0) ? resp.msg[0].user_from.user.username : userlogged,
                urlapi = apiUrl + 'profile/' + userSearch + '/';
            request(urlapi, 'GET', 'json', null, dataUser, null, null);

            clean_user_files();
            showPannelLeft();
            $('.panel.active').removeClass('active');
            $('#search_tab').addClass('active');
        };

        data = encodeURIComponent(data);
        var urlapi = apiUrl + 'search/' + data + '/';
        request(urlapi, 'GET', 'json', null, exc, null, null);
    };

    var addMsgResult = function (msg, image) {
        $('#search_results_items').html('');
        msg.forEach(function (item) {
            $('#search_results_items').append(msgSearch(item, image));
        });
    };

    var addFileResult = function (files) {
        $('#search_results_items').html('');
        files.forEach(function (item) {
            var owner = item.author.user.first_name + ' ' + item.author.user.last_name,
                dateCreate = moment(item.uploaded, moment.ISO - 8601).format("MMM Do \\at h:mm a"),
                pathProfile = getUserPath(item.author.user.username);
            $('#search_results_items').append(item_file(item.slug, owner, dateCreate, item.title, '-', pathProfile, item));
        });
    };

    var addUserResult = function (user) {
        var image = (user.image != null) ? user.image : '/static/images/ava_0022-48.png';
        $('[data-search="image"]').css('background-image', 'url(' + image + ')');
        $('[data-search="username"]').html(user.user.username);
        $('[data-search="name"]').html(user.user.first_name + ' ' + user.user.last_name);
    };
});