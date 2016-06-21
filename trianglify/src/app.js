var Trianglify = require('trianglify');

/**
 * created by silence lu 2016/6/8
 * 依赖svg.js jq trianglify.js
 * var p = new Pattern().create('box');
 * p.animate();
 */

function Pattern() {}
Pattern.prototype = {
    destroy: function() {
        this.draw.node.remove();
    },
    create: function(parentId) {
        var that = this;
        this.opts = {
            cellSize: 150, //区域大小，该值越小，生成的三角形越多
            strokeColor: '#222327', //三角形内颜色
            fillColor: '#222327', //边框颜色
            level_num: 3, //渐变等级
            space_t: 150, //不同层级动画的间隔时间
            animate_t: 500 //动画执行时间
        };

        this.isAnimating = false; //是否在动画中

        this.boundingBox = $('#' + parentId);
        this.draw = SVG(parentId).size('100%', '100%');
        this.boxSize = {
            width: this.boundingBox.width(),
            height: this.boundingBox.height()
        };
        this.triangles = Trianglify({
            width: that.boxSize.width,
            height: that.boxSize.height,
            cell_size: that.opts.cellSize
        });

        for (var i = 0; i < that.triangles.polys.length; i++) {
            var p = that.triangles.polys[i];
            var level = that._getLevel(p[1]);
            that.draw.path('M' + p[1].join("L") + 'Z').addClass('pattern-animate-level-' + level).attr({
                fill: that.opts.fillColor,
                stroke: that.opts.strokeColor,
                'fill-opacity': 0,
                'stroke-width': 0
            });
        }

        return this;
    },
    animate: function() {
        var draw = this.draw;
        var levelNum = this.opts.level_num + 1;
        var that = this;
        if (this.isAnimating) {
            return;
        } else {
            this.isAnimating = true;
        }
        var space_t = this.opts.space_t; //不同层级动画的间隔时间
        var animate_t = this.opts.animate_t; //动画执行时间

        var all_t = 2 * levelNum * space_t + animate_t * 2;

        for (var m = 0; m < levelNum; m++) {
            draw.select('path.pattern-animate-level-' + m)
                .animate(animate_t, '-', space_t * m).attr({
                    'fill-opacity': 1,
                    'stroke-width': 1
                }).delay((levelNum - m) * space_t)
                .animate(animate_t, '-', (levelNum - m) * space_t).attr({
                    'fill-opacity': 0,
                    'stroke-width': 0
                });
        }
        setTimeout(function() {
            that.isAnimating = false;
        }, all_t);
    },
    _getLevel: function(points) {
        var that = this;
        for (var m = 0; m < that.opts.level_num; m++) {
            for (var k in points) {
                if (points[k][0] < (that.boxSize.width * m * 0.1) || points[k][0] > (that.boxSize.width * (1 - m * 0.1)) || points[k][1] < (that.boxSize.height * m * 0.1) || points[k][1] > (that.boxSize.height * (1 - m * 0.1))) {
                    return m;
                }
            }
        }
        return that.opts.level_num;
    }
};

module.exports = Pattern;
