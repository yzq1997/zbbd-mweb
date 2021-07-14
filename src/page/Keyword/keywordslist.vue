<template>
    <div id="keywordslist">
         <van-nav-bar
            class="header"
            title="招标宝典服务"
            left-text
            right-text="新增"
            left-arrow
            @click-left="onClickLeft"
            @click-right="onClickRight"
        />
        <!-- list -->
        <div class="list" v-if="keywordslist.length>0 && KeyWordCount>0" >
            <ul>
                <li @click="goinfolist(item)" v-for="(item, index) in keywordslist" :key="index">
                    <div class="toptitle">
                        <img src="../../../public/image/icon-list.png" alt="">
                        <span>{{item.keyword}}</span>
                    </div>
                    <span class="title">{{item.title}}</span>
                    <div class="type">
                        <span v-if='item.Province !=""'>{{item.Province}}</span>
                        <span v-if='item.FormatGGType !=""'>{{item.FormatGGType}}</span>
                        <span v-if='item.HYType !=""'>{{item.HYType}}</span>
                        <span v-if='item.JoinDate !=""' style="float: right;">{{item.JoinDate}}</span>
                    </div>
                </li>
            </ul>
        </div>
        <!-- 为空展现 -->
        <div v-if="keywordslist.length==0 && KeyWordCount==0" class="noisearchlist">
            <img src="../../../public/image/search_defualt.png" class="defaultImg"/>
            <div class="noseachinfo">您还未设置感兴趣的招标关键词</div>
            <span @click="onClickRight()">马上添加</span>
        </div>

        <div v-if="keywordslist.length==0 && KeyWordCount>0" style="width:100%;text-align:center;font-size: 0.24rem;font-family: PingFang SC;line-height: 60px;">
            <van-loading size="24px" vertical>加载中...</van-loading>
        </div>
    </div>
</template>

<script>
import { Toast } from 'vant';
export default {
    data(){
        return {
            keywordslist:[],
            KeyWordCount:Number(sessionStorage.getItem("KeyWordCount")),
        }
    },

    methods:{
        nClickLeft:function(e){
            this.$router.go(-1);
        },

        onClickRight:function(){
            this.$router.push({
                path:'/addkeyword',
            })
        },

        SearchKeyWordsByOpenId:function(){
            let day2 = new Date();
            day2.setTime(day2.getTime());
            let nowdate= day2.getFullYear()+"-" + ((day2.getMonth()+1)<10 ? "0"+(day2.getMonth()+1):(day2.getMonth()+1)) + "-" + (day2.getDate() < 10 ? "0"+day2.getDate():day2.getDate());
            this.$dataApi({
                url:'api/Users/SearchKeyWordsByOpenId',
                method:'GET',
                data:{
                    openId: sessionStorage.getItem("openID"),
                    Source:1
                }
            }).then(response=>{
                if (response.Status == 200) {
                    if(JSON.parse(response.Data).Rows.length==0){
                        this.KeyWordCount=0;
                    }
                    this.keywordslist=JSON.parse(response.Data).Rows;
                    this.keywordslist.forEach(item=>{
                        if(item.JoinDate !=null){
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
                            item.JoinDate=item.JoinDate.substring(5,10);
                            }
                        }  
                    })
                } else {
                    Toast.fail("查询失败" + response.Msg);
                }    
            })
        },

        goinfolist:function(e){
            sessionStorage.setItem("KeyId",e.KeyId);
            sessionStorage.setItem("keyword",e.keyword);
            sessionStorage.setItem("GGType",e.GGType);
            sessionStorage.setItem("ProvinceList",e.SelectedProvince.join(","));
            sessionStorage.setItem("FormatGGType",e.FormatGGType);
            this.$router.push({
                path:'/Keyinfolist',
            })
        }
    },

    created:function(){
        this.SearchKeyWordsByOpenId()
    }
}
</script>

<style scoped>
    #keywordslist{
        width: 100%;
        overflow: auto;
    }
    .van-nav-bar{
        height: 1rem;
    }
    .list{
        overflow: hidden;
        height: 100%;
        position: relative;
        padding-bottom: 1rem;
    }
    .list ul {
        overflow: hidden;
        margin: 0 0.4rem;
    }
    .list ul li{
        margin-top: 0.15rem;
        overflow: hidden;
        background-color: #ffffff;
        border-radius: 0.1rem 0.1rem 0rem 0rem;
        border: 1px solid #E8E8E8;
    }
    .toptitle{
        width: 6.7rem;
        height: 0.6rem;
        background-color: #1DA3E8;
        border-radius: 0.1rem 0.1rem 0rem 0rem;
    }
    .toptitle img{
        width: 0.25rem;
        height: 0.3rem;
        margin-left: 0.2rem;
        margin-top: 0.15rem;
        display: block;
        float: left;
    }
    .toptitle span{
        line-height: 0.6rem;
        font-size: 0.28rem;
        display: block;
        float: left;
        margin-left: 0.1rem;
        font-weight: 500;
        color: #ffffff;
    }
    .title{
        font-size: 0.32rem;
        margin: 0.28rem 0;
        font-weight:bold;
        line-height: 0.5rem;
        display: block;
        text-align: left;
        padding: 0 0.3rem;
    }
    .type{
        margin-bottom: 0.28rem;
        overflow: hidden;
    }
    .type span{
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
        max-width: 6em;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
    }
    .type span:nth-of-type(1){
        margin-left: 0.28rem;
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
        font-size:0.28rem;
        font-family:PingFang SC;
        font-weight:500;
        color:rgba(171,171,171,1);
        line-height:0.38rem;
        margin-left: 1.48rem;
    }
    .noisearchlist span{
        font-size: 0.3rem;
        display: block;
        margin-top: 0.3rem;
        font-weight: bold;
        color: #169BD5;
    }
</style>