/**
 * Created by julio on 20/10/16.
 */

var item_channel_list = function (name) {
    return '<li id=' + name.toLowerCase() + ' class="channel">' +
        '<div class="hotness_icon hidden">' +
        '<span class="emoji-outer emoji-sizer" style="background: url(/static/images/sheet_apple_64_indexed_256colors.png) 57.5% 65%;background-size:4100%"></span>' +
        '</div><a href="#' + name + '"class="channel_name">' +
        '<ts-icon class="ts_icon_channel_pane_hash prefix"></ts-icon>' +
        '<span class="unread_msgs hidden">0</span>' +
        '<span class="unread_highlights hidden">0</span>' +
        '<span class="display_flex">' +
        '<span class="overflow_ellipsis">' + name + '</span>' +
        '</span></a></li>'
};

var item_user_list = function (name) {
    return '<li id="' + name.toLowerCase() + '" class="member cursor_pointer">' +
        '<div class="hotness_icon hidden"><span class="emoji-outer emoji-sizer" style="background: url(/static/images/sheet_apple_64_indexed_256colors.png) 57.5% 65%;background-size:4100%"></span>' +
        '</div><a href="#/team/jeriverom" class="im_name nuc">' +
        '<span class="unread_highlights hidden">0</span>' +
        '<span class="typing_indicator"></span>' +
        '<span class="overflow_ellipsis">' +
        '<span class="presence away " title="away">' +
        '<i class="ts_icon ts_icon_presence presence_icon"></i>' +
        '</span>' + name + '</span></a>' +
        '<button class="ts_icon ts_icon_times_circle im_close btn_unstyle" aria-label="Close Direct Message with jeriverom" data-qa="im_close"></button></li>';
};