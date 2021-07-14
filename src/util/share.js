import axios from 'axios'

var nonceStr, signature, timestamp, appId, shareUrl;
$.ajax({
    //后台获取参数接口
    url: "http://192.168.1.50:8066/api/Users/CreateSignature",
    type: 'get',
    data: {
      url:location.href.split('#')[0],
    },
    success: function(data) {
        //得到参数
        var appId = 'wx9cec35e64dce69fc';
        var nonceStr = JSON.parse(data).nonceStr;
        var signature =  JSON.parse(data).signature;
        var timestamp =  JSON.parse(data).timestamp;
        var shareUrl = 'weixin.jshcsoft.com/mqy/ZBSystem/mweb?AppID=wx9cec35e64dce69fc&response_type=code&scope=snsapi_userinfo&state=1#wechat_redirect';
        //通过微信config接口注入配置
        wx.config({
            debug: false, // 默认为false  为true的时候是调试模式，会打印出日志
            appId: appId,
            timestamp: timestamp,
            nonceStr: nonceStr,
            signature: signature,
            jsApiList: [
                'checkJsApi',
                'onMenuShareTimeline',
                'onMenuShareAppMessage',
                'onMenuShareQQ',
                'onMenuShareWeibo'
            ]
        });
        //配置自定义分享内容
        window.share_config = {
            'share': {
                'title': '点我吧，招标宝典', // 这是分享展示卡片的标题
                'link': shareUrl, // 这里是分享的网址
                // 'imgUrl': 'http://wx.qlogo.cn/mmopen/dCvkZpKkuSG2mUyr15T5cia224iapwJicstomqCGTK5OHB1ssj7eqX3icV6AiboPiasc0nYJLksdBXFsMpfPbtxibXrznH48LCKvwEy/64', // 这里是需要展示的图标
                'imgUrl': 'http://weixin.jshcsoft.com/biddingbook/mweb/static/img/logo.8744cdb.png', // 这里是需要展示的图标
                'desc': '你想要连接招标宝典吗，顺便看看招标吗，点我吧', // 这是分享展示的摘要
                'success': function(rr) {

                },
                'cancel': function(tt) {

                }
            }
        };
        wx.ready(function() {
          alert(share_config.share)
            wx.onMenuShareAppMessage(share_config.share); // 微信好友
            wx.onMenuShareTimeline(share_config.share); // 微信朋友圈
            wx.onMenuShareQQ(share_config.share); // QQ
        });

    },
    error: function(err) {

    },
});