<template>
    <div class="box">
        <div class="titleBox">
            <p class="title">{{title}}</p>
            <button class="btn" @click="CancelAttention">取消关注</button>
        </div>

        <div class="main">
            <div class="list" v-for="(item,index) in dataList" :key="index" @click="content(item)">
                <div class="lsitTime">
                    <button class="typeBtn">{{item.GGType == 1 ? '招标公告' : (item.GGType == 2 ? '变更公告' : '结果公告')}}</button>
                    <p>{{item.PubTime}}</p>
                </div>
                <div class="listMain">
                    <p><span>{{item.Title}}</span>{{item.GGType == 1 ? '招标公告' : (item.GGType == 2 ? '变更公告' : '结果公告')}}</p>
                </div>
                <i class="iconfont icon-iconfontjiantou5"></i>
            </div>
        </div>

        <!-- 模态框 -->
        <van-overlay class="Modal" :show="show">
            <van-loading type="spinner" />
        </van-overlay>
    </div>
</template>

<script>
    import { Toast ,Overlay,Loading  } from "vant";
    export default {
        data(){
            return {
                title:'', //招标标题
                dataList:{},  //数据
                msg:'',
                show:true, //模态框
            }
        },
        methods:{
            //获取数据
            getData(){
                let that = this;
                that.$dataApi({
                    url: "api/ProjectProgressMonitor/GetSingleProjectInfo",
                    method: "POST",
                    data: {
                        Title:sessionStorage.getItem('Title'),
                        BaseID:sessionStorage.getItem('BaseID')
                    }
                }).then(res => {
                    console.log(res);
                    if(res.Status == 200){
                        that.dataList = res.BaseDataList
                        that.show = false;
                    }else{
                        that.show = true;
                    }
                    
                })
            },

            //获取数据-推送
            getDataPush(){
                let that = this;
                that.$dataApi({
                    url: "api/ProjectProgressMonitor/GetSingleProjectInfo",
                    method: "POST",
                    data: {
                        Title:that.title,
                        BaseID:Number(localStorage.getItem('ProjectsConcernNumber'))
                    }
                }).then(res => {
                    console.log(res);
                    if(res.Status == 200){
                        that.dataList = res.BaseDataList
                        that.show = false;
                    }else{
                        that.show = true;
                    }
                    
                })
            },

            //取消关注
            CancelAttention(){
                let that = this;
                that.$dataApi({
                    url: "api/Users/CancelMyProject",
                    method: "POST",
                    data: {
                        OpenID:sessionStorage.getItem("openID"),
                        id:sessionStorage.getItem('BaseID'),
                        Source:1
                    }
                }).then(res => {
                    // console.log(res);
                    if(res.Status == 200){
                        Toast.success('取消成功');
                    };
                    that.$router.push('/mypro')
                })
            },

            //跳转详情页
            content(e){
                console.log(e);
                sessionStorage.setItem("sharetitle", e.Title);
                // return
                let that = this;
                that.$dataApi({
                    url: "api/Users/CheckIsConcernProject",
                    method: "POST",
                    data: {
                        OpenId: sessionStorage.getItem("openID"),
                        id: e.BaseID,
                        Source: 1
                    }
                }).then(res => {
                    that.msg = res.Msg;
                    //是否被关注
                    //let newUrl = e.ZBUrl.replace(/ContentHtml/,'ContentHtmlTest')
                    let a =e.ZBUrl +`?IsConcerned=${that.msg}&id=${e.BaseID}&openID=${sessionStorage.getItem("openID")}&Source=1`;
                    sessionStorage.setItem("url", a);
                    that.$router.push({
                        path: "/iframe",
                        query: {
                            ZBUrl: a,
                            id:e.BaseID
                        }
                    });
                });
            },

            //拿到用户角色
            getUserRole(){
                let that = this;
                that.$dataApi({
                    url: "api/RoleManage/GetUserRoleByOpenId",
                    method: "GET",
                    data: {
                        openId: sessionStorage.getItem("openID"),
                    },
                }).then((res) => {
                    console.log(res);
                    that.HomePageDataList = res.RoleManagement.HomePageDataList;
                    that.RoleName = res.RoleManagement.RoleName;
                    that.DataDetailsView = res.RoleManagement.DataDetailsView;

                });
            },

            //获取是否关注此文章
            CheckIsConcernProject(){
                let that = this;
                that.$dataApi({
                    url: "api/Users/CheckIsConcernProject",
                    method: "POST",
                    data: {
                        OpenId: sessionStorage.getItem("openID"),
                        id:sessionStorage.getItem('BaseID'),
                        Source:1
                    },
                }).then((res) => {
                    // console.log(res);
                    if(res.Msg == "False"){
                        that.$router.push('/mypro')
                    }
                });
            },

            //获取是否关注此文章-推送
            CheckIsConcernProjectPush(){
                let that = this;
                that.$dataApi({
                    url: "api/Users/CheckIsConcernProject",
                    method: "POST",
                    data: {
                        OpenId: sessionStorage.getItem("openID"),
                        id:Number(localStorage.getItem('ProjectsConcernNumber')),
                        Source:1
                    },
                }).then((res) => {
                    // console.log(res);
                    if(res.Msg == "False"){
                        that.$router.push('/mypro')
                    }
                });
            },

            //推送数据
            GetDataInfo(){
                let that = this;
                that.$dataApi({
                    url: "api/BaseData/GetDataInfo",
                    method: "GET",
                    data: {
                        id:Number(localStorage.getItem('ProjectsConcernNumber')),
                    },
                }).then((res) => {
                    console.log(res);
                    that.title = res;
                });
            }
        },
        created(){
            if(localStorage.getItem('ProjectsConcern') == 'ProjectsConcern'){
                this.GetDataInfo();
                setTimeout(()=>{
                    this.getDataPush();//获取推送数据
                    localStorage.removeItem('ProjectsConcern')
                },1000)
                
            }else{
                this.getData(); //获取数据
                this.CheckIsConcernProject(); //获取是否关注此文章
                this.title = sessionStorage.getItem('Title');
            };


            
        },
        beforeRouteEnter (to, from, next) {
            if(localStorage.getItem('ProjectsConcern') == 'ProjectsConcern'){

            }else{
                sessionStorage.setItem('Title',to.query.Title);
                sessionStorage.setItem('BaseID',to.query.BaseID);
            }
            
            next(vm=>{})
        },
    }
</script>

<style lang="scss" scoped>
.box{
    background: #F5F5F9;
    min-height: calc(100% - 1rem);
}
.titleBox{
    display: flex;
    flex-direction: column;
    // align-items: center;
    background: #fff;
    margin-bottom: 0.2rem;
}
.title{
    font-size: 0.36rem;
    color: #3B3B3B;
    text-align: left;
    margin-left: 1%;
    margin: 0;
    margin-top: 0.3rem;
    padding: 0 5%;
    font-family: PingFang-SC-Medium;
}
.btn{
    width: 20%;
    margin-left: 75%;
    font-size: 0.3rem;
    background: #4DA2FD;
    color: #fff;
    border: none;
    padding: 0.1rem;
    border-radius: 5px;
    margin-top: 0.3rem;
    margin-bottom: 0.2rem;
}
.main{
    background: #fff;
    width: 96%;
    margin-left: 2%;
}

.list{
    display: flex;
    border-bottom: 1px solid #eee;
    // width: 100%;
}

.lsitTime{
    width: 25%;
    // width: 4.5rem;
    display: flex;
    flex-direction: column;
    align-items: center;
    padding-top: 0.5rem;
}
.lsitTime>p{
    font-size: 0.3rem;
    margin: 0;
    margin-top: 0.1rem;
    color: #999999;
}
.lsitTime>button{
    margin: 0;
    padding: 0;
}

.listMain{
    width: 70%;
}
.listMain>p{
    font-size: 0.3rem;
    font-family: PingFang-SC-Medium;
    text-align: left;
    margin: 0;
    margin-top: 0.4rem;
    margin-bottom: 0.5rem;
    margin-left: 0.2rem;
    margin-right: 0.1rem;
}
.listMain>p>span{
    color: #0E9DE7;
}
.typeBtn{
    font-size: 0.3rem;
    background: #0E9DE7;
    border: none;
    width: 85%;
    height: 0.5rem;
    border-radius: 0.1rem;
    color: #fff;
    margin-left: 5%;
}
.iconfont{
    margin-top: 10%;
    margin-right: 2%;
}
.Modal{
    display: flex;
    justify-content: center;
    align-items: center;
}
</style>