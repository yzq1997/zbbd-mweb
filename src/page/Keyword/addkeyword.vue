<template>
    <div id="addkey">
        <van-divider />
        <van-cell-group>
            <van-field
                v-model="keyword"
                label="关键词"
                placeholder="请输入您关注的行业"
            />
            <van-field
                v-model="showCity1"
                label="选择地区"
                right-icon="arrow"
                @click='ispshowFilter'
                readonly 
            />
            <van-field
                v-model="GGTypename"
                label="信息类型"
                right-icon="arrow"
                @click='ispshowType'
                readonly 
            />
            <van-field
                v-model="excludeKeyWord"
                label="排除关键词"
                right-icon="arrow"
                @click='excludeKeyWords'
                readonly 
            />
        </van-cell-group>

        <!-- 省份选择 -->
        <van-popup v-model="pshowFilter" round  position="bottom" :style="{ height: '85%' }" @close="close">
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
            
        <van-popup v-model="pshowtype" round  position="bottom" :style="{ height: '40%' }">
                <div class="title">信息类型</div>
            <van-picker :columns="filterType" :item-height="40" @change="onChangeType" :default-index="defaultIndex" />
        </van-popup> 

        <button class="btn" @click="savekeyword()">确定</button>    
        <button v-if="this.$router.history.current.query.keyword !=undefined " class="btn-d" @click="delkeyword()">删除</button>   
    </div>
</template>

<script>
import { Toast ,TreeSelect} from 'vant';
import { mapMutations } from 'vuex'
export default {
    data(){
        return {
            keyword:"",
            GGType:0,
            defaultIndex:0,
            Province:"全国",
            ProvinceList:[],
            ptype:[],
            contentdata:[],
            pshowFilter:false,
            presult:[],
            result:[],
            checkedm:true,
            checked: true,
            pshowtype:false,
            filterType:[
                { text: '全部', value: 0},
                { text: '招标公告', value: 1 },
                { text: '变更公告', value: 2 },
                { text: '结果公告', value: 3 }],
            GGTypename:"全部",
            isedit:false,
            keywordslist:[],
            city:false,
            items:[{text:'全部',IsShow:false}],  //所有城市
            activeIds: [1, 2],
            activeIndex: 0,
            itemss:[], //所有的省份
            citys:[], //选中的城市
            citysFlag:[],
            o:0,//点击的省份索引
            cit: false,
            newArr:[],
            showCity:[],
            showCity1:'全国',
            showCityOne:'',
            showCityTwo:'',
            showCitypre:[],
            cityTrue:false,
            showCity2:'',
            newList:{},
            quanguo:false,
            excludeKeyWord:'',  //排除关键字
        }
    },

    methods:{
        ...mapMutations(['activeOne','show']),
        close(){
            this.$dataApi({
                url:"api/Area/GetAllProCity",
                method:"POST",
                // data:{
                //     province:this.itemss[ind].text
                // }
            }).then(res=>{
                this.showCity = JSON.parse(JSON.stringify(this.citys))  //选中的城市
                this.showCitypre = []
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
               
                if(this.citys.length == 0){
                    this.showCity1 = this.showCity2
                }else{
                    this.showCity1 =  this.showCitypre.toString()  + ' ' + this.showCity.toString();
                };
                
                if(this.citys[0] == '全国'){
                    this.showCity1 = '全国'
                }
                
            })
        },

        //点击地区右边每一个城市
        clickItem(item,index){
            //点击的是全国
            this.cityTrue = true;
            this.quanguo = false;
            if(this.o == 0){
                this.citys = ['全国'];
                this.quanguo = true;
                this.items=[
                    {text:'全部',IsShow:true}
                ]
                // this.showCity1 = '全国';
                this.itemss.map(item=>{
                    item.badge = ''
                });
            }else{
                if(item.text !== '全部'){   //点击的不是全部按钮
                    if(this.citys.indexOf('全国') !== -1){
                        this.citys.splice(this.citys.indexOf('全国'),1)
                    }
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
                                this.items[0].IsShow = true;
                            }
                        })
                        this.itemss[this.o].badge = len;
                    };
                }else{  //点击的是全部按钮\
                    if(this.citys.indexOf('全国') !== -1){
                        this.citys.splice(this.citys.indexOf('全国'),1)
                    }
                    
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
            this.o = ind;
            let that = this
            this.$dataApi({
                url:"api/Area/GetCity",
                method:"POST",
                data:{
                    province:this.itemss[ind].text
                }
            }).then(res=>{
                //点击的是不是全国按钮
                if(this.itemss[ind].text == '全国'){
                    this.items = [{text:'全部',IsShow:this.quanguo}]
                    if(this.citys[0] == '全国'){
                        this.items[0].IsShow = true;
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
                    };
                    this.newArr = JSON.parse(JSON.stringify(this.items))  //右边渲染的城市
                    this.newArr.shift();
                }
            })
        },

        ispshowFilter:function(){
          this.pshowFilter=true;
        },

        ispshowType:function(){
            this.pshowtype=true;
        },

        onChangeType(picker, value, index) {
           this.GGType=index;
            console.log(this.GGType)
           this.GGTypename=this.filterType[index].text;
        },

        toggle(index,item) {
             this.checkedm=false;
            if(this.presult.indexOf("全国")==0){
                this.presult.shift();
            }
            if(this.presult.indexOf(item) >-1){
                this.presult.splice(this.presult.indexOf(item),1);
            } else {
                this.presult.push(item);
            }
            if(this.presult.length==0){
                this.Province="";
            }else {
                this.Province=this.presult.join(",");
                this.ProvinceList=this.presult;
                this.$refs.checkboxes[index].toggle();
            }
        },
        
        remover(){
            this.checked=false;
            this.result=[];
            this.presult=[];
            this.Province="全国";
            this.ProvinceList=[];
             this.ProvinceList.push("全国");
            this.presult.push("全国");
        },

        getprovince:function(){
            let that = this;
            this.$dataApi({
                url:'api/Area/GetArea',
                method:'POST',
            }).then(response=>{
                that.itemss = JSON.parse(JSON.stringify(response))
                response.forEach((item,index)=>{
                    that.itemss[index].text = response[index].AreaName;
                    that.itemss[index].badge = '';
                })
                that.itemss.unshift({text:'全国'})
            })
            .catch(function (error) {
                console.log(error);
            });
        },

        savekeyword:function(){
            // console.log(this.keyword);
            sessionStorage.removeItem('flagkeyword');
            let han = /^[\u4e00-\u9fa5]+$/;
            if(!han.test(this.keyword)){
                Toast.fail('请输入纯汉字');
                return false;
            }

            
            if(this.keyword.replace(/\s+/g,"").length >11){
                Toast.fail("关键词长度不允许超过10个");
                return false
            }
            if((this.$router.history.current.query.keyword !== this.keyword) && (this.keywordslist.indexOf(this.keyword)>-1)){
                Toast.fail('您已有同样关键词');
                return false;
            }
            if( this.$router.history.current.query.keyword ==undefined && this.keyword.replace(/\s+/g,"").length > 0){
                this.$dataApi({
                    url:'api/Users/SaveKeyWord',
                    method:'POST',
                    dataType: 'JSON',
                    data: {
                        openid: sessionStorage.getItem("openID"),
                        keyword:this.keyword,
                        sex:sessionStorage.getItem("sex"),
                        language: sessionStorage.getItem("language"),
                        CityList: this.showCity.toString(),
                        // province: sessionStorage.getItem("province"),
                        // province: this.showCitypre.toString(),
                        country: sessionStorage.getItem("country"),
                        headimgurl: sessionStorage.getItem("headimgurl"),
                        subscribe_time: sessionStorage.getItem("subscribe_time") ,
                        remark: sessionStorage.getItem("remark"),
                        IsUpdate: sessionStorage.getItem("IsUpdate"),
                        nickname: sessionStorage.getItem("NickName"),
                        presubscribe_time:sessionStorage.getItem("presubscribe_time"),
                        ProvinceList:this.showCitypre.toString(),
                        GGType:this.GGType,
                        Source:1,
                        ExcludeKeywords:this.excludeKeyWord
                    },
                }).then(response=>{
                    if (response.Status == 200) {
                        sessionStorage.setItem("KeyWordCount",response.KeyWordCount)
                        Toast.success('添加成功');
                        if(this.$router.history.current.query.userId === 1){
                            this.$router.go(-1)
                        } else {
                            //链接部分使用
                            // if(sessionStorage.getItem('flagNum') !== '0'){
                            //     sessionStorage.setItem("KeyId", response.Data);
                            //     sessionStorage.setItem("keyword", this.keyword);
                            //     sessionStorage.setItem("GGType", this.GGType);
                            //     sessionStorage.setItem("ProvinceList",this.showCitypre.toString());
                            //     sessionStorage.setItem("FormatGGType", this.GGTypeText);
                            //     sessionStorage.setItem("CityList",this.showCity.toString());
                            //     sessionStorage.setItem('flagNum',0)
                            //     this.$router.push({ path: "/Keyinfolist" });
                            // }else{
                            //     this.$router.push({ path: "/keywords" });
                            // }

                            //正常使用
                            this.$router.push({ path: "/keywords" });
                        }
                    } else {
                        Toast.fail("添加失败" + response.Msg);
                    }    
                })
                }else if(this.$router.history.current.query.keyword !=undefined && this.keyword.replace(/\s+/g,"").length > 0){
                    this.$dataApi({
                    url:'api/Users/EditKeyWord',
                    method:'POST',
                    dataType: 'JSON',
                    data: {
                        keyword:this.keyword,
                        // ProvinceList: this.citys[0] == '全国' ? "" : (this.cityTrue ? (this.showCitypre.toString() == '' ? '' : this.showCitypre.toString()) : (this.showCitypre.toString() == '' ?this.showCityOne : this.showCitypre.toString())),
                        ProvinceList: this.citys[0] == '全国' ? "" : (this.citys.length == 0 ? this.showCityOne.toString() : this.showCitypre.toString()),
                        GGType:this.GGType,
                        KeyId:this.$router.history.current.query.KeyId,
                        Source:1,
                        // CityList:this.citys[0] == '全国' ? "" : (this.cityTrue ? (this.showCity.toString() == '' ? '' : this.showCity.toString()) : (this.showCity.toString() == '' ? this.showCityTwo : this.showCity.toString())),
                        CityList:this.citys[0] == '全国' ? "" : (this.citys.length == 0 ? this.showCityTwo.toString() : this.showCity.toString()),
                        excludeKeyWords:this.excludeKeyWord
                    },
                }).then(response=>{
                    if (response.Status == 200) {
                    Toast.success('修改成功');
                    // sessionStorage.setItem("ProvinceList",this.citys[0] == '全国' ? "" : (this.cityTrue ? (this.showCitypre.toString() == '' ? '' : this.showCitypre.toString()) : (this.showCitypre.toString() == '' ?this.showCityOne : this.showCitypre.toString())));
                    // sessionStorage.setItem("CityList",this.citys[0] == '全国' ? "" : (this.cityTrue ? (this.showCity.toString() == '' ? '' : this.showCity.toString()) : (this.showCity.toString() == '' ? this.showCityTwo : this.showCity.toString())));
                    // sessionStorage.setItem("keyword",this.keyword)
                    // sessionStorage.setItem("FormatGGType",this.GGTypename)
                    // sessionStorage.setItem("GGType",this.GGType)
                    // sessionStorage.setItem("KeyId",this.$router.history.current.query.KeyId)
                    this.$router.go(-1);
                      // this.$router.push({ path: "Keyinfolist",query:{newKey:this.keyword}});
                    } else {
                        Toast.fail("修改失败" + response.Msg);
                    }    
                })
            } 
            else{
                Toast.fail('请填写关键词');
            }
        },

        delkeyword:function(){
            this.$dataApi({
                url:'api/Users/DeleteKeyWord',
                method:'POST',
                dataType: 'JSON',
                data: {
                    id:this.$router.history.current.query.KeyId,
                    openid:sessionStorage.getItem("openID")
                },
            }).then(response=>{
                if (response.Status == 200) {
                    Toast.success('删除成功');
                    this.$router.push({ path: "/keywords" });
                } else {
                    Toast.fail("删除失败" + response.Msg);
                }    
            });
            sessionStorage.removeItem('ProvinceList1')
        },

        getuser:function(){
            this.$dataApi({
            url:'api/Users/GetUsers',
            method:'POST',
            data:{
                openid: sessionStorage.getItem("openID"),
                    ispage:1,
                    Source:1
                }
            }).then(response=>{
                sessionStorage.setItem("KeyWordCount",Number(response.KeyWordCount))
            })
        },   

        //排除关键词
        excludeKeyWords(){
            // console.log(this.keyword);
            if(this.keyword !== '' || this.keyword !== null){
                sessionStorage.setItem('flagkeyword',this.keyword);
            }
            // console.log(this.excludeKeyWord);
            if(this.excludeKeyWord){
                sessionStorage.setItem('ExcludeKey',this.excludeKeyWord)
            }
            this.$router.push('/excludeKeyWord');
        },
        
    },
    
    created:function(){
        

        this.$dataApi({
            url:'api/Users/SearchKeyWordsByOpenId',
            method:'POST',
            data:{
                openid:sessionStorage.getItem("openID"),
                Source:1
            }
        }).then(response=>{ 
            if (response.Status == 200) {
                JSON.parse(response.Data).Rows.map(item=>{
                  this.keywordslist.push(item.keyword);
                })
            } else {
                Toast.fail("查询失败" + response.Msg);
            }  
        })
        .catch(function (error) {
            console.log(error);
        });

        // console.log(this.$router.history.current.query);
        if(this.$router.history.current.query.keyword !=undefined){
            this.keyword=this.$router.history.current.query.keyword;
            this.showCityOne = this.$router.history.current.query.ProvinceList;
            this.showCityTwo = this.$router.history.current.query.citys;
            this.GGType=this.$router.history.current.query.GGType;
            this.GGTypename=this.$router.history.current.query.GGType==0?"全部":this.$router.history.current.query.FormatGGType;
            this.defaultIndex=this.$router.history.current.query.GGType;
            this.excludeKeyWord = this.$router.history.current.query.ExcludeKeywords
            this.presult=this.showCity1.split(",")
            if(this.presult.indexOf("全国")<0){
                this.checkedm=false;
            }
            if(this.showCityOne == '' && this.showCityTwo == ''){
                this.showCity1 = '全国'
            }else{
                this.showCity1 = this.showCityOne + ' ' + this.showCityTwo
            }
            this.showCity2 = this.showCity1;
        }
        this.getprovince();
        this.getuser();
        // console.log(this.excludeKeyWord);
    },
    beforeRouteEnter(to, from, next) {
        next(vm => {
            if(to.path === "/addkeyword" || to.path === '/Keyinfolist'){
                vm.show();
                vm.activeOne(1)
            };
            if(from.path === "/excludeKeyWord"){
                let exc = sessionStorage.getItem('ExcludeKey');
                let keyw = sessionStorage.getItem('flagkeyword');
                vm.excludeKeyWord = exc;
                vm.keyword = keyw;
            }
        })
    },
}
</script>

<style scoped>
    #addkey{
        width: 100%;
        overflow: auto;
    }
    .van-nav-bar{
        height: 1rem;
    }
    .van-divider{
        margin:none
    }
    .van-divider{
        margin: 0 auto;
    }
    .van-cell{
        height: 1rem;
        text-align: left;
        padding: 0 16px;
        line-height: 1rem !important;
    }
    .van-field__control:read-only{
        text-align: right !important;
    }
    .btn{
        background-color: #169BD5;
        height: 0.7rem;
        width: 6rem;
        font-size: 0.32rem;
        color: #ffffff;
        border: none;
        margin: 0 auto;
    }
    .btn-d{
        background-color: #FFFFFF;
        height: 0.7rem;
        width: 6rem;
        font-size: 0.32rem;
        color: #333333;
        border: none;
        border:1px solid rgba(204,204,204,1);
        display: block;
        margin-left: 0.75rem;
        margin-top: 0.2rem;
    }
    .title{
        font-size: 0.3rem;
        margin-top: 0.3rem;
    }
    .van-cell--clickable{
        height: 0.6rem;
    }
    .van-checkbox{
        margin-top: 0.1rem !important;
    }
    /* 城市 */
    .cityBtn{
        background: #fff;
        color: #333;
        border:none;
        background: rgba(247,247,247,1);
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
    .van-field__control{
        word-break: break-all;
        overflow: hidden;
        text-overflow: ellipsis;
        display: -webkit-box;
        -webkit-line-clamp: 1;
        -webkit-box-orient: vertical;
    }
   .van-tree-select{
        height: 100% !important;
    }
    .van-tree-select__nav{
        flex: none !important;
    }
</style>