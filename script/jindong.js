var axios = require('axios');
var moment = require('moment');
// console.log(t);

let triggerTime = ['2017-11-02 20:00:00'];
let triggerTimeSpace = 10; // 触发抢购时间区间，单位秒
let intervalTime = 0.1; // 执行时间间隔，单位秒;
let interval = null;


function send() {
  var t = new Date().valueOf();

  function jQuery9555886(data) {
    console.info(moment(t).format('HH:mm:ss.SSS'), data.data);
  }
  axios({
    method: 'get',
    url: 'https://act-jshop.jd.com/newJdBeanExchange.html?activityKey=JBE_qzq7mq&callback=jQuery9555886&_=' + t,
    headers: {
      Accept: '*/*',
      'Accept-Encoding': 'gzip, deflate, br',
      'Accept-Language': 'zh-CN,zh;q=0.8,en;q=0.6',
      'Connection': 'keep-alive',
      'Cookie': '__jda=122270672.1256198890.1509609161.1509609161.1509609162.1; unpl=V2_ZzNtbUAHQUJyWBNUK0teDGIERQlKXhERfVtBV31LDABhVBtfclRCFXMURlRnGF8UZwcZWUFcRhVFCHZXchBYAWcCGllyBBNNIEwHDCRSBUE3XHxcFVUWF3RaTwEoSVoAYwtBDkZUFBYhW0IAKElVVTUFR21yVEMldQl2VHgdWwVvChtVQ2dzEkU4dlZyHFoNbjMTbUNnAUEpAEdVcxldSGcAFlpCX0ocfQl2VUsa; __jdb=122270672.5.1256198890|1.1509609162; __jdc=122270672; __jdv=122270672|baidu-pinzhuan|t_288551095_baidupinzhuan|cpc|0f3d30c8dba7459bb52f2eb5eba8ac7d_0_3a3f6ad1ac3846fe98c59b627ca47f83|1509609540454; __jdu=1256198890; TrackID=1Crb90O0PB1MnYVifNF9YGG31DjYYafzy6e4OMwac4-PfBSjqoySdgqnhHmGvAz6nBFNbviQWLua2PfINdKjmd6ekSiDppyhqiPWLnk9lr_99ZSimRjrHE4jmY1WMt60S; pinId=E8wbfUlE-EcUYtHvifgrH7V9-x-f3wj7; pin=jd_607e6c10105db; unick=jd_187681hjw; thor=A958E15C0B4BFECC56DB4510E7DD2A404B20B9F2AD803AF6F2992B4BB8B74905E053AC7C43CBFAE5D7C0726EC6FE2F8DA0189B519D0C1B0282955A12DF2C145FF3BC7F25CA2B5872EB480CC636B576354E6E50539C94DB81E9F1D91CFE59450C83796606CC359BD22F5E65C27A1C4D90D49B5A6F6BEB3A9D9478DC949B58711FE9BAC2F45196E501516CB5A492C7A3192C9866F4F1D5871E80F68FCFF8D8B639; _tp=TryEi0raNNmmghbtK6DiLWExSoD3h%2Bv%2FpDI9dLW%2Fy0o%3D; _pst=jd_607e6c10105db; ceshi3.com=000; 3AB9D23F7A4B3C9B=42K3QHELNJ3H3376Y4AFFVCXI3S5OXJYA7EVWANVGOMYDQ4O6YJYPNAD6YZM52562YNDG7565XUMCXHMIB4HHIILRA; user-key=c28d5061-8d1b-4431-afdb-9328495b0779; cn=1',
      'Host': 'act-jshop.jd.com',
      'Referer': 'https://sale.jd.com/act/06oZCPy5QY4R8FN.html',
      'User-Agent': 'Mozilla/5.0 (Windows NT 6.1; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/61.0.3163.100 Safari/537.36',
    }
  }).then(res => {
    eval(res.data);
  });
}

function main() {
  console.log('系统开启，等待中...... ' + moment().format('HH:mm:ss'));
  console.log('抢购时间：' + triggerTime[0]);
  console.log('try login');
  send();

  let trigger = triggerTime.map(x => moment(x));
  let current = moment();
  setInterval(() => {
    let now = moment();
    if ((now.unix() - current.unix()) >= 10 * 60) {
      current = now;
      console.log('等待中...... ' + now.format('HH:mm:ss'));
      console.log('try login');
      send();
    }

    if (Math.abs(now.unix() - trigger[0].unix()) < triggerTimeSpace) {
      if (interval === null) {
        console.log('开启抢购......');
        interval = setInterval(() => {
          // console.info('try get', moment().format('HH:mm:ss.SSS'));
          send();
        }, intervalTime * 1000);
      }
    } else {
      if (interval) {
        console.log('结束抢购......');
        clearInterval(interval);
        interval = null;
      }
    }
  }, 1000);
}

main();


// send();