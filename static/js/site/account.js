/**
 * Created by julio on 12/10/16.
 */
var menu = false, teams = false, userFileActive = null;

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
    $(function () {
        get_files();
    });

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

    $('div#overlay').on('click', function () {
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

    if ($('.chosen-select').length > 0)
        $('.chosen-select').chosen({
            no_results_text: "Oops, nothing found!",
        });

    $('#fromFile').bind('select change', function () {
        get_files();
    });

    $('#typeFile').bind('select change', function () {
        get_files();
    });

    $('#file_action_cog').on('click', function () {
        positionMenu(this);
    });

    $('[data-action]').on('click', function () {
        var action = $(this).attr('data-action');
        switch (action) {
            case 'share':
                break;
            case 'copy-link':
                copyToClipboard(hostUrl + $(this).attr('data-info'));
                break;
            case 'print':
                break;
        }
        $('#menu.menu').addClass('hidden');
    });

    $();

    var copyToClipboard = function (str) {
        var $temp = $("<input>");
        $("body").append($temp);
        $temp.val(str).select();
        document.execCommand("copy");
        $temp.remove();
    };

    //AUX
    var positionMenu = function (instance, positionSide, options) {
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
        //$('#menu .menu_body').html(items);
        $(menu).removeClass('hidden');
    };
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

var get_files = function () {
    var exc = function (response) {
        var list = $('#files_list');
        $(list).html('');
        $.each(response, function (key, item) {
            var date = moment(item.uploaded, moment.ISO - 8601).format("MMM Do \\at h:mm a");
            $(list).append(fileComponent(item.title, item.slug, item.author, date, item));
        });
    };
    var from = $('#fromFile option:selected').val();
    var type = $('#typeFile option:selected').val();

    var urlapi = '';
    if (from == "all")
        urlapi = apiUrl + 'files/' + userlogged + '/' + type + '/' + companyuser + '/';
    else
        urlapi = apiUrl + 'files/' + from + '/get/' + type + '/';
    request(urlapi, 'GET', null, null, exc, null);
};