/**
 * Created by julio on 11/11/16.
 */

var fileComponent = function (title, slug, profile, date, obj) {
    var item = '';
    if (get_icon(obj) == 'filetype_image')
        item = '<div id="' + slug + '" class="file_list_item file_item hosted has_image"><i class="' + get_icon(obj) + '" style="background-size:contain;background: url(' + obj.image_up + ');"></i>';
    else
        item = '<div id="' + slug + '" class="file_list_item file_item space has_icon"><i class="' + get_icon(obj) + '"></i>';
    item += '<div class="contents"><span class="author"><a class="message_sender color_9f69e7 member member_preview_link">' + profile.user.username + '</a></span><span class="time">' + date + '</span><h4 class="title overflow_ellipsis no_preview"><a>' + title + '</a></h4><span class="share_info"><span class="file_share_public_label hidden"><span class="file_share_shared_label hidden">Shared <span class="file_share_label"></span></span></span><span class="file_share_private_label">Private file <span class="file_share_label"></span></span></span></div></div>';
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
			<select id="share_to" class="chosen-select small" data-placeholder="Who do you want to share?">' + options + '</select>\
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
        return obj.type in icon ? style + icon[obj.type] : style + 'file';
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
        return obj.type in icon ? style + icon[obj.type] + ' s48' : style + 'file s48';
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