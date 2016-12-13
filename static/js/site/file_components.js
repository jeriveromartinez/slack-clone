/**
 * Created by julio on 11/11/16.
 */

var fileComponent = function (title, slug, profile, date, obj) {
    var urlFile = hostUrl + '/account/file/detail/' + slug + '/';
    if (get_icon(obj) == 'filetype_image')
        item = '<div id="' + slug + '" class="file_list_item file_item hosted has_image"><a href="' + urlFile + '"><i class="' + get_icon(obj) + '" style="background-size:contain;background: url(' + obj.image_up + ');"></i></a>';
    else
        item = '<div id="' + slug + '" class="file_list_item file_item space has_icon"><a href="' + urlFile + '"><i class="' + get_icon(obj) + '"></i></a>';
    item += '<div class="contents"><span class="author"><a class="message_sender color_9f69e7 member member_preview_link">' +
        profile.user.username + '</a></span><span class="time">' + date + '</span><h4 class="title overflow_ellipsis no_preview"><a href="' +
        urlFile + '">' + title + '</a></h4><span class="share_info"><span class="file_share_public_label hidden"><span class="file_share_shared_label hidden">' +
        'Shared <span class="file_share_label"></span></span></span><span class="file_share_private_label">Private file ' +
        '<span class="file_share_label"></span></span></span></div></div>';
    return item;
};

var uploadComponent = function (options) {
    return '<div id="upload_image_preview" class="bottom_margin"> \
        <img id="img64" src=""></div><p>\
        <label for="upload_file_title" class="inline_block">Title</label>\
        <input id="upload_file_title" name="upload_file_title" class="small title_input" tabindex="1" type="text">\
        <span class="modal_input_note">Titles are the easiest ways to search for files: it pays to be descriptive.</span>\
        <input id="file-upload" name="file-upload" class="filename_input offscreen hidden" type="file">\
        </p> <div id="file_sharing_div">\
        <div class="small_bottom_margin">\
            <label for="share_cb" class=" small_bottom_margin">\
                <input id="share_cb" checked="checked" name="share_cb" class="no_top_margin small_right_margin "\
                       tabindex="2" type="checkbox">Share\
                <span id="share_context_label">in</span> </label>\
            <div id="select_share_channels" class="file_share_select inline_block no_margin">\
                <select id="shared_to" class="chosen-select small" data-placeholder="Who do you want to share?">' + options + '</select></div> \
            <span id="select_share_channels_note" class="modal_input_note ">\
                        Files are private until they are shared in a public channel.\
                <span id="select_share_channels_join_note" class="hidden">\
                    <br><b>NOTE:</b> you will join this channel when you share the file into it.\
                </span></span>\
            <span id="select_share_ims_note" class="modal_input_note hidden"> This file will be private; the person you\'re sharing with will be able to see it. \
                </span><span id="select_share_mpims_note" class="modal_input_note hidden"> \
					    This file will be private; the members of the conversation you\'re sharing with will be able to see it.\
                </span><span id="select_share_groups_note" class="modal_input_note hidden">\
					    This file will be private; the members of the private channel you\'re sharing in will be able to see it.\
                </span></div>\
        <p class="no_bottom_margin">\
            <label class="inline_block align_top">\
                Add Comment <br>\
                <span class="input_note normal">(optional)</span>\
            </label>\
            <textarea id="file_comment_textarea" class="comment_input no_bottom_margin" name="comment"\
                      tabindex="4" wrap="virtual"></textarea>\
            <span id="select_share_at_channel_blocked_note"\
                  class="modal_input_note indifferent_grey hidden"></span>\
            <span id="select_share_at_channel_note" class="modal_input_note indifferent_grey hidden"></span>\
            <span id="select_share_at_channel_list" class="modal_input_note indifferent_grey"></span>\
        </p>\
    </div>';
};

var userTeamComponent = function (userUrl, avatar, email, names, username) {
    return '<div class="team_list_item member_item cursor_pointer active expanded clearfix">\
                            <div class="member_details member_item_inset col span_5_of_12 no_bottom_margin">\
                                <a href="' + userUrl + '" class="lazy member_preview_link member_image thumb_72"\
                                   style="background-size:contain;background: rgb(246, 246, 246) url(' + avatar + ');" aria-hidden="true"></a>\
                                <div class="member_name_and_title"><div class="color_4bbe2e">\
                                        <a href="' + userUrl + '"\
                                           class="bold member_preview_link member_name no_bottom_margin">' + names + '</a>\
                                    </div><div>@' + username + '<span class="presence active" title="active">\
                                        <i aria-hidden="true" class="ts_icon ts_icon_presence presence_icon"></i></span>\
                                    </div></div></div><div class="expanded_member_details small_top_padding col span_6_of_12 no_bottom_margin">\
                                <table class="member_data_table"><tbody><tr><td><span class="small_right_padding old_petunia_grey"\
                                                  title="Email">Email</span></td><td><a class="overflow_ellipsis" href="mailto:' + email + '"\
                                               title="Email ' + username + '">' + email + '</a></td>\
                                    </tr></tbody></table></div>\
                            <div class="col span_1_of_12 no_bottom_margin no_right_padding">\
                                <a class="member_preview_menu_target member_action_button btn btn_outline float_right top_margin hide_on_mobile">\
                                    <div class="team_directory_icon more_icon inline_block no_right_margin"></div></a>\
                                <a class="member_preview_menu_target member_action_button btn btn_outline bottom_margin top_margin show_on_mobile subtle_silver">\
                                    <div class="team_directory_icon more_icon inline_block small_right_margin"></div>\
                                    More</a></div></div>';
};

var createSnippet = function (optionLanguages, optionShare) {
    return '<div class="top_margin">\
				<label id="client_file_snippet_select_label" class="small float_right no_right_padding">\
					<select name="filetype" id="client_file_snippet_select" class="chosen-select">' + optionLanguages + '</select>\
				</label>\
				<input id="client_file_snippet_title_input" class="small" name="client_file_snippet_title_input" placeholder="Title (optional)" type="text">\
			</div>\
			<div class="top_margin bottom_margin">\
				<textarea id="client_file_snippet_textarea" class="client_file_snippet_textarea full_width create_snippet"></textarea>\
				<label class="checkbox normal mini float_right no_min_width">\
					<input id="client_file_wrap_cb" checked="checked" type="checkbox"> wrap\
				</label>\
			</div><div id="file_sharing_div">\
		<div class="small_bottom_margin">\
			<label for="share_cb" class=" small_bottom_margin">\
				<input id="share_cb" checked="checked" name="share_cb" class="no_top_margin small_right_margin " tabindex="2" type="checkbox">Share</label>\
			<div id="select_share_channels" class="file_share_select inline_block no_margin"><select id="shared_to" class="chosen-select">' + optionShare + '</select></div>\
			<span id="select_share_channels_note" class="modal_input_note ">\
				Files are private until they are shared in a public channel.\
				<span id="select_share_channels_join_note" class="hidden"><br><b>NOTE:</b> you will join this channel when you share the file into it.</span>\
			</span><span id="select_share_ims_note" class="modal_input_note hidden">\
					This file will be private; the person you\'re sharing with will be able to see it.\
			</span><span id="select_share_mpims_note" class="modal_input_note hidden">\
					This file will be private; the members of the conversation you\'re sharing with will be able to see it.\
			</span><span id="select_share_groups_note" class="modal_input_note hidden">\
					This file will be private; the members of the private channel you\'re sharing in will be able to see it.\
			</span></div><p class="no_bottom_margin">\
			<label class="inline_block align_top">Add Comment <br>\
				<span class="input_note normal">(optional)</span>\
			</label>\
			<textarea id="file_comment_textarea" class="comment_input no_bottom_margin" name="comment" tabindex="4" wrap="virtual"></textarea>\
			<span id="select_share_at_channel_blocked_note" class="modal_input_note indifferent_grey hidden"></span>\
			<span id="select_share_at_channel_note" class="modal_input_note indifferent_grey hidden"></span>\
			<span id="select_share_at_channel_list" class="modal_input_note indifferent_grey"></span>\
		</p></div>';
};

var sharedFile = function (item, date, userUrl) {
    var file = urlFile(item);
    return '' + sharedFileType(file[2], item) + '\
		<div class="contents"><div class="title break_word">\
				<a href="' + file[0] + '" target="_blank" class="file_preview_link file_force_flexpane">' + item.title + '</a>\
			</div><a href="' + userUrl + '" target="_blank" class="message_sender color_4bbe2e member member_preview_link">' + item.author.user.username + '</a>\
			<span class="time"><span class="bullet">•</span> ' + date + '</span><br>\
				<div class="preview post_body"></div></div></div>\
			<div id="file_sharing_div"><div class="small_bottom_margin">\
			<input id="share_model_ob_id" value="C2KPUV3P0" type="hidden">\
			<label for="share_cb" class=" small_bottom_margin">Share</label>\
			<div id="select_share_channels" class="file_share_select inline_block no_margin">\
			<select id="shared_to" class="chosen-select small" data-placeholder="Who do you want to share?">' + options + '</select>\
			<!--<div class="lazy_filter_select default_style single value"><div class="lfs_input_container empty">\
	<ts-icon class="ts_icon_search ts_icon search_icon subtle_silver"></ts-icon>\
	<div class="lfs_value"><div class="lfs_item selected single"><i class="ts_icon ts_icon_channel"></i>announcements</div></div>\
	<input class="lfs_input" size="1" placeholder="Search" value="" type="text"></div>\
<div class="lfs_list_container"><div class="lfs_list"></div></div><div class="lfs_empty hidden"></div>\
</div>--></div><span id="select_share_channels_note" class="modal_input_note ">\
				Files are private until they are shared in a public channel.\
				<span id="select_share_channels_join_note" class="hidden"><br><b>NOTE:</b> you will join this channel when you share the file into it.</span>\
			</span><span id="select_share_ims_note" class="modal_input_note hidden">\
					This file will be private; the person you\'re sharing with will be able to see it.</span>\
			<span id="select_share_mpims_note" class="modal_input_note hidden">\
					This file will be private; the members of the conversation you\'re sharing with will be able to see it.\
			</span><span id="select_share_groups_note" class="modal_input_note hidden">\
					This file will be private; the members of the private channel you\'re sharing in will be able to see it.\
			</span></div><p class="no_bottom_margin"><label class="inline_block align_top">Add Comment<br>\
				<span class="input_note normal">(optional)</span></label>\
			<textarea id="file_comment_textarea" class="comment_input no_bottom_margin" tabindex="4"></textarea>\
			<span id="select_share_at_channel_blocked_note" class="modal_input_note indifferent_grey"></span>\
			<span id="select_share_at_channel_note" class="modal_input_note indifferent_grey"></span>\
			<span id="select_share_at_channel_list" class="modal_input_note indifferent_grey"></span></p></div>';
};

var msgArchiveComponent = function (date, avatar, username, style) {
    style = (style != undefined) ? style : 'top_padding bottom_border';
    //first (class="bottom_border")
    //last (class="top_padding")
    //other (class="top_padding bottom_border")
    return '<div class="' + style + '"><div class="position_relative"><span class="avatar">\
                    <span class=" member_preview_link member_image thumb_48"\
                          style="background-image: url(' + avatar + ')" aria-hidden="true"></span>\
                </span></div><h4 class="no_bottom_margin" style="padding-left: 4rem;"><a href="/archives/D2KQ7LY23" class="slate_blue">' + username + '</a>\
            </h4><div class="col span_4_of_6 subtle_silver" style="padding-left: 4rem;"><p class="small no_bottom_margin"> Julio: ooe locols </p>\
            </div><div class="col span_2_of_6 subtle_silver hide_on_mobile">Dec 9th, 2016</div>\
            <div class="clear_both"></div></div>';
};

var get_icon = function (obj, iconS) {
    var size = (iconS != undefined) ? iconS : 's30';
    var style = 'filetype_icon ' + size + ' ';
    if (typeof(obj.code) !== 'undefined')
        return style + 'csharp';
    else if (typeof(obj.image_up) !== 'undefined')
        return 'filetype_image';
    else if (typeof(obj.text) !== 'undefined')
        return style + 'post';
    else
        return obj.extension in icon ? style + icon[obj.extension] : style + 'file';
};

var get_icon_details = function (obj) {
    var style = 'file_header_icon generic_header_icon filetype_icon ';
    if (typeof(obj.code) !== 'undefined')
        return style + 'csharp s48';
    else if (typeof(obj.image_up) !== 'undefined')
        return 'filetype_image';
    else if (typeof(obj.text) !== 'undefined')
        return style + 'post';
    else
        return obj.extension in icon ? style + icon[obj.extension] + ' s48' : style + 'file s48';
};

var sharedFileType = function (type, item) {
    if (type == 'data-type="image"') {
        return '<div id="' + item.slug + '" class="file_list_item file_item hosted has_image" data-file-id="' + item.slug + '">\
            <a href="' + item.file_up + '" target="_blank" class="file_preview_link icon thumb_80">\
				    <img src="' + item.image_up + '" class="lazy"></a>';
    } else {
        return '<div id="' + item.slug + '" class="file_list_item file_item space has_icon" data-file-id="' + item.slug + '">\
            <i class="' + get_icon(item, 's24') + '"></i>';
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
    'mp3': 'mp3'
};