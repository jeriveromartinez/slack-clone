/**
 * Created by julio on 16/11/16.
 */
$(document).ready(function () {
    $('.fs_split_flex_wrapper').on('input', '#signup_password', function () {
        var result = zxcvbn(this.value).score;
        var size = result / 4 * 100 + '%';
        $('#password-strength-meter').css('width', size);
    });
});