(function ($) {

    $.fn.infiniteScroll = function (settings) {
        var $this = $(this)
        if (!$this.length) {
            return $this;
        }

        var opts = $.extend({}, $.fn.infiniteScroll.defaults, settings);
        var currentScrollPage = 1;
        var scrollTriggered = 0;
        var has_next = $("#msgs_div").find("ts-message.message:first").attr('data-next');
        var lastScrollTop = 0;
        var updirection = false;
        var load = false;

        $this.find('ts-message.message:first').addClass('last-scroll-row');

        $("#msgs_scroller_div").on('scroll', function () {
            var row = $('.last-scroll-row');
            has_next = $("#msgs_div").find("ts-message.message:first").attr('data-next');
            var st = $("#msgs_scroller_div").scrollTop();
            if (st > lastScrollTop) {
                updirection = false;
            } else {
                updirection = true;
            }
            lastScrollTop = st;

            if (updirection && row.length && scrollTriggered == 0 && isScrolledIntoView(row) && has_next == "true") {
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
            load = true;


        }

        function updateView(data) {
            var prev = $('.last-scroll-row');
            if (prev.length && data.items.length) {
                prev.after(data);

                prev.removeClass('last-scroll-row');
                prev.removeAttr('data-next');

                $this.find('ts-message.message:first').addClass('last-scroll-row');
                console.log(data.has_next);
                $this.find('ts-message.message:first').removeAttr('data-next');
                $("#msgs_div").find("ts-message.message:first").attr('data-next', data.has_next);
                has_next = data.has_next;

                scrollTriggered = 0;
            }
        }

        function triggerDataLoad() {
            load = false;
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