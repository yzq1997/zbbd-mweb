<template>
  <div class="banner">
        <van-swipe class="my-swipe"  :loop="false"  indicator-color="white" @change="onChange" >
            <van-swipe-item><img style="width:100%;height:100%"  src="../../../public/image/yd1.png" alt="">
                <div class="btn" @click="clickSwiper()">
                    立即体验
                </div>
            </van-swipe-item>
            <van-swipe-item><img style="width:100%;height:100%"  src="../../../public/image/yd2.png" alt="">
            <!-- 3213213213 -->
                <div class="btn" @click="clickSwiper()">
                    立即体验
                </div>
            </van-swipe-item>
            <van-swipe-item><img style="width:100%;height:100%"  src="../../../public/image/yd3.png" alt="">
                <div class="btn" @click="clickSwiper()">
                    立即体验
                </div>
            </van-swipe-item>
        </van-swipe>
    </div>
</template>

<script type="text/javascript">
import { mapMutations } from 'vuex'
 
export default {
    data() {
        return {
            barlist:[1,2,3],
            current:0,
            aa:321
        }
    },

    components: {},

    created:function(){
        this.hide()
    },

    mounted:function(){
        // console.log(document.getElementsByClassName("van-swipe__indicator"))
    },

    methods: {
         ...mapMutations(['hide','show']),
         
        onChange:function(index){
            this.current = index;
        },

        clickSwiper:function(){
            this.$router.push({ path: "/index"}) 
        }
    },
}
</script>

<style  scoped>
.banner{
    height: 100%;
    width: 100%;
    position: absolute;
}
.van-swipe{
    width: 100%;
    height: 100%;
}
.van-swipe i{
    width: 25px !important;
    height: 8px !important;
    border-radius: 10% !important;
}

.van-swipe__indicators{
    bottom:14px !important;
}
.van-swipe__indicators i{
   width: 25px !important;
    height: 8px !important;
    border-radius: 10% ;
    background-color: #ebedf0;
    border-radius: 100%;
    opacity: 0.3;
    -webkit-transition: opacity 0.2s, background-color 0.2s;
    transition: opacity 0.2s, background-color 0.2s;
}
.van-swipe__indicators i:not(:last-child){
   margin-right: 10px !important;
}
.active{
     background-color:#FFFFFF;
}
.btn{
    border: 0.05rem solid #5E89EF;
    width: 3.8rem;
    height: 0.8rem;
    line-height: 0.8rem;
    border-radius: 50px;
    text-align: center;
    position: absolute;
    bottom: 0.68rem;
    font-size: 0.44rem;
    color: #1A55E1;
    left: 1.85rem;
}
 
 
</style>
