<template>
  <div id="app">
      <keep-alive>
            <!-- 如果当前打开页面的路由中 keepAlive: true （开启了缓存时） -->
            <router-view v-if="$route.meta.keepAlive"></router-view>
      </keep-alive>

      <!-- 如果当前打开页面的路由中 没有 或者为 keepAlive: false （关闭缓存时[默认就是false]） -->
      <router-view v-if="!$route.meta.keepAlive"></router-view>
      <Tabbar ref="tabb" class="tabbar" v-if="isTabbarShow"></Tabbar>
  </div>
</template>

<script>
import index from './page/index.vue'
import Tabbar from './page/Tabbar'
import {mapState,mapMutations} from "vuex"  //辅助函数


export default {
  name: 'App',
  components: {
     index,
     Tabbar,
  },
  data() {
    return {
      docmHeight: document.documentElement.clientHeight,  //默认屏幕高度
      showHeight: document.documentElement.clientHeight,   //实时屏幕高度 window.screen.availHeight
      Show:true,
    }
  },
  computed: {
    ...mapState(["isTabbarShow"])
  },
  
  methods:{
    ...mapMutations(['hide','show']),
  },
  watch:{
      showHeight (val) {
          if (this.docmHeight > val){
              this.Show = false;
          } else if(this.docmHeight === val){
              this.Show = true;
          }
      }
    },
    mounted:function(){
      window.onresize = () => {
          return (() => {
              this.showHeight = document.documentElement.clientHeight;
          })()
      };

    },
    
}
</script>

<style>
html{
  height: 100%;
}
body{
  height: 100%;
}
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  height: 100%;
  /* overflow: hidden; */
 
}
 .van-dropdown-menu__bar{
        width: 100% !important;   
  }
  .van-tabs__wrap{
      width:100% !important;
      position:fixed !important;
      z-index: 500;
      border-radius: 0.3rem;
  }
  /* .van-index-bar{
    margin-top: 0.5rem;
  } */
  .van-index-anchor{
    top: 5%;
  }
  .van-tabs__content{
    margin-top: 44px;
  }
  .van-cell__title{
    text-align: left;
  }
  .van-collapse-item__wrapper{
    text-align: left;
  }
  .van-sidebar-item__info{
        background-color: #4CA8F8 !important;
    }
  .van-cell__title{
      font-size: 0.3rem !important;
  }
</style>
