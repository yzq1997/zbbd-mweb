<template>
    <div class="box" >
        <div class="addkey">
            <button class="addbtn" @click="goadd()">添加关键词</button>
        </div>
        <div class="boxs">
            <!-- <div class="tc"></div> -->
            <div 
                class="keylist"
                v-for="(item,index) of keywords"
                :key="index"
            >
                <div class="top">
                    <span>关键词:</span>
                    <!-- {{item}} -->
                    <span><van-field placeholder="请输入关键词" maxlength="10" style="width:3.7rem" v-model="keywords[index]" /></span>
                    <span class="span" @click="del(item,index)">删除</span>
                </div>
            </div>
        </div>
        <!-- <div class="add" @click="goadd()"></div> -->
        <!-- <van-popup v-model="show">内容</van-popup> -->
        <van-dialog v-model="show" title="添加关键词" @confirm="confirm1" @cancel="cancel1" show-cancel-button>
            <van-field maxlength="10" v-model="value"  placeholder="请输入关键词" />
        </van-dialog>
        <div class="btn">
            <!-- <button class="btnqx" @click="back()">取消</button> -->
            <!-- <P class="newaddkey" @click="goadd()">新增关键词</P> -->
            <button class="btnqd" @click="goexport()">确定</button>
        </div>
    </div>
</template>

<script>
    import Vue from 'vue';
    import { Field,Button ,Dialog,Popup,Toast  } from 'vant';

    Vue.use(Field).use(Button ).use(Dialog).use(Popup).use(Toast );
    export default {
        components: {
            [Dialog.Component.name]: Dialog.Component,
        },
        data(){
            return {
                keywords:[],  //关键词列表
                show:false,   //弹出框是否显示
                value:"",    //输入框内容
            }
        },
        methods:{
            show(){
                this.isshow = false
            },
            goadd(){
                this.show = true
                sessionStorage.removeItem("cz")
            },
            confirm1(){
                if(this.value === "" || this.value.trim().length === 0){
                    Toast('请输入内容');
                }else{
                    if(this.keywords.indexOf(this.value) !== -1){
                        Toast('您已存在相同关键词');
                        this.value = ""
                    }else{
                        this.keywords.push(this.value)
                        this.value = ""
                    }
                }
            },
            cancel1(){
                this.show = false
            },
            del(e,i){
                if(this.keywords.indexOf(e) !== -1){
                    this.keywords.splice(i,1)
                }
            },
            goexport(){
                sessionStorage.setItem("exportKey",this.keywords)
                this.$router.push({ path: "/export"})
            },
            back(){
                this.$router.go(-1)
            }
        },
        created(){
            if(sessionStorage.getItem("zhongzhi") === 1){
                this.keywords = []
            }
            if(sessionStorage.getItem("cz" === 1)){
                this.keywords = []
            }
        },
        beforeRouteEnter(to, from, next) {
           next(vm => {
                if(from.path === "/export" && sessionStorage.getItem("cz") !== null){
                    vm.keywords = []
                }
            })
        },
        beforeRouteLeave (to, from, next) {
            sessionStorage.setItem("exportKey",this.keywords)
            
            next()
        }

    }
</script>

<style scoped>
    .box{
        height: 100%;
        background: #F0F0F0; 
        overflow: hidden;
    }
    .addkey{
        position: fixed;
        z-index: 100;
        width: 100%;
        height: 1rem;
        background: #fff;
    }
    .addbtn{
        position: absolute;
        font-size: 0.3rem;
        margin-left: 15%;
        margin-top: 5%;
        border-radius: 5px;
        background: #1890FF;
        border: 1px solid #1890FF;
        color: #fff;
    }
    .boxs{
        position: absolute;
        width: 100%;
        margin-top: 1rem;
        padding-top: 1.2rem;
        padding-bottom: 2.5rem;
        background: #F0F0F0;
    }
    .keylist{
        border-bottom: 0.2rem solid #F0F0F0;
        margin-left: 5%;
        width: 100%;
    }
    .top{
        background: #fff;
        display: flex;
        width: 90%;
        align-items: center;
        height: 44px;
        overflow: hidden;
        border-radius: 50px;
    }
    .top span{
        font-size: 16px;
        margin-left: 0.2rem;
        float: left;
    }
    .span{
        color: #32a5f1;
        border-left: 1px solid #bdbdc4;
        padding-left: 0.2rem;
    }
    .add{
        font-size: 0.1rem;
        position: fixed;
        top: 70%;
        left: 45%;
        z-index: 10;
        width: 1rem;
        height: 1rem;
        background: pink;
        background: url(../../../public/image/add.png) no-repeat;
        background-size: 100% 100%;
    }
    .btn{
        position: fixed;
        display: flex;
        flex-direction: column;
        align-items: center;
        width: 100%;
        height: 1.5rem;
        bottom: 1rem;
        background: #fff;
    }
    .newaddkey{
        font-size: 0.3rem;
        color: #1890FF;
        margin: 0;
    }
    .btnqd{
        font-size: 0.32rem;
        width: 5rem;
        height: 0.6rem;
        background: #1890FF;
        border: none;
        border-radius: 5px;
        color: #fff;
        margin-top: 0.4rem;
    }
    
</style>