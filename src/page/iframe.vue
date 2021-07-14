<template>
    <div>
        <iframe
            id="iframeId"
            :src="url"
            frameborder="0"
            class="pc iframe"
            scrolling="auto"
            @change="error"
        >
            <!-- <button class="btn">55</button> -->
        </iframe>
        <button class="btn" @click="error()">信息纠错</button>
        <van-dialog
            v-model="showB"
            @cancel="cancel"
            @confirm="confirm"
            title="纠错信息"
            show-cancel-button
        >
            <div class="box">
                <div class="checkBox">
                    <van-checkbox v-model="checked1" @change="check()">金额不准确</van-checkbox>
                    <van-checkbox v-model="checked2" @change="check()">地区不准确</van-checkbox>
                    <van-checkbox v-model="checked3" @change="check()">时间不准确</van-checkbox>
                    <van-checkbox v-model="checked4" @change="check()">信息不准确</van-checkbox>
                    <van-checkbox v-model="checked5" @change="check()">类型不准确</van-checkbox>
                    <van-checkbox v-model="checked6" @change="check()">行业不准确</van-checkbox>
                </div>
                <div>
                    <van-field
                        v-model="message"
                        rows="2"
                        autosize
                        type="textarea"
                        maxlength="1000"
                        placeholder="请输入纠错意见"
                        show-word-limit
                    />
                </div>
            </div>
        </van-dialog>
    </div>
</template>

<script>
import Vue from "vue";
import { mapMutations } from "vuex";
import wx from "weixin-js-sdk";
import { Dialog, Checkbox, Field, Toast } from "vant";
Vue.use(Dialog)
    .use(Checkbox)
    .use(Field)
    .use(Toast);
export default {
    data() {
        return {
            url: sessionStorage.getItem("url"),
            contentdata: {},
            shareinfo:
                "招标信息免费订阅,商业商机随时掌握,全国范围千万数据,每天定时精准送达",
            link:
                "https://weixin.jshcsoft.com/biddingbook/mweb?AppID=wx9cec35e64dce69fc&response_type=code&scope=snsapi_userinfo&state=1#wechat_redirect",
            id: "",
            showB: false,
            checked1: false,
            checked2: false,
            checked3: false,
            checked4: false,
            checked5: false,
            checked6: false,
            arr: [],
            message: ""
        };
    },

    created: function() {
        this.COMMON.initRem();
        this.url = this.$router.history.current.query.ZBUrl;
        this.hide();

        // window.addEventListener("popstate", function(e) {
        //     window.history.back();
        // }, false);
    },

    mounted: function() {
        //得到参数
        let that = this;
        var appId = "wx9cec35e64dce69fc";
        if (sessionStorage.getItem("sharetitle") != null) {
            this.shareinfo = sessionStorage.getItem("sharetitle");
            this.link = window.location.href + "%26share";
        }

        console.log(that.shareinfo);
        console.log(that.link);
        // console.log(this.link);
        // if(sessionStorage.getItem('openID') == 'oJ98l65UKrfFDRd1Ss9Te46hdWsI'){
            
        // }

        //通过微信config接口注入配置
        wx.config({
            debug: false, // 默认为false  为true的时候是调试模式，会打印出日志
            appId: appId,
            timestamp: sessionStorage.getItem("timestamp"),
            nonceStr: sessionStorage.getItem("nonceStr"),
            signature: sessionStorage.getItem("signature"),
            jsApiList: [
                "checkJsApi",
                "onMenuShareTimeline",
                "onMenuShareAppMessage",
                "onMenuShareQQ"
            ]
        });
        //配置自定义分享内容
        window.share_config = {
            share: {
                imgUrl:"http://weixin.jshcsoft.com/biddingbook/mweb/static/img/logo.8744cdb.png", // 这里是需要展示的图标
                desc: that.shareinfo,
                title: "招标宝典", // 这是分享展示卡片的标题
                link: that.link, // 这里是分享的网址
                success: function(rr) {
                    console.log(rr);
                    // window.share_config.share.title = '招标宝典';
                    // window.share_config.share.link = 'https://weixin.jshcsoft.com/biddingbook/mweb?AppID=wx9cec35e64dce69fc&response_type=code&scope=snsapi_userinfo&state=1#wechat_redirect'
                    // window.share_config.share.desc = "招标信息免费订阅,商业商机随时掌握,全国范围千万数据,每天定时精准送达";
                },
                cancel: function(tt) {
                    console.log(tt);
                    shareinfo =
                        "招标信息免费订阅,商业商机随时掌握,全国范围千万数据,每天定时精准送达";
                    link =
                        "https://weixin.jshcsoft.com/biddingbook/mweb?AppID=wx9cec35e64dce69fc&response_type=code&scope=snsapi_userinfo&state=1#wechat_redirect";
                }
            }
        };
        wx.ready(function() {
            wx.onMenuShareAppMessage(share_config.share); // 微信好友
            wx.onMenuShareTimeline(share_config.share); // 微信朋友圈
            wx.onMenuShareQQ(share_config.share); // QQ
            // wx.updateAppMessageShareData(share_config.share);
        });
    },

    methods: {
        ...mapMutations(["hide", "show"]),
        error() {
            this.showB = true;
        },
        confirm() {
            // console.log(this.id);
            // console.log(this.arr.toString());
            // console.log(this.message);
            if(!this.checked1 && !this.checked2 && !this.checked3 && !this.checked4 && !this.checked5 && !this.checked6 && this.message.trim() == ''){
                Toast("请输入您的宝贵意见");
                this.checked1 = false;
                this.checked2 = false;
                this.checked3 = false;
                this.checked4 = false;
                this.checked5 = false;
                this.checked6 = false;
                this.message = "";
                return false;
            }

            this.$dataApi({
                url: "api/InformationErrorCorrection/SaveErrorCorrectionInfo",
                method: "POST",
                data: {
                    OpenId: sessionStorage.getItem("openID"),
                    NickName: sessionStorage.getItem("NickName"),
                    BaseID: this.id,
                    title: sessionStorage.getItem("sharetitle"),
                    ErrorType: this.arr.toString(),
                    SubmitContent: this.message
                }
            }).then(response => {
                console.log(response);
                if (response.Status == 200) {
                    Toast("我们已收到您的宝贵意见,将会及时更改！");
                    this.checked1 = false;
                    this.checked2 = false;
                    this.checked3 = false;
                    this.checked4 = false;
                    this.checked5 = false;
                    this.checked6 = false;
                    this.message = "";
                }
            });
        },
        cancel() {
            this.checked1 = false;
            this.checked2 = false;
            this.checked3 = false;
            this.checked4 = false;
            this.checked5 = false;
            this.checked6 = false;
            this.message = "";
        },
        check() {
            if (this.checked1) {
                this.arr.push("金额不准确");
            } else {
                if (this.arr.indexOf("金额不准确") !== -1) {
                    this.arr.splice(this.arr.indexOf("金额不准确"), 1);
                }
            }
            if (this.checked2) {
                this.arr.push("地区不准确");
            } else {
                if (this.arr.indexOf("地区不准确") !== -1) {
                    this.arr.splice(this.arr.indexOf("地区不准确"), 1);
                }
            }
            if (this.checked3) {
                this.arr.push("时间不准确");
            } else {
                if (this.arr.indexOf("时间不准确") !== -1) {
                    this.arr.splice(this.arr.indexOf("时间不准确"), 1);
                }
            }
            if (this.checked4) {
                this.arr.push("信息不准确");
            } else {
                if (this.arr.indexOf("信息不准确") !== -1) {
                    this.arr.splice(this.arr.indexOf("信息不准确"), 1);
                }
            }
            if (this.checked5) {
                this.arr.push("类型不准确");
            } else {
                if (this.arr.indexOf("类型不准确") !== -1) {
                    this.arr.splice(this.arr.indexOf("类型不准确"), 1);
                }
            }
            if (this.checked6) {
                this.arr.push("行业不准确");
            } else {
                if (this.arr.indexOf("行业不准确") !== -1) {
                    this.arr.splice(this.arr.indexOf("行业不准确"), 1);
                }
            }

            this.arr = [...new Set(this.arr)]; //去重
        }
    },
    beforeRouteEnter(to, from, next) {
        next(vm => {
            vm.id = to.query.id;

            // if (
            //     from.path == "/searchList" ||
            //     from.path == "/Keyinfolist" ||
            //     from.path == "/mypro" ||
            //     from.path == "/ts" 
            // ) {
            //     var u = navigator.userAgent;
            //     var isiOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/); //ios终端

            //     var isIphone = navigator.userAgent.includes('iPhone');
            //     // console.log(isiOS);
            //     // console.log(isIphone);

            //     if (isIphone && sessionStorage.getItem("flagIos3") == null) {
            //         sessionStorage.setItem("flagIos3", 1);
            //         location.reload();
            //     }
            // }
        });
    },
    beforeRouteLeave(to, from, next) {
        sessionStorage.removeItem("sharetitle");
        sessionStorage.removeItem("flagIos3");
        window.share_config.share.title = "招标宝典";
        window.share_config.share.link =
            "https://weixin.jshcsoft.com/biddingbook/mweb?AppID=wx9cec35e64dce69fc&response_type=code&scope=snsapi_userinfo&state=1#wechat_redirect";
        window.share_config.share.desc =
            "招标信息免费订阅,商业商机随时掌握,全国范围千万数据,每天定时精准送达";

        //  this.shareinfo="招标信息免费订阅,商业商机随时掌握,全国范围千万数据,每天定时精准送达";
        //  this.link='https://weixin.jshcsoft.com/mqy/ZBSystem/mweb?AppID=wx9cec35e64dce69fc&response_type=code&scope=snsapi_userinfo&state=1#wechat_redirect';
        if (to.path !== "") {
            share_config.share.shareinfo =
                "招标信息免费订阅,商业商机随时掌握,全国范围千万数据,每天定时精准送达";
            share_config.share.link =
                "https://weixin.jshcsoft.com/biddingbook/mweb?AppID=wx9cec35e64dce69fc&response_type=code&scope=snsapi_userinfo&state=1#wechat_redirect";
            this.show();
        }
        next();
    }
};
</script>

<style scoped>
iframe {
    position: absolute;

    left: 0;

    right: 0;

    top: 0;

    bottom: 0;

    width: 100%;

    height: 100%;

    background: #fff;

    overflow-y: hidden;
}
.btn {
    position: absolute;
    width: 25%;
    height: 0.5rem;
    top: 80%;
    right: 0;
    font-size: 0.3rem;
    background: skyblue;
    color: #fff;
    border: none;
    border-radius: 0.2rem 0 0 0.2rem;
}
.checkBox {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    justify-content: center;
}
.van-checkbox {
    width: 40%;
    margin-top: 0.3rem;
}
</style>
