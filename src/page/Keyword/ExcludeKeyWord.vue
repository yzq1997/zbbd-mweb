<template>
    <div class="box">
        <p class="p_title">关键字:{{keyWords}}</p>
        <p class="p_listO">设置排除关键词，包含这些关键词的信息将不会推送给您。请谨慎设置。</p>
        <p class="p_listO">注：只判断文章标题是否包含，不判断正文。不能输入空格。</p>
        <div class="main" v-for="(item,index) in list" :key="index">
            <span>排除词</span>
            <input type="text" placeholder="输入不希望接收的关键词" @keyup="item.key=item.key.replace(/\s+/g,'')" v-model="item.key" maxlength="10" >
            <i class="iconfont icon-lajixiang" @click="delExcludeKey(index)"></i>
        </div>

        <button class="btn" @click="addExcludeKey">+添加排除词</button>
        <button class="finbtn" @click="saveExcludeKey">保存信息</button>
    </div>
</template>

<script>
    import Vue from 'vue';
    import { Switch,Popup,Toast  } from 'vant';
    Vue.use(Switch).use(Popup).use(Toast );
    export default {
        data(){
            return {
                keyWords:'',
                list:[],
                ExcludeKey:'',  //排除关键词
                SubscriptionExcludeKeyword:0,  //允许添加的排除关键词个数
                RoleName:'',  //用户角色
            }
        },
        methods:{
            //添加排除词
            addExcludeKey(){
                // console.log(this.list);
                // console.log(this.SubscriptionExcludeKeyword);
                if(this.SubscriptionExcludeKeyword == 0){
                    this.list.push({key:''});
                }else{
                    if(this.list.length >= this.SubscriptionExcludeKeyword){
                        if(this.RoleName == '免费用户'){
                            Toast.fail('请前往首页进行注册');
                        }else if(this.RoleName == '注册用户'){
                            Toast.fail('已到达最大数量');
                        }else{
                            Toast.fail('权限不足');
                        }
                    }else{
                        this.list.push({key:''});
                    }
                }
            },

            //删除排除词
            delExcludeKey(index){
                this.list.splice(index,1);
                console.log(this.list);
            },

            //保存设置
            saveExcludeKey(){
                console.log(this.list);
                let ExcludeKeyWords = [];
                this.list.map((item,index)=>{
                    console.log(item);
                    if(item.key == ''){
                        // Toast.fail('请将信息填写完整');
                        // return false
                    }else{
                        ExcludeKeyWords.push(item.key)
                    }
                })
                sessionStorage.setItem('ExcludeKey',ExcludeKeyWords.toString());
                this.$router.go(-1)
            },

            //拿到用户角色（默认宝典）
            getUserRole(){
                let that = this;
                that.$dataApi({
                    url: "api/RoleManage/GetUserRoleByOpenId",
                    method: "GET",
                    data: {
                        openId:sessionStorage.getItem("openID"),
                    },
                }).then((res) => {
                    console.log(res);
                    that.SubscriptionExcludeKeyword = res.RoleManagement.SubscriptionExcludeKeyword;
                    that.RoleName = res.RoleManagement.RoleName;
                });
            },
        },
        created(){
            this.getUserRole();
            let keyword = sessionStorage.getItem('ExcludeKey');
            this.keyWords = sessionStorage.getItem('flagkeyword');
            if(keyword){
                this.ExcludeKey = keyword.split(",");
                console.log(this.ExcludeKey);
                for(let i = 0;i<=this.ExcludeKey.length-1;i++){
                    this.list.push({key:this.ExcludeKey[i]})
                }
                console.log(this.list);
            }else{
                this.list.push({key:''})
            }
        }
    }
</script>

<style lang="scss" scoped>
    .box{
        background: #F5F5F9;
        min-height: 100%;
        overflow: hidden;
        position: relative;
    }
    .p_title{
        margin: 0.2rem 0.2rem;
        text-align: left;
        font-size: 0.4rem
    }
    .p_listO{
        font-size: 0.3rem;
        text-align: left;
        margin: 0.2rem 0.2rem;
        color: #999;
    }
    .main{
        display: flex;
        align-items: center;
        margin-left: 0.2rem;
        margin-top: 0.5rem;
    }
    .main>span{
        font-size: 0.3rem;
    }
    .main>input{
        font-size: 0.3rem;
        margin-left: 0.2rem;
        margin-right: 0.2rem;
        width: 70%;
        border: none;
        height: 0.6rem;
        border-radius: 0.1rem;

    }
    .iconfont{
        font-size: 0.35rem
    }
    .btn{
        font-size: 0.2rem;
        background: #0493EA;
        border: none;
        width: 6rem;
        height: 0.7rem;
        color: #fff;
        font-size: 0.32rem;
        border-radius: 0.1rem;
        margin-bottom: 2rem
    }
    .finbtn{
        position: fixed;
        left: 0.75rem;
        bottom: 1.5rem;
        border: none;
        height: 0.8rem;
        background: #0493EA;
        border: none;
        width: 6rem;
        height: 0.7rem;
        color: #fff;
        font-size: 0.32rem;
        border-radius: 0.1rem;
    }
</style>