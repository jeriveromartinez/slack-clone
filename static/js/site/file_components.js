/**
 * Created by julio on 11/11/16.
 */

var fileComponent = function (title, slug, profile, date, obj) {
    var item = '';
    if (get_icon(obj) == 'filetype_image')
        item = '<div id="' + slug + '" class="file_list_item file_item hosted has_image"><i class="' + get_icon(obj) + '" style="background-size:contain;background: url(' + obj.image_up + ');"></i>';
    else
        item = '<div id="' + slug + '" class="file_list_item file_item space has_icon"><i class="' + get_icon(obj) + '"></i>';
    item += '<div class="contents"><span class="author"><a href="#/blackmambasoft.slack.com/team/vbuilvicente" class="message_sender color_9f69e7 member member_preview_link">' + profile.user.username + '</a></span><span class="time">' + date + '</span><h4 class="title overflow_ellipsis no_preview"><a href="#/blackmambasoft.slack.com/files/vbuilvicente/F2LFY3NP7/-">' + title + '</a></h4><span class="share_info"><span class="file_share_public_label hidden"><span class="file_share_shared_label hidden">Shared <span class="file_share_label"></span></span></span><span class="file_share_private_label">Private file <span class="file_share_label"></span></span></span></div></div>';
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
                <select id="share_to" class="chosen-select small" data-placeholder="Who do you want to share?">' + options + '</select></div> \
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
				<input id="share_cb" checked="checked" name="share_cb" class="no_top_margin small_right_margin " tabindex="2" type="checkbox">Share\
				<span id="share_context_label">in</span></label>\
			<div id="select_share_channels" class="file_share_select inline_block no_margin"><select name="filetype" id="client_chared_select" class="chosen-select">' + optionShare + '</select></div>\
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
        return type[type.length - 1] in icon ? style + icon[type[type.length - 1]] : style + 'file';
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