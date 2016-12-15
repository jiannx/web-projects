/*
Bat项目Tree类说明

Attention:
    时刻注意代码的运行顺序：指令编译，html节点获取，对象创建，事件回调，请求回调的先后顺序，一般报错都是因此引起的。（故在此实现了两种创建方式，择情选择）

参数类型
options = {
 name : null,                            //树结构名称，以对象形式创建时不需要填写；以指令形式创建时需要设置，便于js中获取该对象。
 parent : null,                          //父节点名称 '#tree'
 key : '',                               //要显示的节点文本对应对象中的key，字符串。例：{name:'hehe'}，传入参数'name'
 keyLoad : null,                         //节点创建函数 function(nodeData, depth){} 默认为null，即显示以key为属性的文本
 data : null,                            //树结构数据，在不设定http的情况下，需要传入树结构的数据
 childrenKey : 'children',               //子节点属性名，一般默认
 defaultSelect : [0],                    //点击默认选中项，
 firstCallBack : true,                   //创建完是否调用点击事件
 local : {
 isLocal : false,                    //是否进行本地化存储
 localKey : null,                    //本地化存储中的对象的唯一属性，如 'department_id'  当isLocal为true时，该值必填
 id : null                           //该值为存储本地时对应的关键字 当isLocal为true时，该值必填
 },
 http : null,                            //获取数据的request函数
 httpData : null,                        //请求参数
 //根据函数返回值确定当前节点checkbox状态，-1：没有check，0：未勾选的check，1：勾选的check，2：半选check。默认-1
 withCheckbox : function(data, depth){ return -1; },
 afterGetData : null,                    //获得数据后数据处理 function(data){return data};
 afterCreate : null,                     //当树结构创建完成后是否调用点击事件
 onClick : function(data, depth){},      //点击事件
 onCheck : function(selList){}           //checkbox事件, 第一次创建完后会调用一次该事件
}

有两种创建方式
一：
 var departmentTree = batTreeView.create({
    parent : '#departmentTree',
    key : 'department_name',
    http : request.AssetGetDepartmentTree,
    httpData : null,
    onClick : function(data, depth){
    }
 });

 return{
    refresh ：function(isSelectAsBefore, isCallBack)  参数可不传，默认false，true 刷新后选中第一项，且进行回调
        isSelectAsBefore：刷新后是否保存原先选中项，true设置成之前选中项，false设置成选中第一个,0设置不选择；
        isCallBack 设置选中项时是否进行回调
    setHttpData : function(data)  重设httpData请求并且刷新
    setSelectByDepth : function(depth, isCallBack)  根据节点深度设置选中项，参数：深度数组，是否调用点击事件 如果depth为null，则设置树不选中任何一项
    getNodeDomByDepth : function(depth)  根据深度获取节点 参数深度数组 返回dom
    getNodeDataByDepth : function(depth) 根据深度获取节点数据
    hideNodeByDepth : function(depth) 根据节点深度隐藏节点
    showNodeByDepth : function(depth) 根据节点深度显示节点
 }
 调用API 例：
    departmentTree.refresh();
    departmentTree.getNodeDataByDepth([0]);

二：该功能未完全实现(在指令transclude中，因异步加载会出错)
在需要创建tree的html中添加
<tree-view options="treeViewOption"></tree-view>
 treeViewOption，格式等价于上面的参数类型
如需获取该实例
只需调用treeVIew.getInstanceByName(name)
name为treeViewOption中的name属性的值

 */

angular.module('app').provider('neTree', function() {
    var $el = angular.element;
    var defaults = this.defaults = {
        name: null, //树结构名称，以对象形式创建时不需要填写；以指令形式创建时需要设置，便于js中获取该对象。
        parent: null, //父节点名称 '#tree'
        key: '', //要显示的节点文本对应对象中的key，字符串。例：{name:'hehe'}，传入参数'name'
        keyLoad: null, //节点创建函数 function(nodeData, depth){} 默认为null，即显示以key为属性的文本
        data: null, //树结构数据，在不设定http的情况下，需要传入树结构的数据
        childrenKey: 'children', //子节点属性名，一般默认
        defaultSelect: [0], //点击默认选中项，
        firstCallBack: true, //创建完是否调用点击事件
        local: {
            isLocal: false, //是否进行本地化存储
            localKey: null, //本地化存储中的对象的唯一属性，如 'department_id'  当isLocal为true时，该值必填
            id: null //该值为存储本地时对应的关键字 当isLocal为true时，该值必填
        },
        http: null, //获取数据的request函数
        httpData: null, //请求参数
        //根据函数返回值确定当前节点checkbox状态，-1：没有check，0：未勾选的check，1：勾选的check，2：半选check。默认-1
        withCheckbox: function(data, depth) {
            return -1;
        },
        afterGetData: null, //获得数据后数据处理 function(data){return data};
        afterCreate: null, //当树结构创建完成后是否调用点击事件
        onClick: function(data, depth) {}, //点击事件
        onCheck: function(selList) {} //checkbox事件, 第一次创建完后会调用一次该事件
    };

    this.$get = ['$document', '$templateCache', '$compile', '$q', '$http', '$rootScope', '$timeout', '$window', '$controller',
        function($document, $templateCache, $compile, $q, $http, $rootScope, $timeout, $window, $controller) {

            var privateMethods = {
                //option初始化
                createOption: function(opts) {
                    var options = angular.copy(defaults);
                    opts = opts || {};
                    angular.extend(options, opts);
                    return options;
                }
            };

            var nodeClass = "--ui-tree-box-each";
            var IS_OPEN = 'isOpen';


            //传入id号，返回在数组中的深度 TODO
            function StrToArr(str) {
                var arr = (str.split("--"))[0].split("-");
                for (var i in arr) {
                    arr[i] = parseInt(arr[i]);
                }
                return arr;
            }
            //深度转字符串
            function ArrToStr(array) {
                if (array == null)
                    return;
                var str = "";
                for (var i = 0; i < (array.length - 1); i++) {
                    str += array[i] + "-";
                }
                str += array[array.length - 1];
                return str;
            }

            var Tree = function() {};
            //实例集合
            Tree.instances = {};
            //根据实例名称获取Tree实例
            Tree.getInstanceByName = function(name) {
                console.log(name);
                console.log(Tree.instances[name]);
                return Tree.instances[name] || null;
            };

            Tree.prototype = {
                //绑定事件
                on: function(type, handler) {
                    if (typeof this.handlers[type] == "undefined") {
                        this.handlers[type] = [];
                    }
                    this.handlers[type].push(handler);
                    return this
                },
                //调用绑定事件
                fire: function(type, data) {
                    if (this.handlers[type] instanceof Array) {
                        var handlers = this.handlers[type];
                        for (var i = 0; i < handlers.length; i++) {
                            handlers[i](data);
                        }
                    }
                },
                //销毁组件
                destroy: function() {
                    this.boundingBox.off();
                    this.boundingBox.remove();
                },
                create: function(opts) {
                    this.cfg = privateMethods.createOption(opts);
                    this.handlers = {};

                    this._selectDepth = null;

                    this._selectDepth = this.cfg.defaultSelect;
                    this.refresh(true, true);

                    //存入Tree集合中
                    if (this.cfg.name) {
                        Tree.instances[this.cfg.name] = this;
                    }
                    return this;
                },
                refresh: function(isSelectAsBefore, isCallBack) {
                    var that = this;
                    that.handlers = {};
                    //默认进行回调
                    if (angular.isDefined(isCallBack) == false)
                        isCallBack = true;

                    if (this.cfg.http != null) {
                        this.cfg.http(this.cfg.httpData, function(data) {

                            if (that.cfg.afterGetData)
                                that.cfg.data = that.cfg.afterGetData(data);
                            else
                                that.cfg.data = data;

                            if (angular.isDefined(that.boundingBox))
                                that.boundingBox.empty();
                            else {
                                that.boundingBox = $("<ul class='ui-tree'></ul>");
                                $(that.cfg.parent).append(that.boundingBox);
                            }

                            that._add(that.cfg.data);
                            that.syncUI();
                            that.bindUI();

                            //设置原来选中项
                            if (isSelectAsBefore == true) {
                                that.setSelectByDepth(that._selectDepth, isCallBack);
                            }
                            //设置默认选中第一项
                            if (isSelectAsBefore == false) {
                                that.setSelectByDepth([0], isCallBack);
                            }
                            //设置默认不选中
                            if (isSelectAsBefore == 0) {
                                that.setSelectByDepth(null, isCallBack);
                            }

                            that.updateCheckStatus();
                            that.cfg.onCheck && that.cfg.onCheck(that.getAllCheck());
                            that.cfg.afterCreate && that.cfg.afterCreate.call(that);
                        });
                    } else if (this.cfg.data) {

                        if (that.cfg.afterGetData)
                            that.cfg.data = that.cfg.afterGetData(that.cfg.data);

                        if (angular.isDefined(that.boundingBox))
                            that.boundingBox.empty();
                        else {
                            that.boundingBox = $("<ul class='ui-tree'></ul>");
                            $(that.cfg.parent).append(that.boundingBox);
                        }

                        that._add(that.cfg.data);
                        that.syncUI();
                        that.bindUI();

                        if (isSelectAsBefore == true) {
                            that.setSelectByDepth(that._selectDepth, isCallBack);
                        }
                        //设置默认选中第一项
                        else {
                            that.setSelectByDepth([0], isCallBack);
                        }

                        that.cfg.afterCreate && that.cfg.afterCreate.call(that);
                    }
                },
                syncUI: function() {
                    //当没有子节点时，不显示折叠图标
                    var $eachs = this.boundingBox.find("li.ui-tree-node");
                    for (var i = 0; i < $eachs.length; i++) {
                        if ($eachs.eq(i).children('ul.ui-tree-children').children("li.ui-tree-node").length == 0) {
                            $eachs.eq(i).addClass("ui-tree-node-no-children");
                            $eachs.eq(i).children('.ui-tree-icon').empty().append('<div class="circle"></div>');
                        }
                    }

                    for (var i = 0; i < $eachs.length; i++) {
                        var p = $eachs.eq(i).parent().parent();
                        if (p.next('li.ui-tree-node').length > 0)
                            $eachs.eq(i).addClass("with-left-line");
                    }
                },
                bindUI: function() {
                    //共四种样式 ：ui-tree-box-each-close(折叠样式)，ui-tree-box-each-hide(隐藏样式)
                    var that = this;
                    //点击选中行 并进行点击事件的调用
                    this.boundingBox.find(".ui-tree-node-text").click(function(event) {
                        that.fire("click", { value: $(this).parent().attr("id"), isCallBack: true });

                        //阻止冒泡事件不再往下层传递
                        if (event.stopPropagation)
                            event.stopPropagation();
                        else
                            event.cancelBubble = true;
                    });

                    //点击折叠按钮，进行折叠或展开
                    this.boundingBox.find(".ui-tree-icon").click(function(event) {
                        that.fire("show", $(this).parent().attr("id"));
                    });

                    //checkbox点击事件不向下传递
                    this.boundingBox.find("input.ui-tree-checkbox").on('click', function(event) {
                        if (event.stopPropagation)
                            event.stopPropagation();
                        else
                            event.cancelBubble = true;
                    });

                    function nodeGetCheckBox(obj) {
                        return obj.children('.ui-tree-node-text').find('input.ui-tree-checkbox');
                    }

                    function setCheck(checkNode) {
                        //获取该checkbox的节点
                        var $node = checkNode.parent().parent();
                        var $parentNode = $node.parent().parent();
                        var h = 0;
                        //设置子节点状态为当前节点状态
                        $node.find('input.ui-tree-checkbox').prop("checked", checkNode[0].checked);
                        //设置父节点状态，如果当前兄弟节点全选，设置父节点选中，且递归上一层父节点
                        $node.siblings().each(function() {
                            h += nodeGetCheckBox($(this))[0].checked;
                        });
                        h += nodeGetCheckBox($node)[0].checked;
                        var $parentInput = nodeGetCheckBox($parentNode);
                        if ($node.siblings().length + 1 == h && $parentInput.length > 0) {
                            $parentInput.prop("checked", true);
                            setCheck($parentInput);
                        } else {
                            nodeGetCheckBox($node.parents()).prop("checked", false);
                        }
                    }
                    //checkbox事件
                    this.boundingBox.find("input.ui-tree-checkbox").on('change', function(event) {
                        //设置选中状态
                        setCheck($(this));

                        that.updateCheckStatus();
                        that.cfg.onCheck && that.cfg.onCheck(that.getAllCheck());
                    });

                    this.on("show", function(str) {
                        //str为数据的id
                        var pp = that.boundingBox.find("#" + str);
                        var array = StrToArr(str);
                        var data = that.getNodeDataByDepth(array);

                        if (!pp.hasClass("ui-tree-node-no-children") && pp.hasClass("ui-tree-node-close") == true) {
                            pp.removeClass("ui-tree-node-close").addClass("ui-tree-node-open");
                            pp.children("ul.ui-tree-children").slideDown(300);
                            data[IS_OPEN] = true;
                        } else {
                            pp.removeClass("ui-tree-node-open").addClass("ui-tree-node-close");
                            pp.children("ul.ui-tree-children").slideUp(300);
                            data[IS_OPEN] = false;
                        }

                        //本地化存储数据
                        if (that.cfg.local.isLocal == true && that.cfg.local.id != null) {
                            localStorage.setItem(that.cfg.local.id, JSON.stringify(that.cfg.data));
                        }
                    });
                    //click事件，参数可以有两种，一种为深度数组[1,2,3], 还有一种为div的id 1-2-3--ui-tree-box-each
                    this.on("click", function(data) {
                        var id = data.value;
                        var arr = data.value;
                        if (typeof data.value == "string") {
                            arr = StrToArr(data.value);
                        } else {
                            id = ArrToStr(data.value) + nodeClass;
                        }
                        //移除所有行的选中样式，向点击的行上添加选中效果
                        that.boundingBox.find("li.ui-tree-node").removeClass("ui-tree-node-sel");
                        that.boundingBox.find("#" + id).addClass("ui-tree-node-sel");

                        that._selectDepth = arr;

                        //调用点击事件
                        if (data.isCallBack == true && that.cfg.onClick && arr != null) {
                            that.cfg.onClick(that.getNodeDataByDepth(arr), arr);
                        }
                    })
                },
                //获取本地存储的树结构数据，并且转化为数组形式
                getLocalData: function() {

                    var data = null;
                    try {
                        data = eval("(" + localStorage.getItem(this.cfg.local.id) + ')');
                    } catch (e) {
                        return [];
                    }
                    //var data = eval("(" + localStorage.getItem(this.cfg.local.id) + ')');
                    //首次获取为空的情况下返回空数组
                    if (data == '' || data == null) {
                        return [];
                    }
                    var array = [];
                    var that = this;

                    function di(d) {
                        for (var i in d) {
                            array.push(d[i]);
                            if (d[i][that.cfg.childrenKey].length > 0)
                                di(d[i][that.cfg.childrenKey]);
                        }
                    }
                    di(data);
                    return array;
                },
                //重设httpData请求并且刷新
                setHttpData: function(data) {
                    this.cfg.httpData = data;
                    this.refresh();
                },
                //根据节点深度设置选中项，参数：深度数组，是否调用点击事件
                setSelectByDepth: function(depth, isCallBack) {
                    if (isCallBack == null)
                        isCallBack = true;
                    this.fire("click", { value: depth, isCallBack: isCallBack })
                },
                //根据深度获取节点数据 参数深度数组 返回dom
                getNodeDomByDepth: function(depth) {
                    return this.boundingBox.find("#" + ArrToStr(depth) + nodeClass);
                },
                //根据深度获取节点数据
                getNodeDataByDepth: function(depth) {
                    var d;
                    var index = 0;
                    var key = this.cfg.childrenKey;

                    function get(data) {
                        d = data[depth[index]];
                        index++;
                        if (index == depth.length)
                            return d;
                        else
                            get(d[key]);
                    }
                    get(this.cfg.data);
                    return d;
                },
                //更新节点节点状态（半选状态）
                updateCheckStatus: function() {
                    var that = this;

                    function nodeGetCheckBox(obj) {
                        return obj.children('.ui-tree-node-text').find('input.ui-tree-checkbox');
                    }
                    var $nodes = that.boundingBox.find('li.ui-tree-node');

                    $nodes.each(function() {
                        if (nodeGetCheckBox($(this)).length > 0 && nodeGetCheckBox($(this))[0].checked == true) {
                            $(this).find('input.ui-tree-checkbox').prop("checked", true);
                        }
                    });
                    $nodes.each(function() {
                        var checkSum = 0;
                        var $node = nodeGetCheckBox($(this));
                        if ($node.length == 0)
                            return;
                        $(this).siblings().each(function() {
                            checkSum += nodeGetCheckBox($(this))[0].checked;
                        });
                        checkSum += $node[0].checked;
                        var $p = nodeGetCheckBox($(this).parent().parent());
                        //设置check半选状态
                        $p.prop("indeterminate", ($(this).siblings().length + 1) > checkSum && checkSum > 0);
                        //最后一层节点不存在半选状态
                        if ($node.find('li.ui-tree-node').length == 0) {
                            $node.prop("indeterminate", false);
                        }
                    });
                },
                //获取checkbox选中的列表
                getAllCheck: function() {
                    var that = this;
                    var selList = [];
                    var $nodes = that.boundingBox.find('li.ui-tree-node');

                    $nodes.each(function() {
                        var $node = $(this).children('.ui-tree-node-text').find('input.ui-tree-checkbox');
                        if ($node.length > 0 && $node[0].checked) {
                            var depth = that.idToDepth($(this).attr("id"));
                            var data = that.getNodeDataByDepth(depth);
                            selList.push(data);
                        }
                    });
                    return selList;
                },
                //根据节点深度隐藏节点
                hideNodeByDepth: function(depth) {
                    var node = this.getNodeDomByDepth(depth);
                    node.css({ "width": "0px", "height": "0px", "overflow": "hidden" });
                },
                //根据节点深度显示节点
                showNodeByDepth: function(depth) {
                    var node = this.getNodeDomByDepth(depth);
                    node.css({ "width": "auto", "height": "auto", "overflow": "visible" });
                },
                //根据id获取深度
                idToDepth: function(id) {
                    return StrToArr(id);
                },
                _add: function(data) {
                    var that = this;
                    //this.boundingBox.empty();
                    //dimensions的长度即为当前数据的在数组中的深度 该深度数组将作为div的id号添加到boundingBox中
                    var dimensions = [];
                    //获取本地数据
                    var localData = this.getLocalData();
                    var local = that.cfg.local;

                    function di(obj) {
                        dimensions.push(-1);
                        for (var i in obj) {
                            dimensions[dimensions.length - 1]++;
                            //获取当前数据的父节点的id号（id为数据在数组中的深度）（得出数据：3-4-5-）
                            var fatherId = '';
                            for (var k = 0; k < dimensions.length - 1; k++) {
                                fatherId = fatherId + dimensions[k] + "-";
                            }
                            //拼接得出当前数据的id （得出数据如 3-4-5-1）
                            var selfId = fatherId + dimensions[dimensions.length - 1];
                            //Log("father Id : " + fatherId + " " + "selfId:" + selfId);

                            var $data = $("<li class='ui-tree-node' id='" + selfId + nodeClass + "'>" +
                                '<div class="ui-tree-icon"><i class="fa fa-chevron-circle-right right"></i>' +
                                '<i class="fa fa-chevron-circle-down down"></i></div>' +
                                "<div class='ui-tree-node-text'></div>" +
                                "<ul class='ui-tree-children'></ul>" +
                                "</div>");

                            //如果做了本地化存储，则获取本地存储中的数据
                            if (local.isLocal == true && local.id != null) {
                                for (var k in localData) {
                                    if (localData[k][local.localKey] == obj[i][local.localKey]) {
                                        obj[i][IS_OPEN] = localData[k][IS_OPEN];
                                        break;
                                    }
                                }
                            }
                            //如果本地数据中未存在该数据，则对数据初始化为展开
                            if (angular.isDefined(obj[i][IS_OPEN]) == false)
                                obj[i][IS_OPEN] = true;
                            var isOpen = obj[i][IS_OPEN];
                            if (isOpen == false) {
                                //$data.addClass('ui-tree-node-close').find('ul.ui-tree-children').css('display', 'none');
                                $data.addClass('ui-tree-node-close').find('ul.ui-tree-children').css('display', 'none');
                            } else {
                                $data.addClass('ui-tree-node-open');
                            }

                            //创建节点数据
                            var text = null;
                            var depth = StrToArr(selfId);
                            if (that.cfg.keyLoad != null) {
                                text = that.cfg.keyLoad(obj[i], depth);
                                $data.find('.ui-tree-node-text').append(text);
                            } else if (that.cfg.key != null) {
                                text = obj[i][that.cfg.key];
                                var isCheck = that.cfg.withCheckbox(obj[i], depth);

                                if (isCheck == -1) {
                                    $data.find('.ui-tree-node-text').append('<span class="text">' + text + '</span>');
                                } else if (isCheck == 0) {
                                    $data.find('.ui-tree-node-text').append('<input type="checkbox" class="ui-tree-checkbox"><span class="text">' + text + '</span>');
                                } else if (isCheck == 1) {
                                    $data.find('.ui-tree-node-text').append('<input type="checkbox" class="ui-tree-checkbox" checked="checked"><span class="text">' + text + '</span>');
                                } else if (isCheck == 2) {
                                    $data.find('.ui-tree-node-text').append('<input type="checkbox" class="ui-tree-checkbox"><span class="text">' + text + '</span>');
                                    $data.find('.ui-tree-node-text input').prop("indeterminate", true);
                                }
                            } else {
                                text = obj[i];
                                $data.find('.ui-tree-node-text').append(text);
                            }


                            //创建第一层数据时，直接添加到boundingBox中，否则添加到上一层父节点中
                            if (dimensions.length == 1) {
                                that.boundingBox.append($data);
                            } else {
                                //父节点的id数据重新处理，删除fatherId最后的“-”符号
                                fatherId = fatherId.substr(0, fatherId.length - 1);
                                that.boundingBox.find("#" + fatherId + "--ui-tree-box-each").children('ul.ui-tree-children').append($data);
                            }
                            //存在子节点时递归遍历
                            if (obj[i][that.cfg.childrenKey] && obj[i][that.cfg.childrenKey].length != 0) {
                                di(obj[i][that.cfg.childrenKey]);
                            }
                            ////当遍历完当前数组时，向上跳一层 即深度减一
                            if ((parseInt(i) + 1) == obj.length) {
                                dimensions.pop();
                            }
                        }
                    }
                    di(data);
                }
            };

            return {
                create: function(opts) {
                    return new Tree().create(opts);
                },
                getInstanceByName: function(name) {
                    return Tree.getInstanceByName(name);
                }
            };
        }
    ]
});

angular.module('app').directive('treeView', function() {
    return {
        restrict: "AE",
        replace: true,
        scope: {
            options: '='
        },
        controller: function($scope, $attrs, batTreeView) {
            var options2 = $scope.options;
            var s = batTreeView.create(options2);
            //当数据刷新时，进行界面的刷新 TODO 待测试
            $scope.$watch('options', function(newValue, oldValue) {
                if (newValue != oldValue) {
                    //s.refresh();
                }
            }, true);
        },
        link: function(scope, element, attrs) {}
    }
});
