<template>
    <div class="container">
        <div class="top">
            <!-- 搜索内容 -->
            <div class="search">
                <van-dropdown-menu class="botBox" >
                    <van-dropdown-item v-model="value1" :options="option1" @change="chang" @open="open"/>
                </van-dropdown-menu>
                <div class="search-imput">
                    <form action="javascript:return true" style="margin-bottom:25px">
                    <input type="search" placeholder="输入“建筑工程”试试" class="search" ref="searchs" v-model="inputValue"   @keyup="searching"  />  
                    </form>
                </div>
                <div class="search-name" @click="searching({keyCode:13})">
                    <span>搜索</span>
                </div>
            </div>

            <!-- 内容列表数量 -->
            <div class="searchnum" v-if="this.searchlistnum > 0">为您检索到了<span style="color:#E7564F;">{{this.searchlistnum}}个</span>推送信息</div>
            
            <!-- 筛选条件 -->
            <div class="tab">
                <div :class="spanFont1?'tab2':'tab1'" @click="showPopup(1)">
                    公告类型
                    <i v-if="!jt1" class="iconfont icon-jiantouxia"></i>
                    <i v-if="jt1" class="iconfont icon-jiantoushang"></i>
                </div>
                <div :class="spanFont2?'tab2':'tab1'" @click="showPopup(2)">
                    时间
                    <i v-if="!jt2" class="iconfont icon-jiantouxia"></i>
                    <i v-if="jt2" class="iconfont icon-jiantoushang"></i>
                </div>
                <div :class="spanFont3?'tab2':'tab1'" @click="showPopup(3)">
                    地区
                    <i v-if="!jt3" class="iconfont icon-jiantouxia"></i>
                    <i v-if="jt3" class="iconfont icon-jiantoushang"></i>
                </div>
                <div :class="spanFont4?'tab2':'tab1'" @click="showPopup(4)">
                    更多筛选
                    <i v-if="!jt4" class="iconfont icon-jiantouxia"></i>
                    <i v-if="jt4" class="iconfont icon-jiantoushang"></i>
                </div>

                <!-- 公告类型 -->
                <van-popup v-model="show1" class="tabb1" :overlay='true' @click-overlay='closezzc()'>
                    <div class="ggtype">
                        <div :class="[ typeall ?  'onlistall'  :'listall' ]" @click='changetypeIndex(0,0)'>
                            <span>全部</span>
                        </div>
                        <div v-for="(item,index) in filterType" :key="index" :class="[ typelist.indexOf( item.value )!=-1 && !typeall ?  'onlistall'  :'listall' ]" @click='changetypeIndex(index,item.value)' style="float: left;margin-bottom: 0.4rem;margin-top: 0.14rem;">
                            <span type='type'>{{ item.text}}</span>
                        </div>
                        <div style="float:left;width: 100%">
                            <button class="listall" @click="chongzhi()">重置</button>
                            <button class="onlistall" @click="queding()">确定</button>
                        </div>
                    </div>
                </van-popup>

                <!-- 时间 -->
                <van-popup v-model="show2" class="tabb2" @click-overlay='closezzc()'>
                    <div class="ggtype">
                        <div :class="[ typeallTime ?  'onlistall'  :'listall' ]" @click='changetypeIndexTime(0,0)'>
                            <span>全部</span>
                        </div>
                        <div v-for="(item,index) in timer" :key="index" :class="[ typelistTime.indexOf( item.value )!=-1 && !typeallTime ?  'onlistall'  :'listall' ]" @click='changetypeIndexTime(index,item.value)' style="float: left;margin-bottom: 0.4rem;margin-top: 0.14rem;">
                            <span type='type'>{{ item.data}}</span>
                        </div>
                    </div>
                    <div class="rqqj" ref="time">
                        <van-cell title="选择日期区间"  style="display: flex;align-items: center;" :value="date" @click="timeShow()" />
                        
                    </div>
                    <div style="float:left;width: 100%">
                        <button class="listall" @click="chongzhi()">重置</button>
                        <button class="onlistall" @click="queding()">确定</button>
                    </div>
                </van-popup>

                <!-- 地区 -->
                <van-popup v-model="show3" class="tabb3" @click-overlay='closezzc()'>
                    <!-- :style="{'height':getClientHeight}" -->
                    <div>
                        <van-tree-select
                            :items="itemss"
                            :active-id.sync="activeIds"
                            :main-active-index.sync="activeIndex"
                            @click-nav="onNavClick" 
                            
                        >
                            <template #content>
                                <button v-for="(item,index) in items" :class="[item.IsShow ? 'cityBtnShow' : 'cityBtn']" @click="clickItem(item,index)">
                                    {{item.text}}
                                </button> 
                            </template>
                        </van-tree-select>
                        <div style="float:left;width: 100%">
                            <button class="listall" @click="chongzhi()">重置</button>
                            <button class="onlistall" @click="queding()">确定</button>
                        </div>
                    </div>
                </van-popup>

                <!-- 更多筛选 -->
                <van-popup class="rightTK" v-model="show4" position="right" :style="{ width:'80%', }" @click-overlay='closezzc()'>
                    <div>
                        <p class="price_p">项目金额</p>
                        <p class="zbje_all"><button :class="this.priceBtn ? 'btn_zbje1 map' : 'btn_zbje3 map'" @click="zbjeOneBtn()">全部</button></p>
                        <div class="input_box">
                            <input class="priceInput" oninput="value=value.match(/-?[0-9]*\.?[0-9]*/)" type="text" placeholder="起始金额" @click="zbjeOne()" v-model="zbjeOneLeft" @blur="zbjeOneL()">
                            <span style="color:#4CA9F9;">————</span>
                            <input class="priceInput" oninput="value=value.match(/-?[0-9]*\.?[0-9]*/)" type="text" placeholder="结束金额" @click="zbjeOne()" v-model="zbjeOneRight" @blur="zbjeOneR()">
                        </div>
                        <div class="priseBtnBox">
                            <button class="priseBtn" :class="priseBtnO? 'priseBtnShow' : ''" @click="bigSize(1)">从大到小</button>
                            <button class="priseBtn" :class="priseBtnT? 'priseBtnShow' : ''" @click="bigSize(2)">从小到大</button>
                        </div>
                    </div>
                    <van-divider />

                    <div>
                        <p class="price_p">类型</p>
                        <van-radio-group v-model="radio" class="fwBox" direction="horizontal">
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

                    <div class="btnBox">
                        <button class="listall" @click="chongzhi()">重置</button>
                        <button class="onlistall" @click="queding()">确定</button>
                    </div>
                </van-popup>
            </div>
        </div>

        <van-calendar @close='closeTime()'  ref="checkbox" style="padding-right:10%"  :min-date="minDate" :max-date="maxDate"  v-model="show" type="range" @confirm="onConfirm"></van-calendar>

        <!-- 筛选模板 -->
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


         <!-- 查询列表 -->
        <div class="search-list" v-if="searchlist.length>0">
          <div ref="Listsearch" style="background:#fff">
            <div v-for="(item,index) in searchlist" :key="index" class="search-info">
                <div class="search-split"></div>
                <div class="search-title" v-html="item.title" @click="content(item)">
                  <!-- {{item.PT_title | ellipsis}} -->
                </div>
                <div class="infotyle">
                    <span v-if='item.GGType !=""' style="margin-left: 0.23rem;border-radius: 5px;"> {{item.GGType}}</span>
                    <span v-if='item.Province !=""'> {{item.Province}}</span>
                    <span v-if='item.HYType !=""'> {{item.HYType}}</span>
                    <span v-if="(item.Amount/10000).toFixed(2) == 0 ? false: true" class="prise">{{(item.Amount/10000).toFixed(2)}}万</span>
                    <span v-if='item.JoinDate != ""' style="float: right;border: none;padding: 0.08rem 0rem;">
                      <van-icon style="position: static;top: 1px;right: 1px;" name="clock-o" />{{item.JoinDate}}
                    </span>
                </div>
                </div>
            </div>
            <div v-if="searchlistnum == searchlist.length && iscx==false" style="width:100%;text-align:center;font-size: 0.24rem;font-family: PingFang SC;line-height: 60px;color:#999;margin-bottom:1rem">
              <div class="search-split"></div>
                <span>没有更多了</span>
              </div>
            <div v-if="searchlistnum > searchlist.length && iscx==true" style="width:100%;text-align:center;font-size: 0.24rem;font-family: PingFang SC;line-height: 60px;margin-bottom:1rem">
              <div class="search-split"></div>
                <van-loading  type="spinner" color="#1989fa" size="40px">加载中...</van-loading>
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

        <div v-if="iscx==true && searchlistnum==0" style="width:100%;text-align:center;font-size: 0.24rem;font-family: PingFang SC;line-height: 60px;margin-bottom:1rem;position:fixed;top:50%">
            <van-loading  type="spinner" color="#1989fa" size="40px">加载中...</van-loading>
        </div>

        <!-- 请求数据为空 -->
        <div v-if="searchlistnum==0 && iscx==false" class="noisearchlist">
            <img src="../../public/image/search_defualt.png" class="defaultImg"/>
            <div class="noseachinfo">没有搜索到任何内容、换个词试试吧</div>
        </div>

        <!-- 点击确定按钮出现加载中，请求完成此弹框消失 -->
        <van-overlay class="mtk2" :show="load1" >
            <div class="wrapper" @click.stop>
                <van-loading size="40px" style="color:#fff">加载中...</van-loading>
            </div>
        </van-overlay>

         <!-- 遮罩层 -->
        <van-overlay class="mtk2" :show="load">
            <div class="wrapper" @click.stop>
                <van-loading size="40px" style="color: #fff"
                    >加载中...</van-loading
                >
            </div>
        </van-overlay>
    </div>
</template>

<script>
import Vue from 'vue';
import { Toast ,Collapse, CollapseItem, Popup,Calendar ,TreeSelect ,Divider,RadioGroup, Radio,Sticky ,Loading   } from 'vant';
Vue.use(Collapse).use(CollapseItem).use(Popup).use(Calendar ).use(TreeSelect ).use(Loading).use(Divider ).use(RadioGroup).use(Radio).use(Sticky );
// import Search from "./search"
export default {
    // components:{
    //     Search,
    // },

    data() {
        return {
            load1:false,
            load:true,
            value: '',
            onvalue: 0,
            searchlist:[],
            searchlistnum:0,
            pageNo:0,
            inputValue:"",
            showFilter: false,
            pagesize:10,
            btns:false,
            issx:false,
            sxdata:"",
            scroll:0,
            iscx:false,
            Cities:'',
            BeginAmount:'',
            EndAmount:'',
            showPopover: false,
            show1:false,
            show2:false,
            show3:false,
            show4:false,
            filterType:[
                { text: '招标公告', value: 1 },
                { text: '变更公告', value: 2 },
                { text: '结果公告', value: 3 },
            ],
            typelist:[],
            typeall:true,
            timer:[
                {data:"最近3天",value: 3},
                {data:"最近7天",value: 7},
                {data:"最近30天",value: 30}
            ],
            startTime:"",  //开始时间
            endTime:"",   //结束时间
            typeallTime:true,
            typelistTime:[0],
            minDate: new Date(2020, 5, 1),
            maxDate: new Date(),
            show:false,
            date:"",
            itemss:[], //所有的省份
            activeIds: [1, 2],
            activeIndex: 0,
            o:0,//点击的省份索引
            ptype:[],
            items:[{text:'全部',IsShow:true}],  //所有城市
            citys:[], //选中的城市
            showCity:[],
            showCitypre:[],
            showCity1:'全国',
            priceBtn:true,
            zbjeOneLeft:'', //金额输入框数据1
            zbjeOneRight:'', //金额输入框数据2
            radio: "0",
            activeNames: ['1'],
            
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
            keyWords:[],   //选择的单个行业
            newArr:[],
            ketwordsGroup:[], //选择的行业分类
            color:true,    //全部按钮是否被选中
            btnA:true,   //类型中的全部按钮是否被选中
            spanFont1:false,
            spanFont2:false,
            spanFont3:false,
            spanFont4:false,
            jt1:false,
            jt2:false,
            jt3:false,
            jt4:false,
            isVip:false,  //是否会员
            codeShow:false,  //会员注册弹框
            active: true, //哪种注册方式
            fsyzm: "发送验证码",
            fsyzmTrue: true, //是否在60秒
            tel: "", //手机号
            sms: "", //验证码
            code: "", //邀请码
            isVipTwo:false,
            isFive:true,

            pageFrom:true,  //判断是公告页面还是搜索页面  true || false
            AnnounceTypeDataList:'', //用户公告页面能够查看数据条数
            SearchDataList:'', //用户搜索页面能够查看数据条数
            RoleName:'',  //用户角色
            userRoles:false,  //数据底部提示
            DataDetailsView:'', //用户能够查看的数据条数
            value1: 0,
            option1: [
                { text: '标题匹配', value: 0 },
                { text: '全文匹配', value: 1 },
            ],  //下拉框
            priseBtnO:false,
            priseBtnT:false,
            industryArr:[],  //选中行业
            IsContext:false,  //标题匹配
            IsAmountSort:0,  //从大到小排序  
        };
    },

    methods: {
        closeTime(){
            document.getElementsByClassName('van-overlay')[0].style.top = '2rem'
        },
        timeShow(){
            this.show = true;
            document.getElementsByClassName('van-overlay')[0].style.top = '0'
        },
        //点击遮罩层
        closezzc(){
            // console.log(444);
            this.spanFont1 = false;
            this.spanFont2 = false;
            this.spanFont3 = false;
            this.spanFont4 = false;
            this.jt1 = false;
            this.jt2 = false;
            this.jt3 = false;
            this.jt4 = false;
        },
        //点击筛选条件
        showPopup(i) {
            if(i == 1){
                if(this.show1){
                    this.show1 = false;
                    this.spanFont1 = false;
                    this.spanFont2 = false;
                    this.spanFont3 = false;
                    this.spanFont4 = false;
                    this.jt1 = false;
                    this.jt2 = false;
                    this.jt3 = false;
                    this.jt4 = false;

                }else{
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
                    
                    setTimeout(()=>{
                    if(document.getElementsByClassName('van-overlay')[0]){
                        document.getElementsByClassName('van-overlay')[0].style.top = '2rem'
                    }
                    },5)
                }
            }else if(i == 2){
                if(this.show2){
                    this.show2 = false;
                    this.spanFont1 = false;
                    this.spanFont2 = false;
                    this.spanFont3 = false;
                    this.spanFont4 = false;
                    this.jt1 = false;
                    this.jt2 = false;
                    this.jt3 = false;
                    this.jt4 = false;
                }else{
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
                    setTimeout(()=>{
                    if(document.getElementsByClassName('van-overlay')[0]){
                        document.getElementsByClassName('van-overlay')[0].style.top = '2rem'
                    }
                    },5)
                }
            }else if(i == 3){
                if(this.show3){
                    this.show3 = false;
                    this.spanFont1 = false;
                    this.spanFont2 = false;
                    this.spanFont3 = false;
                    this.spanFont4 = false;
                    this.jt1 = false;
                    this.jt2 = false;
                    this.jt3 = false;
                    this.jt4 = false;
                }else{
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
                    setTimeout(()=>{
                    if(document.getElementsByClassName('van-overlay')[0]){
                        document.getElementsByClassName('van-overlay')[0].style.top = '2rem'
                    }
                    },5)
                }
            }else{
                if(this.show4){
                    this.show4 = false;
                    this.spanFont1 = false;
                    this.spanFont2 = false;
                    this.spanFont3 = false;
                    this.spanFont4 = false;
                    this.jt1 = false;
                    this.jt2 = false;
                    this.jt3 = false;
                    this.jt4 = false;
                }else{
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
                    // console.log(document.getElementsByClassName('van-overlay'));
                    setTimeout(()=>{
                        if(document.getElementsByClassName('van-overlay')[0]){
                            document.getElementsByClassName('van-overlay')[0].style.top = '0'
                        }
                    },5)
                }
            
            }
            
        },
        isshowFilter:function(){
            this.showFilter=true;
        },
        //点击公告类型中的按钮事件
        changetypeIndex(index,value){
            if(value !=0 && this.typelist.indexOf( value )!=-1){
                this.typeall=false
                this.typelist.splice( this.typelist.indexOf( value ), 1 )
            }
            else if(value !=0 && this.typelist.indexOf( value )==-1 ){
                this.typelist.push(value)
                this.typeall=false
            }
            if(value ==0){
                this.typelist=[];
                this.typeall=true;
            }
        },
        //点击确定按钮
        queding(){
            this.jt1 = false;
            this.jt2 = false;
            this.jt3 = false;
            this.jt4 = false;
            this.showCitypre = []
            // console.log(this.typelist); //公告类型
            // console.log(this.typelistTime); //时间
            // console.log(this.startTime); //时间
            // console.log(this.endTime); //时间
            // console.log(this.zbjeOneLeft);  //金额
            // console.log(this.zbjeOneRight); //金额
            // console.log(this.radio);  // 范围
            // console.log(this.keyWords);
            
            this.newArr = [...new Set(this.keyWords)]
            // console.log(this.newArr); //行业
            
            
            this.spanFont1 = false;
            this.spanFont2 = false;
            this.spanFont3 = false;
            this.spanFont4 = false;
            this.$dataApi({
                url:"api/Area/GetAllProCity",
                method:"POST",
            }).then(res=>{
                this.showCity = JSON.parse(JSON.stringify(this.citys))  //选中的城市
                var that = this;
                var s = '';
                res.map((t,j)=>{
                    let y = t.CityList.map(function(v,i,arr){
                        return that.showCity.indexOf(v) !== -1
                    })
                    var x = y.every(f=>{
                        return f;
                    })
                    if(x){
                        t.CityList.map(t1=>{
                            this.showCity.splice(this.showCity.indexOf(t1),1)
                        })
                        if(j == 0){
                            if(this.showCitypre.indexOf('江苏') == -1){
                                this.showCitypre.push('江苏')
                            }
                        }else if(j == 1){
                            if(this.showCitypre.indexOf('北京') == -1){
                                this.showCitypre.push('北京')
                            }
                        }else if(j == 2){
                            if(this.showCitypre.indexOf('天津') == -1){
                                this.showCitypre.push('天津')
                            }
                        }else if(j == 3){
                            if(this.showCitypre.indexOf('河北') == -1){
                                this.showCitypre.push('河北')
                            }
                        }else if(j == 4){
                            if(this.showCitypre.indexOf('山西') == -1){
                                this.showCitypre.push('山西')
                            }
                        }else if(j == 5){
                            if(this.showCitypre.indexOf('内蒙古') == -1){
                                this.showCitypre.push('内蒙古')
                            }
                        }else if(j == 6){
                            if(this.showCitypre.indexOf('辽宁') == -1){
                                this.showCitypre.push('辽宁')
                            }
                        }else if(j == 7){
                            if(this.showCitypre.indexOf('吉林') == -1){
                                this.showCitypre.push('吉林')
                            }
                        }else if(j == 8){
                            if(this.showCitypre.indexOf('黑龙江') == -1){
                                this.showCitypre.push('黑龙江')
                            }
                        }else if(j == 9){
                            if(this.showCitypre.indexOf('上海') == -1){
                                this.showCitypre.push('上海')
                            }
                        }else if(j == 10){
                            if(this.showCitypre.indexOf('浙江') == -1){
                                this.showCitypre.push('浙江')
                            }
                        }else if(j == 11){
                            if(this.showCitypre.indexOf('安徽') == -1){
                                this.showCitypre.push('安徽')
                            }
                        }else if(j == 12){
                            if(this.showCitypre.indexOf('福建') == -1){
                                this.showCitypre.push('福建')
                            }
                        }else if(j == 13){
                            if(this.showCitypre.indexOf('江西') == -1){
                                this.showCitypre.push('江西')
                            }
                        }else if(j == 14){
                            if(this.showCitypre.indexOf('山东') == -1){
                                this.showCitypre.push('山东')
                            }
                        }else if(j == 15){
                            if(this.showCitypre.indexOf('河南') == -1){
                                this.showCitypre.push('河南')
                            }
                        }else if(j == 16){
                            if(this.showCitypre.indexOf('湖北') == -1){
                                this.showCitypre.push('湖北')
                            }
                        }else if(j == 17){
                            if(this.showCitypre.indexOf('湖南') == -1){
                                this.showCitypre.push('湖南')
                            }
                        }else if(j == 18){
                            if(this.showCitypre.indexOf('广东') == -1){
                                this.showCitypre.push('广东')
                            }
                        }else if(j == 19){
                            if(this.showCitypre.indexOf('广西') == -1){
                                this.showCitypre.push('广西')
                            }
                        }else if(j == 20){
                            if(this.showCitypre.indexOf('海南') == -1){
                                this.showCitypre.push('海南')
                            }
                        }else if(j == 21){
                            if(this.showCitypre.indexOf('重庆') == -1){
                                this.showCitypre.push('重庆')
                            }
                        }else if(j == 22){
                            if(this.showCitypre.indexOf('四川') == -1){
                                this.showCitypre.push('四川')
                            }
                        }else if(j == 23){
                            if(this.showCitypre.indexOf('贵州') == -1){
                                this.showCitypre.push('贵州')
                            }
                        }else if(j == 24){
                            if(this.showCitypre.indexOf('云南') == -1){
                                this.showCitypre.push('云南')
                            }
                        }else if(j == 25){
                            if(this.showCitypre.indexOf('西藏') == -1){
                                this.showCitypre.push('西藏')
                            }
                        }else if(j == 26){
                            if(this.showCitypre.indexOf('陕西') == -1){
                                this.showCitypre.push('陕西')
                            }
                        }else if(j == 27){
                            if(this.showCitypre.indexOf('甘肃') == -1){
                                this.showCitypre.push('甘肃')
                            }
                        }else if(j == 28){
                            if(this.showCitypre.indexOf('青海') == -1){
                                this.showCitypre.push('青海')
                            }
                        }else if(j == 29){
                            if(this.showCitypre.indexOf('宁夏') == -1){
                                this.showCitypre.push('宁夏')
                            }
                        }else if(j == 30){
                            if(this.showCitypre.indexOf('新疆') == -1){
                                this.showCitypre.push('新疆')
                            }
                        }else if(j == 31){
                            if(this.showCitypre.indexOf('澳门') == -1){
                                this.showCitypre.push('澳门')
                            }
                        }else if(j == 32){
                            if(this.showCitypre.indexOf('香港') == -1){
                                this.showCitypre.push('香港')
                            }
                        }else if(j == 33){
                            if(this.showCitypre.indexOf('台湾') == -1){
                                this.showCitypre.push('台湾')
                            }
                        }
                    }
                })
                // console.log(this.showCity);   //市
                // console.log(this.showCitypre); //省
                
                if(this.citys.length == 0 && this.showCitypre.length == 0){
                    this.showCitypre = ''
                };
                this.getsearchlist(10);
                this.show1=false;
                this.show2=false;
                this.show3=false;
                this.show4=false;
                this.load1=true;
            })
            

        },
        //点击重置按钮
        chongzhi(){
            this.typelist=[]
            this.typeall = true;
            this.typelistTime = [3];
            this.typeallTime = false;
            this.startTime ="";
            this.endTime = "";
            if(this.$refs.time){
            this.$refs.time.style.border = "1px solid rgb(179, 169, 169)";
            }
            this.date = '';
            this.itemss.map(item=>{
                item.badge = ''
            });
            this.items.map(item=>{
                item.IsShow = false
            });
            if(this.o == 0){
                this.items = [{text:'全部',IsShow:true}];
            }
            this.citys = [];
            this.showCity = [];
            this.showCitypre = [];
            this.priceBtn = true
            this.zbjeOneLeft = '';
            this.zbjeOneRight = '';
            this.radio = "0";

            this.keyWords = [];
            this.ketwordsGroup = [];
            this.color = false;
            this.industryAll();
            this.priseBtnT = false;
            this.priseBtnO = false;
            this.keyWords = [];
        },
        //时间按钮
        changetypeIndexTime(index,value){
            this.startTime ="";
            this.endTime = "";
            this.date = ''
            if(value !=0 && this.typelistTime.indexOf( value )!=-1){
                this.typeallTime=false
                this.typelistTime.splice( this.typelistTime.indexOf( value ), 1 )
            }
            else if(value !=0 && this.typelistTime.indexOf( value )==-1 ){
                this.typelistTime = []
                this.typelistTime.push(value)
                // this.typelistTime.splice( this.typelistTime.indexOf( value ), 1 )
                this.typeallTime=false
            }
            if(value ==0){
                this.typelistTime=[0];
                this.typeallTime=true;
            }
            this.$refs.time.style.border = "1px solid rgb(179, 169, 169)";
        },
        formatDate(date) {
            return `${date.getFullYear()}/${date.getMonth() + 1}/${date.getDate()}`;
        },
        //时间区间
        onConfirm(date) {
            document.getElementsByClassName('van-overlay')[0].style.top = '2rem'
            
            this.typeallTime = false
            this.typelistTime = []
            const [start, end] = date;
            this.show = false;
            // this.date = this.formatDate(date);
            this.date = `${this.formatDate(start)} - ${this.formatDate(end)}`;
            var y = date[0].getFullYear();
            var m = date[0].getMonth() + 1;
            m = m < 10 ? ('0' + m) : m;
            var d = date[0].getDate();
            d = d < 10 ? ('0' + d) : d;
            this.startTime = ''+y+'-'+m+'-'+d

            var y1 = date[1].getFullYear();
            var m1 = date[1].getMonth() + 1;
            m1 = m1 < 10 ? ('0' + m1) : m1;
            var d1 = date[1].getDate();
            d1 = d1 < 10 ? ('0' + d1) : d1;
            this.endTime = ''+y1+'-'+m1+'-'+d1
            this.$refs.time.style.border = "1px solid red";
        },

        //拿到省份
        getprovince:function(){
            let that = this;
            
            this.$dataApi({
                url:'api/Area/GetArea',
                method:'POST',
            }).then(response=>{
                // console.log(response);
                that.itemss = JSON.parse(JSON.stringify(response))
                response.forEach((item,index)=>{
                    that.ptype.push(item.AreaChar);
                    that.itemss[index].text = response[index].AreaName;
                    that.itemss[index].badge = '';
                })
                that.ptype= Array.from(new Set(that.ptype))
                that.itemss.unshift({text:'全国'})
                // console.log(that.itemss);
                
            })
            .catch(function (error) {
                console.log(error);
            });
        },
        //点击地区左边的每一个省份
        onNavClick(ind){
            // console.log(this.itemss[ind].text);
            
            this.o = ind;
            let that = this
            this.$dataApi({
                url:"api/Area/GetCity",
                method:"POST",
                data:{
                    province:this.itemss[ind].text
                }
            }).then(res=>{
                // console.log(res);
                //点击的是不是全国按钮
                if(this.itemss[ind].text == '全国'){
                    this.items = [{text:'全部',IsShow:true}]
                    if(this.citys.length !== 0){
                        this.items[0].IsShow = false;
                    }
                }else{
                    this.items = res;
                    this.items.map((item,index)=>{
                        if(this.citys.indexOf(item.text) !== -1){
                            this.items[index].IsShow = true;
                        }
                    });
                    var s = this.items.every(function(x){
                        return x.IsShow
                    })
                    if(s){
                        this.items[0].IsShow = true;
                        this.items.unshift({text:'全部',IsShow:true})
                    }else{
                        this.items.unshift({text:'全部',IsShow:false})
                    }
                }
            })
        },
        //点击地区右边每一个城市
        clickItem(item,index){
            //点击的是不是全国
            if(this.o == 0){
                if(!this.items[0].IsShow){
                    this.items[0].IsShow = true;
                    this.citys = [];
                    this.itemss.map(item=>{
                        item.badge = ''
                    })
                }
            }else{
                //点击的是不是全部按钮
                if(item.text !== '全部'){   //点击的不是全部按钮
                    this.items[0].IsShow = false;
                    if(this.citys.indexOf(item.text) !== -1){ //已经被点击了的城市
                        this.citys.splice(this.citys.indexOf(item.text),1)
                        this.items[index].IsShow = false
                        var leng = 0;
                        this.items.map(item=>{
                            if(item.IsShow){
                                leng++;
                            };
                        })
                        this.itemss[this.o].badge = leng;
                        if(leng == 0){
                            this.itemss[this.o].badge = '';
                        }
                    }else{  //没有被点击的城市
                        this.citys.push(item.text);
                        this.items[index].IsShow = true;
                        //判断是否全部点完了
                        var len = 0;
                        this.items.map(item=>{
                            if(item.IsShow){
                                len++;
                            };
                            if(len == this.items.length-1){
                                this.items[0].IsShow = true;
                            }
                        })
                        this.itemss[this.o].badge = len
                    };
                }else{  //点击的是全部按钮
                    if(this.items[0].IsShow){
                        this.itemss[this.o].badge = '';
                        this.items[0].IsShow = false;
                        this.items.map(item=>{
                            item.IsShow = false;
                            if(this.citys.indexOf(item.text) !== -1){
                                this.citys.splice(this.citys.indexOf(item.text),1)
                            }
                        })
                    }else{
                        this.itemss[this.o].badge = this.items.length-1
                        this.items.map(item=>{
                            item.IsShow = true;
                            if(this.citys.indexOf(item.text) !== -1){
                                this.citys.splice(this.citys.indexOf(item.text),1)
                            }
                            this.citys.push(item.text)
                        })
                        this.items[0].IsShow = true
                    }
                }
            }
        
            if(this.citys.indexOf('全部') !== -1){
                this.citys.splice(this.citys.indexOf('全部'),1)
            };
            if(this.citys.length == 345){
                this.citys = [];
                this.itemss.map(item=>{
                    item.badge = ''
                });
                this.items.map(item=>{
                    item.IsShow = false
                });
                if(this.o == 0){
                    this.items = [{text:'全部',IsShow:true}];
                }
            }
            // console.log(this.citys);
            // console.log(this.items);
            
        },
        //点击招标金额按钮
        zbjeOneBtn(){
            this.priceBtn = true
            this.zbjeOneLeft = "";
            this.zbjeOneRight = "";
        },
        //点击招标金额输入框
        zbjeOne(){
            this.priceBtn = false
        },
        //金额判断
        zbjeOneL(){
            if(Number(this.zbjeOneRight) <= Number(this.zbjeOneLeft) && this.zbjeOneRight !== ""){
                Toast.fail('请输入正确的金额(低到高)');
                this.zbjeOneLeft = '';
            };
            if(this.zbjeOneRight == '' && this.zbjeOneLeft == ''){
                document.getElementsByClassName('map')[0].className = "btn_zbje1 map";
            }
        },
        zbjeOneR(){
            if(Number(this.zbjeOneRight) <= Number(this.zbjeOneLeft) && this.zbjeOneRight !== ""){
                Toast.fail('请输入正确的金额(低到高)');
                this.zbjeOneRight = '';
            };
            if(this.zbjeOneRight == '' && this.zbjeOneLeft == ''){
                document.getElementsByClassName('map')[0].className = "btn_zbje1 map";
            }
        },
        //点击全部
        quanbu(){
            this.keyWords = []
            this.ketwordsGroup = []
            
            if(!this.color){
                this.$refs.all.style.background = "#CEF0FF";
                this.color = true
                //让所有的行业颜色变成白色
                for(let i =0;i<this.$refs.tet.length;i++){
                    this.keyWords.push(this.$refs.tet[i].innerText)
                    this.$refs.tet[i].style.background = "#FFFFFF";
                }
                //让所有的行业分类颜色变成白色
                for(let k=0;k<this.$refs.keywordBox.length;k++){
                    // console.log(k);
                    this.$refs.keywordBox[k].style.background = "#FFFFFF";
                }
                // this.keyWords = []   //全部的话就传递空数组
                // console.log(this.keyWords);
            }else{
                console.log(this.$refs.all);
                
                if(this.$refs.all){
                    this.$refs.all.style.background = "#FFFFFF";
                    this.color = false
                }
                
            }
            
        },
        //点击行业分类
        keywordBox(e,i){
            //是否已经点击了全部
            if(this.color){
                this.keyWords = []
                this.$refs.all.style.background = "#FFFFFF";
                this.color = false
            }
            if(this.ketwordsGroup.indexOf(e.title) === -1){
                //当你点击了单个行业之后又点击行业分类
                for(let o=0;o<e.arr.length;o++){
                    this.$refs.tet[e.arr[o].id].style.background = "#CEF0FF";
                }

                this.ketwordsGroup.push(e.title)
                for(let j=0;j<e.arr.length;j++){
                    this.keyWords.push(e.arr[j].tit)
                }
                this.$refs.keywordBox[i].style.background = "#CEF0FF";
            }else{
                for(let o=0;o<e.arr.length;o++){
                    this.$refs.tet[e.arr[o].id].style.background = "#FFFFFF";
                }
                this.$refs.keywordBox[i].style.background = "#FFFFFF";
                for(let l=0;l<e.arr.length;l++){
                    this.keyWords = this.keyWords.filter(item => {
                        return item !== e.arr[l].tit;
                    });
                }
                this.ketwordsGroup = this.ketwordsGroup.filter(item => {
                    return item !== this.$refs.keywordBox[i].innerText;
                });
            }
        },
        //点击单个行业
        keyword(e,i){
            if(e.id>=0 && e.id<5){
                let n = 0
                this.$refs.keywordBox[n].style.background = "#FFFFFF";
                this.ketwordsGroup = this.ketwordsGroup.filter(item => {
                    return item !== this.$refs.keywordBox[n].innerText;
                });
                
            }else if(e.id>=5 && e.id<10){
                let n = 1
                this.$refs.keywordBox[n].style.background = "#FFFFFF";
                this.ketwordsGroup = this.ketwordsGroup.filter(item => {
                    return item !== this.$refs.keywordBox[n].innerText;
                });
            }else if(e.id>=10 && e.id<13){
                let n = 2
                this.$refs.keywordBox[n].style.background = "#FFFFFF";
                this.ketwordsGroup = this.ketwordsGroup.filter(item => {
                    return item !== this.$refs.keywordBox[n].innerText;
                });
            }else if(e.id>=13 && e.id<21){
                let n = 3
                this.$refs.keywordBox[n].style.background = "#FFFFFF";
                this.ketwordsGroup = this.ketwordsGroup.filter(item => {
                    return item !== this.$refs.keywordBox[n].innerText;
                });
            }else if(e.id>=21 && e.id<26){
                let n = 4
                this.$refs.keywordBox[n].style.background = "#FFFFFF";
                this.ketwordsGroup = this.ketwordsGroup.filter(item => {
                    return item !== this.$refs.keywordBox[n].innerText;
                });
            }else if(e.id>=26 && e.id<30){
                let n = 5
                this.$refs.keywordBox[n].style.background = "#FFFFFF";
                this.ketwordsGroup = this.ketwordsGroup.filter(item => {
                    return item !== this.$refs.keywordBox[n].innerText;
                });
            }else if(e.id>=30 && e.id<35){
                let n = 6
                this.$refs.keywordBox[n].style.background = "#FFFFFF";
                this.ketwordsGroup = this.ketwordsGroup.filter(item => {
                    return item !== this.$refs.keywordBox[n].innerText;
                });
            }else if(e.id>=35 && e.id<38){
                let n = 7
                this.$refs.keywordBox[n].style.background = "#FFFFFF";
                this.ketwordsGroup = this.ketwordsGroup.filter(item => {
                    return item !== this.$refs.keywordBox[n].innerText;
                });
            }else if(e.id>=38 && e.id<42){
                let n = 8
                this.$refs.keywordBox[n].style.background = "#FFFFFF";
                this.ketwordsGroup = this.ketwordsGroup.filter(item => {
                    return item !== this.$refs.keywordBox[n].innerText;
                });
            }else if(e.id>=42 && e.id<47){
                let n = 9
                this.$refs.keywordBox[n].style.background = "#FFFFFF";
                this.ketwordsGroup = this.ketwordsGroup.filter(item => {
                    return item !== this.$refs.keywordBox[n].innerText;
                });
            }else if(e.id>=47 && e.id<51){
                let n = 10
                this.$refs.keywordBox[n].style.background = "#FFFFFF";
                this.ketwordsGroup = this.ketwordsGroup.filter(item => {
                    return item !== this.$refs.keywordBox[n].innerText;
                });
            }else if(e.id>=51 && e.id<55){
                let n = 11
                this.$refs.keywordBox[n].style.background = "#FFFFFF";
                this.ketwordsGroup = this.ketwordsGroup.filter(item => {
                    return item !== this.$refs.keywordBox[n].innerText;
                });
            }
            // else if(e.id>=51 && e.id<54){
            //     let n = 12
            //     this.$refs.keywordBox[n].style.background = "#FFFFFF";
            //     this.ketwordsGroup = this.ketwordsGroup.filter(item => {
            //         return item !== this.$refs.keywordBox[n].innerText;
            //     });
            // }
            

            //是否已经点击了全部
            if(this.color){
                this.keyWords = []
            }

            //是否已经点击了行业分类
            this.$refs.all.style.background = "#FFFFFF";
            this.color = false
            if(this.keyWords.indexOf(e.tit) > -1){
                this.$refs.tet[e.id].style.background = "#FFFFFF";
                this.keyWords = this.keyWords.filter(item => {
                    return item !== this.$refs.tet[e.id].innerText;
                });
            }else{
                this.keyWords.push(e.tit)
                this.$refs.tet[e.id].style.background = "#CEF0FF";
            }
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
                // console.log(this.isVip);
            });
            
        },
        // 搜索
        searching:function(e){
            // console.log(e);
            if(e.keyCode == 13 || e.keyCode == 108){
                this.getsearchlist(10);
            }
        },
        //查询数据
        getsearchlist:function(size){
            let that = this;
            // console.log(size);
            // console.log(this.AnnounceTypeDataList);
            this.iscx=true;
            this.btns = false;
            let day2 = new Date();
            day2.setTime(day2.getTime());
            
            // this.searchlistnum = obj.TotalCount
            if(that.pageFrom){
                var pageSizes = that.AnnounceTypeDataList == 0 ? size : (that.AnnounceTypeDataList > 20 ? size : that.AnnounceTypeDataList);
            }else{
                var pageSizes = that.SearchDataList == 0 ? size : (that.SearchDataList > 20 ? size : that.SearchDataList);
            }
            
            that.$dataApi({
                url:'api/baseData/GetData',
                method:'POST',
                data:{
                    title: this.inputValue,//标题，模糊查询
                    TimeNo: this.typelistTime.toString(),//0(全部),3(3天内)，7(7天内)，30(1个月内)，90(3个月内)
                    GGType: this.typelist.length == 0 ? '' : this.typelist.toString(),//全部0,招标公告1,变更公告2,结果公告3,拼接
                    Provinces: this.showCitypre.toString(),//省份拼接
                    TimeBegin:this.startTime,   //开始时间
                    TimeEnd:this.endTime,
                    pageNo: 1,
                    // pageSize: that.isVip ? size : 50,
                    pageSize: pageSizes,
                    openid:sessionStorage.getItem("openID"),
                    IsAbout:this.radio,
                    Industry:that.industryArr.length == 0 ? '' : that.industryArr.toString(),
                    Source:1,
                    Cities:this.showCity.toString(),
                    BeginAmount:this.zbjeOneLeft,
                    EndAmount:this.zbjeOneRight,
                    IsAmountSort:that.IsAmountSort,
                    IsContext:this.IsContext
                }
            }).then(response=>{
                console.log(JSON.parse(response.Data));
                that.searchlistnum = JSON.parse(response.Data).TotalCount;
                that.searchlist = JSON.parse(response.Data).Rows;
                // console.log(that.searchlist);
                if(JSON.parse(response.Data).TotalCount == 0){
                        that.userRoles = false;
                        that.isVipTwo = false;
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
                        
                    };
                that.searchlist.forEach(item=>{
                    item.oldtitle=item.title;
                })
                if(that.inputValue.length > 0){
                    const searchVal = that.inputValue
                    // 匹配关键字正则
                    const replaceReg = new RegExp(searchVal, 'g')
                    // 高亮替换v-html值
                    const replaceString = `<font color='#F14F4A'>${searchVal}</font>`
                    for (let i = 0; i < that.searchlist.length; i++) {
                    // 开始替换
                    that.searchlist[i].title = that.searchlist[i].title.replace(replaceReg, replaceString).slice(0,90)
                    }
                }

                that.searchlist.forEach(item=>{
                item.GGType=item.FormatGGType;
                    let date= item.JoinDate.replace(new RegExp("-","gm"),"/");
                let  EndTime =(new Date(date)).getTime(); //获取抓取时间的秒数
                let s=(day2.getTime()/1000 - EndTime/1000)
                let m=(day2.getTime()/1000/60 - EndTime/1000/60)
                let h=(day2.getTime()/1000/60/60 - EndTime/1000/60/60)
                if(s>0 && s<60){
                    item.JoinDate=parseInt(s) + "秒前";
                } else if(m>0 && m<60){
                    item.JoinDate=parseInt(m) + "分钟前";
                } else if(h >0 && h<24){
                    item.JoinDate=parseInt(h) + "小时前";
                } else if(h >=24 && h<=48){
                    item.JoinDate="昨天";
                } else if(h>48){
                    item.JoinDate=item.JoinDate.substring(0,10);
                }
                })
                that.btns = true;
                this.iscx=false;
                this.load1 = false;
                this.load = false;
            })
            .catch(function (error) {
                console.log(error);
            });
            this.showFilter=false;
        },
        onCancel() {
            this.$router.go(-1);
        },
        //滚动事件
        getScroll:function(e){
            let that=this;
            let tops = document.documentElement.scrollTop||document.body.scrollTop;    //滚动条的高度
            // console.log(sessionStorage.getItem('fromPage'));
            if(sessionStorage.getItem('fromPage') == '1'){
                if(that.searchlist.length == that.AnnounceTypeDataList){
                    if(that.searchlist.length == 0){
                        that.isFive = false;
                        that.isVipTwo = false;
                        that.userRoles = false;
                        return false
                    }else if(that.RoleName == '免费用户'){
                        that.isFive = false;
                        that.isVipTwo = true;
                        that.userRoles = false;
                        return false;
                    }else if(that.RoleName == '注册用户'){
                        that.isFive = false;
                        that.isVipTwo = false;
                        that.userRoles = true;
                        return false;
                    };
                };
            };
            if(sessionStorage.getItem('fromPage') == '2'){
                if(that.searchlist.length == this.SearchDataList){
                    if(that.searchlist.length == 0){
                        that.isFive = false;
                        that.isVipTwo = false;
                        that.userRoles = false;
                        return false
                    }else if(that.RoleName == '免费用户'){
                        that.isFive = false;
                        that.isVipTwo = true;
                        that.userRoles = false;
                        return false;
                    }else if(that.RoleName == '注册用户'){
                        that.isFive = false;
                        that.isVipTwo = false;
                        that.userRoles = true;
                        return false;
                    }
                };
            };


            
            this.isFive = true;
            if(e && (typeof e  == "number") && e!==0){
                setTimeout(()=>{
                document.documentElement.scrollTop = e;
                document.body.scrollTop=e;
                tops=e||document.body.scrollTop;
                },0)
            }
            
            setTimeout(function(){
            if((that.$refs.Listsearch.offsetHeight - tops - screen.height) <= -80 && that.searchlistnum != that.searchlist.length && that.btns )
                {
                that.pagesize=that.pagesize+10;
                that.getsearchlist(that.pagesize)
                }
            },500)
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
        content:function(e){
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
                if(res.BaseIDList.indexOf(e.id) > -1){
                    // console.log('成功');
                }else{
                    if(res.BaseIDList.length < that.DataDetailsView){
                        that.AddViewRestrictionsInfo(e.id);
                        console.log('成功');
                    }else if(that.DataDetailsView == 0){
                        that.AddViewRestrictionsInfo(e.id);
                        console.log('成功');
                    }else{
                        if(that.RoleName == '免费用户'){
                            that.codeShow = true;
                        }else if(that.RoleName == '注册用户'){
                            Toast.fail('注册用户每日可查看5条数据');
                        }
                        return false;
                    };
                };
                sessionStorage.setItem("sharetitle",e.oldtitle)
                window.removeEventListener('scroll',  this.getScroll);
                this.$dataApi({
                    url:"api/Users/SaveMyTrack",
                    method:"POST",
                    data:{
                        OpenId:sessionStorage.getItem('openID'),
                        id:e.id,
                        Source:1
                    }
                }).then(res=>{});

                this.$dataApi({
                    url:"api/Users/CheckIsConcernProject",
                    method:"POST",
                    data:{
                        OpenId:sessionStorage.getItem('openID'),
                        id:e.id,
                        Source:1
                    }
                }).then(res=>{
                    let newUrl = e.ZBUrl.replace(/ContentHtml/,'ContentHtmlTest')
                    //是否被关注
                    let a = e.ZBUrl+`?IsConcerned=${res.Msg}&id=${e.id}&openID=${sessionStorage.getItem('openID')}&Source=1`; 
                    sessionStorage.setItem("url",a)
                    this.$router.push({
                        path:'/iframe',
                        query: {
                            ZBUrl:a,
                            id:e.id
                        },
                    })
                })
            });

            
        },
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
                        that.$router.go(0);
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
                console.log(response);
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

        //拿到用户角色
        getUserRole(){
            let that = this;
            that.$dataApi({
                url: "api/RoleManage/GetUserRoleByOpenId",
                method: "GET",
                data: {
                    openId: sessionStorage.getItem("openID"),
                },
            }).then((res) => {
                console.log(res);
                if(res.RoleManagement.SearchDataList == 0){

                }
                that.SearchDataList = res.RoleManagement.SearchDataList;
                that.AnnounceTypeDataList = res.RoleManagement.AnnounceTypeDataList;
                that.RoleName = res.RoleManagement.RoleName;
                that.DataDetailsView = res.RoleManagement.DataDetailsView
            });
        },

        chang(index){
            console.log(index);
            if(index == 0){
                this.IsContext = false;
            }else{
                this.IsContext = true;
            };
            this.getsearchlist(10);
        },
        open(){
            document.getElementsByClassName('van-overlay')[0].style.top = '0rem'
            this.show1 = false;
            this.show2 = false;
            this.show3 = false;
            this.show4 = false;
            this.spanFont1 = false;
            this.spanFont2 = false;
            this.spanFont3 = false;
            this.spanFont4 = false;
            this.jt1 = false;
            this.jt2 = false;
            this.jt3 = false;
            this.jt4 = false;
           
            console.log(this.spanFont1);
            
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
        }

    },

    beforeRouteEnter(to, from, next) {
        // console.log(from);
        if(from.name == 'lookup'){
            sessionStorage.setItem('fromPage','2');
        }else{
            sessionStorage.setItem('fromPage','1');
        }
        next(vm => {
            if(from.path == '/iframe')
            {
                window.addEventListener('scroll',  vm.getScroll(vm.scroll));
                window.addEventListener('scroll',  vm.getScroll);
            } else if(from.path == '/index'){
                to.meta.keepAlive=true;
                // vm.pageFrom = true;
            } else if(from.path == '/lookup'){
                to.meta.keepAlive=true;
                // vm.pageFrom = false;
            }
        })
    },

    created:function(){
        console.log(this.$router.history);
        let that = this;
        that.getUserRole();
        this.yaoqingma()
        if(this.$route.query.GGType){
            this.changetypeIndex(0,this.$route.query.GGType)
            this.typelist.push(this.$route.query.GGType);
            // this.changetypeIndex(0,this.$route.query.GGType)
        }
        
        if(this.$router.history.current.query.searchvalue!=undefined){
            this.inputValue=this.$router.history.current.query.searchvalue;
            this.IsContext=this.$router.history.current.query.searchIsContext;
        }else if(this.$router.history.current.query.hotinputvalue!=undefined){
            this.inputValue=this.$router.history.current.query.hotinputvalue;
        }
        setTimeout(function(){
            that.getsearchlist(10);
        },500);

        this.getprovince();
        // console.log(this.IsContext);
        if(this.IsContext){
            this.value1 = 1
        }else{
            this.value1 = 0
        }
    },

    beforeRouteLeave(to, from, next) {
        // 如果在window中出现的滚动条
        this.scroll = document.documentElement.scrollTop||document.body.scrollTop;
        document.getElementsByClassName('van-overlay')[0].style.top = '0';
        //  this.$router.go(-1);
        next()
    },

    mounted:function(){
        window.addEventListener('scroll',  this.getScroll);  
    },

    destroyed:function(){
        window.removeEventListener('scroll', this.getScroll);
    },
};
</script>

<style scoped>
.price_p{
    font-size: 0.3rem;
    text-align: left;
    margin-left: 16px;
}
.rightTK{
    min-height: 100%;
}
.tab{
    display: flex;
    justify-content: space-around;
    /* margin-top: 0.1rem; */
    padding-top: 0.1rem;
    background: #fff;
    height: 0.5rem;
    border-bottom: 1px solid #eee;
}
.tab1{
    font-size: 0.3rem;
}
.tab2{
    font-size: 0.3rem;
    color: #4CA9F9;
}
.tabb1{
    width: 100%;
    padding: 0.3rem 0;
    overflow: hidden;
    top: 3.95rem;
}
.tabb2{
    width: 100%;
    padding: 0.3rem 0;
    overflow: hidden;
    /* top: 3.95rem; */
    top: 4.9rem;
}
.tabb3{
    height: 7.5rem;
    width: 100%;
    overflow: hidden;
    top: 5.7rem;
}
.container{
    width: 100%;
    overflow: hidden;
}
.search{
    height: 1rem;
    width: 100%;
    margin: 0 auto;
    background: rgba(240,240,240,1);
}
.searchnum{
    height:0.38rem;
    font-size:0.24rem;
    font-family:PingFang SC;
    font-weight:500;
    /* color:rgba(171,171,171,1); */
    line-height:0.38rem;
    margin-left: 0.2rem;
    margin-top: 0 !important;
    text-align: left;
    padding-left: 0.1rem !important;
}
.search-imput{
    overflow: hidden;
    width:4rem;
    height:0.64rem;
    position: relative;
    align-items: center;
    display: flex;
    justify-content: space-between;
    margin: 0.18rem 0rem;
    margin-left: 0.32rem;
    float: left;
}
.search-imput input{
    background: #FAFAFA;
    width:4rem;
    height:0.64rem;
    background: #fff;
    border: 0;
    line-height: 0.64rem;
    border-radius: 0.6rem;
    text-align: left;
    font-size: 0.26rem;
    font-family: PingFang SC;
    font-weight: 500;
    color: rgba(191,191,191,1);
    line-height: 0.38rem;
    padding-left: 0.31rem;
}
.search-name{
    float: right;
    height: 0.64rem;
    width: 1.3rem;
    margin: 0.18rem 0;
    display: table-cell;
    vertical-align: middle;
}
.search-name img{
    width: 0.26rem;
    height: 0.26rem;
    float: left;
    margin: 0.19rem 0;
}
.search-name span{
    width:1rem;
    height:0.26rem;
    font-size:0.28rem;
    font-family:PingFang SC;
    font-weight:bold;
    color:rgba(59,59,59,1);
    line-height:0.26rem;
    float: left;
    margin: 0.19rem 0;
}
.search-top form{
    height: 1.28rem;
    width: 100%;
    margin: 0 auto;
}
.split{
    width:7.5rem;
    height:0.16rem;
    background:rgba(240,240,240,1);
}
.dropdown{
    width: 100%;
    margin: 0 auto;
    overflow: auto;
}
.van-dropdown-menu{
    width: 90%;
    float: left;
}
img{
    width: 0.33rem;
    height: 0.24rem;
    margin-right: 0.39rem;
    float: right;
    margin-top: 0.36rem;
}
.van-dropdown-menu__item{
    justify-content:left;
}
.van-dropdown-menu__title{
    padding-left: 0.4rem;
}
.search-list{
    height: auto;
    width: 100%;
    margin: 0 auto;
    margin-top: 1.84rem;
}
.search-split{
    width:100%;
    height:0.16rem;
    background:rgba(242,242,242,1);
}
.search-title{
    width:90%;
    margin-left: 0.23rem;
    margin-top: 0.38rem;
    font-size:0.32rem;
    font-family:PingFang SC;
    font-weight:bold;
    color:rgba(48,48,48,1);
    line-height:0.48rem;
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 2;
    overflow: hidden;
    text-overflow:ellipsis;
    text-align: left;
}
.infotyle{
    width:100%;
    height:0.4rem;
    margin-top: 0.29rem;
    margin-bottom: 0.38rem;
}
.infotyle span{
    height: 0.26rem;
    float: left;
    font-size:0.24rem;
    font-family:PingFang SC;
    font-weight:500;
    color:rgba(171,171,171,1);
    line-height:0.26rem;
    margin-right: 0.1rem;
    padding: 0.08rem 0.12rem;
    border:0.01rem solid rgba(232,232,232,1);
    border-radius:20px;
}
.infotyle span:nth-of-type(1){
    background: #579ce9;
    color:#f1f4fb;
}
.infotyle span:nth-of-type(2){
    background: #ecfdf7;
    color:#6da88a;
}
.infotyle span:nth-of-type(3){
    background: #EBEEFF;
    color:#7886C2 ;
}
.prise{
    background: #fcf3f4;
    color:#e58890 !important;
    
}
.defaultImg{
    width: 1.95rem;
    height: 2.07rem;
    margin: 2.72rem auto 02.78rem auto;
    display: block;
    margin-bottom: 0.5rem;
    float: inherit;
}
.noseachinfo{
    width:4.54rem;
    height:0.38rem;
    font-size:0.24rem;
    font-family:PingFang SC;
    font-weight:500;
    color:rgba(171,171,171,1);
    line-height:0.38rem;
    margin-left: 1.48rem;
}
.top{
    height: 2rem;
    width: 100%;
    position: fixed;
    background: #F0F0F0;
    z-index: 99;
}
.onlistall{
    width:1.65rem;
    height:0.8rem;
    background:rgb(76, 168, 248);
    border-radius:0.1rem;
    margin-left: 0.1rem;
    font-size:0.28rem;
    font-family:PingFang SC;
    line-height: 0.8rem;
    color: white;
    text-align: center;
    border: none;
  }
.listall{
    width:1.65rem;
    height:0.8rem;
    background:rgba(247,247,247,1);
    border-radius:0.1rem;
    margin-left: 0.1rem;
    font-size:0.28rem;
    font-family:PingFang SC;
    line-height: 0.8rem;
    text-align: center;
    border: none;
}
.ggtype{
    padding-bottom: 0.2rem;
}
.rqqj{
    margin: 20% auto 10%;
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
.cityBtn{
    background: #fff;
    color: #333;
    border:none;
    background:rgba(247,247,247,1);
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
.cityBtnShow{
    background: #4CA8F8;
    color: #fff;
    border:none;
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
.cityBtnShow:nth-of-type(1){
    float: none;
    display: block;
}
.cityBtn:nth-of-type(1){
    float: none;
    display: block;
}
.van-tree-select__nav{
    flex: none !important;
}
.zbje_all{
    font-size: 0.3rem;
    text-align: left;
    margin-left: 0.35rem;
}
.price{
    font-size: 0.26rem;
    text-align: left;
    color: #333;
    margin-left: 0.35rem;
}
.priceInput{
    height: 0.5rem;
    font-size: 0.26rem;
    padding-left: 0.2rem;
    color: #666;
}

.input_box{
    font-size: 0.3rem;
    display: flex;
    justify-content: center;
    align-items: center;
    margin-left: 0.2rem;
}
.input_box>input{
    width: 35%;
    border-radius: 0.5rem;
    border: 1px solid #bbb;
}
.btn_zbje1,.btn_zbje2{
    background: #4CA8F8;
    border:none;
    color: #fff;
    width: 1.65rem;
    height: 0.65rem;
    border-radius: 0.1rem;
    font-size: 0.28rem;
    font-family: PingFang SC;
}
.btn_zbje3{
    background: #fff;
    color: #333;
    border: 1px solid rgb(112, 110, 110);
    width: 1.65rem;
    height: 0.65rem;
    border-radius: 0.1rem;
    font-size: 0.28rem;
    font-family: PingFang SC;
}
.fwBox{
    margin-top: 0.3rem;
    margin-left: 0.3rem;
}
.fw1{
    font-size: 16px;
}
.quanbu{
    display: flex;
    margin-top: 0.1rem;
}
.qb{
    font-size: 14px;
    width: 1.4rem;
    border: 1px solid rgb(185, 178, 178);
    background: #CEF0FF;
    padding: 2px;
    border-radius: 3px;
    /* margin-left: 5%; */
    text-align: center;
    margin-left: 0.2rem;
}
.main{
    overflow: hidden;
    margin-bottom: 1.7rem;
}
.plate{
    margin-top: 10px;
    margin-right: 16px;
    border-top: 1px solid rgb(221, 210, 210);
}
.p1{
    font-size: 14px;
    height: 22px;
    line-height: 20px;
    display: flex;
    margin: 0;
    margin-top: 10px;
}
.span1{
    border: 1px solid rgb(185, 178, 178);
    border-radius: 3px;
    /* margin-left: 5%; */
    width: 1.46rem;
    height: 0.48rem;
    line-height: 0.48rem;
    color: rgb(0, 0, 0);
    text-align: center;
}
.box{
    /* margin-left: 5%; */
    display: flex;
    flex-wrap: wrap;
}
.keyword{
    height: 0.48rem;
    padding: 0 0.2rem 0 0.2rem;
    border: 1px solid rgb(185, 178, 178);
    border-radius: 3px;
    line-height: 0.48rem;
    font-size: 14px;
    margin-top: 10px;
    margin-right: 3%;
    color: rgb(134, 130, 130);
}
.keyword1{
    width: 20%;
    border: 1px solid rgb(185, 178, 178);
    border-radius: 3px;
    font-size: 14px;
    margin-top: 5px;
    margin-right: 4%;
    height: 100%;
    color: rgb(134, 130, 130);
    background: #CEF0FF;
}
.keyword{
    height: 0.48rem;
    padding: 0 0.2rem 0 0.2rem;
    border: 1px solid rgb(185, 178, 178);
    border-radius: 3px;
    line-height: 0.48rem;
    font-size: 14px;
    margin-top: 10px;
    margin-right: 3%;
    color: rgb(134, 130, 130);
}
.btnBox{
    display: flex;
    justify-content: space-around;
    align-items: center;
    height: 1rem;
    width: 100%;
    /* position: fixed; */
    /* bottom: 1rem; */
    z-index: 99999;
    background: #fff;
}
.gg{
    height: 5.5rem;
    overflow-y: auto;
}
.mtk2{
    position: fixed;
    width: 100%;
    height: 100%;
    z-index: 998;
}
.wrapper {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 100%;
}
.iconfont{
    font-size: 12px;
}
.ffd{
    margin-top: 0.5rem;
}
.van-cell__title{
    font-size: 0.3rem !important;
}
.van-collapse-item__content{
    padding-right: 0 !important;
}
.sinVip{
    border-top: 0.2rem solid #F2F2F2;
    margin-bottom: 1rem;
    padding-top: 0.2rem;
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


.van-button--small{
    background: none;
    color: #006BDF;
}
.van-calendar__popup{
    margin-bottom: 1rem !important;
}
.botBox{
    background: #F0F0F0;
    width: 1.8rem;
}

.priseBtnBox{
    display: flex;
}
.priseBtn{
    font-size: 0.2rem;
    width: 1.6rem;
    height: 0.6rem;
    margin: 0.2rem 0.3rem 0rem;
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

.van-dropdown-menu >>> .van-dropdown-menu__bar{
    box-shadow: none;
    background: none;
    height: 1rem;
}
</style>

