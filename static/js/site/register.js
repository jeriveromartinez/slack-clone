/**
 * Created by julio on 28/10/16.
 */
var user = {email: '', username: '', firstName: '', lastName: '', company: '', step: 2, invite: []};
var btnContinue = {
    2: 'Continue to Password',
    3: 'Continue to Company Name',
    4: 'Create Team',
    5: 'Send Invitations or Skip'
};
var btn = function (str) {
    return str + '<ts-icon class="ts_icon_arrow_right" aria-hidden="true"></ts-icon>';
};
var fieldInvitation = function () {
    return '<div class="invite_row"><div class="input_wrapper"><p class="seafoam_green hidden input_checkmark"><i class="ts_icon ts_icon_check_small_bold neutral_white_bg"></i></p><input class="no_bottom_margin" placeholder="name@domain.com" autocomplete="off" spellcheck="false" type="email"></div><p class="error_message"></p><a class="delete_row"><i class="ts_icon ts_icon_times"></i></a></div>';
};
hostUrl = window.location.protocol + '//' + window.location.host;

var itemLoad = '<div id="convo_loading_indicator"></div>';
$('body').prepend(itemLoad);
var setPassword = function (step) {
    return '<div class="create_step_number_label">Step ' + step + ' of 5</div><h1>Set your password</h1><p class="subtle_silver">Choose a password for signing in to Slack.</p><label class="normal" for="password">Password</label><input id="signup_password" placeholder="Password" name="password" type="password" required><div style="position: relative; width: 100%; margin: 5px 0px 1rem;"><div style="height: 4px; background-color: rgb(232, 232, 232); width: 100%; position: absolute; left: 0px;"></div><div style="height: 4px; width: 0%; position: absolute; left: 0px; background-color: rgb(39, 179, 15);" id="password-strength-meter"></div><div style="height: 4px; width: 2px; background-color: rgb(255, 255, 255); position: absolute; left: 25%;"></div><div style="height: 4px; width: 2px; background-color: rgb(255, 255, 255); position: absolute; left: 50%;"></div><div style="height: 4px; width: 2px; background-color: rgb(255, 255, 255); position: absolute; left: 75%;"></div></div><p class="error_message" id="password_error_message"></p><p class="subtle_silver">Passwords must be at least 6 characters long, and can’t be things like <i>password</i>, <i>123456</i> or <i>abcdef</i>.</p>';
};

var setCompanyName = function (step) {
    return '<div class="create_step_number_label">Step ' + step + ' of 5</div><h1>What\'s your company&nbsp;called?</h1><label id="teamname_label">Company name</label><input placeholder="Ex. Acme or Acme Marketing" id="signup_team_name" maxlength="255" autocomplete="off" aria-labelledby="teamname_label" type="text" required><p class="error_message"></p><p class="subtle_silver normal">We\'ll use this to name your Slack team, which you can always change later.</p>';
};

var setInvitations = function (step) {
    return '<div class="create_step_number_label">Step ' + step + ' of 5</div><div><h1 class="small_bottom_margin">Send Invitations</h1><p class="desc">Your Slack team is ready to go. Know a few friends or coworkers who’d like to explore Slack with you?</p><label class="inline_block">Email address</label><a id="add_invitation" class="inline_block float_right bold">+ Add another invitation</a></div><div id="invite_rows">' + fieldInvitation() + '</div>';
};

function defineStep() {
    $('span#step').html(user.step);
};

var getCookie = function (c_name) {
    if (document.cookie.length > 0) {
        c_start = document.cookie.indexOf(c_name + "=");
        if (c_start != -1) {
            c_start = c_start + c_name.length + 1;
            c_end = document.cookie.indexOf(";", c_start);
            if (c_end == -1) c_end = document.cookie.length;
            return unescape(document.cookie.substring(c_start, c_end));
        }
    }
    return "";
};

$(document).ready(function () {
    $(function () {
        defineStep();
    });

    $('.fs_split_flex_wrapper').on('input', '#signup_password', function () {
        var result = zxcvbn(this.value).score;
        var size = result / 4 * 100 + '%';
        $('#password-strength-meter').css('width', size);
    });

    $('.fs_split_flex_wrapper').on('click', '#add_invitation', function () {
        $('#invite_rows').append(fieldInvitation());
    });

    var sendForm = function () {
        $('#convo_loading_indicator').show();
        $.ajax({
            url: hostUrl + urlSend,
            data: user,
            type: "POST",
            headers: {"X-CSRFToken": getCookie("csrftoken")},
            success: function (response) {
                if (response.action == 'success')
                    window.location = hostUrl;
                $('#convo_loading_indicator').hide();
            },
            error: function (error) {
                $('#convo_loading_indicator').hide();
            }
        });
    };

    $('.fs_split_flex_wrapper').on('submit', function () {
        switch (user.step) {
            case 2:
                user.firstName = $('#signup_first_name').val();
                user.lastName = $('#signup_last_name').val();
                user.username = $('#signup_username').val();
                user.email = $('#signup_email').val();
                user.step += 1;

                $('.ladda-label').html(btn(btnContinue[user.step]));
                $('.fs_split_body').attr('id', 'password_form_body');
                $('.fs_split_body').html(setPassword(user.step));
                break;
            case 3:
                user.password = $('#signup_password').val();
                user.step += 1;
                $('.ladda-label').html(btn(btnContinue[user.step]));
                $('.fs_split_body').attr('id', 'team_name_form_body');
                $('.fs_split_body').html(setCompanyName(user.step));
                break;
            case 4:
                user.company = $('#signup_team_name').val();
                user.step += 1;
                $('.ladda-label').html(btn(btnContinue[user.step]));
                $('.fs_split_body').attr('id', 'invite_form_body');
                $('.fs_split_body').html(setInvitations(user.step));
                break;
            case 5:
                $('input[type="email"]').each(function (key) {
                    user.invite.push(this.value);
                });
                user = JSON.stringify(user);
                sendForm();
                break;
        }
    });
});