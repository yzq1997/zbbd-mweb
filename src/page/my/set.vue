<template>
  <div class="box">

    <!-- 主体 -->
    <div class="main"  @click="go()" v-show="show">
      <i class="iconfont icon-bianji"></i>
      编辑资料
      <span class="you">
        <i  class="iconfont icon-iconfontjiantou5"></i>
      </span>
    </div>
    <div class="main"  @click="tuisong()">
      <i class="iconfont icon-shangchuan"></i>
      推送设置
      <span class="you">
        <i class="iconfont icon-iconfontjiantou5"></i>
      </span>
    </div>
  </div>
</template>

<script>
import Vue from "vue";
import { NavBar } from "vant";
export default {
  data(){
    return {
      show:true
    }
  },
  methods: {
    // onClickLeft() {
    //   this.$router.go(-1);
    // },
    // onClickRight() {},
    go(){
      this.$router.push({path:'/business',query:{from:'setPage'}})
    },
    tuisong(){
      this.$router.push({path:'/push'})
    }
  },
  created() {
    //获取用户信息
      this.$dataApi({
        url:"api/Users/GetUsers",
        method:"POST",
        data:{
          OpenID: sessionStorage.getItem("openID"),
          IsPage:1,
          Source:1
        }
      })
      .then(res => {
        console.log(res);
        if(res.Rows.length === 0){
            this.show = false;
        }else{
          if(res.Rows[0].IsMember === 1){
             this.show = true;
          }else{
            this.show = false;
          }
        }
      });
  },
};
</script>

<style scoped>
    .main{
        border-radius: 0.2rem;
        font-size: 0.3rem;
        border-bottom: 1px solid rgb(243, 237, 237);
        height: 1rem;
        line-height: 1rem;
        text-align: left;
        padding-left: 0.5rem;
        background: #fff;
    }
    .you{
      margin-left: 60%;
    }
</style>