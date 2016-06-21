// var $ = require('jquery');

/**
 * created by silence lu 2016/6/4
 * 图片视差滚动插件 依赖jq，该插件在jq之后引入
 * 其他网站实例 http://www.lexus-int.com/magazine/issue8/road/
 * $('#test1').imgParallax();
 * $('#test1').imgParallax(options);
 * 暂不支持class选择器形式 $('.img-box').imgParallax();
 *
 */


var defaultOptions = {
    autoImgSize: true, //自动调整图片的大小，默认为true：会根据视差值重新调整图片的大小。（图片的实际显示大小必须大于父类div）
    horizontal: true, //开启横向视差
    //视差值，页面滚动时产生的最大视差值，默认auto：设置视差值为父div高度的20%，即设置图片的实际大小为父div高度的1.4倍
    //自定义可设置任意正整数数值，但是该值不要大于(图片高度-父div高度)/2
    //当autoImgSize为false时建议手动设置该值
    parallaxNumY: 'auto',
    //横向滚动差值 自定义可设置任意正整数数值，但是该值不要大于(图片宽度-父div宽度)/2
    parallaxNumX: 20,
    //动画类型
    animate: 'easeOutCubic', //easeOutBack
    animateTime: 2000
};
var MAX_H_PARALLAX_INDEX = 0.2; //视差值默认系数

$.fn.imgParallax = function(options) {
    var opts = $.extend($.extend({}, defaultOptions), options || {});
    var $img = $(this).find('img');
    var boxSize = {
        width: $(this).width(),
        height: $(this).height()
    };
    console.log('1212');

    var ANIMATE_TIME = opts.animate; //设置动画时间

    //获取高视差值
    var MAX_H_PARALLAX;

    if (opts.parallaxNumY == 'auto') {
        MAX_H_PARALLAX = boxSize.height * MAX_H_PARALLAX_INDEX;
    } else {
        MAX_H_PARALLAX = opts.parallaxNumY;
    }

    //调整img大小及在父div内的位置
    if (opts.autoImgSize == true) {
        $img.css({
            'height': boxSize.height + MAX_H_PARALLAX * 2
        });
    }
    var imgSize = {
        width: $img.width(),
        height: $img.height()
    };

    //调整img在父div内的位置
    $img.css({
        'position': 'absolute',
        'left': '50%',
        'top': '50%',
        'margin-left': -imgSize.width / 2,
        'margin-top': -imgSize.height / 2
    });

    var offsetSize = $(this).offset();
    var screenSize = {
        width: $(window).width(),
        height: $(window).height()
    };

    //调整的最大最小值
    var maxOffsetH = offsetSize.top + boxSize.height;
    var minOffsetH = offsetSize.top - screenSize.height;

    var translateX = 0;
    var translateY = 0;

    var imgFirst = true;
    var self = $(this);

    function adjust() {
        offsetSize = self.offset();
        screenSize = {
            width: $(window).width(),
            height: $(window).height()
        };
        maxOffsetH = offsetSize.top + boxSize.height;
        minOffsetH = offsetSize.top - screenSize.height;

        var st = $(window).scrollTop();

        //初始化位置
        if (imgFirst) {
            imgFirst = false;
            $img.css({
                'margin-top': (-imgSize.height / 2) + translateY,
                'margin-left': (-imgSize.width / 2) - translateX
            });
            $img.show();
        }
        if (st < minOffsetH || st > maxOffsetH) {
            return;
        }
        translateY = ((st - (minOffsetH + maxOffsetH) / 2)) / Math.abs((maxOffsetH - minOffsetH) / 2) * MAX_H_PARALLAX;

        $img.stop(true, false);
        console.info($img.css('margin-top'), (-imgSize.height / 2) + translateY);
        $img.animate({
            'margin-top': (-imgSize.height / 2) + translateY,
            'margin-left': (-imgSize.width / 2) - translateX
        }, opts.animateTime, opts.animate);

        // TweenLite.to($img, 1.5, {
        //     'margin-top' : (- imgSize.height / 2) + translateY,
        //     'margin-left' : (- imgSize.width / 2) - translateX,
        //     ease: Elastic.easeInOut.config(1, 1), y: 0
        // });
    }
    adjust();

    $(window).on('scroll', function() {
        adjust();
    });
    if (opts.horizontal) {
        $('body').on('mousemove', function(e) {
            translateX = (e.clientX - offsetSize.left - boxSize.width / 2) / screenSize.width * opts.parallaxNumX;
            $img.stop(true, false).animate({
                'margin-top': (-imgSize.height / 2) + translateY,
                'margin-left': (-imgSize.width / 2) - translateX
            }, ANIMATE_TIME, 'easeOutExpo');
        });
    }
};
//body添加惯性滚动 默认参数
var bodyParallaxOpts = {
    animateTime: 2000, //滚动执行的时间
    fixTop: 0 //相对于顶部的偏移量
};
//body添加惯性滚动 请在window.onload中调用
$.fn.bodyParallax = function(options) {
    var opts = $.extend($.extend({}, bodyParallaxOpts), options || {});
    var $body = $(this);
    var $hideLine = $('<div></div>');
    $hideLine.css({
        'width': '0px',
        'height': $body.height() + opts.fixTop
    });
    $(this).after($hideLine);
    $(this).css({
        'top': -$(window).scrollTop() + opts.fixTop + 'px'
    });
    $(window).on('scroll', function() {
        $body.stop(true, false).animate({
            top: -$(window).scrollTop() + opts.fixTop + 'px'
        }, opts.animateTime, 'easeOutExpo');
    });
};
