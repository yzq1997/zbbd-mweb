<template>
    <div class="box">
        <div class="tab">
            <button class="btn_1" :class="tab1?'btn_3':'btn_4'" @click="tabO()">积分获取</button>
            <button class="btn_2" :class="tab2?'btn_3':'btn_4'" @click="tanT()">积分使用</button>
        </div>
        <div class="main">
            <ul v-if="tab1">
                <li v-for="(item,index) in numAdd" :key="index">
                    <div class="left">
                        <p>{{item.SourceOfPoints}}</p>
                        <p>{{item.CreateDate}}</p>
                    </div>
                    <div class="right">+{{item.PointChange}}</div>
                </li>
            </ul>

            <ul v-if="tab2">
                <li v-for="(item,index) in numUse" :key="index">
                    <div class="left">
                        <p>{{item.SourceOfPoints}}</p>
                        <p>{{item.CreateDate}}</p>
                    </div>
                    <div class="right">{{item.PointChange}}</div>
                </li>
            </ul>
        </div>
    </div>
</template>

<script>
export default {
    data() {
        return {
            tab1: true,
            tab2: false,
            numAdd: [], //积分获取记录
            numUse: [] //积分使用记录
        };
    },
    methods: {
        //点击积分获取按钮
        tabO() {
            this.tab1 = true;
            this.tab2 = false;
        },
        // 点击积分使用按钮
        tanT() {
            this.tab1 = false;
            this.tab2 = true;
        },
        //用户积分获取记录
        getUserNum(){
            this.$dataApi({
                url: "api/UserSharing/UserPointsEarned",
                method: "POST",
                data: {
                    OpenId: sessionStorage.getItem("openID")
                }
            }).then(response => {
                console.log(response);
                this.numAdd = response.IntegralList
                // this.sign = response.availablePoints;
            });
        },
        //用户积分使用记录
        getUserUseNum(){
            this.$dataApi({
                url: "api/UserSharing/UserPointsUsage",
                method: "POST",
                data: {
                    OpenId: sessionStorage.getItem("openID")
                }
            }).then(response => {
                console.log(response);
                this.numUse = response.IntegralList
                // this.sign = response.availablePoints;
            });
        }
    },
    created(){
        this.getUserNum();
        this.getUserUseNum();
    }
};
</script>

<style lang="scss" scoped>
.box {
    background: #f2f2f2;
    min-height: 100%;
    overflow: hidden;
}
.tab {
    background: #f2f2f2;
    // position: fixed;
    width: 100%;
    height: 1.5rem;
    padding-top: 0.5ren;
    z-index: 99;
    button {
        background: none;
        border: 1px solid #419be9;
        color: #fff;
        font-size: 0.36rem;
        background: #419be9;
        width: 50%;
        height: 0.9rem;
        border-radius: 0.6rem;
        // position: fixed;
        position: absolute;
        font-family: Microsoft YaHei;
        margin-top: 0.3rem;
    }
    .btn_1 {
        left: 5%;
        background: #419be9;
        z-index: 5;
    }
    .btn_2 {
        right: 5%;
        background: #fff;
        color: #000;
    }
    .btn_3 {
        background: #419be9;
        color: #fff;
        z-index: 10;
    }
    .btn_4 {
        background: #fff;
        color: #000;
    }
}
li {           
    display: flex;
    width: 80%;
    margin: 0 5%;
    padding: 0 5%;
    height: 1.3rem;
    background: #fff;
    justify-content: space-between;
    margin-top: 0.3rem;
    border-radius: 0.1rem;
    .left {
        p {
            font-size: 0.24rem;
            margin: 0;
            margin-top: 0.15rem;
            text-align: left;
        }
        p:nth-of-type(1) {
            font-size: 0.36rem;
            font-family: Microsoft YaHei;
        }
        p:nth-of-type(2) {
            font-size: 0.24rem;
            font-family: Microsoft YaHei;
            color: #999;
        }
    }
    .right {
        font-size: 0.36rem;
        line-height: 1.3rem;
    }
}
li:last-child{
    margin-bottom: 0.3rem;
}
</style>