<template>
  <div class="box">
    <!-- 顶部 -->
    <van-nav-bar
      class="header"
      title="我的足迹"
      right-text="按钮"
      @click-left="onClickLeft"
      @click-right="onClickRight"
    >
      <template #right >
        <van-icon v-if="cancel" name="delete" size="22" />
        <van-icon v-if="!cancel" size="22" ><span class="quxiao">完成</span></van-icon>
      </template>
      <!-- <template #right >
        <van-icon v-if="false" size="18" >取消</van-icon>
      </template> -->
    </van-nav-bar>
    <p class="np">只保留近100条数据</p>

    <!-- 主体内容 -->
    <div class="search-list">
        <div ref="List">
          <div v-for="(item,index) in list" :key="index" class="search-info">
            <!-- 复选框 -->
            <div v-if="isshow" class="fxk">
              <van-checkbox  v-model="list[index].OrderIndex" @click="check(item)"></van-checkbox>
            </div>

            
            <!-- 内容 -->
            <div>
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
        </div>
    </div>

    <!-- 底部 -->
    <div class="foot" v-if="isshow">
      <van-checkbox v-model="checked" @click="quanxuan()" >全选</van-checkbox>
      <van-button type="danger" size="small" @click="del()" class="btn">删除</van-button>
    </div>
  </div>
</template>

<script>
import Vue from "vue";
import { NavBar,Checkbox ,Button,CheckboxGroup,Toast} from "vant";
Vue.use(Checkbox).use(Button).use(CheckboxGroup ).use(Toast);
export default {
  data(){
    return {
      checked:false,  //全选按钮的状态
      isshow:false,   //复选框是否显示
      msg:'',
      list:[],   //请求回来的全部数据
      time:'',
      idArr:[],  //要删除的数据
      delAll:0,  // 是否删除全部数据
      cancel:true
    }
  },
  methods: {
    //全选
    quanxuan(){
      if(this.checked){
        this.idArr = []
        this.list.map(item=>{
          item.OrderIndex = true
          this.idArr.push(item.id)
        })
        this.delAll = 1
      }else{
        this.idArr = []
        this.list.map(item=>{
          item.OrderIndex = false
        })
        this.delAll = 0
      }
    },
    //删除按钮
    del(){
      // if(!this.isshow){
      //   this.isshow = true
      // }else{
      //   this.isshow = false
      // }
      if(this.idArr.length === 0 ){
        Toast('请选择要删除的足迹')
      }else{
        this.$dataApi({
          url:'api/Users/DeleteMyTrackByOpenid',
          method:'POST',
          data:{
            OpenId: sessionStorage.getItem("openID"),
            IsDeleteAll:this.delAll,
            IdList:this.idArr,
            Source:1
          }
        }).then(res=>{
          this.qingqiushuju()
          Toast('删除成功')
        })
      }

    },
    //每个复选框点击事件
    check(e){
      if(!this.idArr.includes(e.id)){
        this.idArr.push(e.id)
      }else{
        let ind = this.idArr.indexOf(e.id)
        this.idArr.splice(ind,1)
      }
      if(this.idArr.length === this.list.length){
        this.checked = true
        this.delAll = 1
      }else{
        this.checked = false
        this.delAll = 0
      }
    },
    onClickLeft() {
      this.$router.go(-1);
    },
    onClickRight() {
      if(!this.isshow){
        this.isshow = true
      }else{
        this.isshow = false
      }
      
      if(this.cancel){
        this.cancel = false
      }else{
        this.cancel = true
        this.checked = false
        this.idArr = []
        this.list.map(item=>{
          item.OrderIndex = false
        })
      }
    },
    content:function(e){
        sessionStorage.setItem("sharetitle",e.oldtitle)
        window.removeEventListener('scroll',  this.getScroll);
            this.$dataApi({
              method:"POST",
              url:'api/Users/CheckIsConcernProject',
              data:{
                OpenId:sessionStorage.getItem('openID'),
                id:e.id,
                Source:1
              }
           }).then(res=>{
              this.msg = res.Msg
              //是否被关注
            let a = e.ZBUrl+`?IsConcerned=${this.msg}&id=${e.id}&openID=${sessionStorage.getItem('openID')}&Source=1`;
            sessionStorage.setItem("url",a)
            this.$router.push({
              path:'/iframe',
              query: {
                  ZBUrl:a,
                  id:e.id
                },
              })
           })

    },
    //请求数据
    qingqiushuju(){
      let OId = sessionStorage.getItem("openID");
      this.$dataApi({
          url:'api/Users/GetTracksByOpenID',
          method:'POST',
          data:{
            OpenId: sessionStorage.getItem("openID"),
            Source:1
          }
        })
        .then(res => {
          this.list = res;
          this.list.forEach(item=>{
            item.GGType=item.FormatGGType;

            let day2 = new Date();
            day2.setTime(day2.getTime());
            let nowdate= day2.getFullYear()+"-" + ((day2.getMonth()+1)<10 ? "0"+(day2.getMonth()+1):(day2.getMonth()+1)) + "-" + (day2.getDate() < 10 ? "0"+day2.getDate():day2.getDate());
            
          // item.GGType=item.FormatGGType;
          let date= item.JoinDate.replace(new RegExp("-","gm"),"/");
          let EndTime =(new Date(date)).getTime(); //获取抓取时间的秒数
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
      });
    }
  },
  created() {
    this.qingqiushuju()

  }
};
</script>

<style scoped>
  .box{
    width: 100%;
    margin-top: 0.9rem;
    position: relative;
    overflow: hidden;
  }
  .header{
    position: fixed;
    margin-top: -0.9rem;
    width: 100%;
  }
  .quxiao{
    font-size: 16px;
  }
  .np{
    font-size: 12px;
    width: 100%;
    text-align: center;
    margin-top: -0.35rem;
    /* margin-left: 36%; */
    text-align: center;
    position: fixed;
    color: rgb(184, 179, 179);
    z-index: 20;
  }
  .fxk{
    /* background: pink; */
    margin-left: 0.2rem;
    display: flex;
    align-items: center;
  }
  .search-info{
    display: flex;
  }
  .search-list{
     height: auto;
     width: 100%;
     /* margin-top: -1.5rem; */
     margin: 0 auto;
   }
   .search-split{
     width:7.5rem;
     height:0.16rem;
     background:rgba(242,242,242,1);
   }
   .search-title{
      width:6.2rem;
      margin-left: 0.5rem;
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
     width:7.1rem;
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
   .infotyle span:nth-of-type(1){
     background: #579ce9;
     color:#f1f4fb;
   }
    .infotyle span:nth-of-type(2){
      background: #ecfdf7;
     color:#6da88a;
   }
    .infotyle span:nth-of-type(3){
      background: #fcf3f4;
     color:#e58890;
   }
   .foot{
     font-size: 12px;
     position: fixed;
     padding-left:0.2rem ;
     /* padding-right: 0.5rem; */
     display: flex;
     /* justify-content: space-between; */
     align-items: center;
     height: 2rem;
     width: 100%;
     bottom:1rem;
     background:#fff;
   }
   .btn{
     margin: 0 auto;
     height: 0.7rem;
     line-height: 0.7rem;
     text-align: center;
     width: 20%;
     margin-left: 55%;
   }
</style>