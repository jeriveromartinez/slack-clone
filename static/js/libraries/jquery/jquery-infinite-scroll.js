(function ($) {

    $.fn.infiniteScroll = function (settings) {
        var $this = $(this)
        if (!$this.length) {
            return $this;
        }

        var opts = $.extend({}, $.fn.infiniteScroll.defaults, settings);
        var currentScrollPage = 1;
        var scrollTriggered = 0;
        var hast_next = $("#msgs_div").find("ts-message.message:first").attr('data-next');

        $this.find('ts-message.message:first').addClass('last-scroll-row');

        $("#msgs_scroller_div").on('scroll', function () {
            var row = $('.last-scroll-row');
                hast_next = $("#msgs_div").find("ts-message.message:first").attr('data-next');
            if (row.length && !scrollTriggered && isScrolledIntoView(row) && hast_next == "true") {
                scrollTriggered = 1;
                triggerDataLoad();
            }
        });

        function isScrolledIntoView(elem) {
            var docViewTop = $("#msgs_scroller_div").scrollTop();
            var docViewBottom = docViewTop + $("#msgs_scroller_div").height();
            var elemTop = $(elem).offset().top;
            var elemBottom = elemTop + $(elem).height();
            return ((elemBottom <= docViewBottom) && (elemTop >= docViewTop));
        }

        function onDataLoaded(data) {

            if (jQuery.isFunction(opts.onDataLoaded)) {
                $.when(opts.onDataLoaded(data.items)).then(updateView(data));
            }


        }

        function updateView(data) {
            var prev = $('.last-scroll-row');
            if (prev.length && data.items.length) {
                prev.after(data);

                prev.removeClass('last-scroll-row');
                prev.removeAttr('data-next');

                $this.find('ts-message.message:first').addClass('last-scroll-row');
                $("#msgs_div").find("ts-message.message:first").attr('data-next', data.has_next);
              
                scrollTriggered = 0;
            }
        }

        function triggerDataLoad() {
            currentScrollPage += 1;
            if (jQuery.isFunction(opts.onDataLoading)) {
                opts.onDataLoading(currentScrollPage);
            }
            $.get(opts.dataPath + currentScrollPage + '/')
                .always(onDataLoaded)
                .fail(function () {
                    if (jQuery.isFunction(opts.onDataError)) {
                        opts.onDataError(currentScrollPage);
                    }
                });
        }

        return this;
    }

    // plugin defaults - added as a property on our plugin function
    $.fn.infiniteScroll.defaults = {
        dataPath: null,
        itemSelector: '.item',
        onDataLoading: null, // function (page)
        onDataLoaded: null, // function (data)
        onDataError: null // function (page)
    }

})(jQuery);