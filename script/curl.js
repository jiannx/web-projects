const childProcess = require("child_process");
const moment = require("moment");

/**
 * 定时抢购脚本
 * @param {string} startTime 开始时间
 * @param {array} curl 数组
 * @param {number} spacing 请求间隔 毫秒
 * @param {number}} continued 持续时间 毫秒
 */
function qiang(startTime = '', curl = [], spacing = 50, continued = 5000) {
  console.log('---start---')
  const time = moment(startTime).valueOf();

  const action = setInterval(() => {
    let t = Date.now();
    if (t >= time) {
      curl.forEach(x => {
        childProcess.exec(x, (err, stdout) => {
          console.log(stdout);
        });
      })
    }
    if (t - time > continued) {
      clearInterval(action);
    }
  }, spacing);
}

qiang('2019-11-01 14:15', [
  `curl www.baidu.com`,
]);
