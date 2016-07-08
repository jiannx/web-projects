var express = require('express');
var router = express.Router();
var iconv = require('iconv-lite');
var fs = require("fs");
var querystring = require('querystring');
var http = require('http');

/* GET home page. */
router.get('/', function(req, res, next) {
    res.render('index', { title: 'Express' });
});

router.post('/start', function(req, res, next) {
    var url = req.body.url;


    // var option = {
    //     hostname: "www.kaola.com",
    //     path: 'url',
    //     method: 'GET',
    //     headers: {}
    // };

    res.send({ message: 'hey' });
});


router.get('/downloading', function(req, res, next) {

});

function ga() {
    var sendData = 'v=1&id=4772';
    var option = {
        hostname: "www.kaola.com",
        path: 'http://www.kaola.com/recentlyViewAjax.html?cache=1467961905968',
        method: 'POST',
        headers: {
            'Content-Length': sendData.length,
            "Content-Type": 'application/x-www-form-urlencoded',
        }
    };
    var html = '';
    var httpreq = http.request(option, function(httpres) {
        httpres.on("data", function(chunk) {
            html = html + iconv.decode(chunk, "utf8");
        });
        httpres.on('end', function() {
            fs.writeFile("myfile.html", html, function(err) {
                if (!err)
                    console.log("写入成功！")
            })
        })

    }).on("error", function(e) {
        console.log(e.message);
    });
    httpreq.write(sendData);

    httpreq.end();
}

function mobile() {
    var option = {
        hostname: "www.kaola.com",
        path: 'http://m.kaola.com/product/4772.html',
        method: 'GET',
        headers: {
        }
    };
    var html = '';
    var httpreq = http.request(option, function(httpres) {
        httpres.on("data", function(chunk) {
            html = html + iconv.decode(chunk, "utf8");
        });
        httpres.on('end', function() {
            fs.writeFile("myfile.html", html, function(err) {
                if (!err)
                    console.log("写入成功！")
            })

            var reg = new RegExp(/(var\s__goodsDetail\s=\s)(\w*)(return\sfunction)/);
            console.log(reg.exec(html));
        })

    }).on("error", function(e) {
        console.log(e.message);
    });

    httpreq.end();
}
mobile();



module.exports = router;
