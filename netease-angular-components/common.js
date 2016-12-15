/**
 * Created by Silence on 2014/7/17.
 * Describe 公共函数
 */

'use strict';

//加载不同的css
function IncludeCss(pc, phone) {
    var IE = top.execScript ? 1 : 0;
    var style = document.createElement('link');
    style.rel = 'stylesheet';
    style.type = 'text/css';

    var head = document.getElementsByTagName('head')[0];
    if (IE) {
        style.href = pc;
    } else {
        if (Device() == 0)
            style.href = pc;
        else
            style.href = phone;
    }
    head.appendChild(style);
}

//网页间通过url传值
function GetUrlValue() {
    var tmpArr;
    var QueryString;
    var URL = document.location.toString();
    if (URL.lastIndexOf("?") != -1) {
        QueryString = URL.substring(URL.lastIndexOf("?") + 1, URL.length);
        tmpArr = QueryString.split("&");
        return tmpArr;
    } else {
        return 'NaN';
    }
}

//cookie操作
function SetCookie(name, value, time) {
    //var Days = 60;   //cookie 将被保存两个月
    var exp = new Date(); //获得当前时间
    exp.setTime(exp.getTime() + time * 1000); //换成毫秒
    document.cookie = name + "=" + escape(value) + ";expires=" + exp.toGMTString();
}

function GetCookie(name) {
    var arr = document.cookie.match(new RegExp("(^| )" + name + "=([^;]*)(;|$)"));
    if (arr != null)
        return unescape(arr[2]);
    return null;
}

function DelCookie(name) {
    var exp = new Date(); //当前时间
    exp.setTime(exp.getTime() - 1);
    var cval = GetCookie(name);
    if (cval != null) document.cookie = name + "=" + cval + ";expires=" + exp.toGMTString();
}

//数值转换成数值字符串 NumberToArray(2345, false)
//isPositive = true : 输入2345，返回[2, 3, 4, 5]
//isPositive = false : 输入2345，返回[5, 4, 3, 2]
function NumToArray(value) {
    var m = 9999999999; //可处理的最大数值
    var array = [];
    var isPositive = arguments[1] != undefined ? arguments[1] : true;

    while (m >= 1) {
        var v = parseInt(value / m);
        value = value - v * m;
        m = m / 10;
        if (v == 0 && array[0] == null) {
            continue;
        }
        if (isPositive == true) {
            array.push(v);
        } else {
            array.unshift(v);
        }
    }
    return array;
}

function ArrayToString(array, key) {
    var str = "";
    for (var i in array) {
        if (key != null)
            str += array[i][key].toString();
        else
            str += array[i].toString();
        if (i < array.length - 1)
            str += ",";
    }
    return str;
}

function StringToArray(str) {
    if (str == null) {
        return [];
    }
    var arr = str.split(',');
    return arr;
}
//日期格式化
Date.prototype.Format = function(fmt) {
    var o = {
        "M+": this.getMonth() + 1, //月份
        "d+": this.getDate(), //日
        "h+": this.getHours(), //小时
        "m+": this.getMinutes(), //分
        "s+": this.getSeconds(), //秒
        "q+": Math.floor((this.getMonth() + 3) / 3), //季度
        "S": this.getMilliseconds() //毫秒
    };
    if (/(y+)/.test(fmt))
        fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
    for (var k in o)
        if (new RegExp("(" + k + ")").test(fmt))
            fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
    return fmt;
}

//去除对象中的空的属性 包括[], '', {}
function ObjectNoEmpty(obj) {
    if (typeof obj === "object" && !(obj instanceof Array)) {
        for (var i in obj) {
            if (obj[i] instanceof Array) {
                if (obj[i].length == 0)
                    delete obj[i];
            } else if (typeof obj[i] === "string" && obj[i] === '') {
                delete obj[i];
            }else if (typeof obj[i] === "object" && !(obj[i] instanceof Array)) {

                var hasProp = false;
                for (var prop in obj[i]) {
                    hasProp = true;
                    break;
                }
                if (!hasProp) {

                    delete obj[i];
                } else {
                    ObjectNoEmpty(obj[i]);
                }
            } 
        }
    }
    return obj;
}
