// request.getName(data, callback, errCallback, isShowLoading)

angular.module('app').service('request', function($http, $state, $stateParams, $cookies, uiloading, uidialog) {

    var isProd = false;

    // var API_HOST = 'http://10.240.35.94:8000';
    // var API_HOST2 = 'http://10.240.35.94:8000';

    // var API_HOST = 'http://10.240.35.87:8120';
    // var API_HOST2 = 'http://10.240.35.87:8120';

    // var API_HOST = 'http://127.0.0.1:8000';
    // var API_HOST2 = 'http://127.0.0.1:8000';


    var API_HOST = '';
    var API_HOST2 = '';
    isProd = true;

    var that = this;
    //接口定义
    this._urls = {

        'dispatchDomainGetList': { method: 'get', url: '/api/clouddns/dispatch/domain/list' }, //调度域名列表
        'dispatchDomainAdd': { method: 'post', url: '/api/clouddns/dispatch/domain/add' }, //调度域名新增
        'dispatchDomainDel': { method: 'post', url: '/api/clouddns/dispatch/domain/delete' }, //调度域名删除
        'dispatchDomainEdit': { method: 'post', url: '/api/clouddns/dispatch/domain/remark/update' }, //域名编辑备注


        'cloudDomainAdd': { method: 'post', url: '/api/clouddns/domain/add' }, //域名添加
        'cloudDomainDel': { method: 'post', url: '/api/clouddns/domain/delete' }, //域名删除
        'cloudDomainList': { method: 'get', url: '/api/clouddns/domain/list' }, //域名列表
        'cloudDomainBindGroup': { method: 'post', url: '/api/clouddns/domain/update' }, //修改域名分组
        'cloudDomainGroupList': { method: 'get', url: '/api/clouddns/domain/group/list' }, //域名组列表
        'cloudDomainGroupAdd': { method: 'post', url: '/api/clouddns/domain/group/add' }, //域名组添加
        'cloudDomainGroupUpdate': { method: 'post', url: '/api/clouddns/domain/group/update' }, //域名组编辑
        'cloudDomainGroupDel': { method: 'post', url: '/api/clouddns/domain/group/delete' }, //域名组编辑

        'cloudDomainRecordAdd': { method: 'post', url: '/api/clouddns/domain/record/add' },
        'cloudDomainRecordUpdate': { method: 'post', url: '/api/clouddns/domain/record/update' },
        'cloudDomainRecordDel': { method: 'post', url: '/api/clouddns/domain/record/delete' },
        'cloudDomainRecordList': { method: 'get', url: '/api/clouddns/domain/record/list' },


        'policyGetList': { method: 'get', url: '/api/clouddns/dispatch/policy/list' }, //调度策略列表
        'policyAdd': { method: 'post', url: '/api/clouddns/dispatch/policy/add' }, //调度策略新增
        'policyViewGetList': { method: 'get', url: '/api/clouddns/dispatch/view/list' }, //获取线路信息
        'policyUpdate': { method: 'post', url: '/api/clouddns/dispatch/policy/update' }, //调度策略更新
        'policyDel': { method: 'post', url: '/api/clouddns/dispatch/policy/delete' }, //调度策略删除
        'policyDetail': { method: 'get', url: '/api/clouddns/dispatch/policy/detail' }, //调度策略详情
        'policyControl': { method: 'post', url: '/api/clouddns/dispatch/policy/control' }, //调度策略操作
        'monitorNodeList': { method: 'get', url: '/api/clouddns/dispatch/monitor_node/list ' }, //监控节点的信息

        'viewTemplateList': { method: 'get', url: '/api/clouddns/dispatch/view/template/list' }, //策略线路列表
        'viewTemplateAdd': { method: 'post', url: '/api/clouddns/dispatch/view/template/add' }, //策略线路添加
        'viewTemplateDetail': { method: 'get', url: '/api/clouddns/dispatch/view/template/detail' }, //策略线路详情
        'viewTemplateUpdate': { method: 'post', url: '/api/clouddns/dispatch/view/template/update' }, //策略线路更新
        'viewTemplateDelete': { method: 'post', url: '/api/clouddns/dispatch/view/template/delete' }, //策略线路删除

        'policyTemplateList': { method: 'get', url: '/api/clouddns/dispatch/policy/template/list' }, ////策略模板列表
        'policyTemplateAdd': { method: 'post', url: '/api/clouddns/dispatch/policy/template/add' }, //策略模板添加
        'policyTemplateDetail': { method: 'get', url: '/api/clouddns/dispatch/policy/template/detail' }, //策略模板删除
        'policyTemplateUpdate': { method: 'post', url: '/api/clouddns/dispatch/policy/template/update' }, //策略模板更新
        'policyTemplateDelete': { method: 'post', url: '/api/clouddns/dispatch/policy/template/delete' }, //策略模板删除

        'policyAuthList': { method: 'get', url: '/api/clouddns/dispatch/auth/list' }, //域名权限列表
        'policyAuthAdd': { method: 'post', url: '/api/clouddns/dispatch/auth/update' }, //域名权限添加
        'policyAuthUpdate': { method: 'post', url: '/api/clouddns/dispatch/auth/update' }, //域名权限更新
        'policyAuthDel': { method: 'post', url: '/api/clouddns/dispatch/auth/delete' }, //域名权限删除

        'authPermissionList': { method: 'get', url: '/auth/permission/list' }, //获取权限列表
        'authUserList': { method: 'get', url: '/auth/user/list' }, //获取用户列表
        'authUserAdd': { method: 'post', url: '/auth/user/add' }, //用户添加
        'authUserUpdate': { method: 'post', url: '/auth/user/permission/update' }, //用户更新
        'authUserDel': { method: 'post', url: '/auth/user/delete' }, //用户删除
        'authUserGetDetail': { method: 'get', url: '/auth/user/detail' },

        'authGroupList': { method: 'get', url: '/auth/group/list' }, //获取组列表
        'authGroupAdd': { method: 'post', url: '/auth/group/permission/add' },
        'authGroupUpdate': { method: 'post', url: '/auth/group/permission/update' },
        'authGroupDel': { method: 'post', url: '/auth/group/permission/delete' },
        'authGroupGetDetail': { method: 'get', url: '/auth/group/permission/detail' },

        //akamai
        'akamaiCcuAdd': { method: 'post', url: '/api/akamai/ccu/queues/add' }, //添加发布
        'akamaiCcuGetDetail': { method: 'get', url: '/api/akamai/ccu/queues/detail' }, //发布获取详情
        'akamaiCcuList': { method: 'get', url: '/api/akamai/ccu/queues/list' }, //发布列表
        'akamaiCcuLength': { method: 'get', url: '/api/akamai/ccu/queues/length' }, //发布队列长度

        'akamaiProductList': { method: 'get', url: '/api/akamai/product/list' }, //产品列表
        'akamaiContractList': { method: 'get', url: '/api/akamai/contract/list' }, //合同列表
        'akamaiGroupList': { method: 'get', url: '/api/akamai/group/list' }, //组列表
        'akamaiDomainSuffixList': { method: 'get', url: '/api/akamai/domain/suffix/list' }, //域名后缀列表
        'akamaiIpVerList': { method: 'get', url: '/api/akamai/ip/version/behavior/list' }, //ip版本列表


        'akamaiPropertyAdd': { method: 'post', url: '/api/akamai/property/add' }, //添加配置
        'akamaiPropertyList': { method: 'get', url: '/api/akamai/property/list' }, //配置列表
        'akamaiPropertyDetail': { method: 'get', url: '/api/akamai/property/detail' }, //配置详情
        'akamaiPropertyVersionList': { method: 'get', url: '/api/akamai/property/version/list' }, //配置 版本列表
        'akamaiPropertyVersionDetail': { method: 'get', url: '/api/akamai/property/version/detail' }, //配置 版本详情
        'akamaiPropertyVersionAdd': { method: 'post', url: '/api/akamai/property/version/add' }, //配置 版本添加
        'akamaiPropertyVersionEdit': { method: 'post', url: '/api/akamai/property/version/update' }, //配置 版本编辑
        'akamaiPropertyVersionHostList': { method: 'get', url: '/api/akamai/property/version/hostname/list' }, //配置 版本添加
        'akamaipropertyRuleTree': { method: 'get', url: '/api/akamai/property/version/rule/tree/list' }, //配置 获取规则配置表
        'akamaipropertyRuleDetail': { method: 'get', url: '/api/akamai/property/version/rule/detail' }, //规则详情
        'akamaipropertyVersionActivation': { method: 'post', url: '/api/akamai/property/activation/add' }, //激活


        'akamaiCpcodeAdd': { method: 'post', url: '/api/akamai/cpcode/add' }, //cp添加
        'akamaiCpcodeDetail': { method: 'get', url: '/api/akamai/cpcode/detail' }, //cp详情
        'akamaiCpcodeList': { method: 'get', url: '/api/akamai/cpcode/list' }, //获取cp列表

        'akamaiEdgeHostAdd': { method: 'post', url: '/api/akamai/edge/hostname/add' }, //边缘主机添加
        'akamaiEdgeHostList': { method: 'get', url: '/api/akamai/edge/hostname/list' }, //边缘主机列表
        'akamaiCpcodeList': { method: 'get', url: '/api/akamai/cpcode/list' }, //配置 版本详情


        //云帆 服务模块 域名列表
        'cdnDomainList': { method: 'get', url: '/api/cdn/domain/list' },
        'yfDomainAdd': { method: 'post', url: '/api/yfcache/domain/add' },
        'yfDomainEdit': { method: 'post', url: '/api/yfcache/domain/change' },
        'yfDomainStatus': { method: 'post', url: '/api/yfcache/domain/status/change' },
        'yfDomainDel': { method: 'post', url: '/api/yfcache/domain/delete' },
        'yfDomainDetail': { method: 'get', url: '/api/yfcache/domain/detail' },
        'yfDomainCacheCfgAdd': { method: 'post', url: '/api/yfcache/domain/cache/config/add' },
        'yfDomainCacheCfgEdit': { method: 'post', url: '/api/yfcache/domain/cache/config/change' },
        'yfDomainCacheCfgDel': { method: 'post', url: '/api/yfcache/domain/cache/config/delete' },
        'yfDomainOriginCfgAdd': { method: 'post', url: '/api/yfcache/domain/origin/config/add' },
        'yfDomainOriginCfgEdit': { method: 'post', url: '/api/yfcache/domain/origin/config/cover' },
        'yfDomainOriginCfgDel': { method: 'post', url: '/api/yfcache/domain/origin/config/delete' },

        'yfDomainAuthEdit': { method: 'post', url: '/api/yfcache/domain/auth/config' },
        'yfDomainBwlistEdit': { method: 'post', url: '/api/yfcache/domain/bwlist/config' },
        'yfDomainResponseHeaderConfig': { method: 'post', url: '/api/yfcache/domain/header/config' },
        'yfDomainResponseHeaderEdit': { method: 'post', url: '/api/yfcache/domain/header/change' },
        'yfDomainResponseHeaderDel': { method: 'post', url: '/api/yfcache/domain/header/delete' },
        'yfDomainResponseHeaderkeyDel': { method: 'post', url: '/api/yfcache/domain/header/key/delete' },
        'yfDomainStreamingConfig': { method: 'post', url: '/api/yfcache/domain/streaming/config' },
        'yfDomainStreamingChange': { method: 'post', url: '/api/yfcache/domain/streaming/change' },
        'yfDomainStreamingList': { method: 'get', url: '/api/yfcache/domain/streaming/list' },
        'yfDomainStreamingDel': { method: 'post', url: '/api/yfcache/domain/streaming/delete' },

        'yfDomainPurgePreloadList': { method: 'get', url: '/api/yfcache/preload/list' },
        'yfDomainPurgePreloadDetail': { method: 'get', url: '/api/yfcache/preload/detail' },
        'yfDomainPurgePreloadAdd': { method: 'post', url: '/api/yfcache/preload/add' },

        'yfDomainPurgeRefreshList': { method: 'get', url: '/api/yfcache/refresh_url/list' },
        'yfDomainPurgeRefreshDetail': { method: 'get', url: '/api/yfcache/refresh_url/detail' },
        'yfDomainPurgeRefreshAdd': { method: 'post', url: '/api/yfcache/refresh_url/add' },
        'yfDomianSync': { method: 'get', url: '/api/yfcache/sync' },

        //云帆视频
        'yfLiveRtmpTaskList': { method: 'get', url: '/api/yflive/rtmp/task/list' }, //查看源流列表
        'yfLiveRtmpTaskConfig': { method: 'post', url: '/api/yflive/rtmp/task/config' }, //配置源流参数
        'yfLiveRtmpTaskDel': { method: 'post', url: '/api/yflive/rtmp/task/delete' }, //删除源流
        'yfLiveRtmpUrlSerach': { method: 'get', url: '/api/yflive/rtmp/url/search' }, //直播流地址查询 
        'yfLiveReviewPickup': { method: 'post', url: '/api/yflive/review/pickup' }, //直播录制文件提取
        'yfLiveReviewMove': { method: 'post', url: '/api/yflive/review/move' }, //yflive/review/move
        'yfLiveRtmpDetail': { method: 'get', url: '/api/yflive/rtmp/task/detail' },
        'yfLiveRtmpInfo': { method: 'get', url: '/api/yflive/rtmp/info' }, //查询某一推流服务器当前所有在线列表
        'yfLiveRtmpInfoStatus': { method: 'get', url: '/api/yflive/rtmp/info/status' }, //直播流实时状态查询
        'yfLiveRtmpInfoHistory': { method: 'get', url: '/api/yflive/rtmp/info/history' }, //源流历史信息查询
        'yfLiveRtmpInfoRestart': { method: 'post', url: '/api/yflive/rtmp/info/restart' }, //重启源流
        'yfLiveRtmpBanAdd': { method: 'post', url: '/api/yflive/rtmp/ban/add' }, //设置源流禁播
        'yfLiveRtmpBanList': { method: 'get', url: '/api/yflive/rtmp/ban/list' }, //源流禁播列表查询
        'yfLiveRtmpBanDel': { method: 'post', url: '/api/yflive/rtmp/ban/delete' }, //删除源流禁播
        'yfLiveRtmpBanIpAdd': { method: 'post', url: '/api/yflive/rtmp/ban_ip/add' }, //设置源流黑名单
        'yfLiveRtmpBanIpList': { method: 'get', url: '/api/yflive/rtmp/ban_ip/list' }, //源流黑名单列表查询
        'yfLiveRtmpBanIpDel': { method: 'post', url: '/api/yflive/rtmp/ban_ip/delete' }, //删除源流黑名单

        //网宿接口 chinanetcenter
        'cncDomainAdd': { method: 'post', url: '/api/chinanetcenter/domain/add' },
        'cncDomainChange': { method: 'post', url: '/api/chinanetcenter/domain/change' },
        'cncDomainDetail': { method: 'get', url: '/api/chinanetcenter/domain/detail' },
        'cncDomainOpen': { method: 'post', url: '/api/chinanetcenter/domain/open' },
        'cncDomainStop': { method: 'post', url: '/api/chinanetcenter/domain/stop' },
        'cncDomainDel': { method: 'post', url: '/api/chinanetcenter/domain/delete' },
        'cncPurgeAdd': { method: 'post', url: '/api/chinanetcenter/cache/purge' },
        'cncPurgeList': { method: 'get', url: '/api/chinanetcenter/cache/purge/list' },
        'cncPurgeDetail': { method: 'get', url: '/api/chinanetcenter/cache/purge/process/query' },
        'cncPrefetchAdd': { method: 'post', url: '/api/chinanetcenter/prefetch' },
        'cncPrefetchList': { method: 'get', url: '/api/chinanetcenter/prefetch/list' },
        'cncPrefetchDetail': { method: 'get', url: '/api/chinanetcenter/prefetch/process/query' },
        'cncDomianSync': { method: 'get', url: '/api/chinanetcenter/sync' },

        //快网
        'fastwebDomainAdd': { method: 'post', url: '/api/fastweb/domain/add' },
        'fastwebDomainDetail': { method: 'get', url: '/api/fastweb/domain/detail' },
        'fastwebDomainChange': { method: 'post', url: '/api/fastweb/domain/change' },
        'fastwebDomainDel': { method: 'post', url: '/api/fastweb/domain/delete' },
        'fastwebDomainEnable': { method: 'post', url: '/api/fastweb/domain/enable' },
        'fastwebDomainDisable': { method: 'post', url: '/api/fastweb/domain/disable' },
        'fastwebDomainCfgCnameSuffix': { method: 'post', url: '/api/fastweb/config/cname/suffix' },
        'fastwebDomainCfgCdnType': { method: 'get', url: '/api/fastweb/config/cdn/type' }, //获取加速类型
        'fastwebDomainCfgView': { method: 'get', url: '/api/fastweb/config/views' }, //回源线路
        'fastwebDomainRefreshAdd': { method: 'post', url: '/api/fastweb/refresh/add' },
        'fastwebDomainRefreshList': { method: 'get', url: '/api/fastweb/refresh/list' },
        'fastwebDomainRefreshDetail': { method: 'get', url: '/api/fastweb/refresh/detail' },
        'fastwebDomainReloadAdd': { method: 'post', url: '/api/fastweb/reload/add' },
        'fastwebDomainReloadDetail': { method: 'get', url: '/api/fastweb/reload/detail' },
        'fastwebDomainReloadList': { method: 'get', url: '/api/fastweb/reload/list' },
        'fastwebDomianSync': { method: 'get', url: '/api/fastweb/sync' },

        //蓝汛
        'chinacacheDomainAdd': { method: 'post', url: '/api/chinacache/domain/add' },
        'chinacacheDomainDel': { method: 'post', url: '/api/chinacache/domain/delete' },
        'chinacacheDomainDetail': { method: 'get', url: '/api/chinacache/domain/detail' },
        'chinacacheDomainChange': { method: 'post', url: '/api/chinacache/domain/change' },
        'chinacacheDomainStatusChange': { method: 'post', url: '/api/chinacache/domain/status/change' },
        'chinacacheAdvaccessSet': { method: 'post', url: '/api/chinacache/advaccess/set' },

        'chinacacheRefreshAdd': { method: 'post', url: '/api/chinacache/cache/fresh/add' },
        'chinacacheRefreshDetail': { method: 'get', url: '/api/chinacache/cache/fresh/process/query' },
        'chinacacheRefreshList': { method: 'get', url: '/api/chinacache/cache/fresh/list' },
        'chinacacheReloadAdd': { method: 'post', url: '/api/chinacache/preload/add' },
        'chinacacheReloadDetail': { method: 'get', url: '/api/chinacache/preload/process/query' },
        'chinacacheReloadList': { method: 'get', url: '/api/chinacache/preload/list' },
        'chinacacheDomainSync': { method: 'get', url: '/api/chinacache/sync' },


        //帝联
        'dnionDomainAdd': { method: 'post', url: '/api/dnion/domain/add' },
        'dnionDomainList': { method: 'get', url: '/api/dnion/domain/list' },
        'dnionDomainDetail': { method: 'get', url: '/api/dnion/domain/detail' },
        'dnionDomainChange': { method: 'post', url: '/api/dnion/domain/change' },
        'dnionDomainEnable': { method: 'post', url: '/api/dnion/domain/enable' },
        'dnionDomainDisable': { method: 'post', url: '/api/dnion/domain/disable' },
        'dnionDomainDel': { method: 'post', url: '/api/dnion/domain/delete' },
        'dnionSslAdd': { method: 'post', url: '/api/dnion/ssl/add' },
        'dnionSslList': { method: 'get', url: '/api/dnion/ssl/list' },
        'dnionSslDel': { method: 'post', url: '/api/dnion/ssl/delete' },
        'dnionSslChange': { method: 'post', url: '/api/dnion/ssl/change' },
        'dnionRefreshAdd': { method: 'post', url: '/api/dnion/refresh/add' },
        'dnionRefreshList': { method: 'get', url: '/api/dnion/refresh/list' },
        'dnionRefreshDetail': { method: 'get', url: '/api/dnion/refresh/detail' },
        'dnionReloadAdd': { method: 'post', url: '/api/dnion/reload/add' },
        'dnionReloadList': { method: 'get', url: '/api/dnion/reload/list' },
        'dnionReloadDetail': { method: 'get', url: '/api/dnion/reload/detail' },
        'dnionDomainSync': { method: 'get', url: '/api/dnion/sync' },

        //全局刷新
        'refreshCheck': { method: 'post', url: '/api/cdn/refresh/check' }, //校验url
        'refreshAdd': { method: 'post', url: '/api/cdn/refresh/add' },
        'preloadAdd': { method: 'post', url: '/api/cdn/preload/add' },


        //统计 
        "statsBanwidth": { method: 'get', url: '/api/cdn/bandwith' },
        "statsFlow": { method: 'get', url: '/api/cdn/flow' },
        //快网
        'statsFastwebBanwidth': { method: 'get', url: '/api/fastweb/report/bandwidth' },
        'statsFastwebFlow': { method: 'get', url: '/api/fastweb/report/flow' },
        'statsFastwebVisits': { method: 'get', url: '/api/fastweb/report/visits' },
        'statsFastwebLog': { method: 'get', url: '/api/fastweb/report/log' },
        'statsFastwebCode': { method: 'get', url: '/api/fastweb/report/code' },
        'statsFastwebDeviceVisits': { method: 'get', url: '/api/fastweb/report/analyse/device/visits' },
        'statsFastwebIspFlow': { method: 'get', url: '/api/fastweb/report/analyse/isp/flow' },
        'statsFastwebAreaFlow': { method: 'get', url: '/api/fastweb/report/analyse/area/flow' },

        'statsFastwebFile': { method: 'get', url: '/api/fastweb/report/analyse/file' },
        'statsFastwebTopIp': { method: 'get', url: '/api/fastweb/report/analyse/top/ip' },
        'statsFastwebTopUrl': { method: 'get', url: '/api/fastweb/report/analyse/top/url' },
        
        //帝联
        'statsDnionBanwidth': { method: 'get', url: '/api/dnion/report/bandwidth' },
        'statsDnionBanwidthSvg': { method: 'get', url: '/api/dnion/report/bandwidth/avg' },
        'statsDnionBanwidthStaticDynamic': { method: 'get', url: '/api/dnion/report/bandwidth/static_dynamic' },
        'statsDnionFlow': { method: 'get', url: '/api/dnion/report/flow' },
        'statsDnionOrigin': { method: 'get', url: '/api/dnion/report/flow/origin' },
        'statsDnionVisits': { method: 'get', url: '/api/dnion/report/visits' },
        'statsDnionLog': { method: 'get', url: '/api/dnion/report/log' },

        'statsDnionAnalyseTopIp': { method: 'get', url: '/api/dnion/report/analyse/top/ip' },
        'statsDnionAnalyseTopUrl': { method: 'get', url: '/api/dnion/report/analyse/top/url' },
        'statsDnionAnalyseAreaVisits': { method: 'get', url: '/api/dnion/report/analyse/area/visits' },
        'statsDnionAnalyseAreaFlow': { method: 'get', url: '/api/dnion/report/analyse/area/flow' },
        'statsDnionAnalyseIspVisits': { method: 'get', url: '/api/dnion/report/analyse/isp/visits' },
        'statsDnionAnalyseIspFlow': { method: 'get', url: '/api/dnion/report/analyse/isp/flow' },
        'statsDnionAnalyseFile': { method: 'get', url: '/api/dnion/report/analyse/file' },

        //蓝汛
        'statsCcBanwidth': { method: 'post', url: '/api/chinacache/report/bandwidth' }, //带宽
        'statsCcFlow': { method: 'post', url: '/api/chinacache/report/flow' }, //流量
        'statsCcVisits': { method: 'post', url: '/api/chinacache/report/visits' }, //请求数
        'statsCcHitRate': { method: 'post', url: '/api/chinacache/report/hit/rate' }, //缓存命中率
        'statsCcCode': { method: 'post', url: '/api/chinacache/report/code' }, //状态码
        'statsCcLog': { method: 'post', url: '/api/chinacache/report/log' }, //日志
        'statsCcAnalyseTopUrl': { method: 'post', url: '/api/chinacache/report/analyse/top/url' }, //Top Url
        'statsCcAnalyseTopIp': { method: 'post', url: '/api/chinacache/report/analyse/top/ip' }, //Top Ip
        'statsCcAnalyseAreaVisits': { method: 'post', url: '/api/chinacache/report/analyse/area/visits' }, //地区
        'statsCcAnalyseIspVisits': { method: 'post', url: '/api/chinacache/report/analyse/isp/visits' }, //运营商
        'statsCcAnalyseFile': { method: 'post', url: '/api/chinacache/report/analyse/file' }, //文件类型
        'statsCcAnalyseDeviceVisits': { method: 'post', url: '/api/chinacache/report/analyse/device/visits' }, //设备来源
        //网宿
        'statsCncBandwidth': { method: 'post', url: '/api/chinanetcenter/report/bandwidth' },
        'statsCncFlow': { method: 'post', url: '/api/chinanetcenter/report/flow' },
        'statsCncVisits': { method: 'post', url: '/api/chinanetcenter/report/visits' },
        'statsCncLog': { method: 'post', url: '/api/chinanetcenter/report/log' },
        'statsCncAreaFlow': { method: 'post', url: '/api/chinanetcenter/report/analyse/area/flow' },
        'statsCncIspFlow': { method: 'post', url: '/api/chinanetcenter/report/analyse/isp/flow' },
        'statsCncTopUrl': { method: 'post', url: '/api/chinanetcenter/report/analyse/top/url' },
        'statsCncTopIp': { method: 'post', url: '/api/chinanetcenter/report/analyse/top/ip' },
        'statsCncCode': { method: 'post', url: '/api/chinanetcenter/report/code' },
        //云帆
        'statsYfBandwidth': { method: 'post', url: '/api/yfcloud/report/bandwidth' },
        'statsYfFlow': { method: 'post', url: '/api/yfcloud/report/flow' },
        'statsYfVisits': { method: 'post', url: '/api/yfcloud/report/visits' },
        'statsYfHitRate': { method: 'post', url: '/api/yfcloud/report/hit/rate' },
        'statsYfCode': { method: 'post', url: '/api/yfcloud/report/code' },
        'statsYfLog': { method: 'post', url: '/api/yfcloud/report/log' },
        'statsYfTopUrl': { method: 'post', url: '/api/yfcloud/report/analyse/top/url' },
        'statsYfTopIp': { method: 'post', url: '/api/yfcloud/report/analyse/top/ip' },
        'statsYfAreaFlow': { method: 'post', url: '/api/yfcloud/report/analyse/area/flow' },
        'statsYfIspFlow': { method: 'post', url: '/api/yfcloud/report/analyse/isp/flow' },
        'statsYfAreaVisits': { method: 'post', url: '/api/yfcloud/report/analyse/area/visits' },
        'statsYfIspVisit': { method: 'post', url: '/api/yfcloud/report/analyse/isp/visits' },
        'statsYfDeviceVisits': { method: 'post', url: '/api/yfcloud/report/analyse/device/visits' },
        'statsYfFile': { method: 'post', url: '/api/yfcloud/report/analyse/file' },

        //主页
        'homeSystemInfoAdd': { method: 'post', url: '/api/system/info/add' },
        'homeSystemInfoChange': { method: 'post', url: '/api/system/info/change' },
        'homeSystemInfoDel': { method: 'post', url: '/api/system/info/delete' },
        'homeSystemInfoList': { method: 'get', url: '/api/system/info/list' },
        'homeLogList': { method: 'get', url: '/api/user/log/list' },
        'homeCommonDomainGet': { method: 'get', url: '/api/user/used/domain/get' },
        'homeCommonDomainSet': { method: 'post', url: '/api/user/used/domain/set' },
        'homeUserDomain': { method: 'get', url: '/api/cdn/user/domain/statistics' },
        'homeUserInfo': { method: 'get', url: '/auth/user/info' },

        //项目权限
        'authModel': { method: 'get', url: '/auth/model/permission' },
        // '' : { method: 'post', url: ''},
        //echart china地图数据
        'china': { method: 'get', url: '/static/lib/echarts/china.json' },
    };

    var errorAlert = null;
    var loginAlert = null;

    //请求错误信息显示
    function showError(errorInfo) {
        // console.log(errorInfo);
        errorAlert && errorAlert.close();
        errorAlert = uidialog.alert(errorInfo);
    }

    function checkLogin(resData) {
        if (isProd && (resData.status == 203 || !$cookies.get('user_name'))) {
            if (!loginAlert) {
                loginAlert = uidialog.open({
                    template: '未登陆，<a href="/auth/openid/login">跳转到登陆页面</a>',
                    hasClose: false,
                    size: { width: 350, height: 140 },
                });
            }
            return false;
        }
        return true;
    }

    function Req(opt) {
        this.d = function(data, callback, errCallback, config, param) {

            uiloading.show();
            var timeout = 100000;
            if (config && angular.isDefined(config.isShowLoading) && config.isShowLoading == false)
                uiloading.hide();
            if (config && angular.isDefined(config.timeout))
                timeout = config.timeout;
            var httpOpt = {
                method: opt.method,
                url: opt.url,
                timeout: timeout,
                headers: {
                    'Content-Type': 'text/plain;charset=UTF-8'
                }
            }
            if (opt.method == 'get') {
                httpOpt.params = data;
            } else if (opt.method == 'post') {
                httpOpt.data = data;
            }

            if (GetCookie('user_name') == null) {
                uiloading.hide();
                if (!loginAlert) {
                    loginAlert = uidialog.open({
                        template: '未登陆，<a href="/auth/openid/login">跳转到登陆页面</a>',
                        hasClose: false,
                        size: { width: 350, height: 140 },
                    });
                }
                return;
            }


            $http(httpOpt).then(function successCall(resData) {
                uiloading.hide();
                if (!checkLogin(resData)) {
                    return;
                }
                callback && callback(resData['data'], param);
            }, function errorCall(resData) {
                uiloading.hide();
                if (!checkLogin(resData)) {
                    return;
                }
                if (errCallback) {
                    errCallback(resData);
                } else {
                    if (resData.status == -1) {
                        showError('数据请求失败，请重试。')
                    } else {
                        if (typeof resData.data.data == 'string' && resData.data.data != '')
                            showError(resData.data.data);
                        else
                            showError(resData.data.detail);
                    }
                }
            });
        }
    }
    for (var key in this._urls) {
        this[key] = new Req(this._urls[key]).d;
    }
    this.test = function() {
        console.log(this);
    };
});
