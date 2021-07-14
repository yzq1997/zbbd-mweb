<template>
    <div class="box">
        <div class="bar"></div>
        <div class="push">
            <span class="span">消息推送</span>
            <van-switch v-model="checked" @change="change()" active-color="#07c160" />
        </div>
        <div class="setpush" @click="PushSet()">
            <span class="setspan">推送频次</span>
            <span class="setspantwo">{{push}}</span>
            <span class="pushimg"></span>
        </div>

        <div class="bar"></div>
        <div class="push">
            <span class="span">智能推荐</span>
            <van-switch v-model="checkedT" @change="changeT()" active-color="#07c160" />
        </div>

        <p class="p_title">优先展示地区将按序号进行优先级展示</p>
        <div class="numRegionBox" v-for="(item,index) in list" :key="index">
            <div class="regionBox" @click="regionBox(index)">
                <span>{{index+1}}.</span>
                <span>地区</span>
                <p>{{arr[index]}}</p>
                <i class="iconfont icon-iconfontjiantou5"></i>
            </div>
            <i class="iconfont icon-lajixiang" @click="delExcludeKey(index)"></i>
        </div>


        <button class="addRegion" @click="addRegion">+添加地区</button>

        <button class="saveSet" @click="saveSet">保存设置</button>

        <van-popup v-model="city" round position="bottom" :style="{ height: '85%' ,width:'100%'}" @close="close1">
            <van-tree-select
                :items="itemss"
                :active-id.sync="activeIds"
                :main-active-index.sync="activeIndex"
                @click-nav="onNavClick" 
            >
                <template #content>
                    <button v-for="(item,index) in items" :class="[item.IsShow ? 'cityBtnShow' : 'cityBtn']" @click="clickItem(item,index)">
                        {{item.text}}
                    </button> 
                </template>
            </van-tree-select>
        </van-popup>

        <van-popup v-model="show" round position="bottom" :style="{ height: '30%' }">
            <van-radio-group v-model="radio">
                <van-cell-group  @click="btn()">
                    <van-cell style="text-align: left;" title="推送一次" clickable @click="ts()">
                    <template #right-icon>
                        <van-radio name="1" />
                    </template>
                    </van-cell>
                    <van-cell style="text-align: left;" title="实时推送" clickable @click="tst()">
                    <template #right-icon>
                        <van-radio name="2" />
                    </template>
                    </van-cell>
                </van-cell-group>
            </van-radio-group>
            <!-- <button class="btn" @click="btn()">确定</button> -->
        </van-popup>
    </div>
</template>

<script>
    import Vue from 'vue';
    import { Switch,Popup,Toast  } from 'vant';
    var provinces = require('../../util/vios');

    Vue.use(Switch).use(Popup).use(Toast );
    export default {
        data() {
            return {
                checked: true,
                checkedT: false,
                push:"推送一次",
                show:false,
                radio: '1',
                city:false,
                itemss:[], //所有的省份
                itemssO:[], //所有的省份
                activeIds: [1, 2],
                activeIndex: 0,
                items:[{text:'全部',IsShow:true}],  //所有城市
                o:0,//点击的省份索引
                citys:[], //选中的城市
                showCitypre:[],  //选中的省份
                list:[],
                newList:[],
                newListSf:[],
                numRegion:0,  //打开哪一个地区组件
                arr:[],
                newData:true,
                AreaSortList:[],
                isRepeat:false,  //是否重复选择
                ID:0,
                SubscriptionRecommendSetting:0,  //允许添加的地区个数
                RoleName:'',  //用户角色
            };
        },
        methods: {
            //是否推送
            change(){
                if(this.checked){
                    this.$dataApi({
                        url:"api/WechatPush/SetPersonalPushInfo",
                        method:'POST',
                        data:{
                            OpenId: sessionStorage.getItem("openID"),
                            IsMessagePush:0,
                            IsPushed:0,
                            Source:1
                        }
                    })
                    .then(res => {
                        // console.log(res);
                    });
                }else{
                    this.$dataApi({
                        url:"api/WechatPush/SetPersonalPushInfo",
                        method:'POST',
                        data:{
                            OpenId: sessionStorage.getItem("openID"),
                            IsMessagePush:0,
                            IsPushed:1,
                            Source:1
                        }
                    })
                    .then(res => {
                        // console.log(res);
                    });
                }
                
            },

            //推送频次
            PushSet(){
                let that = this;
                that.$dataApi({
                    url: "api/RoleManage/GetUserRoleByOpenId",
                    method: "GET",
                    data: {
                        openId: sessionStorage.getItem("openID"),
                    },
                }).then((res) => {
                    console.log(res);
                    if(res.RoleManagement.RoleName == "免费用户" || res.RoleManagement.RoleName == "注册用户"){
                        if(res.RoleManagement.DataPush == 0){
                            Toast.fail('权限不足');
                        }else{
                            that.show = true;
                        }
                    }else{
                        that.show = true;
                    }
                });
                
            },
            ts(){
                this.radio = "1"
                this.push = "推送一次"
            },
            tst(){
                this.radio = "2"
                this.push = "实时推送"
            },
            btn(){
                if(this.radio === "1"){
                    this.$dataApi({
                        url:"api/WechatPush/SetPersonalPushInfo",
                        method:'POST',
                        data:{
                            OpenId: sessionStorage.getItem("openID"),
                            IsMessagePush:1,
                            IsPushAllDay:0,
                            Source:1
                        }
                    })
                    .then(res => {
                        this.show = false
                        Toast.success('设置成功');
                    });
                }else{
                    this.$dataApi({
                        url:"api/WechatPush/SetPersonalPushInfo",
                        method:'POST',
                        data:{
                            OpenId: sessionStorage.getItem("openID"),
                            IsMessagePush:1,
                            IsPushAllDay:1,
                            Source:1
                        }
                    })
                    .then(res => {
                        this.show = false
                        Toast.success('设置成功');
                    });
                }
            },

            //智能推荐
            changeT(){
                console.log(this.checkedT);
            },

            //选择地区
            regionBox(index){
                if(this.checkedT){
                    this.o = 0;
                    this.onNavClick(0)
                    console.log(this.o);
                    this.items = [{text:'全部',IsShow:true}];
                    this.activeIndex = 0
                    this.numRegion = index;
                    this.city = true;
                }else{
                    Toast.fail('您未打开智能推荐');
                }
                
                // console.log(this.arr);
            },

            //获取角色推送设置
            GetPersonalPushInfo(){
                let that = this;
                this.$dataApi({
                    url:"api/WechatPush/GetPersonalPushInfo",
                    method:'GET',
                    data:{
                        openId: sessionStorage.getItem("openID"),
                        Source:1
                    }
                })
                .then(res => {
                    // console.log(res);
                    if(res.IsPushed === 0){
                        that.checked = true
                    }else{
                        that.checked = false
                    }
                    if(res.IsAllDayPush === 0){
                        this.radio = "1"
                        this.push = "推送一次"
                    }else{
                        this.radio = "2"
                        this.push = "实时推送"
                    }
                });
            },

            //关闭地区
            close1(){
                // console.log(this.citys);
                // console.log(this.showCitypre);
                if(this.citys.length > 0){
                    this.arr[this.numRegion] = this.citys[0];
                }
                if(this.showCitypre.length > 0){
                    this.arr[this.numRegion] = this.showCitypre
                }
                this.citys = [];
                this.$forceUpdate()
                // this.newData = true;
                console.log(this.arr);

                
           
            },

            //点击省份
            onNavClick(ind){
                // console.log(ind);
                this.o = ind;
                let that = this
                this.$dataApi({
                    url:"api/Area/GetCity",
                    method:"POST",
                    data:{
                        province:this.itemss[ind].text
                    }
                }).then(res=>{
                    // console.log(this.citys);
                    //点击的是不是全国按钮
                    if(this.itemss[ind].text == '全国'){
                        this.items = [{text:'全部',IsShow:true}]
                        if(this.citys.length !== 0){
                            this.items[0].IsShow = false;
                        }
                    }else{
                        this.items = res;
                        this.items.map((item,index)=>{
                            if(this.citys.indexOf(item.text) !== -1){
                                this.items[index].IsShow = true;
                            }
                        });
                        var s = this.items.every(function(x){
                            return x.IsShow
                        })
                        if(s){
                            this.items[0].IsShow = true;
                            this.items.unshift({text:'全部',IsShow:true})
                        }else{
                            this.items.unshift({text:'全部',IsShow:false})
                        }
                    }
                })
            },

            //点击城市
            clickItem(item,index){
                // console.log(item.text);
                console.log(this.o);
                //点击的是不是全国
                if(this.o == -1){
                    this.arr[this.numRegion] = '全国';
                    console.log(this.arr);
                    if(!this.items[0].IsShow){
                        this.items[0].IsShow = true;
                        this.citys = [];
                        this.arr[this.o] = '全国';
                        console.log(this.arr);
                    }
                }else{
                    //点击的是不是全部按钮
                    if(item.text !== '全部'){   //点击的不是全部按钮
                        this.showCitypre = [];
                        this.items[0].IsShow = false;
                        if(this.citys.indexOf(item.text) !== -1){ //已经被点击了的城市
                            
                            this.itemss.map(item=>{
                                // item.badge = ''
                            })
                            this.citys = [];
                            this.items.map(item=>{
                                item.IsShow = false;
                            })
                            this.citys.push(item.text);
                            this.items[index].IsShow = true;
                        }else{  //没有被点击的城市
                            this.itemss.map(item=>{
                                // item.badge = ''
                            })
                            this.citys = [];
                            this.items.map(item=>{
                                item.IsShow = false;
                            })
                            this.citys.push(item.text);
                            this.items[index].IsShow = true;
                            //判断是否全部点完了
                            var len = 0;
                            this.items.map(item=>{
                                if(item.IsShow){
                                    len++;
                                };
                                if(len == this.items.length-1){
                                    this.items[0].IsShow = true
                                }
                            })
                        };
                    }else{  //点击的是全部按钮
                        this.citys = [];
                        if(this.items[0].IsShow){
                            this.items[0].IsShow = false;
                            this.items.map(item=>{
                                item.IsShow = false;
                                if(this.citys.indexOf(item.text) !== -1){
                                    this.citys.splice(this.citys.indexOf(item.text),1)
                                }
                            });
                            this.showCitypre = [];
                        }else{
                            this.showCitypre = this.itemss[this.o].AreaName;
                            this.items.map(item=>{
                                item.IsShow = true;
                                if(this.citys.indexOf(item.text) !== -1){
                                    this.citys.splice(this.citys.indexOf(item.text),1)
                                }
                            })
                            this.items[0].IsShow = true;

                        }
                    }
                }
            
                if(this.citys.indexOf('全部') !== -1){
                    this.citys.splice(this.citys.indexOf('全部'),1)
                };
            },

            //获取用户角色
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

                });
            },

            //获取地区
            getRegion(){
                let that = this;
                this.$dataApi({
                    url:'api/Area/GetArea',
                    method:'POST',
                }).then(response=>{
                    that.itemss = JSON.parse(JSON.stringify(response));
                    response.forEach((item,index)=>{
                        that.itemss[index].text = response[index].AreaName;
                        // that.itemss[index].badge = '';
                    })
                    // that.itemss.unshift({text:'全国'});

                    that.itemssO = JSON.parse(JSON.stringify(response));
                    response.forEach((item,index)=>{
                        that.itemssO[index].text = response[index].AreaName;
                        // that.itemssO[index].badge = '';
                    })
                    // that.itemssO.unshift({text:'全国'});

                    // console.log(that.itemssO);
                })
            },

            //添加地区
            addRegion(){
                // this.list.push({key:''});
                console.log(this.list);
                if(this.SubscriptionRecommendSetting == 0){
                    this.list.push({key:''});
                }else{
                    if(this.list.length >= this.SubscriptionRecommendSetting){
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

            //删除地区
            delExcludeKey(index){
                console.log(index);
                this.list.splice(index,1);
                this.AreaSortList.splice(index,1);
                this.arr.splice(index,1)
                console.log(this.arr);
                console.log(this.AreaSortList);
            },

            //保存设置
            saveSet(){
                let that = this;
                console.log(this.arr);
                if(that.checkedT == true && this.arr.length == 0){
                    Toast.fail('请添加地区');
                    return;
                }
                
                
                this.arr.map((items,indexs)=>{
                    // console.log(items);
                    provinces.forEach((item,index) => {
                        item.city.forEach((itt, idx) => {
                            if (itt.name == items) {
                                // console.log(items+'位于省份：', item.name);
                                this.AreaSortList[indexs] = this.arr[indexs] + ',1'
                                // console.log(this.arr);
                                this.arr.map((item,j)=>{
                                    if(item.indexOf('市') == -1){
                                        this.AreaSortList[j] = this.arr[j] + ',0'
                                    }
                                })
                                // console.log(this.AreaSortList);
                                for(let i = 0 ;i<indexs;i++){
                                    if( item.name.indexOf(this.arr[i]) >-1 ){
                                        Toast.fail('您已重复选择');
                                        this.isRepeat = true;
                                        return false;
                                    }
                                }
                            }else{
                                this.arr.map((item,j)=>{
                                    if(item.indexOf('市') == -1){
                                        this.AreaSortList[j] = this.arr[j] + ',0'
                                    }
                                });
                                // console.log(this.AreaSortList);
                            };

                            
                        })
                    })
                });
                
                
                if(!this.isRepeat){
                    // console.log(that.ID);
                    console.log(this.AreaSortList);
                    // return
                    that.$dataApi({
                        url: "api/Users/EditRecommendSetting",
                        method: "POST",
                        data: {
                            openid:sessionStorage.getItem("openID"),
                            nickname:sessionStorage.getItem("NickName"),
                            sex:sessionStorage.getItem("sex"),
                            language:sessionStorage.getItem("language"),
                            city:sessionStorage.getItem("city"),
                            province:sessionStorage.getItem("province"),
                            country:sessionStorage.getItem("country"),
                            headimgurl:sessionStorage.getItem("headimgurl"),
                            subscribe_time:sessionStorage.getItem("subscribe_time"),
                            remark:sessionStorage.getItem("remark"),
                            IsUpdate:sessionStorage.getItem("IsUpdate"),
                            presubscribe_time:sessionStorage.getItem("presubscribe_time"),
                            ID:that.ID,
                            IsTrue: that.checkedT,
                            AreaSortList:this.AreaSortList,
                            Source:1,
                        },
                    }).then((res) => {
                        // console.log(res);
                        Toast.success('保存成功');
                    });
                }else{
                    console.log(2);
                }
            },

            //获取智能推荐信息
            getIntelligent(){
                let that = this;
                this.$dataApi({
                    url:'api/Users/GetRecommendSetting',
                    method:'GET',
                    data: {
                        openid: sessionStorage.getItem("openID"),
                        source:1
                    },
                }).then(response=>{
                    console.log(response);
                    if(response.Data){
                        that.checkedT = true;
                        that.ID = response.Data.ID;
                        response.Data.AreaSortList.map((item,index)=>{
                            that.list.push({key:''});
                            this.arr[index] = item.substring(item.Length-2,2); 
                        });
                        that.AreaSortList = response.Data.AreaSortList
                        console.log(this.arr);
                    }else{

                    };
                    // console.log(that.ID);

                });
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
                    that.SubscriptionRecommendSetting = res.RoleManagement.SubscriptionRecommendSetting;
                    that.RoleName = res.RoleManagement.RoleName;
                });
            },
        },
        created() {
            this.GetPersonalPushInfo(); //获取角色推送设置
            this.getRegion(); //获取地区
            this.getIntelligent(); //获取智能推荐信息
            this.getUserRole(); //拿到用户角色（默认宝典）
        },
    }
</script>

<style  scoped>
    .box{
        min-height: 100%;
        overflow: hidden;
        /* background: #F5F5F9; */
    }
    .btn{
        font-size: 0.2rem;
        width: 1.2rem;
        height: 0.6rem;
        background: #1890FF;
        border: none;
        color: #fff;
    }
    .push{
        padding: 0 0.5rem;
        display: flex;
        align-items: center;
        height: 1rem;
        justify-content: space-between; 
        background: #fff;
        /* margin-top: 0.3rem; */
    }
    .span{
        font-size: 0.3rem;
    }
    .setpush{
        display: flex;
        align-items: center;
        /* margin-top: 0.3rem; */
        padding: 0 0.5rem;
        height: 1rem;
        background: #fff;
    }
    .setspan{
        /* width: 2rem; */
        font-size: 0.3rem;
        margin-left: 0;
    }
    .setspantwo{
        /* width: 3rem; */
        font-size: 0.3rem;
        /* margin-right: 0.1rem; */
        margin-left: 53%;
        /* width: 2rem; */
    }
    .pushimg{
        width:0.4rem;
        height: 0.4rem;
        margin-left: 0.1rem;
        background: url(../../../public/image/icon-right.png) no-repeat;
        background-size: 100% 100%;
        /* background: url(../../public/image/zcbtn.png) no-repeat; */
        /* background-size: 100% 100%; */
    }
    .p_title{
        font-size: 0.2rem;
        text-align: left;
        margin-left: 5%;
        color: #666666;
    }
    .regionBox{
        display: flex;
        align-items: center;
        height: 0.8rem;
        /* background: pink; */
        border-radius: 0.1rem;
        margin-top: 0.1rem;
        margin-bottom: 0.1rem;
        width: 85%;
        margin-left: 5%;
        margin-right: 2%;
        border: 1px solid #DDDDDD
    }
    .regionBox>span{
        font-size: 0.3rem;
    }
    .regionBox>span:nth-of-type(1){
        margin-left: 0.2rem;
        color: #0493EA;
    }
    .regionBox>p{
        margin: 0;
        font-size: 0.3rem;
        display: block;
        overflow: hidden;
        width: 60%;
        margin-left: 0.5rem;
        margin-right: 0.3rem;
        text-align: right;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
    }

    .cityBtn{
        background: #fff;
        color: #333;
        border:none;
        background:rgba(247,247,247,1);
        width: 1.65rem;
        height: 0.8rem;
        border-radius: 0.1rem;
        font-size: 0.28rem;
        font-family: PingFang SC;
        margin-left: 0.2rem;
        margin-top: 0.2rem;
        float: left;
        padding: 0;
    }
    .cityBtnShow{
        background: #4CA8F8;
        color: #fff;
        border:none;
        width: 1.65rem;
        height: 0.8rem;
        border-radius: 0.1rem;
        font-size: 0.28rem;
        font-family: PingFang SC;
        margin-left: 0.2rem;
        margin-top: 0.2rem;
        float: left;
        padding: 0;
    }
    .addRegion{
        font-size: 0.3rem;
        width: 90%;
        background: #0493EA;
        border: none;
        border-radius: 0.1rem;
        height: 0.7rem;
        color: #fff;
        margin-bottom: 2rem;
    }
    .saveSet{
        font-size: 0.3rem;
        position: fixed;
        bottom: 1.5rem;
        left: 40%;
        width: 89%;
        left: 5%;
        background: #0493EA;
        border: none;
        border-radius: 0.1rem;
        height: 0.7rem;
        color: #fff;
    }
    .bar{
        width: 100%;
        height: 0.2rem;
        background: #F5F5F9;
    }
    .numRegionBox{
        display: flex;
        align-items: center;
    }
    .iconfont{
        font-size: 0.35rem;
        color: #0493EA
    }
    .van-tree-select{
        height: 100% !important;
        margin-bottom: 1rem !important;
    }
    .van-tree-select__nav{
        flex: none !important;
        margin-bottom: 1rem;
    }
</style>