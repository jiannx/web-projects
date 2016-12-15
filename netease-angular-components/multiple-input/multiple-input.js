'use strict';

angular.module('app').directive('multipleInput', [function() {
    return {
        require: 'ngModel',
        restrict: 'A',
        link: function(scope, elm, attrs, ngModel) {
            
        }
    };
}]);