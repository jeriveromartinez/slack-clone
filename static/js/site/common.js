/**
 * Created by julio on 21/02/17.
 */

var itemLoad = '<div id="convo_loading_indicator"></div>';
$('body').prepend(itemLoad);

var panel = null, channels = [], activeChannel = {name: "public", type: "public"}, users = [], typesL = [],
    users_logged = 0, userFileStatus = false, isCompany = true, collapsed = true, searchResult = null,
    menu = false, teams = false, userFileActive = null, countInvited = 1;

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

var icon = {
    'xlsx': 'xlsx',
    'xls': 'xlsx',
    'doc': 'docx',
    'docx': 'docx',
    'ppt': 'pptx',
    'pptx': 'pptx',
    'pdf': 'pdf',
    'txt': 'snippet',
    'mp3': 'mp3'
};

var detailExtFile = {
    'xlsx': 'Excel Spreadsheet',
    'xls': 'Excel Spreadsheet',
    'doc': 'Word Document',
    'docx': 'Word Document',
    'ppt': 'Power Point Presentation',
    'pptx': 'Power Point Presentation',
    'pdf': 'PDF Document',
    'txt': 'Snippet Document',
    'mp3': 'Audio MP3'
};

var request = function (urlSend, typeRequest, dataType, dataSend, doneFunction, errorFunction, type) {
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

var getCookie = function (c_name) {
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

var isEmail = function (email) {
    var regex = /^([a-zA-Z0-9_.+-])+\@(([a-zA-Z0-9-])+\.)+([a-zA-Z0-9]{2,4})+$/;
    return regex.test(email);
};