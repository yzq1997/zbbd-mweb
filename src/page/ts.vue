<template>
  <div class="container">
        <van-overlay class="mtk2" :show="load">
            <div class="wrapper" @click.stop>
                <van-loading size="40px" style="color: #fff"
                    >加载中...</van-loading
                >
            </div>
        </van-overlay>
        <!-- 顶部搜索框 -->
        <div class="search">
            <div class="search-imput">
                <input type="search" v-bind:placeholder="placeholderValue" class="search" ref="searchs" v-model="inputValue" @keyup="searching"  />
            </div>
            <div class="search-name" @click="isshowFilter">
                <img src="../../public/image/icon.png" />
                <span> 筛选</span>
            </div>
        </div>
        <!-- 内容列表 -->
        <div class="searchnum" v-if="this.searchlistnum > 0 ">为您检索到了<span style="color:#E7564F;">{{this.searchlistnum}}个</span>推送信息</div>
        <div class="search-list" v-if="searchlist.length>0 ">
            <div ref="List">
            <div v-for="(item,index) in searchlist" :key="index" class="search-info">
                        <div class="search-split"></div>
                            <div class="search-title" v-html="item.title" @click="content(item)"> </div>
                        <div class="infotyle">
                            <span v-if='item.Province !=""' style="margin-left: 0.4rem;"> {{item.Province}}</span>
                            <span  v-if='item.GGType != ""'> {{item.GGType}}</span>
                            <span v-if='item.HYType != ""' style="overflow:hidden;white-space: nowrap;text-overflow: ellipsis;width: auto;"> {{item.HYType}}</span>
                            <span  v-if="(item.Amount / 10000).toFixed(2) == 0 ? false: true" class="prise">{{ (item.Amount / 10000).toFixed(2) }}万</span
                        >
                            <span v-if='item.JoinDate != ""' style="float: right;border: none;padding: 0.08rem 0rem;">
                                <van-icon style="position: relative;top: 1px;right: 1px;" name="clock-o" />{{item.JoinDate}}
                            </span>
                        </div>
                        </div>
                </div>
                <div v-if="searchlistnum == searchlist.length " style="width:100%;text-align:center;font-size: 0.24rem;font-family: PingFang SC;line-height: 60px;">
                    <div class="search-split"></div>
                    <span>没有更多了</span>
                </div>
                <div v-if="searchlistnum > searchlist.length && (isvip || (!isvip && pageSize <140))" style="width:100%;text-align:center;font-size: 0.24rem;font-family: PingFang SC;line-height: 55px;">
                    <div class="search-split"></div>
                    <span>
                    <van-loading size="24px" vertical>加载中...</van-loading>
                    </span>
                </div>
        </div>

        <div v-if="searchlist.length==0 " class="noisearchlist">
            <img src="../../public/image/search_defualt.png" class="defaultImg"/>
            <div class="noseachinfo">哎呀！没有搜索到任何内容、换个词试试吧</div>
        </div>
        <!-- 筛选模板 -->
        <van-popup v-model="showFilter" round  position="bottom" :style="{ height: '85%' }">
            <hr style="margin-top: 0rem; margin-bottom: 0.2rem;"/>
            <!-- 类型 -->
            <div class="title" style="margin-top: 0rem;">信息类型</div>
            <div class="tyoe-list-type">
                <div :class="[ typeall ?  'onlistall'  :'listall' ]" @click='changetypeIndex(0,0)'>
                <span>全部</span>
                </div>
            <div v-for="(item,index) in filterType" :key="index" :class="[ typelist.indexOf( item.value )!=-1 && !typeall ?  'onlistall'  :'listall' ]" @click='changetypeIndex(index,item.value)' style="float: left;margin-bottom: 0.4rem;margin-top: 0.14rem;">
                <span type='type'>{{ item.text}}</span>
                </div>
            </div>
            <!-- <hr style="margin-top: 0rem; margin-bottom: 0.2rem;"/> -->
            <!-- 地区 -->
            <!-- <div class="title" style="margin-top: 0rem;width: auto;">
                <span style="display: block;float: left;">地区</span>
                <span style="float: right;display: block;margin-right: 0.5rem;" @click='ispshowFilter' >选择</span>
            </div> -->
            <div class="tyoe-list-province">
                <!-- <div :class="[ provinceall ?  'onlistall'  :'listall' ]" @click='changeproIndex(-1,-1)'>
                <span>全部</span>
                </div> -->
                <div v-for="(item,index) in presult" :key="index" class="onlistall"   style="float: left;margin-bottom: 0.14rem;margin-top: 0.14rem;">
                <span type='type'>{{item}}</span>
                </div>
            </div>
            <hr style="margin-top: 0rem; margin-bottom: 0.2rem;margin-top: 0.4rem;"/>
            <!-- 确认取消按钮 -->
            <div class="bottom">
                <van-button type="default" style="background:rgba(76,168,248,1)" @click='getsearchlist()'>确认</van-button>
                <van-button type="default" @click='restore()'>重置</van-button>
            </div>
        </van-popup>

        <!-- <van-popup v-model="pshowFilter" round  position="bottom" :style="{ height: '85%' }">
            <van-cell clickable key="全国"   @click="remover()">
                <van-checkbox v-model="checkedm">全国</van-checkbox>
            </van-cell>
                <van-index-bar>
                <van-cell-group v-for="(titem, index) in ptype" :key="index">
                <van-index-anchor :index="`${titem}`" style="text-align: left; background-color: #D3D3D3;" />
                <van-checkbox-group v-model="result">
                    <van-cell-group>
                    <van-cell
                            v-if="item.AreaChar == titem"
                        v-for="(item, index) in contentdata"
                        clickable
                        :key="index"

                        @click="toggle(index,item.AreaName)"
                    >
                        <van-checkbox :name="item" ref="checkboxes">{{item.AreaName}}</van-checkbox>
                    </van-cell>
                    </van-cell-group>
                </van-checkbox-group>
                </van-cell-group>
                </van-index-bar>
        </van-popup> -->
		<!-- 维护推送内容 -->
  </div>
</template>

<script>
    // import { RadioGroup, Radio } from 'vant';
    import { Toast } from 'vant';
    import wx from 'weixin-js-sdk';
    import { mapMutations } from "vuex";
    import { Dialog  } from 'vant';
    import { baseURL } from '../util/config'  
    export default {

        data(){
            return {
                load:true,
                searchlist:[],
                searchlistnum:0,
                loading: false,
                finished: false,
                showFilter: false,
                pshowFilter:false,
                filterTime:[
                { text: '不限', value: 0 },
                { text: '3天内', value: 3 },
                { text: '7天内', value: 7 },
                { text: '1个月内', value: 30 },
                { text: '3个月内', value: 90 },
                ],
                province:['安徽','澳门','北京','重庆',
                '福建','广州','广西','贵州',
                '甘肃','湖北','河北','黑龙江',
                '海南','河南','湖南','吉林',
                '江苏','江西','辽宁','内蒙古',
                '宁夏','青海','山西','陕西',
                '上海','山东','四川','天津',
                '台湾','西藏','新疆','香港',
                '云南','浙江'],
                filterType:[
                { text: '全部', value: 0},
                { text: '招标公告', value: 1 },
                { text: '变更公告', value: 2 },
                { text: '结果公告', value: 3 }],
                placeholderValue:'搜索',
                inputValue:"",
                isshow: true,
                activeindex: 0,
                activepro:-1,
                typelist:[],
                provincelist:[],
                pageNo:1,
                pageSize:20,
                typeall:true,
                provinceall:true,
                TimeNo:3,
                openid:"",
                radio: "2",
                btns:false,
                IsAbout:0,
                scroll:0,

                result: [],
                presult:[],
                // contentdata:[],
                // ptype:[],
                checked: true,
                checkedm:true,
                defaultIndex:1,
                isvip:false,
                iszcvip:false,
                
            }
        },

      methods:{
        ...mapMutations(["activeOne", "hide"]),
        getUrlParam:function(name) {
            var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
            var r = window.location.search.substr(1).match(reg);
            if (r != null) return decodeURIComponent(r[2]); return null;
        },

        getScroll:function(e){

            let tops = document.documentElement.scrollTop||document.body.scrollTop;    //滚动条的高度
            let that=this;
              if(e && (typeof e  == "number") && e!==0){
                setTimeout(()=>{
                  document.documentElement.scrollTop = e;
                  document.body.scrollTop=e;
                  tops=e||document.body.scrollTop;
                },0)
              }
               setTimeout(function(){
                if((that.$refs.List.offsetHeight - tops - screen.height) <= -78 && that.searchlistnum != that.searchlist.length && that.btns )
                {
                   that.pageSize=that.pageSize+20;
                    that.getsearchlist(that.pageSize)

                }
                },500)

        },

        // 跳转到维护页面
        gettop:function(){
            this.$router.push({path:'/keyWords'})
        },

        govip:function(){
            this.$router.push({path:'/registered'})
        },

        content:function(e){
            sessionStorage.setItem("sharetitle",e.oldtitle)
            let OId = sessionStorage.getItem('openID')
            //   this.$axios.post('https://weixin.jshcsoft.com/biddingbook/api/api/Users/SaveMyTrack',{
            //     OpenId:OId,
            //     id:e.id
            //   }).then(res=>{})

            this.$dataApi({
                url:'https://weixin.jshcsoft.com/biddingbook/api/api/Users/SaveMyTrack',
                method:'POST',
                data:{
                    OpenId:OId,
                    id:e.id
                }
            }).then(res=>{})

            this.$dataApi({
                url:'https://weixin.jshcsoft.com/biddingbook/api/api/Users/CheckIsConcernProject',
                method:'POST',
                data:{
                    OpenId:OId,
                    id:e.id,
                    Source:1
                }
            }).then(res=>{
                console.log(res);
                
                this.msg = res.Msg;
                let a = e.ZBUrl+`?IsConcerned=${this.msg}&id=${e.id}&openID=${sessionStorage.getItem('openID')}&Source=1`;
                sessionStorage.setItem("url",a)
                // console.log(a);
                
                this.$router.push({
                    path:'/iframe',
                    query: {
                        ZBUrl:a,
                        id:e.id
                    },
                })

            })

            //   this.$axios.post('https://weixin.jshcsoft.com/biddingbook/api/api/Users/CheckIsConcernProject',{
            //     OpenId:OId,
            //     id:e.id,
            //     Source:1
            //   }).then(res=>{
            //     this.msg = JSON.parse(res.data).Msg;
            //     let a = e.ZBUrl+`?IsConcerned=${this.msg}&id=${e.id}&openID=${sessionStorage.getItem('openID')}`;
            //     // console.log(a);
                
            //     sessionStorage.setItem("url",a)
            //     this.$router.push({
            //         path:'/iframe',
            //         query: {
            //             ZBUrl:a,
            //         },
            //         })
            //     })
            window.removeEventListener('scroll',  this.getScroll);
        },

        restore:function(){
            this.changetypeIndex(0,0);
            this.changeproIndex(-1,-1);
            this.TimeNo=3;
            this.defaultIndex=1;
            this.radio="1";
            this.presult=[];
            this.checkedm=true;
            // this.remover();
            this.checked=false;
            this.result=[];
        },

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
              this.typelist=[""];
              this.typeall=true
            }
        },

        changeproIndex(index,value){
            if(value !=-1 && this.provincelist.indexOf( value )!=-1){
                this.provinceall=false
                this.provincelist.splice( this.provincelist.indexOf( value ), 1 )
            }
            else if(value !=-1 && this.provincelist.indexOf( value )==-1 ){
                this.provincelist.push(value)
                this.provinceall=false
            }
            if(value ==-1){
                this.provincelist=[];
                this.provinceall=true
            }
        },

        // 搜索
        searching:function(e){
            if(e.keyCode == 13 || e.keyCode == 108){
              this.getsearchlist()
            }
        },

        // 查询列表数据
        getsearchlist:function(pageSize){
            this.btns = false;
            let day2 = new Date();
            day2.setTime(day2.getTime());
            let nowdate= day2.getFullYear()+"-" + (day2.getMonth()+1) + "-" + day2.getDate();
            let that = this;

            sessionStorage.setItem("radio",this.radio);
            if(that.radio=="2"){
                that.IsAbout=1;
            } else {
                that.IsAbout=0;
            }

            // that.$axios.post('https://weixin.jshcsoft.com/biddingbook/api/api/BaseData/GetDataPackage', {
            //     IdentifyNumber:localStorage.getItem("IdentifyNumber"),
            //     title: this.inputValue,//标题，模糊查询
            //     // TimeNo: this.TimeNo,//0(全部),3(3天内)，7(7天内)，30(1个月内)，90(3个月内)
            //     GGType: this.typelist.toString().length ==0 ? "" : this.typelist.toString(),//全部0,招标公告1,变更公告2,结果公告3,拼接
            //     Provinces:  (this.presult.toString().length ==0 || this.presult.indexOf("全国")==0) ? "" : this.presult.toString(),//省份拼接
            //     pageNo: 1,
            //     pageSize:pageSize || this.pageSize,
            //     openid:sessionStorage.getItem("openID"),
            //     // IsAbout:that.IsAbout,
            //     Source:1,
            //     // TimeBegin:sessionStorage.getItem('beginDateTS') || '',
            //     // TimeEnd:sessionStorage.getItem('endDateTS') || '',
            // })
            // .then(function (response) {
            //     that.searchlistnum = JSON.parse(JSON.parse(response).Data).TotalCount;
            //     that.searchlist = JSON.parse(JSON.parse(response).Data).Rows;
            //     console.log(that.searchlist)
            //     that.searchlist.forEach(item=>{
            //         item.oldtitle=item.title;
            //     })
            //     if(that.inputValue.length > 0){
            //         const searchVal = that.inputValue
            //         // 匹配关键字正则
            //         const replaceReg = new RegExp(searchVal, 'g')
            //         // 高亮替换v-html值
            //         const replaceString = `<font color='#F14F4A'>${searchVal}</font>`
            //         for (let i = 0; i < that.searchlist.length; i++) {
            //         // 开始替换
            //         that.searchlist[i].title = that.searchlist[i].title.replace(replaceReg, replaceString).slice(0,90)
            //         }
            //     }

            //     that.searchlist.forEach(item=>{
            //         item.GGType=item.FormatGGType;
            //         let date= item.JoinDate.replace(new RegExp("-","gm"),"/");
            //         let  EndTime =(new Date(date)).getTime(); //获取抓取时间的秒数
            //         let s=(day2.getTime()/1000 - EndTime/1000)
            //         let m=(day2.getTime()/1000/60 - EndTime/1000/60)
            //         let h=(day2.getTime()/1000/60/60 - EndTime/1000/60/60)
            //         if(s>0 && s<60){
            //         item.JoinDate=parseInt(s) + "秒前";
            //         } else if(m>0 && m<60){
            //         item.JoinDate=parseInt(m) + "分钟前";
            //         } else if(h >0 && h<24){
            //         item.JoinDate=parseInt(h) + "小时前";
            //         } else if(h >=24 && h<=48){
            //         item.JoinDate="昨天";
            //         } else if(h>48){
            //         item.JoinDate=item.JoinDate.substring(0,10);
            //         }
            //     })
            //     that.btns = true;
            //     that.load = false;

            // })
            // .catch(function (error) {
            //     console.log(error);
            // });

            if(localStorage.getItem('IdentifyNumber')){
                that.$axios.post('https://weixin.jshcsoft.com/biddingbook/api/api/BaseData/GetDataPackage', {
                // that.$axios.post('http://211.149.250.2:20001/ZBBDTEST/api/BaseData/GetDataPackage', {
                    IdentifyNumber:localStorage.getItem("IdentifyNumber"),
                    title: this.inputValue,//标题，模糊查询
                    // TimeNo: this.TimeNo,//0(全部),3(3天内)，7(7天内)，30(1个月内)，90(3个月内)
                    GGType: this.typelist.toString().length ==0 ? "" : this.typelist.toString(),//全部0,招标公告1,变更公告2,结果公告3,拼接
                    Provinces:  (this.presult.toString().length ==0 || this.presult.indexOf("全国")==0) ? "" : this.presult.toString(),//省份拼接
                    pageNo: 1,
                    pageSize:pageSize || this.pageSize,
                    openid:sessionStorage.getItem("openID"),
                    // IsAbout:that.IsAbout,
                    Source:1,
                    // TimeBegin:sessionStorage.getItem('beginDateTS') || '',
                    // TimeEnd:sessionStorage.getItem('endDateTS') || '',
                })
                .then(function (response) {
                    that.searchlistnum = JSON.parse(JSON.parse(response).Data).TotalCount;
                    that.searchlist = JSON.parse(JSON.parse(response).Data).Rows;
                    console.log(that.searchlist)
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
                    that.load = false;
                })
                .catch(function (error) {
                    console.log(error);
                });
            }else{
                that.$axios.post('https://weixin.jshcsoft.com/biddingbook/api/api/BaseData/GetPushData', {
                // that.$axios.post('http://211.149.250.2:20001/ZBBDTEST/api/BaseData/GetPushData', {
                    IdentifyNumber:localStorage.getItem("PushDataId"),
                    title: this.inputValue,//标题，模糊查询
                    GGType: this.typelist.toString().length ==0 ? "" : this.typelist.toString(),//全部0,招标公告1,变更公告2,结果公告3,拼接
                    Provinces:  (this.presult.toString().length ==0 || this.presult.indexOf("全国")==0) ? "" : this.presult.toString(),//省份拼接
                    pageNo: 1,
                    pageSize:pageSize || this.pageSize,
                    openid:sessionStorage.getItem("openID"),
                    Source:1,
                })
                .then(function (response) {
                    that.searchlistnum = JSON.parse(JSON.parse(response).Data).TotalCount;
                    that.searchlist = JSON.parse(JSON.parse(response).Data).Rows;
                    console.log(that.searchlist)
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
                    that.load = false;
                })
                .catch(function (error) {
                    console.log(error);
                });
            }

            


            this.showFilter=false;
        },

        //加载列表数据上滑
        onLoad() {
            this.getsearchlist();
        },

        isshowFilter:function(){
            this.showFilter=true;
        },

        ispshowFilter:function(){
            this.pshowFilter=true;
        },

        onChangeTime(picker, value, index) {
           this.TimeNo=value.value;
           this.defaultIndex=index;
        },

        getprovince:function(){
            let that = this;
            // that.$axios.post('https://weixin.jshcsoft.com/biddingbook/api/api/Area/GetArea', {

            // }).then(function (response) {
            //     that.contentdata=JSON.parse(response.data);
            //     JSON.parse(response.data).forEach((item,index)=>{
            //     that.ptype.push(item.AreaChar);
            //     })
            // that.ptype= Array.from(new Set(that.ptype))
            // })
            // .catch(function (error) {
            //     console.log(error);
            // });
        },

        toggle(index,item) {
            this.checkedm=false;
            if(this.presult.indexOf("全国")==0){
                this.presult.shift();
            }
            if(this.presult.indexOf(item) >-1){
                this.presult.splice(this.presult.indexOf(item),1);
            } else {
                this.presult.push(item);
            }
            this.$refs.checkboxes[index].toggle();

        },

        remover(){
            this.checked=false;
            this.result=[];
            this.presult=[];
            this.presult.push("全国");
        },

        //判断是否是vip
        isvippeo(){
            let that=this;
            this.$axios({
                method:"post",
                url:'https://weixin.jshcsoft.com/biddingbook/api/api/Users/GetUsers',
                data:{
                    openid: sessionStorage.getItem("openID"),
                    ispage:1
                }
            })
            .then(function (response) {
                if(JSON.parse(response.data).Rows.length ==0 ){
                    that.isvip=false;
                    that.iszcvip=false;
                }
                if(JSON.parse(response.data).Rows.length !=0 && JSON.parse(response.data).Rows[0].IsMember==0 ){
                    that.isvip=false;
                    that.iszcvip=false;
                    // Dialog.confirm({
                    //   message: '非企业会员用户，只能查看20条数据，是否注册会员？',
                    // })
                    //   .then(() => {
                    //      that.iszcvip=true;
                    //      that.isvip=true;
                    //      that.$router.push({path:'/registered'})
                    //      return false;
                    //   })
                }
                else if(JSON.parse(response.data).Rows.length !=0 && JSON.parse(response.data).Rows[0].IsMember!=0){
                    that.isvip=true;
                    that.iszcvip=true;
                }
                    console.log(that.isvip)
                })

            }
        },

        created:function(){
            localStorage.removeItem("Identify")

            let OId = sessionStorage.getItem('openID')
            this.$axios.post('https://weixin.jshcsoft.com/biddingbook/api/api/Users/SaveUserClickCount',{
                OpenId:OId,
                Source:1
            }).then(res=>{
            //  console.log(res);
            })

            this.COMMON.initRem();
            // this.getprovince();
        
            if(sessionStorage.getItem("radio")==null){
                sessionStorage.setItem("radio",this.radio)
            } else {
                this.radio=sessionStorage.getItem("radio")
            }
            this.getsearchlist(20);
            // this.isvippeo();
        },

        beforeRouteLeave(to, from, next) {
                // 如果在window中出现的滚动条
                localStorage.removeItem("flagIos");
                this.scroll = document.documentElement.scrollTop||document.body.scrollTop;
                if(to.path === "/iframe"){
                    next()
                }else{
                    wx.closeWindow();
                }
            
        },

        beforeRouteEnter(to, from, next) {
                next(vm => {
                    vm.hide();
                    if (to.path === "/ts") {
                        // 苹果分享设置
                        var u = navigator.userAgent;
                        var isiOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/); //ios终端
                        var isIphone = navigator.userAgent.includes('iPhone');
                        if (isIphone && sessionStorage.getItem("flagIos") == null) {
                            sessionStorage.setItem("flagIos", 1);
                            location.reload();
                        }
                        
                    }

                    if(from.path == '/iframe')
                    {
                        window.addEventListener('scroll',  vm.getScroll(vm.scroll));
                        window.addEventListener('scroll',  vm.getScroll);
                    }
                    if(from.path=='/registered'){
                        // vm.isvippeo();
                        vm.pageSize=20;
                        vm.getsearchlist();
                    }
                })
        },

        mounted:function(){
            window.addEventListener('scroll',  this.getScroll);
        },

        destroyed:function(){
            window.removeEventListener('scroll', this.getScroll);
        }
    }
</script>

<style   scoped>
    .container{
        width: 100%;
        overflow: auto;
        position: relative;
    }
    .gomy{
        /* position: fixed; */
        display: fixed;
        width: 1.25rem;
        height: 1.25rem;
        position: fixed;
        top: 80%;
        left: 5.99rem;
    }
    .mtk{
        position: fixed;
        width: 100%;
        height: 100%;
        opacity: 0.6;
        background:#000;
        z-index: 998;
    }
    .freeRegister{
        width: 5.08rem;
        height: 5.79rem;
        position: absolute;
        left: 0;  /* 注意不要漏了上下左右为0，否则不会成功 */
        right: 0;
        top: 3.5rem;
        bottom: 0;
        margin: 0 auto;
        z-index: 999;
    }
    .aa{
        position: relative;
        width: 5.08rem;
        height: 5.79rem;
        float: left;
    }
    .freeBtn{
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
    .leave{
        display: block;
        width: 2rem;
        position: relative;
        top: -1.7rem;
        left: 1.54rem;
        font-size: 0.2rem;
        color: #999999;
        float: left;
    }

    .searchnum{
        height:0.38rem;
        font-size:0.24rem;
        font-family:PingFang SC;
        font-weight:500;
        color:rgba(171,171,171,1);
        line-height:0.38rem;
        margin-left: 0.35rem;
        margin-top: 0 !important;
        text-align: left;
        padding-left: 0.1rem !important;
    }
    .search{
        height: 1rem;
        width: 100%;
        margin: 0 auto;
    }
    .search-imput{
        overflow: hidden;
        width:5.52rem;
        height:0.64rem;
        /* padding-left:0.32rem; */
        position: relative;
        align-items: center;
        display: flex;
        justify-content: space-between;
        background:#FFF;
        margin: 0.18rem 0rem;
        margin-left: 0.32rem;
        float: left;
    }
    .search-imput input{
        background: #FAFAFA;
        width:5.52rem;
        height:0.64rem;
        background: rgba(240,240,240,1);
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
        /* margin-left: 0.32rem; */
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
    }

    .search-split{
        width:7.5rem;
        height:0.16rem;
        background:rgba(242,242,242,1);
    }
    .search-title{
        width:6.48rem;
        margin-left: 0.43rem;
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
        width:7.5rem;
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
        margin-right: 0.2rem;
        padding: 0.08rem 0.12rem;
        border:0.01rem solid rgba(232,232,232,1);
        border-radius:20px;
        max-width: 8em;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
    }
    .van-list__finished-text{
        width:7.5rem;
        height:2.25rem;
        background:rgba(240,240,240,1);
        font-size:0.28rem;
        font-family:PingFang SC;
        font-weight:500;
        color:rgba(203,203,203,1);
        line-height:2.25rem;
        text-align: center;
    }
    .container .title{
        width:1.5rem;
        height:0.57rem;
        font-size:0.28rem;
        font-family:PingFang SC;
        font-weight:800;
        color:rgba(171,171,171,1);
        line-height:0.58rem;
        margin-top: 0.46rem;
        margin-left: 0.4rem;
    }
    .container hr{
        width: 6.9rem;
        height: 0.01rem;
        background: rgba(232,232,232,1);
    }
    .tyoe-list-type{
        margin: 0 auto;
        display: block;
        margin-top: 0.24rem;
        margin-left: 0.2rem;
    }
    .tyoe-list-type :nth-child(2){
        display: none;
    }
    .tyoe-list-province{
        margin: 0 auto;
        display: block;
        margin-top: 0.24rem;
        margin-left: 0.2rem;
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
    }
    .listall span[type='type']{
        /* float: left; */
    }
    .bottom{
        width: 100%;
        margin: 0 auto;
    }
    .bottom button{
        width:2rem;
        height:0.8rem;
        background:rgba(191,191,191,1);
        border-radius:0rem;
        float: right;
        margin: 0.4rem 0.29rem;
        font-size:0.28rem;
        font-family:PingFang SC;
        font-weight:500;
        color:rgba(255,255,255,1);
        line-height:0.58rem;
    }
    .gettop{
        display: fixed;
        width: 1.25rem;
        height: 1.25rem;
        position: fixed;
        top: 70%;
        left: 5.99rem;
    }
    .getvip{
        display: fixed;
        width: 1.25rem;
        height: 1.25rem;
        position: fixed;
        top: 60%;
        left: 5.99rem;
    }
    .van-radio--horizontal{
        margin-right: 12px;
        margin-left: 0.88rem;
        margin-bottom: 0.25rem;
    }
    .van-radio__label{
        font-size: 0.24rem;
        font-family: PingFang SC;
        line-height: 0.8rem;
    }
    .van-cell{
        padding:0 16px;
    }
    .van-cell--clickable{
        height: 0.6rem;
    }
    .van-checkbox{
        height: 0.6rem;
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
    .prise {
        background: #fcf3f4;
        color: #e58890 !important;
    }
    .mtk2 {
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
</style>
