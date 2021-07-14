<template>
    <div style="height:100%">
        <div v-if="option.length>0" id="Keyinfolist">
            <div class="top">
                <span style="font-size: 0.3rem;
                    line-height: 1rem;
                    margin-left: 0.2rem;" @click="openprop()">时间</span>
                <span class="sj" style="color:#fff;margin-left: 0.05rem;margin-top: 0.4rem;">c</span>
                <van-dropdown-menu active-color="#1989fa" class="titleTop">
                    <van-dropdown-item @change="changevalue(valueid)" z-index=200 v-model="valueid" :options="option" @open="yc" @close="yc"/>
                </van-dropdown-menu>
                <span @click="editword()">订阅维护</span>
            </div>

            <van-popup v-model="dateshow" position="bottom" :style="{ height: '40%' }">
                <div class="time">
                    <div class="bigtime">
                        <span v-for="(item,index) in optiontimer" :key="index" :class="[ typelistTime.indexOf( item.value )!=-1?  'onlistall'  :'listall' ]" @click='changetypeIndexTime(item.value)'>{{item.data}}</span>
                    </div>
                    <div class="chosetime">
                        <div class="input1" @click="opendate()">
                            <input style="pointer-events: none;" type="text" v-model="startTime">
                        </div>
                        <div class="hx"></div>
                        <div class="input2" @click="opendate()">
                            <input style="pointer-events: none;" type="text" v-model="endTime">
                        </div>
                    </div>
                    <div class="btn-box1">
                        <van-button style="margin-left:2.24rem;line-height:30px"  @click="chongzhi()" class="btn1" type="default">重置</van-button>
                        <van-button style="line-height:30px" @click="getinfo()" class="btn2" type="info">确定</van-button>
                    </div>
                </div>
            </van-popup>
            <van-calendar :min-date="minDate" :default-date="maxDate" :max-date="maxDate" v-model="showTime" type="range" @confirm="onConfirm" />

            <!-- 顶部搜索框 -->
            <div class="search" v-if="!iszk">
                <van-dropdown-menu class="botBox">
                    <van-dropdown-item v-model="value1" :options="option1" @change="chang" @open="open"/>
                </van-dropdown-menu>
                <div class="search-imput">
                    <form action="javascript:return true" style="margin-bottom:25px">
                        <input type="search" placeholder="输入“建筑工程”试试" class="search" ref="searchs" v-model="AdditionalKeyword"   @keyup="searching"  />  
                    </form>
                </div>
                <div class="searchnum" v-if="this.searchlistnum > 0 && this.iscx && !iszk ">为您检索到了<span style="color:#E7564F;">{{this.searchlistnum}}个</span>推送信息</div>
            </div>
            <!-- 内容列表 -->
               

            <!-- <div class="fgx"></div> -->
            <div class="search-list" v-if="searchlistnum>0">
                <div ref="List" class="flagList">
                    <div v-for="(item,index) in searchlist" :key="index" class="search-info">
                        <div class="search-split"></div>
                        <div class="search-title" v-html="item.title" @click="content(item)"> </div>
                        <div class="infotyle">
                            <span v-if='item.Province !=""' style="margin-left: 0.2rem;"> {{item.Province}}</span>
                            <span  v-if='item.GGType != ""'> {{item.FormatGGType}}</span>
                            <span v-if='item.HYType != ""' style="overflow:hidden;white-space: nowrap;text-overflow: ellipsis;width: auto;"> {{item.HYType}}</span>
                            <span v-if="(item.Amount/10000).toFixed(2) == 0 ? false: true" class="prise">{{(item.Amount/10000).toFixed(2)}}万</span>
                            <span v-if='item.JoinDate != ""' style="float: right;border: none;padding: 0.08rem 0rem;">
                                <van-icon style="position: relative;top: 1px;right: 1px;z-index: -10" name="clock-o" />{{item.JoinDate}}
                                <!-- {{item.JoinDate}} -->
                            </span>
                        </div>
                    </div>
                </div>
                <!-- <div v-if="searchlistnum == searchlist.length && iscx==true" style="width:100%;text-align:center;font-size: 0.24rem;font-family: PingFang SC;line-height: 60px;margin-bottom:1rem">
                    <div class="search-split"></div>
                    <span>没有更多了</span>
                </div> -->
                <!-- <div v-if="searchlistnum > searchlist.length && iscx==false" style="width:100%;text-align:center;font-size: 0.24rem;font-family: PingFang SC;line-height: 60px;margin-bottom:1rem">
                    <div class="search-split"></div>
                    <van-loading  type="spinner" color="#1989fa" size="40px">加载中...</van-loading>
                </div> -->
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

            <div class="sinVip" v-if="isVipTwo">
                <p>已载入全部内容</p>
                <p>免费注册会员查看更多内容</p>
                <button @click="goReg()">免费注册会员</button>
            </div>

            <div class="sinVip" v-if="userRoles">
                <p>已载入全部内容</p>
            </div>

            <div v-if="searchlistnum==0 && iscx==true" class="noisearchlist">
                <img src="../../../public/image/search_defualt.png" class="defaultImg"/>
                <div class="noseachinfo">没有搜索到任何内容、换个词试试吧！</div>
            </div>

            <van-overlay class="mtk2" :show="load1" >
                <div class="wrapper" @click.stop>
                    <van-loading size="40px" style="color:#fff">加载中...</van-loading>
                </div>
            </van-overlay>

            <van-overlay class="mtk2" :show="load2" >
                <div class="wrapper" @click.stop>
                    <van-loading size="40px" style="color:#fff">加载中...</van-loading>
                </div>
            </van-overlay>

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
                    <van-field v-model="code" type="tel" label="邀请码" placeholder="请输入邀请码"/>
                    <div class="btnbox1">
                        <button class="btnShowT" @click="codeFin">确定</button>
                        <button class="btnShowF" @click="closeActive">取消</button>
                    </div>
                </div>
            </van-dialog>
        </div>

        <div v-if="option.length==0" class="page">
            <img class="img1" src="../../../public/image/ydky.png" alt="">
            <img class="img2" @click="goAddKey()" src="../../../public/image/ck.png" alt="">
        </div>

        <!-- 跳转抽奖 -->
        <!-- <div class="goluck" @click="goLuck()" v-if="option.length !==0">
            <img src="../../../public/image/goLuck.png" alt="">
        </div> -->

        <!-- 注册 -->
        <div class="goreg" @click="goReg()" v-if="option.length !==0 && !isVip">
            <img src="../../../public/image/goRegister.png" alt="">
        </div>
    </div>
</template>

<script>
import Vue from 'vue';
import { mapMutations } from "vuex";
import { Toast,Overlay } from 'vant';
Vue.use(Overlay);
export default {
    data(){
        return{
            timer:3,
            option: [''],
            searchlist:[],
            searchlistnum:0,
            valueid:"",
            inputvalue:"",
            GGType:"",
            ProvinceList:"",
            FormatGGType:"",
            keyword:"",
            KeyId:"",
            iscx:false,
            pageSize:10,
            btns:false,
            scroll:20,
            time:3,
            value1:0,
            optiontimer:[
              {data:"全部",value: 0},
              {data:"最近3天",value: 3},
              {data:"最近7天",value: 7},
              {data:"最近30天",value: 30}
            ],
            typelistTime:[3],
            minDate: new Date(2010, 0, 1),
            maxDate: new Date(),
            startTime:"",
            endTime:"",
            showTime:false,
            dateshow:false,
            iszk:false,
            AdditionalKeyword:"",
            Cities:'',
            CityList:'',
            load1:true,
            load2:false,
            kdlist:0,
            allKey:0,  //是否查询所有关键词数据
            Province:'',//省份
            isVip:false,  //是否会员
            isVipTwo:false,
            codeShow:false,  //会员注册弹框
            active: true, //哪种注册方式
            fsyzm: "发送验证码",
            fsyzmTrue: true, //是否在60秒
            tel: "", //手机号
            sms: "", //验证码
            code: "", //邀请码
            isFive:true,


            SubscriptionBiddingDataList:'', //页面能够查看数据条数
            RoleName:'',  //用户角色
            userRoles:false,  //数据底部提示
            DataDetailsView:'', //用户能够查看的数据条数
            value1: 0,
            option1: [
                { text: '标题匹配', value: 0 },
                { text: '全文匹配', value: 1 },
            ],  //下拉框
            IsContext:false,  //标题匹配
            ExcludeKeywords:'',  //排除关键词
        }
    },
    
    methods:{
        ...mapMutations(["activeTwo","show"]),
        //跳转抽奖
        // goLuck(){
        //     this.$router.push("/signone");
        // },
        // 注册
        goReg(){
            this.codeShow = true;
        },

        yc:function(){
            this.iszk==false?this.iszk=true:this.iszk=false;
        },

        getinfo:function(){
            document.body.scrollTop = 0;
            this.dateshow=false;
            this.GetBaseDataByKeyword(this.inputvalue ===""?this.keyword:this.inputvalue,10);
        },

        // 搜索
        searching:function(e){
            if(e.keyCode == 13 || e.keyCode == 108){
                this.load1 = true;
                this.GetBaseDataByKeyword(this.inputvalue,10);
            }
        },

        chongzhi:function(){
            this.typelistTime=[3];
            this.startTime="";
            this.endTime="";
            this.minDate=new Date(2010, 0, 1),
            this.maxDate= new Date();
        },

        changetypeIndexTime:function(e){
            if(this.typelistTime.indexOf(e)==-1){
                this.typelistTime=[],
                this.typelistTime.push(e);
            };
            console.log(this.typelistTime);
            this.startTime="";
            this.endTime="";
        },
        openprop:function(){
            this.dateshow?this.dateshow=false:this.dateshow=true;
        },
        opendate:function(){
            this.showTime=true;
        },
        formatDate(date) {
            return `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;
        },
        onConfirm(date) {
            const [start, end] = date;
            this.showTime = false;
            this.datevalue = `${this.formatDate(start)} - ${this.formatDate(end)}`;
            this.startTime=`${this.formatDate(start)}`;
            this.endTime=`${this.formatDate(end)}`;
            this.typelistTime=[];
        },

        goback:function(){
            window.sessionStorage.removeItem("ProvinceList")
            window.sessionStorage.removeItem("keyword")
            window.sessionStorage.removeItem("GGType")
            window.sessionStorage.removeItem("KeyId")
            window.sessionStorage.removeItem("FormatGGType")
            this.$router.go(-1);
        },

        //订阅维护
        editword:function(){
            this.$router.push('/keyWords')
        },

        //点击下拉框
        changevalue:function(e){
            // console.log(e);
            this.load2 = true;
            this.$dataApi({
                url:'api/Users/GetCityOfKeyWord',
                method:'POST',
                data:{
                    KeyId: e,
                    Source:1
                }
            }).then(response=>{
                console.log(response);
                if(e == 0){
                    this.allKey = 0;
                    this.Cities = '';
                    this.Province = '';
                    this.inputvalue = '';
                    this.GetBaseDataByKeyword('',10);
                    this.load2 = false;
                    this.keyword = '';
                }else{
                    this.allKey = 1;
                    this.Cities = response.Data.City;
                    this.Province = response.Data.Province;
                    this.ExcludeKeywords = response.Data.ExcludeKeywords;
                    this.option.forEach(item=>{
                        if(item.KeyId==e){
                            this.inputvalue=item.keyword;
                            this.GGType=item.GGType;
                            this.ProvinceList=item.SelectedProvince.join(",");
                            this.FormatGGType=item.FormatGGType;
                            this.keyword=item.keyword;
                            this.valueid=e;
                            this.GetBaseDataByKeyword(this.inputvalue,10);
                            this.load2 = false;
                        }
                    })
                };
                document.body.scrollTop = 0;
            }); 
        },

        changetimer(e){
            this.time = e
            this.GetBaseDataByKeyword(this.inputvalue ===""?this.keyword:this.inputvalue,10)
        },

        //获取用户关键词
        getkeyword:function(e){
            let that = this;
            that.$dataApi({
                url:'api/Users/GetUserALLKeyWords',
                method:'POST',
                data:{
                    openid: sessionStorage.getItem("openID"),
                    Source:1
                }
            }).then(response=>{
                // console.log(JSON.parse(response.Data).Rows);
                if (response.Status == 200) {
                    that.option=JSON.parse(response.Data).Rows;
                    that.option.forEach(item=>{
                        item.text=item.keyword;
                        item.value=item.KeyId;
                    });
                } else {
                    Toast("查询失败" + response.Msg);
                }    
            })
        },

        //获取数据
        GetBaseDataByKeyword:function(e,size){
            // console.log(e);
            let that =this;
            this.btns = false;
            this.iscx=false;
            let day2 = new Date();
            day2.setTime(day2.getTime());
            this.$dataApi({
                url:'api/Users/GetBaseDataByUserKeyword',
                method:'POST',
                data:{
                    IsAbout:this.allKey,
                    TimeNo:this.typelistTime[0],
                    TimeBegin:this.startTime!=""?this.startTime:"",    
                    TimeEnd:this.endTime!=""?this.endTime:"",  
                    ProvinceList:this.Province,
                    Cities:that.Cities,
                    GGType:that.GGType == '0'? '' : that.GGType,
                    keyword: e,
                    openid:sessionStorage.getItem("openID"),
                    Source:1,
                    AdditionalKeyword:this.AdditionalKeyword,
                    PageNo:1,
                    // PageSize:that.isVip ? size : 50
                    PageSize:that.SubscriptionBiddingDataList == 0 ? size : (that.SubscriptionBiddingDataList > 20 ? size : that.SubscriptionBiddingDataList),
                    IsContext:that.IsContext,
                    ExcludeKeywords:that.ExcludeKeywords
                }
            }).then(response=>{
                // console.log(response);
                // console.log(JSON.parse(response.Data));
                if (response.Status == 200) {
                    // alert(JSON.parse(response.Data).TotalCount)
                    that.searchlistnum = JSON.parse(response.Data).TotalCount;
                    if(JSON.parse(response.Data).TotalCount == 0){
                        that.isVipTwo = false;
                        that.userRoles = false;
                    }else{
                        that.userRoles = true;
                    };

                    
                    sessionStorage.setItem('searchlist1',JSON.parse(response.Data).TotalCount)
                    that.searchlist = JSON.parse(response.Data).Rows;
                    that.searchlist.forEach(item=>{
                        item.oldtitle=item.title;
                    })
                    if(e.length > 0){
                        const searchVal = e;
                        // 匹配关键字正则
                        const replaceReg = new RegExp(searchVal, 'g')
                        // 高亮替换v-html值
                        const replaceString = `<font color='#F14F4A'>${searchVal}</font>`
                        for (let i = 0; i < that.searchlist.length; i++) {
                        // 开始替换
                        that.searchlist[i].title = that.searchlist[i].title.replace(replaceReg, replaceString).slice(0,90)
                        }
                    }
                    if(that.AdditionalKeyword.length > 0){
                        const searchVal = that.AdditionalKeyword
                        // 匹配关键字正则
                        const replaceReg = new RegExp(searchVal, 'g')
                        // 高亮替换v-html值
                        const replaceString = `<font color='#F14F4A'>${searchVal}</font>`
                        for (let i = 0; i < that.searchlist.length; i++) {
                        // 开始替换
                        that.searchlist[i].title = that.searchlist[i].title.replace(replaceReg, replaceString).slice(0,90)
                        }
                    }
                    // console.log(that.searchlist);
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
                    });
                    this.iscx=true;
                    that.btns = true;
                    that.load1 = false;
                } else {
                    Toast("查询失败" + response.Msg);
                }    
            })
        },

        //滚动事件
        getScroll:function(e){
            let that=this;
            let tops = document.documentElement.scrollTop||document.body.scrollTop;    //滚动条的高度
            if(that.searchlist.length == that.SubscriptionBiddingDataList){
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


            that.isFive = true;


            if(e && (typeof e  == "number") && e!==0){
                setTimeout(()=>{
                    document.documentElement.scrollTop = e;
                    document.body.scrollTop=e;
                    tops=e||document.body.scrollTop;
                },0)
            }
            
            setTimeout(function(){
                if((that.$refs.List.offsetHeight - tops - screen.height) <= -24 && that.searchlistnum != that.searchlist.length && that.btns )
                {
                    that.pageSize=that.pageSize+10;
                    that.GetBaseDataByKeyword(that.inputvalue,that.pageSize)
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
            //查看招标数据ID集合
            this.$dataApi({
                url: "api/RoleManage/GetViewRestrictionsInfo",
                method: "GET",
                data: {
                    OpenId: sessionStorage.getItem("openID"),
                },
            }).then((res) => {
                console.log(res);
                // return
                if(res.BaseIDList.indexOf(e.id) > -1){
                    // console.log('成功');
                }else{
                    if(res.BaseIDList.length < that.DataDetailsView){
                        that.AddViewRestrictionsInfo(e.id);
                        // console.log('成功');
                    }else if(that.DataDetailsView == 0){
                        that.AddViewRestrictionsInfo(e.id);
                        // console.log('成功');
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

            })


            
        },

        //无关键词跳转页面
        goAddKey(){
            if(sessionStorage.getItem("UserIsVip") == 1){
                this.$router.push('/bladdkeywords');
            }else{
                this.$router.push('/addkeyword');
            };
        },

        // 注册
        goReg(){
            this.codeShow = true;
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
                this.GetBaseDataByKeyword(this.inputvalue,10);
                // console.log(this.isVip);
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
                Toast.success("注册成功");
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
                that.SubscriptionBiddingDataList = res.RoleManagement.SubscriptionBiddingDataList;
                that.RoleName = res.RoleManagement.RoleName;
                that.DataDetailsView = res.RoleManagement.DataDetailsView
            });
        },

        //标题匹配或者全文匹配
        chang(index){
            // console.log(index);
            if(index == 0){
                this.IsContext = false;
            }else{
                this.IsContext = true;
            };
            this.GetBaseDataByKeyword(this.inputvalue,10)
        },

        //标题匹配或者全文匹配打开下拉框
        open(){
            // console.log(1);
        }

    },

    
    created:function(){
        let that = this;
        that.getUserRole();
        that.getUUID();
        this.valueid=0;
        this.inputvalue='';
        this.GGType=sessionStorage.getItem("GGType");
        this.ProvinceList=sessionStorage.getItem("ProvinceList");
        this.Cities = sessionStorage.getItem("CityList");
        this.FormatGGType=sessionStorage.getItem("FormatGGType");
        this.keyword='';
        this.timer = 3;
        this.yaoqingma();  //是否是会员
        this.getkeyword();
    },

    beforeRouteEnter(to, from, next) {
        next(vm => {
            // if (to.path === "/Keyinfolist") {
            //     // 苹果分享设置
            //     var u = navigator.userAgent;
            //     var isiOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/); //ios终端

            //     if (isiOS && sessionStorage.getItem("flagIos") == null) {
            //         sessionStorage.setItem("flagIos", 1);
            //         location.reload();
            //     }
            // }
            vm.activeTwo(1);
            if(from.path == '/iframe')
            {
                window.addEventListener('scroll',  vm.getScroll(vm.scroll));
                window.addEventListener('scroll',  vm.getScroll);
            } else {
                vm.GetBaseDataByKeyword(vm.inputvalue,10);
            }
        })
    },

    beforeRouteLeave(to, from, next) {
        localStorage.removeItem("flagIos");
        this.scroll = document.documentElement.scrollTop||document.body.scrollTop;
        if(to.path=='/addkeyword'){
            to.meta.title = "添加您关注的行业";
            next()
        }else {
            next()
        }
    },
    

    mounted:function(){
        window.addEventListener('scroll',  this.getScroll);  
    },

    destroyed:function(){
        window.removeEventListener('scroll', this.getScroll);
    },
}
</script>

<style less="scss" scoped>
    #Keyinfolist{
        width: 100%;
        overflow: auto;
    }
    .header{
        position: fixed;
        top: 0;
        background: #fff;
        width: 100%;
        height: 1rem;
    }
    .nav{
        left: 0 !important;
        width: 75% !important;
        display: flex !important;
    }
    .van-dropdown-menu__bar{
        width: 100% !important; 
        height: 1rem !important;  
    }
    .top{
        height: 1rem;
        position: fixed;
        top: 0;
        width: 100%;
        background-color: #ffffff;
    }
    .top span{
        display: block;
        float: left;
        overflow: hidden;
    }
    .top span:nth-of-type(1){
        height:1rem;
    }
    .top span:nth-of-type(1) img{
        height: 0.26rem;
        width: 0.15rem;
        display: block;
        margin-left: 0.4rem;
        margin-top: 0.37rem;
    }
    .top span:nth-of-type(2){
        margin-left: 1.8rem;
    }
    .top span:nth-of-type(3){
        color: #169BD5;
        font-size: 0.3rem;
        line-height: 1rem;
        float: right;
        margin-right: 0.3rem;
    }
    .titleTop{
        width: 2rem;
        height: 1rem;
        position: fixed;
        top: 0;
        left: 35%;
    }
    .van-dropdown-menu >>> .van-dropdown-menu__bar{
        box-shadow: none;
    }
    .van-dropdown-item__content{
        line-height: 1rem !important;
    }
    #edit{
        position: fixed;
        top: 0;
        display: block;
        color: #169BD5;
        font-size: 0.3rem;
        line-height: 1rem;
        right: 5%;
    }
    .van-cell{
        height: 1rem;
        padding: 0 16px;
        line-height: 1rem !important;
    }
    .van-dropdown-menu__bar--opened{
        box-shadow:none !important;
    }
    .van-ellipsis{
        font-size: 0.36rem;
    }
    .fgx{
        width:7.5rem;
        height:0.16rem;
        background:rgba(242,242,242,1);
        position: fixed;
        top: 1rem;
    }

    .search{
        position: fixed;
        background: #EEEEEE;
        height: 1.4rem;
        width: 100%;
        margin: 0 auto;
        top: 0.9rem;
    }
   .searchnum{
        position: fixed;
        background: #EEE;
        height: 0.38rem;
        font-size: 0.24rem;
        font-family: PingFang SC;
        font-weight: 500;
        color: black;
        line-height: 0.38rem;
        margin-left: 0.35rem;
        margin-top: 0 !important;
        text-align: left;
        padding-left: 0.1rem !important;
        top: 1.9rem;
    }
    .search-imput{
        overflow: hidden;
        width:5rem;
        height:0.64rem;
        position: relative;
        align-items: center;
        display: flex;
        justify-content: space-between;
        margin: 0.18rem 0rem;
        margin-left: 0.32rem;
        float: left;
        margin-left: 2rem;
    }
    .search-imput input{
        width:5rem;
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
        margin-top: 0.2rem;
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

    .search-list{
        height: auto;
        width: 100%;
        margin: 0 auto;
        margin-top: 2.3rem;
        /* padding-bottom: 1rem; */
    }
    .search-split{
        width:100%;
        height:0.16rem;
        background:rgba(242,242,242,1);
    }
    .van-ellipsis{
        text-align: center;
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
        max-width: 8em;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
    }
    .prise{
        background: #fcf3f4;
        color:#e58890 !important;
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
        color:#7886C2 !important;
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
    .time{
        height:3.3rem;
        margin-bottom: 1rem;
        background:rgba(255,255,255,1);
        border-radius:0rem 0rem 20px 0rem;
    }
    .bigtime{
        height: 1rem;
        width: 100%;
        border-bottom: 1px solid #EEEEEE;
    }
    .bigtime span{
        display: block;
        float: left;
        height: 0.48rem;
        width: 1.3rem;
        font-size:0.24rem;
        font-family:PingFang SC;
        font-weight:bold;
        line-height:0.48rem;
        margin-top: 0.26rem;
        margin-left: 0.15rem;
    }
    .bigtime span:nth-of-type(1){
        margin-left: 0.4rem;
    }
    .chosetime{
        display: flex;
        justify-content: center;
        overflow: hidden;
    }
    .hx{
        width: 0.7rem;
        height: 0.03rem;
        background:rgba(22,155,213,1);
        float: left;
        margin: 0 0.16rem;
        margin-top: 0.59rem;
    }
    .chosetime input{
        width: 2.15rem;
        height: 0.6rem;
        border:1px solid rgba(191,191,191,1);
        border-radius: 5px;
        text-align: center;
    }
    .chosetime .input1{
        float: left;
        font-size: 0.3rem;
        margin-top: 0.3rem;
    }
    .chosetime .input2{
        float: left;
        font-size: 0.3rem;
        margin-top: 0.3rem;
    }
    .btn-box1{
        width: 100%;
        margin-top: 0.3rem;
    }
    .btn-box1 button{
        width:1.5rem;
        height:0.6rem;
        border-radius:0.1rem;
        margin-left: 0.1rem;
        font-size:0.28rem;
        font-family:PingFang SC;
        line-height: 0.8rem;
        margin-bottom: 0.3rem;
        display: block;
        float: left;
    }
    .btn1{
        border: 1px solid rgb(153, 146, 146);
        background:rgba(247,247,247,1);
    }
    .btn2{
        border: none;
        background:rgb(76, 168, 248);
    }
    .onlistall{
        background: #169BD5;
        color: #fff;
        text-align: center;
    }
    .listall{
        text-align: center;
        color:rgba(102,102,102,1);
        background:rgba(238,238,238,1);
    }
    .sj{
        width:0;
        height:0;
        /* 防溢出，稳固兼容性 */
        overflow:hidden;
        /* 箭头尺寸 */
        border-width:6px;
        /* 给箭头着色，四个值分别是边框的四个方向，箭头的方向正好相反 */
        border-color:#169BD5 transparent transparent transparent;
        /* 为了兼容性，最好把四个值都补上，需要的方向设实线，其他方向虚线 */
        border-style:solid dashed dashed dashed;
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
    .page{
        width: 100%;
        height: 100%;
        position: fixed;
        top: 0;
    }
    .img1{
        width: 100%;
        height: 75%;
    }
    .img2{
        width: 3.2rem;
        height: 0.7rem;
    }
    .sinVip{
        border-top: 0.2rem solid #F2F2F2;
        margin-bottom: 2rem;
        padding-top: 0.5rem;
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
    .van-button--small{
        background: none;
        color: #006BDF;
    }
    .van-calendar__popup{
        margin-bottom: 1rem !important;
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
    .botBox{
        background: #F0F0F0;
        width: 1.8rem;
    }
    .van-dropdown-menu >>> .van-dropdown-menu__bar{
        box-shadow: none;
        background: none;
        height: 1rem;
    }
</style> 