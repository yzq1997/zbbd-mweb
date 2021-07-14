<template>
    <div class="container">
        <van-overlay class="mtk2" :show="load">
            <div class="wrapper" @click.stop>
                <van-loading size="40px" style="color: #fff"
                    >加载中...</van-loading
                >
            </div>
        </van-overlay>
        <van-overlay class="mtk2" :show="load1">
            <div class="wrapper" @click.stop>
                <van-loading size="40px" style="color: #fff"
                    >加载中...</van-loading
                >
            </div>
        </van-overlay>

        <!-- 跳转抽奖-----暂时隐藏 -->
        <!-- <div class="goluck" @click="goLuck()">
            <img src="../../public/image/goLuck.png" alt="">
        </div> -->

        <!-- 注册 -->
        <div class="goreg" @click="goReg()" v-if="!isVip">
            <img src="../../public/image/goRegister.png" alt="">
        </div>

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

        <!-- 顶部搜索框 -->
        <div class="searchBox"> 
            <div class="search">
                <div class="search-imput" @click="goLookup()">
                    <form
                        action="javascript:return true"
                        style="margin-bottom: 25px"
                    >
                        <input
                            type="search"
                            placeholder="输入“建筑工程”试试"
                            class="search"
                            ref="searchs"
                            v-model="inputValue"
                        />
                    </form>
                </div>
            </div>

        </div>

        <!-- 热搜，数据导出,轮播图 -->
        <div class="nav">
            <div class="tab">
                <ul class="btnBox">
                    <li>
                        <img
                            src="../../public/image/icon-gg.png"
                            alt=""
                            @click="gosearchlist(1)"
                        />
                        <p>招标公告</p>
                    </li>
                    <li>
                        <img
                            src="../../public/image/icon-yg.png"
                            alt=""
                            @click="gosearchlist(2)"
                        />
                        <p>变更公告</p>
                    </li>
                    <li>
                        <img
                            src="../../public/image/icon-jg.png"
                            alt=""
                            @click="gosearchlist(3)"
                        />
                        <p>结果公告</p>
                    </li>
                    <li @click="exportExecl()">
                        <img
                            src="../../public/image/icon-dc.png"
                            alt=""
                            style="margin-top: 0.04rem; height: 1.08rem"
                        />
                        <p>数据导出</p>
                    </li>
                </ul>
            </div>
            <div class="banner">
                <van-swipe
                    class="my-swipe"
                    :autoplay="2000"
                    indicator-color="white"
                >
                    <van-swipe-item
                        ><img
                            style="width: 100%; heigth: 100%"
                            @click="clickSwiper(1)"
                            src="../../public/image/banner1.png"
                            alt=""
                    /></van-swipe-item>
                    <van-swipe-item
                        ><img
                            style="width: 100%; heigth: 100%"
                            @click="clickSwiper(2)"
                            src="../../public/image/banner2.png"
                            alt=""
                    /></van-swipe-item>
                    <van-swipe-item
                        ><img
                            style="width: 100%; heigth: 100%"
                            @click="clickSwiper(3)"
                            src="../../public/image/banner3.png"
                            alt=""
                    /></van-swipe-item>
                </van-swipe>
            </div>
        </div>

        <!-- 内容列表 -->
        <div class="infots">
            <img src="../../public/image/lb-n.gif" alt="" />
            <div class="searchnum">
                今日为你更新了<span style="color: #e7564f; font-weight: 540"
                    >{{ this.datalistnum }}个</span
                >招投标信息
            </div>
        </div>

        <!-- 筛选条件  -->
        <div ref="tabs" :class="scrtop == 50 ? 'tabs dtabs' : 'tabs'">
            <div :class="spanFont1 ? 'tab2' : 'tab1'" @click="showPopup(1)">
                公告类型
                <i v-if="!jt1" class="iconfont icon-jiantou_down"></i>
                <i v-if="jt1" class="iconfont icon-jiantou_up"></i>
            </div>
            <div :class="spanFont2 ? 'tab2' : 'tab1'" @click="showPopup(2)">
                时间
                <i v-if="!jt2" class="iconfont icon-jiantou_down"></i>
                <i v-if="jt2" class="iconfont icon-jiantou_up"></i>
            </div>
            <div :class="spanFont3 ? 'tab2' : 'tab1'" @click="showPopup(3)">
                地区
                <i v-if="!jt3" class="iconfont icon-jiantou_down"></i>
                <i v-if="jt3" class="iconfont icon-jiantou_up"></i>
            </div>
            <div :class="spanFont4 ? 'tab2' : 'tab1'" @click="showPopup(4)">
                更多筛选
                <i v-if="!jt4" class="iconfont icon-jiantou_down"></i>
                <i v-if="jt4" class="iconfont icon-jiantou_up"></i>
            </div>

            <!-- 公告类型 -->
            <van-popup
                v-model="show1"
                class="tabb1"
                position="bottom"
                :overlay="true"
                @click-overlay="closezzc()"
            >
                <div class="ggtype">
                    <div
                        :class="[typeall ? 'onlistall' : 'listall']"
                        @click="changetypeIndex(0, 0)"
                    >
                        <span>全部</span>
                    </div>
                    <div
                        v-for="(item, index) in filterType"
                        :key="index"
                        :class="[
                            typelist.indexOf(item.value) != -1 && !typeall
                                ? 'onlistall'
                                : 'listall',
                        ]"
                        @click="changetypeIndex(index, item.value)"
                        style="
                            float: left;
                            margin-bottom: 0.4rem;
                            margin-top: 0.14rem;
                        "
                    >
                        <span type="type">{{ item.text }}</span>
                    </div>
                    <div style="float: left; width: 100%;margin-bottom:1rem">
                        <button class="listall" @click="chongzhi1()">
                            重置
                        </button>
                        <button class="onlistall" @click="queding()">
                            确定
                        </button>
                    </div>
                </div>
            </van-popup>

            <!-- 时间 -->
            <van-popup
                v-model="show2"
                :overlay="true"
                position="bottom"
                class="tabb2"
                @click-overlay="closezzc()"
            >
                <div class="ggtype">
                    <div
                        :class="[typeallTime ? 'onlistall' : 'listall']"
                        @click="changetypeIndexTime(0, 0)"
                    >
                        <span>全部</span>
                    </div>
                    <div
                        v-for="(item, index) in timer"
                        :key="index"
                        :class="[
                            typelistTime.indexOf(item.value) != -1 &&
                            !typeallTime
                                ? 'onlistall'
                                : 'listall',
                        ]"
                        @click="changetypeIndexTime(index, item.value)"
                        style="
                            float: left;
                            margin-bottom: 0.4rem;
                            margin-top: 0.14rem;
                        "
                    >
                        <span type="type">{{ item.data }}</span>
                    </div>
                </div>
                <div class="rqqj" ref="time">
                    <van-cell
                        title="选择日期区间"
                        style="display: flex; align-items: center"
                        :value="date"
                        @click="timeShow()"
                    />
                </div>
                <div style="float: left; width: 100%;margin-bottom:1rem">
                    <button class="listall" @click="chongzhi2()">重置</button>
                    <button class="onlistall" @click="queding()">确定</button>
                </div>
            </van-popup>

            <!-- 地区 -->
            <van-popup
                v-model="show3"
                class="tabb3"
                position="bottom"
                @click-overlay="closezzc()"
                :style="{ height: '70%' }"
                round
            >
                <!-- :style="{'height':getClientHeight}" -->
                <div class="pppppp">
                    <van-tree-select
                        :items="itemss"
                        :active-id.sync="activeIds"
                        :main-active-index.sync="activeIndex"
                        @click-nav="onNavClick"
                        class="boxCity"
                    >
                        <template #content>
                            <button
                                v-for="(item, index) in items"
                                :class="[
                                    item.IsShow ? 'cityBtnShow' : 'cityBtn',
                                ]"
                                @click="clickItem(item, index)"
                            >
                                {{ item.text }}
                            </button>
                        </template>
                    </van-tree-select>
                    <div style="float: left; width: 100%;border-top: 1px solid #E6E6E6;">
                        <button class="listall" @click="chongzhi3()">
                            重置
                        </button>
                        <button class="onlistall" @click="queding()">
                            确定
                        </button>
                    </div>
                </div>
            </van-popup>

            <!-- 更多筛选 -->
            <van-popup
                class="rightTK"
                v-model="show4"
                position="right"
                :style="{ width: '80%' }"
                @click-overlay="closezzc()"
            >
                <div>
                    <p class="price_p">项目金额</p>
                    <p class="zbje_all">
                        <button
                            :class="
                                this.priceBtn
                                    ? 'btn_zbje1 map'
                                    : 'btn_zbje3 map'
                            "
                            @click="zbjeOneBtn()"
                        >
                            全部
                        </button>
                    </p>
                    <div class="input_box">
                        <input
                            class="priceInput"
                            oninput="value=value.match(/-?[0-9]*\.?[0-9]*/)"
                            type="text"
                            placeholder="起始金额"
                            @click="zbjeOne()"
                            v-model="zbjeOneLeft"
                            @blur="zbjeOneL()"
                        />
                        <span style="color: #4ca9f9">————</span>
                        <input
                            class="priceInput"
                            oninput="value=value.match(/-?[0-9]*\.?[0-9]*/)"
                            type="text"
                            placeholder="结束金额"
                            @click="zbjeOne()"
                            v-model="zbjeOneRight"
                            @blur="zbjeOneR()"
                        />
                    </div>
                    <div class="priseBtnBox">
                        <button class="priseBtn" :class="priseBtnO? 'priseBtnShow' : ''" @click="bigSize(1)">从大到小</button>
                        <button class="priseBtn" :class="priseBtnT? 'priseBtnShow' : ''" @click="bigSize(2)">从小到大</button>
                    </div>
                    
                </div>
                <van-divider />

                <div>
                    <p class="price_p">类型</p>
                    <van-radio-group
                        v-model="radio"
                        class="fwBox"
                        direction="horizontal"
                    >
                        <van-radio class="fw1" name="0">全部</van-radio>
                        <van-radio class="fw1" name="1">个人</van-radio>
                    </van-radio-group>
                </div>
                <!-- <van-divider /> -->

                <p style="font-size:0.3rem;text-align: left;margin-left: 0.3rem;">行业</p>
                <div class="quanbu">
                    <span ref="all" class="qb" @click="industryAll()"
                        >全部</span
                    >
                </div>
                <div class="industryBox">
                    <span 
                        class="industry" 
                        v-for="(item,index) in listNew" 
                        :key="index" 
                        :class="item.isShow ? 'industryShow' : 'industry'" 
                        @click="industry(index)"
                    >
                        {{item.title}}
                    </span>
                </div>


                <div class="btnBox1">
                    <button class="listall" @click="chongzhi4()">重置</button>
                    <button class="onlistall" @click="queding()">确定</button>
                </div>

            </van-popup>
        </div>

        <van-calendar
            ref="checkbox"
            style="padding-right: 10%;bottom:1rem"
            :min-date="minDate"
            :max-date="maxDate"
            v-model="timeshow"
            type="range"
            @confirm="onConfirm"
        ></van-calendar>

        <!-- 主体内容 -->
        <div class="search-list" v-if="searchlist.length > 0">
            <div ref="List" style="background: #fff">
                <div
                    v-for="(item, index) in searchlist"
                    :key="index"
                    class="search-info"
                >
                    <div
                        class="search-title"
                        v-html="item.title"
                        @click="content(item)"
                    ></div>
                    <div class="infotyle">
                        <span
                            v-if="item.Province != ''"
                            style="margin-left: 0.2rem"
                        >
                            {{ item.Province }}</span
                        >
                        <span v-if="item.GGType != ''"> {{ item.GGType }}</span>
                        <span
                            v-if="item.HYType != ''"
                            style="
                                overflow: hidden;
                                white-space: nowrap;
                                text-overflow: ellipsis;
                                width: auto;
                            "
                        >
                            {{ item.HYType }}</span
                        >
                        <span
                            v-if="
                                (item.Amount / 10000).toFixed(2) == 0
                                    ? false
                                    : true
                            "
                            class="prise"
                            >{{ (item.Amount / 10000).toFixed(2) }}万</span
                        >
                        <span
                            v-if="item.JoinDate != ''"
                            style="
                                float: right;
                                border: none;
                                padding: 0.08rem 0rem;
                            "
                        >
                            <van-icon
                                style="top: 1px; right: 1px"
                                name="clock-o"
                            />{{ item.JoinDate }}
                        </span>
                    </div>
                    <div class="search-split"></div>
                </div>
            </div>
            <div
                v-if="searchlistnum == searchlist.length"
                style="
                    width: 100%;
                    text-align: center;
                    font-size: 0.24rem;
                    font-family: PingFang SC;
                    line-height: 60px;
                    margin-bottom:1rem;
                "
            >
                <div class="search-split"></div>
                <span>没有更多了</span>
            </div>
        </div>

        <div
            v-if="(searchlistnum !== searchlist.length) && isFive"
            class="load"
            style="
                width: 100%;
                text-align: center;
                font-size: 0.24rem;
                font-family: PingFang SC;
                line-height: 60px;
            "
        >
            <van-loading type="spinner" size="30px" color="#1989fa" />
        </div>

        <div class="sinVip" v-if="isVipTwo" >
            <p>已载入全部内容</p>
            <p>免费注册会员查看更多内容</p>
            <button @click="goReg()">免费注册会员</button>
        </div>

        <div class="sinVip" v-if="userRoles">
            <p>已载入全部内容</p>
        </div>

        <div v-if="noData" class="noisearchlist">
            <img
                src="../../public/image/search_defualt.png"
                class="defaultImg"
            />
            <div class="noseachinfo">
                哎呀！没有搜索到任何内容、换个词试试吧
            </div>
        </div>
        
        <!-- 筛选模板 -->
        <van-popup
            v-model="showFilter"
            round
            position="bottom"
            :style="{ height: '85%' }"
        >
            <!-- <Search @change="getsearchlist2" /> -->
        </van-popup>

    </div>
</template>

<script>
import Vue from "vue";
import { Toast, Overlay, Swipe, SwipeItem, Lazyload, Loading,Radio,RadioGroup  } from "vant";
import { Dialog } from "vant";
import wx from "weixin-js-sdk";
import Swiper from "swiper";
import Search from "./search";
import Axios from "axios";
import { mapMutations } from "vuex";
import "../lib/swiper/css/swiper.css";
Vue.use(Overlay)
    .use(Swipe)
    .use(SwipeItem)
    .use(Lazyload)
    .use(Loading)
    .use(Toast)
    .use(RadioGroup)
    .use(Radio );
import { baseURL } from "../util/config";
export default {
    components: {
        Search,
    },

    data() {
        return {
            load: false,  //下拉框遮罩层
            load1: true,  //请求数据遮罩层
            msg: "",
            searchlist: [],
            searchlistnum: 0,
            loading: false,
            showFilter: false,
            province: [
                "安徽",
                "澳门",
                "北京",
                "重庆",
                "福建",
                "广州",
                "广西",
                "贵州",
                "甘肃",
                "湖北",
                "河北",
                "黑龙江",
                "海南",
                "河南",
                "湖南",
                "吉林",
                "江苏",
                "江西",
                "辽宁",
                "内蒙古",
                "宁夏",
                "青海",
                "山西",
                "陕西",
                "上海",
                "山东",
                "四川",
                "天津",
                "台湾",
                "西藏",
                "新疆",
                "香港",
                "云南",
                "浙江",
            ],
            filterType: [
                { text: "招标公告", value: 1 },
                { text: "变更公告", value: 2 },
                { text: "结果公告", value: 3 },
            ],
            inputValue: "",
            isshow: true,
            activeindex: 0,
            typelist: [],
            provincelist: [],
            pageSize: 10,
            typeall: true,
            provinceall: true,
            TimeNo: 3,
            openid: "",
            radio: "0",
            btns: false,
            IsAbout: 0,
            scroll: 0,
            result: [],
            presult: [],
            ptype: [],
            checked: true,
            defaultIndex: 1,
            oldobj: "",
            docmHeight: document.documentElement.clientHeight, //默认屏幕高度
            showHeight: document.documentElement.clientHeight, //实时屏幕高度
            hotsearch: [],
            noData: false,
            datalistnum: 0,
            codeShow:false,  //注册弹框
            active: true, //哪种注册方式
            fsyzm: "发送验证码",
            fsyzmTrue: true, //是否在60秒
            tel: "", //手机号
            sms: "", //验证码
            code: "", //邀请码
            isVip:true,  //是否是会员
            isFive:true,
            isVipTwo:false,
            spanFont1: false,
            spanFont2: false,
            spanFont3: false,
            spanFont4: false,
            jt1: false,
            jt2: false,
            jt3: false,
            jt4: false,
            show1: false,
            show2: false,
            show3: false,
            show4: false,
            typeallTime: false,
            timer: [
                { data: "最近3天", value: 3 },
                { data: "最近7天", value: 7 },
                { data: "最近30天", value: 30 },
            ],
            startTime: "", //开始时间
            endTime: "", //结束时间
            typelistTime: [3],
            date: "",
            itemss: [], //所有的省份
            activeIds: [1, 2],
            activeIndex: 0,
            items: [{ text: "全部", IsShow: true }], //所有城市
            citys: [], //选中的城市
            showCity: [],
            showCitypre: [],
            priceBtn: true,
            zbjeOneLeft: "", //金额输入框数据1
            zbjeOneRight: "", //金额输入框数据2
            listNew:[
                {title:'建筑工程',num:0,isShow:false},
                {title:'行政办公',num:1,isShow:false},
                {title:'医疗卫生',num:2,isShow:false},
                {title:'服务采购',num:3,isShow:false},
                {title:'机械设备',num:4,isShow:false},
                {title:'水利水电',num:5,isShow:false},
                {title:'能源化工',num:6,isShow:false},
                {title:'弱电安防',num:7,isShow:false},
                {title:'信息技术',num:8,isShow:false},
                {title:'交通工程',num:9,isShow:false},
                {title:'市政设施',num:10,isShow:false},
                {title:'农林牧渔',num:11,isShow:false},
            ],
            scrtop: 0,
            o: 0, //点击的省份索引,
            timeshow: false,
            minDate: new Date(2020, 5, 1),
            maxDate: new Date(),
            keyWords:[],   //选择的单个行业
            newArr:[],
            ketwordsGroup:[], //选择的行业分类
            color:true,    //全部按钮是否被选中
            HomePageDataList:'', //用户首页能够查看数据条数
            RoleName:'',  //用户角色
            userRoles:false,  //数据底部提示
            DataDetailsView:'',//数据详情查看数目
            priseBtnO:false,
            priseBtnT:false,
            industryArr:[],  //选中行业
            IsAmountSort:0,  //从大到小排序
        };
    },

    methods: {
        ...mapMutations(["activeOne", "show"]),

        //金额判断
        zbjeOneL() {
            if (
                Number(this.zbjeOneRight) <= Number(this.zbjeOneLeft) &&
                this.zbjeOneRight !== ""
            ) {
                Toast.fail("请输入正确的金额(低到高)");
                this.zbjeOneLeft = "";
            }
            if (this.zbjeOneRight == "" && this.zbjeOneLeft == "") {
                document.getElementsByClassName("map")[0].className =
                    "btn_zbje1 map";
            }
        },
        zbjeOneR() {
            if (
                Number(this.zbjeOneRight) <= Number(this.zbjeOneLeft) &&
                this.zbjeOneRight !== ""
            ) {
                Toast.fail("请输入正确的金额(低到高)");
                this.zbjeOneRight = "";
            }
            if (this.zbjeOneRight == "" && this.zbjeOneLeft == "") {
                document.getElementsByClassName("map")[0].className =
                    "btn_zbje1 map";
            }
        },

        //点击招标金额按钮
        zbjeOneBtn() {
            this.priceBtn = true;
            this.zbjeOneLeft = "";
            this.zbjeOneRight = "";
        },
        //点击招标金额输入框
        zbjeOne() {
            this.priceBtn = false;
        },
        //时间按钮
        changetypeIndexTime(index, value) {
            this.startTime = "";
            this.endTime = "";
            this.date = "";
            if (value != 0 && this.typelistTime.indexOf(value) != -1) {
                this.typeallTime = false;
                this.typelistTime.splice(this.typelistTime.indexOf(value), 1);
            } else if (value != 0 && this.typelistTime.indexOf(value) == -1) {
                this.typelistTime = [];
                this.typelistTime.push(value);
                // this.typelistTime.splice( this.typelistTime.indexOf( value ), 1 )
                this.typeallTime = false;
            }
            if (value == 0) {
                this.typelistTime = [0];
                this.typeallTime = true;
            }
            this.$refs.time.style.border = "1px solid rgb(179, 169, 169)";
        },
        formatDate(date) {
            return `${date.getFullYear()}/${
                date.getMonth() + 1
            }/${date.getDate()}`;
        },

        //点击确定按钮
        queding() {
            this.jt1 = false;
            this.jt2 = false;
            this.jt3 = false;
            this.jt4 = false;
            this.showCitypre = [];
            // console.log(this.typelist); //公告类型
            // console.log(this.typelistTime); //时间
            // console.log(this.startTime); //时间
            // console.log(this.endTime); //时间
            // console.log(this.zbjeOneLeft);  //金额
            // console.log(this.zbjeOneRight); //金额
            // console.log(this.radio);  // 范围
            // console.log(this.keyWords);

            this.newArr = [...new Set(this.keyWords)];

            this.spanFont1 = false;
            this.spanFont2 = false;
            this.spanFont3 = false;
            this.spanFont4 = false;
            this.$dataApi({
                url: "api/Area/GetAllProCity",
                method: "POST",
            }).then((res) => {
                // console.log(res);
                this.showCity = JSON.parse(JSON.stringify(this.citys)); //选中的城市
                var that = this;
                var s = "";
                res.map((t, j) => {
                    let y = t.CityList.map(function (v, i, arr) {
                        return that.showCity.indexOf(v) !== -1;
                    });
                    var x = y.every((f) => {
                        return f;
                    });
                    if (x) {
                        t.CityList.map((t1) => {
                            this.showCity.splice(this.showCity.indexOf(t1), 1);
                        });
                        if (j == 0) {
                            if (this.showCitypre.indexOf("江苏") == -1) {
                                this.showCitypre.push("江苏");
                            }
                        } else if (j == 1) {
                            if (this.showCitypre.indexOf("北京") == -1) {
                                this.showCitypre.push("北京");
                            }
                        } else if (j == 2) {
                            if (this.showCitypre.indexOf("天津") == -1) {
                                this.showCitypre.push("天津");
                            }
                        } else if (j == 3) {
                            if (this.showCitypre.indexOf("河北") == -1) {
                                this.showCitypre.push("河北");
                            }
                        } else if (j == 4) {
                            if (this.showCitypre.indexOf("山西") == -1) {
                                this.showCitypre.push("山西");
                            }
                        } else if (j == 5) {
                            if (this.showCitypre.indexOf("内蒙古") == -1) {
                                this.showCitypre.push("内蒙古");
                            }
                        } else if (j == 6) {
                            if (this.showCitypre.indexOf("辽宁") == -1) {
                                this.showCitypre.push("辽宁");
                            }
                        } else if (j == 7) {
                            if (this.showCitypre.indexOf("吉林") == -1) {
                                this.showCitypre.push("吉林");
                            }
                        } else if (j == 8) {
                            if (this.showCitypre.indexOf("黑龙江") == -1) {
                                this.showCitypre.push("黑龙江");
                            }
                        } else if (j == 9) {
                            if (this.showCitypre.indexOf("上海") == -1) {
                                this.showCitypre.push("上海");
                            }
                        } else if (j == 10) {
                            if (this.showCitypre.indexOf("浙江") == -1) {
                                this.showCitypre.push("浙江");
                            }
                        } else if (j == 11) {
                            if (this.showCitypre.indexOf("安徽") == -1) {
                                this.showCitypre.push("安徽");
                            }
                        } else if (j == 12) {
                            if (this.showCitypre.indexOf("福建") == -1) {
                                this.showCitypre.push("福建");
                            }
                        } else if (j == 13) {
                            if (this.showCitypre.indexOf("江西") == -1) {
                                this.showCitypre.push("江西");
                            }
                        } else if (j == 14) {
                            if (this.showCitypre.indexOf("山东") == -1) {
                                this.showCitypre.push("山东");
                            }
                        } else if (j == 15) {
                            if (this.showCitypre.indexOf("河南") == -1) {
                                this.showCitypre.push("河南");
                            }
                        } else if (j == 16) {
                            if (this.showCitypre.indexOf("湖北") == -1) {
                                this.showCitypre.push("湖北");
                            }
                        } else if (j == 17) {
                            if (this.showCitypre.indexOf("湖南") == -1) {
                                this.showCitypre.push("湖南");
                            }
                        } else if (j == 18) {
                            if (this.showCitypre.indexOf("广东") == -1) {
                                this.showCitypre.push("广东");
                            }
                        } else if (j == 19) {
                            if (this.showCitypre.indexOf("广西") == -1) {
                                this.showCitypre.push("广西");
                            }
                        } else if (j == 20) {
                            if (this.showCitypre.indexOf("海南") == -1) {
                                this.showCitypre.push("海南");
                            }
                        } else if (j == 21) {
                            if (this.showCitypre.indexOf("重庆") == -1) {
                                this.showCitypre.push("重庆");
                            }
                        } else if (j == 22) {
                            if (this.showCitypre.indexOf("四川") == -1) {
                                this.showCitypre.push("四川");
                            }
                        } else if (j == 23) {
                            if (this.showCitypre.indexOf("贵州") == -1) {
                                this.showCitypre.push("贵州");
                            }
                        } else if (j == 24) {
                            if (this.showCitypre.indexOf("云南") == -1) {
                                this.showCitypre.push("云南");
                            }
                        } else if (j == 25) {
                            if (this.showCitypre.indexOf("西藏") == -1) {
                                this.showCitypre.push("西藏");
                            }
                        } else if (j == 26) {
                            if (this.showCitypre.indexOf("陕西") == -1) {
                                this.showCitypre.push("陕西");
                            }
                        } else if (j == 27) {
                            if (this.showCitypre.indexOf("甘肃") == -1) {
                                this.showCitypre.push("甘肃");
                            }
                        } else if (j == 28) {
                            if (this.showCitypre.indexOf("青海") == -1) {
                                this.showCitypre.push("青海");
                            }
                        } else if (j == 29) {
                            if (this.showCitypre.indexOf("宁夏") == -1) {
                                this.showCitypre.push("宁夏");
                            }
                        } else if (j == 30) {
                            if (this.showCitypre.indexOf("新疆") == -1) {
                                this.showCitypre.push("新疆");
                            }
                        } else if (j == 31) {
                            if (this.showCitypre.indexOf("澳门") == -1) {
                                this.showCitypre.push("澳门");
                            }
                        } else if (j == 32) {
                            if (this.showCitypre.indexOf("香港") == -1) {
                                this.showCitypre.push("香港");
                            }
                        } else if (j == 33) {
                            if (this.showCitypre.indexOf("台湾") == -1) {
                                this.showCitypre.push("台湾");
                            }
                        }
                    }
                });
                // console.log(this.showCity);   //市
                // console.log(this.showCitypre); //省

                if (this.citys.length == 0 && this.showCitypre.length == 0) {
                    this.showCitypre = "";
                }
                
                this.show1 = false;
                this.show2 = false;
                this.show3 = false;
                this.show4 = false;
                this.load1 = true;
                this.getsearchlist(20);
            });
        },
        //点击重置按钮
        chongzhi() {
            this.typelist = [];
            this.typeall = true;
            this.typelistTime = [3];
            this.typeallTime = false;
            this.startTime = "";
            this.endTime = "";
            if (this.$refs.time) {
                this.$refs.time.style.border = "1px solid rgb(179, 169, 169)";
            }
            this.date = "";
            this.itemss.map((item) => {
                item.badge = "";
            });
            this.items.map((item) => {
                item.IsShow = false;
            });
            if (this.o == 0) {
                this.items = [{ text: "全部", IsShow: true }];
            }
            this.citys = [];
            this.showCity = [];
            this.showCitypre = [];
            this.priceBtn = true;
            this.zbjeOneLeft = "";
            this.zbjeOneRight = "";
            this.radio = "0";

            this.keyWords = [];
            this.ketwordsGroup = [];
            this.color = false;
            this.quanbu();
            this.keyWords = [];
        },
        //公告重置
        chongzhi1() {
            this.typelist = [];
            this.typeall = true;
            
        },
        //时间重置
        chongzhi2(){
            this.typelistTime = [3];
            this.typeallTime = false;
            this.startTime = "";
            this.endTime = "";
            if (this.$refs.time) {
                this.$refs.time.style.border = "1px solid rgb(179, 169, 169)";
            }
            this.date = "";
        },
        //地区重置
        chongzhi3(){
            this.itemss.map((item) => {
                item.badge = "";
            });
            this.items.map((item) => {
                item.IsShow = false;
            });
            if (this.o == 0) {
                this.items = [{ text: "全部", IsShow: true }];
            }
            this.citys = [];
            this.showCity = [];
            this.showCitypre = [];
        },
        //更多筛选重置
        chongzhi4(){
            this.priceBtn = true;
            this.zbjeOneLeft = "";
            this.zbjeOneRight = "";
            this.radio = "0";
            this.priseBtnT = false;
            this.priseBtnO = false;
            this.keyWords = [];
            this.ketwordsGroup = [];
            this.color = false;
            this.keyWords = [];
            
            this.industryAll();
        },
        timeShow() {
            this.timeshow = true;
        },

        //时间区间
        onConfirm(date) {
            this.typeallTime = false;
            this.typelistTime = [];
            const [start, end] = date;
            this.timeshow = false;
            // this.date = this.formatDate(date);
            this.date = `${this.formatDate(start)} - ${this.formatDate(end)}`;
            var y = date[0].getFullYear();
            var m = date[0].getMonth() + 1;
            m = m < 10 ? "0" + m : m;
            var d = date[0].getDate();
            d = d < 10 ? "0" + d : d;
            this.startTime = "" + y + "-" + m + "-" + d;

            var y1 = date[1].getFullYear();
            var m1 = date[1].getMonth() + 1;
            m1 = m1 < 10 ? "0" + m1 : m1;
            var d1 = date[1].getDate();
            d1 = d1 < 10 ? "0" + d1 : d1;
            this.endTime = "" + y1 + "-" + m1 + "-" + d1;
            this.$refs.time.style.border = "1px solid red";
        },

        //点击遮罩层
        closezzc() {
            // console.log(444);
            this.spanFont1 = false;
            this.spanFont2 = false;
            this.spanFont3 = false;
            this.spanFont4 = false;
            this.jt1 = false;
            this.jt2 = false;
            this.jt3 = false;
            this.jt4 = false;
            setTimeout(function(){
                document.getElementsByClassName("searchBox")[0].style.zIndex = 5;
            },500)
            
        },
        //点击筛选条件
        showPopup(i) {
            if(document.getElementsByClassName("tabs")[0].className.indexOf('dtabs') !== -1){
                document.getElementsByClassName("searchBox")[0].style.zIndex = 0;
            };
            let that = this;
            if (i == 1) {
                if (this.show1) {
                    this.show1 = false;
                    this.spanFont1 = false;
                    this.spanFont2 = false;
                    this.spanFont3 = false;
                    this.spanFont4 = false;
                    this.jt1 = false;
                    this.jt2 = false;
                    this.jt3 = false;
                    this.jt4 = false;
                } else {
                    that.$dataApi({
                        url:'api/Users/AddUserTriggerEvent',
                        method:'POST',
                        data:{
                            OpenId:sessionStorage.getItem("openID"),   
                            EventName:'公告类型',
                            JudgeValue:0
                        }
                    }).then(response=>{ 
                        //   console.log(response);
                        // this.historyword=response;
                    });
                    this.show1 = true;
                    this.show2 = false;
                    this.show3 = false;
                    this.show4 = false;
                    this.spanFont1 = true;
                    this.spanFont2 = false;
                    this.spanFont3 = false;
                    this.spanFont4 = false;
                    this.jt1 = true;
                    this.jt2 = false;
                    this.jt3 = false;
                    this.jt4 = false;
                }
            } else if (i == 2) {
                if (this.show2) {
                    this.show2 = false;
                    this.spanFont1 = false;
                    this.spanFont2 = false;
                    this.spanFont3 = false;
                    this.spanFont4 = false;
                    this.jt1 = false;
                    this.jt2 = false;
                    this.jt3 = false;
                    this.jt4 = false;
                } else {
                    that.$dataApi({
                        url:'api/Users/AddUserTriggerEvent',
                        method:'POST',
                        data:{
                            OpenId:sessionStorage.getItem("openID"),   
                            EventName:'时间',
                            JudgeValue:0
                        }
                    }).then(response=>{ 
                        //   console.log(response);
                        // this.historyword=response;
                    });
                    this.show2 = true;
                    this.show1 = false;
                    this.show3 = false;
                    this.show4 = false;
                    this.spanFont1 = false;
                    this.spanFont2 = true;
                    this.spanFont3 = false;
                    this.spanFont4 = false;
                    this.jt1 = false;
                    this.jt2 = true;
                    this.jt3 = false;
                    this.jt4 = false;
                }
            } else if (i == 3) {
                if (this.show3) {
                    this.show3 = false;
                    this.spanFont1 = false;
                    this.spanFont2 = false;
                    this.spanFont3 = false;
                    this.spanFont4 = false;
                    this.jt1 = false;
                    this.jt2 = false;
                    this.jt3 = false;
                    this.jt4 = false;
                } else {
                    that.$dataApi({
                        url:'api/Users/AddUserTriggerEvent',
                        method:'POST',
                        data:{
                            OpenId:sessionStorage.getItem("openID"),   
                            EventName:'地区',
                            JudgeValue:0
                        }
                    }).then(response=>{ 
                        //   console.log(response);
                        // this.historyword=response;
                    });
                    this.show3 = true;
                    this.show1 = false;
                    this.show2 = false;
                    this.show4 = false;
                    this.spanFont1 = false;
                    this.spanFont2 = false;
                    this.spanFont3 = true;
                    this.spanFont4 = false;
                    this.jt1 = false;
                    this.jt2 = false;
                    this.jt3 = true;
                    this.jt4 = false;
                }
            } else {
                
                if (this.show4) {
                    this.show4 = false;
                    this.spanFont1 = false;
                    this.spanFont2 = false;
                    this.spanFont3 = false;
                    this.spanFont4 = false;
                    this.jt1 = false;
                    this.jt2 = false;
                    this.jt3 = false;
                    this.jt4 = false;
                } else {
                    this.show1 = false;
                    this.show2 = false;
                    this.show3 = false;
                    this.show4 = true;
                    this.spanFont1 = false;
                    this.spanFont2 = false;
                    this.spanFont3 = false;
                    this.spanFont4 = true;
                    this.jt1 = false;
                    this.jt2 = false;
                    this.jt3 = false;
                    this.jt4 = true;
                }
            }
        },
        //点击地区左边的每一个省份
        onNavClick(ind) {
            // console.log(this.itemss[ind].text);

            this.o = ind;
            let that = this;
            this.$dataApi({
                url: "api/Area/GetCity",
                method: "POST",
                data: {
                    province: this.itemss[ind].text,
                },
            }).then((res) => {
                // console.log(res);
                //点击的是不是全国按钮
                if (this.itemss[ind].text == "全国") {
                    this.items = [{ text: "全部", IsShow: true }];
                    if (this.citys.length !== 0) {
                        this.items[0].IsShow = false;
                    }
                } else {
                    this.items = res;
                    this.items.map((item, index) => {
                        if (this.citys.indexOf(item.text) !== -1) {
                            this.items[index].IsShow = true;
                        }
                    });
                    var s = this.items.every(function (x) {
                        return x.IsShow;
                    });
                    if (s) {
                        this.items[0].IsShow = true;
                        this.items.unshift({ text: "全部", IsShow: true });
                    } else {
                        this.items.unshift({ text: "全部", IsShow: false });
                    }
                }
            });
        },
        //点击地区右边每一个城市
        clickItem(item, index) {
            //点击的是不是全国
            if (this.o == 0) {
                if (!this.items[0].IsShow) {
                    this.items[0].IsShow = true;
                    this.citys = [];
                    this.itemss.map((item) => {
                        item.badge = "";
                    });
                }
            } else {
                //点击的是不是全部按钮
                if (item.text !== "全部") {
                    //点击的不是全部按钮
                    this.items[0].IsShow = false;
                    if (this.citys.indexOf(item.text) !== -1) {
                        //已经被点击了的城市
                        this.citys.splice(this.citys.indexOf(item.text), 1);
                        this.items[index].IsShow = false;
                        var leng = 0;
                        this.items.map((item) => {
                            if (item.IsShow) {
                                leng++;
                            }
                        });
                        this.itemss[this.o].badge = leng;
                        if (leng == 0) {
                            this.itemss[this.o].badge = "";
                        }
                    } else {
                        //没有被点击的城市
                        this.citys.push(item.text);
                        this.items[index].IsShow = true;
                        //判断是否全部点完了
                        var len = 0;
                        this.items.map((item) => {
                            if (item.IsShow) {
                                len++;
                            }
                            if (len == this.items.length - 1) {
                                this.items[0].IsShow = true;
                            }
                        });
                        this.itemss[this.o].badge = len;
                    }
                } else {
                    //点击的是全部按钮
                    if (this.items[0].IsShow) {
                        this.itemss[this.o].badge = "";
                        this.items[0].IsShow = false;
                        this.items.map((item) => {
                            item.IsShow = false;
                            if (this.citys.indexOf(item.text) !== -1) {
                                this.citys.splice(
                                    this.citys.indexOf(item.text),
                                    1
                                );
                            }
                        });
                    } else {
                        this.itemss[this.o].badge = this.items.length - 1;
                        this.items.map((item) => {
                            item.IsShow = true;
                            if (this.citys.indexOf(item.text) !== -1) {
                                this.citys.splice(
                                    this.citys.indexOf(item.text),
                                    1
                                );
                            }
                            this.citys.push(item.text);
                        });
                        this.items[0].IsShow = true;
                    }
                }
            }

            if (this.citys.indexOf("全部") !== -1) {
                this.citys.splice(this.citys.indexOf("全部"), 1);
            }
            if (this.citys.length == 345) {
                this.citys = [];
                this.itemss.map((item) => {
                    item.badge = "";
                });
                this.items.map((item) => {
                    item.IsShow = false;
                });
                if (this.o == 0) {
                    this.items = [{ text: "全部", IsShow: true }];
                }
            }
            // console.log(this.citys);
            // console.log(this.items);
        },

        
        // 热搜去查询
        gosearch: function (e) {
            this.$router.push({
                path: "/searchList",
                query: { hotinputvalue: e },
            });
        },
        // 导出
        exportExecl: function () {
            let that = this;
            //点击次数
            that.$dataApi({
                url:'api/Users/AddUserTriggerEvent',
                method:'POST',
                data:{
                    OpenId:sessionStorage.getItem("openID"),   
                    EventName:'数据导出',
                    JudgeValue:0
                }
            }).then(response=>{});

            that.$dataApi({
                url: "api/RoleManage/GetUserRoleByOpenId",
                method: "GET",
                data: {
                    openId: sessionStorage.getItem("openID"),
                },
            }).then((res) => {
                console.log(res);
                if(res.RoleManagement.DataExport == 0){
                    this.$router.push("/export");
                }else{
                    Toast.fail('权限不足');
                };
            });


        },
        //点击搜索
        goLookup() {
            this.$router.push("/lookup");
        },
        //跳转抽奖
        // goLuck(){
        //     this.$router.push("/signone");
        // },
        // 注册
        goReg(){
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
                        that.code = '';
                        that.codeShow = false;
                        that.yaoqingma();
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
                Toast.success("注册成功");
                that.yaoqingma();
                // that.codeShow = false;
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
        //是否填写过邀请码
        yaoqingma() {
            this.$dataApi({
                url: "api/Users/IsExistInvitationCode",
                method: "GET",
                data: {
                    openID: sessionStorage.getItem("openID"),
                },
            }).then((res) => {
                // console.log(res);
                if (res.Msg == "true") {
                    this.isVip = true;
                } else {
                    this.isVip = false;
                };
            });
            
        },

        //点击轮播图事件
        clickSwiper(index) {
            if (index === 1) {
                this.$router.push("/keyWords");
            } else if (index === 2) {
                this.exportExecl();
            } else if (index === 3) {
                if (!this.isVip) {
                    this.codeShow = true;
                }
            }
        },

        getUrlParam: function (name) {
            var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
            var r = window.location.search.substr(1).match(reg);
            if (r != null) return decodeURIComponent(r[2]);
            return null;
        },
        getScroll: function (e) {
            // console.log(this.searchlist.length);
            // console.log(this.HomePageDataList);
            if(this.$refs.List !== null){
                this.scrtop = this.$refs.List.getBoundingClientRect().top >= 100 ? this.$refs.List.getBoundingClientRect().top : 50;
            }

            if(this.searchlist.length == this.HomePageDataList){
                if(this.RoleName == '免费用户'){
                    this.isFive = false;
                    this.isVipTwo = true;
                    this.userRoles = false;
                    return false;
                }else if(this.RoleName == '注册用户'){
                    this.isFive = false;
                    this.isVipTwo = false;
                    this.userRoles = true;
                    return false;
                }
                
            }
            
            
            // if(this.isVip == false){
            //     this.isFive = false;
            //     return false;
            // };
            this.isFive = true;
            let tops =
                document.documentElement.scrollTop || document.body.scrollTop; //滚动条的高度
            let that = this;
            if (e && typeof e == "number" && e !== 0) {
                setTimeout(() => {
                    document.documentElement.scrollTop = e;
                    document.body.scrollTop = e;
                    tops = e || document.body.scrollTop;
                }, 0);
            };

            setTimeout(function () {
                if (
                    that.$refs.List.offsetHeight - tops - screen.height <=
                        -78 &&
                    that.searchlistnum != that.searchlist.length &&
                    that.btns
                ) {
                    that.pageSize = that.pageSize + 10;
                    that.getsearchlist(that.pageSize);
                }
            }, 500);
        },
        //查询页面
        gosearchlist: function (e) {
            let that = this;
            let type = '';
            if(e == 1){ 
                type = '招标公告'
            }else if(e == 2){
                type = '变更公告'
            }else{
                type = '结果公告'
            };
            that.$dataApi({
                url:'api/Users/AddUserTriggerEvent',
                method:'POST',
                data:{
                    OpenId:sessionStorage.getItem("openID"),   
                    EventName:type,
                    JudgeValue:0
                }
            }).then(response=>{});

            sessionStorage.setItem("sGGtype", e);
            this.$router.push({
                path: "/searchList",
                query: {
                    GGType: e,
                },
            });
        },
        // 跳转到维护页面
        gettop: function () {
            this.$router.push({ path: "/keyWords" });
        },

        //残忍离开事件
        likai: function () {
            this.isfree = false;
            sessionStorage.setItem("isfree", "isfree");
        },
        //跳转到我的页面
        gomy() {
            this.$router.push("/my");
        },

        //添加查看记录
        AddViewRestrictionsInfo(id){
            this.$dataApi({
                url: "api/RoleManage/AddViewRestrictionsInfo",
                method: "POST",
                data: {
                    OpenId: sessionStorage.getItem("openID"),
                    BaseID:id
                },
            }).then((res) => {});
        },

        //点击招标信息
        content: function (e) {
            let that = this;
            console.log(e);

            //查看招标数据ID集合
            this.$dataApi({
                url: "api/RoleManage/GetViewRestrictionsInfo",
                method: "GET",
                data: {
                    OpenId: sessionStorage.getItem("openID"),
                },
            }).then((res) => {
                // console.log(that.DataDetailsView);
                // return
                // console.log(res.BaseIDList.indexOf(e.id));
                if(res.BaseIDList.indexOf(e.id) > -1){
                    console.log('成功');
                }else{
                    if(res.BaseIDList.length < that.DataDetailsView){
                        that.AddViewRestrictionsInfo(e.id);
                        console.log('成功');
                    }else if(that.DataDetailsView == 0){
                        that.AddViewRestrictionsInfo(e.id);
                        console.log('成功');
                    }else{
                        if(that.RoleName == '免费用户'){
                            // Toast.fail('今日可查看次数已用完！');
                            that.codeShow = true;
                        }else if(that.RoleName == '注册用户'){
                            Toast.fail('注册用户每日可查看5条数据');
                        }
                        return false;
                    };
                  

                };

                sessionStorage.setItem("sharetitle", e.oldtitle);
                window.removeEventListener("scroll", this.getScroll);
                this.$dataApi({
                    url: "api/Users/SaveMyTrack",
                    method: "POST",
                    data: {
                        OpenId: sessionStorage.getItem("openID"),
                        id: e.id,
                        Source: 1,
                    },
                }).then((res) => {});
                this.$dataApi({
                    url: "api/Users/CheckIsConcernProject",
                    method: "POST",
                    data: {
                        OpenId: sessionStorage.getItem("openID"),
                        id: e.id,
                        Source: 1,
                    },
                }).then((res) => {
                    console.log(res);
                    this.msg = res.Msg;
                    let newUrl = e.ZBUrl.replace(/ContentHtml/, "ContentHtmlTest");
                    //是否被关注
                    let a = e.ZBUrl + `?IsConcerned=${this.msg}&id=${e.id}&openID=${sessionStorage.getItem("openID")}&Source=1`;
                    this.$router.push({
                        path: "/iframe",
                        query: {
                            ZBUrl: a,
                            id: e.id,
                        },
                    });
                });
            });  
        },

        restore: function () {
            this.changetypeIndex(0, 0);
            this.changeproIndex(-1, -1);
            this.TimeNo = 3;
            this.defaultIndex = 1;
            this.radio = "1";
            this.presult = [];
            // this.remover();
            this.checked = false;
            this.result = [];
        },

        changetypeIndex(index, value) {
            if (value != 0 && this.typelist.indexOf(value) != -1) {
                this.typeall = false;
                this.typelist.splice(this.typelist.indexOf(value), 1);
            } else if (value != 0 && this.typelist.indexOf(value) == -1) {
                this.typelist.push(value);
                this.typeall = false;
            }
            if (value == 0) {
                this.typelist = [""];
                this.typeall = true;
            }
        },
        changeproIndex(index, value) {
            if (value != -1 && this.provincelist.indexOf(value) != -1) {
                this.provinceall = false;
                this.provincelist.splice(this.provincelist.indexOf(value), 1);
            } else if (value != -1 && this.provincelist.indexOf(value) == -1) {
                this.provincelist.push(value);
                this.provinceall = false;
            }
            if (value == -1) {
                this.provincelist = [];
                this.provinceall = true;
            }
        },
        // 搜索
        searching: function (e) {
            if (e.keyCode == 13 || e.keyCode == 108) {
                this.getsearchlist();
            }
        },

        // 查询列表数据
        getsearchlist: function (pageSize) {
            let that = this;
            // console.log(that.pageSize);
            this.btns = false;
            let day2 = new Date();
            day2.setTime(day2.getTime());

            if (that.radio == "1") {
                that.IsAbout = 1;
            } else {
                that.IsAbout = 0;
            }
            that.$dataApi({
                url: "api/baseData/GetData",
                method: "POST",
                data: {
                    title: that.inputValue, //标题，模糊查询
                    TimeNo: that.typelistTime.toString(), //0(全部),3(3天内)，7(7天内)，30(1个月内)，90(3个月内)
                    GGType:
                        that.typelist.length == 0
                            ? ""
                            : that.typelist.toString(), //全部0,招标公告1,变更公告2,结果公告3,拼接
                    // Provinces:this.oldobj === "" ? ((this.presult.toString().length ==0 || this.presult.indexOf("全国")==0) ? "" : this.presult.toString()) :this.oldobj.Provinces ,//省份拼接
                    Provinces: that.showCitypre.toString(), //省份拼接
                    TimeBegin: that.startTime, //开始时间
                    TimeEnd: that.endTime,
                    pageNo: 1,
                    // pageSize: that.isVip ? (pageSize || that.pageSize) : 50,
                    pageSize:that.HomePageDataList == 0 ? pageSize : (that.HomePageDataList > 20 ? pageSize : that.HomePageDataList),
                    openid: sessionStorage.getItem("openID"),
                    IsAbout: that.IsAbout,
                    Industry: that.industryArr.length == 0 ? '' : that.industryArr.toString(),
                    Source: 1,
                    Cities: that.showCity.toString(),
                    BeginAmount: that.zbjeOneLeft,
                    EndAmount: that.zbjeOneRight,
                    IsAmountSort:that.IsAmountSort
                },
            })
                .then((response) => {
                    console.log(JSON.parse(response.Data));
                    that.datalistnum = JSON.parse(response.Data).TotalCount;
                    if (JSON.parse(response.Data).Rows.length === 0) {
                        that.userRoles = false;
                        that.noData = true;
                    }else{
                        that.noData = false;
                    };
                    if(JSON.parse(response.Data).TotalCount == 0){
                        that.isVipTwo = false;
                        document.getElementsByClassName("tabs")[0].className = 'tabs';
                    }else{
                        if(JSON.parse(response.Data).TotalCount < 50 || JSON.parse(response.Data).TotalCount == 50){
                            if(!that.isVip){
                                that.isVipTwo = false;
                            }
                        };
                        if(JSON.parse(response.Data).TotalCount > 50){
                            if(!that.isVip){
                                that.isVipTwo = true;
                            }
                        };
                    }
                    that.searchlistnum = JSON.parse(response.Data).TotalCount;
                    that.searchlist = JSON.parse(response.Data).Rows;
                    // console.log(that.searchlist);
                    that.searchlist.forEach((item) => {
                        item.oldtitle = item.title;
                    });
                    that.load1 = false;
                    if (that.inputValue.length > 0) {
                        const searchVal = that.inputValue;
                        // 匹配关键字正则
                        const replaceReg = new RegExp(searchVal, "g");
                        // 高亮替换v-html值
                        const replaceString = `<font color='#F14F4A'>${searchVal}</font>`;
                        for (let i = 0; i < that.searchlist.length; i++) {
                            // 开始替换
                            that.searchlist[i].title = that.searchlist[i].title
                                .replace(replaceReg, replaceString)
                                .slice(0, 90);
                        }
                    }

                    that.searchlist.forEach((item) => {
                        item.GGType = item.FormatGGType;
                        // item.JoinDate = '2020-08-19 12:00:00'
                        let date = item.JoinDate.replace(
                            new RegExp("-", "gm"),
                            "/"
                        );
                        let EndTime = new Date(date).getTime(); //获取抓取时间的秒数
                        let s = day2.getTime() / 1000 - EndTime / 1000;
                        let m =
                            day2.getTime() / 1000 / 60 - EndTime / 1000 / 60;
                        let h =
                            day2.getTime() / 1000 / 60 / 60 -
                            EndTime / 1000 / 60 / 60;
                        if (s > 0 && s < 60) {
                            item.JoinDate = parseInt(s) + "秒前";
                        } else if (m > 0 && m < 60) {
                            item.JoinDate = parseInt(m) + "分钟前";
                        } else if (h > 0 && h < 24) {
                            item.JoinDate = parseInt(h) + "小时前";
                        } else if (h >= 24 && h <= 48) {
                            item.JoinDate = "昨天";
                        } else if (h > 48) {
                            item.JoinDate = item.JoinDate.substring(0, 10);
                        }
                    });
                    that.btns = true;
                })
                .catch(function (error) {
                    console.log(error);
                });
            this.showFilter = false;
        },

        isshowFilter: function () {
            this.showFilter = true;
            this.noData = false;
        },

        onChangeTime(picker, value, index) {
            this.TimeNo = value.value;
            this.defaultIndex = index;
        },

        //拿到省份
        getprovince: function () {
            let that = this;

            this.$dataApi({
                url: "api/Area/GetArea",
                method: "POST",
            })
                .then((response) => {
                    // console.log(response);
                    that.itemss = JSON.parse(JSON.stringify(response));
                    response.forEach((item, index) => {
                        that.ptype.push(item.AreaChar);
                        that.itemss[index].text = response[index].AreaName;
                        that.itemss[index].badge = "";
                    });
                    that.ptype = Array.from(new Set(that.ptype));
                    that.itemss.unshift({ text: "全国" });
                    // console.log(that.itemss);
                })
                .catch(function (error) {
                    console.log(error);
                });
        },

        toggle(index, item) {
            if (this.presult.indexOf("全国") == 0) {
                this.presult.shift();
            }
            if (this.presult.indexOf(item) > -1) {
                this.presult.splice(this.presult.indexOf(item), 1);
            } else {
                this.presult.push(item);
            }
            this.$refs.checkboxes[index].toggle();
        },
        remover() {
            this.checked = false;
            this.result = [];
            this.presult = [];
            this.presult.push("全国");
        },

        GetHotSearchKeyword: function () {
            this.$dataApi({
                url: "api/Stat/GetHotSearchKeyword",
                method: "GET",
                data: {},
            }).then((response) => {
                this.hotsearch = response;
            });
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

        //拿到用户角色（默认宝典）
        getUserRole(){
            let that = this;
            that.$dataApi({
                url: "api/RoleManage/GetUserRoleByOpenId",
                method: "GET",
                data: {
                    openId:sessionStorage.getItem("openID"),
                },
            }).then((res) => {
                console.log(res);
                that.HomePageDataList = res.RoleManagement.HomePageDataList;
                that.RoleName = res.RoleManagement.RoleName;
                that.DataDetailsView = res.RoleManagement.DataDetailsView;
            });
        },

        //添加免费用户信息
        AddFreeUser(){
            this.$dataApi({
                url: "api/Users/AddFreeUser",
                method: "POST",
                data: {
                    openid:sessionStorage.getItem("openID"),
                    sex:sessionStorage.getItem('sex'),
                    language:sessionStorage.getItem('language'),
                    city:sessionStorage.getItem('city'),
                    province:sessionStorage.getItem('province'),
                    country:sessionStorage.getItem('country'),
                    headimgurl:sessionStorage.getItem('headimgurl'),
                    subscribe_time:sessionStorage.getItem('subscribe_time'),
                    remark:sessionStorage.getItem('remark'),
                    IsUpdate:sessionStorage.getItem('IsUpdate'),
                    nickname:sessionStorage.getItem('NickName'),
                    presubscribe_time:sessionStorage.getItem('presubscribe_time'),
                },
            }).then((res) => {
                // console.log(res);

            });
        },

        //金额排序---从大到小
        bigSize(i){
            if(i == 1){
                if(this.priseBtnO){
                    this.priseBtnO = false;
                    this.IsAmountSort = 0;
                }else{
                    this.priseBtnO = true;
                    this.priseBtnT = false;
                    this.IsAmountSort = 1;
                }
            }else{
                if(this.priseBtnT){
                    this.priseBtnT = false;
                    this.IsAmountSort = 0;
                }else{
                    this.priseBtnT = true;
                    this.priseBtnO = false;
                    this.IsAmountSort = 2;
                }
            }
            // console.log(this.priseBtnO);
            // console.log(this.priseBtnT);
            
        },

        //点击单个行业
        industry(index){
            
            // console.log(this.listNew[index].title);
            if(this.industryArr.indexOf(this.listNew[index].title) > -1 ){
                this.industryArr.splice(this.industryArr.indexOf(this.listNew[index].title),1);
                this.listNew[index].isShow = false;
            }else{
                this.industryArr.push(this.listNew[index].title);
                this.listNew[index].isShow = true;
            };
            console.log(this.industryArr);
            console.log(this.listNew);
            this.$refs.all.style.background = "#FFFFFF";
        },
        //点击全部行业
        industryAll(){
            this.industryArr = [];
            this.listNew.map((item,index)=>{
                item.isShow = false;
            })
            this.$refs.all.style.background = "#CEF0FF";
        },

    },

    created: function () {

        // var isIphone = navigator.userAgent.includes('iPhone');
        // console.log(isIphone);

        let that = this;
        that.getUserRole();
        that.getUUID();
        this.COMMON.initRem();
        this.getprovince();
        this.GetHotSearchKeyword();
        this.yaoqingma(); //判断改用户是否填写过邀请码
        this.AddFreeUser(); //添加免费用户信息
        setTimeout(function(){
            that.getsearchlist(10);
        },500)
    },

    //监听页面高度
    watch: {
        showHeight(val) {
            if (this.docmHeight > val) {
                document.getElementsByClassName("gettop")[0].style.display =
                    "none";
                document.getElementsByClassName("gomy")[0].style.display =
                    "none";
            } else if ((this.docmHeight = val)) {
                document.getElementsByClassName("gettop")[0].style.display =
                    "block";
                document.getElementsByClassName("gomy")[0].style.display =
                    "block";
            }
        },
    },

    beforeRouteEnter(to, from, next) {
        next((vm) => {
            vm.show();
            vm.yaoqingma()
            if (to.path === "/index") {
                // 苹果分享设置
                var u = navigator.userAgent;
                var isiOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/); //ios终端

                if (isiOS && sessionStorage.getItem("flagIos") == null) {
                    sessionStorage.setItem("flagIos", 1);
                    location.reload();
                }
                vm.show();
                vm.activeOne(0);
                vm.scrtop = 1;
                
            }
            if (from.path == "/iframe") {
                // console.log(vm.scroll);
                window.addEventListener("scroll", vm.getScroll(vm.scroll));
                window.addEventListener("scroll", vm.getScroll);
            } else if (from.path == "/keywordslist") {
                vm.getsearchlist();
                vm.isfree = false;
            } else if (from.path == "/searchList") {
                from.meta.keepAlive = false;
            } else if (from.path == "/Keyinfolist") {
                from.meta.keepAlive = false;
            }
        });
    },

    mounted: function () {
        //实例化轮播图
        var that = this;
        that.$nextTick(function () {
            var mySwiper = new Swiper(".swiper-container", {
                direction: "horizontal" /*横向滑动*/,
                spaceBetween: 25,
                slidesPerView: 5,
            });
        });
        window.addEventListener("scroll", this.getScroll);
        window.onresize = () => {
            return (() => {
                this.showHeight = document.documentElement.clientHeight;
            })();
        };
    },
    beforeRouteLeave(to, from, next) {
        // console.log(to)
        localStorage.removeItem("flagIos");
        //  console.log(to.path==="concise")
        // 如果在window中出现的滚动条
        this.scroll =
            document.documentElement.scrollTop || document.body.scrollTop;
        if (to.path === "/" || to.path === "/concise") {
            wx.closeWindow();
        } else {
            next();
        }
    },
    destroyed: function () {
        window.removeEventListener("scroll", this.getScroll);
    },
};
</script>

<style scoped>
.a {
    color: #0099ff;
}
.container {
    width: 100%;
    /* overflow: auto; */
    position: relative;
    margin-top: 1rem;
}
.wrapper {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 100%;
}
.block {
    width: 120px;
    height: 120px;
    background-color: #fff;
}
.van-loading__text {
    font-size: 16px;
    color: #fff;
}
.quxiao {
    width: 0.5rem;
    height: 0.5rem;
    background: pink;
    position: absolute;
    top: 75%;
    left: 88%;
    z-index: 50000;
}
.gomy {
    display: fixed;
    width: 1.25rem;
    height: 1.25rem;
    position: fixed;
    top: 76%;
    left: 80%;
}
.mtk {
    position: fixed;
    width: 100%;
    height: 100%;
    z-index: 998;
}
.mtk2 {
    position: fixed;
    width: 100%;
    height: 100%;
    z-index: 998;
}
.freeRegister {
    width: 5.08rem;
    height: 5.79rem;
}
.aa {
    position: relative;
    width: 5.08rem;
    height: 5.79rem;
    float: left;
}
.freeBtn {
    position: relative;
    top: -1.8rem;
    left: 0.54rem;
    width: 4rem;
    height: 1rem;
    background: url(../../public/image/zcbtn.png) no-repeat;
    background-size: 100% 100%;
    border: none;
    z-index: 6;
    float: left;
}
.leave {
    display: block;
    width: 2rem;
    position: relative;
    top: -1.7rem;
    left: 1.54rem;
    font-size: 0.2rem;
    color: #999999;
    float: left;
}
.searchBox {
    height: 1rem;
    width: 100%;
    position: fixed;
    background: #f0f0f0;
    margin-top: -1rem;
    z-index: 99;
}
.infots {
    width: 100%;
    height: 0.5rem;
    background: #f0f0f0;
}
.infots img {
    width: 0.22rem;
    height: 0.22rem;
    float: left;
    margin-top: 0.14rem;
    margin-left: 0.39rem;
}
.tabs {
    display: flex;
    justify-content: space-around;
    padding-top: 0.1rem;
    background: #fff;
    height: 0.5rem;
    border-bottom: 1px solid #eee;
}
.dtabs {
    position: fixed;
    width: 100%;
    top: 1rem;
}
.tab1 {
    font-size: 0.3rem;
}
.tab2 {
    font-size: 0.3rem;
    color: #4ca9f9;
}
.tabb1 {
    width: 100%;
    padding: 0.3rem 0;
    overflow: hidden;
    bottom: 1rem;
    /* top: 3.95rem; */
}
.tabb2 {
    width: 100%;
    padding: 0.3rem 0;
    overflow: hidden;
    bottom: 1rem;
}
.tabb3 {
    width: 100%;
    overflow: hidden;
    bottom: 0.3rem;
}
.search {
    height: 1rem;
    width: 100%;
    margin: 0 auto;
}
.searchnum {
    font-size: 0.24rem;
    font-family: PingFang SC;
    font-weight: normal;
    color: #666666;
    line-height: 0.5rem;
    text-align: left;
    padding-left: 0.1rem;
    float: left;
}
.search-imput {
    overflow: hidden;
    width: 100%;
    height: 0.64rem;
    position: relative;
    align-items: center;
    display: flex;
    justify-content: space-between;
    margin: 0.18rem 0.32rem;
    float: left;
}
.search-imput input {
    background: #fafafa;
    width: 6.8rem;
    height: 0.64rem;
    background: #fff;
    border: 0;
    line-height: 0.64rem;
    border-radius: 0.6rem;
    text-align: left;
    font-size: 0.26rem;
    font-family: PingFang SC;
    font-weight: 500;
    color: rgba(191, 191, 191, 1);
    line-height: 0.38rem;
    padding-left: 0.31rem;
}
.search-name {
    float: right;
    height: 0.64rem;
    width: 1.3rem;
    margin: 0.18rem 0;
    display: table-cell;
    vertical-align: middle;
}
.search-name img {
    width: 0.26rem;
    height: 0.26rem;
    float: left;
    margin: 0.19rem 0;
}
.search-name span {
    width: 1rem;
    height: 0.26rem;
    font-size: 0.28rem;
    font-family: PingFang SC;
    font-weight: bold;
    color: rgba(59, 59, 59, 1);
    line-height: 0.26rem;
    float: left;
    margin: 0.19rem 0;
}
.search-list {
    height: auto;
    width: 100%;
    margin: 0 auto;
}
.nav {
    background: #fff;
}
.hot {
    background: #f0f0f0;
}
.tab {
    border-bottom: 1px solid #f0f0f0;
    height: 1.7rem;
    
}
.btnBox {
    display: flex;
    justify-content: space-between;
    font-size: 16px;
    margin: 0 0.4rem;
}
.btnBox img {
    width: 0.88rem;
    height: 0.88rem;
    margin: 0 auto;
    margin-top: 0.21rem;
}
.btnBox p {
    font-size: 0.24rem;
    font-family: PingFang SC;
    font-weight: 500;
    color: rgba(51, 51, 51, 1);
    line-height: 0.43rem;
    margin: 0 auto;
}
.banner {
    width: 6.7rem;
    height: 2.2rem;
    margin: 0.2rem 0.4rem;
}
.van-swipe {
    height: 2.2rem;
}
.swiperImg {
    width: 100%;
    height: 100%;
    margin: 0 auto;
}
.search-split {
    width: 7.5rem;
    height: 0.16rem;
    background: rgba(242, 242, 242, 1);
}
.van-ellipsis {
    text-align: center;
}
.search-title {
    width: 90%;
    margin-left: 0.23rem;
    margin-top: 0.38rem;
    font-size: 0.32rem;
    font-family: PingFang SC;
    font-weight: bold;
    color: rgba(48, 48, 48, 1);
    line-height: 0.48rem;
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 2;
    overflow: hidden;
    text-overflow: ellipsis;
    text-align: left;
}
.infotyle {
    width: 100%;
    height: 0.4rem;
    margin-top: 0.29rem;
    margin-bottom: 0.38rem;
}
.infotyle span {
    height: 0.26rem;
    float: left;
    font-size: 0.24rem;
    font-family: PingFang SC;
    font-weight: 500;
    color: rgba(171, 171, 171, 1);
    line-height: 0.26rem;
    margin-right: 0.1rem;
    padding: 0.08rem 0.12rem;
    border: 0.01rem solid rgba(232, 232, 232, 1);
    border-radius: 20px;
    max-width: 8em;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
}
.infotyle span:nth-of-type(1) {
    background: #579ce9;
    color: #f1f4fb;
}
.infotyle span:nth-of-type(2) {
    background: #ecfdf7;
    color: #6da88a;
}
.infotyle span:nth-of-type(3) {
    background: #ebeeff;
    color: #7886c2 !important;
}
.infotyle span:nth-of-type(4) {
    margin-right: 0;
}
.van-list__finished-text {
    width: 7.5rem;
    height: 2.25rem;
    background: rgba(240, 240, 240, 1);
    font-size: 0.28rem;
    font-family: PingFang SC;
    font-weight: 500;
    color: rgba(203, 203, 203, 1);
    line-height: 2.25rem;
    text-align: center;
}
.container .title {
    width: 1.5rem;
    height: 0.57rem;
    font-size: 0.28rem;
    font-family: PingFang SC;
    font-weight: 800;
    color: rgba(171, 171, 171, 1);
    line-height: 0.58rem;
    margin-top: 0.46rem;
    margin-left: 0.4rem;
}
.container hr {
    width: 6.9rem;
    height: 0.01rem;
    background: rgba(232, 232, 232, 1);
}
.tyoe-list-type {
    margin: 0 auto;
    display: block;
    margin-top: 0.24rem;
    margin-left: 0.2rem;
}
.tyoe-list-type :nth-child(2) {
    display: none;
}
.tyoe-list-province {
    margin: 0 auto;
    display: block;
    margin-top: 0.24rem;
    margin-left: 0.2rem;
}
.listall {
    width: 1.65rem;
    height: 0.8rem;
    background: rgba(247, 247, 247, 1);
    border-radius: 0.1rem;
    margin-left: 0.1rem;
    font-size: 0.28rem;
    font-family: PingFang SC;
    line-height: 0.8rem;
}
.onlistall {
    width: 1.65rem;
    height: 0.8rem;
    background: rgb(76, 168, 248);
    border-radius: 0.1rem;
    margin-left: 0.1rem;
    font-size: 0.28rem;
    font-family: PingFang SC;
    line-height: 0.8rem;
    color: white;
}

.bottom {
    width: 100%;
    margin: 0 auto;
}
.bottom button {
    width: 2rem;
    height: 0.8rem;
    background: rgba(191, 191, 191, 1);
    border-radius: 0rem;
    float: right;
    margin: 0.4rem 0.29rem;
    font-size: 0.28rem;
    font-family: PingFang SC;
    font-weight: 500;
    color: rgba(255, 255, 255, 1);
    line-height: 0.58rem;
}
.gettop {
    display: fixed;
    width: 1.25rem;
    height: 1.25rem;
    position: fixed;
    top: 68%;
    left: 80%;
}
.van-radio--horizontal {
    margin-right: 12px;
    /* margin-left: 0.88rem; */
    margin-bottom: 0.25rem;
}
.van-radio__label {
    font-size: 0.24rem;
    font-family: PingFang SC;
    line-height: 0.8rem;
}
.van-cell--clickable {
    height: 0.6rem;
}
.van-checkbox {
    height: 0.6rem;
}
.defaultImg {
    width: 1.95rem;
    height: 2.07rem;
    margin: 2.72rem auto 02.78rem auto;
    display: block;
    margin-bottom: 0.5rem;
    float: inherit;
}
.noseachinfo {
    width: 4.54rem;
    height: 0.38rem;
    font-size: 0.24rem;
    font-family: PingFang SC;
    font-weight: 500;
    color: rgba(171, 171, 171, 1);
    line-height: 0.38rem;
    margin-left: 1.48rem;
}
.hot-search {
    overflow: hidden;
}
.hot-search img {
    width: 1.05rem;
    height: 0.4rem;
    display: block;
    float: left;
    margin-left: 0.4rem;
    margin-right: 0.16rem;
    margin-top: 0;
}
.hot-search li {
    display: block;
    float: left;
    font-size: 0.24rem;
    font-family: PingFang SC;
    font-weight: 500;
    color: rgba(51, 51, 51, 1);
    line-height: 0.48rem;
    margin-right: 0.44rem;
}
.hot-search span:last-child {
    margin-right: 0;
}
.swiper-container {
    width: 75% !important;
}
.swiper-slide {
    margin-right: 0.4rem;
    font-size: 0.24rem;
    width: auto !important;
    line-height: 0.4rem;
}
.prise {
    background: #fcf3f4;
    color: #e58890 !important;
}
.onlistall {
    width: 1.65rem;
    height: 0.8rem;
    background: rgb(76, 168, 248);
    border-radius: 0.1rem;
    margin-left: 0.1rem;
    font-size: 0.28rem;
    font-family: PingFang SC;
    line-height: 0.8rem;
    color: white;
    text-align: center;
    border: none;
}
.listall {
    width: 1.65rem;
    height: 0.8rem;
    background: rgba(247, 247, 247, 1);
    border-radius: 0.1rem;
    margin-left: 0.1rem;
    font-size: 0.28rem;
    font-family: PingFang SC;
    line-height: 0.8rem;
    text-align: center;
    border: none;
}

/* 筛选  */
.van-tree-select__nav {
    flex: none !important;
}

.ggtype {
    padding-bottom: 0.2rem;
}
.rqqj {
    margin: 10% auto 5%;
    /* margin-top: 20%; */
    /* margin-bottom: 10%; */
    line-height: 44px;
    height: 44px;
    width: 90%;
    border: 1px solid rgb(179, 169, 169);
    display: flex;
    align-items: center;
    justify-content: space-around;
}
.cityBtn {
    background: #fff;
    color: #333;
    border: none;
    background: rgba(247, 247, 247, 1);
    width: 1.65rem;
    height: 0.8rem;
    border-radius: 0.1rem;
    font-size: 0.28rem;
    font-family: PingFang SC;
    margin-left: 0.2rem;
    margin-top: 0.2rem;
    float: left;
    padding: 0;
}
.cityBtnShow {
    background: #4ca8f8;
    color: #fff;
    border: none;
    /* border: 1px solid #4CA8F8; */
    width: 1.65rem;
    height: 0.8rem;
    border-radius: 0.1rem;
    font-size: 0.28rem;
    font-family: PingFang SC;
    margin-left: 0.2rem;
    margin-top: 0.2rem;
    float: left;
    padding: 0;
}
.cityBtnShow:nth-of-type(1) {
    float: none;
    display: block;
}
.cityBtn:nth-of-type(1) {
    float: none;
    display: block;
}
.quanbu {
    display: flex;
    margin-top: 0.1rem;
}
.rightTK {
    min-height: 100%;
    z-index: 2026;
}
.price_p {
    font-size: 0.3rem;
    text-align: left;
    margin-left: 16px;
}
.zbje_all {
    font-size: 0.3rem;
    text-align: left;
    margin-left: 0.35rem;
}

.input_box {
    font-size: 0.3rem;
    display: flex;
    justify-content: center;
    align-items: center;
    margin-left: 0.2rem;
}
.input_box > input {
    width: 35%;
    border-radius: 0.5rem;
    border: 1px solid #bbb;
}
.priceInput {
    height: 0.5rem;
    font-size: 0.26rem;
    padding-left: 0.2rem;
    color: #666;
}
.fwBox {
    margin-top: 0.3rem;
    margin-left: 0.3rem;
}
.fw1 {
    font-size: 16px;
}


.btnBox1 {
    display: flex;
    justify-content: space-around;
    align-items: center;
    height: 1rem;
    width: 100%;
    z-index: 99999;
    background: #fff;
    /* margin-bottom: 1.5rem; */
}
.onlistall {
    width: 1.65rem;
    height: 0.8rem;
    background: rgb(76, 168, 248);
    border-radius: 0.1rem;
    margin-left: 0.1rem;
    font-size: 0.28rem;
    font-family: PingFang SC;
    line-height: 0.8rem;
    color: white;
    text-align: center;
    border: none;
}
.listall {
    width: 1.65rem;
    height: 0.8rem;
    background: rgba(247, 247, 247, 1);
    border-radius: 0.1rem;
    margin-left: 0.1rem;
    font-size: 0.28rem;
    font-family: PingFang SC;
    line-height: 0.8rem;
    text-align: center;
    border: none;
}
.zbje_all {
    font-size: 0.3rem;
    text-align: left;
    margin-left: 0.35rem;
}
.btn_zbje1,
.btn_zbje2 {
    background: #4ca8f8;
    border: none;
    color: #fff;
    width: 1.65rem;
    height: 0.65rem;
    border-radius: 0.1rem;
    font-size: 0.28rem;
    font-family: PingFang SC;
}
.btn_zbje3 {
    background: #fff;
    color: #333;
    border: 1px solid rgb(112, 110, 110);
    width: 1.65rem;
    height: 0.65rem;
    border-radius: 0.1rem;
    font-size: 0.28rem;
    font-family: PingFang SC;
}
.qb{
    font-size: 14px;
    width: 1.4rem;
    border: 1px solid rgb(185, 178, 178);
    background: #CEF0FF;
    padding: 2px;
    border-radius: 3px;
    text-align: center;
    margin-left: 0.2rem;
}
.priseBtnBox{
    display: flex;
}
.priseBtn{
    font-size: 0.2rem;
    width: 1.65rem;
    height: 0.63rem;
    margin: 0.2rem 0.3rem;
    border: 1px solid #999;
    border-radius: 0.1rem;
    /* padding: 0.1rem; */
    background: none;
    /* color: #333; */
}
.priseBtnShow{
    background: #4CA8F8;
    border: none;
    border-radius: 0.1rem;
    color: #fff;
}
.industryBox{
    display: flex;
    flex-wrap: wrap;
}
.industry{
    font-size: 0.3rem;
    border: 1px solid rgb(185, 178, 178);
    border-radius: 3px;
    /* margin-left: 5%; */
    width: 1.46rem;
    height: 0.48rem;
    line-height: 0.48rem;
    color: #333;
    text-align: center;
    margin: 0.2rem 0.2rem;
}
.industryShow{
    font-size: 0.3rem;
    border-radius: 3px;
    border: 1px solid rgb(185, 178, 178);
    /* margin-left: 5%; */
    width: 1.46rem;
    height: 0.48rem;
    line-height: 0.48rem;
    color:#333;
    text-align: center;
    margin: 0.2rem 0.2rem;
    background: #CEF0FF;
}

.van-icon{
    position: static;
}
.van-sidebar-item__info{
    background-color: #4CA8F8 !important;
}


.goluck{
    position: fixed;
    bottom: 1rem;
    right: 0.2rem;
}
.goluck>img{
    width: 1.5rem;
    height: 1.5rem;
}
.goreg{
    position: fixed;
    bottom: 2.5rem;
    right: 0.2rem;
}
.goreg>img{
    width: 1.5rem;
    height: 1.5rem;
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
.sinVip{
    margin-bottom: 0.7rem;
    padding-top: 0.1rem;
}
.sinVip>p{
    font-size: 0.28rem;
    margin: 0;
    color: #999;
}
.sinVip>button{
    font-size: 0.32rem;
    background-color: #006BDF;
    border: none;
    color: #fff;
    padding: 0.2rem;
    border-radius: 0.1rem;
}
.van-button--small{
    background: none !important;
    color: #006BDF !important;
}
.pppppp{
    height: 100%;
}
.boxCity{
    height: 74% !important;
}
</style>
