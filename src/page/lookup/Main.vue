<template>
    <div class="box">
        <!-- 顶部搜索框 -->
        <div class="ggg">
            <div class="search">
                <div class="goback" @click="goback()"></div>
                <div class="search-imput">
                    <form action="javascript:return true" style="margin-bottom:25px">
                        <input type="search" placeholder="搜索" class="input1" ref="searchs" v-model="inputValue" @keyup="searching"  />  
                    </form>
                </div>
                <div class="search-name" @click="search()">
                    <img src="../../../public/image/icon.png" />
                    <span>筛选</span>
                </div>
            </div>
            <!-- 检索条数 -->
            <div class="searchnum" v-if="this.searchlistnum > 0 && this.isfirst">为您检索到了<span style="color:#E7564F;">{{this.searchlistnum}}个</span>推送信息</div>
        </div>
        <!-- 主体内容 -->
        <div ref="Listsearch">
            <div v-for="(item,index) in searchlist" :key="index" class="search-info">
                <div class="search-split"></div>
                <div class="search-title" v-html="item.title" @click="content(item)"> </div>
                <div class="infotyle">
                    <span v-if='item.Province !=""' style="margin-left: 0.4rem;"> {{item.Province}}</span>
                    <span  v-if='item.GGType != ""'> {{item.GGType}}</span>
                    <span v-if='item.HYType != ""' style="overflow:hidden;white-space: nowrap;text-overflow: ellipsis;width: auto;"> {{item.HYType}}</span>
                    <span v-if='item.JoinDate != ""' style="float: right;border: none;padding: 0.08rem 0rem;">
                        <van-icon style="position: relative;top: 1px;right: 1px;" name="clock-o" />{{item.JoinDate}}
                    </span>
                </div>
            </div>
        </div>
        <div class="main">
            <van-popup v-model="showFilter" round  position="bottom" :style="{ height: '85%' }">
                <Search @changeMain="getsearchlistsx" />
            </van-popup>
        </div>
        <div v-if="searchlistnum === 0 ? true : false">
            
        </div>
    </div>
</template>

<script>
    import Vue from 'vue';
    import { Popup } from 'vant';
    import Search from "../search"

    Vue.use(Popup);
    export default {
        components:{
            Search
        },
        data() {
            return {
                searchlistnum:5,  //推送条数
                isfirst:true,
                showFilter:false,
                btns:false,
                issearch:false,
                inputValue:"",   //输入框内容
                searchlist:[],
                showFilter: false,
                back:false,  //从哪个页面来的
                sxdata:"",
            }
        },
        methods: {
            goback(){
               this.$router.go(-1) 
            },
            search(){
                this.showFilter = true
            },
            searching(){
            },
            getsearchlistsx:function(obj){
                this.sxdata=obj;
                this.btns = false;
                this.issearch=true;
                let day2 = new Date();
                day2.setTime(day2.getTime());
                let nowdate= day2.getFullYear()+"-" + ((day2.getMonth()+1)<10 ? "0"+(day2.getMonth()+1):(day2.getMonth()+1)) + "-" + (day2.getDate() < 10 ? "0"+day2.getDate():day2.getDate());
                let that = this;
                this.$dataApi({
                    url:'api/baseData/GetData',
                    method:'POST',
                    data:{
                        title: this.inputValue,//标题，模糊查询
                        TimeNo: obj.TimeNo,//0(全部),3(3天内)，7(7天内)，30(1个月内)，90(3个月内)
                        GGType: obj.GGType,//全部0,招标公告1,变更公告2,结果公告3,拼接
                        Provinces: obj.Provinces,//省份拼接
                        TimeBegin:obj.TimeBegin,   //开始时间
                        TimeEnd:obj.TimeEnd,
                        pageNo: 1,
                        // pageSize:pageSize || this.pageSize,
                        pageSize:20,
                        // openid:sessionStorage.getItem("openID"),
                        openid:obj.openid,
                        IsAbout:obj.IsAbout,
                        Industry:obj.Industry,
                        // Industry:'装饰装修',
                        Source:1
                        }
                        }).then(response=>{
                    that.searchlistnum = JSON.parse(response.Data).TotalCount;
                    that.searchlist = JSON.parse(response.Data).Rows;
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
                    that.isfirst=true;
                })
                .catch(function (error) {
                console.log(error);
                });
                this.showFilter=false;
            },

            getsearchlist:function(size){
                this.btns = false;
                this.issearch=true;
                let day2 = new Date();
                day2.setTime(day2.getTime());
                let nowdate= day2.getFullYear()+"-" + ((day2.getMonth()+1)<10 ? "0"+(day2.getMonth()+1):(day2.getMonth()+1)) + "-" + (day2.getDate() < 10 ? "0"+day2.getDate():day2.getDate());
                let that = this;
                this.$dataApi({
                    url:'api/baseData/GetData',
                    method:'POST',
                    data:{
                       title: this.inputValue,//标题，模糊查询
                        TimeNo: that.sxdata!=""?that.sxdata.TimeNo:0,//0(全部),3(3天内)，7(7天内)，30(1个月内)，90(3个月内)
                        GGType:  that.$router.history.current.query.GGType,//全部0,招标公告1,变更公告2,结果公告3,拼接
                        Provinces: that.sxdata!=""?that.sxdata.Provinces:"",//省份拼接
                        TimeBegin:that.sxdata!=""?that.sxdata.TimeBegin:"",   //开始时间
                        TimeEnd:that.sxdata!=""?that.sxdata.TimeEnd:"",
                        pageNo: 1,
                        pageSize:size,
                        openid:sessionStorage.getItem("openID"),
                        IsAbout:that.sxdata!=""?that.sxdata.IsAbout:"",
                        Industry:that.sxdata!=""?that.sxdata.Industry:"",
                        Source:1
                    }
                    }).then(response=>{
                    that.searchlistnum = JSON.parse(response.Data).TotalCount;
                    that.searchlist = JSON.parse(response.Data).Rows;
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
                    that.isfirst=true;
                })
                .catch(function (error) {
                console.log(error);
                });
                this.showFilter=false;
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
                if((that.$refs.Listsearch.offsetHeight - tops - screen.height) <= -60 && that.searchlistnum != that.searchlist.length && that.btns )
                {
                    that.pagesize=that.pagesize+20;
                    that.getsearchlist(that.pagesize)
                }
                },500)
            },

            content:function(e){
               window.removeEventListener('scroll',  this.getScroll);
               this.$dataApi({
                 url:"api/Users/SaveMyTrack",
                 method:"POST",
                 data:{
                    OpenId:sessionStorage.getItem('openID'),
                    id:e.id,
                    Source:1
                 }
               }).then(res=>{
               })

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
                    },
                  })
               })
             },

        },
        created() {
            this.getsearchlist(20)
        },

        mounted:function(){
            window.addEventListener('scroll',  this.getScroll);  
        },
        destroyed:function(){
            window.removeEventListener('scroll', this.getScroll);
        },

        beforeRouteEnter(to, from, next) {
           next(vm => {
                if(from.path === "/"){
                    vm.inputValue = vm.$router.history.current.query.hotinputvalue
                }else{
                    vm.inputValue = vm.$router.history.current.query.searchvalue
                }
           })
        },
    }
</script>

<style scoped>
    .box{
        height: 100%;
        /* background: pink; */
    }
    .ggg{
        /* height: 1rem; */
        width: 100%;
        /* position: fixed; */
        background: #F0F0F0;
        z-index: 99;
    }
    .search{
        /* position: fixed; */
        /* background: #fff; */
        height: 1rem;
        width: 100%;
        margin: 0 auto;
        display: flex;
    }
    .goback{
        width: 0.8rem;
        height: 1rem;
        /* background: pink; */
        background: url(../../../public/image/icon-left.png) no-repeat 0.3rem 0.3rem;
        background-size: 30% 40%;
        /* background-image: url(); */
    }
    .search-imput{
        overflow: hidden;
        width:5.52rem;
        height:0.64rem;
        position: relative;
        align-items: center;
        display: flex;
        justify-content: space-between;
        /* background:#FFF; */
        margin: 0.18rem 0rem;
        /* margin-left: 0.32rem; */
        float: left;
    }
    .search-imput input{
        background: #FAFAFA;
        width:5.4rem;
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

    .searchnum{
        /* position: fixed; */
        /* background: #fff; */
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
        padding: 0.08rem 0.22rem;
        border:0.01rem solid rgba(232,232,232,1);
        border-radius:20px;
        max-width: 8em;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
    }

</style>