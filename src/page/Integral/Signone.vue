<template>
    <div class="box" :style="{background: 'url(' + newbg + ') no-repeat','background-size':'100% 100%'}">
        <!-- 积分 -->
        <div class="num">
            <!-- <img src="../../../public/image/heaban.png" alt /> -->
            <div @click="record" class="dhrecord">积分记录</div>
            <div class="signmodel">
                <div class="signmodel-left">
                    <!-- <span class="add" v-if="!isadd">+30</span> -->
                    <p><span style="float:left">积分:</span><img src="../../../public/image/jf.png"/><countTo :startVal="0" :endVal="sign" :duration="3000"></countTo> </p>
                    <p>已签到<span>{{qddnum}}</span>天</p>
                </div>
                <!-- <div class="signmodel-center">
                    <button>{{qdtitle}}</button>
                </div> -->
                <img v-if="!signstatus" style="width:2.7rem;height:1rem"  @click="addjf" src="../../../public/image/sign.png" alt="" srcset="">
                <img v-if="signstatus" style="width:2.7rem;height:1rem"  src="../../../public/image/yjsign.png" alt="" srcset="">
                <img @click="goGain" class="rl" src="../../../public/image/rl.png" alt="">
            </div>
        </div>
 
        <!-- 转盘 -->
        <div class="luck">
            <!-- <div class="xydzp"></div> -->
            <div class="xyzp">
                <div class="wheel-main">
                    <!-- <div class="wheel-pointer" @click="beginRotate()"></div> -->
                    <img
                        class="wheel-pointer"
                        @click="beginRotate()"
                        src="../../../public/image/qx2.png"
                        alt
                    />
                    
                    <div class="wheel-bg" :style="rotateStyle">
                        <img class="zp_999" src="../../../public/image/zp999.png" alt />
                        <div class="prize-list">
                            <div
                                class="prize-item"
                                v-for="(item,index) in prizeList"
                                :key="index"
                                :style="item.style"
                            >
                                <div class="prize-type">{{item.name}}</div>
                                <div class="prize-pic">
                                    <img :src="item.icon" />
                                </div>
                                <!-- <div class="prize-type">{{item.name}}</div> -->
                            </div>
                        </div>
                    </div>
                </div>
                <p @click="beginRotate()">立即抽奖</p>
                <p @click="beginRotate()"><img class="cjimg"  src="../../../public/image/jf.png"/>150积分/次</p>
            </div>
            <div class="foot">
                <img src="../../../public/image/zj.png" alt />
                <!-- <img src="../../../public/image/footban.png" alt /> -->
                <button @click="getMore()">获取更多积分</button>
            </div>
        </div>

        <!-- 规则 -->
        <van-popup v-model="show1">
            <div class="ruler">
                <p>活动规则</p>
                <p>用户签到每天赠送30积分，用户连续签到7天赠送用户一次抽奖机会。</p>
                <p>如果用户中间断签则不会赠送抽奖机会。</p>
                <p>用户可通过积分兑换补签卡来对漏签的天数进行补签操作。</p>
                <p>用户可通过“获得更多积分”邀请好友助力每天最多可获得30积分。</p>
            </div>
            <div class="ruler_qx" @click="show1 = false"></div>
        </van-popup>

        <!-- 兑换 -->
        <van-popup v-model="exchangeShow">
            <div class="exchange">
                <div class="kyjf">
                    <p>可用积分:{{sign}}</p>
                </div>
                <div class="bq bq1">
                    <!-- <div></div> -->
                    <img src="../../../public/image/dhbq.png" alt />
                    <div>
                        <p class="bqk">补签卡</p>
                        <p class="bqjf">60积分/次</p>
                    </div>
                    <div @click="duihuan(1)">立即兑换</div>
                </div>
                <div class="bq">
                    <!-- <div></div> -->
                    <img src="../../../public/image/dhhy.png" alt />
                    <div>
                        <p class="bqk">七天会员体验卡</p>
                        <p class="bqjf">90积分/次</p>
                    </div>
                    <div @click="duihuan(2)">立即兑换</div>
                </div>
                <!-- <div class="bq hy">
                    <div></div>
                    <div>
                        <p class="bqk">现金抽奖</p>
                        <p class="bqjf">210积分/次</p>
                    </div>
                    <div @click="duihuan(3)">立即兑换</div>
                </div>-->
            </div>
            <div class="ruler_qx" @click="exchangeShow = false"></div>
        </van-popup>

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

        <!-- 中奖弹框 -->
        <van-popup v-model="Win">
            <div class="win">
                <img src="../../../public/image/yzj.png" alt />
                <p class="win_p">恭喜您中奖了!</p>
                <p class="winNum">
                    ￥
                    <span>{{RedEnvelopes}}</span>元现金红包
                </p>
                <button @click="gomoney()">领取</button>
            </div>
            <div class="win_qx" @click="Win = false"></div>
        </van-popup>

        <!-- 未中奖弹框 -->
        <van-popup v-model="noWin" >
            <div class="nowin">
                <img src="../../../public/image/wzj.png" alt />
                <div class="win_qx" @click="noWin = false"></div>
            </div>
        </van-popup>

        <van-popup v-model="gzh" :close-on-click-overlay="isGZH">
            <img class="gzhimg" src="../../../public/image/gzh.jpg" alt="">
            <van-divider />
            <p style="font-size:0.35rem;color:#fff">请先关注招标宝典公众号</p>
        </van-popup>


        <van-overlay :show="activeShow" @click="activeShow = true">
            <div class="wrapper" @click.stop>
                <p class="active_p">该活动已结束</p>
            </div>
        </van-overlay>
    </div>
</template>

<script>
import Vue from "vue";
import countTo from "vue-count-to";
import { Popup, Dialog, Toast, Field, Button,Overlay  } from "vant";
import { prizeList } from "../../util/changeData.js";
import { mapMutations } from 'vuex';
import wx from 'weixin-js-sdk';
import newbg from '../../../public/image/newbg.png'

import CryptoJS from "crypto-js";
const CRYPTOJSKEY= "wx9cec35e64dce69";

const CIRCLE_ANGLE = 360;
// const md5 = require("md5");
const config = {
    // 总旋转时间
    duration: 8000,
    // 旋转圈数
    circle: 8,
    mode: "ease-in-out"
};

Vue.use(Popup)
    .use(Dialog)
    .use(Toast)
    .use(Button)
    .use(Overlay)
    .use(Field);
export default {
    components: {
        countTo,
    },
    data() {
        return {
            isGZH:false,
            signstatus:true,
            newbg:newbg,
            qddnum:0,
            jf:0,
            qdtitle:"签到",
            show1: false, //规则弹框是否显示
            exchangeShow: false, //兑换弹框是否显示
            sign: 0, //可用积分：
            signature: 0, //补签卡：
            count: 10000, // 剩余抽奖次数
            duration: 3000, // 转盘旋转时间
            prizeList: [], // 奖品列表
            rotateAngle: 0, // 旋转角度
            index: 0,
            prize: null,
            codeShow:false,  //会员注册弹框
            active: true, //哪种注册方式
            fsyzm: "发送验证码",
            fsyzmTrue: true, //是否在60秒
            tel: "", //手机号
            sms: "", //验证码
            code: "", //邀请码
            cjNum: "", //抽奖次数
            Win: false, //中奖弹框
            noWin: false, //未中奖弹框
            isTrueQD: false, //今日是否签到
            userPhone: false, //用户是否留有手机号码
            RedEnvelopes: "", //红包金额
            xydzp: true, //进度条大转盘
            zdt:[
                {zdt:false},
                {zdt:false},
                {zdt:false},
                {zdt:false},
                {zdt:false},
                {zdt:false},
                {zdt:false},
            ],
            isadd:false,
            isvip:null,
            menay:1,
            gzh:false,
            activeShow:true
        };
    },
    methods: {
        ...mapMutations(['hide','show']),
        //MD5加密
        encrypt(plaintText) {
            var plaintText = plaintText;
            var options = {
                mode: CryptoJS.mode.ECB,
                padding: CryptoJS.pad.Pkcs7
            };
            var key = CryptoJS.enc.Utf8.parse(CRYPTOJSKEY);
            var encryptedData = CryptoJS.AES.encrypt(plaintText, key, options);
            // var encryptedBase64Str = encryptedData.toString().replace(/\//g, "_");
            // var encryptedBase64Str =  encryptedData.toString().replace(/\+/g,"-");
            return encryptedData.toString();
        },

        addzl:function(e){
            // 判断是否关注公众号
                
            this.$dataApi({
                url:"api/WechatPayment/IsUserSubscribe",
                method:"GET",
                data:{
                    OpenId:sessionStorage.getItem("openID")
                }
            }).then(res=>{
                if(res.IsUserSubscribe){
                    this.gzh=false;
                }else {
                    this.gzh=true;
                }
            })
        },

        //跳转积分任务页面
        goGain() {
            this.$router.push("./Gain");
        },
        //规则弹框显示
        ruler() {
            this.show1 = true;
        },
        //跳转积分记录页面
        record() {
            this.$router.push("./record");
        },
        //兑换弹框显示
        exchange() {
            this.exchangeShow = true;
        },
        //点击兑换按钮
        duihuan(i) {
            if (i == 1) {
                if (this.sign < 60) {
                    Toast.fail("积分不足");
                } else {
                    Dialog.confirm({
                        title: "兑换权益",
                        message: "确定兑换此项权益么?"
                    })
                        .then(() => {
                            // this.exchangeShow = false;
                            this.$dataApi({
                                url: "api/SignInPoints/UserExchangeCard",
                                method: "POST",
                                data: {
                                    Openid: sessionStorage.getItem("openID"),
                                    CardName: "ReissueCard",
                                    HeadingUrl: sessionStorage.getItem(
                                        "headimgurl"
                                    ),
                                    NickName: sessionStorage.getItem("NickName")
                                }
                            }).then(response => {
                                if (response.Status == 200) {
                                    this.getUserNum();
                                    this.getUesrCard();
                                    Toast.success("兑换成功");
                                }
                            });
                        })
                        .catch(() => {
                        });
                }
            } else if (i == 2) {
                if (this.sign < 90) {
                    Toast.fail("积分不足");
                } else {
                    Dialog.confirm({
                        title: "兑换权益",
                        message: "确定兑换此项权益么?"
                    })
                        .then(() => {
                            this.exchangeShow = false;
                            this.$dataApi({
                                url: "api/SignInPoints/UserExchangeCard",
                                method: "POST",
                                data: {
                                    Openid: sessionStorage.getItem("openID"),
                                    CardName: "ExperienceCard",
                                    HeadingUrl: sessionStorage.getItem("headimgurl"),
                                    NickName: sessionStorage.getItem("NickName")
                                }
                            }).then(response => {
                                console.log(response);
                                
                                if (response.Status == 200) {
                                    this.getUserNum();
                                    Toast.success("兑换成功");
                                }
                            });
                        })
                        .catch(() => {
                        
                        });
                }
            }
        },
       
        //获取用户剩余抽奖次数
        getcjNum() {
            this.$dataApi({
                url: "api/LotteryDraw/GetRemainingDraws",
                method: "GET",
                data: {
                    openid: sessionStorage.getItem("openID")
                }
            }).then(response => {
                // console.log(response);
                this.cjNum = response.RemainingTimes;
            });
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
                // console.log(response.availablePoints);
                this.sign = response.availablePoints;
            });
        },
    
        //获取用户抽奖次数
        getUserCjNum() {
            this.$dataApi({
                url: "api/LotteryDraw/GetRemainingDraws",
                method: "GET",
                data: {
                    openId: sessionStorage.getItem("openID")
                }
            }).then(response => {
                // console.log(response);
                this.cjNum = response.RemainingTimes;
            });
        },
        //判断用户是否留有手机号码
        getUsrePhone() {
            this.$dataApi({
                url: "api/LotteryDraw/IsLeaveLinkPhone",
                method: "GET",
                data: {
                    openid: sessionStorage.getItem("openID")
                }
            }).then(response => {
                // console.log(response);
                if (response.IsLeaveLinkPhone == "False") {
                    this.userPhone = true;
                } else {
                    this.userPhone = false;
                }
                // this.signature = response.LeftCards;
            });
        },
        //保存用户手机号码
        saveUserPhone() {
            this.$dataApi({
                url: "api/LotteryDraw/SaveUserLinkPhone",
                method: "POST",
                data: {
                    openId: sessionStorage.getItem("openID"),
                    LinkPhone: this.value
                }
            }).then(response => {
                // console.log(response);
            });
        },
        //点击获取更多积分
        getMore(){
            this.$router.push("./share");
        },
        //领取红包
        gomoney(){
            let that = this;
            if(that.menay == 1){
                that.menay = 2;
                Toast.success("注意查收红包哦...");
                // alert(that.RedEnvelopes)
                that.$dataApi({
                    url: "api/WechatPayment/SendRedPacket",
                    method: "POST",
                    data: {
                        openid: that.encrypt(sessionStorage.getItem("openID")),
                        moneny: that.RedEnvelopes
                    }
                }).then(response => {
                    wx.closeWindow();
                });
            }
        },
        //抽奖转盘事件
        beginRotate() {
            // Toast.fail("当前功能维护中,敬请期待!!");
            this.getUserVipT();
            // var timestamp1 = Date.parse( new Date());
            // timestamp1=timestamp1.toString().substring(0,10);
            // // timestamp1 = Number(timestamp1).toString(16)
            // console.log(timestamp1);

            // let flagNum = Math.floor((Math.random()+Math.floor(Math.random()*9+1))*Math.pow(10,9))
            // console.log(flagNum);

            // let str = sessionStorage.getItem("openID") + '&' + timestamp1.toString() + '&' + flagNum.toString();
            // console.log(this.encrypt(str));
            
        },
        //判断用户是否是会员
        getUserVipT(){
            var a="";
            this.$dataApi({
                url: "api/Users/GetUsers",
                method: "POST",
                data: {
                    OpenID: sessionStorage.getItem("openID"),
                    IsPage: 1,
                    Source: 1
                }
            }).then(res => {
                if (res.Rows.length === 0 || res.Rows[0].IsMember === 0) {
                   this.codeShow=true;
                } else {
                    if (this.sign < 150) {
                    Toast.fail("当前积分不足");
                    return false;
                } else {
                    this.rotating();
                }
                };
            });
        },
        random(max, min = 0) {
            return parseInt(Math.random() * (max - min + 1) + min);
        },
        //旋转方法----修改关闭抽奖中将几率---2.8
        rotating() {
            let that = this;
            // console.log(that.encrypt('0.5'));
            // return false;
            const { isRotating, angleList, config, rotateAngle, index } = this;

            if (isRotating) return;
            this.isRotating = true;
            this.$dataApi({
                url: "api/LotteryDraw/StartDraw",
                method: "POST",
                data: {
                    openId:that.encrypt(sessionStorage.getItem("openID")),
                    NickName:sessionStorage.getItem("NickName"),
                    HeadingUrl:sessionStorage.getItem("headimgurl")
                }
            }).then(response => {
                console.log(response);
                if(!response){
                    this.sign=this.sign-150;
                    this.index = 3;
                    that.$dataApi({
                        url: "api/LotteryDraw/ReduceUserPoints",
                        method: "POST",
                        data: {
                            openId: sessionStorage.getItem("openID"),
                        }
                    }).then(res=>{
                        // console.log(res);
                    })
                }else{
                    this.sign=this.sign-150;
                    let money = [1, 5, 7];
                    if (response.Msg == "谢谢参与") {
                        this.index = 3;
                    } else {
                        this.index = money[Math.floor(Math.random() * money.length)];
                        this.RedEnvelopes = Number(response.Msg);
                    };
                
                }
                
                // this.sign=this.sign-150;
                // this.index = 3;

                // console.log(this.index);

                // 减少剩余抽奖次数
                this.cjNum--;

                this.isRotating = true;

                // 计算角度
                const angle =
                    // 初始角度
                    rotateAngle +
                    // 多旋转的圈数
                    config.circle * CIRCLE_ANGLE +
                    // 奖项的角度
                    angleList[this.index] -
                    (rotateAngle % CIRCLE_ANGLE);

                this.rotateAngle = angle;

                // 旋转结束后，允许再次触发
                setTimeout(() => {
                    this.rotateOver();
                }, config.duration + 500);
            });

            
        },
        rotateOver() {
            this.isRotating = false;

            this.prize = prizeList[this.index];

            // console.log(this.prize, this.index);
            if (this.index == 3) {
                this.noWin = true;
            } else {
                this.Win = true;
            }
            // this.Win = true;
        },
        initPrizeList() {
            // 这里可以发起请求，从服务端获取奖品列表
            // 这里使用模拟数据
            this.prizeList = this.formatPrizeList(prizeList);
        },
        // 格式化奖品列表，计算每个奖品的位置
        formatPrizeList(list) {
            // 记录每个奖的位置
            const angleList = [];

            const l = list.length;
            // 计算单个奖项所占的角度
            const average = CIRCLE_ANGLE / l;

            const half = average / 1;

            // 循环计算给每个奖项添加style属性
            list.forEach((item, i) => {
                // 每个奖项旋转的位置为 当前 i * 平均值 + 平均值 / 2
                const angle = -(i * average + half);
                // 增加 style
                item.style = `-webkit-transform: rotate(${angle}deg);
                      transform: rotate(${angle}deg);`;

                // 记录每个奖项的角度范围
                angleList.push(i * average + half);
            });
            // console.log(angleList);

            this.angleList = angleList;

            return list;
        },
        // 点击签到
        addjf:function(){
            let that = this;

            // if(!this.signstatus){
                // that.SaveVisitRecord();   //添加访问记录
                // that.AddUserTriggerEvent();  //添加抽奖次数
                // this.$dataApi({
                // url: "api/SignInPoints/SaveUserSignInDaily",
                // method: "POST",
                // data: {
                //     openId: sessionStorage.getItem("openID"),
                //     NickName: sessionStorage.getItem("NickName")
                // }
                // }).then(response => {
                //     // console.log(response)
                //     if(response.Status == 200){
                //         response.SignInStatus=="已签到"?this.signstatus=true:"";
                //         this.qddnum=response.ContinuedSignInDays;
                //         that.sign=that.sign+30;
                //     }
                // });
                // this.sign=this.sign+30;
            // }
        },
        GetUserSignInDaily:function(){
            this.$dataApi({
                url: "api/SignInPoints/GetUserSignInDaily",
                method: "POST",
                data: {
                    openId: sessionStorage.getItem("openID"),
                }
            }).then(response => {
                console.log(response)
                response.SignInStatus=="已签到"?this.signstatus=true:this.signstatus=false;
                this.qddnum=response.ContinuedSignInDays;
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
                        Toast.fail("手机号错误!!!");
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
                        this.getUserNum();
                        that.code = '';
                        that.codeShow = false;
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
                // console.log(response);
                Toast.success("注册成功");
                that.getUserNum();
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
        getUUID: function () {
            var nowDate = new Date();
            this.$dataApi({
                url: "api/UserSharing/GenerateShringUuid",
                method: "POST",
                data: {
                    OpenId: sessionStorage.getItem("openID"),
                    CurrentTime: nowDate
                        .toLocaleDateString()
                        .replace(new RegExp("/", "gm"), "-"),
                },
            }).then((res) => {
                sessionStorage.setItem("ID", res.UUID);
            });
        },

        //添加抽奖次数
        AddUserTriggerEvent(){
            let that = this;
            that.$dataApi({
                url:'api/Users/AddUserTriggerEvent',
                method:'POST',
                data:{
                    OpenId:sessionStorage.getItem("openID"),   
                    EventName:'抽奖',
                    JudgeValue:1
                }
            }).then(response=>{
                sessionStorage.setItem("saveCJnum", 1);
            });
        },
        //添加访问记录
        SaveVisitRecord(){
            let that = this;
            this.$dataApi({
                url:"api/Users/SaveVisitRecord",
                method:"POST",
                data:{
                    openid:sessionStorage.getItem("openID"),
                    Origin:1
                }
            }).then(res=>{});
        }
    },
    
    beforeRouteLeave(to, from, next) {
        this.show();
        next();
    },
    computed: {
        rotateStyle() {
            return `
            -webkit-transition: transform ${this.config.duration}ms ${this.config.mode};
            transition: transform ${this.config.duration}ms ${this.config.mode};
            -webkit-transform: rotate(${this.rotateAngle}deg);
            transform: rotate(${this.rotateAngle}deg);`;
        }
    },
    mounted:function(){
        //得到参数
        this.nikeName = sessionStorage.getItem("NickName")
        var appId = 'wx9cec35e64dce69fc';
        var link=window.location.href;
        sessionStorage.setItem("signone",link);
        //配置自定义分享内容
        window.share_config = {
            share: {
                imgUrl: 'http://weixin.jshcsoft.com/biddingbook/mweb/static/img/logo.8744cdb.png', // 这里是需要展示的图标
                desc: '全国招标信息免费看,实时推送',
                title: `您的好友${this.nikeName}向您推荐了招标宝典`, // 这是分享展示卡片的标题
                link: link, // 这里是分享的网址
                success: function(rr) {
                    Toast.success("分享完成")
                },
                cancel: function(tt) {
                    console.log(tt);
                }
            }
        };
        //通过微信config接口注入配置
        wx.config({
            debug: false, // 默认为false  为true的时候是调试模式，会打印出日志
            appId: appId,
            timestamp: sessionStorage.getItem("timestamp"),
            nonceStr: sessionStorage.getItem("nonceStr"),
            signature: sessionStorage.getItem("signature"),
            jsApiList: [
                'checkJsApi',
                'onMenuShareTimeline',
                'onMenuShareAppMessage',
                'onMenuShareQQ', 
            ]
        });
        
        wx.ready(function() {
            wx.onMenuShareAppMessage(share_config.share); // 微信好友
            wx.onMenuShareTimeline(share_config.share); // 微信朋友圈
            wx.onMenuShareQQ(share_config.share); // QQ
            // wx.updateAppMessageShareData(share_config.share);
        });
    },

    created() {
        // 基本配置
        let that = this;
        this.AddUserTriggerEvent(); //添加抽奖次数
        that.addzl();
        that.getUUID();
        this.config = config;
        this.hide(); //tabbar消失
        this.initPrizeList(); //旋转方法
        this.getUserNum(); //获取用户积分
        this.getUserCjNum(); //获取用户抽奖次数
        this.getUsrePhone(); //判断用户是否留有手机号码
        this.getcjNum(); //获取用户剩余抽奖次数
        this.GetUserSignInDaily();  //获取当日签到状态
    }
};
</script>

<style lang="scss" scoped>
#app{
    background: url("../../../public/image/newbg.png")
}
.box {
    width: 100%;
    height: 100%;
    background: #5482f7;
    background: url("../../../public/image/newbg.png")
}
.num {
    width: 100%;
    height: 3.5rem;
    overflow: hidden;
    position: relative;
    > img {
        display: block;
        width: 100%;
        height: 3.56rem;
        position: absolute;
        z-index: 1;
    }
    .num_p {
        width: 3.6rem;
        height: 0.36rem;
        background: #285ce5;
        border-radius: 0.2rem;
        color: #fff;
        margin: 0 auto;
        margin-top: 1.7rem;
        font-size: 0.24rem;
        position: relative;
        z-index: 2;
    }
    .dhrecord{
        color: #FFFFFF;
        font-weight: 0.26rem;
        font-size: 0.26rem;
        line-height: 0.28rem;
        border-bottom: 1px solid #FFFFFF;
        z-index: 4;
        width: 1.05rem;
       margin-right: 0.4rem;
        margin-top: 0.15rem;
        font-weight: bold;
        float: right;

    }
    .signmodel{
        overflow: hidden;
        margin-top: 2.25rem;
        display: flex;
        align-items: center;
        z-index:4;
        .signmodel-left{
            float: left;
            height: 1rem;
            width: 2rem;
            margin-left: 0.4rem;
            margin-right: 0.4rem;
            img{
                    float: left;
                    width: 0.4rem;
                    height: 0.3rem;
                }
            p{  
                line-height: 0.36rem;
                font-size: 0.3rem;
                color: #FFFFFF;
                margin: 0 auto;
                text-align: left
                
            }
            .add{
                position: fixed;
                top: 1.9rem;
                left: 1.07rem;
                line-height: 0.36rem;
                font-size: 0.3rem;
                color: #FFFFFF;
                margin: 0 auto;
                text-align: left;
            }
            :nth-of-type(1){
                margin-bottom: 0.2rem
                
            }
            :nth-of-type(2){
                span{
                    color: yellow;
                    font-weight: bold;
                    margin: 0.1rem
                }
            }
        }

        .rl{
            width: 0.92rem;
            margin-left: 0.6rem;
            height: 1rem;
        }
        .signmodel-center{
            width: 2.7rem;
            height: 0.9rem;
            font-size: 0.48rem;
            line-height: 0.38rem;
            border-radius: 30px;
            border: none;
            display: block;
        }
    }
}
.jifenBox {
    display: flex;
    z-index: 3;
    .jifenBox_1 {
        position: relative;
        z-index: 4;
        margin-left: 20%;
        p {
            font-size: 0.3rem;
            color: #fff;
            text-align: left;
            margin: 0;
            margin-top: 0.2rem;
        }
    }
    .jifenBox_2 {
        line-height: 0.55rem;
        margin: 0;
        margin-top: 0.3rem;
        font-size: 0.24rem;
        width: 1.5rem;
        height: 0.5rem;
        border: none;
        background: #fff;
        border-radius: 0.5rem;
        color: #2b54bc;
        margin-left: 20%;
        position: relative;
        z-index: 4;
    }
}
.sign {
    width: 100%;
    background: url(../../../public/image/qdbj.png) no-repeat;
    .seven {
        width: 90%;
        height: 7.4rem;
        margin-left: 5%;
        background: #fff;
        border-radius: 0.5rem;
        overflow: hidden;
        position: relative;
        > div:nth-of-type(1) {
            width: 94%;
            height: 4.5rem;
            background: #3867dd;
            margin-left: 3%;
            margin-top: 3%;
            border-radius: 0.5rem;
            display: flex;
            flex-wrap: wrap;
            align-items: top;
            padding-top: 0.1rem;
            padding-bottom: 0.7rem;
            > div {
                width: 22%;
                height: 1.9rem;
                background-image: radial-gradient(#fff, #dfe5f7);
                margin-left: 2.4%;
                border-radius: 0.2rem;
                margin-top: 3%;
                position: relative;
            }
            div:nth-of-type(7) {
                width: 46%;
            }
        }
        > div:nth-of-type(2) {
            height: 0.5rem;
            display: flex;
            padding: 0 8%;
            justify-content: space-between;
            margin-top: 0.2rem;
            span {
                display: block;
                height: 0.5rem;
                margin: 0;
                font-size: 0.24rem;
                color: #3e97fb;
            }
        }
        > div:nth-of-type(3) {
            // height: 0.8rem;
            p {
                width: 3.6rem;
                line-height: 0.7rem;
                height: 0.7rem;
                font-size: 0.32rem;
                margin: 0 auto;
                border-radius: 0.5rem;
                background: #4d91ee;
                font-family: Adobe Heiti Std;
                color: #fff;
            }
        }
        .bar {
            width: 90%;
            margin-left: 5%;
            height: 0.7rem;
            // background: pink;
            position: absolute;
            top: 64%;
            border-radius: 0.2rem;
            display: flex;
            align-items: center;
            justify-content: center;
            > div:nth-of-type(1) {
                width: 4.9rem;
                height: 0.16rem;
                background: url(../../../public/image/zdt8.png) no-repeat;
                background-size: 100% 100%;
                position: relative;
                img{
                    position: absolute;
                    height: 0.16rem;
                    left: 0;
                }
            }
            > div:nth-of-type(2) {
                width: 20%;
                height: 1rem;
                img {
                    display: block;
                    width: 100%;
                    height: 100%;
                }
            }
        }
    }
}
.s_box > div {
    p {
        font-size: 0.24rem;
        margin: 0;
        margin-top: 0.2rem;
        padding-bottom: 0.1rem;
        border-bottom: 1px dashed #999;
    }
    > div:nth-of-type(1) {
        display: flex;
        flex-direction: column;
        align-items: center;
        height: 1.2rem;
        justify-content: space-around;
        img {
            display: block;
            width: 0.78rem;
            height: 0.57rem;
            margin: 0 auto;
        }
        button {
            width: 1rem;
            background: #648fff;
            border: none;
            border-radius: 0.2rem;
            font-size: 0.24rem;
            color: #fff;
        }
    }
    .box_7 {
        display: flex;
        flex-direction: row !important;
    }
    .box_7 > div:nth-of-type(1) {
        display: flex;
        flex-direction: column;
        align-items: center;
        height: 1.2rem;
        margin-left: 0.2rem;
        justify-content: space-around;
        img {
            display: block;
            width: 0.78rem;
            height: 0.57rem;
            margin: 0 auto;
        }
        button {
            width: 1rem;
            background: #648fff;
            border: none;
            border-radius: 0.2rem;
            font-size: 0.24rem;
            color: #fff;
        }
    }
    .box_7 > div:nth-of-type(2) {
        font-size: 0.34rem;
        color: #3042b0;
    }
    .box_7 > img {
        width: 1.4rem !important;
        height: 1.4rem !important;
    }
}
.zzc {
    width: 100%;
    height: 1.9rem;
    position: absolute;
    top: 0;
    border-radius: 0.2rem;
    background: black;
    opacity: 0.5;
    display: flex;
    align-items: center;
    justify-content: center;
    img {
        width: 0.7rem !important;
        height: 0.7rem !important;
    }
}
.ruler {
    border-radius: 0.5rem;
    margin-bottom: 0.2rem;
    background: #fff;
    p {
        font-size: 0.24rem;
        text-align: left;
        font-family: Adobe Heiti Std;
        color: #666666;
        margin: 0;
        padding: 0.2rem;
        padding-left: 0.8rem;
        padding-right: 0.3rem;
    }
    :nth-of-type(1) {
        text-align: center;
        color: #3083cc;
        font-size: 0.34rem;
        font-family: Adobe Heiti Std;
    }
    :nth-of-type(2) {
        background: url(../../../public/image/ruler1.png) no-repeat 0.15rem
            0.28rem;
        background-size: 0.5rem 0.5rem;
    }
    :nth-of-type(3) {
        background: url(../../../public/image/ruler2.png) no-repeat 0.15rem
            0.12rem;
        background-size: 0.5rem 0.5rem;
    }
    :nth-of-type(4) {
        background: url(../../../public/image/ruler3.png) no-repeat 0.15rem
            0.28rem;
        background-size: 0.5rem 0.5rem;
    }
    :nth-of-type(5) {
        background: url(../../../public/image/ruler4.png) no-repeat 0.15rem
            0.28rem;
        background-size: 0.5rem 0.5rem;
        padding-bottom: 0.5rem;
    }
}
.ruler_qx {
    background: url(../../../public/image/qx.png) no-repeat;
    background-size: 0.5rem 0.5rem;
    width: 0.5rem;
    height: 0.6rem;
    margin: 0 auto;
}
.win {
    border-radius: 0.5rem;
    margin-bottom: 0.2rem;
    position: relative;
    img {
        width: 100%;
        height: 6rem;
    }
    p {
        font-size: 0.3rem;
        position: absolute;
        color: #fff;
    }
    .win_p {
        top: 17%;
        color: #548cea;
        text-align: center;
        font-size: 0.36rem;
        width: 100%;
        font-family: Source Han Sans SC;
    }
    .winNum {
        color: #df1341;
        top: 30%;
        width: 100%;
        text-align: center;
        span {
            font-size: 0.6rem;
        }
    }
    button {
        position: absolute;
        display: block;
        font-size: 0.3rem;
        width: 1.25rem;
        height: 1.25rem;
        text-align: center;
        border: none;
        color: #3270c5;
        border-radius: 50%;
        background-image: linear-gradient(#fec995, #ffe1c4);
        top: 65%;
        left: 40%;
    }
}
.nowin {
    border-radius: 0.5rem;
    margin-bottom: 0.2rem;
    position: relative;
    img {
        width: 80%;
        height: 6rem;
    }
}
.win_qx {
    background: url(../../../public/image/qx.png) no-repeat;
    background-size: 0.5rem 0.5rem;
    width: 0.5rem;
    height: 0.5rem;
    margin: 0 auto;
}
.exchange {
    border-radius: 0.5rem;
    margin-bottom: 0.1rem;
    background: #fff;
    > div {
        font-size: 0.38rem;
        display: flex;
        align-items: center;
    }
    .kyjf {
        background: #4ca8f8;
        height: 1.3rem;
        p {
            width: 100%;
            font-family: Adobe Heiti Std;
            text-align: center;
            color: #fff;
        }
    }
    .bq {
        padding: 0 5%;
        height: 1.5rem;
        position: relative;
    }
    .bq1 {
        border-bottom: 1px solid #ddd;
    }
    .bq > img {
        width: 0.8rem;
        height: 0.8rem;
    }
    .bq > div:nth-of-type(1) {
        p {
            font-size: 0.24rem;
            margin: 0;
            margin-left: 0.2rem;
            text-align: left;
        }
        .bqk {
            font-size: 0.36rem;
            font-family: Microsoft YaHei;
        }
        .bqjf {
            font-size: 0.16rem;
            color: #666;
        }
    }
    .bq > div:nth-of-type(2) {
        position: absolute;
        background: #4ca8f8;
        width: 1.5rem;
        height: 0.55rem;
        line-height: 0.55rem;
        border-radius: 0.1rem;
        color: #fff;
        font-size: 0.26rem;
        right: 5%;
    }
    .hy {
        border: none;
    }
}
.van-popup {
    border-radius: 0.5rem;
    width: 80%;
    background: none;
}
.luck {
    padding-top: 0.5rem;
    overflow: hidden;
    .xydzp {
        width: 3.78rem;
        height: 1.5rem;
        background: url(../../../public/image/xydzp2.png) no-repeat;
        background-size: 100%;
        margin: 0 auto;
    }
    .xyzp {
        width: 90%;
        height: 7rem;
        margin-left: 5%;
        position: relative;
        z-index: 2;
        p:nth-of-type(1) {
            font-size: 0.28rem;
            width: 100%;
            text-align: center;
            color: #fff;
            position: absolute;
            top: 40%;
            z-index: 10;
        }
        p:nth-of-type(2) {
            font-size: 0.16rem;
            width: 100%;
            text-align: center;
            color: #fff;
            position: absolute;
            top: 50%;
            z-index: 10;
        }
        .wheel-main {
            margin: 0 auto;
            position: relative;
            width: 6.85rem;
            height: 6.85rem;
        }
        .wheel-pointer {
            display: block;
            position: absolute;
            top: 48%;
            left: 50%;
            z-index: 10;
            width: 1.9rem;
            height: 2.46rem;
            transform: translate3d(-50%, -50%, 0);
        }
        .wheel-bg {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            color: #fff;
        }
        .zp_999 {
            display: block;
            width: 6.85rem;
            height: 6.85rem;
            position: absolute;
        }
        .wheel-bg div {
            text-align: center;
        }
        .prize-list {
            width: 100%;
            height: 100%;
            position: relative;
        }
        .prize-list .prize-item {
            position: absolute;
            width: 2.28rem;
            height: 3.42rem;
            top: 0;
            left: 50%;
            margin-left: -17%;
            transform-origin: 50% 100%;
        }
        .prize-list > div:nth-of-type(1) > div {
            color: #844ecc;
        }
        .prize-list > div:nth-of-type(2) > div {
            color: #e46b5c;
        }
        .prize-list > div:nth-of-type(3) > div {
            color: #844ecc;
        }
        .prize-list > div:nth-of-type(5) > div {
            color: #844ecc;
        }
        .prize-list > div:nth-of-type(6) > div {
            color: #e46b5c;
        }
        .prize-list > div:nth-of-type(7) > div {
            color: #844ecc;
        }
        .prize-list > div:nth-of-type(8) > div {
            color: #e46b5c;
        }
        .prize-pic img {
            width: 0.6rem;
        }
        .prize-type {
            font-size: 0.24rem;
            color: #000;
            margin-top: 0.6rem;
        }
    }
}
.foot {
    position: relative;
    width: 100%;
    img:nth-of-type(1) {
        position: absolute;
        z-index: 1;
        width: 40%;
        top: -157%;
        left: 30%;
    }
    img:nth-of-type(2) {
        width: 120%;
        height: 4rem;
        position: relative;
        left: -10%;
        top: -0.7rem;
        z-index: 0.5;
    }
    button {
        width: 4rem;
        height: 0.7rem;
        font-size: 0.34rem;
        background: #312fe1;
        color: #fff;
        border: none;
        border-radius: 0.5rem;
        margin-top: 1.1rem
    }
}
.cjimg{
    width: 0.35rem;
    height: 0.26rem;
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
    // width: 1.2rem;
    padding: 0 0.3rem;
    margin-right: 0.5rem;
    height: 0.6rem;
    border-radius: 0.1rem;
}
.btnShowF {
    background: #fff;
    border: 1px solid #999;
    color: #333;
    // width: 1.2rem;
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
.gzhimg{
    width: 5rem;
}
.van-popup--center{
    top:40%
}
.van-overlay{
    z-index: 8888
}
.wrapper{
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100%;
}
.active_p{
    color: #fff;
    font-size: 40px;
}
</style>