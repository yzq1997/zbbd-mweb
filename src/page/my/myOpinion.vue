<template>
  <div class="box"  :style="{height:Height}">
    <van-tabs  @click="goOpinion()" class="tab" >
      <van-tab title="意见反馈" class="aaaa">
        <van-form @submit="onSubmit">
          <van-field class="fie" clearable rows='10' maxlength="200" show-word-limit type="textarea" v-model="opinion" name="opinion" placeholder="请输入反馈意见" />
          <div style="margin: 16px;">
            <van-button round block type="info" native-type="submit">提交</van-button>
          </div>
        </van-form>
      </van-tab>
      <van-tab title="我的反馈">
        <ul>
          <li v-for=" (item,index) of arr" :key="index">
            <div class="tijiao">
                <span class="xinxi" style="color:#333"><span style="color:#e58890">Q{{index+1 }}:</span> {{item.Content}}</span>
                <!-- <span class="ytj" v-if="item.ReplyState === 1?false:true">已提交</span> -->
                <span class="yjd">{{item.CreateDate.slice(0,10)}}</span>
            </div>
            <div class="jieda" v-if="item.ReplyContent?true:false">
              <span class="xinxi2"><span style="color:#169BD5">A:</span>{{item.ReplyContent}}</span>
              <span class="jiedaP">{{item.ModifyDate.slice(0,10)}}</span>
            </div>
          </li>
        </ul>
      </van-tab>
    </van-tabs>
  </div>
</template>

<script>
import Vue from "vue";
import { NavBar, Tab, Tabs, Form, Toast } from "vant";
Vue.use(Tab);
Vue.use(Tabs);
Vue.use(Form);
Vue.use(Toast);
export default {
  data() {
    return {
      isshow:true,
      num:1,
      opinion: "",
      arr: [],
      Height:window.screen.height +"px",
      CreateDate:"",
      ModifyDate:""
    };
  },
  methods: {

    //请求反馈信息
    goOpinion() {
      let OId = sessionStorage.getItem("openID");
      this.$dataApi({
        url:"api/Users/GetOpitionByOpenID",
        method:'POST',
        data:{
          OpenId: sessionStorage.getItem("openID")
        }
      })
      .then(res => {
        this.arr = res.data;
      });
    },
    //返回上一页
    onClickLeft() {
      this.$router.go(-1);
    },
    onClickRight() {},
    //提交事件
    onSubmit(values) {
      this.num =this.num+1
      if ((values.opinion.length === 0) || (values.opinion.trim().length === 0)) {
        Toast("请输入反馈意见");
      } else if (values.opinion.length < 200) {
        let OId = sessionStorage.getItem("openID");
        let name = sessionStorage.getItem("NickName");
        let url = sessionStorage.getItem("headimgurl");
        this.$dataApi({
          url:"api/Users/SaveOpinion",
          method:"POST",
          data:{
            OpenId: OId,
            Opition: values.opinion,
            NickName: name,
            WechatHead: url,
            Source:1
          }
        })
          .then(res => {
            // console.log(res);
          });
          this.opinion=''
        Toast("您的宝贵意见我们已经收到，谢谢!");
      } else {
        Toast("最多只能输入200个字，请重新输入");
      }

      // OpenId: 4546565465,   //假数据
      // Opition: values.opinion,
      // NickName: "name",
      // WechatHead:"https://ss2.bdstatic.com/70cFvnSh_Q1YnxGkpoWK1HF6hhy/it/u=2889084853,157210381&fm=26&gp=0.jpg"
    }
  },
  created(){
    let OId = sessionStorage.getItem("openID");
        this.$dataApi({
          url:"api/Users/GetOpitionByOpenID",
          method:"POST",
          data:{
            OpenId: OId
          }
        })
        .then(res => {
            this.arr = res.data;
        });
  }
};
</script>

<style scoped>

van-tab{
  margin-top: -1rem !important;
}
.box {
  height: 100%;
  width: 100%;
  overflow: auto;
  position: relative;
  background: rgb(235, 76, 49);
}
.tab {
  height: 100%;
  width: 100%;
  position: fixed;
}
van-tab{
  position: fixed;
}
.fie {
  padding: 0.1rem;
  margin-left: 5%;
  margin-top: 0.5rem;
  border: 1px solid rgb(231, 229, 229);
  height: 5.5rem; 
  width: 90%;
  min-height: 200px !important;
  /* word-break: break-all; */
  /* white-space: pre-wrap; */
}

li {
  margin-top: 0.1rem;
  margin-left: 4%;
  width: 90%;
  height: 100%;
  font-size: 0.4rem;
  word-break: break-all;
  line-height: 0.7rem;
  padding: 1%;
  color: rgb(150, 146, 146);
  border-radius: 0.2rem;
  text-align: left;
  background: #fff;
}
.tijiao{
  display: flex;
  align-items: baseline;
}
.xinxi{
  width: 80%;
  font-size: 0.3rem;
}
.jieda{
  border-top: 1px dashed rgb(199, 193, 193);
  display: flex;
  align-items: baseline;
}
.ytj{
  float: right;
  background: #EBB100;
  border: 1px solid rgb(224, 220, 220);
  border-radius: 5px;
  text-align: center;
  height: 0.4rem;
  width: 1rem;
  font-size: 0.24rem;
  line-height: 0.4rem;
  color: #fff;
}
.yjd{
  float: right;
  /* background: #169BD5; */
  /* border: 1px solid rgb(224, 220, 220); */
  /* border-radius: 5px; */
   text-align: center;
  height: 0.4rem;
  /* width: 1rem; */
  font-size: 0.24rem;
  line-height: 0.4rem;
  /* color: #ff; */
}
.van-tabs {
  background: #f5f5f9;
  height: 100%;
}


.xinxi2{
  width: 80%;
  font-size: 0.28rem;
}
.jiedaP{
  padding-right: 0.1rem;
  font-size: 0.24rem;
  text-align: right;
}
</style>