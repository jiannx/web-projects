'use strict';

angular.module('app').controller('appCtrl', function($scope, $rootScope, $state, $stateParams, request, $cookies, appAuth) {

    //用户信息配置
    $scope.userInfo = {
        name: $cookies.get('user_name')
    };
    //login out
    $scope.loginOut = function() {
        window.location.href = '/auth/logout?t=' + new Date().getTime();
    };

    //路由切换事件
    $rootScope.$on('$stateChangeStart', function(event, toState, toParams, fromState, fromParams) {
        console.log(toState);
        //权限管理
        appAuth.set(toState, toParams, fromState, fromParams);
        //判定当前在哪个模块
        var MODELS = ['home', 'service', 'dispatch', 'stats', 'monitor', 'purge'];
        for (var i in MODELS) {
            if (toState.name.indexOf(MODELS[i]) != -1) {
                $rootScope.pageName = MODELS[i];
                break;
            }
        }
    });
    $rootScope.Reg = {
        domain: /^(?=^.{3,255}$)[a-zA-Z0-9][-a-zA-Z0-9]{0,62}(\.[a-zA-Z0-9][-a-zA-Z0-9]{0,62})+$/,
        url: /(http|ftp|https):\/\/[\w\-_]+(\.[\w\-_]+)+([\w\-\.,@?^=%&amp;:/~\+#]*[\w\-\@?^=%&amp;/~\+#])?/,
        email: /^[a-z0-9]+([._\\-]*[a-z0-9])*@([a-z0-9]+[-a-z0-9]*[a-z0-9]+.){1,63}[a-z0-9]+$/,
        ip: /^(25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[0-9]{1,2})(\.(25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[0-9]{1,2})){3}$/,
        noNegativeInt: /^\d+$/, //非负整数
    };
});

