<template>
    <div class="login">
        <div :style="{'background':'url('+bg+')'}"  class="bg"></div>
        <div class="form">
            <span>
                <div class="input">
                    <img src="../../../public/image/nm.png" alt="" srcset="">
                    <van-field type="digit" v-model="zhnum" placeholder="请输入账号" />
                </div>
            </span>
            <span>
                <div class="input">
                    <img src="../../../public/image/pw.png" alt="" srcset="">
                    <van-field type="password" v-model="passwordnum"  placeholder="请输入密码" />
                </div>
            </span>
            <p v-if='message!=""'>{{message}}</p>
            <p @click="getpassword">忘记密码?</p>
            <button @click="gologin">登录</button>
        </div>
        <img class="img" src="../../../public/image/logo.png" alt="" srcset="">
        
        <van-popup v-model="showm" closeable round @close="remove">
            <span class="title">重置密码</span>
                <van-cell-group>
                    <van-field v-model="tel" label="手机号码" placeholder="请输入手机号码" />
                    <van-field v-model="password" label="密码" placeholder="请输入新密码" />
                    <van-field v-model="qpassword" label="确认密码" placeholder="再次输入新密码" />
                    <van-field
                        v-model="code"
                        center
                        clearable
                        label="短信验证码"
                        placeholder="验证码"
                        >
                        <template #button>
                            <van-button size="small" type="primary" :disabled="!canClick"  @click="getCode">{{yzname}}</van-button>
                        </template>
                    </van-field>
                </van-cell-group>  
                <p class="mp" v-if='message!=""'>{{message}}</p>
                <van-button @click="remove" type="default">取消</van-button> 
                <van-button @click="update" type="info">确认</van-button>
        </van-popup>

    </div>
</template>

<script>
  import Vue from 'vue';
  import Cookies from 'js-cookie'
  import { Toast} from 'vant';
  import { mapMutations } from 'vuex'
    import wx from 'weixin-js-sdk';
    Vue.use(Toast);
    import bg from '../../../public/image/bg.png'
export default {
    data(){
        return {
            zhnum:"",
            passwordnum:"",
            message:"",
            showm:false,
            code:"",
            tel:"",
            password:"",
            qpassword:"",
            yzname:"发送验证码",
            timer:null,
            // disabled:false,
            count:"",
            bg:bg,
            canClick: true,
            totalTime: 60,

        }
    },
    methods:{
           ...mapMutations(['hide','show']),

        gologin:function(){
            var reg = new RegExp("[`~!@#$^&*()=|{}':;',\\[\\].<>《》/?~！@#￥……&*（）——|{}【】‘；：”“'。，、？ ]")
            var num= new RegExp("/^[0-9]*$/");
            var AZ=new RegExp("/^[A-Z]*$/");
             var az=new RegExp("/^[a-z]*$/");
             var aa=new RegExp("/^(?=.*?[a-z])(?=.*?[A-Z])(?=.*?\d)(?=.*?[#@*&.]).*$/")
            var passwordnum=this.passwordnum.replace(/^\s\s*/, '').replace(/\s\s*$/, '');
            if(this.passwordnum==""){
                 this.message="请输入密码"
            }
            if(!(passwordnum.length >=6 && passwordnum.length <=14)){
                this.message="密码只允许6~14位"
            }
            else if( !(/^1[3456789]\d{9}$/.test(this.zhnum)) && !(/^(\(\d{3,4}\)|\d{3,4}-|\s)?\d{6,14}$/.test(this.zhnum))){ 
                 this.message="账号有误，请重填"
            } 
            else if(reg.test(passwordnum)){
                this.message="密码不允许出现特殊字符"
            } else {
                this.message=""
            } 

            if(!this.message){
                this.UpdateMember();
            }

        },

        UpdateMember:function(){
            this.$dataApi({
                url:"/api/Users/UserLogin",
                method:"POST",
                data:{
                    OpenID: sessionStorage.getItem("openID"),
                    Account:this.zhnum,
                    Password:this.passwordnum,
                    Source:1
                    }
            }).then(res=>{
                if(res.Status==200){  
                    Toast.success('登录成功');
                    Cookies.set('Account', this.zhnum,{ expires:1 });
                    Cookies.set('Password', this.passwordnum,{ expires: 1 });
                    this.$router.push('/index')
                } else {
                    Toast.fail('登录失败,密码错误');
                }
            })
        },

        setTime() {
            if (!this.canClick) return; // 如果是false 直接return出去
            this.canClick = false;
            this.yzname = this.totalTime + "s后重新发送";
            this.timer = window.setInterval(() => {
                this.totalTime--;
                this.yzname = this.totalTime + "s后重新发送";
                if (this.totalTime < 0) {
                window.clearInterval(this.timer);
                this.yzname = "重新发送验证码";
                this.totalTime = 60;
                this.canClick = true; // 这里重新开启
                }
            }, 1000);
        },

        //获取验证码
        getCode() {
        if(this.tel==""){
            this.message="请输入手机号码"
                return false;
        }
        else if(!(/^1[3456789]\d{9}$/.test(this.tel))){ 
            this.message="手机号码有误，请重填"
                 return false;
        } 
         else {
            this.message="";
        }
        let that = this;
            that.$dataApi({
                url:'https://webservice.jshcsoft.com/SSMSAPI/sendmessage.ashx',
                method:'POST',
                data:{
                    tele:this.tel,
                    type:"mqy"
                }
            }).then(response=>{ 
                that.setTime();
            });
        },


        getpassword:function(){
            this.showm=true;
            this.tel="";
            this.password="";
            this.qpassword="";
            this.code="";
            this.yzname="发送验证码";
            this.canClick=true;
            this.message="";
            this.totalTime = 60;
             clearInterval(this.timer);
        },
        update:function(){
             var reg = new RegExp("[`~!@#$^&*()=|{}':;',\\[\\].<>《》/?~！@#￥……&*（）——|{}【】‘；：”“'。，、？ ]")
             if(this.password==""){
                 this.message="请输入密码!"
                    return false;
            }
            else if(reg.test(this.password)){
                this.message="密码不允许出现特殊字符"
                return false;
            }else if(this.qpassword==""){
                this.message="请输入确认密码!"
                    return false;
            }
            else if(this.password!=this.qpassword){
                 this.message="两次密码不一致!"
                    return false;
            }else {
                this.message="";
            }
            if(!this.code){
                this.message="验证码为空!"
                 return false;
            } 
            let that = this;
            that.$dataApi({
                url:'https://webservice.jshcsoft.com/SSMSAPI/verifycode.ashx',
                method:'POST',
                data:{
                    tele:that.tel,
                    code:that.code,
                    type:"mqy"
                }
            }).then(response=>{ 
                if (response == true) {
                that.updatecode();
                } else {
                Toast.fail("验证码错误!!!");
                }
            });
        },

        updatecode:function(){
            this.$dataApi({
                url:"/api/Users/ResetPassword",
                method:"POST",
                data:{
                    OpenID:sessionStorage.getItem("openID"),
                    PhoneNum:this.tel,
                    Password:this.password,
                    Source:1
                    }
            }).then(res=>{
                if(res.Status==200){
                    Toast.success('修改成功');
                    this.remove()
                } else {
                    Toast.fail('密码修改失败');
                }
            })
        },

        remove:function(){
            this.tel="";
            this.password="";
            this.qpassword="";
            this.code="";
            this.showm=false;
            this.yzname="发送验证码";
            this.canClick=true;
            this.message="";
            this.totalTime = 60;
             clearInterval(this.timer);
        }
    },

    created:function(){
        // this.hide()
    },


    beforeRouteLeave(to, from, next) {
           if(to.path=='/my'){
             wx.closeWindow();
           }else {
               console.log(this)
               this.show();
               next()
           }
      }, 

}
</script>

<style  scoped>
    .login{
        width: 100%;
        overflow: hidden;
    }
    .bg{
        height: 4.7rem;
        width: 100%;
        /* background: url('@/../../../../public/image/bg.png') no-repeat; */
        background-size: 100%;
        background-repeat: no-repeat;
    }
    .form{
        width: 6.7rem;
        height: 6rem;
        margin: 0 auto;
        position:absolute;
        top:2.5rem;
        left:0.4rem;
        background-color: #ffffff;  
        box-shadow: 0 1px 10px 1px rgba(0, 0, 0, 0.2);
        border-radius: 40px;
    }
    .form p:first-of-type{
        color: red;
        font-size: 0.24rem;
        width: 5rem;
        margin: 0 auto;
        text-align: left;
        margin-top: 0.2rem;
        text-indent: 1em;
    }
    .form p:last-of-type{
        color: #999999;
        font-size: 0.22rem;
        width: 5rem;
        margin: 0 auto;
        text-align: right;
        margin-top: 0.1rem;
        width: 2rem;
        float: right;
        margin-right: 1rem;
    }
    .form span{
        margin-top: 1.5rem;
       overflow: hidden;
        display: block;
    }
    .form span .input{
        margin: 0 auto;
        width: 5rem;
        height: 0.8rem;
        border-bottom: 1px solid #999999;
    }
    .form .input img{
        width: 0.46rem;
        height: 0.48rem;
        float: left;
        display: block;
        margin-top: 0.1rem;
        margin-left: 0.2rem;
    }
    .form .input .van-cell{
        float:right;
        padding: 8px 10px;
        width: 82%;
    }
    .form span:nth-of-type(2){
        margin-top: 0.3rem;
    }
    .form button{
        color: #ffffff;
        background-color: #2DC6F1;
        width: 5.48rem;
        height: 0.8rem;
        text-align: center;
        line-height: 0.8rem;
        border-radius: 0.5rem;
        font-size: 0.3rem;
        border: none;
    }
    .img{
        width: 2.14rem;
        height: 2.14rem;
        position: absolute;
        top: 1.47rem;
        left: 2.68rem;
    }
    .van-popup--center{
        width: 80%;
        height: 45%;
    }
    .title{
        font-size: 0.35rem;
        display: block;
        text-align: center;
        width: 2rem;
        font-weight: 500;
        margin-top: 0.2rem;
        margin-bottom: 0.3rem;
    }
    .van-field__label{
        text-align: right;
        width: 6em;
    }
    .van-button--normal{
        width: 2rem;
        height: 0.7rem;
        border: 1px solid #999999;
        border-radius: 15px;
        line-height: 0.7rem;
        margin-bottom: 0.5rem;
    }
    .mp{
        color: red;
        font-size: 0.24rem;
        width: 5rem;
        margin: 0 auto;
        text-align: left;
        margin-top: 0.1rem;
        text-indent: 1em;
    }
</style>