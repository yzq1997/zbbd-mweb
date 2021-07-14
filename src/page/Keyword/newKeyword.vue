<template>
    <div id="container">
        <div class="title-top">
            <span>添加感兴趣的关键词</span>
            <span @click="addzdyword()">添加自定义关键词</span>
        </div>
        <!-- 关键字列表 -->
        <div class="keywordG">
            <div class="keywordG keyword-type">
                <p>建筑工程</p>
                <div :class="keywordlist.indexOf(item)>=0?'keyword keywordon':'keyword'" v-for="(item,index) in building" :key="index" @click='getkeyword(item)'>
                   {{item}}
                </div>
            </div>
            <div class="keywordG keyword-type">
                <p>行政办公</p>
                <div :class="keywordlist.indexOf(item)>=0?'keyword keywordon':'keyword'" v-for="(item,index) in administration" :key="index" @click='getkeyword(item)'>
                   {{item}}
                </div>
            </div>
            <div class="keywordG keyword-type">
                <p>医疗卫生</p>
                <div :class="keywordlist.indexOf(item)>=0?'keyword keywordon':'keyword'" v-for="(item,index) in Medical" :key="index" @click='getkeyword(item)'>
                   {{item}}
                </div>
            </div>
            <div class="keywordG keyword-type">
                <p>服务采购</p>
                <div :class="keywordlist.indexOf(item)>=0?'keyword keywordon':'keyword'" v-for="(item,index) in service" :key="index" @click='getkeyword(item)'>
                   {{item}}
                </div>
            </div>
            <div class="keywordG keyword-type">
                <p>机械设备</p>
                <div :class="keywordlist.indexOf(item)>=0?'keyword keywordon':'keyword'" v-for="(item,index) in equipment" :key="index" @click='getkeyword(item)'>
                   {{item}}
                </div>
            </div>
            <div class="keywordG keyword-type">
                <p>水利水电</p>
                <div :class="keywordlist.indexOf(item)>=0?'keyword keywordon':'keyword'" v-for="(item,index) in wconservancy" :key="index" @click='getkeyword(item)'>
                   {{item}}
                </div>
            </div>
            <div class="keywordG keyword-type">
                <p>能源化工</p>
                <div :class="keywordlist.indexOf(item)>=0?'keyword keywordon':'keyword'" v-for="(item,index) in energy" :key="index" @click='getkeyword(item)'>
                   {{item}}
                </div>
            </div>
            <div class="keywordG keyword-type">
                <p>弱电安防</p>
                <div :class="keywordlist.indexOf(item)>=0?'keyword keywordon':'keyword'" v-for="(item,index) in weak" :key="index" @click='getkeyword(item)'>
                   {{item}}
                </div>
            </div>
            <div class="keywordG keyword-type">
                <p>信息技术</p>
                <div :class="keywordlist.indexOf(item)>=0?'keyword keywordon':'keyword'" v-for="(item,index) in information" :key="index" @click='getkeyword(item)'>
                   {{item}}
                </div>
            </div>
            <div class="keywordG keyword-type">
                <p>交通道路</p>
                <div :class="keywordlist.indexOf(item)>=0?'keyword keywordon':'keyword'" v-for="(item,index) in traffic" :key="index" @click='getkeyword(item)'>
                   {{item}}
                </div>
            </div>
            <div class="keywordG keyword-type">
                <p>市政设施</p>
                <div :class="keywordlist.indexOf(item)>=0?'keyword keywordon':'keyword'" v-for="(item,index) in municipal" :key="index" @click='getkeyword(item)'>
                   {{item}}
                </div>
            </div>
            <div class="keywordG keyword-type">
                <p>农林牧渔</p>
                <div :class="keywordlist.indexOf(item)>=0?'keyword keywordon':'keyword'" v-for="(item,index) in agriculture" :key="index" @click='getkeyword(item)'>
                   {{item}}
                </div>
            </div>
        </div>

        <!-- 确认按钮 -->
        <div class="buttom">
             <van-button @click="savekeyword()">完成 </van-button>
             <van-button class="qx" @click="removekeyword()">跳过</van-button>
        </div>
   
    </div>
</template>

<script>
import { Toast } from 'vant';
export default {
    data(){
        return {
            keywordlist:[],
            building:["材料","工程","施工","勘察","设计","监理","机电"],
            administration:["办公","生活","家具","电脑","办公耗材"],
            Medical:["器械","医疗耗材","药品"],
            service:["仓储","物流","法律","物业","审计","会计","安保","广告","宣传","印刷"],
            equipment:["机械工程","机械","车辆","机床","零部件"],
            wconservancy:["水利","发电","航运"],
            energy:["仪器","仪表","原材料","新能源","化工"],
            weak:["布线","家居","智能系统"],
            information:["系统集成","软件","开发","运维"],
            traffic:["道路","轨道","桥梁","隧道"],
            municipal:["绿化","线路","管网"],
            agriculture:["生产","物资","设备"]
        }
    },
    
    methods:{
        getkeyword:function(e){
            if(this.keywordlist.indexOf(e) >= 0){
                this.keywordlist.splice(this.keywordlist.indexOf(e),1);
            } else {
                this.keywordlist.push(e);
            }
        },

        savekeyword:function(){
            if(this.keywordlist.length == 0){
                Toast.fail('请选择关键字');
            } else {
                 this.$dataApi({
				    url:'api/Users/SaveMultipleKeywords',
				    method:'POST',
				    data:{
                        openid: sessionStorage.getItem("openID"),
                        keywordArray:this.keywordlist,
                        Source:1
					}
				}).then(response=>{
                        if (response.Status == 200) {
                        Toast.success('添加成功');
                        this.$router.push({ path: "/" });
                    } else {
                        Toast.fail("添加失败" + response.Msg);
                    }    
                })
            }
        },

        removekeyword:function(){
            this.keywordlist=[];
            this.$router.push({ path: "/" });
        },

        addzdyword:function(){
            this.$router.push({ path: "addkeyword",query:{userId:1}});
        }
    },

}
</script>
    
<style   scoped>
    #container{
        width: 100%;
        overflow: auto;
    }
    .title-top{
        width: 100%;
        background-color: #E8E8E8;
        overflow: hidden;
    }
   .title-top span {
            display: block;
            float: left;
            font-size: 0.32rem;
            line-height: 1rem;
            text-align: left;
            text-indent: 1em;
            font-family: cursive;
        }
    .title-top span:nth-child(2){
        font-size:0.24rem ;
        float: right;
        padding-right: 0.53rem;
        color:#169BD5;
    }
    .keyword{
        width: 100%;
        height: auto;
        overflow: hidden;
    }
    .keywordG .keyword-type{
        font-size: 0.28rem;
        font-family:PingFang SC;
        font-weight:bold;
        color:rgba(0,0,0,1); 
        margin-left: 0.55rem;
        overflow: hidden;
    }  
    .keywordG .keyword-type p{
        text-align: left;
        margin-bottom: 0;
    } 
    .keyword{
        height: 0.48rem;
        width: 1.46rem;
        border:1px solid rgba(191,191,191,1);
        float: left;
        margin-right: 0.19rem;
        margin-top: 0.2rem;
        line-height: 0.48rem;
    } 
    .keywordon{
        background-color: #CFF0FF;
        color: #169BD5;
        border: 1px solid #CFF0FF;
    }
    .buttom{
        width: 100%;
        margin: 1rem 0;
        overflow: hidden;
    }
    .van-button--normal{
        /* display: block; */
        height: 0.7rem;
        width: 6rem;
        background-color: #169BD5;
        line-height: 0.7rem;
        margin-left: 0.75rem;
        border-radius:5px;
        color:rgba(255,255,255,1);
        font-size: 0.32rem;
        display: block;
    }
    .qx{
        background-color: #fff;
        border: none;
        color: #AAAAAA;
    }
</style>>

 