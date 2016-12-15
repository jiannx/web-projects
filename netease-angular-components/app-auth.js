//errorCode定义
angular.module('app').service('appAuth', function($rootScope, $cookies, $state, request) {

    //router:url中需要匹配的关键字，key:与后台对接对应的关键字，auth3Init:具体模块的权限获取，每个模块都单独处理
    var modelList = [
        { router: 'clouddns.dispatch', key: 'clouddns_dispatch', req: 'clouddns_dispatch',  auth3Init: clouddnsAuth3 },
        { router: 'clouddns.domain', key: 'clouddns_domain', req: 'clouddns_domain', auth3Init: null },
        { router: 'auth', key: 'auth', req: 'auth',  auth3Init: null },
        { router: 'akamai', key: 'akamai', req: 'akamai', auth3Init: null },
        { router: 'internal', key: 'cdn_auth', req: 'cdn_yfcache,cdn_chinacache,cdn_chinanetcenter,cdn_dnion,cdn_fastweb', auth3Init: null },
    ];

    //大模块权限 
    $rootScope.auth1 = {
        clouddns: true,
        auth: false,
        akamai: false
    };
    //具体模块权限
    $rootScope.auth2 = {
        // clouddns: {
        //     add_clouddns_dispatch_domain: false,
        // },
        // auth: {
        //     manage_auth: false
        // }
    };
    //具体模块内某个域名的具体权限 只保留当前页面的权限，页面切换，实时刷新
    $rootScope.auth3 = {
        // 134: {
        //     control_clouddns_policy: false,
        //     add_clouddns_dispatch_domain: false,
        // },
    };

    function clouddnsAuth3(modelData, toState, toParams) {
        if (toParams.id) {
            request.authModel({
                model: modelData.key,
                domain_id: toParams.id
            }, function(res) {
                var key = 'clouddns_domain_id_' + toParams.id;
                $rootScope.auth3 = {}; //只保留单个数据
                $rootScope.auth3[toParams.id] = {};
                for (var i in res['data']) {
                    $rootScope.auth3[toParams.id][res['data'][i]] = true;
                }
                $cookies.putObject('auth3', $rootScope.auth3);
            });
        }
    }


    this.set = function(toState, toParams) {
        request.authModel(null, function(res) {
            $rootScope.auth1 = {};
            for (var i in res['data']) {
                $rootScope.auth1[res['data'][i]] = true;
            }
            $cookies.putObject('auth1', $rootScope.auth1);
            //所在页面没有权限访问的情况下进行跳转
            if (res['data'].length == 0) {
                $state.go('no-permission');
            }
            //当前页面没有权限的情况下跳转
            for (var i in modelList) {
                //一些页面直接忽略
                if(modelList[i]['router'] == 'internal')
                    continue;
                if (toState.name.indexOf(modelList[i]['router']) != -1 && !$rootScope.auth1[modelList[i]['key']]) {
                    $state.go('no-permission');
                    break;
                }
            }
        });

        for (var i in modelList) {
            if (toState.name.indexOf(modelList[i]['router']) != -1) {
                var modelData = angular.copy(modelList[i]);
                request.authModel({
                    model: modelData.req,
                }, function(res) {
                    $rootScope.auth2[modelData.key] = {};
                    for (var i in res['data']) {
                        $rootScope.auth2[modelData.key][res['data'][i]] = true;
                    }
                    $cookies.putObject('auth2', $rootScope.auth2);
                });
                modelData.auth3Init && modelData.auth3Init(modelData, toState, toParams);
                break;
            }
        }
    }

    function authClear() {
        $cookies.remove('auth1');
        $cookies.remove('auth2');
        $cookies.remove('auth3');
    }
    angular.extend($rootScope.auth1, $cookies.getObject('auth1') || {});
    angular.extend($rootScope.auth2, $cookies.getObject('auth2') || {});
    angular.extend($rootScope.auth3, $cookies.getObject('auth3') || {});
});
