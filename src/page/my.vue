<template>
    <div class="box">
        <!-- 主体 -->
        <div class="main">
            <div class="hea">
                <img src="../../public/image/mybg.png" alt="">
                <div class="touxiang">
                    <!-- <img
                        src="https://ss1.bdstatic.com/70cFuXSh_Q1YnxGkpoWK1HF6hhy/it/u=2658465131,402615240&fm=26&gp=0.jpg"
                        alt
                        class="img1"
                    /> -->
                    <img class="tx img1" :src='url' alt="">
                </div>
                <p class="wxName">
                    {{name}}
                    <img v-if="king" class="kingF" src="../../public/image/kingt.png" alt="">
                    <img v-if="!king" class="kingF" src="../../public/image/king.png" alt="">
                </p>
                
                <!-- <p class="wxName">{{name}}</p> -->
            </div>

            <ul>
                <!-- 关注项目 -->
                <li @click="goMyPro()">
                    <img class="span1" src="../../public/image/mygz.png" alt=""></img>
                    <span>我关注的项目</span>
                </li>
                <!-- 我的订阅维护 -->
                <li @click="subscribe()">
                    <img class="span1" src="../../public/image/mygz.png" alt=""></img>
                    <span>我的订阅维护</span>
                </li>

                <!-- 推送设置 -->
                <li @click="tuisong()">
                    <img class="span1" src="../../public/image/myts.png" alt=""></img>
                    <span>招标推送设置</span>
                </li>

                <!-- 邀请码 -->
                <!-- <li @click="yaoqingma()">
                    <img class="span1" src="../../public/image/myyqm.png" alt=""></img>
                    <span>免费注册会员</span>
                </li> -->

                <!-- 数据导出 -->
                <!-- <li @click="exportExecl()">
                    <img class="span1" src="../../public/image/mydc.png" alt=""></img>
                    <span>数据导出</span>
                </li> -->

                <!-- 常见问题 -->
                <li @click="goOpinion()">
                    <img class="span1" src="../../public/image/mywt.png" alt=""></img>
                    <span>常见问题查询</span>
                </li>
            </ul>

            <p class="phot">全国服务热线：4000085315</p>
        </div>
        <!-- <van-dialog v-model="showDia" title="免费获取邀请码请拨打：" show-cancel-button :beforeClose="beforeClose">
            <a class="a" href="tel:4000085315">4000085315</a>
            <van-field v-model="valueDio" placeholder="请输入邀请码" />
        </van-dialog> -->

        <van-dialog v-model="showDia" :show-confirm-button=false class="phone">
            <div class="register">
                <div :class="active?'registerBtnT':'registerBtnF'" @click="phoneReg">手机号码注册</div>
                <!-- <div :class="!active?'registerBtnT':'registerBtnF'" @click="phoneReg">邀请码注册</div> -->
            </div>

            <div v-if="active">
                <p style="margin:12px">免费注册可享更多权益!</p>
                <van-field v-model="tel" type="tel" label="手机号码"  placeholder="请输入手机号码"/>
                <van-field
                    v-model="sms"
                    center
                    clearable
                    label="短信验证码"
                    placeholder="请输入短信验证码"
                >
                    <template #button>
                        <van-button size="small" type="primary" @click="getsms">{{fsyzm}}</van-button>
                    </template>
                </van-field>
                <div class="btnbox">
                    <button class="btnShowT" @click="phoneFin">确定</button>
                    <button class="btnShowF" @click="closeActive">取消</button>
                </div>
            </div>

            <div v-if="!active">
                <p style="margin:12px">免费注册可享更多权益!</p>
                <van-field v-model="code" label="邀请码"  placeholder="请输入邀请码"/>
                <div class="btnbox">
                    <button class="btnShowT" @click="codeFin">确定</button>
                    <button class="btnShowF" @click="closeActive">取消</button>
                </div>
            </div>
        </van-dialog>
    
        <!-- <button class="btn" @click="goIntegral()">签到送积分</button> -->

        <button class="FreeRegistration" @click="yaoqingma()">免费注册</button>

    </div>
</template>

<script>
import Vue from "vue";
import { NavBar, Divider, Toast, Tab, Tabs, Field } from "vant";
import { mapMutations } from "vuex";
import "@/iconfont/iconfont.css";
import Cookies from "js-cookie";
Vue.use(NavBar);
Vue.use(Divider);
Vue.use(Toast);
Vue.use(Tab);
Vue.use(Tabs);
Vue.use(Field);
export default {
    data() {
        return {
            name: "",
            url: "",
            king: false,
            showpass: false,
            code: "",
            oldp: "",
            password: "",
            qpassword: "",
            yzname: "发送验证码",
            timer: null,
            disabled: false,
            count: "",
            message: "",
            InvitationCode: false, //改用户是否填写过邀请码
            showDia: false, //验证码弹框是否出现
            valueDio: "", //验证码弹框内容
            vipTime: "", //体验卡会员
            active: true, //哪种注册方式
            fsyzm: "发送验证码",
            fsyzmTrue: true, //是否在60秒
            tel: "", //手机号
            sms: "", //验证码
            code: "", //邀请码
        };
    },
    methods: {
        ...mapMutations(["hide", "show"]),
        ...mapMutations(["activeThr"]),
        //设置页面
        set() {
            this.$router.push("./set");
        },
        //我的关注项目页面
        goMyPro() {
            let that = this;
            localStorage.removeItem('ProjectsConcern');
            that.$dataApi({
                url:'api/Users/AddUserTriggerEvent',
                method:'POST',
                data:{
                    OpenId:sessionStorage.getItem("openID"),   
                    EventName:'我关注的项目',
                    JudgeValue:1
                }
            }).then(response=>{
                that.$router.push("/mypro");
            });
        },
        //我的订阅维护页面
        subscribe() {
            let that = this;
            that.$dataApi({
                url:'api/Users/AddUserTriggerEvent',
                method:'POST',
                data:{
                    OpenId:sessionStorage.getItem("openID"),   
                    EventName:'我的订阅维护',
                    JudgeValue:1
                }
            }).then(response=>{
                that.$router.push("/keyWords");
            });
        },
        //我的足迹页面
        goMyFoot() {
            this.$router.push("./myfoot");
        },
        //常见问题查询页面
        goOpinion() {
            let that = this;
            that.$dataApi({
                url:'api/Users/AddUserTriggerEvent',
                method:'POST',
                data:{
                    OpenId:sessionStorage.getItem("openID"),   
                    EventName:'常见问题查询',
                    JudgeValue:1
                }
            }).then(response=>{
                that.$router.push("/ques");
            });
        },
        //推送设置
        tuisong() {
            let that = this;
            that.$dataApi({
                url:'api/Users/AddUserTriggerEvent',
                method:'POST',
                data:{
                    OpenId:sessionStorage.getItem("openID"),   
                    EventName:'招标推送设置',
                    JudgeValue:1
                }
            }).then(response=>{
                that.$router.push("/push");
            });
        },
        //填写邀请码
        yaoqingma() {

            let that = this;
            that.$dataApi({
                url:'api/Users/AddUserTriggerEvent',
                method:'POST',
                data:{
                    OpenId:sessionStorage.getItem("openID"),   
                    EventName:'免费注册会员',
                    JudgeValue:1
                }
            }).then(response=>{});

            this.$dataApi({
                url: "api/Users/IsExistInvitationCode",
                method: "GET",
                data: {
                    openID: sessionStorage.getItem("openID"),
                },
            }).then((res) => {
                // console.log(res);
                if (res.Msg == "true") {
                    this.InvitationCode = true;
                    Toast.success("您已是会员!");
                } else {
                    this.InvitationCode = false;
                    this.showDia = true;
                }
            });
        },
        beforeClose(action, done) {
            // console.log(action);
            if (action == "cancel") {
                done();
                this.valueDio = "";
            } else {
                // console.log(this.valueDio);
                if (this.valueDio.trim() == "") {
                    done();
                    Toast.fail("邀请码不能为空");
                    this.valueDio = "";
                } else if (
                    this.valueDio.trim().length != this.valueDio.length
                ) {
                    done();
                    Toast.fail("邀请码前后不能有空格");
                    this.valueDio = "";
                } else {
                    this.$dataApi({
                        url: "api/Users/RegistrationInvitationCode",
                        method: "POST",
                        data: {
                            openid: sessionStorage.getItem("openID"),
                            InvitationCode: this.valueDio,
                            sex: sessionStorage.getItem("sex"),
                            language: sessionStorage.getItem("language"),
                            city: sessionStorage.getItem("city"),
                            province: sessionStorage.getItem("province"),
                            country: sessionStorage.getItem("country"),
                            headimgurl: sessionStorage.getItem("headimgurl"),
                            subscribe_time: sessionStorage.getItem(
                                "subscribe_time"
                            ),
                            remark: sessionStorage.getItem("remark"),
                            IsUpdate: sessionStorage.getItem("IsUpdate"),
                            nickname: sessionStorage.getItem("NickName"),
                            presubscribe_time: sessionStorage.getItem(
                                "presubscribe_time"
                            ),
                            // sex:'',
                            // language:'',
                            // city:'',
                            // province:'',
                            // country:'',
                            // headimgurl:'',
                            // subscribe_time:'',
                            // remark:'',
                            // IsUpdate:'',
                            // nickname:'',
                            // presubscribe_time:'',
                            Source: 1,
                        },
                    }).then((res) => {
                        // console.log(res);
                        if (res.Msg == "邀请码错误") {
                            Toast.fail("邀请码错误");
                            (this.valueDio = ""), done();
                        } else if (res.Msg == "邀请码已被使用") {
                            Toast.fail("邀请码已被使用");
                            (this.valueDio = ""), done();
                        } else if (res.Msg == "true") {
                            (this.valueDio = ""), done();
                            Toast.success("邀请码使用成功");
                            this.InvitationCode = true;
                        }
                    });
                }
            }
        },
        exportExecl() {
            this.$dataApi({
                url: "api/Users/IsExistInvitationCode",
                method: "GET",
                data: {
                    openID: sessionStorage.getItem("openID"),
                },
            }).then((res) => {
                // console.log(res);
                if (res.Msg == "true") {
                    this.InvitationCode = true;
                    this.$router.push("/export");
                } else {
                    this.InvitationCode = false;
                    this.showDia = true;
                }
            });
        },
        // goIntegral() {
        //     this.$router.push("/signone");
        // },

        //判断用户是否是会员
        getUserVipT() {
            this.$dataApi({
                url: "api/Users/GetUsers",
                method: "POST",
                data: {
                    OpenID: sessionStorage.getItem("openID"),
                    IsPage: 1,
                    Source: 1,
                },
            }).then((res) => {
                if (res.Rows.length === 0 || res.Rows[0].IsMember === 0) {
                    // this.king = false;
                } else {
                    this.king = true;
                }
            });
        },
        //判断改用户是否填写过邀请码
        getUserNum() {
            this.$dataApi({
                url: "api/Users/IsExistInvitationCode",
                method: "GET",
                data: {
                    openID: sessionStorage.getItem("openID"),
                },
            }).then((res) => {
                // console.log(res);
                if (res.Msg == "true") {
                    this.InvitationCode = true;
                    this.king = true;
                } else {
                    this.InvitationCode = false;
                }
            });
        },
        phoneReg() {
            // this.active = !this.active;
        },
        //发送验证码
        getsms() {
            let that = this;
            console.log(this.tel);
            if (that.fsyzmTrue) {
                const regMobile = /^1[3|4|5|7|8][0-9]{9}$/;
                if(!regMobile.test(that.tel)){
                    Toast.fail("手机号错误");
                    return false;
                }

                that.fsyzmTrue = false;
                var time = 60;
                that.fsyzm = time + " s";
                let timer = setInterval(function () {
                    time--;

                    that.fsyzm = time + " s";
                    if (time == 0) {
                        clearInterval(timer);
                        that.fsyzmTrue = true;
                        that.fsyzm = "获取验证码";
                    }
                }, 1000);

                //发送验证码
                let params = {};
                params.tele = that.tel;
                params.type = "mqy";
                that.$axios({
                    method: "post",
                    url:
                        "https://webservice.jshcsoft.com/SSMSAPI/sendmessage.ashx",
                    data: that.qs.stringify(params),
                }).then(function (response) {
                    console.log(response);
                });
            }
        },
        //确定按钮手机号
        phoneFin() {
            let that = this;
            if (that.tel.trim() == "" || that.sms.trim() == "") {
                Toast.fail("请将信息填写完成");
                that.showDia = false;
            } else {
                let params = {};
                params.tele = that.tel;
                params.code = that.sms;
                params.type = "mqy";
                that.$axios({
                    method: "post",
                    url:
                        "https://webservice.jshcsoft.com/SSMSAPI/verifycode.ashx",
                    data: that.qs.stringify(params),
                }).then(function (response) {
                    if (response == true) {
                        that.getUpdateMember();
                        that.showDia = false;
                    } else {
                        Toast.fail("验证码错误!!!");
                        that.sms = '';
                    }
                });
            }
        },
        //确定按钮邀请码
        codeFin() {
            let that = this;
            if (that.code.trim() == "") {
                Toast.fail("邀请码为空");
                that.showDia = false;
            } else {
                that.$dataApi({
                    url: "api/Users/RegistrationInvitationCode",
                    method: "POST",
                    data: {
                        openid: sessionStorage.getItem("openID"),
                        InvitationCode: that.code,
                        sex: sessionStorage.getItem("sex"),
                        language: sessionStorage.getItem("language"),
                        city: sessionStorage.getItem("city"),
                        province: sessionStorage.getItem("province"),
                        country: sessionStorage.getItem("country"),
                        headimgurl: sessionStorage.getItem("headimgurl"),
                        subscribe_time: sessionStorage.getItem(
                            "subscribe_time"
                        ),
                        remark: sessionStorage.getItem("remark"),
                        IsUpdate: sessionStorage.getItem("IsUpdate"),
                        nickname: sessionStorage.getItem("NickName"),
                        presubscribe_time: sessionStorage.getItem(
                            "presubscribe_time"
                        ),
                        Source: 1,
                    },
                }).then((res) => {
                    // console.log(res);
                    if (res.Msg == "邀请码错误") {
                        Toast.fail("邀请码错误");
                        that.code = '';
                        that.showDia = false;
                    } else if (res.Msg == "邀请码已被使用") {
                        Toast.fail("邀请码已被使用");
                        that.code = '';
                        that.showDia = false;
                    } else if (res.Msg == "true") {
                        Toast.success("邀请码使用成功");
                        that.code = '';
                        that.showDia = false;
                        that.king = true;
                    }
                });
            }
        },
        getUpdateMember() {
            let that = this;
            that.$dataApi({
                url: "api/Users/UpdateMember",
                method: "POST",
                data: {
                    openid: sessionStorage.getItem("openID"),
                    sex: sessionStorage.getItem("sex"),
                    language: sessionStorage.getItem("language"),
                    city: sessionStorage.getItem("city"),
                    province: sessionStorage.getItem("province"),
                    country: sessionStorage.getItem("country"),
                    headimgurl: sessionStorage.getItem("headimgurl"),
                    subscribe_time: sessionStorage.getItem("subscribe_time"),
                    remark: sessionStorage.getItem("remark"),
                    IsUpdate: sessionStorage.getItem("IsUpdate"),
                    nickname: sessionStorage.getItem("NickName"),
                    presubscribe_time: sessionStorage.getItem(
                        "presubscribe_time"
                    ),
                    Origin: 1,
                    EnterpriseName: "",
                    LinkMan: sessionStorage.getItem("NickName"),
                    LinkPhone: that.tel,
                    licenseUrl: "",
                    SourceJudgment: 1,
                },
            }).then(function (response) {
                console.log(response);
                that.king = true;
                Toast.success("提交成功");
            });
        },
        //取消免费注册弹框
        closeActive() {
            this.showDia = false;
            this.tel = "";
            this.sms = "";
            this.code = "";
        },
    },
    created() {
        let that = this;
        this.show();
        this.getUserVipT();
        this.getUserNum();
        // let name1 = sessionStorage.getItem("NickName");
        // let url1 = sessionStorage.getItem("headimgurl");
        this.name = sessionStorage.getItem("NickName");
        this.url = sessionStorage.getItem("headimgurl");
    },
    beforeRouteEnter(to, from, next) {
        next((vm) => {
            if (to.path === "/my") {
                // vm.hide()
                vm.activeThr(2);
            }
        });
    },

    beforeRouteLeave(to, from, next) {
        if (to.path == "/") {
            this.hide();
        }
        next();
    },
};
</script>

<style scoped>
.kingF {
    width: 0.25rem;
    height: 0.25rem;
}
.btn {
    position: fixed;
    width: 2rem;
    height: 0.6rem;
    font-size: 0.28rem;
    font-family: Adobe Heiti Std;
    font-weight: bold;
    border: none;
    background: #bed8ff;
    color: #1e2885;
    right: 0;
    top: 1.5rem;
    border-radius: 0.8rem 0 0 0.8rem;
}
.FreeRegistration{
    position: fixed;
    width: 2rem;
    height: 0.6rem;
    font-size: 0.28rem;
    font-family: Adobe Heiti Std;
    font-weight: bold;
    border: none;
    background-image: linear-gradient(to right, #FFED67 , #FFC467);
    color: #813A01;
    right: 0;
    top: 1.5rem;
    border-radius: 0.8rem 0 0 0.8rem;
}
#app {
    height: 100%;
    width: 100%;
    position: absolute;
}
.main {
    position: fixed;
    width: 100%;
}
.a {
    color: #0099ff;
}
.phot {
    font-size: 0.3rem;
    position: fixed;
    bottom: 1rem;
    text-align: center;
    width: 100%;
}
.box {
    width: 100%;
    position: relative;
}
.touxiang {
    width: 1.2rem;
    height: 1.2rem;
    border-radius: 50%;
}
.tx {
    width: 100%;
    height: 100%;
    border: 0;
    border-radius: 50%;
    margin: 0;
}
.nav {
    display: flex;
    width: 90%;
    margin: 0 auto;
    margin-top: 0.2rem;
    border-radius: 0.1rem;
    background: #fff;
    height: 1.8rem;
}
.hea {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 4rem;
}
.hea > img:nth-of-type(1) {
    width: 100%;
    height: 4rem;
    position: fixed;
    z-index: -55;
}
.img1 {
    width: 1.2rem;
    height: 1.2rem;
    border-radius: 50%;
    border: 2px solid #fff;
}
.wxName {
    color: #fff;
    font-size: 0.3rem;
    text-align: center;
    font-family: Adobe Heiti Std R;
}
ul {
    margin-top: -0.5rem;
    border-radius: 0.5rem 0.5rem 0 0;
    background: #fff;
}
.name {
    flex: 1;
    display: flex;
    align-items: center;
    margin-left: 0.5rem;
    position: relative;
}
.np1 {
    font-size: 0.3rem;
    margin-top: -0.5rem;
    line-height: 1.4rem;
    margin: 0;
}
.set {
    font-size: 0.4rem;
    position: absolute;
    left: 83%;
    margin: 0;
    margin-right: 10%;
}
li {
    font-size: 0.3rem;
    border-bottom: 1px solid rgb(243, 237, 237);
    height: 1.2rem;
    text-align: left;
    padding-left: 0.5rem;
    background: url(../../public/image/icon-right.png) no-repeat 90% 50%;
    background-size: 0.4rem 0.4rem;
    display: flex;
    align-items: center;
}
li > span:nth-of-type(2) {
    margin-left: 0.3rem;
    font-family: Adobe Heiti Std R;
}
.span1 {
    display: block;
    width: 0.5rem;
    height: 0.5rem;
    margin-right: 0.2rem;
}
.span2 {
    display: block;
    width: 0.5rem;
    height: 0.5rem;
    margin-right: 0.2rem;
}
.span3 {
    display: block;
    width: 0.5rem;
    height: 0.5rem;
    margin-right: 0.2rem;
}
.span4 {
    display: block;
    width: 0.5rem;
    height: 0.5rem;
    margin-right: 0.2rem;
}
.span5 {
    display: block;
    width: 0.5rem;
    height: 0.5rem;
    margin-right: 0.2rem;
}
.you1 {
    margin-right: 0;
}
.you {
    margin: 0;
    margin-left: 60%;
}
.king {
    margin-top: -8%;
    margin-left: 0.2rem;
}
.king img {
    width: 0.4rem;
}
.van-popup--center {
    width: 80%;
    height: 45%;
}
.title {
    font-size: 0.35rem;
    display: block;
    text-align: center;
    width: 2rem;
    font-weight: 500;
    margin-top: 0.2rem;
    margin-bottom: 0.3rem;
}
.van-field__label {
    text-align: right;
    width: 6em;
}
.van-button--normal {
    width: 2rem;
    height: 0.7rem;
    border: 1px solid #999999;
    border-radius: 15px;
    line-height: 0.7rem;
    margin-bottom: 0.5rem;
}
.van-button--large {
    width: 80%;
    border-radius: 30px;
}
.out {
    background-color: #1989fa;
}
.vipTime {
    font-size: 0.24rem;
    color: #fff;
    margin: 0;
}

.phone {
    height: 5rem;
}
.register {
    display: flex;
    justify-content: space-around;
    height: 1rem;
    align-items: center;
    border-bottom: 1px solid #eee;
}
.register > div {
    height: 1rem;
    width: 50%;
    line-height: 1rem;
}
/* .register > div:nth-of-type(1) {
    border-right: 1px solid #eee;
} */
.registerBtnT {
    color: #0099ff;
}
.registerBtnF {
    color: #333;
}
.btnbox {
    width: 100%;
    padding-top: 0.2rem;
    position: absolute;
    bottom: 0.2rem;
}
.btnShowT {
    background: #006bdf;
    border: none;
    color: #fff;
    padding: 0 0.3rem;
    margin-right: 0.5rem;
    height: 0.6rem;
    border-radius: 0.1rem;
}
.btnShowF {
    background: #fff;
    border: 1px solid #999;
    color: #333;
    padding: 0 0.3rem;
    border-radius: 0.1rem;
    height: 0.6rem;
}
.van-button--small{
    background: none;
    color: #006BDF;
}
</style>