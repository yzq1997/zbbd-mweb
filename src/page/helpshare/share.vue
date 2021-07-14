<template>
   <div class="share" :style="{height:sbheight+'px',background: 'url(' + sharebg + ') no-repeat','background-size':'100% 100%'}">
       <div class="hbimg">
            <img src="../../../public/image/share.png" alt="">
            <span class="span1">
                 有效期至{{this.nowtime}}
            </span>
            <span v-if="this.addnum<3" class="span2">
            <!-- <span v-if="false" class="span2"> -->
                还需{{3-this.addnum}}个好友助力
            </span>
            <span v-if="this.addnum==3" class="span2">
            <!-- <span v-if="true" class="span2"> -->
                好友助力已完成
            </span>
            <span class="span3">
                <img v-for="(item,index) in imgnum" :key="index" :src='(item.imgurl==""?addimg:item.imgurl)'  alt="">
            </span>
            <span @click="invite" class="span4">
                邀请好友帮忙助力
            </span>
            <img class="l" src="../../../public/image/l.png" alt="" @click="GetHelpPoints">
       </div>
        <van-overlay :show="showShare" @click="showShare = false">
            <div class="wrapper" @click.stop>
                <img src="../../../public/image/yd.png"/> 
                <p>点击右上角按钮，分享给好友</p>
            </div>
        </van-overlay>
   </div>
</template>
 
<script>
import Vue from 'vue';
import sharebg from '../../../public/image/sharebg.png'
import { general } from '../../util/getInfos.js'
import addimg from '../../../public/image/addimg.png'
import { mapMutations } from 'vuex'
import { Slider, Toast } from 'vant';
import Axios from 'axios'
Vue.use(Toast);
import wx from 'weixin-js-sdk';
export default {
    data () {
        return {
            sharebg:sharebg,
            addimg:addimg,
            sbheight: document.documentElement.clientHeight,  //当前设备的高度
            tximg:"https://thirdwx.qlogo.cn/mmopen/vi_32/s4KGpg8neZ0aZR6pk3yK1Bz7zvvEkphXotkg5Ef57J5WkV9hYAsg8piaATRHhjnC3K5b7adO41zpJTYs5OicFzxg/132",
            imgnum:[
                { imgurl: '', value: 0,openID:''},
                { imgurl: '', value: 1,openID:''},
                { imgurl: '', value: 2,openID:''},
            ],
            addnum:0,
            nowtime:"",
            options: [
                { name: '微信', icon: 'wechat' },
                { name: '朋友圈', icon: '../../../public/image/pyq.png' },
            ],
            showShare:false,
            ID:"",
            IsGetPoints:true,  //判断是否未领取
            nikeName:'',
        };
   },
   components: {},

   computed: {},

   methods: {
        ...mapMutations(['hide','show']),

        // 分享完成插入记录
        CheckUserSharingValid:function(){
            // alert(this.ID)
            this.$dataApi({
                url:"api/UserSharing/CheckUserSharingValid",
                method:"POST",
                data:{
                    Uuid: sessionStorage.getItem("ID"),
                    OpenId:sessionStorage.getItem("openID")
                }
            }).then(res=>{
                // alert(res)
                if(res.Status==200){
                    Toast.success("分享完成")
                }else {
                    Toast.fail("分享插入失败")
                }
            })
        },

        invite:function(){
            this.showShare=true
        },

        onSelect:function(option){
            this.showShare = false;
            console.log(option)
        },

        // 重写localStorage相关方法
        localStorageSet:function (name, data, expire = new Date().getTime() + expire * 60 * 60 * 1000) {
            const obj = {
                data,
                expire
            };
            localStorage.setItem(name, JSON.stringify(obj));
        },

        localStorageGet:function (name) {
            const storage = localStorage.getItem(name);
            const time = new Date().getTime();

            let result = {};
            if (storage) {
                const obj = JSON.parse(storage);
                if (time < obj.expire) {
                result = obj.data;
                } else {
                localStorage.removeItem(name);
                }
            }
            return result;
        },

        // 获取已助力的头像信息
        GetAllHeadUrl:function(){
            console.log(this.localStorageGet("ID"))
             this.$dataApi({
                url:"api/UserSharing/GetAllHeadUrl",
                method:"POST",
                data:{
                    Uuid:this.ID,
                    OpenId:sessionStorage.getItem("openID")
                }
            }).then(res=>{
                console.log(res)
                if(res.Status==200){
                    this.imgnum=res.HeadingUrls;
                    this.IsGetPoints=res.IsGetPoints;
                    this.addnum=res.TotalCount
                }
                
            })
        },

        GetHelpPoints:function(){
            if(this.addnum==3){
                if(this.IsGetPoints){
                    this.$dataApi({
                        url:"api/UserSharing/GetHelpPoints",
                        method:"POST",
                        data:{
                            Uuid:this.ID,
                            OpenId:sessionStorage.getItem("openID"),
                            HeadingUrl:sessionStorage.getItem("headimgurl")
                        }
                    }).then(res=>{
                        if(res.Status==200){
                            // this.imgnum=res.HeadingUrls;
                            // this.IsGetPoints=res.IsGetPoints;
                            // this.addnum=res.TotalCount
                            Toast.success("领取成功")
                            this.IsGetPoints = false;
                        }
                        
                    })
                }else {
                    Toast.fail("当日积分已领取,明天再来吧!!")
                }
            }else {
                Toast.fail("当前助力人员未满,请加油哦")
            }
             
        },
   },

    mounted:function(){

        this.ID=sessionStorage.getItem("ID")
        //得到参数
        this.nikeName = sessionStorage.getItem("NickName")
        var appId = 'wx9cec35e64dce69fc';
        var link=window.location.href.replace("share","helpshare")+'?'+'openID='+sessionStorage.getItem("openID")+'&'+'ID='+sessionStorage.getItem("ID") +'&'+'openID='+sessionStorage.getItem("openID");
        sessionStorage.setItem("shareurl",link)
        //配置自定义分享内容
        window.share_config = {
            share: {
                imgUrl: 'http://weixin.jshcsoft.com/biddingbook/mweb/static/img/logo.8744cdb.png', // 这里是需要展示的图标
                desc: '全国招标信息免费看,实时推送',
                title: `您的好友${this.nikeName}向您推荐了招标宝典`, // 这是分享展示卡片的标题
                link: link, // 这里是分享的网址
                success: function(rr) {
                        Axios.post('https://weixin.jshcsoft.com/biddingbook/api/api/UserSharing/InsertSharerInformation', {
                                Uuid: sessionStorage.getItem("ID"),
                                OpenId:sessionStorage.getItem("openID"),
                                HeadingUrl:sessionStorage.getItem("headimgurl")
                        }).then(res=>{  
                            if(JSON.parse(res).Status==200){
                                Toast.success("分享完成")
                            }else {
                                Toast.fail("分享插入失败")
                            }
                        })
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
 

   created:function(){
        this.hide();
        this.ID=sessionStorage.getItem("ID");

        var todayYear=(new Date()).getFullYear();
        var todayMonth=(new Date()).getMonth();
        var todayDay=(new Date()).getDate();
        var todayTime=(new Date(todayYear,todayMonth,todayDay,'23','59','59')).getTime();//获取当前最后时间戳

        this.nowtime=general.timeFormat(todayTime)
        this.GetAllHeadUrl();
    },

    beforeRouteLeave(to, from, next) {
        if(to.path !==''){
            this.show()
        }
        next()
    },
}
</script>
<style  scoped>
    .share{
        background-color: rgb(0, 93, 171)
    }
    .imgbg{
        width: 100%;
    }   
    .hbimg {
        position: relative;
        width: 5.56rem;
        height: 5.45rem;
       top: 50%;
        left: 0.97rem;
    }
    .hbimg img{
        height: 5.56rem;
        width: 5.45rem;
    }
    .hbimg .l{
        width: 1.2rem;
        height: 1.2rem;
        position: absolute;
        top: 4.02rem;
        left: 2.12rem
    }
    .hbimg span{
        position: absolute;
        top: 0
    }
    .hbimg span img{
        width: 1rem;
        height: 1rem;
        border-radius: 30px
    }
    .hbimg .span1{
        top: 0.67rem;
        right: 0.7rem;
        width: 4.24rem;
        font-size: 0.24rem;
        font-family: Adobe Heiti Std;
        font-weight: normal;
        color: #666666;
        line-height: 0.25rem;
    }
    .hbimg .span2{
        width: 2.93rem;
        font-size: 0.26rem;
        font-family: Adobe Heiti Std;
        font-weight: normal;
        color: #078BC8;
        line-height: 0.36rem;
        top:1.1rem;
        right: 1.3rem
    }
    .hbimg span:nth-of-type(3){
        width: 3.6rem;
        right: 0.92rem;
        top: 1.6rem
    }
    .hbimg span:nth-of-type(3) img{
        width: 1rem;
        height: 1rem;
        float: left;
        margin-left: 0.3rem
    }
    .hbimg span:nth-of-type(3) img:first-of-type{
        margin-left: 0
    }
    .hbimg span:nth-of-type(4){
        width: 3rem;
        height: 0.54rem;
        font-size: 0.26rem;
        font-family: Adobe Heiti Std;
        font-weight: normal;
        color: #FFFFFF;
        line-height: 0.54rem;
        top: 2.94rem;
        right: 1.22rem;
        background: linear-gradient(-90deg, #18A2F3, #80DDFF);
        border-radius: 30px
    }
    .wrapper img{
        height: 5.3rem;
        width: 4.5rem;
        position: relative;
        left: 1rem;
    }
    .wrapper p{
        color: #FFFFFF;
        font-size: 22px;
    }

</style>