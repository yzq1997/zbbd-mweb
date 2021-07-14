<template>
    <div class="box">
        <!-- 用户验证 -->
        <van-dialog v-model="codeShow" :show-confirm-button=false class="phone">
            <div class="register">
                <div :class="active?'registerBtnT':'registerBtnF'" @click="phoneReg">手机号码注册</div>
                <!-- <div :class="!active?'registerBtnT':'registerBtnF'" @click="phoneReg">邀请码注册</div> -->
            </div>

            <div v-if="active">
                <p style="margin:12px">免费注册可享更多权益!</p>
                <van-field v-model="tel" type="tel" label="手机号码" placeholder="请输入手机号码"/>
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
                <div class="btnbox1">
                    <button class="btnShowT" @click="phoneFin">确定</button>
                    <button class="btnShowF" @click="closeActive">取消</button>
                </div>
            </div>

            <div v-if="!active">
                <p style="margin:12px">免费注册可享更多权益!</p>
                <van-field v-model="code" label="邀请码" placeholder="请输入邀请码"/>
                <div class="btnbox1">
                    <button class="btnShowT" @click="codeFin">确定</button>
                    <button class="btnShowF" @click="closeActive">取消</button>
                </div>
            </div>
        </van-dialog>


        <div class="main">
            <ul>
                <li>
                    <div class="left">
                        每日签到
                        <p>+30</p>
                    </div>
                    <button v-if="!qdstatus" @click="qdsign" class="buttonone">去完成</button>
                    <button v-if="qdstatus" class="buttontwo">已完成</button>
                </li>
                <li>
                    <div class="left">
                        好友助力
                        <p>+30</p>
                    </div>
                    <button v-if="!zlstatus" @click="getMore" class="buttonone">去完成</button>
                    <button v-if="zlstatus" class="buttontwo">已完成</button>
                </li>
                <li>
                    <div class="left">
                        免费注册
                        <p>+100</p>
                    </div>
                    <button v-if="!zcstatus" @click="zcbdding" class="buttonone">去完成</button>
                    <button v-if="zcstatus"   class="buttontwo">已完成</button>
                </li>
                <li>
                    <div class="left">
                        设置关键词
                        <p>+30</p>
                    </div>
                   <button v-if="!gjcstatus" @click="getKeyword" class="buttonone">去完成</button>
                    <button v-if="gjcstatus" class="buttontwo">已完成</button>
                </li>
            </ul>
        </div>
    </div>
</template>

<script>
import Vue from "vue";
import { Toast } from "vant";
Vue.use(Toast)
export default {
    data() {
        return {
            qdstatus:false,
            zlstatus:false,
            zcstatus:false,
            gjcstatus:false,
            codeShow:false,  //会员注册弹框
            active: true, //哪种注册方式
            fsyzm: "发送验证码",
            fsyzmTrue: true, //是否在60秒
            tel: "", //手机号
            sms: "", //验证码
            code: "", //邀请码
        };
    },
    methods: { 

        //获取当前状态
        GetPointsTask:function(){
            this.$dataApi({
                url: "api/SignInPoints/GetPointsTask",
                method: "POST",
                data: {
                    openId: sessionStorage.getItem("openID"),
                    NickName: sessionStorage.getItem("NickName"),
                }
            }).then(response => {
                response.IsSignIn==1?this.qdstatus=true:"";
                response.IsFriendHelp==1?this.zlstatus=true:"";
                response.IsFreeRegistraton==1?this.zcstatus=true:"";
                response.IsSetKeyWord==1?this.gjcstatus=true:"";
            });
        },

        qdsign:function(){
            this.$router.go(-1)
        },

        //点击获取更多积分
        getMore(){
            this.$router.push("./share");
        },

        getKeyword(){
            this.$router.push("./keyWords");
        },
        
        zcbdding(){
            this.codeShow = true;
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
                that.codeShow = false;
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
                        that.codeShow = false;
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
                that.codeShow = false;
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
                        that.codeShow = false;
                    } else if (res.Msg == "邀请码已被使用") {
                        Toast.fail("邀请码已被使用");
                        that.code = '';
                        that.codeShow = false;
                    } else if (res.Msg == "true") {
                        Toast.success("邀请码使用成功");
                        that.getUserNum()
                        that.code = '';
                        that.codeShow = false;
                        that.zcstatus = true;
                        this.$router.go(0);
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
                that.zcstatus = true
                that.getUserNum()
                Toast.success("提交成功");
                that.yaoqingma();
                location.reload();
            });
        },
        //取消免费注册弹框
        closeActive() {
            this.codeShow = false;
            this.tel = "";
            this.sms = "";
            this.code = "";
        },
        //获取用户积分
        getUserNum() {
            this.$dataApi({
                url: "api/SignInPoints/GetUserCurrentPoint",
                method: "POST",
                data: {
                    Openid: sessionStorage.getItem("openID")
                }
            }).then(response => {
            });
        }
       
    },
    created(){
        this.GetPointsTask();
    }
};
</script>

<style lang="scss" scoped>
.box {
    background: #f2f2f2;
    min-height: 100%;
    overflow: hidden;
}
.tab {
    background: #f2f2f2;
    // position: fixed;
    width: 100%;
    height: 1.5rem;
    padding-top: 0.5ren;
    z-index: 99;
    button {
        background: none;
        border: 1px solid #419be9;
        color: #fff;
        font-size: 0.36rem;
        background: #419be9;
        width: 50%;
        height: 0.9rem;
        border-radius: 0.6rem;
        // position: fixed;
        position: absolute;
        font-family: Microsoft YaHei;
        margin-top: 0.3rem;
    }
    .btn_1 {
        left: 5%;
        background: #419be9;
        z-index: 5;
    }
    .btn_2 {
        right: 5%;
        background: #fff;
        color: #000;
    }
    .btn_3 {
        background: #419be9;
        color: #fff;
        z-index: 10;
    }
    .btn_4 {
        background: #fff;
        color: #000;
    }
}
li {           
    display: flex;
    width: 80%;
    margin: 0 5%;
    padding: 0 5%;
    height: 1.3rem;
    background: #fff;
    justify-content: space-between;
    margin-top: 0.3rem;
    border-radius: 0.1rem;
    .left {
        font-size: 0.3rem;
        line-height:1.3rem;
        p {
            font-size: 0.24rem;
            margin: 0;
            // margin-top: 0.15rem;
            text-align: left;
        }
        p:nth-of-type(1) {
            font-size: 0.35rem;
            font-family: Microsoft YaHei;
            float:right;
        }
        p:nth-of-type(2) {
            font-size: 0.24rem;
            font-family: Microsoft YaHei;
            color: #999;
        }
        
    }
    button {
            height: 0.6rem;
            // width: 1.5rem;
            padding: 0 0.3rem;
            font-size: 0.3rem;
            border: none;
            border-radius: 30px;
            margin-top: 0.3rem;
            
            color: #FFFFFF;
        }
        .buttonone{
            background-color: #169bd5;
        }
        .buttontwo{
            background-color: #999999;
        }
    .right {
        font-size: 0.36rem;
        line-height: 1.3rem;
    }
}
li:last-child{
    margin-bottom: 0.3rem;
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
// .register > div:nth-of-type(1) {
//     border-right: 1px solid #eee;
// }
.registerBtnT {
    color: #0099ff;
}
.registerBtnF {
    color: #333;
}
.btnShowT {
    background: #006bdf;
    border: none;
    color: #fff;
    /* width: 1.2rem; */
    padding: 0 0.3rem;
    margin-right: 0.5rem;
    height: 0.6rem;
    border-radius: 0.1rem;
}
.btnShowF {
    background: #fff;
    border: 1px solid #999;
    color: #333;
    /* width: 1.2rem; */
    padding: 0 0.3rem;
    border-radius: 0.1rem;
    height: 0.6rem;
}
.btnbox1 {
    width: 100%;
    padding-top: 0.2rem;
    position: absolute;
    bottom: 0.2rem;
}
.van-button--small{
    background: none;
    color: #006BDF;
}
</style>