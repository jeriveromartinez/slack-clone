/**
 * Created by julio on 12/10/16.
 */
$(document).ready(function () {
    $('.accordion_expand.btn.btn_outline').on('click', function () {
        var toExc = this.id.split('-')[1];
        $(this).addClass('hidden');
        $('#h-' + toExc).addClass('hidden');
        $('#accordion-' + toExc).css({display: 'initial'});
    });

    $('button.btn').on('click', function () {
        var toExc = this.id.split('-')[1];
        $('#expand-' + toExc).removeClass('hidden');
        $('#h-' + toExc).removeClass('hidden');
        $('#accordion-' + toExc).css({display: 'none'});
        if (toExc == 'timezone')
            $('b#' + toExc).html($('select#tz option:selected').text());
    });

    $('#button-username').on('click', function () {
        var exc = function (response) {
            if (response.success == "ok") {
                userlogged = data.username;
                $('input[name="username"]').val(data.username);
            }
        };
        var data = {username: $('input[name="username"]').val()};

        var urlapi = apiUrl + 'profile/' + userlogged + '/change/';
        request(urlapi, 'POST', 'json', data, exc, null);
    });

    $('#password').on('input', function () {
        var result = zxcvbn(this.value).score;
        var size = result / 4 * 100 + '%';
        $('#password-strength-meter').css('width', size);
    });

    $('#button-password').on('click', function () {
        var password = {old: $('#old_password').val(), change: $('#password').val()};
        var urlapi = apiUrl + 'profile/' + userlogged + '/password/';
        request(urlapi, 'POST', 'json', password, null, null);
        console.log(password);
    });

    $('#new_email').bind('select change keyup', function () {
        if (isEmail(this.value))
            $('#button-email').attr('disabled', false);
        else
            $('#button-email').attr('disabled', true);
    });

    $('#button-email').on('click', function () {
        var data = {email: $('#new_email').val(), password: $('#email_password').val()};
        var exc = function (response) {
            if (response.success == "ok") {
                $('strong#email_address').html(data.email);
            }
        };

        var urlapi = apiUrl + 'profile/' + userlogged + '/email/';
        request(urlapi, 'POST', 'json', data, exc, null);
    });
});