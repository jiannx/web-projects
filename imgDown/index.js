var iconv = require('iconv-lite');
var fs = require("fs");
var querystring = require('querystring');
var http = require('http');
var request = require("request");
var gm = require('gm');
var path = require('path');

var baseUrl = '';

fs.mkdir('download', function() {});

var id = '';
var mobileUrl = '';
var srcList = [];

readUrl();

function readUrl() {
    fs.readFile("./url.txt", function(err, data) {
        if (err) {
            console.log(err);
        } else {
            baseUrl = data;
            getBaseHtml(baseUrl);
        }
    });
}

function getBaseHtml(url) {
    var option = {
        hostname: "www.kaola.com",
        path: url,
        method: 'GET',
        headers: {}
    };
    var html = '';
    var httpreq = http.request(option, function(httpres) {
        httpres.on("data", function(chunk) {
            html = html + iconv.decode(chunk, "utf8");
        });
        httpres.on('end', function() {
            //正则获得移动端网页地址
            mobileUrl = html.match(/http\:\/\/m\.kaola\.com\/product\/([0-9]*)\.html/g)[0];
            console.log('移动端url：' + mobileUrl);

            id = mobileUrl.match(/(\d+)/g)[0];
            console.log('产品id：' + id);

            fs.mkdir('download/' + id, function() {
                fs.writeFile('download/' + id + "/base.html", html, function(err) {
                    if (!err)
                        console.log('base.html创建成功');
                });
                getMobileUrl(mobileUrl);
            });
            fs.mkdir('download/' + id + '/imgs', function() {});
        });
    }).on("error", function(e) {
        console.log(e.message);
    });

    httpreq.end();
}

function getMobileUrl(url) {
    var option = {
        hostname: "www.kaola.com",
        path: url,
        method: 'GET',
        headers: {}
    };
    var html = '';
    var httpreq = http.request(option, function(httpres) {
        httpres.on("data", function(chunk) {
            html = html + iconv.decode(chunk, "utf8");
        });
        httpres.on('end', function() {
            fs.writeFile('download/' + id + "/mobile.html", html, function(err) {
                // if (!err)
                //     console.log('mobile.html创建成功');
            });

            //解析html获取图片list
            var goodsDetail = html.match(/var\s__goodsDetail\s=\s(.*)/)[0];
            var lists = goodsDetail.match(/http\:\/\/[^\\]*/g);

            srcList = lists;
            downImg(lists);
        });
    }).on("error", function(e) {
        console.log(e.message);
    });

    httpreq.end();
}


function downImg(list) {
    console.log('开始下载图片...');

    var complateNum = 0;

    function isAllcomplate() {
        complateNum++;
        if (complateNum == list.length) {
            console.log('所有图片下载完成');
            mergeImg();
        }
    }

    function down(src, name) {
        var h = http.get(src, function(res) {
            var imgData = "";
            res.setEncoding("binary"); //一定要设置response的编码为binary否则会下载下来的图片打不开

            res.on("data", function(chunk) {
                imgData += chunk;
            });

            res.on("end", function() {
                fs.writeFile("download/" + id + '/imgs/' + name + '.jpg', imgData, "binary", function(err) {
                    if (err) {
                        // console.log("down fail");
                        console.log(src + " fail");
                        // console.log(err);
                    }
                    console.log(src + " success");
                    isAllcomplate();
                });
            });
            res.on('error', function() {
                console.log('error');
            });
        });
        h.end();
    }
    var lastSrc = '';
    for (var i in list) {
        var t = list[i].match(/http\:\/\/(\.jpg)/g);
        if (lastSrc == t) {
            console.log(list[i] + ' 重复图片，不下载');
            return;
        } else {
            lastSrc = t;
            down(list[i], i);
            console.log(list[i] + ' starting');
        }

    }
}

function mergeImg() {
    console.log('开始合并图片....');
    // return;
    var details = [];
    var add = 0;
    for (var i = 0; i < srcList.length; i++) {
        var pwd = 'download/' + id + '/imgs/' + i + '.jpg';
        gm(pwd).size(function(err, size) {
            if (!err) {
                details.push({
                    h: size.height,
                    pwd: pwd
                });
                add++
                if (add == srcList.length) {
                    merge();
                }
            }
        });
    }

    function merge() {
        var g = gm();
        for (var i = 0; i < details.length; i++) {
            g.append('download/' + id + '/imgs/' + i + '.jpg');
        }
        g.write('download/' + id + '/output.jpg', function(err) {
            if (err) console.log(err);
            if (!err) console.log('图片合并完成' + 'download/' + id + '/output.jpg');
        });
    }


}
