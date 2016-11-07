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
    return '<li id="' + name.toLowerCase() + '"  data-name="' + name.toLowerCase() + '" class="member cursor_pointer">' +
        '<div class="hotness_icon hidden"><span class="emoji-outer emoji-sizer" style="background: url(/static/images/sheet_apple_64_indexed_256colors.png) 57.5% 65%;background-size:4100%"></span>' +
        '</div><a href="#' + name + '" class="im_name nuc">' +
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
        '<a onclick="showProfile(this)" data-user="' + username + '" class="lazy member_preview_link member_image thumb_72" ' +
        'style="background: rgb(246, 246, 246) url(' + imageUrl + ') no-repeat;background-size: contain; "></a>' +
        '<div class="member_name_and_title">';
    if (username == currentUsername)
        item += '<div class="color_4bbe2e">';
    else
        item += '<div class="color_9f69e7">';
    item += '<a onclick="showProfile(this)" data-user="' + username + '" class="bold member_preview_link member_name no_bottom_margin">'
        + name + '</a></div><div>@' + username + '<span class="presence away" title="away">' +
        '<i class="ts_icon ts_icon_presence presence_icon"></i></span></div></div></div></div>';

    return item;
};

var item_user_profile = function (object, localtime) {
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
        '<!--(<a href="#/account/settings">change</a>)--></td></tr><tr>' +
        '<td><span class="small_right_padding old_petunia_grey" title="Email">Email</span>' +
        '</td><td><a href="mailto:' + object.user.email + '" title="Email julio">' + object.user.email + '</a>   </td></tr>' +
        '</tbody></table><div class="clear_both"></div></div></div></div></div></div></div>';

    return item;
};

var item_user_menu = function (username, avatar) {
    return '<li id="' + username + '" class="member_item active"><a href="#"><span class="wrapper"><span class="lazy member_preview_link member_image thumb_24" style="background: rgb(246, 246, 246) url(\'' + avatar + '\');" aria-hidden="true"></span></span><span class="name">' + username + '</span></a></li>';
};

var date_divider = function (date) {
    var divider = '<div class="day_divider" id="day_divider_1475690976_000002"><i class="copy_only"><br>-----' +
        '</i>' +
        '<div class="day_divider_label">' + moment(date, moment.ISO - 8601).format("MMM Do") + '</div>' +
        ' <i class="copy_only"> -----</i></div>';
    return divider;
};

var ts_message = function (avatar, from, msg,date) {
    var avatar = "url('/static/images/" + avatar + "')";
    var msg = '<ts-message id="msg_1475690976_000002" class="message feature_fix_files first" data-date='+date+'>' +
        '<div class="action_hover_container"></div>' +

        '<div class="message_gutter">' +
        '<div class="message_icon">' +
        '<a href="#/blackmambasoft.slack.com/team/vbuilvicente" class=" member_preview_link member_image thumb_36" style="background-image:' + avatar + '" aria-hidden="true"></a>' +

        ' </div>' +
        '<a href="#/blackmambasoft.slack.com/archives/D2KQ7LY23/p1475690976000002" class="timestamp ts_tip ts_tip_top ts_tip_float ts_tip_hidden ts_tip_multiline ts_tip_delay_300"><i class="copy_only">[</i>2:09 PM<i class="copy_only">]</i><span class="ts_tip_tip"><span class="ts_tip_multiline_inner">Open in archives<br><span class="subtle_silver">Oct&nbsp;5th&nbsp;at&nbsp;2:09:36&nbsp;PM</span></span></span></a>' +
        '   <span class="message_star_holder">' +
        '    <button class="star ts_icon ts_icon_star_o ts_icon_inherit star_message ts_tip ts_tip_top ts_tip_float ts_tip_hidden btn_unstyle">' +
        '  <span class="ts_tip_tip">Star this message</span></button></span>' +
        ' </div>' +

        '<div class="message_content ">' +
        '<a href="#/blackmambasoft.slack.com/team/vbuilvicente" class="message_sender member member_preview_link color_9f69e7">' + from + '</a>' +
        ' <a href="#/blackmambasoft.slack.com/archives/D2KQ7LY23/p1475690976000002" class="timestamp ts_tip ts_tip_top ts_tip_float ts_tip_hidden ts_tip_multiline ts_tip_delay_300"><i class="copy_only">[</i>'+moment(date, moment.ISO - 8601).format("hh:mm a")+'<i class="copy_only">]</i><span class="ts_tip_tip"><span class="ts_tip_multiline_inner">Open in archives<br><span class="subtle_silver">Oct&nbsp;5th&nbsp;at&nbsp;2:09:36&nbsp;PM</span></span></span></a>' +

        ' <span class="message_star_holder">' +
        '  <button class="star ts_icon ts_icon_star_o ts_icon_inherit star_message ts_tip ts_tip_top ts_tip_float ts_tip_hidden btn_unstyle">' +
        '   <span class="ts_tip_tip">Star this message</span></button></span>' +
        ' <span class="message_body">' + msg + '</span>' +

        '<div class="rxn_panel "></div>' +
        '<i class="copy_only"><br></i>' +

        ' <span id="msg_1475690976_000002_label" class="message_aria_label hidden">' +

        '</span>' +

        '</div>' +

        '  </ts-message>';
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
        msg += '<div class="file_body post_body">' + file_comments_msg(fileComments) + '</div>';
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

var file_comments_msg = function (comments) {
    var fileComments = '';
    comments.forEach(function (element) {
        fileComments += '<p>' + element.comment + '</p>';
    });
    return fileComments;
};

var item_file = function (fileSlug, owner, dateCreate, title, comments, profileUrl) {
    return '<div class="file_list_item file_item space has_icon" id="' + fileSlug + '"><div class="actions"><button class="file_actions btn_icon btn_outline btn ts_icon ts_icon_ellipsis ts_tip_btn ts_tip ts_tip_top"><div class="ts_tip_tip">More actions</div></button><button class="file_star btn_icon btn btn_outline ts_tip_btn ts_tip ts_tip_top"><span class="star ts_icon ts_icon_star_o ts_icon_inherit star_file"></span><div class="star_message ts_tip_tip">Star</div><div class="unstar_message ts_tip_tip">Unstar</div></button></div><i class="filetype_icon s30 post"></i><div class="contents"><span class="author"><a href="' + profileUrl + '" class="message_sender member member_preview_link color_9f69e7">' + owner + '</a></span><span class="time">' + dateCreate + '</span><h4 class="title overflow_ellipsis ">' + title + '</h4><!--<div class="preview post_body overflow_ellipsis">COMMENTS</div>--><a href="#/blackmambasoft.slack.com/files/vbuilvicente/F2LG8KXR8/dsfdsf" class="file_preview_link file_comment_link no_wrap tiny_right_margin"><i class="ts_icon ts_icon_comment"></i>' + comments + '</a><span class="share_info"><span class="file_share_public_label hidden"><span class="file_share_shared_label hidden">Shared<span class="file_share_label">shared with you</span></span></span><span class="file_share_private_label">Comments <!--<span class="file_share_label">shared with you</span>--></span></span></div></div>';
};

var item_file_detail = function (username, picture, filename, slug, comments) {
    return '<div id="file_preview_head_section" data-file="' + slug + '" data-owner="' + username + '"><div class="file_preview_title"><div id="file_title_container"><div class="flexpane_file_title"><a href="#/blackmambasoft.slack.com/team/vbuilvicente" style="background-image: url(\'' + picture + '\')" class="member_preview_link member_image thumb_36"></a><span class="color_9f69e7"><a href="#/blackmambasoft.slack.com/team/vbuilvicente" class="message_sender member member_preview_link color_9f69e7 ">' + username + '</a></span><!--<span class="title break_word"><a href="#/blackmambasoft.slack.com/files/vbuilvicente/F2LG8KXR8/dsfdsf" class="file_new_window_link">Private post</a><span class="no_wrap"><button class="star ts_icon ts_icon_star_o ts_icon_inherit star_file ts_tip ts_tip_top ts_tip_float ts_tip_hidden btn_unstyle"><span class="ts_tip_tip">Star this file</span></button></span></span>--><ul class="file_action_list no_bullets no_bottom_margin float_right"><li class="file_action_item inline_block"><a class="ts_tip ts_tip_bottom ts_tip_rightish file_new_window_link" href="#/blackmambasoft.slack.com/files/vbuilvicente/F2LG8KXR8/dsfdsf"><span class="ts_tip_btn ts_icon ts_icon_external_link"></span><span class="ts_tip_tip">Open in new window</span></a></li></ul></div></div><div id="file_edit_title_container" class="hidden"><!--<form action="" id="file_edit_title_form" class="small_bottom_margin" method="post" onsubmit="return false;">--><p class="no_bottom_margin"><input id="file_edit_title_input" class="small" name="file_edit_title_input" type="text"></p><p class="no_bottom_margin align_right"><button type="button" class="btn btn_small btn_outline">Cancel</button><button type="submit" class="btn btn_small">Save Changes</button></p><!--</form>--></div></div><div class="file_preview_file"><div class="file_container post_container"><div class="file_header post_header"><i class="file_header_icon post_header_icon ts_icon ts_icon_file_text_post_small"></i><h4 class="file_header_title post_header_title overflow_ellipsis">' + filename + '</h4><!--<p class="file_header_meta post_header_meta">Last edited <span class="file_time_ago">8 days ago</span></p></div>--><div class="file_body post_body"><!--<p>fdsfsdfdsfdsfds</p>-->' + comments + '</div></div><div class="clear_both"></div></div><div class="file_preview_meta"><!--<form action="" id="file_comment_form" class="comment_form" method="post">--><a href="#/blackmambasoft.slack.com/team/jeriverom" class="member_preview_link"><span class="member_image thumb_36" style="background-image: url(\'IMAGE2\')"></span></a><textarea id="file_comment" class="small comment_input small_bottom_margin autogrow-short" name="comment" autocorrect="off" autocomplete="off" spellcheck="true" style="overflow: hidden; height: 38px;" wrap="virtual"></textarea><span class="mini float_left cloud_silver file_comment_tip">shift+enter to add a new line</span><button id="file_comment_submit_btn" type="submit" class="btn  btn_small float_right  ladda-button"><span class="ladda-label">Add Comment</span></button><!--</form>--></div></div>';
};

var itemLoad = '<div id="convo_loading_indicator"></div>';