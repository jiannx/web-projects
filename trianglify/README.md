# js-package
使用require形式编写前端的js，编译生成js。

### 文件目录
* dist 编译生成的js，css
* doc 文档目录
* scss 样式源码
* src js源码
* test 测试页面

### 命令
* npm install -g bower gulp
* npm install
* bower install
* gulp 打包js，scss
* gulp watch监测文件变化并打包，打包出的js文件未做压缩
* gulp clean清除生成文件

###  注
* scss默认引入[bourbon](https://github.com/thoughtbot/bourbon)，[normalize](https://github.com/necolas/normalize.css)
* 如需修改入口文件，请修改gulpfile.js 中对应的inJs，outJs变量
