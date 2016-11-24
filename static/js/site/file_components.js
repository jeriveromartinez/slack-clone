/**
 * Created by julio on 11/11/16.
 */

var fileComponent = function (title, slug, profile, date, obj) {
    var item = '';
    if (get_icon(obj) == 'filetype_image')
        item = '<div id="' + slug + '" class="file_list_item file_item hosted has_image"><i class="' + get_icon(obj) + '" style="background-size:contain;background: url(\'' + obj.image_up + '\');"></i>';
    else
        item = '<div id="' + slug + '" class="file_list_item file_item space has_icon"><i class="' + get_icon(obj) + '"></i>';
    item += '<div class="contents"><span class="author"><a href="#/blackmambasoft.slack.com/team/vbuilvicente" class="message_sender color_9f69e7 member member_preview_link">' + profile.user.username + '</a></span><span class="time">' + date + '</span><h4 class="title overflow_ellipsis no_preview"><a href="#/blackmambasoft.slack.com/files/vbuilvicente/F2LFY3NP7/-">' + title + '</a></h4><span class="share_info"><span class="file_share_public_label hidden"><span class="file_share_shared_label hidden">Shared <span class="file_share_label"></span></span></span><span class="file_share_private_label">Private file <span class="file_share_label"></span></span></span></div></div>';
    return item;
};

var get_icon = function (obj) {
    var style = 'filetype_icon s30 ';
    if (typeof(obj.code) !== 'undefined')
        return style + 'csharp';
    else if (typeof(obj.image_up) !== 'undefined')
        return 'filetype_image';
    else if (typeof(obj.text) !== 'undefined')
        return style + 'post';
    else {
        var type = obj.title.split('.');
        return type[type.length - 1] in icon ? style + icon[type[type.length - 1]] : '';
    }

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
    'mp3': 'mp3',
};