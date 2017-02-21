/**
 * Created by julio on 20/10/16.
 */

var item_channel_list = function (data) {
    var un_reader_msg = (data.un_reader_msg > 0) ? 'active' : 'hidden';
    return '<li id=' + data.name.toLowerCase() + ' class="channel">' +
        '<div class="hotness_icon hidden">' +
        '<span class="emoji-outer emoji-sizer" style="background: url(/static/images/sheet_apple_64_indexed_256colors.png) 57.5% 65%;background-size:4100%"></span>' +
        '</div><a href="#' + data.name + '"class="channel_name">' +
        '<ts-icon class="ts_icon_channel_pane_hash prefix"></ts-icon>' +
        '<span class="unread_msgs hidden">0</span>' +
        '<span class="unread_highlights ' + un_reader_msg + '">' + data.un_reader_msg + '</span>' +
        '<span class="display_flex">' +
        '<span class="overflow_ellipsis">' + data.name + '</span>' +
        '</span></a></li>'
};

var item_user_list = function (data) {
    var un_reader_msg = (data.un_reader_msg > 0) ? 'active' : 'hidden';
    var active = (!data.active) ? 'away' : 'active';
    return '<li id="' + name.toLowerCase() + '"  data-name="' + data.user_connect.username.toLowerCase() + '" class="member cursor_pointer">' +
        '<div class="hotness_icon hidden"><span class="emoji-outer emoji-sizer" style="background: url(/static/images/sheet_apple_64_indexed_256colors.png) 57.5% 65%;background-size:4100%"></span>' +
        '</div><a href="#' + data.user_connect.username + '" class="im_name nuc">' +
        '<span class="unread_highlights ' + un_reader_msg + '">' + data.un_reader_msg + '</span>' +
        '<span class="typing_indicator"></span>' +
        '<span class="overflow_ellipsis">' +
        '<span class="presence ' + active + ' " title="' + active + '">' +
        '<i class="ts_icon ts_icon_presence presence_icon"></i>' +
        '</span>' + data.user_connect.username + '</span></a>' +
        '<button class="ts_icon ts_icon_times_circle im_close btn_unstyle" aria-label="Close Direct Message with ' + data.user_connect.username + '" data-qa="im_close" data-user="' + data.user_connect.username + '"></button></li>';
};

var item_directory_list = function (username, name, imageUrl, currentUsername) {
    imageUrl = (imageUrl == null) ? '/static/images/ava_0022-48.png' : imageUrl;
    var item = '<div class="team_list_item member_item cursor_pointer active tiny_top_margin">' +
        '<div class="member_details member_item_inset ">' +
        '<a onclick="showProfile(this)" data-user="' + username + '" class="lazy member_preview_link member_image thumb_72" ' +
        'style="background: rgb(246, 246, 246) url(' + imageUrl + ') no-repeat;background-size: contain; "></a>' +
        '<div class="member_name_and_title">';
    if (username == currentUsername)
        item += '<div class="color_4bbe2e">';
    else
        item += '<div class="color_9f69e7">';
    item += '<a data-user="' + username + '" class="bold member_preview_link member_name no_bottom_margin">'
        + name + '</a></div><div>@' + username + '<span class="presence away" title="away">' +
        '<i class="ts_icon ts_icon_presence presence_icon"></i></span></div></div></div></div>';

    return item;
};

var item_user_profile = function (object, localtime) {
    var userUrl = '/account/profile/' + object.user.username + '/',
        image = (object.image) ? object.image : '/static/images/ava_0022-48.png';
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
        '<a href="' + userUrl + '" class="member_name">' + object.user.first_name + ' ' + object.user.last_name + '</a>' +
        '<span class="presence away" title="away">' +
        '<i class="ts_icon ts_icon_presence presence_icon"></i></span></div>';

    if (object.user.username == userlogged) {
        item += '<div class="member_action_bar"><a href="/account/profile/edit/" target="_blank" class="btn btn_outline">Edit' +
            'Profile</a><a href="/account/settings/" target="_blank" class="btn btn_outline">AccountSettings</a>' +
            //'<a class="member_preview_menu_target btn btn_outline"><i class="ts_icon ts_icon_chevron_large_down"></i></a>' +
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
    return '<li id="' + username + '" class="member_item active"><a href="#"><span class="wrapper">\
        <span class="lazy member_preview_link member_image thumb_24" style="background: rgb(246, 246, 246) url(' + avatar + ');background-size: cover;" aria-hidden="true"></span></span>\
        <span class="name">' + username + '</span></a></li>';
};

var date_divider = function (date) {
    var divider = '<div class="day_divider" id="day_divider_1475690976_000002"><i class="copy_only"><br>-----' +
        '</i>' +
        '<div class="day_divider_label">' + moment(date, moment.ISO - 8601).format("MMM Do") + '</div>' +
        ' <i class="copy_only"> -----</i></div>';
    return divider;
};

var ts_message = function (avatar, from, msg, date) {
    var avatar = (avatar != null) ? "url('" + avatar + "')" : "url('/static/images/ava_0022-48.png')";
    var msg = '<ts-message id="msg_1475690976_000002" class="message feature_fix_files first" data-date=' + date + ' data-user=' + from + '>' +
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
        ' <a href="#/blackmambasoft.slack.com/archives/D2KQ7LY23/p1475690976000002" class="timestamp ts_tip ts_tip_top ts_tip_float ts_tip_hidden ts_tip_multiline ts_tip_delay_300"><i class="copy_only">[</i>' + moment(date, moment.ISO - 8601).format("hh:mm a") + '<i class="copy_only">]</i><span class="ts_tip_tip"><span class="ts_tip_multiline_inner">Open in archives<br><span class="subtle_silver">Oct&nbsp;5th&nbsp;at&nbsp;2:09:36&nbsp;PM</span></span></span></a>' +

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

var ts_message_shared_file = function (avatar, from, file, date_pub) {
    var avatar = (avatar != null) ? "url('" + avatar + "')" : "url('/static/images/ava_0022-48.png')",
        userUrl = '/account/profile/' + from + '/',
        date = moment(date_pub, moment.ISO - 8601).format("MMM Do \\at h:mm a"),
        descriptionFile = (file.extension in detailExtFile) ? detailExtFile[file.extension] : detailExtFile['txt'];
    return '<ts-message data-date= "' + date_pub + '" class="message feature_fix_files first file_reference file_share">\
	<span class="is_pinned_holder"></span><div class="message_gutter"><div class="message_icon">\
		<a href="' + userUrl + '" target="_blank" class=" member_preview_link member_image thumb_36" style="background-image: ' + avatar + ';" aria-hidden="true"></a>\
			</div><a href="' + file.url + '" target="_blank" class="timestamp ts_tip ts_tip_top ts_tip_float ts_tip_hidden ts_tip_multiline ts_tip_delay_300"></a>\
			</div><div class="message_content"><div class="message_content_header"><div class="message_content_header_left">\
						<a href="' + userUrl + '" target="_blank" class="message_sender color_4bbe2e member member_preview_link">' + from + '</a>\
						<a href="' + file.url + '" target="_blank" class="timestamp ts_tip ts_tip_top ts_tip_float ts_tip_hidden ts_tip_multiline ts_tip_delay_300">\
						<i class="copy_only">[</i>' + date + '<i class="copy_only">]</i></a>\
					</div></div><div class="file_container generic_container">\
	<a class="file_header generic_header file_ssb_download_link " href="' + file.url + '"><i class="file_header_icon generic_header_icon filetype_icon ' + icon[file.extension] + ' s48">\
				<i class="ts_icon ts_icon_arrow_down ' + file.extension + '"></i></i><h4 class="file_header_title generic_header_title overflow_ellipsis">' + file.title + '</h4>\
		<p class="file_header_meta generic_header_meta"><span class="meta_hover_placement"><span class="meta_type overflow_ellipsis">' + descriptionFile + '</span>\
			<span class="meta_hover overflow_ellipsis">Click to download</span></span></p></a><div class="preview_actions">\
                    <a class="file_preview_action file_ssb_download_link btn btn_outline btn_icon ts_icon ts_icon_cloud_download ts_tip ts_tip_top ts_tip_float ts_tip_delay_300" href="' + file.url + '" target="_blank" title="Download"></a>\
					<a class="file_preview_action btn btn_outline file_preview_link file_comment_link file_force_flexpane" data-url="' + file.slug + '" data-action="comment">\
						<span>' + file.count_comment + ' Comment</span></a></div></div><div class="rxn_panel"></div><i class="copy_only"><br></i></div></ts-message>';
};

var ts_message_shared_image = function (from, avatar, file, date_pub) {
    var avatar = (avatar != null) ? "url('" + avatar + "')" : "url('/static/images/ava_0022-48.png')",
        userUrl = '/account/profile/' + from + '/',
        date = moment(date_pub, moment.ISO - 8601).format("MMM Do \\at h:mm a");
    return '<ts-message data-date= "' + date_pub + '" class="message feature_fix_files first file_reference file_share">\
    <span class="is_pinned_holder"></span><div class="message_gutter"><div class="message_icon">\
		<a href="' + userUrl + '" target="_blank" class=" member_preview_link member_image thumb_36" style="background-image: ' + avatar + ';" aria-hidden="true"></a></div></div>\
	<div class="message_content "><div class="message_content_header"><div class="message_content_header_left">\
		<a href="#/blackmambasoft.slack.com/team/jeriverom" target="_blank" class="message_sender color_4bbe2e member member_preview_link">' + from + '</a>\
		<a href="#/blackmambasoft.slack.com/archives/announcements/p1479611806000002" target="black" class="timestamp ts_tip ts_tip_top ts_tip_float ts_tip_hidden ts_tip_multiline ts_tip_delay_300">\
		<i class="copy_only">[</i>' + date + '<i class="copy_only">]</i><span class="ts_tip_tip"></span></a></div></div>\
		<span class="meta message_body  msg_inline_file_preview_toggler expanded"><a href="' + file.url + '" target="_blank">\
			<span class="file_preview_link no_jumbomoji file_force_flexpane bold msg_inline_file_preview_title">' + file.title + '</span>\
				<ts-icon class="msg_inline_media_toggler"></ts-icon></a></span><div class="file_container image_container" style="width: 360px;">\
                <a href="' + file.url + '" target="_blank" style="width: 360px;" class="file_body image_body image_jpg file_viewer_channel_link file_viewer_link">\
		<div class="image_preserve_aspect_ratio"><figure class="image_bg" style="padding-top: calc(0.666667 * 100%); background-image: url(' + file.url + ');">\
				<img class="image_hide" src="' + file.url + '"></figure></div></a><div class="preview_actions">\
					<a class="file_preview_action file_ssb_download_link btn btn_outline btn_icon ts_icon ts_icon_cloud_download ts_tip ts_tip_top ts_tip_float ts_tip_delay_300" href="' + file.url + '" download="' + file.title + '" title="Download"></a>\
					<a class="file_preview_action btn btn_outline file_preview_link file_comment_link file_force_flexpane" data-url="' + file.slug + '" data-action="comment">\
					    <span>' + file.count_comment + ' Comment</span></a></div></div><div class="rxn_panel"></div></div></ts-message>';
};

var file_comments_msg = function (comments) {
    var fileComments = '';
    comments.forEach(function (element) {
        var userUrl = '/acount/profile/' + element.user.username + '/',
            date = moment(element.published, moment.ISO - 8601).format("MMM Do \\at h:mm a");
        fileComments += item_file_comment(element.user.username, userUrl, element.user.user_profile.image, date, element.comment);
    });
    return fileComments;
};

var item_file = function (fileSlug, owner, dateCreate, title, comments, profileUrl, obj) {
    var item = '<div class="actions"><button class="file_actions btn_icon btn_outline btn ts_icon ts_icon_ellipsis ts_tip_btn ts_tip ts_tip_top" ' +
        'data-placement="bottom" data-toggle="tooltip" data-original-title="More actions" data-file="' + fileSlug + '" ' +
        'data-owner="' + obj.author.user.username + '" data-file-url="' + urlFile(obj)[0] + '"></button></div>';
    if (get_icon(obj) == 'filetype_image') {
        item = '<div id="' + fileSlug + '" class="file_list_item file_item hosted has_image" data-url="' + fileSlug + '">' + item;
        item += '<i class="' + get_icon(obj) + '" style="background-size:contain;background: url(' + obj.image_up + ');"></i>';
    } else {
        item = '<div class="file_list_item file_item space has_icon" id="' + fileSlug + '">' + item;
        item += '<i class="' + get_icon(obj) + '"></i>';
    }
    item += '<div class="contents"><span class="author"><a href="' + profileUrl + '" class="message_sender member member_preview_link color_9f69e7">' +
        owner + '</a></span>•<span class="time">' + dateCreate + '</span><h4 class="title overflow_ellipsis ">' +
        title + '</h4><a class="file_preview_link file_comment_link no_wrap tiny_right_margin"><i class="ts_icon ts_icon_comment"></i>' +
        comments + '</a><span class="share_info"><span class="file_share_public_label hidden"><span class="file_share_shared_label hidden">Shared' +
        '<span class="file_share_label">shared with you</span></span></span><span class="file_share_private_label">Comments</span></span></div></div>';
    return item;
};

var item_file_detail = function (item) {
    var userUrl = '/account/profile/' + item.author.user.username + '/',
        file = urlFile(item),
        image = (item.author.image != undefined) ? item.author.image : '/static/images/ava_0022-48.png';
    return '<div id="file_preview_head_section" data-file="' + item.slug + '">' + file[1] +
        '<div id="file_preview_comments_section" \
         ' + file[2] + '><div class="comments"></div></div><div class="comment_form">\
    <a href="' + userUrl + '" class="member_preview_link" target="_blank">\
			<span class="member_image thumb_36" style="background-image: url(' + image + ');"></span></a>\
	<textarea id="file_comment" class="small comment_input small_bottom_margin autogrow-short" autocorrect="off" \
	autocomplete="off" spellcheck="true" style="overflow: hidden; height: 38px;" wrap="virtual;">\
</textarea><button id="file_comment_submit_btn" class="btn btn_small float_right ladda-button" ><span \
class="ladda-label">Add Comment</span></button></div>';
};

var item_code_file_detail = function (username, userUrl, picture, filename, dateCreate, code, urlFile, slug) {
    picture = (picture != null) ? picture : '/static/images/ava_0022-48.png';
    return '<div class="file_preview_title">\
	<div id="file_title_container"><div class="flexpane_file_title">\
		<a href="' + userUrl + '" target="_blank" style="background-image: url(' + picture + ');" class="member_image thumb_36 member_preview_link  "></a>\
		<span class="color_4bbe2e"><a href="' + userUrl + '" target="_blank" class="message_sender color_4bbe2e member member_preview_link">' + username + '</a></span>\
		<span class="title break_word"><a href="#/blackmambasoft.slack.com/files/jeriverom/F34T6SPPC/test.cs" class="">' + filename + '</a>\
			<span class="no_wrap"></span></span>\
		<ul class="file_action_list no_bullets no_bottom_margin float_right">\
			<li class="file_action_item inline_block" data-action="more" data-url="' + urlFile + '" data-slug="' + slug + '">\
				<a class="ts_tip ts_tip_bottom ts_tip_right file_actions ts_tip_hide">\
					<span class="ts_tip_btn ts_icon ts_icon_ellipsis_o"></span>\
					<span class="ts_tip_tip">More actions</span>\
				</a></li></ul></div></div>\
        </div><div class="file_preview_file"><div class="file_container snippet_container snippet_wrap">\
	        <div class="file_body snippet_body"><div class="CodeMirror cm-s-default CodeMirrorServer"><div id="code_snippet_view" class="CodeMirror-code">\
	        </div></div></div> \
			</div><label class="checkbox normal mini" for="snippet_wrap">\
		<input id="snippet_wrap" checked="checked" type="checkbox">wrap</label>\
	<div class="clear_both"></div></div><div class="file_preview_meta">\
	<p class="file_meta snippet"><span class="date">' + dateCreate + '</span>\
		</span></p><div class="rxn_panel"></div></div></div>';
};

var item_image_file_detail = function (title, slug, username, userurl, userimage, image, date) {
    return '<div class="file_preview_title"><div id="file_title_container"><div class="flexpane_file_title">\
		<a href="' + userurl + '" target="_blank" style="background-image: url(' + userimage + '), url(/static/images/ava_0022-48.png);" class="member_image thumb_36 member_preview_link"></a>\
		<span class="color_4bbe2e"><a href="' + userurl + '" target="_blank" class="message_sender color_4bbe2e member member_preview_link">' + username + '</a></span>\
		<span class="title break_word">\
				<a href="' + image + '" target="_blank" class="file_viewer_channel_link file_viewer_link">' + title + '</a>\
			<span class="no_wrap">\
			</span></span>\
		<ul class="file_action_list no_bullets no_bottom_margin float_right"><li class="file_action_item inline_block">\
					<a class="ts_tip ts_tip_bottom file_ssb_download_link" href="' + image + '" download="' + title + '">\
						<span class="ts_tip_btn ts_icon ts_icon_cloud_download"></span><span class="ts_tip_tip">Download</span>\
					</a></li><li class="file_action_item inline_block">\
							<a class="ts_tip ts_tip_bottom ts_tip_rightish" href="' + image + '" target="_blank">\
								<span class="ts_tip_btn ts_icon ts_icon_external_link"></span>\
								<span class="ts_tip_tip">Open original</span></a></li>\
			<li class="file_action_item inline_block" data-action="more" data-url="' + image + '" data-slug="' + slug + '">\
				<a class="ts_tip ts_tip_bottom ts_tip_right file_actions">\
					<span class="ts_tip_btn ts_icon ts_icon_ellipsis_o"></span>\
					<span class="ts_tip_tip">More actions</span></a></li></ul></div></div>\
	<div id="file_edit_title_container" class="hidden">\
		<div id="file_edit_title_form" class="small_bottom_margin">\
			<p class="no_bottom_margin"><input id="file_edit_title_input" class="small" name="file_edit_title_input" value="" type="text"></p>\
			<p class="no_bottom_margin align_right">\
				<button type="button" class="btn btn_small btn_outline">Cancel</button>\
				<button type="submit" class="btn btn_small">Save Changes</button></p></div></div></div><div class="file_preview_file">\
		<div class="file_container image_container">\
	<a href="#/files.slack.com/files-pri/T2KQ0HR61-F347ANL9X/" target="_blank" class="file_body image_body image_jpg\
			file_viewer_channel_link file_viewer_link" title="ctrl+click to open original in new tab">\
		<div class="image_preserve_aspect_ratio">\
			<figure class="image_bg" style="background-image: url(' + image + '); padding-top: calc(0.663889 * 100%);">\
				</figure></div></a></div>\
	<div class="clear_both"></div></div><div class="file_preview_meta"><p class="file_meta hosted">\
		<span class="date">' + date + '</span><span class="bullet">•</span>\
			<a href="' + image + '" target="_blank" title="Download this file" class="subtle_silver file_ssb_download_link">437KB <span>JPEG</span></a>\
			<span class="bullet">•</span>\
			</span>\
		<span class="file_share_private_label inline_block hidden">\
			<i class="ts_icon ts_icon_eye ts_icon_inherit"></i>\
		</span></p><div class="rxn_panel"></div></div>';
};

var item_file_file_detail = function (item, userUrl, date) {
    return '<div class="file_preview_title"><div id="file_title_container"><div class="flexpane_file_title">\
		<a href="' + userUrl + '" target="_blank" style="background-image: url(' + item.author.image + '), url(/static/images/ava_0022-48.png)" class="member_image thumb_36 member_preview_link"></a>\
		<span class="color_4bbe2e"><a href="' + userUrl + '" target="_blank" class="message_sender color_4bbe2e member member_preview_link" >'
        + item.author.user.username + '</a></span>\
		<span class="title break_word">\
				<a href="' + item.file_up + '" target="_blank">' + item.title + '</a>\
			<span class="no_wrap"></span></span>\
		<ul class="file_action_list no_bullets no_bottom_margin float_right">\
				<li class="file_action_item inline_block">\
					<a class="ts_tip ts_tip_bottom file_ssb_download_link" href="' + item.file_up + '" download="' + item.title + '">\
						<span class="ts_tip_btn ts_icon ts_icon_cloud_download"></span><span class="ts_tip_tip">Download</span></a></li>\
				<li class="file_action_item inline_block">\
							<a class="ts_tip ts_tip_bottom ts_tip_rightish file_new_window_link" href="' + item.file_up + '" target="_blank">\
								<span class="ts_tip_btn ts_icon ts_icon_external_link"></span>\
								<span class="ts_tip_tip">Open in new window</span></a></li>\
			<li class="file_action_item inline_block" data-action="more" data-url="' + item.file_up + '" data-slug="' + item.slug + '">\
			<a class="ts_tip ts_tip_bottom ts_tip_right file_actions">\
					<span class="ts_tip_btn ts_icon ts_icon_ellipsis_o"></span>\
					<span class="ts_tip_tip">More actions</span></a></li></ul></div></div>\
	<div id="file_edit_title_container" class="hidden">\
		<div action="" id="file_edit_title_form" class="small_bottom_margin">\
			<p class="no_bottom_margin"><input type="text" id="file_edit_title_input" class="small" name="file_edit_title_input"></p>\
			<p class="no_bottom_margin align_right">\
				<button type="button" class="btn btn_small btn_outline">Cancel</button>\
				<button type="submit" class="btn btn_small">Save Changes</button></p></div></div>\
</div><div class="file_preview_file"><div class="file_container generic_container">\
	<a class="file_header generic_header file_ssb_download_link " href="' + item.file_up + '" download="' + item.title + '">\
		<i class="' + get_icon_details(item) + '">\
				<i class="ts_icon ts_icon_arrow_down binary"></i></i>\
		<h4 class="file_header_title generic_header_title overflow_ellipsis">' + item.title + '</h4>\
		<p class="file_header_meta generic_header_meta">\
				<span class="meta_size">' + (Number(item.size) / 1048576).toFixed(2) + 'MB</span><span class="meta_hover_placement">\
				<span class="meta_type overflow_ellipsis">' + item.extension + '</span><span class="meta_hover overflow_ellipsis">\
						Click to download</span></span></p></a></div><div class="clear_both"></div></div>\
<div class="file_preview_meta"><p class="file_meta hosted"><span class="date">' + date + '</span>\
		<span class="bullet">•</span><a href="' + item.file_up + '" target="_blank" title="Download this file" class="subtle_silver file_ssb_download_link"><!--16MB--> <span><!--Binary--></span></a>\
			<span class="bullet">•</span><span class="file_share_public_label inline_block">\
			<span class="file_share_unshared_label hidden">Team file</span></span>\
	</p><div class="rxn_panel"></div></div></div>';
};

var item_post_file_detail = function () {
    return '<div class="file_preview_title"><div id="file_title_container"><div class="flexpane_file_title">\
		<a href="/team/jeriverom" target="_blank" style="background-image: url(), url(/static/images/ava_0022-48.png)" class="member_image thumb_36 member_preview_link"></a>\
		<span class="color_4bbe2e"><a href="/team/jeriverom" target="_blank" class="message_sender color_4bbe2e member member_preview_link">jeriverom</a></span>\
		<span class="title break_word"><a href="#/blackmambasoft.slack.com/files/jeriverom/F352EDYQJ/-" target="_blank" class="file_new_window_link">Draft post</a>\
			<span class="no_wrap"></span></span>\
		<ul class="file_action_list no_bullets no_bottom_margin float_right">\
				<li class="file_action_item inline_block">\
					<a class="ts_tip ts_tip_bottom file file_new_window_link ts_tip_rightish" href="#/blackmambasoft.slack.com/files/jeriverom/F352EDYQJ/-" target="_blank">\
						<span class="ts_tip_btn ts_icon ts_icon_external_link"></span>\
						<span class="ts_tip_tip">Edit in new window</span></a></li>\
			<li class="file_action_item inline_block" data-action="more">\
				<a class="ts_tip ts_tip_bottom ts_tip_right file_actions">\
					<span class="ts_tip_btn ts_icon ts_icon_ellipsis_o"></span>\
					<span class="ts_tip_tip">More actions</span></a></li></ul></div></div>\
	<div id="file_edit_title_container" class="hidden">\
		<div class="small_bottom_margin">\
			<p class="no_bottom_margin"><input type="text" id="file_edit_title_input" class="small" name="file_edit_title_input"></p>\
			<p class="no_bottom_margin align_right">\
				<button type="button" class="btn btn_small btn_outline">Cancel</button>\
				<button type="submit" class="btn btn_small">Save Changes</button></p></div></div>\
</div><div class="file_preview_file"><div class="file_container post_container\
	<div class="file_header post_header">\
		<i class="file_header_icon post_header_icon ts_icon ts_icon_file_text_post_small"></i>\
		<h4 class="file_header_title post_header_title overflow_ellipsis">Untitled</h4>\
		<p class="file_header_meta post_header_meta">\
				Last edited <span class="file_time_ago">6 days ago</span></p></div>\
	<div class="file_body post_body"><p>jkhjkhjkhjkhjkdfgdfg</p></div></div><div class="clear_both"></div>\
</div><div class="file_preview_meta"><p class="file_meta space"><span class="date">Nov 20th at 10:06 PM</span>\
		<span class="file_share_private_label inline_block">\
			<i class="ts_icon ts_icon_eye ts_icon_inherit"></i>Draft</span></p>\
	<div class="rxn_panel"></div></div></div>';
};

var item_file_comment = function (username, userUrl, picture, dateCreate, comment) {
    picture = (picture != null) ? picture : '/static/images/ava_0022-48.png';
    return '<div class="comment"><span class="no_print"><a href="' + userUrl + '" target="_blank" ' +
        'class=" member_preview_link member_image thumb_36" style="background-image: url(' + picture + ');" \
        aria-hidden="true"></a>\
</span><p class="comment_meta"><span class="no_print"><a href="/account/profile/' + username + '/" target="_blank" ' +
        'class="message_sender color_4bbe2e member member_preview_link">' + username + '</a></span>\
		<span class="print_only_inline"><strong>' + username + '</strong> • </span>\
		<span class="comment_date_star_cog">' + dateCreate + '<span class="no_print"></span><a class="comment_actions">\
		<i class="comment_cog ts_icon ts_icon_cog ts_icon_inherit"></i></a>\
		</span></p><div class="comment_body">' + comment + '</div><div class="rxn_panel"></div></div>';
};

var item_direct_message = function (data, pos) {
    var avatar = "url('/static/images/roosty@2x.png')";
    var picture = (data.image != undefined) ? data.image : '/static/images/ava_0022-48.png';
    var item = '<div data-img="' + data.image + '" data-member-id="' + data.user.username + '" class="im_browser_row" style="position: absolute; top: 0; transform: translateY(' + pos + 'px);" >' +
        '<span class=" member_preview_link member_image thumb_36"  style="background-image: url(' + picture + ')""></span>' +
        '<div class="im_last_msg_time float_right cloud_silver small_left_margin">' +
        '<i class="ts_icon ts_icon_angle_arrow_up_left ts_icon_inherit">' +
        '</i><!--/*+ moment(data.date_pub, moment.ISO - 8601).format("hh:mm a") +--></div>' + //TODO: put the time
        '<i class="ts_icon ts_icon_enter ts_icon_inherit enter_icon float_right sky_blue small_top_margin"></i>' +
        '<div class="overflow_ellipsis bold im_display_name_container">' +
        '<span class="im_display_name">' + data.user.username + '</span>' +
        ' <span class="im_presence"><span class="presence active" title="active">' +
        '<i aria-hidden="true" class="ts_icon ts_icon_heart presence_icon"></i></span></span></div>' +
        '<div class="im_slackbot_greeting italic subtle_silver overflow_ellipsis"><!--data.msg--></div></div>'; //TODO: put the last message
    return item;
};

var item_direct_filter = function (data, pos) {
    var avatar = "url('/static/images/roosty@2x.png')";
    var item = '<div data-img="' + data.image + '" data-member-id="' + data.user.username + '" class="im_browser_row" data-long-list-item="1"  style="position: absolute; top: 0px; transform: translateY(' + pos + 'px);" >' +

        '<span class=" member_preview_link member_image thumb_36"  data-thumb-size="36" style="background-image: url(' + data.image + ')"> ' + '</span>' +
        '<i class="ts_icon ts_icon_enter ts_icon_inherit enter_icon float_right sky_blue small_top_margin"></i>' +
        '<div class="overflow_ellipsis bold im_display_name_container">' +

        '<span class="im_display_name">' + data.user.username + '</span>' +
        ' <span class="im_presence"><span data-member-presence="USLACKBOT" class="presence active member_presence_USLACKBOT" title="active"><i aria-hidden="true" class="ts_icon ts_icon_heart presence_icon"></i></span></span>' +

        '</div>' +

        '</div>';
    return item;

};

var item_member_token = function (member, avatar) {
    return '<div class="member_token " data-member-id="' + member + '">' +
        '<span class=" member_preview_link member_image thumb_24" style="background-image:  url(' + avatar + ')"></span>' +
        member + '<i class="ts_icon ts_icon_times ts_icon_inherit remove_member_icon"></i></div>';
};

var item_channel_browse = function (data, pos) {
    var item = '<div class="channel_browser_row channel_link" data-long-list-item="1" style="position: absolute; top: 0px; transform: translateY(' + pos + 'px);" data-channel-id="' + data.name + '">' +
        '<div class="channel_browser_row_header overflow_ellipsis">' +
        '<ts-icon class="channel_browser_type_icon subtle_silver ts_icon_channel_pane_hash"></ts-icon><span class="channel_browser_channel_name bold">' + data.name + '</span> <ts-icon class="shared_channel_icon subtle_silver ts_icon_shared_channel hidden"></ts-icon> <span class="channel_browser_joined cloud_silver">JOINED</span>' +
        '</div>' +
        '<div class="overflow_ellipsis italic">' +
        'Created <span class="channel_browser_created_by">by <span class="channel_browser_creator_name">' + data.usercreator.user.username + '</span></span> on <span class="channel_browser_created_on">' + moment(data.date_pub, moment.ISO - 8601).format("MMM Do hh:mm a") + '</span>' +
        '</div>' +
        '<div class="channel_browser_channel_purpose subtle_silver">' + data.purpose + '</div>' +

        '<div class="channel_browser_member_count_container subtle_silver small_left_margin"><i class="ts_icon ts_icon_user"></i> <span class="channel_browser_member_count">' + data.users.length + '</span></div>' +
        '<div class="channel_browser_open">' +
        '<i class="ts_icon ts_icon_enter"></i>' +
        '</div>' +
        '<div class="channel_browser_preview align_center hidden">' +
        '<i class="ts_icon ts_icon_enter"></i><br>preview' +
        '</div>' +

        '</div>';
    return item;
};

var item_search_user = function (data, pos) {
    var avatar = "url('/static/images/roosty@2x.png')";
    var item = '<div class="lfs_item" data-member-id="' + data.user.username + '" data-lfs-id="0" style="position: absolute; top: 0px;transform: translateY(' + pos + 'px)">' +
        '<div class="channel_invite_member_small clearfix">' +
        '<i class="enter_icon ts_icon ts_icon_enter sky_blue not_in_token float_right small_top_margin"></i>' +
        '<span class=" member_preview_link member_image thumb_36" data-member-id="U2KQ35L2Z" data-thumb-size="36" style="background-image:' + avatar + '"aria-hidden="true"></span>' +
        '<div class="name_container overflow_ellipsis">' +
        '<div class="bold">' + data.user.username + '</div>' +
        '<div class="subtle_silver not_in_token">' + data.user.username + '</div>' +
        '</div>' +
        '</div>' +
        '</div>';
    return item;
};

var item_member_channel = function (data) {
    var avatar = "url('/static/images/roosty@2x.png')";
    var item = '<div class="channel_invite_member_token clearfix" data-member-id="' + data + '">' +
        '<span  class=" member_preview_link member_image thumb_24" style="background-image: ' + avatar + '"  data-member-id="U2KQ35L2Z" data-thumb-size="24" style=""aria-hidden="true"></span>' +
        '<div class="name_container overflow_ellipsis">' + data + '</div>' +
        ' </div>'
    return item;
};

var itemLoad = '<div id="convo_loading_indicator"></div>';

var file_options_file = function (str, options) {
    var mapObj = {
        '#URL_LINK#': options.copyLink,
        '#NEW_WINDOW_OPEN_FILE#': options.opeNeWind,
        '#COMMENT#': options.comment,
        '#EDIT_FILE#': options.edit,
        '#URL_DELETE#': options.delete
    };
    str = str.replace(/#URL_LINK#|#NEW_WINDOW_OPEN_FILE#|#EDIT_FILE#|#URL_DELETE#|#COMMENT#/gi, function (matched) {
        return mapObj[matched];
    });
    return str;
};

var file_options_file_detail = function (str, options) {
    var mapObj = {
        '#URL_LINK#': options.copyLink,
        '#SHARE#': options.share,
        '#URL_DELETE#': options.delete,
    };
    str = str.replace(/#URL_LINK#|#SHARE#|#URL_DELETE#/gi, function (matched) {
        return mapObj[matched];
    });
    return str;
};

var urlFile = function (item) {
    var userurl = '/account/profile/' + item.author.user.username + '/',
        date = moment(item.uploaded, moment.ISO - 8601).format("MMM Do \\at h:mm a"),
        username = item.author.user.username,
        imageUser = item.author.image;

    if (item.code != undefined) {
        var type = getArrayByObject(typesL)[item.extension],
            url = '/account/file/snippet/' + item.slug + '/';
        return [url, item_code_file_detail(username, userurl, imageUser, item.title, date, item.code, url, item.slug), 'data-type="code"'];
    }
    if (item.text != undefined) {
        var url = '/account/file/post/' + item.slug + '/';
        return [url, item_post_file_detail(), 'data-type="post"'];
    }
    if (item.image_up != undefined)
        return [item.image_up, item_image_file_detail(item.title, item.slug, username, userurl, imageUser, item.image_up, date), 'data-type="image"'];
    if (item.file_up != undefined)
        return [item.file_up, item_file_file_detail(item, userurl, date), 'data-type="file"'];
};

var item_participan = function (image, name) {
    //audio_muted  screen_share poor_connection invite_cancel selected user_selected
    var result = '<div  data-participant-id="' + name + '"' +
        'class="participant  connected   ts_tip ts_tip_bottom ts_tip_float ts_tip_multiline playing ts_tip_hidden">' +
        '<div class="reaction_container"></div>' +
        '<div class="calls_participant_">' +
        '<div class="boomer"' +
        'style="transform: scale(1, 1); transition-duration: 508.34ms; transition-timing-function: cubic-bezier(0.665, -0.065, 0.852, 0.616);"></div>' +
        '<div class="participant_avatar_container participant_content_container">' +
        '<span class=" member_preview_link member_image thumb_192" data-member-id="U2KQ0HRD3"' +
        'data-thumb-size="192"' +
        ' style="background-image:' + image + '"></span>' +

        '</div>' +
        '<i class="ts_icon ts_icon_share_screen screen_share"></i>' +
        '<i class="ts_icon ts_icon_microphone_slash mute_audio"></i>' +
        '<i class="ts_icon ts_icon_exclamation_circle poor_connection_indicator"></i>' +
        '<i class="ts_icon ts_icon_times invite_cancel_indicator"></i>' +

        '<div class="participant_video_container participant_content_container">' +
        '<video class="video" muted="true" autoplay=""></video>' +
        '</div>' +
        '<span class="ts_tip_tip"><span class="ts_tip_multiline_inner">' + name + '</span></span></div>';
    return result;
};

var calls_popover_invite = function () {
    var result = ' <div class="invite_menu sh_popover menu" role="menu" no-bootstrap="1"> ' +
        '<div id="invite_popover" class="content_wrapper"> ' +
        '<div id="invite_menu" class="content"> ' +
        '<div id="invite_header" class="clearfix"> ' +
        '<span id="invite_people">Invite people</span> ' +
        '<a id="share_link" class="open_share_ui_trigger sh_popover_trigger">Share link instead</a>' +
        ' </div> <div id="invite_list_holder"> ' +
        '</div> <div id="invite_button_holder"> ' +
        '<button id="invite_button" class="btn sh_popover_trigger" disabled>Invite</button> ' +
        '</div> </div> </div> </div>';
    return result;
};

var active_speak = function (data) {
    return '<span class=" member_preview_link member_image thumb_192" style="background-image:url(' + data.avatar + ') "></span>';
};

var filter_select_container = function () {
    return '<div id="filter-container" class="lfs_input_container empty"> ' +
        // '<ts-icon class="ts_icon_search ts_icon search_icon subtle_silver">' +
        '</ts-icon> <div class="lfs_value"></div> ' +
        '<input type="text" id="im_browser_filter" class="lfs_input" size="1" placeholder="Invite people to this call" >' +
        '</div> <div class="lfs_list_container"> ' +
        '<div class="lfs_list"></div> ' +
        '</div> <div class="lfs_empty hidden"></div>';
};

var calls_popover_invite_error = function () {
    return '<div class="invite_menu sh_popover sh_popover_error" tabindex="-1"> ' +
        '<div class="content_wrapper">' +
        ' <div class="content align_center"> ' +
        '<div class="sh_popover_error_text indifferent_grey">Only paid teams can share calls between more than two people at a time.</div> ' +
        '<div class="top_margin"><a href="#/get.slack.help/hc/en-us/articles/216771908" target="_blank" class="btn btn_outline">Learn more' +
        '</a></div></div></div></div>';
};

var calls_invitee = function (item) {
    return '<div class="calls_invite_member" data-member-id="' + item.user.username + '" data-img="' + item.image + '"> ' +
        '<span class=" member_preview_link member_image thumb_32" ' +
        'style="background-image:url(' + item.image + ')"></span> ' +
        '<span class="name_container"> <span class="bold overflow_ellipsis"> ' +
        item.user.first_name + item.user.last_name +
        '<span class="not_in_token"> <span class="presence active " title="active"> ' +
        '<i class="ts_icon ts_icon_presence presence_icon"></i></span></span> ' +
        '</span><span class="subtle_silver not_in_token overflow_ellipsis"> ' +
        item.user.username + '</span></span></div>';
};

var calls_popover_settings = function () {
    return '<div class="settings_menu sh_popover audio_not_supported {{#if video_enabled}}video_enabled{{/if}} ' +
        '{{#if screen_sharing_enabled}}screen_sharing_enabled{{/if}}"> <div id="settings_popover" class="content_wrapper">' +
        '<div id="settings_menu" class="content clearfix menu" role="menu"> <div id="settings_audio"> <h4>Audio settings</h4>' +
        '<div id="settings_audio_input_devices_holder" class="settings_select_holder"><select id="settings_audio_input_devices">' +
        '</select><i class="ts_icon ts_icon_microphone"></i><i class="ts_icon ts_icon_caret_down"></i></div>' +
        '<div id="settings_audio_output_meter" class=""> {{#repeat 13 ~}} <span></span> {{~/repeat}} </div>' +
        '<div id="settings_audio_output_devices_holder" class="settings_select_holder"> <select id="settings_audio_output_devices">' +
        '</select><i class="ts_icon ts_icon_volume_up"></i><i class="ts_icon ts_icon_caret_down"></i></div>' +
        '<div id="settings_audio_test_playback"><a>Play test sound</a></div>' +
        '<div id="settings_audio_not_supported"> Slack will choose your mic & speaker based on what set in your system settings. To select a specific audio device, please install the Mac or Windows desktop app. </div>' +
        '</div> {{#if video_enabled}} <div id="settings_video"> <h4>Video settings</h4>' +
        '<div id="settings_video_input_devices_holder" class="settings_select_holder"><select id="settings_video_input_devices">' +
        '</select><i class="ts_icon ts_icon_video_camera"></i> <i class="ts_icon ts_icon_caret_down"></i></div>' +
        '<div id="settings_video_output_display" class=""></div> {{#if screen_sharing_enabled}} <h4>Screen sharing settings</h4>' +
        '<div id="settings_screens_holder" class="settings_select_holder"> <select id="settings_screens"></select>' +
        '<i class="ts_icon ts_icon_share_screen"></i> <i class="ts_icon ts_icon_caret_down"></i> </div> {{/if}} </div> {{/if}} </div> </div> </div>';
};

var calls_emoji_panel = function () {
    return '<div class="emoji_panel sh_popover {{#if video_enabled}}video_enabled{{/if}} {{#if screen_sharing_enabled}}' +
        'screen_sharing_enabled{{/if}}" tabindex="-1"><div id="emoji_popover" class="content_wrapper">' +
        '<div class="content normal_padding menu" role="menu"><h3 class="no_bottom_margin">Send reaction</h3>' +
        '<div class="emojis top_margin bottom_margin"> {{#each emoji}} <div class="emoji_container"> {{this}} </div> {{/each}} </div>' +
        '<p class="no_bottom_margin">Send a reaction to everyone on the call, just like that!</p></div></div></div>';
};

var searchList = function (data) {
    var dev = '<ol class="conversation_modifiers results modifiers" aria-label="conversation modifier">';
    data.forEach(function (item) {
        dev += '<li data-search-action="@' + item + '"><button class="result_item_btn btn_unstyle" type="button">\
               <strong>@' + item + '</strong>\
                <ts-icon class="ts_icon_plus_square_o ts_icon_inherit modifier_icon" aria-hidden="true">\
                 </ts-icon></button></li>';
    });
    dev += '<ol>';
    return dev;
};

var optionsSearch = function () {
    return '<ol class="conversation_modifiers results modifiers">\
          <li data-replacement="from:"><button class="result_item_btn btn_unstyle" type="button">\
          <strong>from: </strong><span class="muted_text">username</span>\
          <ts-icon class="ts_icon_plus_square_o ts_icon_inherit modifier_icon" aria-hidden="true"></button></li></ol>\
          <ol class="time_modifiers results modifiers">\
          <li data-replacement="after:"><button class="result_item_btn btn_unstyle" type="button">\
          <strong>after: </strong><span class="muted_text">date</span>\
          <ts-icon class="ts_icon_plus_square_o ts_icon_inherit modifier_icon" aria-hidden="true"></ts-icon></button></li>\
          <li data-replacement="before:">\
          <button class="result_item_btn btn_unstyle" type="button">\
          <strong>before: </strong><span class="muted_text">date</span>\
          <ts-icon class="ts_icon_plus_square_o ts_icon_inherit modifier_icon" aria-hidden="true"></ts-icon></button></li></ol>';
};