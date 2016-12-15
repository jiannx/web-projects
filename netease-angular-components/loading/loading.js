angular.module('app').service('uiloading', function($rootScope, $state, $stateParams) {
    var that = this;
    this.loadingLayer = angular.element('<div class="ui-loading"><div class="spinner"><div class="rect1"></div><div class="rect2"></div><div class="rect3"></div><div class="rect4"></div><div class="rect5"></div></div></div>');
    angular.element('body').append(that.loadingLayer);
    this.loadingCount = 0;
    that.loadingLayer.hide();
    this.show = function() {
        that.loadingCount++;
        that.loadingLayer.show();
    };
    this.hide = function() {
        that.loadingCount--;
        that.loadingCount = (that.loadingCount < 0) ? 0 : that.loadingCount;
        if(that.loadingCount == 0){
        	that.loadingLayer.hide();
        }
    };
});
