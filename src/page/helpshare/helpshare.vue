<template>
   <div class="share" :style="{height:sbheight+'px',background: 'url(' + sharebg + ') no-repeat','background-size':'100% 100%'}">
       <div class="hbimg">
           <img src="../../../public/image/sharehb.png" alt="">
           <span>
                <img class="imgzr" :src='(this.tximg==""?addimg:this.tximg)'   alt="">
            </span>
            <span>
                好友的助力
            </span>
            <span>
                <img   v-for="(item,index) in imgnum" :key="index" :src='(item.imgurl==""?addimg:item.imgurl)'   alt="">
            </span>
            <span>
                好友助力进度{{this.addnum}}/3
            </span>
            <img class="zhuli" src="../../../public/image/zhuli.png" alt="" @click="addzl()">
        </div>
        <van-popup v-model="gzh">
            <img class="gzhimg" src="../../../public/image/gzh.jpg" alt="">
            <van-divider />
            <p style="font-size:0.35rem">请先关注招标宝典公众号</p>
        </van-popup>
        
        <van-overlay :show="sxshow">
            <div class="wrapper" @click.stop>
                <img src="../../../public/image/sx.png" alt="">
                <span @click="goback">退出</span>
            </div>
        </van-overlay>
        
   </div>
</template>
 
<script>
import Vue from 'vue';
import sharebg from '../../../public/image/sharebg.png'
import addimg from '../../../public/image/addimg.png'
import { general } from '../../util/getInfos.js'
import { Toast } from 'vant';
Vue.use(Toast);
  import wx from 'weixin-js-sdk';
 
import { mapMutations } from 'vuex'
export default {
   data () {
      return {
          sharebg:sharebg,
          addimg:addimg,
          sbheight: document.documentElement.clientHeight,  //当前设备的高度
          tximg:"",
          imgnum:[
              { imgurl: '', value: 0},
              { imgurl: '', value: 2},
              { imgurl: '', value: 2},
              ],
          addnum:2,
          helpd:false,
          gzh:false,
          sxshow:false,
          ishelp:true,

      };
   },
   components: {},

   computed: {},

   methods: {
        ...mapMutations(['hide','show']),

        addzl:function(e){
            // if(e==""){
                // 判断是否关注公众号
                if(this.ishelp){
                    this.ishelp = false;
                
                    this.$dataApi({
                        url:"api/WechatPayment/IsUserSubscribe",
                        method:"GET",
                        data:{
                            OpenId:sessionStorage.getItem("openID")
                        }
                    }).then(res=>{
                        if(res.IsUserSubscribe){
                            this.imgnum.forEach(item=>{
                                if(item.OpenId==sessionStorage.getItem("openID")){
                                    this.helpd=true;
                                }
                            })
                            // console.log(this.helpd)
                            if(this.helpd){
                                Toast("您已助力!!")
                            }else {
                                if(general.getUrlParam("openID") == sessionStorage.getItem("openID")){
                                    Toast("请找别的小伙伴哦!");
                                    return false;
                                }else{
                                    this.FriendsHelp();
                                }
                                
                            };
                        }else {
                            this.gzh=true;
                            this.ishelp= true;
                        }
                    })
                }
        },

        // 获取已助力的头像信息
        GetAllHeadUrl:function(){
            console.log(general.getUrlParam("ID"))
            console.log(general.getUrlParam("openID"),)
             this.$dataApi({
                url:"api/UserSharing/GetAllHeadUrl",
                method:"POST",
                data:{
                    Uuid: general.getUrlParam("ID"),
                    OpenId:general.getUrlParam("openID"),
                }
            }).then(res=>{
                // console.log(res)
                this.imgnum=res.HeadingUrls;
                this.IsGetPoints=res.IsGetPoints;
                this.tximg=res.ShareHeadingUrls==null?"":res.ShareHeadingUrls;
                this.addnum=res.TotalCount;
            })
        },

        //助力过程
        FriendsHelp:function(){
             this.$dataApi({
                url:"api/UserSharing/FriendsHelp",
                method:"POST",
                data:{
                    Uuid:general.getUrlParam("ID"),
                    OpenId:sessionStorage.getItem("openID"),
                    HeadingUrl:sessionStorage.getItem("headimgurl")
                }
            }).then(res=>{
                if(res.Status==200){
                    Toast.success('助力成功');
                    this.GetAllHeadUrl();
                    this.ishelp = true;
                }else{
                    Toast.fail('助力失败');
                }
                
            })
        },

        //判断分享链接是否失效
        CheckUserSharingValid:function(){
            this.$dataApi({
                url:"api/UserSharing/CheckUserSharingValid",
                method:"GET",
                data:{
                    uuid:general.getUrlParam("ID"),
                    // uuid:321321321
                }
            }).then(res=>{
                if(res.Status!=200){
                    this.sxshow=true
                }else {
                    this.GetAllHeadUrl();
                }
                
            })
        },

        goback:function(){
            wx.closeWindow();
        },

        // 获取当前url个别参数
        getUrlParam:function(name) {
            var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
            var r = window.location.search.substr(1).match(reg);
            if (r != null) return decodeURIComponent(r[2]); return null;
        },

        //保存访问记录
        saveVisitRecord(){
            this.$dataApi({
                url:"api/Users/SaveVisitRecord",
                method:"POST",
                data:{
                    openid:general.getUrlParam("openID"),
                    Origin:1
                }
            }).then(res=>{
                sessionStorage.setItem('saveFWJL',1);
            })
        }
   },

   created:function(){
       this.hide();
       this.CheckUserSharingValid();
       this.saveVisitRecord();

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
    .zhuli{
        position: absolute;
        width: 1.19rem !important;
        height: 1.19rem !important;
        top: 75%;
        left: 38%;
    }
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
    .hbimg span{
        position: absolute;
        top: 0
    }
    .hbimg span img{
        width: 1rem;
        height: 1rem;
        border-radius: 30px
    }
    .hbimg span:nth-of-type(1){
        top: 0.67rem;
        right: 2.32rem
    }
    .hbimg span:nth-of-type(2){
        width: 1.2rem;
        font-size: 0.24rem;
        line-height: 0.36rem;
        right: 2.23rem;
        color: #078BC8;
        top: 1.7rem;
        font-weight: normal;
        font-family: Adobe Heiti Std;
    }
    .hbimg span:nth-of-type(3){
        width: 3.6rem;
        right: 0.92rem;
        top: 2.15rem
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
        height: 0.26rem;
        font-size: 0.26rem;
        font-family: Adobe Heiti Std;
        font-weight: normal;
        color: #666666;
        line-height: 0.36rem;
        top: 3.36rem;
        right: 1.7rem;
    }
    .gzhimg{
        width: 5rem;
    }
    .van-popup--center{
        top:50%
    }
    .van-divider{
        margin: 0
    }
    .wrapper img{
        width: 5.52rem;
        height: 6rem;
        position: absolute;
        top: 35%;
        left: 0.98rem
    }
    .wrapper span{
            position: absolute;
            top: 65%;
            height: 0.35rem;
            font-size: 0.36rem;
            font-family: Adobe Heiti Std;
            font-weight: normal;
            color: #FEFFFF;
            line-height: 0.54rem;
            width: 1.8rrem;
            width: 1.8rem;
            height: 0.54rem;
            border-radius: 30px;
            background-color: rgb(255, 131, 148);
            left: 2.86rem;
    }
</style>