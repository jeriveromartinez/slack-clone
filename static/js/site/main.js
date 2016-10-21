/**
 * Created by julio on 12/10/16.
 */
var menu = false, teams = false;
$(document).ready(function () {
    $('#menu_toggle').on('click', function () {
        if (!menu) {
            $('body').removeClass('nav_close').addClass('nav_open')
            $('#site_nav').removeClass('hidden');
            menu = true;
        } else {
            $('body').removeClass('nav_open').addClass('nav_close')
            $('#site_nav').addClass('hidden');
            menu = false;
        }
    });

    $('#overlay').on('click', function () {
        if (menu) {
            $('body').removeClass('nav_open').addClass('nav_close')
            $('#site_nav').addClass('hidden');
            menu = false;
        }
    });

    $('#team_switcher').on('click', function () {
        if (!teams) {
            teams = true;
            $('#header_team_nav').addClass('open');
        } else {
            teams = false;
            $('#header_team_nav').removeClass('open');
        }

    });

    $('#page').on('click', function () {
        if (teams) {
            teams = false;
            $('#header_team_nav').removeClass('open');
        }
    });
});