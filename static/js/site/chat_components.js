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

var item_directory_list = function (username, name, imageUrl, currentUsername) {
    var item = '<div class="team_list_item member_item cursor_pointer active tiny_top_margin">' +
        '<div class="member_details member_item_inset ">' +
        '<a href="#/team/jeriverom" class="lazy member_preview_link member_image thumb_72"  ' +
        'style="background: rgb(246, 246, 246) url(' + imageUrl + ') no-repeat;background-size: contain; "></a>' +
        '<div class="member_name_and_title">';
    if (username == currentUsername)
        item += '<div class="color_4bbe2e">';
    else
        item += '<div class="color_9f69e7">';
    item += '<a data-user="' + username + '" onclick="showProfile(this)" class="bold member_preview_link member_name no_bottom_margin">'
        + name + '</a></div><div>@' + username + '<span class="presence away" title="away">' +
        '<i class="ts_icon ts_icon_presence presence_icon"></i></span></div></div></div></div>';

    return item;
};

var item_user_profile = function (object) {
    var item = '<div class="heading">' +
        '<a onclick="return false;" id="back_from_member_preview"><i class="ts_icon ts_icon_chevron_medium_left back_icon"></i> Team Directory</a>' +
        '<a class="close_flexpane" title="Close Flexpane" data-pannel="member_preview_container"><i class="ts_icon ts_icon_times"></i></a></div>' +
        '<div id="monkey_scroll_wrapper_for_member_preview_scroller" class="monkey_scroll_wrapper ">' +
        '<div class="monkey_scroll_bar  hidden"><div class="monkey_scroll_handle " style="left: -3px;">' +
        '<div class="monkey_scroll_handle_inner "></div></div></div>' +
        '<div class="monkey_scroll_hider">' +
        '<div id="monkey_scroll_wrapper_for_member_preview_scroller" class="monkey_scroll_wrapper ">' +
        '<div class="monkey_scroll_bar  hidden"><div class="monkey_scroll_handle " style="left: -3px;">' +
        '<div class="monkey_scroll_handle_inner "></div></div></div>' +
        '<div class="monkey_scroll_hider">' +
        '<div id="member_preview_scroller" class="flex_content_scroller monkey_scroller">' +
        '<div class="member_details clearfix display_flex flex_direction_column align_items_center cropped_preview">' +
        '<span class=" member_preview_link member_image thumb_512" style="background-image:  url(' + object.image + '),  url(/static/images/ava_0022-48.png)"></span>' +
        '<div class="member_name_and_presence lato">' +
        '<a class="member_name">' + object.user.first_name + ' ' + object.user.last_name + '</a>' +
        '<span class="presence away" title="away">' +
        '<i class="ts_icon ts_icon_presence presence_icon"></i></span></div>';

    if (object.user.username == userlogged) {
        item += '<div class="member_action_bar"><a href="/account/profile/edit/" class="btn btn_outline">Edit' +
            'Profile</a><a href="/account/settings/" class="btn btn_outline">AccountSettings</a>' +
            '<a class="member_preview_menu_target btn btn_outline"><i class="ts_icon ts_icon_chevron_large_down"></i></a>' +
            '</div>';
    }

    item += '<hr class="member_details_divider">' +
        '<table class="member_data_table lato"><tbody><tr>' +
        '<td><span class="small_right_padding old_petunia_grey" title="Username">Username</span>' +
        '</td><td><span title="@' + object.user.username + '">@' + object.user.username + '</span></td></tr>' +
        '<tr><td><span class="small_right_padding old_petunia_grey" title="Timezone">Timezone</span></td>' +
        '<td class="member_preview_timezone"><span class="timezone_label"><span class="timezone_value">' + localtime + '</span> local time</span>' +
        '(<a href="#/account/settings">change</a>)</td></tr><tr>' +
        '<td><span class="small_right_padding old_petunia_grey" title="Email">Email</span>' +
        '</td><td><a href="mailto:' + object.user.email + '" title="Email julio">' + object.user.email + '</a>   </td></tr>' +
        '</tbody></table><div class="clear_both"></div></div></div></div></div></div></div>';

    return item;
};