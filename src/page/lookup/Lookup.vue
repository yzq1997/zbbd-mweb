<template>
    <div class="box">
        <!-- 顶部搜索框 -->
        <div class="ggg">
            <div class="search">
                <div class="goback" @click="goback()"></div>
                <van-dropdown-menu class="botBox">
                    <van-dropdown-item v-model="value1" :options="option1" @change="chang" @open="open"/>
                </van-dropdown-menu>
                <div class="search-imput">
                    <form action="javascript:return true" style="margin-bottom:25px;width:100%">
                        <input type="search" placeholder="输入“建筑工程”试试" class="input1" ref="searchs" v-model="inputValue" @keyup="searching"  />  
                    </form>
                </div>
                <div class="search-name" @click="gosearch()">
                    <span>搜索</span>
                </div>
            </div>
        </div>
        
        <div class="history">
            <p class="h-p seach">
                <span>搜索历史</span>
                <span class="delKey" @click="clearHis()">
                    <i class="iconfont icon-lajixiang"></i>
                </span>
            </p>
            <ul class="ul">
                <li class="li" @click="gohistroy(item.keyword)" v-for="(item,index) in historyword" :key="index">{{item.keyword}}</li>
            </ul>
            <p class="clearHistory" v-if="historyword.length == 0 ? true : false">暂无搜索历史</p>
        </div>
        <div class="faxian">
            <p class="h-p">搜索发现</p>
            <ul class="ul">
                <li class="li" @click="gohistroy(item.keyword)" v-for="(item,index) in hotsearch" :key="index">{{item.keyword}}</li>
            </ul>
        </div>
    </div>
</template>

<script>
    import { Dialog } from 'vant';
    import { mapMutations } from 'vuex'
    import "@/iconfont/iconfont.css";

    export default {
        data() {
            return {
                inputValue:"",
                historyword:[],
                docmHeight: document.documentElement.clientHeight,  //默认屏幕高度
                showHeight: document.documentElement.clientHeight,   //实时屏幕高度 window.screen.availHeight
                hotsearch:[],
                value1: 0,
                option1: [
                    { text: '标题匹配', value: 0 },
                    { text: '全文匹配', value: 1 },
                ],  //下拉框
                IsContext:false,  //标题匹配
            }
        },
        methods: {
            ...mapMutations(['hide','show']),
            gethistroywords:function(){
                this.dateshow=false;
                let that = this;
                that.$dataApi({
                    url:'api/Stat/PersonalSearchHistory',
                    method:'POST',
                    data:{
                        openid:sessionStorage.getItem("openID"),   
                        Source:1 
                    }
                }).then(response=>{ 
                    //   console.log(response);
                    this.historyword=response;
                })
                    .catch(function (error) {
                    console.log(error);
                });
            },

            goback(){
                this.$router.go(-1);
            },

            //搜索历史
            gohistroy(e){
                console.log(e);
                
                // return
                let that = this;
                that.$dataApi({
                    url:'api/Users/AddUserTriggerEvent',
                    method:'POST',
                    data:{
                        OpenId:sessionStorage.getItem("openID"),   
                        EventName:'搜索',
                        JudgeValue:0
                    }
                }).then(response=>{ 
                    //   console.log(response);
                    // this.historyword=response;
                });
                this.$router.push({
                    path:'/searchList',
                    query: {
                        searchvalue:e,
                        searchIsContext:this.IsContext
                    },
                });
                
                
            },

            //点击搜索
            gosearch(){
                let that = this;
                that.$dataApi({
                    url:'api/Users/AddUserTriggerEvent',
                    method:'POST',
                    data:{
                        OpenId:sessionStorage.getItem("openID"),   
                        EventName:'搜索',
                        JudgeValue:0
                    }
                }).then(response=>{ 
                    //   console.log(response);
                    // this.historyword=response;
                });
                this.$router.push({
                    path:'/searchList',
                    query: {
                        searchvalue:this.inputValue,
                        searchIsContext:this.IsContext
                    },
                });
              
            },

            searching(e){
                let that = this;
                if(e.keyCode == 13 || e.keyCode == 108){
                    that.$dataApi({
                        url:'api/Users/AddUserTriggerEvent',
                        method:'POST',
                        data:{
                            OpenId:sessionStorage.getItem("openID"),   
                            EventName:'搜索',
                            JudgeValue:0
                        }
                    }).then(response=>{ 
                        //   console.log(response);
                        // this.historyword=response;
                    });
                       

                    this.$router.push({
                    path:'/searchList',
                    query: {
                        searchvalue:this.inputValue,
                        },
                    })
                }   
            },

            clearHis(){
                Dialog.confirm({
                // title: '标题',
                message: '确定删除所有搜索历史么？',
                })
                .then(() => {
                    // on confirm
                    this.$dataApi({
                        url:'api/Stat/DeletePersonalHistory',
                        method:'POST',
                        data:{
                            OpenId:sessionStorage.getItem("openID"),   
                            Source:1 
                        }
                    }).then(response=>{ 
                        if(response.Status == 200){
                            this.historyword = []
                        }
                    })
                })
                .catch(() => {
                    // on cancel
                });
                console.log( this.historyword);
                
            },

            GetHotSearchKeyword:function(){
                this.$dataApi({
                url:'api/Stat/GetHotSearchKeyword',
                method:'GET',
                data:{
                    
                }
                }).then(response=>{
                    this.hotsearch=response;
                })
            },

            chang(index){
                console.log(index);
                if(index == 0){
                    this.IsContext = false;
                }else{
                    this.IsContext = true;
                }
            },

            open(){
                // console.log(1);
            }
        },

        created:function(){
            this.gethistroywords(),
            this.GetHotSearchKeyword();
            
            //防止在搜索页面直接点击tabbar组件(我的)进行跳转，导致搜索页面不进行从新加载导致的数据依旧，
            //所以在本页面进行一次刷新操作
            //在离开本页面时清空reload缓存
            if(sessionStorage.getItem('reload') == 'reload'){
                
            }else{
                sessionStorage.setItem('reload','reload');
                location.reload();
            }
        },

        beforeRouteEnter(to, from, next) {
           next(vm => {
                if(from.path === "/searchList"){
                    from.meta.keepAlive = false;
                }
           })
        },
        beforeRouteLeave (to, from, next) {
            this.show();
            sessionStorage.removeItem('reload')
            next()
        },
        mounted:function(){
            window.onresize = () => {
                return (() => {
                    this.showHeight = document.documentElement.clientHeight;
                })()
            };
        },
        watch:{
            showHeight (val) {
                if (this.docmHeight > val){
                    this.hide();
                    this.Show = false;
                    document.getElementsByClassName("tabbar")[0].style.display = "none";
                    // this.$refs.tabb.style.display = "none"
                } else if(this.docmHeight === val){
                    this.show();
                    this.Show = true;
                    document.getElementsByClassName("tabbar")[0].style.display = "block";
                    // this.$refs.tabb.style.display = "block"
                }
            }
        },
    }
</script>

<style scoped>
    .box{
        height: 100%;
        /* background: pink; */
    }
    .ggg{
        height: 1rem;
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
        width:4rem;
        height:0.64rem;
        position: relative;
        align-items: center;
        display: flex;
        justify-content: space-between;
        /* background:#FFF; */
        margin: 0.18rem 0rem;
        margin-left: 0.32rem;
        float: left;
    }
    .search-imput input{
        background: #FAFAFA;
        width:100%;
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

    .h-p{
        font-size: 16px;
        text-align: left;
        margin-left:0.5rem;
        margin-right: 0.5rem;
    }
    ul{
        display: flex;
        flex-wrap: wrap;
        /* background: pink; */
        /* width: 90%; */
        margin-left: 5%;
    }
    li{
        border: 1px solid rgb(185, 182, 182);
        border-radius: 5px;
        margin-right: 0.25rem;
        height:0.48rem;
        font-size: 0.24rem;
        line-height: 0.48rem;
        margin-bottom: 0.2rem;
        padding: 0 0.2rem;
        /* width: 14%; */
    }
    .clearHistory{
        font-size: 0.3rem;
        color: #999;
        text-align: center;
    }
    .delKey{
        /* background: pink; */
        width: 0.5rem;
        height: 0.5rem;
    }
    .delKey>i{
        display: flex;
        justify-content: center;
        align-items: center;
        width: 0.5rem;
        height: 0.5rem;
    }
    .seach{
        display: flex;
        justify-content: space-between;
    }
    .faxian{
        margin-top: 1rem;
    }
    .li{
        background: rgb(248, 246, 246);
        border: 1px solid rgb(248, 246, 246);
        color: rgb(129, 125, 125);
        height: auto;
    }
    .botBox{
        background: #F0F0F0;
        width: 1.8rem;
    }
    
    .van-dropdown-menu >>> .van-dropdown-menu__bar{
        box-shadow: none;
        background: none;
        height: 1rem;
    }

</style>