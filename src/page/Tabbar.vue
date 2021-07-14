<template>
    <div class="box">
        <van-tabbar class="tabbar" ref="tabs" v-if="show"  v-model="active" >
            <van-tabbar-item   @click="gohome"  icon="wap-home-o">
                <!-- 首页 -->
                <span>首页</span>
                <template #icon="props">
                    <img v-if="!props.active" src="../../public/image/home.png" />
                    <img v-if="props.active" src="../../public/image/home1.png" />
                </template>

            </van-tabbar-item>

            <van-tabbar-item @click="godingyue()">
                <span>订阅</span>
                <template #icon="props">
                    <img v-if="!props.active" src="../../public/image/dy.png" />
                    <img v-if="props.active" src="../../public/image/dy1.png" />
                </template>
            </van-tabbar-item>

            <van-tabbar-item  @click="gomy()" icon="contact">
                <span>我的</span>
                <template #icon="props">
                    <img v-if="!props.active" src="../../public/image/my.png" />
                    <img v-if="props.active" src="../../public/image/my1.png" />
                </template>
            </van-tabbar-item>
        </van-tabbar>
    </div>
</template>

<script>
import { Tabbar, TabbarItem } from 'vant';
import Vue from 'vue';
import {mapState,mapActions,mapMutations} from "vuex"  //辅助函数
Vue.use(Tabbar);
Vue.use(TabbarItem);

export default {
    computed: {
        // ...mapState(["active"]),
        active:{
            get(){
                return this.$store.state.active
            },
            set(){
                return this.$store.state.active
            }
        },
    },
    data(){
        return {
            docmHeight: document.documentElement.clientHeight,  //默认屏幕高度
            showHeight: document.documentElement.clientHeight,   //实时屏幕高度
            show:true,
        }
    },
    
    methods: {
        // ...mapMutations(['activeOne','activeTwo','activeThr']),
        gohome(){
            this.$router.push('/index');
            
        },
        godingyue(){
            // this.$router.push('/keyWords');
            this.$router.push('/Keyinfolist')
        },
        gomy(){
            this.$router.push('/my')
          
        }
    },
    watch:{
        showHeight (val) {
            if (this.docmHeight > val){
                this.show = false;
            } else if(this.docmHeight === val){
                this.show = true;
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

<style scoped>
   .van-tabbar-item__icon img{
       margin: 0 auto;
       margin-top: 0.1rem;
   }
   .box{
       height: 1rem;
   }
   .tabbar{
       height: 1rem;
       z-index: 99999 !important;
   }
</style>