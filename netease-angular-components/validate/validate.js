'use strict';

angular.module('app').directive("uiValidate", ['error',
    function(error) {
        return {
            link: function(scope, elm, attrs) {
                //获取表单数据 表单name值不能为空
                var formName = attrs.name || '';

                //气泡提示框默认规则
                var rule = {
                    'url': '108',
                    'email': '109',
                    'number': '110',
                    'min': '101',
                    'max': '102',
                    'minlength': '103',
                    'maxlength': '104',
                    'required': '105',
                    'pattern': '106',
                    'romoteuniquecheck': '107',
                    'pwmatch': '156'
                };

                //对input添加气泡提示
                function addErrShow(obj) {
                    var errorPosition = obj.attr('error-show') || 'top';
                    var errorRule = obj.attr('error-show-rule') || '';
                    var inputModel = angular.element(obj).controller('ngModel');
                    var errorText = '';

                    if (errorRule != '') {
                        errorRule = eval("(" + errorRule + ')');
                        errorRule = angular.extend(rule, errorRule);
                    } else
                        errorRule = rule;

                    //生成错误提示信息
                    for (var k in errorRule) {
                        if (angular.isDefined(inputModel.$error[k]) && inputModel.$error[k] == true) {
                            errorText = error.code[errorRule[k]];
                            break;
                        }
                    }

                    var $parent = obj.parent();
                    var $error = $('<div class="ui-error">' + errorText + '</div>');
                    var offset = obj.offset();
                    var offset2 = $parent.offset();
                    $parent.append($error);
                    var eSize = {
                        w: obj.width() + parseInt(obj.css('padding-left'))+ parseInt(obj.css('padding-right')),
                        h: obj.height() + parseInt(obj.css('padding-top'))+ parseInt(obj.css('padding-bottom'))
                    };
                    if (errorPosition == 'top') {
                        $error.addClass('top');
                        $error.css({
                            'left': offset.left - offset2.left + 'px',
                            'top': offset.top - offset2.top - 26 + 'px'
                        });
                    } else if (errorPosition == 'right') {
                        $error.addClass('right');
                        $error.css({
                            'left': offset.left - offset2.left + eSize.w + 8 + 'px',
                            'top': 3 + 'px'
                        });
                    } else if (errorPosition == 'bottom') {
                        $error.addClass('bottom');
                        $error.css({
                            'left': offset.left - offset2.left + 'px',
                            'top': offset.top - offset2.top + eSize.h + 8 + 'px'
                        });
                    }
                    $error.fadeIn(300);
                }


                //确认弹窗页面将调用该函数
                scope._bat_validate = function(_formObj) {

                    _formObj = _formObj || elm;

                    //移除所有冒泡
                    _formObj.find('.ui-error').remove();
                    var isAddErrorShow = false;

                    //遍历每个input框
                    _formObj.find('input,textarea,select').each(function() {
                        //先移除每个红框样式
                        $(this).removeClass('bat-invalid');

                        //验证不通过的input
                        if ($(this).hasClass('ng-invalid') == true) {
                            if ($(this).attr('disabled') == 'disabled') {
                                return;
                            }
                            //如果为第一个验证未通过的input框，则添加提示框 弹出提示框的位置及规则根据当前元素的 error-show,error-show-rule来设置
                            if (isAddErrorShow == false) {
                                isAddErrorShow = true;
                                addErrShow($(this));
                            }
                            $(this).addClass('bat-invalid');
                        }
                    });

                    return !isAddErrorShow;
                };

                function addInputEvent() {
                    //遍历每个input框
                    elm.find('input,textarea,select').each(function() {
                        //获得焦点时事件
                        $(this).focus(function() {
                            $(this).removeClass('bat-invalid');
                            $(this).parent().find('.ui-error').remove();
                        });
                        $(this).blur(function() {
                            if ($(this).hasClass('ng-invalid') == true) {
                                elm.find('.ui-error').remove();
                                $(this).addClass('bat-invalid');
                                addErrShow($(this));
                            }
                        });
                        //去除disable元素的报错提示
                        $(this).change(function() {
                            $('input:disabled').each(function() {
                                $(this).removeClass('bat-invalid');
                                $(this).parent().find('.ui-error').remove();
                            })
                        });
                    })
                }
                addInputEvent();

                elm.on('click', function() {
                    addInputEvent();
                });
            }
        };
    }
]);

// <div>
//     <form name="domainForm" ui-validate>
//         <div class="form-group">
//             <label for="name" >域名:</label>
//             <div class="col-xs-9">
//                 <input type="text" class="form-control" name="name" ng-model='name' required error-show="bottom">
//             </div>
//         </div>
//     </form>
// </div>
