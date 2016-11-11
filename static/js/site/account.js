/**
 * Created by julio on 12/10/16.
 */
var menu = false, teams = false;
var itemLoad = '<div id="convo_loading_indicator"></div>';
$('body').prepend(itemLoad);

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

$(document).ready(function () {
    $('#menu_toggle').on('click', function () {
        if (!menu) {
            $('body').removeClass('nav_close').addClass('nav_open')
            $('#site_nav').removeClass('hidden');
            menu = true;
        } else {
            $('body').removeClass('nav_open').addClass('nav_close')
            $('#site_nav').addClass('hidden');
            menu = false;
        }
    });

    $('#overlay').on('click', function () {
        if (menu) {
            $('body').removeClass('nav_open').addClass('nav_close')
            $('#site_nav').addClass('hidden');
            menu = false;
        }
    });

    $('#team_switcher').on('click', function () {
        if (!teams) {
            teams = true;
            $('#header_team_nav').addClass('open');
        } else {
            teams = false;
            $('#header_team_nav').removeClass('open');
        }

    });

    $('#page').on('click', function () {
        if (teams) {
            teams = false;
            $('#header_team_nav').removeClass('open');
        }
    });

    $('ts-icon.upload_camera_icon.ts_icon_camera').on('click', function () {
        $('input[type="file"]').click();
    });

    $('input[type="file"]').on('change', function () {
        if (this.files && this.files[0]) {
            var selectedFile = this.files[0];
            selectedFile.convertToBase64(function (base64) {
                $('span.member_preview_link.member_image.thumb_192').css('background-image', 'url(\' ' + base64 + ' \')');
            });
        }
    });

    $('.chosen-select').chosen({
        no_results_text: "Oops, nothing found!",
    });
});

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

window.isEmail = function (email) {
    var regex = /^([a-zA-Z0-9_.+-])+\@(([a-zA-Z0-9-])+\.)+([a-zA-Z0-9]{2,4})+$/;
    return regex.test(email);
};