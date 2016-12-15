'use strict';

/*时间日期选择控件

 JQ插件地址 ：http://www.bootcss.com/p/bootstrap-datetimepicker/
 <input type="text" date-picker="day">日期选择
 <input type="text" date-picker="time">日期时间选择

 设置日期开始时间
 <input type="text" date-picker="time" date-picker-start-date="datePickerStart" >;  $scope.datePickerStart = '2015-10-11';
 设置日期结束时间时间
 <input type="text" date-picker="time" date-picker-end-date="datePickerEnd" >;  $scope.datePickerEnd = '2015-10-30';
 更多配置
 <input type="text" date-picker="time" date-picker-config="{minuteStep : 10, todayBtn : true}">;(选项详见JQ插件网站)
 demo：
 <input type="text" ng-model="editEmpower.end_time" readonly date-picker="time"
 date-picker-start-date="datePickerStart" date-picker-end-date="datePickerEnd">
 */
angular.module('app').directive('datePicker', ['$filter', function($filter) {
    return {
        restrict: 'A',
        scope: {
            datePicker: '@',
            datePickerStartDate: '=',
            datePickerEndDate: '=',
            datePickerConfig: '@'
        },
        link: function(scope, elm, attrs, ctrl) {
            var config = {
                language: 'zh-CN',
                format: 'yyyy-mm-dd hh:ii',
                autoclose: true,
                fontAwesome: true
            };

            //时间选择和日期选择 默认时间选择
            if (angular.isDefined(scope.datePicker) && scope.datePicker == 'day') {
                config.format = 'yyyy-mm-dd';
                config.minView = 'month';
            } else {
                config.format = 'yyyy-mm-dd hh:ii';
                config.minView = 'hour';
            }
            //更多配置
            if (angular.isDefined(scope.datePickerConfig)) {
                var moreCfg = eval('(' + scope.datePickerConfig + ')');
                for (var i in moreCfg) {
                    config[i] = moreCfg[i];
                }
            }
            elm.datetimepicker(config);

            //设置日历开始时间
            if (angular.isDefined(scope.datePickerStartDate)) {
                scope.$watch('datePickerStartDate', function() {
                    elm.datetimepicker('setStartDate', scope.datePickerStartDate);
                })
            }
            //设置日历结束时间
            if (angular.isDefined(scope.datePickerEndDate)) {
                scope.$watch('datePickerEndDate', function() {
                    elm.datetimepicker('setEndDate', scope.datePickerEndDate);
                })
            }

        }
    };
}]);
