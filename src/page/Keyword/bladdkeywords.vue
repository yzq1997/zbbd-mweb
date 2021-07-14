<template>
   <div id="blkeyword">
        <!-- 选择地区 -->
        <!-- <div class="selcity">
            <span>选择地区</span>
            <div @click="showcitymodel" class="keywords">{{lastselCity}}</div>
        </div> -->
        <div class="ketWords">
            <div class="title" style="margin-top: 0rem;width: auto;"  @click='cityShow()'>
                <span style="display: block;float: left;width:3rem;text-align: left;">地区:</span>
                <div class="diqu city" >
                    <span class="pPrice">全部</span>
                    <i class="i" v-if="cit">...</i>
                </div>
                <img class="img" src="../../../public/image/icon-right.png" alt="">
            </div>
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
        </div>

        <van-popup  v-model="showmd"  :overlay='true' class="citymodel">
            <div>
                <van-tree-select
                    :items="province"
                    :active-id.sync="activeIds"
                    :main-active-index.sync="activeIndexp"
                    @click-nav="onNavClick"  
                >
                    <template #content>
                        <button v-for="(item,index) in allcity" :key="index" :class="[item.IsShow ? 'cityBtnShow' : 'cityBtn']" @click="clickItem(item,index)">
                            {{item.text}}
                        </button> 
                    </template>
                </van-tree-select>
                <div style="float:left;width: 100%">
                    <button class="listall" @click="chongzhi()">重置</button>
                </div>
            </div>
        </van-popup>
        <!-- 邀请码 -->
        <!-- <div class="icode">
                <span>邀请码:</span>
                <van-field class="inpYQM" v-model="value" placeholder="邀请码由平台提供" @input="blue"/>
        </div> -->

        <!-- 添加关键词 -->
        <div class="addkd">
            <span>添加关键词</span>
            <span>添加关键词，行业商机随时掌握 ！</span>
            <div class="wdinput">
                <van-search maxlength="10" id="inputInfo"  @focus="onFocus"   v-model="keyword" placeholder="请输入您关注的行业" />
                <button class="btnAdd" @click="addkdList">+添加</button>
            </div>
            <div class="searmd" v-if="onseach">
                <ul>
                    <li v-for="(item,index) in searchKd" @click="sureKd(item.title)" v-html="item.text" :key="index"></li>   
                </ul>
            </div>
            <div class="kdlist">
                <span>已添加关键词:</span>
                <div class="list">
                    <!-- searchKd -->
                    <ul>
                        <li v-for="(item,index) in kdList"  :key="index">
                            <img @click="addrkd(item)" src="../../../public/image/x.png"/><div class="two">{{item}}</div>
                        </li>      
                    </ul>
                </div>
            </div>
        </div>

        <!-- 订阅关键词 -->
        <div class="kwmodel">
                <div class="hytitle">行业</div>
                <div class="yyy">
                    <van-tree-select
                    class="keyWordBox"
                        :items="industry"
                        :active-id.sync="activekd"
                        :main-active-index.sync="activeIndex" 
                        @click-nav="onhyClick"                 
                    >
                        <template #content>
                            <span class="title">同行订阅的关键词</span>
                            <div class="btnList">
                                <button v-for="(item,index) in rkdlist[0]" :key="index" :class="[kdList.indexOf(item)>=0 ? 'kdBtnShow' : '']" @click="addrkd(item)">
                                {{item}}
                            </button> 
                            </div>
                        </template>
                    </van-tree-select>
                </div>
        </div>

        <!-- 查看商机 -->
        <div class="ckbutton">
            <button @click="seveKd">立即查看商机</button>
        </div>

        <van-dialog v-model="codeShow" :show-confirm-button=false class="phone">
            <div class="register">
                <div :class="active?'registerBtnT':'registerBtnF'" >手机号码注册</div>
                <!-- <div :class="!active?'registerBtnT':'registerBtnF'" @click="phoneReg">邀请码注册</div> -->
            </div>

            <div v-if="active">
                <p style="margin:12px">免费注册可享更多权益!</p>
                <van-field v-model="tel" type="tel" label="手机号码" placeholder="请输入手机号码"/>
                <van-field
                    v-model="sms"
                    center
                    clearable
                    label="短信验证码"
                    placeholder="请输入短信验证码"
                >
                    <template #button>
                        <van-button size="small" type="primary" @click="getsms">{{fsyzm}}</van-button>
                    </template>
                </van-field>
                <div class="btnbox1">
                    <button class="btnShowT" @click="phoneFin">确定</button>
                    <button class="btnShowF" @click="closeActive">取消</button>
                </div>
            </div>

            <div v-if="!active">
                <p style="margin:12px">免费注册可享更多权益!</p>
                <van-field v-model="code" label="邀请码" placeholder="请输入邀请码"/>
                <div class="btnbox1">
                    <button class="btnShowT" @click="codeFin">确定</button>
                    <button class="btnShowF" @click="closeActive">取消</button>
                </div>
            </div>
        </van-dialog>
    </div>
</template>

<script>
import Vue from 'vue';
import { mapMutations } from "vuex";
import { Toast ,Field } from 'vant';
Vue.use(Toast)
Vue.use(Field )
export default {
   data () {
      return {
        onseach:false,
        province:[], //所有省份
        activeIds: [1, 2],
        activeIndexp: 0,
        allcity:[{text:'全部',IsShow:true}],  //所有城市
        ptype:[],
        selPro:"全国", //当前选中的省份
         o:0,//点击的省份索引
        keyword:"",
        industry:[
            {
            text:"建筑工程1",
            badge: "",
            arr:[
                { tit: "材料设备",id:0},
                { tit: "工程施工",id:1 },
                { tit: "勘察设计",id:2 },
                { tit: "监理咨询" ,id:3},
                { tit: "机电安装" ,id:4},
            ]
            },
             {
            text:"建筑工程2",
            badge: "",
            arr:[
                { tit: "材料设备2",id:0},
                { tit: "工程施工2",id:1 },
                { tit: "勘察设计2",id:2 },
                { tit: "监理咨询2" ,id:3},
                { tit: "机电安装2" ,id:4},
            ]
            }  
        ],
        activekd:[""],//右侧选中的关键词
        activeIndex:0,//左侧选中的高亮
        rkdlist:[],// 选择行业相关关键词  
        showmd:false,// 地区选择模态框
        seltrykd:[], //选中列表关键词
        kdList:[],// 最终添加关键词
        searchKd:[],
        addlsarr:[], //零时数据载体，保存行业和关键词
        isVip:false,  //是否是会员
        codeShow:false,  //会员注册弹框
        active: true, //哪种注册方式
        fsyzm: "发送验证码",
        fsyzmTrue: true, //是否在60秒
        tel: "", //手机号
        sms: "", //验证码
        code: "", //邀请码


        cit: false,
        city:false,
        itemss:[], //所有的省份
        citys:[], //选中的城市
        showCitypre:[],
        items:[{text:'全部',IsShow:true}],  //所有城市
        showCity:'',
        value:'',  //邀请码
      };
   },

    mounted() {
        let that = this
        document.addEventListener('click',function(e){
            if(e.target.id != 'inputInfo'){
                that.$nextTick(() => {
                    that.onseach = false;
                })
            }
        })
    },

    watch: {
        keyword(newData, oldData) {
            if(newData!=""){
                this.onseach=true;
                this.setGlkd(newData)
            }else {
                this.onseach=false;
            }
        }
    } ,

    methods: {
        ...mapMutations(["hide", "show"]),

        blue(){
            // console.log(this.value);
            let that = this;
            if(that.value.length == 6){
                console.log(that.value);
                that.$dataApi({
                    url: "api/Users/RegistrationInvitationCode",
                    method: "POST",
                    data: {
                        openid: sessionStorage.getItem("openID"),
                        InvitationCode: that.value,
                        sex: sessionStorage.getItem("sex"),
                        language: sessionStorage.getItem("language"),
                        city: sessionStorage.getItem("city"),
                        province: sessionStorage.getItem("province"),
                        country: sessionStorage.getItem("country"),
                        headimgurl: sessionStorage.getItem("headimgurl"),
                        subscribe_time: sessionStorage.getItem(
                            "subscribe_time"
                        ),
                        remark: sessionStorage.getItem("remark"),
                        IsUpdate: sessionStorage.getItem("IsUpdate"),
                        nickname: sessionStorage.getItem("NickName"),
                        presubscribe_time: sessionStorage.getItem(
                            "presubscribe_time"
                        ),
                        Source: 1,
                    },
                }).then((res) => {
                    // console.log(res);
                    if (res.Msg == "邀请码错误") {
                        Toast.fail("邀请码错误");
                        // that.value = '';
                    } else if (res.Msg == "邀请码已被使用") {
                        Toast.fail("邀请码已被使用");
                        // that.value = '';
                    } else if (res.Msg == "true") {
                        Toast.success("邀请码使用成功");
                        // that.value = '';
                        that.isVip = true;
                    }
                });
            }
        },
        //确定添加的关键词
        sureKd(e){
            console.log(e);
            this.onseach=false;
            this.keyword=e;
           
        },

        // 添加按钮事件
        addkdList:function(){
            let that = this;
            // console.log(this.kdList);
            // console.log(this.keyword);
            let han = /^[\u4e00-\u9fa5]+$/;
            if(!han.test(this.keyword)){
                Toast.fail('请输入纯汉字');
                return false;
            };

            
            that.$dataApi({
                url: "api/RoleManage/GetUserRoleByOpenId",
                method: "GET",
                data: {
                    openId: sessionStorage.getItem("openID"),
                },
            }).then((res) => {
                console.log(res);
                if(res.RoleManagement.SubscriptionKeywords > that.kdList.length || res.RoleManagement.SubscriptionKeywords == 0){
                    if(this.keyword.length>0){
                        if(this.kdList.indexOf(this.keyword)<0){
                            this.kdList.push(this.keyword)
                        }else {
                            console.log("已存在")
                        }
                    }  
                    this.industry.forEach((item,index)=>{
                        item.badge=0;
                        item.arr.forEach((arritem,index)=>{
                            this.kdList.forEach((kditem)=>{
                                if(kditem==arritem){
                                    item.badge++;
                                }
                            })
                        })
                        if(item.badge==0){
                            item.badge=null;
                        }
                    })
                }else{
                    if(res.RoleManagement.RoleName == '免费用户'){
                        that.codeShow = true;
                    }else if(res.RoleManagement.RoleName == '注册用户'){
                        Toast.fail('已超过关键词个数限制');
                    }
                };
              
            });
        },
        // 添加关键词进关键词列表
        addrkd:function(e){
            let that = this;
            if(this.kdList.indexOf(e)<0){ 

                that.$dataApi({
                    url: "api/RoleManage/GetUserRoleByOpenId",
                    method: "GET",
                    data: {
                        openId: sessionStorage.getItem("openID"),
                    },
                }).then((res) => {
                    if(res.RoleManagement.SubscriptionKeywords > that.kdList.length || res.RoleManagement.SubscriptionKeywords == 0){
                        this.kdList.push(e);
                    }else{
                        if(res.RoleManagement.RoleName == '免费用户'){
                            that.codeShow = true;
                        }else if(res.RoleManagement.RoleName == '注册用户'){
                            Toast.fail('已超过关键词个数限制');
                        }
                    }
                });
                

            }else {
                this.kdList.splice(this.kdList.indexOf(e),1)
            }  
            
            this.industry.forEach((item,index)=>{
                item.badge=0;
                item.arr.forEach((arritem,index)=>{
                    this.kdList.forEach((kditem)=>{
                        if(kditem==arritem){
                            item.badge++;
                        }
                    })
                })
                if(item.badge==0){
                    item.badge=null;
                }
            })
        },

        //移除选中的关键词
        deladdkdList:function(e){
            // console.log(e);
            this.kdList.remove(e)
        },

        changekeyword:function(e){
            if(e!=""){
                 this.onseach=true
            }    
        },

        onFocus:function(){
           if(this.keyword!=""){
                this.onseach=true
           }
        },
        noFocus:function(){
            this.onseach=false;
        },

        cityShow(){
            this.city = true
        },
        close1(){
            this.showCitypre = []
            // console.log(this.citys);
            var citLoag =  this.showCity1;
            this.$dataApi({
                url:"api/Area/GetAllProCity",
                method:"POST",
            }).then(res=>{
                console.log();
                this.showCity = JSON.parse(JSON.stringify(this.citys))  //选中的城市
                
                var that = this;
                var s = '';
                res.map((t,j)=>{
                    let y = t.CityList.map(function(v,i,arr){
                        return that.showCity.indexOf(v) !== -1
                    })
                    var x = y.every(f=>{
                        return f;
                    })
                    if(x){
                        t.CityList.map(t1=>{
                            this.showCity.splice(this.showCity.indexOf(t1),1)
                        })
                        if(j == 0){
                            if(this.showCitypre.indexOf('江苏') == -1){
                                this.showCitypre.push('江苏')
                            }
                        }else if(j == 1){
                            if(this.showCitypre.indexOf('北京') == -1){
                                this.showCitypre.push('北京')
                            }
                        }else if(j == 2){
                            if(this.showCitypre.indexOf('天津') == -1){
                                this.showCitypre.push('天津')
                            }
                        }else if(j == 3){
                            if(this.showCitypre.indexOf('河北') == -1){
                                this.showCitypre.push('河北')
                            }
                        }else if(j == 4){
                            if(this.showCitypre.indexOf('山西') == -1){
                                this.showCitypre.push('山西')
                            }
                        }else if(j == 5){
                            if(this.showCitypre.indexOf('内蒙古') == -1){
                                this.showCitypre.push('内蒙古')
                            }
                        }else if(j == 6){
                            if(this.showCitypre.indexOf('辽宁') == -1){
                                this.showCitypre.push('辽宁')
                            }
                        }else if(j == 7){
                            if(this.showCitypre.indexOf('吉林') == -1){
                                this.showCitypre.push('吉林')
                            }
                        }else if(j == 8){
                            if(this.showCitypre.indexOf('黑龙江') == -1){
                                this.showCitypre.push('黑龙江')
                            }
                        }else if(j == 9){
                            if(this.showCitypre.indexOf('上海') == -1){
                                this.showCitypre.push('上海')
                            }
                        }else if(j == 10){
                            if(this.showCitypre.indexOf('浙江') == -1){
                                this.showCitypre.push('浙江')
                            }
                        }else if(j == 11){
                            if(this.showCitypre.indexOf('安徽') == -1){
                                this.showCitypre.push('安徽')
                            }
                        }else if(j == 12){
                            if(this.showCitypre.indexOf('福建') == -1){
                                this.showCitypre.push('福建')
                            }
                        }else if(j == 13){
                            if(this.showCitypre.indexOf('江西') == -1){
                                this.showCitypre.push('江西')
                            }
                        }else if(j == 14){
                            if(this.showCitypre.indexOf('山东') == -1){
                                this.showCitypre.push('山东')
                            }
                        }else if(j == 15){
                            if(this.showCitypre.indexOf('河南') == -1){
                                this.showCitypre.push('河南')
                            }
                        }else if(j == 16){
                            if(this.showCitypre.indexOf('湖北') == -1){
                                this.showCitypre.push('湖北')
                            }
                        }else if(j == 17){
                            if(this.showCitypre.indexOf('湖南') == -1){
                                this.showCitypre.push('湖南')
                            }
                        }else if(j == 18){
                            if(this.showCitypre.indexOf('广东') == -1){
                                this.showCitypre.push('广东')
                            }
                        }else if(j == 19){
                            if(this.showCitypre.indexOf('广西') == -1){
                                this.showCitypre.push('广西')
                            }
                        }else if(j == 20){
                            if(this.showCitypre.indexOf('海南') == -1){
                                this.showCitypre.push('海南')
                            }
                        }else if(j == 21){
                            if(this.showCitypre.indexOf('重庆') == -1){
                                this.showCitypre.push('重庆')
                            }
                        }else if(j == 22){
                            if(this.showCitypre.indexOf('四川') == -1){
                                this.showCitypre.push('四川')
                            }
                        }else if(j == 23){
                            if(this.showCitypre.indexOf('贵州') == -1){
                                this.showCitypre.push('贵州')
                            }
                        }else if(j == 24){
                            if(this.showCitypre.indexOf('云南') == -1){
                                this.showCitypre.push('云南')
                            }
                        }else if(j == 25){
                            if(this.showCitypre.indexOf('西藏') == -1){
                                this.showCitypre.push('西藏')
                            }
                        }else if(j == 26){
                            if(this.showCitypre.indexOf('陕西') == -1){
                                this.showCitypre.push('陕西')
                            }
                        }else if(j == 27){
                            if(this.showCitypre.indexOf('甘肃') == -1){
                                this.showCitypre.push('甘肃')
                            }
                        }else if(j == 28){
                            if(this.showCitypre.indexOf('青海') == -1){
                                this.showCitypre.push('青海')
                            }
                        }else if(j == 29){
                            if(this.showCitypre.indexOf('宁夏') == -1){
                                this.showCitypre.push('宁夏')
                            }
                        }else if(j == 30){
                            if(this.showCitypre.indexOf('新疆') == -1){
                                this.showCitypre.push('新疆')
                            }
                        }else if(j == 31){
                            if(this.showCitypre.indexOf('澳门') == -1){
                                this.showCitypre.push('澳门')
                            }
                        }else if(j == 32){
                            if(this.showCitypre.indexOf('香港') == -1){
                                this.showCitypre.push('香港')
                            }
                        }else if(j == 33){
                            if(this.showCitypre.indexOf('台湾') == -1){
                                this.showCitypre.push('台湾')
                            }
                        }
                    }
                })
            
                this.showCity1 = this.showCity.toString();
                
                
                document.getElementsByClassName('pPrice')[0].innerHTML = this.citys == '' ? '全部' : this.showCity+' '+this.showCitypre;
                if(this.citys.length == 0){
                    // document.getElementsByClassName('pPrice')[0].innerHTML = '全国';
                    this.cit = false;
                    this.showCity1 = ''
                }else{
                    this.showCity1 = this.showCity.toString();
                }
                if(this.citys.length == 0 && this.showCitypre.length == 0){
                    this.showCity1 = '';
                    this.showCitypre = ''
                }
                // console.log( document.getElementsByClassName('pPrice')[0]);
                if((this.showCity.length+this.showCitypre.length) > 5){
                    this.cit = true;
                }else{
                    this.cit = false;
                }
                // console.log(this.showCity1);
                // console.log(this.showCitypre);
            })
            // this.showCitypre = []
        },
        //点击地区右边每一个城市
        clickItem(item,index){
            //点击的是不是全国
            if(this.o == 0){
                if(!this.items[0].IsShow){
                    this.items[0].IsShow = true;
                    this.citys = [];
                    this.itemss.map(item=>{
                        item.badge = ''
                    })
                }
            }else{
                //点击的是不是全部按钮
                if(item.text !== '全部'){   //点击的不是全部按钮
                    this.items[0].IsShow = false;
                    if(this.citys.indexOf(item.text) !== -1){ //已经被点击了的城市
                        this.citys.splice(this.citys.indexOf(item.text),1)
                        this.items[index].IsShow = false
                        var leng = 0;
                        this.items.map(item=>{
                            if(item.IsShow){
                                leng++;
                            };
                        })
                        this.itemss[this.o].badge = leng;
                        if(leng == 0){
                            this.itemss[this.o].badge = '';
                        }
                    }else{  //没有被点击的城市
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
                        this.itemss[this.o].badge = len
                    };
                }else{  //点击的是全部按钮
                    if(this.items[0].IsShow){
                        this.itemss[this.o].badge = '';
                        this.items[0].IsShow = false;
                        this.items.map(item=>{
                            item.IsShow = false;
                            if(this.citys.indexOf(item.text) !== -1){
                                this.citys.splice(this.citys.indexOf(item.text),1)
                            }
                        })
                    }else{
                        this.itemss[this.o].badge = this.items.length-1
                        this.items.map(item=>{
                            item.IsShow = true;
                            if(this.citys.indexOf(item.text) !== -1){
                                this.citys.splice(this.citys.indexOf(item.text),1)
                            }
                            this.citys.push(item.text)
                        })
                        this.items[0].IsShow = true
                    }
                }
            }
        
            if(this.citys.indexOf('全部') !== -1){
                this.citys.splice(this.citys.indexOf('全部'),1)
            };
            if(this.citys.length == 345){
                this.citys = [];
                this.itemss.map(item=>{
                    item.badge = ''
                });
                this.items.map(item=>{
                    item.IsShow = false
                });
                if(this.o == 0){
                    this.items = [{text:'全部',IsShow:true}];
                }
            }
        },
        //点击地区左边的每一个省份
        onNavClick(ind){
            // console.log(this.itemss[ind].text);
            
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

        getprovince:function(){
            let that = this;
            
            this.$dataApi({
                url:'api/Area/GetArea',
                method:'POST',
            }).then(response=>{
                that.contentdata=response;
                response.forEach((item,index)=>{
                that.ptype.push(item.AreaChar);
                })
                that.ptype= Array.from(new Set(that.ptype))
            })
            .catch(function (error) {
                console.log(error);
            });
        },
        
        // 获取搜索词高亮
        setGlkd:function(e){
            this.$dataApi({
                url:'api/Users/SearchKeyWordsByIndustry',
                method:'GET',
                data:{
                     keyWord:e,
                }
            }).then(response=>{
                console.log(response)
                this.searchKd=response.searchkd;
                 
                if(e.length > 0){
                    const searchVal = e;
                    // 匹配关键字正则
                    const replaceReg = new RegExp(searchVal, 'g')
                    // 高亮替换v-html值
                    const replaceString = `<font color='#F14F4A'>${searchVal}</font>`
                    for (let i = 0; i < this.searchKd.length; i++) {
                    // 开始替换
                        this.searchKd[i].text = this.searchKd[i].title.replace(replaceReg, replaceString).slice(0,90)
                    }
                }
            })  
        },

        //获取所有关键词
        GetAllIndustryKeyWords:function() {
            this.$dataApi({
                url:'api/Users/GetAllIndustryKeyWords',
                method:'GET',
                data:{}
            }).then(response=>{
                console.log(response);
                this.industry=response;
                this.rkdlist.push(this.industry[0].arr);
            })
        },

        onhyClick:function(e){
            this.activeIndex=e;
            this.rkdlist=[];
            this.rkdlist.push(this.industry[e].arr);
        },

        //关键词模糊查询
        SearchKeyWordsByIndustry:function(e){
            this.$dataApi({
                url:'api/Users/SearchKeyWordsByIndustry',
                method:'GET',
                data:{
                     keyWord:"工程"
                }
            }).then(response=>{
                // console.log(response)
            })
        },

        seveKd:function(){
            let that = this;
            // console.log(this.showCity1);
            // console.log(this.showCitypre.toString());
            console.log(that.kdList);
            if(that.kdList.length == 0){
                that.$router.push('/index');
            }else{
                that.$dataApi({
                    url:'api/Users/SaveMultipleKeywords',
                    method:'POST',
                    data:{
                        keywordArray:that.kdList,
                        Source:1,
                        openid:sessionStorage.getItem("openID"),
                        provinces:that.showCitypre.toString(),
                        cities:that.showCity1
                    }
                }).then(response=>{
                    console.log(response);
                    Toast.success('保存成功');
                    that.$router.push('/Keyinfolist');
                })
            }
            
        },

        //判断是否是会员
        IsSetUserKeyWord(){
            let that = this;
            that.$dataApi({
                url:'api/Users/IsSetUserKeyWord',
                method:'GET',
                data:{
                    openid: sessionStorage.getItem("openID"),
                }
            }).then(response=>{
                sessionStorage.setItem('UserIsVip',2);
                if(response.IsMember == 'False'){
                    this.isVip = false;
                }else{
                    this.isVip = true;
                }
            })
        },

        phoneReg() {
            // this.active = !this.active;
        },
        //发送验证码
        getsms() {
            let that = this;
            console.log(this.tel);
            if (that.fsyzmTrue) {
                const regMobile = /^1[3|4|5|7|8][0-9]{9}$/;
                if(!regMobile.test(that.tel)){
                    Toast.fail("手机号错误");
                    return false;
                }


                that.fsyzmTrue = false;
                var time = 60;
                that.fsyzm = time + " s";
                let timer = setInterval(function () {
                    time--;

                    that.fsyzm = time + " s";
                    if (time == 0) {
                        clearInterval(timer);
                        that.fsyzmTrue = true;
                        that.fsyzm = "获取验证码";
                    }
                }, 1000);

                //发送验证码
                let params = {};
                params.tele = that.tel;
                params.type = "mqy";
                that.$axios({
                    method: "post",
                    url:
                        "https://webservice.jshcsoft.com/SSMSAPI/sendmessage.ashx",
                    data: that.qs.stringify(params),
                }).then(function (response) {
                    console.log(response);
                });
            }
        },
        //确定按钮手机号
        phoneFin() {
            let that = this;
            if (that.tel.trim() == "" || that.sms.trim() == "") {
                Toast.fail("请将信息填写完成");
                that.codeShow = false;
            } else {
                let params = {};
                params.tele = that.tel;
                params.code = that.sms;
                params.type = "mqy";
                that.$axios({
                    method: "post",
                    url:
                        "https://webservice.jshcsoft.com/SSMSAPI/verifycode.ashx",
                    data: that.qs.stringify(params),
                }).then(function (response) {
                    if (response == true) {
                        Toast.success('注册成功');
                        that.getUpdateMember();
                        that.codeShow = false;
                        that.isVip = true;
                        
                    } else {
                        Toast.fail("验证码错误!!!");
                        that.sms = '';
                        that.isVip = false;
                    }
                });
            }
        },
        //确定按钮邀请码
        codeFin() {
            let that = this;
            if (that.code.trim() == "") {
                Toast.fail("邀请码为空");
                that.codeShow = false;
            } else {
                that.$dataApi({
                    url: "api/Users/RegistrationInvitationCode",
                    method: "POST",
                    data: {
                        openid: sessionStorage.getItem("openID"),
                        InvitationCode: that.code,
                        sex: sessionStorage.getItem("sex"),
                        language: sessionStorage.getItem("language"),
                        city: sessionStorage.getItem("city"),
                        province: sessionStorage.getItem("province"),
                        country: sessionStorage.getItem("country"),
                        headimgurl: sessionStorage.getItem("headimgurl"),
                        subscribe_time: sessionStorage.getItem(
                            "subscribe_time"
                        ),
                        remark: sessionStorage.getItem("remark"),
                        IsUpdate: sessionStorage.getItem("IsUpdate"),
                        nickname: sessionStorage.getItem("NickName"),
                        presubscribe_time: sessionStorage.getItem(
                            "presubscribe_time"
                        ),
                        Source: 1,
                    },
                }).then((res) => {
                    // console.log(res);
                    if (res.Msg == "邀请码错误") {
                        Toast.fail("邀请码错误");
                        that.code = '';
                        that.codeShow = false;
                    } else if (res.Msg == "邀请码已被使用") {
                        Toast.fail("邀请码已被使用");
                        that.code = '';
                        that.codeShow = false;
                    } else if (res.Msg == "true") {
                        Toast.success("邀请码使用成功");
                        that.code = '';
                        that.codeShow = false;
                        this.$router.go(0);
                    }
                });
            }
        },
        getUpdateMember() {
            let that = this;
            that.$dataApi({
                url: "api/Users/UpdateMember",
                method: "POST",
                data: {
                    openid: sessionStorage.getItem("openID"),
                    sex: sessionStorage.getItem("sex"),
                    language: sessionStorage.getItem("language"),
                    city: sessionStorage.getItem("city"),
                    province: sessionStorage.getItem("province"),
                    country: sessionStorage.getItem("country"),
                    headimgurl: sessionStorage.getItem("headimgurl"),
                    subscribe_time: sessionStorage.getItem("subscribe_time"),
                    remark: sessionStorage.getItem("remark"),
                    IsUpdate: sessionStorage.getItem("IsUpdate"),
                    nickname: sessionStorage.getItem("NickName"),
                    presubscribe_time: sessionStorage.getItem(
                        "presubscribe_time"
                    ),
                    Origin: 1,
                    EnterpriseName: "",
                    LinkMan: sessionStorage.getItem("NickName"),
                    LinkPhone: that.tel,
                    licenseUrl: "",
                    SourceJudgment: 1,
                },
            }).then(function (response) {
                console.log(response);
                if(response == 1){
                    // Toast.success("提交成功");
                    // that.yaoqingma();
                    // this.$router.go(0);
                }
            });
        },
        //取消免费注册弹框
        closeActive() {
            this.codeShow = false;
            this.tel = "";
            this.sms = "";
            this.code = "";
        },
    },

    created:function(){
        let that = this;
        this.hide();
        this.getprovince();
        this.GetAllIndustryKeyWords();
        this.SearchKeyWordsByIndustry();
        this.IsSetUserKeyWord();  //判断用户是否是会员
        this.$dataApi({
            url:'api/Area/GetArea',
            method:'POST',
        }).then(response=>{
            // console.log(response);
            that.itemss = JSON.parse(JSON.stringify(response))
            // that.contentdata=response;
            response.forEach((item,index)=>{
                // that.ptype.push(item.AreaChar);
                that.itemss[index].text = response[index].AreaName;
                that.itemss[index].badge = '';
            })
            // that.ptype= Array.from(new Set(that.ptype))
            that.itemss.unshift({text:'全国'})
            // console.log(that.itemss);
        })
        .catch(function (error) {
            console.log(error);
        });
       
    },
    beforeRouteLeave(to,from,next){
        this.show()
        next();
    }
}
</script>
<style lang='scss' scoped>

#blkeyword{
    position: fixed;
    font-family: PingFang SC;
    font-weight: 500;
    min-height: calc(100% - 1rem);
    background: #f8f8f8;
    // display: flex;
    // flex-direction: column;
}
.inpYQM{
    width: 80%;
}

.citymodel{
    height: 7.5rem;
    width: 100%;
    overflow: hidden;
    top: 4.6rem;
    border-top: 1px solid #EEEEEE;
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
    .cityBtnShow:nth-of-type(1){
        float: none;
        display: block;
    }
    .cityBtn:nth-of-type(1){
        float: none;
        display: block;
    }
    .onlistall{
        width:1.65rem;
        height:0.8rem;
        background:rgb(76, 168, 248);
        border-radius:0.1rem;
        margin-left: 0.1rem;
        font-size:0.28rem;
        font-family:PingFang SC;
        line-height: 0.8rem;
        color: white;
        text-align: center;
        border: none;
    }
    .listall{
        width:1.65rem;
        height:0.8rem;
        background:rgba(247,247,247,1);
        border-radius:0.1rem;
        margin-left: 0.1rem;
        font-size:0.28rem;
        font-family:PingFang SC;
        line-height: 0.8rem;
        text-align: center;
        border: none;
    }
 }

.addkd{
    width: 100%;
    height: auto;
    overflow: hidden;
    margin-top: 0.22rem;
    background-color: #FFFFFF;
    border-top: 1px solid #EEEEEE;
    span{
        display: block;
        margin-left: 0.39rem;
        text-align: left
    }
    span:nth-of-type(1){
        font-size: 0.3rem;
        line-height: 0.79rem;
    }
    span:nth-of-type(2){
        font-size: 0.26rem;
        color: #666666;
    }
    .wdinput{
        height: 0.5rem;
        margin-top: 0.2rem;
        .van-search{
            float: left;
            padding: 0;
            width: 5.4rem;
            margin-left: 0.4rem;
            height: 0.5rem;
            background-color: #EEEEEE;
            border-radius: 15px;
            .van-cell{
                padding: 0px 8px 0px 0 !important;
            }
        }
        button{
            // width: 1.1rem;
            height: 0.5rem;
            font-size: 0.26rem;
            float: right;
            margin-right: 0.4rem;
            background-color: #4CA9F9;
            border: none;
            color: #FFFFFF;
            border-radius: 10px;
            line-height: 0.4rem;
        }
    }
    .kdlist{
        width: 100%;
        overflow: hidden;
        margin-top: 0.28rem;
        margin-bottom: 0.2rem;
        span{
            float: left;
            line-height: 0.3rem;
            font-size: 0.26rem;
            font-weight: bold;
            margin-top: 0.1rem;
        }
        .list{
            float: left;
            margin-left: 0.19rem;
            ul{
                width: 5rem;
                li{ 
                    width: 1.5rem;
                    // padding: 0 0.3rem;
                    height: 0.56rem;
                    float: left;                  
                    font-size: 0.26rem;  
                    line-height: 0.5rem;
                    color: #FFFFFF;
                    // background-color: #4CA9F9;
                    margin-bottom: 0.15rem;
                    margin-right: 0.23rem;
                    position: relative;
                    img{
                        width: 0.2rem;
                        height: 0.2rem;
                        background-color: red;
                        position: absolute;
                        right: -0.05rem; 
                        border-radius: 20px;
                    }
                    .two{
                        height: 0.5rem;
                        width: 1.46rem;
                        // padding: 0 0.3rem;
                        background-color: #4CA9F9;
                        margin-top: 0.1rem;  
                        border-radius: 5px;  
                    }
                }
                li:nth-child(3n+3){
                    margin-right: 0;
                }
            }
        }
    }  
    .searmd{
        width: 5.4rem;
        overflow: hidden;
        border: 1px solid #EEEEEE;
        border-radius: 10px;
        margin-left: 0.4rem;
        position: absolute;
        z-index: 999;
        background-color: #FFFFFF;
        margin-top: 0.15rem;
        ul{
            overflow: hidden;
            margin-top: 0.2rem;
            li{
                font-size: 0.26rem;
                text-align: left;
                margin-left: 0.5rem;
                line-height: 0.5rem;
            }
        }
    } 
}

.icode{
    height: 0.9rem;
    width: 100%;
    background-color: #FFFFFF;
    border: 1px solid #EEEEEE;
    display: flex;
    align-items: center;
    span{
        display: block;
        float: left;
        font-size: 0.26rem;
        line-height: 0.9rem;
        margin-left: 0.4rem;
    }
    input{
        float: left;
        display: block;
        width: 3.4rem;
        height: 0.4rem;
        border-radius: 20px;
        border: 1px solid #E5E5E5;
        // margin-top: 0.26rem;
        height: 0.6rem;
        margin-left: 0.2rem;
        font-size: 0.26rem;
    }
}

.kwmodel{
    // flex: 1;
    width: 100%;
    overflow: hidden;
    margin-top: 0.22rem;
    background-color: #EEEEEE;
    border-top: 1px solid #DDDDDD;
    position: absolute;
    .hytitle{
        position: absolute;
        line-height: 0.8rem;
        font-size: 0.3rem;
        width: 2.2rem;
        height: 0.8rem;
        background-color: #FFFFFF;
        font-weight: bold;
        border-right: 1px solid #DDDDDD;
    }
    .hycss{
        font-size: 0.3rem;
        font-weight: bold;
        color: #333333;
    }
    .van-sidebar{
        width: 2.2rem;
    }
    .van-tree-select{
        // height: 100% !important;
    }
    .van-sidebar-item--select{
        background-color: #EEEEEE !important;
        color: #4CA9F9 !important;
        font-weight: bold !important;
    }
    .van-sidebar-item{
        background-color: #FFFFFF;
        font-size: 0.3rem;
    }
    .van-tree-select__content{
        background-color: #EEEEEE;
    }
    .van-tree-select__nav{
        border-right: 1px solid #DDDDDD;
        flex: none;
        margin-top: 0.8rem;
    }
    .title{
        display: block;
        margin-top: 0.25rem;
        font-size: 0.26rem;
        font-weight: bold;
        float: left;
        margin-left: 0.2rem;
    }
    .btnList{
        width: 100%;
        overflow: hidden;
        margin-bottom: 0.5rem;
        button{
            width: 1.46rem;
            padding: 0;
            height: 0.5rem;
            margin-top: 0.2rem;
            margin-left: 0.2rem;
            font-size: 0.26rem;
            background-color: #FFFFFF;
            border: none;
            float: left;
            border-radius: 5px;
        }
    }
     .kdBtnShow{
        background-color: #4CA9F9 !important;
        color: #FFFFFF;
    }
    .van-sidebar-item__info{
        background-color: #ee0a24 !important;
    }   
}

.ckbutton{
    width: 100%;
    height: 1rem;
    position: fixed;
    bottom: 0;
    background-color: #FFFFFF;
    button{
        width: 2.6rem;
        height: 0.6rem;
        background-color: #4CA9F9;
        color: #FFFFFF;
        font-size: 0.3rem;
        font-weight: bold;
        line-height: 0.6rem;
        margin: 0 auto;
        margin-top: 0.2rem;
        display: block;
        border: none;
    }
}
.phone {
    height: 5rem;
}
.register {
    display: flex;
    justify-content: space-around;
    height: 1rem;
    align-items: center;
    border-bottom: 1px solid #eee;
}
.register > div {
    height: 1rem;
    width: 50%;
    line-height: 1rem;
}

.registerBtnT {
    color: #0099ff;
}
.registerBtnF {
    color: #333;
}
.btnShowT {
    background: #006bdf;
    border: none;
    color: #fff;
    // width: 1.2rem;
    padding: 0 0.3rem;
    margin-right: 0.5rem;
    height: 0.6rem;
    border-radius: 0.1rem;
}
.btnShowF {
    background: #fff;
    border: 1px solid #999;
    color: #333;
    // width: 1.2rem;
    padding: 0 0.3rem;
    border-radius: 0.1rem;
    height: 0.6rem;
}
.btnbox1 {
    width: 100%;
    padding-top: 0.2rem;
    position: absolute;
    bottom: 0.2rem;
}
.ketWords{
    height: 1rem;
    background: #fff;
    // margin-top: 0.3rem;
}
.title{
    position: relative;
    height:1rem;
    font-size:0.28rem;
    font-family: PingFang SC;
    line-height:1rem;
    margin-left: 0.4rem;
    display: flex;
    justify-content: space-between;
}
.diqu{
    margin-right: 0.7rem;
    overflow: hidden;
    width: 70%;
    text-align: right;
    
}
.city{
    word-break: break-all !important;
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-line-clamp: 1;
    -webkit-box-orient: vertical;
}
.pPrice{
    margin: 0;
    height: 1rem;
    line-height: 1rem;
    width: 100%;
    margin: 0;
}
.img{
    position: absolute;
    top: 35%;
    left: 93%;
    width: 0.3rem;
    height: 0.3rem;
}
.i{
    position: absolute;
    top: 0;
    left: 90%;
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
.van-tree-select__nav{
    flex: none !important;
}
.van-tree-select{
    height: 100% !important;
}
.btnAdd{
    padding: 0 0.2rem;
}
.van-button--small{
    background: none;
    color: #006BDF;
}
.keyWordBox{
    height: 7rem !important;
}
</style>