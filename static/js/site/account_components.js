/**
 * Created by julio on 11/11/16.
 */

var fileComponent = function (title, slug, profile, date) {
    return '<div id="' + slug + '" class="file_list_item file_item space has_icon"><i class="filetype_icon s30 post"></i><div class="contents"><span class="author"><a href="#/blackmambasoft.slack.com/team/vbuilvicente" class="message_sender color_9f69e7 member member_preview_link">' + profile.user.username + '</a></span><span class="time">' + date + '</span><h4 class="title overflow_ellipsis no_preview"><a href="#/blackmambasoft.slack.com/files/vbuilvicente/F2LFY3NP7/-">' + title + '</a></h4><span class="share_info"><span class="file_share_public_label hidden"><span class="file_share_shared_label hidden">Shared <span class="file_share_label"></span></span></span><span class="file_share_private_label">Private file <span class="file_share_label"></span></span></span></div></div>';
};