<template>
    <div class="box">
        <div class="searchnum" >为您检索到了<span style="color:#E7564F;">{{this.searchlistnum}}个</span>推送信息<span @click="back()" class="back">返回筛选</span></div>
        <div class="searchList" ref="Listexport">
            <div v-for="(item,index) in searchlist" :key="index" class="search-info">
                <div class="search-split"></div>
                <div class="search-title" v-html="item.title" @click="content(item)"> </div>
                <div class="infotyle">
                    <span v-if='item.Province !=""' style="margin-left: 0.2rem;"> {{item.Province}}</span>
                    <span  v-if='item.FormatGGType != ""'> {{item.FormatGGType}}</span>
                    <span v-if='item.HYType != ""' style="overflow:hidden;white-space: nowrap;text-overflow: ellipsis;width: auto;">{{item.HYType}}</span>
                    <span v-if="(item.Amount/10000).toFixed(2) == 0 ? false: true" class="prise">{{(item.Amount/10000).toFixed(2)}}万</span>
                    <span v-if='item.JoinDate != ""' style="float: right;border: none;padding: 0.08rem 0rem;">
                        <van-icon style="position: relative;top: 1px;right: 1px;" name="clock-o" />{{item.JoinDate}}
                    </span>
                </div>
            </div>
        </div>
        <div v-if="this.img" class="noisearchlist">
            <img src="../../../public/image/search_defualt.png" class="defaultImg"/>
            <div class="noseachinfo">哎呀！没有搜索到任何内容、换些条件试试吧</div>
        </div>
        <div class="email" v-if="this.export">
            <p>数据导出将发送至您的邮箱，最多<span style="color:red">2000</span>条数据</p>
            <van-field class="input"  v-model="valueEmain" placeholder="请输入邮箱" />
            <div class="btn">
                <button class="btnqx" @click="back()">取消</button>
                <button class="btnqd" @click="email()">确定</button>
            </div>
        </div>
        <van-loading type="spinner" color="#1989fa" v-if="loading">
            加载中...
        </van-loading>
    </div>
</template>

<script>
    import Vue from 'vue';
    import { Field,Toast ,Loading   } from 'vant';

    Vue.use(Field).use(Toast );

   
    export default {
        data(){
            return {
                value:"",
                obj:{},
                IsImport:0,
                searchlistnum:0,
                searchlist:[],
                valueEmain:"",
                export:false,
                img:false,
                pageSize:100,
                btns:false,
                loading:true,
            }
        },
        methods:{
            //获取数据
            getsearchlist:function(pageSize){
                this.btns = false;
                let day2 = new Date();
                day2.setTime(day2.getTime());
                let nowdate= day2.getFullYear()+"-" + ((day2.getMonth()+1)<10 ? "0"+(day2.getMonth()+1):(day2.getMonth()+1)) + "-" + (day2.getDate() < 10 ? "0"+day2.getDate():day2.getDate());
                let that = this;

                this.$dataApi({
                    url:"api/Users/DataExportByMailbox",
                    method:"POST",
                    data:{
                        IsImport:this.IsImport,
                        KeyWord:sessionStorage.getItem("exportKeyWord") === "null"?"":sessionStorage.getItem("exportKeyWord"),
                        MatchPattern:sessionStorage.getItem("exportMatchPattern"),
                        TimeBegin:sessionStorage.getItem("exportTimeBegin"),
                        TimeEnd:sessionStorage.getItem("exportTimeEnd"),
                        Provinces:sessionStorage.getItem("exportProvinces"),
                        GGType:sessionStorage.getItem("exportGGType"),
                        Industry:sessionStorage.getItem("exportIndustry") === "全部"?"":sessionStorage.getItem("exportIndustry"),
                        PageNo:1,
                        PageSize:pageSize,
                        Cities:sessionStorage.getItem("Cities"),
                        BeginAmount:sessionStorage.getItem("BeginAmount"),
                        EndAmount:sessionStorage.getItem("EndAmount"),
                    }
                }).then(response=>{
                    this.loading = false;
                    if(JSON.parse(response.Data).TotalCount ===0){
                        setTimeout(()=>{
                            this.img = true
                            document.getElementsByClassName("box")[0].style.height = '100%';
                        },50)
                    }
                
                    that.searchlistnum = JSON.parse(response.Data).TotalCount;
                    that.searchlist = JSON.parse(response.Data).Rows;
                    that.searchlist.forEach(item=>{
                        item.oldtitle=item.title;
                        if(JSON.parse(response.Data).TotalCount !== 0){
                            this.export = true
                        };
                        
                    })
                    that.searchlist.forEach(item=>{ 
                        item.GGType=item.FormatGGType;
                        // item.JoinDate = '2020-08-19 12:00:00'
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

                    if(sessionStorage.getItem("exportKey").length > 0){
                        const searchVal = sessionStorage.getItem("exportKey")
                        // 匹配关键字正则
                        const replaceReg = new RegExp(searchVal, 'g')
                        // 高亮替换v-html值
                        const replaceString = `<font color='#F14F4A'>${searchVal}</font>`
                        for (let i = 0; i < that.searchlist.length; i++) {
                        // 开始替换
                        that.searchlist[i].title = that.searchlist[i].title.replace(replaceReg, replaceString).slice(0,90)
                        }
                    }
                    
                    that.btns = true;
                    })
                    .catch(function (error) {
                    // console.log(error);
                    });
            },
            //滑动到底部再获取数据
            getScroll:function(e){
                let tops = document.documentElement.scrollTop||document.body.scrollTop;    //滚动条的高度
                let that=this;
                if(e && (typeof e  == "number") && e!==0){
                    setTimeout(()=>{
                        document.documentElement.scrollTop = e;
                        document.body.scrollTop=e;
                        tops=e||document.body.scrollTop;
                    },0)
                }
                setTimeout(function(){
                    if((that.$refs.Listexport.offsetHeight - tops - screen.height) <= -78 && that.searchlistnum != that.searchlist.length  )
                    {
                        that.pageSize=that.pageSize+20;
                        that.getsearchlist(that.pageSize)
                    }
               },500)
            },
            email(){
                let email = this.valueEmain
                var reg = /^([a-zA-Z]|[0-9])(\w|\-)+@[a-zA-Z0-9]+\.([a-zA-Z]{2,4})$/;
                if(reg.test(email)){
                    this.$dataApi({
                        url:"api/Users/DataExportByMailbox",
                        method:"POST",
                        data:{
                            IsImport:1,
                            KeyWord:sessionStorage.getItem("exportKeyWord") === null ? "":sessionStorage.getItem("exportKeyWord"),
                            MatchPattern:sessionStorage.getItem("exportMatchPattern"),
                            TimeBegin:sessionStorage.getItem("exportTimeBegin"),
                            TimeEnd:sessionStorage.getItem("exportTimeEnd"),
                            Provinces:sessionStorage.getItem("exportProvinces"),
                            GGType:sessionStorage.getItem("exportGGType"),
                            Industry:sessionStorage.getItem("exportIndustry"),
                            Cities:sessionStorage.getItem("Cities"),
                            BeginAmount:sessionStorage.getItem("BeginAmount"),
                            EndAmount:sessionStorage.getItem("exportIndustry"),
                            PageNo:1,
                            PageSize:20,
                            MailBox:this.valueEmain
                        }
                    }).then(res=>{
                        // console.log(res);
                    })
                    Toast.success('数据导出成功，请在邮箱查看导出的数据');
                    sessionStorage.setItem("email",this.valueEmain)
                    this.valueEmain = ""
                }else{
                    Toast.fail('邮箱格式不正确');
                }
            },
            back(){
                this.$router.push('/export')
            }
        },
        watch: {
            '$route'(to,from){
                this.getsearchlist(100);
            }
        },
        
        created() {
            this.valueEmain = sessionStorage.getItem("email")
        },
        mounted:function(){
            window.addEventListener('scroll',  this.getScroll);
        },
        beforeRouteEnter(to, from, next) {
           next(vm => {
                if(from.path === "/export"){
                    vm.getsearchlist(100)
                }
            })
        },
    }
</script>

<style scoped>
    .box{
        min-height: 100% ;
        background:#F5F5F9;
        overflow: hidden;
    }
    .searchnum{
        position: fixed;
        width: 100%;
        display: flex;
        align-items: center;
        height:1rem;
        font-size:0.24rem;
        font-family:PingFang SC;
        font-weight:500;
        color:rgba(171,171,171,1);
        line-height:0.38rem;
        margin-top: 0 !important;
        background: #fff;
        text-align: left;
        padding-left: 0.43rem !important;
        z-index: 10;
    }
    .searchList{
        margin-top: 1rem;
        background: #fff;
        margin-bottom: 4.5rem;
    }
    .search-split{
        width:7.5rem;
        height:0.16rem;
        background:rgba(242,242,242,1);
    }
    .search-title{
        width:6.48rem;
        margin-left: 0.23rem;
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
        width:7.5rem;
        height:0.4rem;
        margin-top: 0.29rem;
        padding-bottom: 0.38rem;
    }
    .infotyle span{
        height: 0.26rem;
        float: left;
        font-size:0.24rem;
        font-family:PingFang SC;
        font-weight:500;
        color:rgba(171,171,171,1);
        line-height:0.26rem;
        margin-right: 0.1rem;
        padding: 0.08rem 0.12rem;
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
        background: #EBEEFF;
        color:#7886C2 !important;
   }
    .email{
        position: fixed;
        height: 3.2rem;
        bottom: 1rem;
        background: #fff;
        width: 100%;
    }
    .email p{
        font-size: 0.3rem;
        text-align: left;
        margin-left: 5%;
    }
    .input{
        border:1px solid rgb(180, 173, 173);
        width:90%;
        margin-left:5%;
        border-radius: 0.1rem;
    }
    .btn{
        margin-top: -0.4rem
    }
    .btnqx,.btnqd{
        font-size: 0.3rem;
        border-radius: 5px;
        border: 1px solid rgb(160, 154, 154);
    }
    .btnqx{
        width: 1.5rem;
        height: 0.6rem;
    }
    .btnqd{
        width: 1.5rem;
        height: 0.6rem;
        background: #1890FF;
        color:#fff;
    }
    .back{
        margin-left: 35%;
        color: #1890FF;
    }
    .defaultImg{
        width: 1.95rem;
        height: 2.07rem;
        margin: 2.72rem auto 02.78rem auto;
        display: block;
        margin-bottom: 0.5rem;
        float: inherit;
    }
    .noseachinfo{
        width:4.54rem;
        height:0.38rem;
        font-size:0.24rem;
        font-family:PingFang SC;
        font-weight:500;
        color:rgba(171,171,171,1);
        line-height:0.38rem;
        margin-left: 1.48rem;
    }
    .prise{
        background: #fcf3f4;
        color:#e58890 !important;
    }
</style>