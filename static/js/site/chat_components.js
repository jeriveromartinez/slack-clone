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

var ts_message = function (avatar, from, msg) {
    var msg = '<ts-message id="msg_1475690976_000002" class="message feature_fix_files first">' +
        '<div class="action_hover_container"></div>' +
        '<div class="message_gutter">' +
        '<div class="message_icon">' +
        '<a href="#/blackmambasoft.slack.com/team/vbuilvicente" class=" member_preview_link member_image thumb_36" style="background-image: url(' + avatar + ')" aria-hidden="true"></a>' +
        '</div><a href="#/blackmambasoft.slack.com/archives/D2KQ7LY23/p1475690976000002" class="timestamp ts_tip ts_tip_top ts_tip_float ts_tip_hidden ts_tip_multiline ts_tip_delay_300"><i class="copy_only">[</i>2:09 PM<i class="copy_only">]</i><span class="ts_tip_tip"><span class="ts_tip_multiline_inner">Open in archives<br><span class="subtle_silver">Oct&nbsp;5th&nbsp;at&nbsp;2:09:36&nbsp;PM</span></span></span></a>' +
        //'<span class="message_star_holder">' +
        //'<button class="star ts_icon ts_icon_star_o ts_icon_inherit star_message ts_tip ts_tip_top ts_tip_float ts_tip_hidden btn_unstyle">' +
        //'<span class="ts_tip_tip">Star this message</span></button></span>' +
        '</div><div class="message_content ">' +
        '<a href="#/blackmambasoft.slack.com/team/vbuilvicente" class="message_sender member member_preview_link color_9f69e7">' + from + '</a>' +
        '<a href="#/blackmambasoft.slack.com/archives/D2KQ7LY23/p1475690976000002" class="timestamp ts_tip ts_tip_top ts_tip_float ts_tip_hidden ts_tip_multiline ts_tip_delay_300"><i class="copy_only">[</i>2:09 PM<i class="copy_only">]</i><span class="ts_tip_tip"><span class="ts_tip_multiline_inner">Open in archives<br><span class="subtle_silver">Oct&nbsp;5th&nbsp;at&nbsp;2:09:36&nbsp;PM</span></span></span></a>' +
        '<span class="message_star_holder">' +
        '<button class="star ts_icon ts_icon_star_o ts_icon_inherit star_message ts_tip ts_tip_top ts_tip_float ts_tip_hidden btn_unstyle">' +
        //'<span class="ts_tip_tip">Star this message</span></button></span>' +
        '<span class="message_body">' + msg + '</span>' +
        '<div class="rxn_panel "></div><i class="copy_only"><br></i>' +
        '<span id="msg_1475690976_000002_label" class="message_aria_label hidden">' +
        '<strong>' + from + '</strong>.' +
        //'hola julio.' +
        //'replies' +
        //'two oh-nine PM.' +
        '</span></div></ts-message>';
    return msg;
};

var ts_message_shared_file = function (avatar, from, fileTitle, fileComments) {
    var msg = '<ts-message id="msg_1475809819_000002" class="message feature_fix_files first file_reference file_share">' +
        '<div class="message_gutter"><div class="message_icon">' +
        '<a href="#/blackmambasoft.slack.com/team/vbuilvicente" class=" member_preview_link member_image thumb_36" style="background-image: url(' + avatar + ')" aria-hidden="true"></a>' +
        '</div><a href="#/blackmambasoft.slack.com/archives/D2KQ7LY23/p1475809819000002" class="timestamp ts_tip ts_tip_top ts_tip_float ts_tip_hidden ts_tip_multiline ts_tip_delay_300"><i class="copy_only">[</i>11:10 PM<i class="copy_only">]</i><span class="ts_tip_tip"><span class="ts_tip_multiline_inner">Open in archives<br><span class="subtle_silver">Oct&nbsp;6th&nbsp;at&nbsp;11:10:19&nbsp;PM</span></span></span></a>' +
        '<span class="message_star_holder">' +
        '<button class="star ts_icon ts_icon_star_o ts_icon_inherit star_file ts_tip ts_tip_top ts_tip_float ts_tip_hidden btn_unstyle">' +
        '<span class="ts_tip_tip" data-tip-toggle-auto="Unstar this file">Star this file</span>' +
        '</button></span></div><div class="message_content ">' +
        '<a href="#/blackmambasoft.slack.com/team/vbuilvicente" class="message_sender member member_preview_link color_9f69e7">' + from + '</a>' +
        '<a href="/blackmambasoft.slack.com/archives/D2KQ7LY23/p1475809819000002" class="timestamp ts_tip ts_tip_top ts_tip_float ts_tip_hidden ts_tip_multiline ts_tip_delay_300"><i class="copy_only">[</i>11:10 PM<i class="copy_only">]</i><span class="ts_tip_tip"><span class="ts_tip_multiline_inner">Open in archives<br><span class="subtle_silver">Oct&nbsp;6th&nbsp;at&nbsp;11:10:19&nbsp;PM</span></span></span></a>' +
        '<span class="meta message_body  msg_inline_file_preview_toggler expanded">' +
        '<a href="#/blackmambasoft.slack.com/files/vbuilvicente/F2LG8KXR8/dsfdsf" target="$/blackmambasoft.slack.com/files/vbuilvicente/F2LG8KXR8/dsfdsf">' +
        'shared a post<span class="msg_inline_file_title_hider">:' +
        '<span class="file_preview_link no_jumbomoji file_force_flexpane bold msg_inline_file_preview_title">' + fileTitle + '</span>' +
        '</span><ts-icon class="msg_inline_media_toggler"></ts-icon>' +
        '</a></span><div class="file_container post_container">' +
        '<div class="file_header post_header">' +
        '<i class="file_header_icon post_header_icon ts_icon ts_icon_file_text_post"></i>' +
        '<h4 class="file_header_title post_header_title overflow_ellipsis">' + fileTitle + '</h4>' +
        '<p class="file_header_meta post_header_meta">' +
        'Last edited <span class="file_time_ago">8 days ago</span>' +
        '</p></div>';
    if (fileComments.length > 0)
        msg += '<div class="file_body post_body">' + file_comments(fileComments) + '</div>';
    msg += '<div class="preview_actions">' +
        '<a class="file_preview_action preview_show_less_header btn btn_outline btn_icon ts_icon ts_icon_collapse_vertical ts_tip ts_tip_top ts_tip_float ts_tip_delay_300" title="Collapse"></a>' +
        '<a class="file_preview_action file_new_window_link btn btn_outline btn_icon ts_icon ts_icon_external_link ts_tip ts_tip_top ts_tip_float ts_tip_delay_300 ts_tip_hidden" href="#/blackmambasoft.slack.com/files/vbuilvicente/F2LG8KXR8/dsfdsf">' +
        '<span class="ts_tip_tip">Open in new window</span></a>' +
        '<a class="file_preview_action file_actions btn btn_outline btn_icon ts_icon ts_icon_ellipsis ts_tip ts_tip_top ts_tip_float ts_tip_delay_300" title="More actions"></a>' +
        '<a href="#/blackmambasoft.slack.com/files/vbuilvicente/F2LG8KXR8/dsfdsf" class="file_preview_action btn btn_outline file_preview_link file_comment_link file_force_flexpane">' +
        '<span>Add Comment</span></a></div>' +
        '<div class="preview_show preview_show_more">' +
        '<div class="preview_show_center">' +
        '<button class="preview_show_btn">' +
        '<i class="ts_icon ts_icon_plus_small"></i>' +
        'Click to expand inline</button></div></div>' +
        '<div class="preview_show preview_show_less">' +
        '<button class="preview_show_btn">Collapse<i class="ts_icon ts_icon_arrow_up_medium"></i></button>' +
        '</div></div></div></ts-message>';
    return msg;
};

var file_comments = function (comments) {
    var fileComments = '';
    comments.forEach(function (element) {
        fileComments += '<p>' + element + '</p>';
    });
    return fileComments;
};