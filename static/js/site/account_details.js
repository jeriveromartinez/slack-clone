/**
 * Created by julio on 14/11/16.
 */
var userFileActive = null,
    apiUrl = "https:" + '//' + window.location.host + '/api/',
    hostUrl = "https:" + '//' + window.location.host;

var itemLoad = '<div id="convo_loading_indicator"></div>';
$('body').prepend(itemLoad);

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

var comment = function (comment, user, date) {
    return '<div class="comment"><span class="no_print"><a href="#/team/jeriverom" target="_blank" class=" member_preview_link member_image thumb_36" aria-hidden="true" style="background-image: url(\'' + user.image + '\'),url(\'/static/images/ava_0022-48.png\');"></a></span><p class="comment_meta"><span class="no_print"><a href="#//team/jeriverom" target="_blank" class="message_sender color_4bbe2e member member_preview_link">' + user.username + '</a></span><span class="comment_date_star_cog">' + date + '<span class="no_print"></span></span></p><div class="comment_body">' + comment + '</div></div>';
};

var g_editor;

$(function () {
    var wrap_long_lines = true;

    g_editor = CodeMirror.fromTextArea(document.getElementById("id_code"), {
        matchBrackets: true,
        indentUnit: 4,
        indentWithTabs: true,
        enterMode: "keep",
        tabMode: "shift",
        viewportMargin: 10,
        lineWrapping: wrap_long_lines,
    });

    $('select#id_type').change(function (evt) {
        CodeMirror.switchSlackMode(g_editor, $(this).val());
    }).change();
});

$(document).ready(function () {
    $('#space_btn_comments_hide').on('click', function () {
        $('body.light_theme.comments_visible').removeClass('comments_visible');
    });

    $('button.space_btn_comments.comments_open').on('click', function () {

        get_comments();
        $('body.light_theme').addClass('comments_visible');
    });

    $('#file_comment_submit_btn').on('click', function () {
        var exc = function (response) {
            if (response.data == "save")
                get_comments();
        };

        var comment = $('#file_comment').val();
        $('#file_comment').val('');
        var slug = $('comments').attr('data-slug');
        var urlapi = apiUrl + 'files/detail/' + slug + '/' + userlogged + '/';
        request(urlapi, 'POST', 'json', {comment: comment}, exc);
    });

    var get_comments = function () {
        var exc = function (response) {
            $('#comments.comments').html('');
            $.each(response.files_comments, function (key, item) {
                console.log(item);
                var user = {url: "", username: item.user.username, image: item.user.user_profile.image};
                var date = moment(item.published, moment.ISO - 8601).format("MMM Do \\at h:mm a");

                $('#comments.comments').append(comment(item.comment, user, date));
            });

        };
        var slug = $('comments').attr('data-slug');
        var urlapi = apiUrl + 'files/detail/' + slug + '/';
        request(urlapi, 'GET', 'json', null, exc);
    };
});