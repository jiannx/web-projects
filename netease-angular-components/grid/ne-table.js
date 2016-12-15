angular.module('app').provider('neGrid', function() {
    //参数表
    var defaults = {
        parent: null, //父节点 '#divId'
        class: null, //样式名 默认空
        striped: null, //隔行变色，TODO待添加
        http: null, //获取数据的请求 在request中定
        httpData: null, //请求参数
        data: null, //列表数据，当该数据定义时，将忽略http及httpData参数
        hasCheckBox: true, //是否有选择框
        scope: null, //父scope，如果定义，则使用父scope，如果未定义，创建新scope
        isInit: true, //是否进行初始化，false: 只进行表格创建
        page: true, //是否包含底部分页信息
        onlyInfoPage: false, //设置为 true 只显示总数据数，而不显示分页按钮。需要 page=true
        columnDefs: [
            // { display: '', field: '', isTitle: false, width: '', sort: false }
        ],
        //加载服务器数据之前的处理程序，可以用来格式化数据。参数：res为从服务器请求到的数据。
        resHandler: function(res) {
            return res;
        },
        //选中行事触发事件  参数：已勾选的列表
        onSelect: function(selArray) {},
    };
    //列定义参数columnDefs
    //display: 标题;
    //field: 填充项，字符串或者构造函数function(rowData, listData);
    //isTitle: 是否添加title属性（当需要显示的内容过长时设定）
    //width: 默认等比宽度的每列，如需定义，请定义所有列的宽度，exp：'40'
    //sort: 该列是否支持排序，默认不开启
    //方法表
    //refresh：表格重新获取数据刷新
    //setData: function(data)               //重设表格数据，自动刷新
    //getSelect: function()                 //获取表格选中项 返回选中列表
    //setHttp: function(http, httpData)     //重设http请求，自动刷新
    //setHttpData: function(httpData)       //重设httpData数据，自动刷新

    //项目变更需重新配置以下参数
    var KEY = {
        list: 'data',
        curPage: 'page_now',
        pageCount: 'page_total',
        totalCount: 'records',
        //请求参数定义
        httpCurPage: 'page', //页码
        orderType: 'sort_type',
        orderBy: 'sort_col',
        orderDesc: 'desc',
        orderAsc: 'asc',
    };


    this.$get = ['$compile', '$rootScope', '$controller', function($compile, $rootScope, $controller) {

        //创建grid对象
        function Grid() {
            this.scope = {};
            this.isAppend = false;
        }
        Grid.prototype = {
            close: function() {
                this.scope.$destroy();
                this.$grid.remove();
            },
            create: function(opts) {
                this.opts = angular.extend(angular.copy(defaults), opts);

                this.scope = angular.isObject(this.opts.scope) ? this.opts.scope.$new() : $rootScope.$new(true);

                this.scope.data = {};
                this.scope.totalCount = 0;
                this.scope.curPage = 1;
                this.scope.pageCount = 1;
                this.scope.gridData = [];
                this.scope.columnDefs = this.opts.columnDefs;
                this.scope.http = this.opts.http;
                this.scope.httpData = angular.copy(this.opts.httpData);
                this.scope.rowSelect = [];
                this.scope.rowSelectAll = false;
                this.scope.jumpTo = null;

                this.renderUI();

                //是否创建时直接获取数据
                if (this.opts.isInit) {
                    if (this.opts.data != null)
                        this.setData(this.opts.data);
                    else
                        this.getData();
                }
                return this;
            },
            renderUI: function() {
                var that = this;
                this.$grid = angular.element("<div class='ui-grid'></div>");
                this.$header = angular.element("<div class='ui-grid-header'></div>");
                this.$gridBottom = angular.element("<div class='ui-grid-bottom'></div>");
                this.$gridList = angular.element("<div class='ui-grid-list'></div>");
                this.$grid.append(this.$header).append(this.$gridBottom).append(this.$gridList);
                if (this.opts.class) {
                    this.$grid.addClass(this.opts.class);
                }
                //如果获取到了父节点，则添加表格，如果未获取到，则在请求之后添加表格\
                var addInterval = null,
                    tryCount = 0;

                function add() {
                    var p = angular.element(that.opts.parent);
                    if (p.length > 0) {
                        p.append(that.$grid);
                        that.isAppend = true;
                        clearInterval(addInterval);
                    }
                    if (tryCount++ > 50) {
                        clearInterval(addInterval);
                        console.warn('neGrid创建失败，未找到父节点');
                    }
                }
                addInterval = setInterval(add, 100);
                if (this.opts.page) {
                    this.$grid.addClass('with-bottom');
                }
                this.createHeader();
            },
            resetHeader: function() {
                this.$header.find('.ui-grid-header-cell').removeClass('ui-grid-up').removeClass('ui-grid-down');
            },
            //列表的ui操作以jq dom操作实现，是否选中以数据双向绑定实现
            refreshGrid: function() {
                if (this.isAppend == false) {
                    $(this.opts.parent).append(this.$grid);
                }
                this.$gridList.empty();
                var scope = this.scope;
                var that = this;

                scope.rowSelect = [];
                that.opts.onSelect && that.opts.onSelect(that.getSelect());
                scope.rowSelectAll = false;
                var cellWidth = 1 / this.opts.columnDefs.length * 100 + '%';

                angular.forEach(scope.gridData, function(rowData, index) {
                    scope.rowSelect[index] = false;

                    var $row = $("<div class='ui-grid-row' ng-class='{\"ui-grid-row-select\": rowSelect[" + index + "]}'></div>");
                    that.$gridList.append($row);

                    angular.forEach(that.opts.columnDefs, function(colum) {
                        //如果columnDefs里面没有width未定义则等分列
                        if (angular.isDefined(colum.width) == false)
                            var $cell = $("<div class='ui-grid-row-cell' ng-click='rowClick(" + index + ")' style='width: " + cellWidth + "'></div>");
                        else
                            $cell = $("<div class='ui-grid-row-cell' ng-click='rowClick(" + index + ")' style='width:" + colum.width + "%'></div>");
                        //如果为字符串，则直接显示
                        if (angular.isString(colum.field)) {
                            $cell.append(rowData[colum.field]);
                        }
                        //如果参数为function，当前行的数据，当前所有数据值作为参数传递
                        else if (angular.isFunction(colum.field)) {
                            $cell.append(colum.field(rowData, scope.data));
                        }
                        if (angular.isDefined(colum.isTitle) == true) {
                            if (angular.isFunction(colum.isTitle) == true) {
                                $cell.attr('title', colum.isTitle(rowData, scope.data));
                            } else if (colum.isTitle == true)
                                $cell.attr('title', rowData[colum.field]);
                        }
                        $row.append($cell);
                    });
                    if (that.opts.hasCheckBox == true) {
                        $row.addClass('ui-grid-hasCheck');
                        $row.append("<div class='ui-grid-check'><input type='checkbox' ng-change='checkChange()' ng-model='rowSelect[" + index + "]'></div>")
                    }
                });
                //单行选择按钮
                scope.checkChange = function(index) {
                    scope.rowSelect[index] = true;
                    scope.rowSelectAll = (eval(scope.rowSelect.join('+')) == scope.rowSelect.length);
                    that.opts.onSelect && that.opts.onSelect(that.getSelect());
                };
                //单行点击事件
                scope.rowClick = function(index) {
                    if (scope.rowSelectAll) {
                        for (var i in scope.rowSelect) {
                            scope.rowSelect[i] = false;
                        }
                        scope.rowSelect[index] = true;
                        scope.rowSelectAll = false;
                    } else {
                        scope.rowSelect[index] = !scope.rowSelect[index];
                        for (var i in scope.rowSelect) {
                            (i != index) && (scope.rowSelect[i] = false);
                        }
                    }
                    that.opts.onSelect && that.opts.onSelect(that.getSelect());
                };
                $compile(this.$gridList)(scope);
                this.createBottom();
            },
            createHeader: function() {
                var scope = this.scope;
                var that = this;
                this.$header.empty();
                var cellWidth = 1 / this.scope.columnDefs.length * 100 + '%';
                if (angular.isDefined(this.scope.columnDefs[0].width) == true) { //判断columnDefs里面是否有width值传
                    this.$header.append('<div class="ui-grid-header-cell" ng-repeat="col in columnDefs" ng-click="SortAscDesc(col,$index)" style="width:{{col.width}}%">{{col.display}}</div>');
                } else {
                    this.$header.append('<div class="ui-grid-header-cell" ng-repeat="col in columnDefs" ng-click="SortAscDesc(col,$index)" style="width: ' + cellWidth + '">{{col.display}}</div>');
                }
                //添加全选按钮
                if (this.opts.hasCheckBox == true) {
                    this.$header.addClass('ui-grid-hasCheck');
                    this.$header.append("<div class='ui-grid-check'><input type='checkbox' class='checkAll' ng-model='rowSelectAll' ng-change='checkAllChange()'></div>")
                }
                //定时控制表头宽度
                this.interval = setInterval(function() {
                    if (that.$grid.is(':hidden')) {
                        clearInterval(that.interval);
                        that.close;
                        return;
                    }
                    var w = that.$gridList[0].offsetWidth;
                    if (that.$gridList.find('.ui-grid-row').length != 0) {
                        w = that.$gridList.find('.ui-grid-row').eq(0)[0].offsetWidth
                    }
                    that.$header.css({
                        width: w
                    });
                }, 500);

                //全选按钮
                scope.checkAllChange = function() {
                    for (var i = 0; i < scope.rowSelect.length; i++) {
                        scope.rowSelect[i] = scope.rowSelectAll;
                    }
                    that.opts.onSelect && that.opts.onSelect(that.getSelect());
                };
                //排序点击事件
                var orderType = KEY.orderAsc;
                scope.SortAscDesc = function(colData, index) {

                    if (angular.isDefined(colData.sort) == false || colData.sort == false || !that.opts.http)
                        return;
                    if (angular.isFunction(colData.field) && colData.sort === true){
                        console.warn('请配置排序字段');
                        return;
                    }
                    var clickHeader = that.$header.find('.ui-grid-header-cell').eq(index);
                    var others = clickHeader.siblings();
                    if (clickHeader.hasClass('ui-grid-down')) {
                        clickHeader.removeClass('ui-grid-down').addClass('ui-grid-up');
                        others.removeClass('ui-grid-up').removeClass('ui-grid-down');
                        orderType = KEY.orderAsc;
                    } else {
                        clickHeader.removeClass('ui-grid-up').addClass('ui-grid-down');
                        others.removeClass('ui-grid-up').removeClass('ui-grid-down');
                        orderType = KEY.orderDesc;
                    }
                    var d = {};
                    // d[KEY.orderBy] = (angular.isFunction(colData.field) == true) ? colData.sort : colData.field;
                    if (angular.isString(colData.sort))
                        d[KEY.orderBy] = colData.sort;
                    else if (angular.isString(colData.field) && colData.sort === true)
                        d[KEY.orderBy] = colData.field;
                    d[KEY.orderType] = orderType;
                    angular.extend(scope.httpData, d);
                    that.getData();
                };

                $compile(this.$header)(this.scope);
            },
            createBottom: function() {
                var that = this;
                var scope = this.scope;
                var LENGTH = 4;
                that.$gridBottom.empty();
                if (!that.opts.page) {
                    return;
                }

                scope.isShow = !that.opts.onlyInfoPage;
                var $page = $('<div class="ui-grid-bottom-page" ng-show="isShow" ></div>');
                $page.append('<a class="page" ng-click="pageTo(\'上一页\')">上一页</a>');

                scope.pageList = [];
                var sNum = scope.curPage - LENGTH,
                    eNum = scope.curPage + LENGTH;
                sNum = sNum < 1 ? 1 : sNum;
                eNum = eNum > scope.pageCount ? scope.pageCount : eNum;
                for (var i = sNum; i <= eNum; i++) {
                    scope.pageList.push(i);
                }
                if (sNum >= 2) {
                    if (sNum > 2)
                        scope.pageList.unshift('...');
                    scope.pageList.unshift(1);
                }
                if (eNum <= (scope.pageCount - 2)) {
                    if (eNum < (scope.pageCount - 2))
                        scope.pageList.push('...');
                    scope.pageList.push(scope.pageCount);
                }
                $page.append('<a class="page" ng-repeat="num in pageList track by $index" ng-class="{sel:curPage == num}" ng-click="pageTo(num)">{{num}}</a>');
                $page.append('<a class="page" ng-click="pageTo(\'下一页\')">下一页</a>');
                that.$gridBottom.append("<div class='ui-grid-bottom-info'>共&nbsp{{totalCount}}&nbsp条，{{pageCount}}页</div>");
                that.$gridBottom.append($page);
                scope.pageTo = function(num) {
                    if (num == '...')
                        return;
                    if (num == '上一页') {
                        scope.httpData[KEY.httpCurPage] = scope.curPage > 1 ? (scope.curPage - 1) : 1;
                    } else if (num == '下一页') {
                        scope.httpData[KEY.httpCurPage] = scope.curPage < scope.pageCount ? (scope.curPage + 1) : scope.pageCount;
                    } else {
                        scope.httpData[KEY.httpCurPage] = num;
                    }
                    that.getData();
                };
                //页面跳转事件
                scope.goClick = function() {
                    if (scope.jumpTo > scope.pageCount)
                        scope.jumpTo = scope.pageCount;
                    scope.httpData[KEY.httpCurPage] = scope.jumpTo;
                    that.getData();
                };

                $compile(that.$gridBottom)(scope);
            },
            close: function(){
                this.scope.$destroy();
                this.$grid.remove();
                console.log('reomve');
            },
            getData: function() {
                var scope = this.scope;
                var that = this;

                scope.http(scope.httpData, function(data) {
                    if (that.opts.resHandler) {
                        scope.data = that.opts.resHandler(data);
                    } else
                        scope.data = data;

                    scope.gridData = scope.data[KEY.list];
                    scope.pageCount = scope.data[KEY.pageCount];
                    scope.curPage = scope.data[KEY.curPage];
                    scope.totalCount = scope.data[KEY.totalCount];
                    that.refreshGrid();
                });
            },
            setData: function(data) {
                var scope = this.scope;
                var that = this;
                scope.data = data;
                scope.gridData = data[KEY.list];
                scope.pageCount = data[KEY.pageCount];
                scope.curPage = data[KEY.curPage];
                scope.totalCount = data[KEY.totalCount];
                that.refreshGrid();
            },
            refresh: function() {
                this.getData();
                this.opts.onSelect && this.opts.onSelect([]);
            },
            //获取选中行
            getSelect: function() {
                var res = [];
                for (var i = 0; i < this.scope.rowSelect.length; i++) {
                    if (this.scope.rowSelect[i] == true)
                        res.push(this.scope.gridData[i]);
                }
                return res;
            },
            //重设http请求及数据
            setHttp: function(http, httpData) {
                this.scope.http = http;
                this.setHttpData(httpData);
            },
            //重设http请求 数据
            setHttpData: function(httpData) {
                this.scope.httpData = angular.copy(httpData);
                this.getData();
            }
        };
        return {
            create: function(opts) {
                return new Grid().create(opts);
            }
        };
    }]
});
