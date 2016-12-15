'use strict';


$.fn.slideMenu = function(e) {

    var firstLi = $(this).children('ul').children('li');
    firstLi.each(function(i, e) {
        if ($(e).children('ul').length > 0) {
            $(e).addClass('open').addClass('with-angle').append('<div class="angle"><i class="fa fa-angle-down" aria-hidden="true"></i></div>');
        }
    });
    $(this).delegate('a', 'click', function() {
        var $p = $(this).parent();
        var $ul = $(this).parent().children('ul')
        var hasChild = $ul.length > 0;
        if (!hasChild) {
            return;
        }
        $ul.slideToggle();
        var $li = $ul.parent();
        if ($li.hasClass('open')) {
            $li.addClass('angle-right');
            $ul.slideUp(200, function() {
                $li.removeClass('open')
            });
        } else {
            $li.addClass('open').removeClass('angle-right');
            $ul.slideDown(200);
        }
    });
};
