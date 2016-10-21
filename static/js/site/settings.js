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
    })
});