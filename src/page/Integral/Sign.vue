<template>
    <div class="box">
        <!-- 积分 -->
        <div class="num">
            <img src="../../../public/image/heaban.png" alt />
            <p class="num_p">连续签到7天送现金红包抽奖</p>
            <div class="jifenBox">
                <div class="jifenBox_1">
                    <p>可用积分：{{sign}}</p>
                    <p>补签卡：{{signature}}</p>
                </div>
                <div class="jifenBox_2" @click="exchange()">去兑换</div>
            </div>
        </div>

        <!-- 签到 -->
        <div class="sign">
            <div class="seven">
                <div class="s_box">
                    <div>
                        <p>星期一</p>
                        <div>
                            <img src="../../../public/image/gold.png" alt />
                            <button v-if="dayBtn[0].dayBtn" @click="signed(1)">补签</button>
                        </div>
                        <div class="zzc" v-if="day[0].day">
                            <img src="../../../public/image/qdcg.png" alt />
                        </div>
                    </div>
                    <div>
                        <p>星期二</p>
                        <div>
                            <img src="../../../public/image/gold.png" alt />
                            <button v-if="dayBtn[1].dayBtn" @click="signed(2)">补签</button>
                        </div>
                        <div class="zzc" v-if="day[1].day">
                            <img src="../../../public/image/qdcg.png" alt />
                        </div>
                    </div>
                    <div>
                        <p>星期三</p>
                        <div>
                            <img src="../../../public/image/gold.png" alt />
                            <button v-if="dayBtn[2].dayBtn" @click="signed(3)">补签</button>
                        </div>
                        <div class="zzc" v-if="day[2].day">
                            <img src="../../../public/image/qdcg.png" alt />
                        </div>
                    </div>
                    <div>
                        <p>星期四</p>
                        <div>
                            <img src="../../../public/image/gold.png" alt />
                            <button v-if="dayBtn[3].dayBtn" @click="signed(4)">补签</button>
                        </div>
                        <div class="zzc" v-if="day[3].day">
                            <img src="../../../public/image/qdcg.png" alt />
                        </div>
                    </div>
                    <div>
                        <p>星期五</p>
                        <div>
                            <img src="../../../public/image/gold.png" alt />
                            <button v-if="dayBtn[4].dayBtn" @click="signed(5)">补签</button>
                        </div>
                        <div class="zzc" v-if="day[4].day">
                            <img src="../../../public/image/qdcg.png" alt />
                        </div>
                    </div>
                    <div>
                        <p>星期六</p>
                        <div>
                            <img src="../../../public/image/gold.png" alt />
                            <button v-if="dayBtn[5].dayBtn" @click="signed(6)">补签</button>
                        </div>
                        <div class="zzc" v-if="day[5].day">
                            <img src="../../../public/image/qdcg.png" alt />
                        </div>
                    </div>
                    <div>
                        <p>星期天</p>
                        <div class="box_7">
                            <div>
                                <img src="../../../public/image/gold.png" alt />
                            </div>
                            <div class="zzc" v-if="day[6].day">
                                <img src="../../../public/image/qdcg.png" alt />
                            </div>
                            <!-- <div>&nbsp; +</div> -->
                            <!-- <div></div> -->
                            <!-- <button v-if="dayBtn[6].dayBtn" @click="signed(7)">补签</button> -->
                            <!-- <img class="img1" src="../../../public/image/xydzp.png" alt /> -->
                        </div>
                    </div>
                </div>
                <div>
                    <span @click="ruler()">签到规则</span>
                    <span @click="record()">积分记录</span>
                </div>
                <div>
                    <p @click="SignIn()">立即签到</p>
                </div>
                <div class="bar">
                    <div>
                        <img v-if="zdt[0].zdt" src="../../../public/image/zdt1.png" alt="">
                        <img v-if="zdt[1].zdt" src="../../../public/image/zdt2.png" alt="">
                        <img v-if="zdt[2].zdt" src="../../../public/image/zdt3.png" alt="">
                        <img v-if="zdt[3].zdt" src="../../../public/image/zdt4.png" alt="">
                        <img v-if="zdt[4].zdt" src="../../../public/image/zdt5.png" alt="">
                        <img v-if="zdt[5].zdt" src="../../../public/image/zdt6.png" alt="">
                        <img v-if="zdt[6].zdt" src="../../../public/image/zdt7.png" alt="">
                    </div>
                    <div>
                        <img v-if="!xydzp" src="../../../public/image/xydzph.png" alt />
                        <img v-if="xydzp" src="../../../public/image/xydzp.png" alt="">
                    </div>
                </div>
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
                <p @click="beginRotate()">次数:{{cjNum}}</p>
            </div>
            <div class="foot">
                <img src="../../../public/image/zj.png" alt />
                <img src="../../../public/image/footban.png" alt />
                <button @click="getMore()">获取更多积分</button>
            </div>
        </div>

        <!-- 规则 -->
        <van-popup v-model="show">
            <div class="ruler">
                <p>活动规则</p>
                <p>用户签到每天赠送30积分，用户连续签到7天赠送用户一次抽奖机会。</p>
                <p>如果用户中间断签则不会赠送抽奖机会。</p>
                <p>用户可通过积分兑换补签卡来对漏签的天数进行补签操作。</p>
                <p>用户可通过“获得更多积分”邀请好友助力每天最多可获得30积分。</p>
            </div>
            <div class="ruler_qx" @click="show = false"></div>
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
        <van-dialog
            v-model="YZMshow"
            title="用户验证"
            show-cancel-button
            @confirm="confirm()"
            @cancel="cancel()"
        >
            <van-field v-model="value" type="digit" label="手机号码" placeholder="请输入手机号码" />
            <van-field
                v-model="valueYZM"
                type="digit"
                center
                clearable
                label="短信验证码"
                placeholder="请输入短信验证码"
            >
                <template #button>
                    <van-button
                        size="small"
                        :disabled="disBtn"
                        type="primary"
                        @click="YZMbtn()"
                    >{{yzmbtn}}</van-button>
                </template>
            </van-field>
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
        <van-popup v-model="noWin">
            <div class="nowin">
                <img src="../../../public/image/wzj.png" alt />
            </div>
            <div class="win_qx" @click="noWin = false"></div>
        </van-popup>
    </div>
</template>

<script>
import Vue from "vue";
import { Popup, Dialog, Toast, Field, Button } from "vant";
import { prizeList } from "../../util/changeData.js";
import { mapMutations } from 'vuex';
import wx from 'weixin-js-sdk';

const CIRCLE_ANGLE = 360;
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
    .use(Field);
export default {
    data() {
        return {
            day: [
                { day: false },
                { day: false },
                { day: false },
                { day: false },
                { day: false },
                { day: false },
                { day: false }
            ],
            dayBtn: [
                { dayBtn: false },
                { dayBtn: false },
                { dayBtn: false },
                { dayBtn: false },
                { dayBtn: false },
                { dayBtn: false }
            ],
            show: false, //规则弹框是否显示
            YZMshow: false, //验证码弹框
            exchangeShow: false, //兑换弹框是否显示
            sign: "", //可用积分：
            signature: 0, //补签卡：
            count: 10000, // 剩余抽奖次数
            duration: 3000, // 转盘旋转时间
            prizeList: [], // 奖品列表
            rotateAngle: 0, // 旋转角度
            index: 0,
            prize: null,
            value: "", //手机号码
            valueYZM: "", //验证码
            yzmbtn: "获取验证码",
            disBtn: false, //是否禁用验证码
            timer: "", //计时器
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
            ]
        };
    },
    methods: {
        ...mapMutations(['hide']),
        //规则弹框显示
        ruler() {
            this.show = true;
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
                            // on cancel
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
                            // on cancel
                        });
                }
            }
        },
        //立即签到
        SignIn() {
            // console.log(this.isTrueQD);

            if (this.isTrueQD) {
                Toast.success("今日已签到 明天在来吧!");
                return false;
            };
            this.isTrueQD = true;

            // this.$dataApi({
            //     url: "api/SignInPoints/SaveUserSignIn",
            //     method: "POST",
            //     data: {
            //         Openid: sessionStorage.getItem("openID"),
            //         SignInNature: "签到",
            //         NickName: sessionStorage.getItem("NickName")
            //     }
            // }).then(response => {
            //     // console.log(response);
            //     Toast.success("签到成功");
            //     let arr = [];
            //     let str = "";
            //     let flag = 0;
            //     arr = response.Data.CurrentTime.split("-");
            //     str = arr.join("");
            //     response.Data.ZBBDSignList.map((item, index) => {
            //         // console.log(item);
            //         let arr1 = [];
            //         let str1 = "";
            //         let newStr = item.ActualDate.slice(0, 10);
            //         arr1 = newStr.split("-");
            //         str1 = arr1.join("");
            //         if (
            //             item.SignInNature == "签到" ||
            //             item.SignInNature == "补签"
            //         ) {
            //             this.day[index].day = true;
            //             flag++;
            //             this.zdt[flag-1].zdt = true;
            //         }
            //         if (
            //             item.SignInNature == "未签到" &&
            //             Number(str) > Number(str1)
            //         ) {
            //             this.dayBtn[index].dayBtn = true;
            //         }
            //         if (
            //             Number(str) == Number(str1) &&
            //             item.SignInNature == "签到"
            //         ) {
            //             this.isTrueQD = true;
            //         };
            //         if(item.SignInNature == '未签到'){
            //             this.xydzp = false;
            //         }
            //     });
            //     this.getUserNum();
            //     this.getcjNum();
            // });

            // this.getUserSign();
        },
        //补签
        signed(i) {
            if (this.signature == 0) {
                Toast.fail("补签卡不足");
                return false;
            }
            this.dayBtn.map((v,j)=>{
                if(i == j){
                    this.dayBtn[j-1].dayBtn = false;
                }
            })
            // this.$dataApi({
            //     url: "api/SignInPoints/SaveReissue",
            //     method: "POST",
            //     data: {
            //         Openid: sessionStorage.getItem("openID"),
            //         SignInNature: "补签",
            //         SignInDays: i,
            //         NickName: sessionStorage.getItem("NickName")
            //     }
            // }).then(response => {
            //     console.log(response);
            //     Toast.success("补签成功");
            //     let arr = [];
            //     let str = "";
            //     let flag = 0;
            //     arr = response.Data.CurrentTime.split("-");
            //     str = arr.join("");
            //     response.Data.ZBBDSignList.map((item, index) => {
            //         // console.log(item);
            //         let arr1 = [];
            //         let str1 = "";
            //         let newStr = item.ActualDate.slice(0, 10);
            //         arr1 = newStr.split("-");
            //         str1 = arr1.join("");
            //         if (
            //             item.SignInNature == "签到" ||
            //             item.SignInNature == "补签"
            //         ) {
            //             this.day[index].day = true;
            //             this.dayBtn[index].dayBtn = false;
            //             flag++;
            //             this.zdt[flag-1].zdt = true;
            //         }
            //         if (
            //             item.SignInNature == "未签到" &&
            //             Number(str) > Number(str1)
            //         ) {
            //             this.dayBtn[index].dayBtn = true;
            //         }
            //         if (
            //             Number(str) == Number(str1) &&
            //             item.SignInNature == "签到"
            //         ) {
            //             // console.log(888);
            //             this.isTrueQD = true;
            //         };
            //         if(item.SignInNature == '未签到'){
            //             this.xydzp = false;
            //         }
            //     });
            //     this.getUserNum();
            //     this.getUesrCard();
            //     this.getcjNum();
            // });

            // this.getUserSign();
        },
        //点击验证码确定按钮
        confirm() {
            var that = this;
            // console.log(this.value);
            // console.log(this.valueYZM);
            if (that.value == "" || that.valueYZM == "") {
                Toast.fail("手机号或者验证码为空");
            } else {
                that.$dataApi({
                    url:
                        "https://webservice.jshcsoft.com/SSMSAPI/verifycode.ashx",
                    method: "POST",
                    data: {
                        tele: that.value,
                        code: that.valueYZM,
                        type: "mqy"
                    }
                }).then(response => {
                    if (response == true) {
                        // that.UpdateMember(values);
                        Toast.success("注册成功");
                        that.valueYZM = "";
                        that.saveUserPhone();
                        that.userPhone = false;
                        window.clearInterval(that.timer);
                    } else {
                        Toast.fail("验证码错误!!!");
                        that.valueYZM = "";
                    }
                });
            }
        },
        // 点击验证码取消按钮
        cancel() {
            this.value = "";
            this.valueYZM = "";
        },
        //获取验证码
        YZMbtn() {
            // console.log(this.value);
            var that = this;
            if (!/^[1][3,4,5,7,8,9][0-9]{9}$/.test(this.value)) {
                Toast.fail("手机号码有误");
                this.value = "";
                // return false;
            } else {
                that.$dataApi({
                    url:
                        "https://webservice.jshcsoft.com/SSMSAPI/sendmessage.ashx",
                    method: "POST",
                    data: {
                        tele: this.value,
                        type: "mqy"
                    }
                }).then(response => {
                    console.log(response);
                    // that.setTime();
                });

                var time = 60;
                this.yzmbtn = time + "s";
                this.timer = setInterval(function() {
                    time--;
                    that.disBtn = true;
                    that.yzmbtn = time + " " + "s";
                    if (time == 0) {
                        window.clearInterval(that.timer);
                        that.yzmbtn = "获取验证码";
                        that.disBtn = false;
                    }
                }, 1000);
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
                // console.log(response);
                this.sign = response.availablePoints;
            });
        },
        //获取用户补签卡
        getUesrCard() {
            this.$dataApi({
                url: "api/SignInPoints/GetUserReissueCard",
                method: "GET",
                data: {
                    openid: sessionStorage.getItem("openID")
                }
            }).then(response => {
                // console.log(response);
                this.signature = response.LeftCards;
            });
        },
        //获取用户签到情况
        getUserSign() {
            this.$dataApi({
                url: "api/SignInPoints/GetUserSignIn",
                method: "POST",
                data: {
                    Openid: sessionStorage.getItem("openID"),
                    NickName:sessionStorage.getItem("NickName")
                }
            }).then(response => {
                console.log(response);
                let arr = [];
                let str = "";
                let flag = 0;
                arr = response.CurrentTime.split("-");
                str = arr.join("");
                response.ZBBDSignList.map((item, index) => {
                    // console.log(item);
                    let arr1 = [];
                    let str1 = "";
                    let newStr = item.ActualDate.slice(0, 10);
                    arr1 = newStr.split("-");
                    str1 = arr1.join("");
                    if (
                        item.SignInNature == "签到" ||
                        item.SignInNature == "补签"
                    ) {
                        this.day[index].day = true;
                        flag++;
                        this.zdt[flag-1].zdt = true;
                    };
                    if (
                        item.SignInNature == "未签到" &&
                        Number(str) > Number(str1)
                    ) {
                        this.dayBtn[index].dayBtn = true;
                    };
                    if (
                        Number(str) == Number(str1) &&
                        item.SignInNature == "签到"
                    ) {
                        this.isTrueQD = true;
                    };
                    if(item.SignInNature == '未签到'){
                        this.xydzp = false;
                    }
                });
                this.getUserCjNum();
                // this.sign = response.availablePoints
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
            wx.closeWindow();
        },


        //抽奖转盘事件
        beginRotate() {
            if (this.cjNum === 0) {
                Toast.fail("抽奖次数不足");
                return false;
            } else {
                // 添加次数校验
                if (this.userPhone) {
                    this.YZMshow = true;
                    return false;
                }
                // 开始旋转
                this.rotating();
            }
        },
        random(max, min = 0) {
            return parseInt(Math.random() * (max - min + 1) + min);
        },
        //旋转方法
        rotating() {
            const { isRotating, angleList, config, rotateAngle, index } = this;

            if (isRotating) return;
            this.isRotating = true;
            this.$dataApi({
                url: "api/LotteryDraw/GetUserDrawResult",
                method: "POST",
                data: {
                    openId: sessionStorage.getItem("openID"),
                    NickName: sessionStorage.getItem("NickName"),
                    HeadingUrl: sessionStorage.getItem("headimgurl")
                }
            }).then(response => {
                // console.log(response);
                let money = [1, 5, 7];
                if (response.Msg == "谢谢参与") {
                    this.index = 3;
                } else {
                    this.index = money[Math.floor(Math.random() * money.length)];
                    this.RedEnvelopes = Number(response.Msg);
                    this.getUserCjNum()
                }

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
        }
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
    created() {
        // 基本配置
        this.config = config;
        
        this.hide(); //tabbar消失
        this.initPrizeList(); //旋转方法
        this.getUserSign(); //获取用户签到情况
        this.getUserNum(); //获取用户积分
        this.getUesrCard(); //获取用户补签卡
        this.getUserCjNum(); //获取用户抽奖次数
        this.getUsrePhone(); //判断用户是否留有手机号码
        this.getcjNum(); //获取用户剩余抽奖次数
      
    }
};
</script>

<style lang="scss" scoped>
.box {
    width: 100%;
    height: 15.4rem;
    background: #5482f7;
}
.num {
    width: 100%;
    height: 3.5rem;
    // background: pink;
    // background: url(../../../public/image/heaban.png) no-repeat;
    // background-size: 100% 100%;
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
    // height: 7.2rem;
    // background: #4E8AFE;
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
        // justify-content: center;
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
        // width: 1.2rem;
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
        // margin-top: 0.2rem;
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
    // background: pink;
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
    // background: #fff;
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
    // background: #fff;
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
        // margin-right: 0.5rem;
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
    background: #5482f7;
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
        // background: pink;
        p:nth-of-type(1) {
            font-size: 0.28rem;
            width: 100%;
            text-align: center;
            color: #fff;
            position: absolute;
            top: 36%;
            z-index: 10;
            // left: 30%;
        }
        p:nth-of-type(2) {
            font-size: 0.16rem;
            width: 100%;
            text-align: center;
            color: #fff;
            position: absolute;
            top: 45%;
            z-index: 10;
            // left: 30%;
        }
        .wheel-main {
            margin: 0 auto;
            position: relative;
            width: 6rem;
            height: 6rem;
        }
        .wheel-pointer {
            display: block;
            position: absolute;
            top: 48%;
            left: 50%;
            z-index: 10;
            width: 1.5rem;
            height: 2rem;
            // background: url(../../../public/image/qx1.png) no-repeat center top;
            // background-size: 100%;
            transform: translate3d(-50%, -50%, 0);
        }
        .wheel-bg {
            position: absolute;
            top: 0;
            left: 0;
            // z-index: 1;
            width: 100%;
            height: 100%;
            // background: url(../../../public/image/zp.png) no-repeat center top;
            // background-size: 100%;
            color: #fff;
        }
        .zp_999 {
            display: block;
            width: 6rem;
            height: 6rem;
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
            width: 2rem;
            height: 3rem;
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
            // height: 0.84rem;
        }
        .prize-type {
            font-size: 0.24rem;
            color: #000;
            margin-top: 0.6rem;
        }
    }
}
.foot {
    // margin-bottom: 1rem;
    position: relative;
    width: 100%;
    height: 2.5rem;
    img:nth-of-type(1) {
        position: absolute;
        z-index: 1;
        width: 40%;
        top: -150%;
        left: 30%;
    }
    img:nth-of-type(2) {
        width: 120%;
        height: 4rem;
        position: relative;
        left: -10%;
        // margin: 0 auto;
        top: -0.7rem;
        z-index: 0.5;
    }
    button {
        position: relative;
        top: -4rem;
        width: 4rem;
        height: 0.7rem;
        font-size: 0.34rem;
        background: #312fe1;
        color: #fff;
        border: none;
        border-radius: 0.5rem;
    }
}
</style>