<template>
    <div class="exportBox">
        <!-- 时间 -->
        <div class="time">
            <!-- <span class="pTime" style="width:1rem">时间</span> -->
            <div class="rqqj" ref="time">
                <van-cell title="选择日期区间" style="padding:0 0.5rem 0 0;display: flex;align-items: center;" :value="date" @click="show = true" />
                <van-calendar :default-date="morentime"  ref="checkbox"  :min-date="minDate" :max-date="maxDate"  v-model="show" type="range" @confirm="onConfirm" />
                <img class="img3" src="../../../public/image/icon-right.png" alt="">
            </div>
        </div> 

        <!-- 地区 -->
        <!-- <div class="region">
            <div class="title" style="margin-top: 0rem;width: auto;" @click='ispshowFilter'>
                <span class="dd" style="display: block;float: left;width:3rem;text-align: left;">地区:</span>
                <div class="diqu">
                    <div v-for="(item,index) in presult" :key="index" class="onlistall"   style="float: right;margin-bottom: 0.14rem;">
                        <span type='type'>{{item}}</span>
                    </div>
                </div>
                <i class="i" v-if="showdiqu">...</i>
                <img class="img" src="../../../public/image/icon-right.png" alt="">
            </div>
            <van-popup v-model="pshowFilter" round position="bottom"  :style="{ height: '85%' ,width:'100%' }">
                <van-cell clickable key="全国"   @click="remover()">
                    <van-checkbox  v-model="checkedm">全国</van-checkbox>
                </van-cell>
                <van-index-bar>
                <van-cell-group v-for="(titem, index) in ptype">
                <van-index-anchor :index="`${titem}`" style="text-align: left; background-color: #D3D3D3;" />
                <van-checkbox-group v-model="result">
                    <van-cell-group>
                    <van-cell
                        v-if="item.AreaChar == titem"
                        v-for="(item, index) in contentdata"
                        clickable
                        :key="index"
                        @click="toggle(index,item.AreaName)"
                    >
                        <van-checkbox style="margin-top: 0.1rem;" :name="item"  ref="checkboxes">{{item.AreaName}}</van-checkbox>
                    </van-cell>
                    </van-cell-group>
                </van-checkbox-group>
                </van-cell-group>
                </van-index-bar>
            </van-popup>
        </div>  -->
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

        <!-- 行业 -->
        <div class="industry">
            <div class="title" style="margin-top: 0rem;width: auto;"  @click='isindustry'>
                <span style="display: block;float: left;width:3rem;text-align: left;">行业:</span>
                <!-- <span style="float: right;display: block;margin-right: 0.5rem;"  >{{presult}}</span> -->
                <div class="diqu">
                    <div v-for="(item,index) in keyWords" :key="index" class="onlistall"   style="float:right;margin-bottom: 0.14rem;">
                        <span  type='type'>{{item}}</span>
                    </div>
                </div>
                <i class="i" v-if="showhangye">...</i>
                <img class="img" src="../../../public/image/icon-right.png" alt="">
            </div>
            <van-popup v-model="industry" round position="bottom" :style="{ height: '85%' ,width:'100%' }" >
                <div class="quanbu"><span ref="all" class="qb" @click="quanbu()">全部</span></div>
                <div class="main">
                    <div 
                        class="plate"
                        v-for="(item,index) in list"
                        :key="index"
                    >
                        <p class="p1"><span @click="keywordBox(item,index)" ref="keywordBox" class="span1">{{item.title}}</span></p>
                        <ul class="box">
                            <li 
                                class="keyword"
                                v-for="(item1 ,index) in item.arr"
                                :key="index"
                                @click="keyword(item1,index)"
                                ref="tet"
                            >
                                {{item1.tit}}
                            </li>
                        </ul>
                    </div>
                </div>
            </van-popup>
        </div>

        <!-- 关键词 -->
        <div class="ketWords">
            <div class="title" style="margin-top: 0rem;width: auto;"  @click='gokeyword'>
                <span style="display: block;float: left;width:3rem;text-align: left;">关键词:</span>
                <div class="diqu">
                    <div v-for="(item,index) in kwords" :key="index" class="onlistall"   style="float:right;margin-bottom: 0.14rem;">
                        <span type='type'>{{item}}</span>
                    </div>
                </div>
                <img class="img" src="../../../public/image/icon-right.png" alt="">
            </div>
        </div>

        <!-- 金额 -->
        <div class="ketWords">
            <div class="title" style="margin-top: 0rem;width: auto;"  @click='priceShow()'>
                <span style="display: block;float: left;width:3rem;text-align: left;">金额区间:</span>
                <div class="diqu" >
                    <span class="pPrice1">全部</span>
                </div>
                <img class="img" src="../../../public/image/icon-right.png" alt="">
            </div>
            
            <van-popup v-model="price2" round position="bottom" :style="{ height: '50%' ,width:'100%'}" @close="close">
                <p class="zbje_all"><button :class="this.priceBtn ? 'btn_zbje1 map' : 'btn_zbje3 map'" @click="zbjeOneBtn()">全部</button></p>
                <p class="price">价格区间( 从低到高  &nbsp;&nbsp;  单位:万元)</p>
                <div class="input_box">
                    <input oninput="value=value.match(/-?[0-9]*\.?[0-9]*/)" type="text" placeholder="起始金额" @click="zbjeOne()" v-model="zbjeOneLeft" @blur="zbjeOneL()">
                    <span>————</span>
                    <input oninput="value=value.match(/-?[0-9]*\.?[0-9]*/)" type="text" placeholder="结束金额" @click="zbjeOne()" v-model="zbjeOneRight" @blur="zbjeOneR()">
                </div>
                <div class="priceBtnBox">
                    <button class="btnc" @click="pricebtnbox(1)">重置</button>
                    <button class="btnq" @click="pricebtnbox(2)">确定</button>
                </div>
            </van-popup>
        </div>

        <!-- 关键词匹配方式 -->
        <div class="fangshi">
            <div class="title" style="margin-top: 0rem;width: auto;"  @click='fangshi()'>
                <span style="display: block;float: left;width:3rem;text-align: left;">关键词匹配方式:</span>
                <div class="diqu">
                    <div class="onlistall"   style="float:right;margin-bottom: 0.14rem;">
                        <span  type='type'>{{this.radio}}</span>
                    </div>
                </div>
                <img class="img" src="../../../public/image/icon-right.png" alt="">
            </div>
            <van-popup v-model="ppfs" round position="bottom" :style="{ height: '40%' ,width:'100%' }" >
                <p class="p-fangshi">关键词匹配方式</p>
                <van-radio-group v-model="radio">
                    <van-cell-group class="check">
                        <van-cell style="flex:0" title="按全文匹配" clickable @click="radio = '全文匹配'">
                        <template #right-icon>
                            <van-radio name="全文匹配" />
                        </template>
                        </van-cell>
                        <van-cell title="按标题匹配" clickable @click="radio = '标题匹配'">
                        <template #right-icon>
                            <van-radio name="标题匹配" />
                        </template>
                        </van-cell>
                    </van-cell-group>
                    </van-radio-group>
            </van-popup>
        </div>

        <!-- 信息类型 -->
        <div class="ggtype">
            <div class="title" style="margin-top: 0rem;width: auto;" @click='ggtype()'>
                <span style="display: block;float: left;width:3rem;text-align: left;">信息类型:</span>
                <div class="diqu" style="width:90%">
                    <div v-for="(item,index) in Gtypes" :key="index" class="onlistall"   style="float:right;margin-bottom: 0.14rem;">
                        <span type='type'>{{item}}</span>
                    </div>
                </div>
                <img class="img" src="../../../public/image/icon-right.png" alt="">
            </div>
            <van-popup v-model="isggtype" round position="bottom" :style="{ height: '40%' ,width:'100%' }" >
                <p class="p-fangshi">招标类型</p>
                <van-checkbox 
                    right-icon
                    class="GGtype"
                    style="font-size:16px" 
                    v-for="(item,index) in result1"
                    v-model="item.isshow"
                    :key="index"
                    @click="gtype(item,index)"
                >
                    {{item.text}}
                </van-checkbox>
            </van-popup>
        </div>

        <div class="btn">
            <button class="btnc" @click="chongzhi()">重置</button>
            <button class="btnq" @click="queding()">确定</button>
        </div>

    </div>
</template>

<script>
    import Vue from 'vue';
    import { Calendar,Popup,Cell, CellGroup,Checkbox, CheckboxGroup ,Toast ,TreeSelect } from 'vant';

    Vue.use(Calendar).use(Popup ).use(Cell).use(CellGroup).use(Checkbox).use(CheckboxGroup).use(Toast).use(TreeSelect );
    export default {
        data(){
            return {
                priceBtn:true,
                // date:`${ new Date().getFullYear() + '/' + Number(new Date().getMonth()+1)  +'/' + Number(new Date().getDate()-2) + '-' + new Date().getFullYear() + '/' + Number(new Date().getMonth()+1)  +'/' +new Date().getDate()}` ,
                date:'最近3天' ,
                show:false,
                minDate: new Date(2020, 5, 1),
                maxDate: new Date(),
                startTime:`${ new Date().getFullYear() + '/' + Number(new Date().getMonth()+1)  +'/' + new Date().getDate()}`,  //开始时间
                endTime:`${new Date().getFullYear() + '/' + Number(new Date().getMonth()+1)  +'/' +new Date().getDate()}`,
                typeallTime:false,
                pshowFilter:false,
                checkedm:true,
                result: [],
                presult:['全国'],
                diqu:'',
                ptype:[],
                contentdata:[],
                industry:false,  //行业弹框
                keyWords:["全部"],   //选择的单个行业
                ketwordsGroup:[], //选择的行业分类
                color:true, 
                list:[
                    {
                        title:"建筑工程",
                        num:0,
                        arr:[
                            { tit: "材料设备",id:0},
                            { tit: "工程施工",id:1 },
                            { tit: "勘察设计",id:2 },
                            { tit: "监理咨询" ,id:3},
                            { tit: "机电安装" ,id:4},
                        ]
                    },
                    {
                        title:"行政办公",
                        arr:[
                            { tit: "专用设备" ,id:5},
                            { tit: "办公用品" ,id:6},
                            { tit: "生活用品" ,id:7},
                            { tit: "办公家具" ,id:8},
                            { tit: "通用办公设备" ,id:9},
                        ]
                    },
                    {
                        title:"医疗卫生",
                        arr:[
                            { tit: "设备" ,id:10},
                            { tit: "耗材" ,id:11},
                            { tit: "药品" ,id:12},
                        ]
                    },
                    {
                        title:"服务采购",
                        arr:[
                            { tit: "仓库物流",id:13 },
                            { tit: "法律咨询",id:14 },
                            { tit: "物业" ,id:15},
                            { tit: "会计" ,id:16},
                            { tit: "审计" ,id:17},
                            { tit: "安保",id:18 },
                            { tit: "其他服务" ,id:19},
                            { tit: "广告宣传印刷",id:20 },
                        ]
                    },
                    {
                        title:"机械设备",
                        arr:[
                            { tit: "工程机械",id:21 },
                            { tit: "车辆" ,id:22},
                            { tit: "机床相关" ,id:23},
                            { tit: "机械零部件",id:24},
                            { tit: "其他机械设备",id:25 },
                        ]
                    },
                    {
                        title:"水利水电",
                        arr:[
                            { tit: "水利工程" ,id:26},
                            { tit: "发电工程",id:27 },
                            { tit: "航运工程",id:28 },
                            { tit: "其他工程" ,id:29},
                        ]
                    },
                    {
                        title:"能源化工",
                        arr:[
                            { tit: "仪器仪表" ,id:30},
                            { tit: "原材料" ,id:31},
                            { tit: "新能源" ,id:32},
                            { tit: "设备物资" ,id:33},
                            { tit: "化工产品" ,id:34},
                        ]
                    },
                    {
                        title:"弱点安防",
                        arr:[
                            { tit: "综合布线",id:35 },
                            { tit: "智能系统" ,id:36},
                            { tit: "智能家居" ,id:37},
                        ]
                    },
                    {
                        title:"信息技术",
                        arr:[
                            { tit: "软件开发",id:38 },
                            { tit: "运维服务" ,id:39},
                            { tit: "系统集成及安全" ,id:40},
                            { tit: "其他技术",id:41},
                        ]
                    },
                    {
                        title:"交通工程",
                        arr:[
                            { tit: "道路工程" ,id:42},
                            { tit: "轨道",id:43 },
                            { tit: "桥梁" ,id:44},
                            { tit: "隧道" ,id:45},
                            { tit: "其他工程" ,id:46},
                        ]
                    },
                    {
                        title:"市政设施",
                        arr:[
                            { tit: "道路设施" ,id:47},
                            { tit: "绿化" ,id:48},
                            { tit: "线路管网" ,id:49},
                            { tit: "综合项目" ,id:50},
                        ]
                    },
                    {
                        title:"农林牧渔",
                        arr:[
                            { tit: "生产物资",id:51},
                            { tit: "生产设备" ,id:52},
                            { tit: "相关服务",id:53 },
                        ]
                    },
                ],
                kwords:[],   //关键词
                ppfs:false,
                radio: '标题匹配',
                isggtype:false,
                result: [0,1,2,3],
                Gtypes:['全部'],
                result1:[
                    { text: '全部', value: 0,isshow:true},
                    { text: '招标公告', value: 1,isshow:false },
                    { text: '变更公告', value: 2,isshow:false },
                    { text: '结果公告', value: 3,isshow:false },
                ],
                exportKey:[],
                GGtype:[],
                IsImport:0,
                showdiqu:false,
                showhangye:false,
                keep:false,
                morentime:[new Date(Date.now()-1000*3600*72),new Date()],
                price2:false, //金额弹窗
                zbjeOneLeft:'', //金额输入框数据1
                zbjeOneRight:'', //金额输入框数据2
                city:false,
                items:[{text:'全部',IsShow:true}],  //所有城市
                activeIds: [1, 2],
                activeIndex: 0,
                itemss:[], //所有的省份
                citys:[], //选中的城市
                o:0,//点击的省份索引
                cit: false,
                showCity1:'',
                showCitypre:[],
            }
        },
        methods:{
            //前三天
            newDateFlag(){
                var day1 = new Date();
                day1.setTime(day1.getTime()-72*60*60*1000);
                this.startTime = day1.getFullYear()+"/" + (day1.getMonth()+1) + "/" + day1.getDate();
            },
            pricebtnbox(i){
                if(i == 1){
                    // console.log(1);
                    this.zbjeOneBtn()
                }else{
                    // console.log(this);
                    this.price2 = false;
                    this.close();
                }
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
            close(){
                if(this.zbjeOneLeft == '' && this.zbjeOneRight == ''){
                    document.getElementsByClassName('pPrice1')[0].innerHTML = `全部`
                    document.getElementsByClassName('map')[0].className = "btn_zbje1 map";
                }
                if( this.zbjeOneLeft == '' && this.zbjeOneRight !== ''){
                    document.getElementsByClassName('pPrice1')[0].innerHTML = `0万元~${this.zbjeOneRight}万元`
                }
                if(this.zbjeOneLeft !== '' && this.zbjeOneRight == ''){
                    document.getElementsByClassName('pPrice1')[0].innerHTML = `${this.zbjeOneLeft}万元起`
                }
                if(this.zbjeOneLeft !== '' && this.zbjeOneRight !== ''){
                    document.getElementsByClassName('pPrice1')[0].innerHTML = `${this.zbjeOneLeft}万元~${this.zbjeOneRight}万元`
                }
            },
            close1(){
                this.showCitypre = []
                // console.log(this.citys);
                var citLoag =  this.showCity1;
                this.$dataApi({
                    url:"api/Area/GetAllProCity",
                    method:"POST",
                }).then(res=>{
                    // console.log(res);
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
                    if((this.showCity.length+this.showCitypre.length) > 4){
                        this.cit = true;
                    }else{
                        this.cit = false;
                    }
                    // console.log(this.showCity1);
                    // console.log(this.showCitypre);
                })
                
                // this.showCitypre = []
                
                
            },
            chongzhi(){
                this.keep = true;
                sessionStorage.removeItem("exportKey");
                this.keyWords = ['全部'];
                this.date = `${ new Date().getFullYear() + '/' + Number(new Date().getMonth()+1)  +'/' + Number(new Date().getDate()-3) + '-' + new Date().getFullYear() + '/' + Number(new Date().getMonth()+1)  +'/' +new Date().getDate()}`;
                this.presult = ['全国']; 
                this.result = []
                this.kwords = [];
                this.radio = '标题匹配';
                this.Gtypes = ['全部']
                this.startTime = `${ new Date().getFullYear() + '/' + Number(new Date().getMonth()+1)  +'/' + Number(new Date().getDate()-3)}`;  //开始时间
                this.endTime= `${new Date().getFullYear() + '/' + Number(new Date().getMonth()+1)  +'/' +new Date().getDate()}`;
                this.$refs.checkbox.reset();
                this.gtype({value:0},0);
                
                this.priceBtn = true
                this.zbjeOneLeft = "";
                this.zbjeOneRight = "";
                
                document.getElementsByClassName('pPrice')[0].innerHTML = '全部'
                document.getElementsByClassName('pPrice1')[0].innerHTML = '全部'
                this.showCity1 = '';
                this.citys = [];
                this.cit = false;
                if(this.o == 0){
                    this.items = [{text:'全部',IsShow:true}];
                }else{
                    this.items.map(item=>{
                        item.IsShow = false
                    });
                }
                this.itemss.map(item=>{
                    item.badge = ''
                });
                this.quanbu();
            },
            queding(){
                // console.log(this.showCitypre);
                let obj = {
                    TimeBegin:this.startTime,   //开始时间
                    TimeEnd:this.endTime,
                    presult:this.showCitypre.toString(),  //地区
                    keywords:(this.keyWords.length == 54 || this.keyWords.indexOf("全部")>-1) ?"":this.keyWords.toString(), //行业
                    // this.keyWords.length == 54?"":this.keyWords.toString(),
                    kwords:sessionStorage.getItem("exportKey"), //关键词
                    radio:this.radio === "全文匹配" ? 1 : 0,   //匹配方式
                    Gtypes:this.GGtype.toString() === ""? 0:this.GGtype.toString(),   //信息类型
                    Cities:this.showCity1.toString() === ""? "":this.showCity1.toString(),  //地区
                    BeginAmount:this.zbjeOneLeft,  //起始金额
                    EndAmount:this.zbjeOneRight, //结束金额
                }
                
                sessionStorage.setItem("exportIsImport",this.IsImport)
                sessionStorage.setItem("exportKeyWord",obj.kwords)
                sessionStorage.setItem("exportMatchPattern",obj.radio)
                sessionStorage.setItem("exportTimeBegin",obj.TimeBegin)
                sessionStorage.setItem("exportProvinces",obj.presult)
                sessionStorage.setItem("exportTimeEnd",obj.TimeEnd)
                sessionStorage.setItem("exportGGType",obj.Gtypes)
                sessionStorage.setItem("exportIndustry",obj.keywords)
                sessionStorage.setItem("Cities",obj.Cities)
                sessionStorage.setItem("BeginAmount",obj.BeginAmount)
                sessionStorage.setItem("EndAmount",obj.EndAmount)
                this.$router.push({path:'/exportExcel',query:{from:1}})
            },
            formatDate(date) {
                return `${date.getFullYear()}/${date.getMonth() + 1}/${date.getDate()}`;
            },
            //时间区间
            onConfirm(date) {
                // console.log(date);
                this.typeallTime = false
                const [start, end] = date;
                this.show = false;
                // this.date = this.formatDate(date);
                this.date = `${this.formatDate(start)} - ${this.formatDate(end)}`;
                var y = date[0].getFullYear();
                var m = date[0].getMonth() + 1;
                m = m < 10 ? ('0' + m) : m;
                var d = date[0].getDate();
                d = d < 10 ? ('0' + d) : d;
                this.startTime = ''+y+'-'+m+'-'+d

                var y1 = date[1].getFullYear();
                var m1 = date[1].getMonth() + 1;
                m1 = m1 < 10 ? ('0' + m1) : m1;
                var d1 = date[1].getDate();
                d1 = d1 < 10 ? ('0' + d1) : d1;
                this.endTime = ''+y1+'-'+m1+'-'+d1;
               
            },
            ispshowFilter:function(){
                this.pshowFilter=true;
            },
            isindustry(){
                this.industry=true;

            },
            remover(){
                this.checked=false;
                this.result=[];
                this.presult=[];
                this.presult.push("全国");
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
                // console.log(this.presult);
                if(this.presult.length >=6){
                    this.showdiqu = true
                }else{
                    this.showdiqu = false
                }
                if(this.presult.length === 0){
                    this.checkedm = true
                    this.remover()
                }
                this.$refs.checkboxes[index].toggle();
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
            fangshi(){
                this.ppfs = true
            },
            ggtype(){
                this.isggtype = true
            },
            gtype(item,index){
                if(index === 0){
                    this.Gtypes = ['全部']
                    this.GGtype.push(item.value) 
                    this.result1.map(v=>{
                        if(v.value !== index){
                            v.isshow = false
                        }
                    })
                }else {
                    if(this.Gtypes.toString() == "全部"){
                        this.result1[0].isshow = false
                        this.Gtypes = []
                        this.Gtypes.push(item.text)
                        this.GGtype.push(item.value)
                    }else{
                        if(item.isshow === false){
                            let i = this.Gtypes.indexOf(item.text)
                            this.Gtypes.splice(i,1)
                            
                            let j = this.GGtype.indexOf(item.value)
                            this.GGtype.splice(j,1)
                        }else{
                            this.Gtypes.push(item.text)
                            this.GGtype.push(item.value)
                            this.result1.map(n=>{
                                if(n.value === 0){
                                    n.isshow = false
                                }
                            })
                        }
                    }
                    
                }
                if(this.Gtypes.length === 0){
                    this.Gtypes = ['全部']
                    // this.GGtype.push(item.value) 
                    this.result1[0].isshow = true
                }
            },

            //行业方法
            //点击全部
            quanbu(){
                // console.log(this.$refs.tet[]);
                this.keyWords = ["全部"]
                this.showhangye = false;
                this.ketwordsGroup = []
                if(!this.color){
                    this.$refs.all.style.background = "#CEF0FF";
                    this.color = true
                    // console.log(this.$refs.tet);
                    //让所有的行业颜色变成白色
                    for(let i =0;i<this.$refs.tet.length;i++){
                        // console.log(i);
                        // console.log(this.$refs.tet[i].innerText);
                        this.keyWords.push(this.$refs.tet[i].innerText)
                        this.$refs.tet[i].style.background = "#FFFFFF";
                    }
                    //让所有的行业分类颜色变成白色
                    for(let k=0;k<this.$refs.keywordBox.length;k++){
                        // console.log(k);
                        this.$refs.keywordBox[k].style.background = "#FFFFFF";
                    }
                    this.keyWords = ["全部"]   //全部的话就传递空数组
                    // console.log(this.keyWords);
                }else{
                    // console.log(this.$refs.all);
                    if(this.$refs.all){
                        this.$refs.all.style.background = "#FFFFFF";
                        this.color = false
                    }
                  
                }
                
            },
            //点击行业分类
            keywordBox(e,i){
                //是否已经点击了全部
                this.showhangye = true;
                if(this.color){
                    this.keyWords = []
                    this.$refs.all.style.background = "#FFFFFF";
                    this.color = false
                }

               
                if(this.ketwordsGroup.indexOf(e.title) === -1){
                    //当你点击了单个行业之后又点击行业分类
                    for(let o=0;o<e.arr.length;o++){
                        this.$refs.tet[e.arr[o].id].style.background = "#CEF0FF";
                    }
                    
                    this.ketwordsGroup.push(e.title)
                    for(let j=0;j<e.arr.length;j++){
                        this.keyWords.push(e.arr[j].tit)
                    }
                    this.$refs.keywordBox[i].style.background = "#CEF0FF";
                }else{
                    for(let o=0;o<e.arr.length;o++){
                        this.$refs.tet[e.arr[o].id].style.background = "#FFFFFF";
                    }
                    this.$refs.keywordBox[i].style.background = "#FFFFFF";
                    for(let l=0;l<e.arr.length;l++){
                        this.keyWords = this.keyWords.filter(item => {
                            return item !== e.arr[l].tit;
                        });
                    }
                    this.ketwordsGroup = this.ketwordsGroup.filter(item => {
                        return item !== this.$refs.keywordBox[i].innerText;
                    });
                }
                if(this.ketwordsGroup.length > 1 || this.ketwordsGroup.length === 1){
                    // console.log(this.ketwordsGroup);
                    this.showhangye = true;
                }else{
                    // console.log(this.ketwordsGroup);
                    this.quanbu()
                    this.keyWords = ["全部"],
                    this.showhangye = false;
                }
            },
            //点击单个行业
            keyword(e,i){
                let that = this
                if(e.id>=0 && e.id<5){
                    let n = 0
                    that.$refs.keywordBox[n].style.background = "#FFFFFF";
                    that.ketwordsGroup = that.ketwordsGroup.filter(item => {
                        return item !== that.$refs.keywordBox[n].innerText;
                    });
                    
                }else if(e.id>=5 && e.id<10){
                    let n = 1
                    that.$refs.keywordBox[n].style.background = "#FFFFFF";
                    that.ketwordsGroup = that.ketwordsGroup.filter(item => {
                        return item !== that.$refs.keywordBox[n].innerText;
                    });
                }else if(e.id>=10 && e.id<13){
                    let n = 2
                    that.$refs.keywordBox[n].style.background = "#FFFFFF";
                    that.ketwordsGroup = that.ketwordsGroup.filter(item => {
                        return item !== that.$refs.keywordBox[n].innerText;
                    });
                }else if(e.id>=13 && e.id<21){
                    let n = 3
                    that.$refs.keywordBox[n].style.background = "#FFFFFF";
                    that.ketwordsGroup = that.ketwordsGroup.filter(item => {
                        return item !== that.$refs.keywordBox[n].innerText;
                    });
                }else if(e.id>=21 && e.id<26){
                    let n = 4
                    that.$refs.keywordBox[n].style.background = "#FFFFFF";
                    that.ketwordsGroup = that.ketwordsGroup.filter(item => {
                        return item !== that.$refs.keywordBox[n].innerText;
                    });
                }else if(e.id>=26 && e.id<30){
                    let n = 5
                    that.$refs.keywordBox[n].style.background = "#FFFFFF";
                    that.ketwordsGroup = that.ketwordsGroup.filter(item => {
                        return item !== that.$refs.keywordBox[n].innerText;
                    });
                }else if(e.id>=30 && e.id<35){
                    let n = 6
                    this.$refs.keywordBox[n].style.background = "#FFFFFF";
                    this.ketwordsGroup = this.ketwordsGroup.filter(item => {
                        return item !== this.$refs.keywordBox[n].innerText;
                    });
                }else if(e.id>=35 && e.id<38){
                    let n = 7
                    this.$refs.keywordBox[n].style.background = "#FFFFFF";
                    this.ketwordsGroup = this.ketwordsGroup.filter(item => {
                        return item !== this.$refs.keywordBox[n].innerText;
                    });
                }else if(e.id>=38 && e.id<42){
                    let n = 8
                    this.$refs.keywordBox[n].style.background = "#FFFFFF";
                    this.ketwordsGroup = this.ketwordsGroup.filter(item => {
                        return item !== this.$refs.keywordBox[n].innerText;
                    });
                }else if(e.id>=42 && e.id<47){
                    let n = 9
                    this.$refs.keywordBox[n].style.background = "#FFFFFF";
                    this.ketwordsGroup = this.ketwordsGroup.filter(item => {
                        return item !== this.$refs.keywordBox[n].innerText;
                    });
                }else if(e.id>=47 && e.id<51){
                    let n = 10
                    this.$refs.keywordBox[n].style.background = "#FFFFFF";
                    this.ketwordsGroup = this.ketwordsGroup.filter(item => {
                        return item !== this.$refs.keywordBox[n].innerText;
                    });
                }else if(e.id>=51 && e.id<54){
                    let n = 11
                    this.$refs.keywordBox[n].style.background = "#FFFFFF";
                    this.ketwordsGroup = this.ketwordsGroup.filter(item => {
                        return item !== this.$refs.keywordBox[n].innerText;
                    });
                }
                
                //是否已经点击了全部
                if(that.color){
                    that.keyWords = []
                }
                this.$refs.all.style.background = "#FFFFFF";
                this.color = false
                if(this.keyWords.indexOf(e.tit) > -1){
                    this.$refs.tet[e.id].style.background = "#FFFFFF";
                    this.keyWords = this.keyWords.filter(item => {
                        return item !== this.$refs.tet[e.id].innerText;
                    });
                }else{
                    
                    if(that.keyWords.indexOf('全部')>-1){
                        let i = that.keyWords.indexOf('全部')
                        that.keyWords.splice(i,1)
                    }
                    that.keyWords.push(e.tit)
                    that.$refs.tet[e.id].style.background = "#CEF0FF";
                }
                if(this.keyWords.length >=3){
                    this.showhangye = true;
                }else{
                    this.showhangye = false;
                }
                if(this.keyWords.length === 0){
                    
                    this.quanbu()
                }
            },
            //关键词
            gokeyword(){
                this.$router.push({ path: "/addkeywords"})
            },

            //点击金额
            priceShow(){
                this.price2 = true;
                // this.priceNumShow = true
            },
            //点击招标金额按钮
            zbjeOneBtn(){
                this.priceBtn = true
                this.zbjeOneLeft = "";
                this.zbjeOneRight = "";
            },
            //点击招标金额输入框
            zbjeOne(){
                this.priceBtn = false
            },
            //金额判断
            zbjeOneL(){
                if(Number(this.zbjeOneRight) <= Number(this.zbjeOneLeft) && this.zbjeOneRight !== ""){
                    Toast.fail('请输入正确的金额(低到高)');
                    this.zbjeOneLeft = '';
                    this.zbjeOneRight = '';
                    document.getElementsByClassName('map')[0].className = "btn_zbje1 map";
                }
            },
            zbjeOneR(){
                if(Number(this.zbjeOneRight) <= Number(this.zbjeOneLeft) && this.zbjeOneRight !== ""){  //this.zbjeOneRight !== ""
                    Toast.fail('请输入正确的金额(低到高)');
                    this.zbjeOneLeft = '';
                    this.zbjeOneRight = '';
                    document.getElementsByClassName('map')[0].className = "btn_zbje1 map";
                }
            },
            cityShow(){
                this.city = true
            },
            
        },
        created(){
            this.newDateFlag();
            this.getprovince();
            let that = this;
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
        beforeRouteEnter(to, from, next) {
           next(vm => {
               if(sessionStorage.getItem('exportKey')!=null){
                    vm.kwords = sessionStorage.getItem('exportKey').split('').reverse().join('')
                from.meta.keepAlive = true
               }
               
            })
        },
        beforeRouteLeave (to, from, next) {
            if(to.path !== null && this.keep === true){
                to.meta.keepAlive = false
                sessionStorage.setItem("cz",1)
            }
            this.keep = false;
            next()
        }
    }
</script>

<style scoped>
    .priceBtnBox{
        /* margin-top: 0.5rem; */
        margin-bottom: 0.5rem;
    }
    .van-overlay{
        top: 0;
    }
    .exportBox{
        height: 100%;
        background: #F5F5F9;
        display: flex;
        flex-direction: column;
    }
    .time{
        width: 100%;
        height: 1.2rem;
        text-align: left;
        background: #fff;
        display: flex;
        align-items: center;
        margin-top: 0.3rem;
    }
    .pTime{
        font-size: 16px;
        margin-left: 5%;
    }
    .rqqj{
        position: relative;
        margin-left: 5%;
        line-height: 44px;
        height: 0.8rem;
        width: 100%;
        display: flex;
        align-items: center;
        justify-content: space-around;
        background: #fff;
    }
    .region{
        height: 1.2rem;
        background: #fff;
        margin-top: 0.3rem;
    }
    .title{
        position: relative;
        color: #000;
        height:1.2rem;
        font-size:0.28rem;
        font-family:PingFang SC;
        line-height:1.2rem;
        margin-left: 0.4rem;
        display: flex;
        justify-content: space-between;
    }
    .onlistall{
        font-size:0.28rem;
        font-family:PingFang SC;
    }
    .diqu{
        margin-right: 0.7rem;
        overflow: hidden;
        width: 70%;
        text-align: right;
        
    }
    .img{
        position: absolute;
        top: 37%;
        left: 93%;
        width: 0.3rem;
        height: 0.3rem;
    }
    .i{
        position: absolute;
        top: 0;
        left: 90%;
    }
    .industry{
        height: 1.2rem;
        background: #fff;
        margin-top: 0.3rem;
    }

    /* 地区 */
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

    /* 行业样式 */
    .qb{
        font-size: 14px;
        width: 18%;
        border: 1px solid rgb(185, 178, 178);
        background: #CEF0FF;
        padding: 2px;
        border-radius: 3px;
        margin-left: 5%;
        margin-top: 5%;
    }
    .quanbu{
        display: flex;
    }
    .main{
        overflow: hidden;
        margin-bottom: 1rem;
    }
    .plate{
        margin-top: 10px;
        border-top: 1px solid rgb(221, 210, 210);
    }
    .p1{
        font-size: 14px;
        height: 22px;
        line-height: 20px;
        display: flex;
        margin: 0;
        margin-top: 10px;
    }
    .box{
        margin-left: 5%;
        display: flex;
        flex-wrap: wrap;
    }
    .keyword{
        height: 0.48rem;
        padding: 0 0.2rem 0 0.2rem;
        border: 1px solid rgb(185, 178, 178);
        border-radius: 3px;
        line-height: 0.48rem;
        font-size: 14px;
        margin-top: 10px;
        margin-right: 3%;
        color: rgb(134, 130, 130);
    }
    .btn1{
        border: 1px solid rgb(153, 146, 146);
        width:1.65rem;
        height:0.8rem;
        background:rgba(247,247,247,1);
        border-radius:0.1rem;
        margin-left: 0.1rem;
        font-size:0.28rem;
        font-family:PingFang SC;
        line-height: 0.8rem;
    }
    .btn2{
        border: none;
        width:1.65rem;
        height:0.8rem;
        background:rgb(76, 168, 248);
        border-radius:0.1rem;
        margin-left: 0.1rem;
        font-size:0.28rem;
        font-family:PingFang SC;
        line-height: 0.8rem;
        color: white;
    }
    .span1{
        border: 1px solid rgb(185, 178, 178);
        border-radius: 3px;
        margin-left: 5%;
        width: 1.46rem;
        height: 0.48rem;
        line-height: 0.48rem;
        color: rgb(0, 0, 0);
    }
    .img2{
        position: absolute;
        top: 37%;
        left: 93%;
        width: 0.3rem;
        height: 0.3rem;
    }

    /* 关键词样式 */
    .ketWords{
        height: 1.2rem;
        background: #fff;
        margin-top: 0.3rem;
    }
    .img3{
        position: absolute;
        top: 33%;
        left: 93%;
        width: 0.3rem;
        height: 0.3rem;
    }

    /* 关键词匹配方式 */
    .fangshi{
        height: 1.2rem;
        margin-top: 0.3rem;
        background: #fff;
    }
    
    .p-fangshi{
        font-size: 16px;
    }
    .van-cell__title{
        text-align: left;
    }

    /* 信息类型 */
    .ggtype{
        height: 1.2rem;
        margin-top: 0.3rem;
        background: #fff;
    }
    .img4{
        position: absolute;
        top: 37%;
        left: 93%;
        width: 0.3rem;
        height: 0.3rem;
    }

    .btnc{
        font-size: 0.32rem;
        width: 1.5rem;
        height: 0.6rem;
        border: 1px solid rgb(134, 132, 132);
        border-radius: 5px;
        background: #fff;
    }
    .btnq{
        border-radius: 5px;
        font-size: 0.32rem;
        width: 1.5rem;
        height: 0.6rem;
        color: #fff;
        border: none;
        background: #1890FF;
    }
    .GGtype{
        padding: 0.1rem 0.2rem;
        display: flex;
        justify-content: end;
    }

    .my-class{
        text-align: left;
    }
    /* 金额 */
    .zbje{
        font-size: 0.3rem;
        margin-left: 0.35rem;
        text-align: left;
    }
    .zbje_all{
        font-size: 0.3rem;
        text-align: left;
        margin-left: 0.35rem;
    }
    .price{
        font-size: 0.3rem;
        text-align: left;
        margin-left: 0.35rem;
    }
    .btn_zbje1,.btn_zbje2{
        background: #4CA8F8;
        border:none;
        color: #fff;
        width: 1.65rem;
        height: 0.8rem;
        border-radius: 0.1rem;
        font-size: 0.28rem;
        font-family: PingFang SC;
    }
    .btn_zbje3{
        background: #fff;
        color: #333;
        border: 1px solid rgb(112, 110, 110);
        width: 1.65rem;
        height: 0.8rem;
        border-radius: 0.1rem;
        font-size: 0.28rem;
        font-family: PingFang SC;
    }
    .input_box{
        font-size: 0.3rem;
        display: flex;
        justify-content: center;
        align-items: center;
    }
    .input_box>input{
        width: 35%;
        border: 1px solid #666666;
        border-radius: 0.35rem;
    }
    input{
        height: 0.5rem;
        text-align: left;
        font-size: 0.3rem;
        border: 1px solid #999;
    }
    .pPrice{
        margin: 0;
        height: 1.2rem;
        line-height: 1.2rem;
        width: 100%;
        margin: 0;
    }
    /* 城市 */
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
    .city{
        word-break: break-all !important;
        overflow: hidden;
        text-overflow: ellipsis;
        display: -webkit-box;
        -webkit-line-clamp: 1;
        -webkit-box-orient: vertical;
    }
    .van-tree-select__nav{
        flex: none !important;
    }
    .van-tree-select{
        height: 100% !important;
        margin-bottom: 1rem !important;
    }
    .van-calendar__popup{
        margin-bottom: 1rem;
    }
</style>