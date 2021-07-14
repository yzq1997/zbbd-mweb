<template>
    <div class="bigBox">
        <van-tabs v-model="active" style="margin-bottom: 0rem;heigth:100%"  class="tabbox" swipe-threshold=7 >
            
            
            <van-tab title="类型"  class="qqq1 q_type">
                <div class="tyoe-list-type">
                    <div :class="[ typeall ?  'onlistall'  :'listall' ]" @click='changetypeIndex(0,0)'>
                        <span>全部</span>
                    </div>
                    <div v-for="(item,index) in filterType" :key="index" :class="[ typelist.indexOf( item.value )!=-1 && !typeall ?  'onlistall'  :'listall' ]" @click='changetypeIndex(index,item.value)' style="float: left;margin-bottom: 0.4rem;margin-top: 0.14rem;">
                        <span type='type'>{{ item.text}}</span>
                    </div>
                </div>
            </van-tab>

            <van-tab title="时间"  class="qqq1 q_type">
                <div class="tyoe-list-type">
                    <div :class="[ typeallTime ?  'onlistall'  :'listall' ]" @click='changetypeIndexTime(0,0)'>
                        <span>全部</span>
                    </div>
                    <div v-for="(item,index) in timer" :key="index" :class="[ typelistTime.indexOf( item.value )!=-1 && !typeallTime ?  'onlistall'  :'listall' ]" @click='changetypeIndexTime(index,item.value)' style="float: left;margin-bottom: 0.4rem;margin-top: 0.14rem;">
                        <span type='type'>{{ item.data}}</span>
                    </div>
                </div>

                <div class="rqqj" ref="time">
                    <van-cell title="选择日期区间" style="padding:0 10% 0 0;display: flex;align-items: center;" :value="date" @click="show = true" />
                    <van-calendar  ref="checkbox" style="padding-right:10%"  :min-date="minDate" :max-date="maxDate"  v-model="show" type="range" @confirm="onConfirm">
                        测试
                    </van-calendar>
                </div>
                <div class="btn-box1">
                    <van-button  @click="chongzhi2()" class="btn1" type="default">重置</van-button>
                    <van-button @click="getData()" class="btn2" type="info">确定</van-button>
                </div> 
            </van-tab>

            <van-tab title="地区">
                <van-tree-select
                    :items="itemss"
                    :active-id.sync="activeIds"
                    :main-active-index.sync="activeIndex"
                    @click-nav="onNavClick" 
                    :style="{'height':getClientHeight}"
                >
                    <template #content>
                        <button v-for="(item,index) in items" :key="index" :class="[item.IsShow ? 'cityBtnShow' : 'cityBtn']" @click="clickItem(item,index)">
                            {{item.text}}
                        </button> 
                    </template>
                </van-tree-select>
            </van-tab>

            <!-- <van-tab title="地区"  class="qqq1">
                <div>
                    <van-cell clickable key="全国"   @click="remover()">
                        <van-checkbox style="margin-top: 0.1rem;" v-model="checkedm">全国</van-checkbox>
                    </van-cell>
                    <van-index-bar>
                    <van-cell-group v-for="(titem, index) in ptype">
                    <van-index-anchor :index="`${titem}`" style="text-align: left; background-color: #D3D3D3;" />
                    <van-checkbox-group v-model="result">
                        <van-cell
                            v-if="item.AreaChar == titem"
                            v-for="(item, index) in contentdata"
                            clickable
                            :key="index"
                            @click="toggle(index,item.AreaName)"
                        >
                            <van-checkbox style="margin-top: 0.1rem;" :name="item"  ref="checkboxes">{{item.AreaName}}</van-checkbox>
                        </van-cell>
                    </van-checkbox-group>
                    </van-cell-group>
                    </van-index-bar>
                    </div>
            </van-tab> -->

            <van-tab title="金额" class="q_type">
                <p class="zbje_all"><button :class="this.priceBtn ? 'btn_zbje1 map' : 'btn_zbje3 map'" @click="zbjeOneBtn()">全部</button></p>
                <p class="price">价格区间(单位：万元)</p>
                <div class="input_box">
                    <input class="priceInput" oninput="value=value.match(/-?[0-9]*\.?[0-9]*/)" type="text" placeholder="起始金额" @click="zbjeOne()" v-model="zbjeOneLeft" @blur="zbjeOneL()">
                    <span style="color:#4CA9F9;">————</span>
                    <input class="priceInput" oninput="value=value.match(/-?[0-9]*\.?[0-9]*/)" type="text" placeholder="结束金额" @click="zbjeOne()" v-model="zbjeOneRight" @blur="zbjeOneR()">
                </div>
                <!-- <van-divider :style="{ borderColor: '#999',}"/>
                <p class="zbje">中标金额</p>
                <p class="zbje_all"><button class="btn_zbje2 mapTwo" @click="zbjeTwoBtn()">全部</button></p>
                <p class="price">价格区间(单位：万元)</p>
                <div class="input_box">
                    <input oninput="value=value.match(/-?[0-9]*\.?[0-9]*/)" type="text" placeholder="起始金额" @click="zbjeTwo()" v-model="zbjeTwoLeft" @blur="zbjeTwoL()">
                    <span>————</span>
                    <input oninput="value=value.match(/-?[0-9]*\.?[0-9]*/)" type="text" placeholder="结束金额" @click="zbjeTwo()" v-model="zbjeTwoRight" @blur="zbjeTwoR()">
                </div> -->
            </van-tab>

            <van-tab title="范围"  class="qqq1 q_type">
                <van-radio-group v-model="radio" class="fwBox" direction="horizontal">
                    <van-radio class="fw1" name="0">全部</van-radio>
                    <van-radio class="fw1" name="1">个人</van-radio>
                </van-radio-group>
            </van-tab>

            <van-tab title="行业" class="qqq1 q_type" >
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
            </van-tab>

               
        </van-tabs>
        <div class="btn-box1">
            <van-button @click="chongzhi()" class="btn1" type="default">重置</van-button>
            <van-button @click="getData()" class="btn2" type="info">确定</van-button>
        </div> 
        
    </div>
</template>

<script>
    import Vue from "vue";
    import { Tab, Tabs, Button ,Calendar ,Divider ,Toast ,TreeSelect } from "vant";
    Vue.use(Tab).use(Tabs).use( Button ).use(Calendar).use(Divider ).use(Toast ).use(TreeSelect );
    export default {
        data() {
            return {
                getClientHeight:'420px',
                // getClientHeight:document.getElementsByClassName('van-popup')[0].offsetHeight - 119 + 'px',
                active:0,  //默认第一个选项卡
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
                keyWords:[],   //选择的单个行业
                ketwordsGroup:[], //选择的行业分类
                color:true,    //全部按钮是否被选中
                btnA:true,   //类型中的全部按钮是否被选中
                date:"",
                date1:"",
                show:false,
                show1:false,
                timer:[
                    {data:"全部",value: 0},
                    {data:"最近3天",value: 3},
                    {data:"最近7天",value: 7},
                    {data:"最近30天",value: 30}
                ],
                minDate: new Date(2020, 5, 1),
                maxDate: new Date(),
                startTime:"",  //开始时间
                endTime:"",   //结束时间
                timeQujian:'',
                filterType:[
                    { text: '全部', value: 0},
                    { text: '招标公告', value: 1 },
                    { text: '变更公告', value: 2 },
                    { text: '结果公告', value: 3 },
                ],
                typeallTime:false,
                typeall:true,
                typelistTime:[3],
                typelist:[],
                radio: "0",
                pageNo:1,
                pshowFilter:false,
                presult:[],
                provinceall:true,
                provincelist:[],
                checkedm:true,
                ptype:[],
                result: [],
                contentdata:[],
                TotalCount:0,
                priceBtn:true,
                zbjeOneLeft:'', //金额输入框数据1
                zbjeOneRight:'', //金额输入框数据2
                // zbjeTwoLeft:'', //金额输入框数据3
                // zbjeTwoRight:'', //金额输入框数据4
                items:[{text:'全部',IsShow:true}],  //所有城市
                activeIds: [1, 2],
                activeIndex: 0,
                itemss:[], //所有的省份
                citys:[], //选中的城市
                o:0,//点击的省份索引
                showCity:'',
                showCitypre:[],
                showCity1:'全国',
            }
        },
        methods: {
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
                                    this.items[0].IsShow = true;
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
                    // console.log(res);
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
            //点击全部
            quanbu(){
                this.keyWords = []
                this.ketwordsGroup = []
                
                if(!this.color){
                    this.$refs.all.style.background = "#CEF0FF";
                    this.color = true
                    //让所有的行业颜色变成白色
                    for(let i =0;i<this.$refs.tet.length;i++){
                        this.keyWords.push(this.$refs.tet[i].innerText)
                        this.$refs.tet[i].style.background = "#FFFFFF";
                    }
                    //让所有的行业分类颜色变成白色
                    for(let k=0;k<this.$refs.keywordBox.length;k++){
                        // console.log(k);
                        this.$refs.keywordBox[k].style.background = "#FFFFFF";
                    }
                    // this.keyWords = []   //全部的话就传递空数组
                    // console.log(this.keyWords);
                }else{
                    console.log(this.$refs.all);
                    
                    if(this.$refs.all){
                        this.$refs.all.style.background = "#FFFFFF";
                        this.color = false
                    }
                    
                }
                
            },
            //点击行业分类
            keywordBox(e,i){
                //是否已经点击了全部
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
            },
            //点击单个行业
            keyword(e,i){
                if(e.id>=0 && e.id<5){
                    let n = 0
                    this.$refs.keywordBox[n].style.background = "#FFFFFF";
                    this.ketwordsGroup = this.ketwordsGroup.filter(item => {
                        return item !== this.$refs.keywordBox[n].innerText;
                    });
                    
                }else if(e.id>=5 && e.id<10){
                    let n = 1
                    this.$refs.keywordBox[n].style.background = "#FFFFFF";
                    this.ketwordsGroup = this.ketwordsGroup.filter(item => {
                        return item !== this.$refs.keywordBox[n].innerText;
                    });
                }else if(e.id>=10 && e.id<13){
                    let n = 2
                    this.$refs.keywordBox[n].style.background = "#FFFFFF";
                    this.ketwordsGroup = this.ketwordsGroup.filter(item => {
                        return item !== this.$refs.keywordBox[n].innerText;
                    });
                }else if(e.id>=13 && e.id<21){
                    let n = 3
                    this.$refs.keywordBox[n].style.background = "#FFFFFF";
                    this.ketwordsGroup = this.ketwordsGroup.filter(item => {
                        return item !== this.$refs.keywordBox[n].innerText;
                    });
                }else if(e.id>=21 && e.id<26){
                    let n = 4
                    this.$refs.keywordBox[n].style.background = "#FFFFFF";
                    this.ketwordsGroup = this.ketwordsGroup.filter(item => {
                        return item !== this.$refs.keywordBox[n].innerText;
                    });
                }else if(e.id>=26 && e.id<30){
                    let n = 5
                    this.$refs.keywordBox[n].style.background = "#FFFFFF";
                    this.ketwordsGroup = this.ketwordsGroup.filter(item => {
                        return item !== this.$refs.keywordBox[n].innerText;
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
                // else if(e.id>=51 && e.id<54){
                //     let n = 12
                //     this.$refs.keywordBox[n].style.background = "#FFFFFF";
                //     this.ketwordsGroup = this.ketwordsGroup.filter(item => {
                //         return item !== this.$refs.keywordBox[n].innerText;
                //     });
                // }
                

                //是否已经点击了全部
                if(this.color){
                    this.keyWords = []
                }

                //是否已经点击了行业分类
                this.$refs.all.style.background = "#FFFFFF";
                this.color = false
                if(this.keyWords.indexOf(e.tit) > -1){
                    this.$refs.tet[e.id].style.background = "#FFFFFF";
                    this.keyWords = this.keyWords.filter(item => {
                        return item !== this.$refs.tet[e.id].innerText;
                    });
                }else{
                    this.keyWords.push(e.tit)
                    this.$refs.tet[e.id].style.background = "#CEF0FF";
                }
            },
            
            //类型
            changetypeIndex(index,value){
                if(value !=0 && this.typelist.indexOf( value )!=-1){
                    this.typeall=false
                    this.typelist.splice( this.typelist.indexOf( value ), 1 )
                }
                else if(value !=0 && this.typelist.indexOf( value )==-1 ){
                    this.typelist.push(value)
                    this.typeall=false
                }
                if(value ==0){
                    this.typelist=[""];
                    this.typeall=true;
                }
            },
            //时间
            changetypeIndexTime(index,value){
                this.startTime ="";
                this.endTime = "";
                if(value !=0 && this.typelistTime.indexOf( value )!=-1){
                    this.typeallTime=false
                    this.typelistTime.splice( this.typelistTime.indexOf( value ), 1 )
                }
                else if(value !=0 && this.typelistTime.indexOf( value )==-1 ){
                    this.typelistTime = []
                    this.typelistTime.push(value)
                    // this.typelistTime.splice( this.typelistTime.indexOf( value ), 1 )
                    this.typeallTime=false
                }
                if(value ==0){
                    this.typelistTime=[""];
                    this.typeallTime=true;
                }
                this.$refs.time.style.border = "1px solid rgb(179, 169, 169)";
            },
            formatDate(date) {
                return `${date.getFullYear()}/${date.getMonth() + 1}/${date.getDate()}`;
            },
            //时间区间
            onConfirm(date) {
                this.typeallTime = false
                this.typelistTime = []
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
                    this.endTime = ''+y1+'-'+m1+'-'+d1
                    this.$refs.time.style.border = "1px solid red";
            },
            onConfirm1(date1){
                this.show1 = false;
                this.date1 = this.formatDate(date1);
            },
            ispshowFilter:function(){
                this.pshowFilter=true;
            },
            changeproIndex(index,value){
              if(value !=-1 && this.provincelist.indexOf( value )!=-1){
                this.provinceall=false
                this.provincelist.splice( this.provincelist.indexOf( value ), 1 )
              }
              else if(value !=-1 && this.provincelist.indexOf( value )==-1 ){
                this.provincelist.push(value)
                 this.provinceall=false
              }
              if(value ==-1){
                this.provincelist=[];
                this.provinceall=true
              }
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
                this.$refs.checkboxes[index].toggle();
            },
            getprovince:function(){
                let that = this;
                
                this.$dataApi({
                    url:'api/Area/GetArea',
                    method:'POST',
                }).then(response=>{
                    // console.log(response);
                    that.itemss = JSON.parse(JSON.stringify(response))
                    that.contentdata=response;
                    response.forEach((item,index)=>{
                        that.ptype.push(item.AreaChar);
                        that.itemss[index].text = response[index].AreaName;
                        that.itemss[index].badge = '';
                    })
                    that.ptype= Array.from(new Set(that.ptype))
                    that.itemss.unshift({text:'全国'})
                    // console.log(that.itemss);
                    
                })
                .catch(function (error) {
                    console.log(error);
                });
            },
            //点击招标金额按钮
            zbjeOneBtn(){
                // document.getElementsByClassName('map')[0].className = "btn_zbje1 map";
                this.priceBtn = true
                this.zbjeOneLeft = "";
                this.zbjeOneRight = "";
            },
            //点击招标金额输入框
            zbjeOne(){
                // document.getElementsByClassName('map')[0].className = "btn_zbje3 map";
                this.priceBtn = false
            },

            //点击中标金额按钮
            zbjeTwoBtn(){
                document.getElementsByClassName('mapTwo')[0].className = "btn_zbje2 mapTwo";
                this.zbjeTwoLeft = "";
                this.zbjeTwoRight = "";
            },
            //点击中标金额输入框
            zbjeTwo(){
                document.getElementsByClassName('mapTwo')[0].className = "btn_zbje3 mapTwo";
            },
            //金额判断
            zbjeOneL(){
                if(Number(this.zbjeOneRight) <= Number(this.zbjeOneLeft) && this.zbjeOneRight !== ""){
                    Toast.fail('请输入正确的金额(低到高)');
                    this.zbjeOneLeft = '';
                };
                if(this.zbjeOneRight == '' && this.zbjeOneLeft == ''){
                    document.getElementsByClassName('map')[0].className = "btn_zbje1 map";
                }
            },
            zbjeOneR(){
                if(Number(this.zbjeOneRight) <= Number(this.zbjeOneLeft) && this.zbjeOneRight !== ""){
                    Toast.fail('请输入正确的金额(低到高)');
                    this.zbjeOneRight = '';
                };
                if(this.zbjeOneRight == '' && this.zbjeOneLeft == ''){
                    document.getElementsByClassName('map')[0].className = "btn_zbje1 map";
                }
            },
            zbjeTwoL(){
                if(Number(this.zbjeTwoRight) < Number(this.zbjeTwoLeft) && this.zbjeTwoRight !== ""){
                    Toast.fail('请输入正确的金额');
                    this.zbjeTwoLeft = '';
                }
            },
            zbjeTwoR(){
                if(Number(this.zbjeTwoRight) < Number(this.zbjeTwoLeft) && this.zbjeTwoRight !== ""){
                    Toast.fail('请输入正确的金额');
                    this.zbjeTwoRight = '';
                }
            },

            //点击确定按钮
            getData(){
                console.log(this.citys);
                this.$dataApi({
                    url:"api/Area/GetAllProCity",
                    method:"POST",
                    // data:{
                    //     province:this.itemss[ind].text
                    // }
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
               
                
                    if(this.showCity.length == 0){
                        this.showCity1 = ''
                    }else{
                        this.showCity1 = this.showCity.toString();
                    }
                    if(this.citys.length == 0 && this.showCitypre.length == 0){
                        this.showCity1 = '';
                        this.showCitypre = ''
                    }
                    
                    
                    let obj = {
                        IsAbout:Number(this.radio),
                        TimeNo:this.typelistTime.toString().length ==0 ? 0:this.typelistTime[0],
                        TimeBegin:this.startTime,   //开始时间
                        TimeEnd:this.endTime,   //结束时间
                        GGType:this.typelist.toString().length ==0 ? '' : this.typelist.toString(),   //（信息类型 全部0,招标公告1,变更公告2,结果公告3）
                        Provinces:this.showCitypre.toString(),   //省份
                        Industry:this.keyWords.length == 54?"":this.keyWords.toString(),   //行业
                        PageNo:1,
                        PageSize:20,
                        openid:sessionStorage.getItem("openID"),
                        TotalCount:this.TotalCount,
                        load:true,
                        Cities:this.showCity1,
                        BeginAmount:this.zbjeOneLeft,
                        EndAmount:this.zbjeOneRight
                    }
                    // console.log(obj);
                    
                    if(this.$route.fullPath === '/main'){
                        this.$emit("changeMain",obj)
                    }else{
                        this.$emit("change",obj)
                    }
                })
                
                this.showCitypre = []
            },
            //点击重置按钮
            chongzhi(){
                
                // this.remover()
                this.keyWords = [];
                this.ketwordsGroup = [];
                this.color = false;
                this.btnA = true;
                this.date = "";
                this.show = false;
                this.startTime = "";  //开始时间
                this.endTime= "";   //结束时间
                this.timeQujian = '';
                this.typeallTime = false;
                this.typeall = true;
                this.typelistTime = [3];
                this.typelist = [];
                this.radio =  "0";
                this.pshowFilter = false;
                this.presult=[];
                this.provincelist = [];
                this.checkedm=true;

                this.priceBtn = true
                this.zbjeOneLeft = "";
                this.zbjeOneRight = "";

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

                this.quanbu();
                
            },
            chongzhi2(){
                // this.remover()
                this.keyWords = [];
                this.ketwordsGroup = [];
                this.color = false;
                this.btnA = true;
                this.date = "";
                this.show = false;
                this.startTime = "";  //开始时间
                this.endTime= "";   //结束时间
                this.timeQujian = '';
                this.typeallTime = false;
                this.typeall = true;
                this.typelistTime = [3];
                this.typelist = [];
                this.radio =  "0";
                this.pshowFilter = false;
                this.presult=[];
                this.provincelist = [];
                this.checkedm=true;
                this.citys = [];
                this.itemss.map(item=>{
                    item.badge = ''
                });
                this.items.map(item=>{
                    item.IsShow = false
                });
                if(this.o == 0){
                    this.items = [{text:'全部',IsShow:true}];
                }[];
                this.$refs.checkbox.reset();
                this.quanbu()
            },
        },
        created() {
            if(sessionStorage.getItem("sGGtype")!=null){
                this.typelist.push(Number(sessionStorage.getItem("sGGtype")))
                 this.typeall = false
                 window.sessionStorage.removeItem("sGGtype");
            }
            this.getprovince();
            
        },
        mounted(){
            this.getClientHeight = document.getElementsByClassName('van-popup')[0].offsetHeight - 119 + 'px'
        }
    };
</script>

<style  scoped>
    .van-sidebar-item__info{
        background-color: #4CA8F8 !important;
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
        font-size: 0.26rem;
        text-align: left;
        color: #666666;
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
        /* margin-left: 0.35rem; */
        justify-content: center;
        align-items: center;
    }
    .input_box>input{
        width: 35%;
    }
    input{
        height: 0.5rem;
        text-align: left;
        font-size: 0.28rem;
        color: #333333;
        border: 1px solid #B5B5B5;
        border-radius: 35px;
    }


    /* 城市 */
    .cityBtn{
        background: #fff;
        color: #333;
        border:none;
        /* border: 1px solid rgb(112, 110, 110); */
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
        /* border: 1px solid #4CA8F8; */
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
    .van-tree-select__nav{
        flex: none !important;
    }

    .van-tab{
        flex-basis: 20% !important;
    }
    /* .bigBox{
        position: relative;
        z-index: 1000;
    } */
    .tabbox{
        /* position: relative; */
        height: 100%;
        width: 100%;
        overflow: hidden;
    }
    .van-tabs__wrap{
        width:100% !important;
        position:fixed !important;
    }
    .startTime{
        height: 1rem;
        text-align: center;
        width: 40%;
        border: 1px solid rgb(165, 155, 155);
    }
    .endTime{
        height: 1rem;
        width: 40%;
        border: 1px solid rgb(179, 170, 170);
    }
    .ff{
        height: 100%;
    }
    /* 行业样式 */
    .quanbu{
        display: flex;
        margin-top: 0.1rem;
    }
    .qb{
        font-size: 14px;
        width: 18%;
        border: 1px solid rgb(185, 178, 178);
        background: #CEF0FF;
        padding: 2px;
        border-radius: 3px;
        margin-left: 5%;
        text-align: center;
        /* margin-top: 5%; */
    }
    .main{
        overflow: hidden;
        margin-bottom: 1.7rem;
        
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
    .span1{
        border: 1px solid rgb(185, 178, 178);
        border-radius: 3px;
        margin-left: 5%;
        /* width: 19%; */
        width: 1.46rem;
        height: 0.48rem;
        line-height: 0.48rem;
        color: rgb(0, 0, 0);
        text-align: center;
    }
    .box{
        margin-left: 5%;
        /* width: 90%; */
        display: flex;
        flex-wrap: wrap;
        /* justify-content: space-between; */
    }
    .keyword{
        /* margin-left: 2%; */
        /* width: 1.46rem; */
        height: 0.48rem;
        padding: 0 0.2rem 0 0.2rem;
        border: 1px solid rgb(185, 178, 178);
        border-radius: 3px;
        line-height: 0.48rem;
        font-size: 14px;
        margin-top: 10px;
        margin-right: 3%;
        /* width: 100%; */
        /* height: 100%; */
        color: rgb(134, 130, 130);
        /* margin-bottom: 5px; */
    }
    .keyword1{
        /* margin-left: 2%; */
        width: 20%;
        border: 1px solid rgb(185, 178, 178);
        border-radius: 3px;
        font-size: 14px;
        margin-top: 5px;
        margin-right: 4%;
        height: 100%;
        color: rgb(134, 130, 130);
        background: #CEF0FF;
        /* margin-bottom: 5px; */
    }
    .btn1{
        /* height: 0.6rem;
        margin-bottom: 0.5rem; */
        border: 1px solid rgb(153, 146, 146);
        width:1.65rem;
        height:0.8rem;
        background:rgba(247,247,247,1);
        border-radius:0.1rem;
        margin-left: 0.1rem;
        font-size:0.28rem;
        font-family:PingFang SC;
        line-height: 0.8rem;
            bottom: 0.15rem;
    }
    .btn2{
        border: 1px solid #4CA8F8;
        /* border: none; */
        width:1.65rem;
        height:0.8rem;
        background:rgb(76, 168, 248);
        border-radius:0.1rem;
        margin-left: 0.1rem;
        font-size:0.28rem;
        font-family:PingFang SC;
        line-height: 0.8rem;
        color: white;
            bottom: 0.15rem;
    }
   
   /* 时间样式 */
   .dataBox{
       display: flex;
       justify-content: space-around;
       margin-top: 5%;
       
   }
   .data{
       height: 0.5rem;
       line-height: 0.5rem;
       width: 15%;
       font-size: 12px;
       /* background: #0099FF; */
       border: 1px solid rgb(187, 180, 180);
       /* margin-left: 5%; */
       /* color:#CEF0FF; */
       border-radius: 0.1rem;
   }
   .qqq1{
       position: relative;
   }
   .rqqj{
       /* border-top: 1px solid rgb(214, 208, 208); */
       /* margin-top: 30%; */
       margin: 30% auto;
       line-height: 44px;
       height: 44px;
       width: 90%;
       border: 1px solid rgb(179, 169, 169);
       display: flex;
       align-items: center;
       justify-content: space-around;
   }
   .btn-box1{
        position: fixed; 
        /* top: 91%; */
        bottom: 0rem;
        width: 100%;
        background: #F0F0F0;
        height: 1.5rem;
        /* display: flex; */
        /* justify-content: space-between; */
    }

   /* 类型样式 */
    .q_type{
        overflow: hidden;
    }
    .tyoe-list-type{
     margin: 0 auto;
     display: block;
     margin-top: 0.24rem;
     margin-left: 0.2rem;
   }
   .tyoe-list-type :nth-child(2){
     display: none;
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
   }

   /* 地区样式 */
   .tyoe-list-province{
     margin: 0 auto;
     display: block;
     margin-top: 0.24rem;
     margin-left: 0.2rem;
   }
   .van-cell{
     padding:0 16px;
   }
   .van-cell--clickable{
     height: 0.6rem;
   }

   /* 范围样式 */
   .title{
     width:1.5rem;
     height:0.57rem;
     font-size:0.28rem;
     font-family:PingFang SC;
     font-weight:800;
     color:rgba(171,171,171,1);
     line-height:0.58rem;
     margin-top: 0.46rem  !important;
     margin-left: 0.4rem;
   }
   .van-radio--horizontal{
     margin-right: 12px;
     margin-left: 0.88rem;
     margin-bottom: 0.25rem;
   }
   .van-radio__label{
      font-size: 0.24rem;
      font-family: PingFang SC;
      line-height: 0.8rem;
   }
   .fwBox{
       margin-top: 0.3rem;
   }
   .fw1{
       font-size: 12px;
   }

</style>