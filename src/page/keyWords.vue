<template>
    <div class="container">
        <div class="keywords-top">
            <div class="prompt">维护您的招标关键词</div>
            <!-- <div class="add" @click="add">添加</div> -->
        </div>

        <!-- 注册弹框 -->
        <van-dialog v-model="showDia" :show-confirm-button=false class="phone">
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
                <div class="btnbox">
                    <button class="btnShowT" @click="phoneFin">确定</button>
                    <button class="btnShowF" @click="closeActive">取消</button>
                </div>
            </div>

            <div v-if="!active">
                <p style="margin:12px">免费注册可享更多权益!</p>
                <van-field v-model="code" label="邀请码" placeholder="请输入邀请码"/>
                <div class="btnbox">
                    <button class="btnShowT" @click="codeFin">确定</button>
                    <button class="btnShowF" @click="closeActive">取消</button>
                </div>
            </div>
        </van-dialog>

        <div class="keyword">
            <ul>
                <li v-for="(item,index) in keywordslist" @click="delKeywords(item)" :key="index">
                    <div class="keyList">
                        <p class="keyOne">
                            <span class="keyNum">{{index+1}}.</span>
                            <span class="keywords">{{item.keyword}}</span>
                            <span><i class="iconfont icon-shezhi"></i></span>
                        </p>
                        <p class="keyTwo">地区:{{(item.SelectedProvince.toString() + ' ' + item.SelectedCity.toString()).length == 1 ? '全国' : (item.SelectedProvince.toString() + ' ' + item.SelectedCity.toString())}}</p>
                        <p class="keyTwo">公告类型:{{item.FormatGGType}}</p>
                        <p class="keyThr">排除关键词:{{item.ExcludeKeywords}}</p>
                    </div>
                </li>
            </ul>
        </div>

        <div class="addBtn">
            <img src="../../public/image/addKeyWord.png" @click="add" alt="">
            <button @click="setMove()">保存并查看结果</button>
        </div>
    </div>
</template>

<script>
import Vue from "vue";
import { mapMutations } from "vuex";
import { Dialog, Toast, Field } from "vant";
Vue.use(Field);
import "@/iconfont/iconfont.css";
export default {
    components: {
        [Dialog.Component.name]: Dialog.Component
    },

    data() {
        return {
            keywordslist: [],
            keyWordsNum: 0,  //用户关键词个数
            KeyWordCount: Number(sessionStorage.getItem("KeyWordCount")),
            Height:
                document.documentElement.scrollTop == 0
                    ? screen.height + "px"
                    : screen.height + document.documentElement.scrollTop + "px",
            datevalue: "",
            show: false,
            startTime: "",
            endTime: "",
            timer: [
                { data: "全部", value: 0 },
                { data: "最近3天", value: 3 },
                { data: "最近7天", value: 7 },
                { data: "最近30天", value: 30 }
            ],
            typelistTime: [0],
            minDate: new Date(2010, 0, 1),
            maxDate: new Date(),
            len: false, //关键字的长度是否大于5
            showDia: false, //验证码弹框是否出现
            valueDio: "", //验证码弹框内容
            InvitationCode: false, //用户是否使用过邀请码
            active: true, //哪种注册方式
            fsyzm: "发送验证码",
            fsyzmTrue: true, //是否在60秒
            tel: "", //手机号
            sms: "", //验证码
            code: "", //邀请码
        };
    },
    methods: {
        ...mapMutations(["activeTwo"]),
        chongzhi: function() {
            this.typelistTime = [0];
            this.startTime = "";
            this.endTime = "";
        },

        changetypeIndexTime: function(e) {
            if (this.typelistTime.indexOf(e) == -1) {
                (this.typelistTime = []), this.typelistTime.push(e);
            }
            this.startTime = "";
            this.endTime = "";
        },
        
        opendate: function() {
            this.show = true;
        },

        getKeywords: function() {
            let that = this;
            that.$dataApi({
                url: "api/Users/SearchKeyWordsByOpenId",
                method: "POST",
                data: {
                    openid: sessionStorage.getItem("openID"),
                    Source: 1
                }
            })
                .then(response => {
                    console.log(JSON.parse(response.Data).Rows);
                    that.keyWordsNum = JSON.parse(response.Data).Rows.length;  //获取用户关键词个数
                    //判断关键字是否超过五个,超过五个就必须输入邀请码
                    // if (JSON.parse(response.Data).Rows.length > 4) {
                    //     this.len = true;
                    // }

                    if (response.Status == 200) {
                        if (JSON.parse(response.Data).Rows.length == 0) {
                            this.KeyWordCount = 0;
                        }
                        this.keywordslist = JSON.parse(response.Data).Rows;
                        // console.log(this.keywordslist);
                    } else {
                        Toast.fail("查询失败" + response.Msg);
                    }
                })
                .catch(function(error) {
                    console.log(error);
                });
        },

        //点击关键词
        delKeywords: function(e) {
            console.log(e);
            sessionStorage.removeItem('ExcludeKey')
            this.$router.push({
                path:'/addkeyword',
                query: {
                    KeyId:e.KeyId,
                    GGType:e.GGType,
                    ProvinceList:e.SelectedProvince,
                    FormatGGType:e.FormatGGType,
                    keyword:e.keyword,
                    citys:e.SelectedCity,
                    ExcludeKeywords:e.ExcludeKeywords
                },
            });
            // sessionStorage.setItem("KeyId",e.KeyId);
            // sessionStorage.setItem("GGType",e.GGType);
            // sessionStorage.setItem("ProvinceList",e.ProvinceList);
            // sessionStorage.setItem("FormatGGType",e.FormatGGType);
            // sessionStorage.setItem("keyword",e.keyword);
            // sessionStorage.setItem("citys",e.citys);
        },

        //添加关键词
        add: function() {
            let that = this;
            sessionStorage.removeItem('ExcludeKey')
            sessionStorage.removeItem('flagkeyword')
            that.$dataApi({
                url: "api/RoleManage/GetUserRoleByOpenId",
                method: "GET",
                data: {
                    openId: sessionStorage.getItem("openID"),
                },
            }).then((res) => {
                // console.log(res);
                // return
                if(res.RoleManagement.SubscriptionKeywords == 0 || res.RoleManagement.SubscriptionKeywords > that.keyWordsNum){
                    that.$router.push({ path: "/addkeyword" });
                }else{
                    if(res.RoleManagement.RoleName == '免费用户'){
                        that.showDia = true;
                    }else{
                        Toast.fail('已超过关键词个数限制');
                    }
                };
            });
        },

        onPlusReady() {
            this.$router.replace({ path: "/index" });
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
                        that.InvitationCode = true;
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
                that.InvitationCode = true;
                location.reload();
            });
        },
        
        //取消免费注册弹框
        closeActive() {
            this.showDia = false;
            this.tel = "";
            this.sms = "";
            this.code = "";
        },

        //保存并查看结果
        setMove(){
            this.$router.push('/Keyinfolist');
        }
    },

    created: function() {
        this.getKeywords();
        //判断改用户是否填写过邀请码
        // let that = this
        this.$dataApi({
            url: "api/Users/IsExistInvitationCode",
            method: "GET",
            data: {
                openID: sessionStorage.getItem("openID")
            }
        }).then(res => {
            // console.log(res);
            if (res.Msg == "true") {
                this.InvitationCode = true;
            } else {
                this.InvitationCode = false;
            }
        });
    },

    mounted() {
        let _this = this;
        if (window.history && window.history.pushState) {
            window.addEventListener("popstate", _this.onPlusReady, false);
        }
    },
    beforeRouteEnter(to, from, next) {
        if (from.path == "/Keyinfolist") {
            from.meta.keepAlive = false;
        }
        next(vm => {
            if (to.path === "/keyWords") {
                vm.activeTwo(1);
            }
        });
    },
    beforeRouteLeave(to, from, next) {
        if (to.path == "/addkeyword") {
            to.meta.title = "添加您关注的行业";
            next();
        } else {
            next();
        }
    },

    destroyed() {
        let _this = this;
        setTimeout(function() {
            window.removeEventListener("popstate", _this.onPlusReady, false);
        }, 0);
    }
};
</script>

<style scoped>
.a {
    color: #0099ff;
}
.keywords{
    font-size: 18px;
    color: #fff;
}
.container {
    display: flex;
    flex-direction: column;
    align-items: center;
    position: relative;
    width: 100%;
    min-height:100%;
    background: rgba(240, 240, 240, 1);
}
.keywords-top {
    height: 1.28rem;
    width: 90%;
    background: #fff;
    position: fixed;
    top: 0;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0 5%;
}
.prompt {
    text-align: left;
    font-size: 0.35rem;
    align-items: center;
}

.searchtime {
    width: 100%;
    overflow: hidden;
}

.searchtime span {
    display: block;
    font-size: 0.3rem;
    font-family: PingFang SC;
    font-weight: 500;
    color: rgba(51, 51, 51, 1);
    line-height: 0.6rem;
    float: left;
    margin-left: 0.4rem;
    margin-top: 0.2rem;
}
.keywords-top button {
    width: 1.2rem;
    height: 0.48rem;
    background: rgba(76, 168, 248, 1);
    border-radius: 0.6rem;
    float: right;
    margin-right: 0.4rem;
    margin-top: 0.4rem;
    color: #fff;
}
.sj {
    width: 0;
    height: 0;
    /* 防溢出，稳固兼容性 */
    overflow: hidden;
    /* 箭头尺寸 */
    border-width: 8px;
    /* 给箭头着色，四个值分别是边框的四个方向，箭头的方向正好相反 */
    border-color: #169bd5 transparent transparent transparent;
    /* 为了兼容性，最好把四个值都补上，需要的方向设实线，其他方向虚线 */
    border-style: solid dashed dashed dashed;
}
.time {
    height: 3.3rem;
    background: rgba(255, 255, 255, 1);
    border-radius: 0rem 0rem 20px 0rem;
}
.bigtime {
    height: 1rem;
    width: 100%;
    border-bottom: 1px solid #eeeeee;
}
.bigtime span {
    display: block;
    float: left;
    height: 0.48rem;
    width: 1.3rem;
    font-size: 0.24rem;
    font-family: PingFang SC;
    font-weight: bold;
    line-height: 0.48rem;
    margin-top: 0.26rem;
    margin-left: 0.15rem;
}
.bigtime span:nth-of-type(1) {
    margin-left: 0.4rem;
}
.chosetime {
    overflow: hidden;
}
.hx {
    width: 0.7rem;
    height: 0.03rem;
    background: rgba(22, 155, 213, 1);
    float: left;
    margin: 0 0.16rem;
    margin-top: 0.59rem;
}
.chosetime input {
    width: 2.15rem;
    height: 0.6rem;
    border: 1px solid rgba(191, 191, 191, 1);
    border-radius: 5px;
    text-align: center;
}
.chosetime .input1 {
    float: left;
    margin-left: 1.1rem;
    font-size: 0.3rem;
    margin-top: 0.3rem;
}
.chosetime .input2 {
    float: left;
    font-size: 0.3rem;
    margin-top: 0.3rem;
}
.btn-box1 {
    width: 100%;
    margin-top: 0.3rem;
}
.btn-box1 button {
    width: 1.2rem;
    height: 0.6rem;
    border-radius: 0.1rem;
    margin-left: 0.1rem;
    font-size: 0.28rem;
    font-family: PingFang SC;
    line-height: 0.8rem;
    margin-bottom: 0.3rem;
    display: block;
    float: left;
}
.btn1 {
    border: 1px solid rgb(153, 146, 146);
    background: rgba(247, 247, 247, 1);
    margin-left: 2.24rem;
}
.btn2 {
    border: none;
    background: rgb(76, 168, 248);
}
.keyword {
    overflow: hidden;
    width: 100%;
    margin-top: 1.3rem;
    padding-bottom: 0.5rem;
}
.keyList {
    border-radius: 0.2rem;
    width: 90%;
    margin-left: 5%;
    margin-top: 0.2rem;
    font-size: 0.2rem;
    background: #fff;
    overflow: hidden;
}
.keyList>p{
    text-align: left;
}
.keyOne{
    background:#4CA8F8 ;
    color: #fff;
    margin: 0;
    padding: 5px 10px;
}
.keyOne>span:nth-of-type(1){
    color: #FFF;
}
.keyOne>span:nth-of-type(2){
    color: #FFF;
}
.keyOne>span:nth-of-type(3){
    color: #FFF;
    float: right;
    font-size: 0.4rem;
}
.keyTwo{
    display: -webkit-box !important;
    text-overflow: ellipsis;
    overflow: hidden;
    -webkit-line-clamp: 1;
    -webkit-box-orient: vertical;
    margin: 0;
    margin-left: 0.35rem;
    margin-top: 0.19rem;
    margin-bottom: 0.18rem;
    color: #333333;
    font-family: Adobe Heiti Std R;
    font-size: 15px;
    color: #999;
}
.keyThr{
    margin: 0;
    margin-left: 0.35rem;
    margin-bottom: 0.32rem;
    color: #333333;
    font-family: Adobe Heiti Std R;
    font-size: 15px;
    color: #999;
}
.keyNum{
    font-size: 16px;
    color: #fff;
}
.onlistall {
    background: #169bd5;
    color: #fff;
}
.listall {
    color: rgba(102, 102, 102, 1);
    background: rgba(238, 238, 238, 1);
}
.add {
    font-size: 14px;
    width: 1rem;
    text-align: center;
    line-height: 0.48rem;
    border-radius: 15px;
    border: 1px solid #4ca8f8;
    background: #4ca8f8;
    color: #fff;
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
.addBtn{
    /* position: fixed; */
    /* width: 100%; */
    bottom: 1.5rem;
    margin: 0 auto;
    margin-bottom: 1rem;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
}
.addBtn>img{
    width: 1.3rem;
    height: 1.3rem;
}
.addBtn>button{
    margin-top: 0.2rem;
    width: 3rem;
    font-size: 0.32rem;
    background: #4CA9F9;
    color: #fff;
    border: none;
    padding: 0.12rem;
    border-radius: 0.2rem;

}
.van-button--small{
    background: none;
    color: #006BDF;
}
</style>
