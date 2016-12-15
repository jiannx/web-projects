/*

 alert：提示弹出框
 confirm：对话框（确定，取消）
 open：最基本的弹出框（无底部按钮）
 pagination：分页弹出框（上一步，下一步，确定，取消）

 select：单列选择弹出框
 multipleSelect：两列选择弹出框
 selectCheckBox：带有checkBox的多选步面

 关于confirm及pagination的确定按钮验证：
 如需添加此功能，请在html中添加<form name='xxxx'></form>，name属性必须定义
 如果嵌套多层form，只获取最外层form

 创建 alert，confirm，open，pagination 时传入以下的参数结构
 options = {
 title : '提示',                              //提示框标题
 parent : null,                             //父节点，如果为null，则添加到body
 scope : null,                              //需要绑定的scope（继承scope创建新的scope）
 template : null,                           //html代码字符串
 templateUrl : null,                        //html文件路径 （template与templateUrl只能用一个）
 cache : true,                              //设置html是否缓存 默认为true
 hasClose : true,                           //是否有关闭按钮 默认为true
 size : {width:500, height:300},            //窗口大小
 css : {right:'0px', bottom: '0px'},        //添加样式，当该值不为空时，默认居中样式不添加及设定窗口大小时不再默认居中
 showAnimate: 'bounceIn',                   //弹框显示动画
 hideAnimate: 'bounceOut',                   //弹框消失动画
 onConfirm : null,                          //创建confirm pagination时设置 确定按钮的事件 返回参数为弹出框的scope
 onCancel : null                            //取消按钮事件
 }

 创建 select(data, callback) 单选界面
 data={
 title : "选择",           //弹出框标题
 data : null,            //左侧被选择数据（当设定该值时，不需要再设定http和httpData）
 key : null,             //树结构中数据的key
 http  : null,           //左侧被选择数据的请求
 httpData : null,        //设定请求数据
 afterGetData : null     //获得请求数据后处理 function(data){ return data;}
 }
 callback(selects)
 select 选中的对象 {}

 创建 multipleSelect(data, callback) 多选界面（选中节点时 不关联 是否选中父节点及子节点）
 data={
 title : "选择",          //弹出框标题
 data : null,            //左侧被选择数据（当设定该值时，不需要再设定http和httpData）
 key : null              //树结构中数据的key
 http  : null,           //左侧被选择数据的请求
 httpData : null,        //设定请求数据
 afterGetData : null,    //获得请求数据后处理 function(data){ return data;}
 isShowAction : true，    //设置左侧选中添加到右侧时，左侧中是否删除。默认为true
 defaultCheck : {        //默认选中配置
 //已选中的value的数组 一般为id数组
 }
 }
 callback(selects)
 select中返回选中的对象数组 [{}, {}]

 创建 selectCheckBox(data, callback)（选中节点时 关联 是否选中父节点及子节点）
 data={
 title : "选择",          //弹出框标题
 data : null,            //左侧被选择数据（当设定该值时，不需要再设定http和httpData）
 key : null              //树结构中数据的key
 http  : null,           //左侧被选择数据的请求
 okText : '确定',         //确定按钮定义
 httpData : null,        //设定请求数据
 afterGetData : null,    //获得请求数据后处理 function(data){ return data;}
 unableLevel : 0,        //根据深度设定该节点是否可以选中 1：深度为1的不能被选中，2:深度为1,2的不能被选中，默认为0，即所有可选
 defaultCheck : {        //默认选中配置
 key : '',               //对应数据结构中的key
 list : []               //已选中的value的数组 一般为id数组
 }
 }
 callback(selects)
 select中返回选中的对象数组 [{depth, data}, {depth, data}]

 --------------DEMO---------------
 batDialog.alert({
 title : '提示',
 template : "请重试"
 });
 batDialog.alert('请重试');

 batDialog.confirm({
 title : '提示',
 template : "请重试",
 scope : $scope,
 onConfirm : function(scope){
 console.log(scope);
 },
 controller: ['$scope', function($scope) {
 }]
 });

 batDialog.open({
 title : '提示',
 template : "请重试",
 onConfirm : function(scope){
 console.log(scope);
 },
 controller: ['$scope', function($scope) {
 }]
 });

 batDialog.pagination({
 title : '提示',
 templateUrl : "demo.html",
 onConfirm : function(scope){
 console.log(scope);
 },
 controller: ['$scope', function($scope) {
 }]
 });

 demo.html
 <dialog-page>
 <dialog-page-panel title="常规">1</dialog-page-panel>
 <dialog-page-panel title="静态资产">2</dialog-page-panel>
 <dialog-page-panel title="温度">3</dialog-page-panel>
 <dialog-page-panel title="湿度">4</dialog-page-panel>
 </dialog-page>

 batDialog.multipleSelect({
 title : '选择组',
 data : null,
 http : request,
 httpDta : null,
 key : 'group_name',
 isShowAction : true
 }, function(array){
 var str = ArrayToString(array, 'group_name');
 var ids = ArrayToString(array, 'group_id');
 $scope.editAsset.group_ids = ids;
 $scope.editAsset.group_name = str;
 }
 );

 batDialog.selectCheckBox({
 title : '绑定部门',
 http : request.AssetGetDepartmentTree,
 httpData : null,
 unableLevel : 0
 }, function(selectData){
 console.log(selectData);
 }
 );
 */

(function() {
    var m = angular.module('UIDialog', []);
    var $el = angular.element;

    //插件的一些配置
    var maskCss = 'ui-mask';

    m.provider('uidialog', function() {
        var defaults = this.defaults = {
            title: '提示', //提示框标题
            parent: null, //父节点 默认为null，添加到body中
            scope: null, //父scope，默认为null，创建继承于rootScope的scope
            scopeIsChild: true, //是否创建子scope，false直接使用传入scope
            template: null, //正文字符串
            templateUrl: null, //正文模板url
            cache: true, //正文模板url建立缓存
            hasClose: true, //是否带有右上角关闭按钮
            hasMask: true, //是否带有遮罩层
            offset: 'center', //窗口的位置 默认上下左右居中，center：居中，lt:左上角，lb：左下角，rt：右上角，rb：右下角
            size: { width: 600, height: 400 }, //大小
            css: null, //css样式 该值存在情况下，offset和size参数无效
            okText: '确定', //确定按钮文本
            cancelText: '取消', //取消按钮文本
            showAnimate: 'bounceIn', //进入动画
            hideAnimate: 'bounceOut', //退出动画
            onClose: null, //关闭弹窗前事件调用
            //创建confirm pagination时设置
            onConfirm: null, //确定按钮事件
            onCancel: null //取消按钮事件
        };

        var globalId = 0;
        var mask = $el("<div class='" + maskCss + "'></div>");
        mask.appendTo($el('body')).hide();

        this.$get = ['$document', '$templateCache', '$compile', '$q', '$http', '$rootScope', '$timeout', '$window', '$controller',
            function($document, $templateCache, $compile, $q, $http, $rootScope, $timeout, $window, $controller) {

                function Dialog() {}
                Dialog.instances = [];
                Dialog.prototype = {
                    //option初始化
                    initOption: function(opts) {
                        var options = angular.copy(defaults);
                        opts = opts || {};
                        angular.extend(options, opts);
                        if (options.templateUrl) {
                            // options.templateUrl = options.templateUrl + '?t=' + new Date().getTime();
                        }
                        return options;
                    },
                    //创建弹出框html 结构
                    renderUI: function() {
                        globalId += 2;
                        var d = $el("<div class='ui-dialog animated " + this.opts.showAnimate + "' id='dialog" + globalId + "'>" +
                            "<div class='ui-dialog-title'>" + this.opts.title + "</div>" +
                            "<div class='ui-dialog-content'></div>" +
                            "<div class='ui-dialog-bottom'></div>" +
                            "</div>");
                        this.id = globalId;
                        Dialog.instances.push({
                            id: this.id,
                            hasMask: this.opts.hasMask
                        });
                        d.css({ 'z-index': globalId + 1000 });
                        this.setMask();
                        return d;
                    },
                    setMask: function() {
                        if (Dialog.instances.length > 0) {
                            var isShow = 0;
                            for (var i in Dialog.instances) {
                                if (Dialog.instances[i]['hasMask'] == true) {
                                    mask.css({ 'z-index': Dialog.instances[i]['id'] + 1000 - 1 });
                                    mask.show();
                                }
                                isShow += Dialog.instances[i]['hasMask'];
                            }
                            if (isShow == 0) {
                                mask.hide();
                            }
                            document.body.style['overflow-y'] = 'hidden';

                        } else {
                            mask.hide();
                            document.body.style['overflow-y'] = 'auto';
                        }
                    },
                    create: function(opts) {
                        var that = this;
                        //参数初始化
                        this.opts = this.initOption(opts);

                        this.$dialog = this.renderUI();
                        this.$title = this.$dialog.find('.ui-dialog-title');
                        this.$content = this.$dialog.find('.ui-dialog-content');
                        this.$bottom = this.$dialog.find('.ui-dialog-bottom');

                        if (this.opts.hasClose)
                            this.$title.append("<div class='ui-dialog-close' ng-click='closeThisDialog()'><i class='fa fa-times'></i></div>");

                        if (this.opts.scope && this.opts.scopeIsChild == false) {
                            this.scope = this.opts.scope;
                        } else {
                            this.scope = angular.isObject(this.opts.scope) ? this.opts.scope.$new() : $rootScope.$new();
                        }


                        this.scope.closeThisDialog = function() {
                            that.opts.onClose && that.opts.onClose();
                            that.close();
                        };

                        $compile(this.$dialog)(this.scope);

                        if (this.opts.css)
                            this.$dialog.css(this.opts.css);
                        else {
                            this.setSize(this.opts.size);
                            this.setOffset();
                        }

                        if (this.opts.parent)
                            this.opts.parent.append(this.$dialog);
                        else
                            $el('body').append(this.$dialog);

                        return this;
                    },
                    setSize: function(size) {
                        this.opts.size = size;
                        //设置大小
                        if (this.opts.size && angular.isObject(this.opts.size)) {
                            this.$dialog.css({
                                width: this.opts.size.width + 'px',
                                height: this.opts.size.height + 'px'
                            });
                        }
                    },
                    setOffset: function() {
                        if (this.opts.offset == 'center') {
                            this.$dialog.css({
                                'left': '50%',
                                'top': '50%',
                                'margin-left': this.opts.size.width / -2 + 'px',
                                'margin-top': this.opts.size.height / -2 + 'px'
                            });
                        } else if (this.opts.offset == 'lt') {
                            this.$dialog.css({
                                'left': '0px',
                                'top': '0px'
                            });
                        } else if (this.opts.offset == 'lb') {
                            this.$dialog.css({
                                'left': '0px',
                                'bottom': '0px'
                            });
                        } else if (this.opts.offset == 'rt') {
                            this.$dialog.css({
                                'right': '0px',
                                'top': '0px'
                            });
                        } else if (this.opts.offset == 'rb') {
                            this.$dialog.css({
                                'right': '0px',
                                'bottom': '0px'
                            });
                        }
                    },
                    close: function() {
                        for (var i in Dialog.instances) {
                            if (Dialog.instances[i]['id'] == this.id)
                                Dialog.instances.splice(i, 1);
                        }
                        // globalId -= 2;
                        var that = this;
                        this.setMask();
                        this.scope.$destroy();
                        this.$dialog.removeClass(this.opts.showAnimate).addClass(this.opts.hideAnimate);
                        // that.$dialog.remove();
                        this.$dialog.bind("animationend", function() { //动画结束时移除dialog
                            that.$dialog.remove();
                        });
                    }
                };

                var privateMethods = {
                    //http请求加载html
                    loadTemplateUrl: function(tmpl, config) {
                        return $http.get(tmpl, (config || {})).then(function(res) {
                            return res.data || '';
                        });
                    },
                    //加载html
                    loadTemplate: function(template, templateUrl, isCache, callback) {
                        var self = this;

                        function load() {
                            if (template) {
                                return template;
                            }
                            if (templateUrl) {
                                if (typeof isCache === 'boolean' && !isCache) {
                                    return self.loadTemplateUrl(templateUrl, { cache: false });
                                } else {
                                    return ($templateCache.get(templateUrl) || self.loadTemplateUrl(templateUrl, { cache: true }));
                                }
                            }
                        }

                        $q.when(load()).then(function(template) {
                            $templateCache.put(templateUrl, template);
                            callback(template);
                        });
                    }
                };

                var publicMethods = {
                    //提示框（只有一个确定按钮）
                    alert: function(opts) {
                        var op = angular.copy(defaults);
                        if (angular.isString(opts)) {
                            op.template = opts;
                        } else {
                            angular.extend(op, opts);
                        }
                        op.size = {
                            width: 350,
                            height: 140
                        };
                        var d = new Dialog().create(op);
                        var $dialog = d.$dialog;
                        var options = d.opts;
                        var scope = d.scope;
                        d.$content.append("<div class='form'>" + options.template + "</div>");
                        d.$bottom.append('<button type="button" class="btn btn-primary btn-sm" ng-click="closeThisDialog()">' + options.okText + '</button>');
                        $compile($dialog)(scope);
                        return d;
                    },
                    //标准对话框，只创建窗体
                    open: function(opts) {
                        var d = new Dialog().create(opts);
                        var $dialog = d.$dialog;
                        var options = d.opts;
                        var scope = d.scope;
                        d.$bottom.remove();
                        $dialog.css('padding-bottom', '0');
                        privateMethods.loadTemplate(options.template, options.templateUrl, options.cache, function(template) {
                            d.$content.html(template);
                            if (options.controller && (angular.isString(options.controller) || angular.isArray(options.controller) || angular.isFunction(options.controller))) {
                                var controllerInstance = $controller(options.controller, {
                                    $scope: scope,
                                    $element: $dialog
                                });
                                $dialog.data('$ngDialogControllerController', controllerInstance);
                            }
                            $compile($dialog)(scope);
                        });
                        return d;
                    },
                    //标准对话框，只创建窗体 没有标题
                    openWithNoTitle: function(opts) {
                        var d = new Dialog().create(opts);
                        var $dialog = d.$dialog;
                        var options = d.opts;
                        var scope = d.scope;
                        d.$bottom.remove();
                        d.$title.remove();
                        $dialog.css({
                            'padding-top': '0',
                            'padding-bottom': '0'
                        });
                        privateMethods.loadTemplate(options.template, options.templateUrl, options.cache, function(template) {
                            d.$content.html(template);
                            if (options.controller && (angular.isString(options.controller) || angular.isArray(options.controller) || angular.isFunction(options.controller))) {
                                var controllerInstance = $controller(options.controller, {
                                    $scope: scope,
                                    $element: $dialog
                                });
                                $dialog.data('$ngDialogControllerController', controllerInstance);
                            }
                            $compile($dialog)(scope);
                        });
                        return d;
                    },
                    //对话框（确定，取消按钮）
                    confirm: function(opts) {
                        var d = new Dialog().create(opts);
                        var $dialog = d.$dialog;
                        var options = d.opts;
                        var scope = d.scope;
                        d.$bottom.append('<button type="button" class="btn btn-default btn-sm" ng-click="cancelClick()">' + options.cancelText + '</button>' +
                            '<button type="button" class="btn btn-primary btn-sm" ng-click="okClick()">' + options.okText + '</button>');

                        privateMethods.loadTemplate(options.template, options.templateUrl, options.cache, function(template) {
                            d.$content.append(template);
                            //取form表单的name 表单的是否验证通过来控制确定按钮disable状态
                            //var formInvalid = ($dialog.find('form').length > 0) ? ($dialog.find('form').attr('name') + '.$invalid') : false;

                            scope.okClick = function() {
                                if (scope._bat_validate && !scope._bat_validate()) {
                                    return;
                                }
                                if (options.onConfirm) {
                                    if (options.onConfirm(scope) != false)
                                        d.close();
                                }
                            };
                            scope.cancelClick = function() {
                                options.onCancel && options.onCancel();
                                d.close();
                            };
                            if (options.controller && (angular.isString(options.controller) || angular.isArray(options.controller) || angular.isFunction(options.controller))) {
                                var controllerInstance = $controller(options.controller, {
                                    $scope: scope,
                                    $element: $dialog
                                });
                                $dialog.data('$ngDialogControllerController', controllerInstance);
                            }
                            $compile($dialog)(scope);
                        });
                        return d;
                    }
                };

                return publicMethods;
            }
        ]
    });
})();
