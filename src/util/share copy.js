import wx from 'weixin-js-sdk'

export default{
    install(Vue) {
        Vue.prototype.shareList = function (imgUrl, link, desc, title) {
            // var url = encodeURIComponent(link)
            var url = link
            // 分享
            this.$http.post('wxSignPackage', {url: url}, 'json').then(function (res) {
                // alert(JSON.stringify(res))
                res = res.data.data;
                wx.config({
                    debug: false, // true:是调试模式,调试时候弹窗,会打印出日志
                    appId: res.appId, // 微信appid
                    timestamp: res.timestamp, // 时间戳
                    nonceStr: res.noncestr, // 随机字符串
                    signature: res.signature, // 签名
                    jsApiList: [
                        // 所有要调用的 API 都要加到这个列表中
                        'onMenuShareTimeline', // 分享到朋友圈接口
                        'onMenuShareAppMessage', //  分享到朋友接口
                        'onMenuShareQQ', // 分享到QQ接口
                        'onMenuShareWeibo', // 分享到微博接口
                        'updateTimelineShareData',
                        'updateAppMessageShareData'
                    ]
                })
                wx.checkJsApi({
                    jsApiList: [
                        // 所有要调用的 API 都要加到这个列表中
                        'onMenuShareTimeline', // 分享到朋友圈接口
                        'onMenuShareAppMessage', //  分享到朋友接口
                        'onMenuShareQQ', // 分享到QQ接口
                        'onMenuShareWeibo', // 分享到微博接口
                        'updateTimelineShareData',
                        'updateAppMessageShareData'
                    ],
                    success: function (res) {
                        // alert("checkJsApi:success");
                    }
                })

                wx.ready(function () {
                    // 微信分享的数据
                    var shareData = {
                        imgUrl: imgUrl, // 分享显示的缩略图地址
                        link: link, // 分享地址
                        desc: desc, // 分享描述
                        title: title, // 分享标题
                        success: function () {
                            // 分享成功可以做相应的数据处理
                            // alert('分享成功')
                            // alert('appId:' + res.appId)
                            // alert('timestamp:' + res.timestamp)
                            // alert('nonceStr:' + res.nonceStr)
                            // alert('signature:' + res.signature)
                        },
                        fail: function () {
                            // alert('调用失败')

                        },
                        complete: function () {
                            // alert('调用结束')

                        }
                    }
                    wx.updateTimelineShareData(shareData)
                    wx.updateAppMessageShareData(shareData)
                    wx.onMenuShareQQ(shareData)
                    wx.onMenuShareWeibo(shareData)
                })
                wx.error(function (res) {
                    // config信息验证失败会执行error函数，如签名过期导致验证失败，
                    // 具体错误信息可以打开config的debug模式查看，也可以在返回的res参数中查看，
                    // 对于SPA可以在这里更新签名。
                    console.log(res)
                    //alert('分享失败')

                })
            }, function (res) {
                // alert(res)
                // console.log(parseInt(res.code))
            })
        }
    }
}
