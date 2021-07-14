<template>
    <div class="box">
        <!-- //主体 -->
        <div class="search-list">
            <div ref="List" class="listBox">
                <div v-for="(item,index) in arr1" :key="index" class="search-info">
                    <div class="search-split"></div>
                    <div class="search-title" v-html="item.title" @click="content(item)"></div>
                    <div class="infotyle">
                        <span
                            v-if="item.Province !=''"
                            style="margin-left: 0.2rem;"
                        >{{item.Province}}</span>
                        <span v-if="item.GGType !=''">{{item.GGType}}</span>
                        <span
                            v-if="item.HYType !=''"
                            style="overflow:hidden;white-space: nowrap;text-overflow: ellipsis;width: auto;"
                        >{{item.HYType}}</span>
                        <span
                            v-if="(item.Amount/10000).toFixed(2) == 0 ? false: true"
                            class="prise"
                        >{{(item.Amount/10000).toFixed(2)}}万</span>
                        <span
                            v-if="item.JoinDate != ''"
                            style="float: right;border: none;padding: 0.08rem 0rem;"
                        >
                            <van-icon
                                style="position: relative;top: 1px;right: 1px;"
                                name="clock-o"
                            />
                            {{item.JoinDate}}
                        </span>
                    </div>
                </div>
            </div>
        </div>

        <div class="noMain" v-if="show">
            <img src="../../../public/image/search_defualt.png" alt="">
            <p>暂无关注内容，快去关注吧！</p>
        </div>
    </div>
</template>

<script>
import Vue from "vue";
export default {
    data() {
        return {
            msg: "",
            list: [],
            arr1: [],
            show:false,
        };
    },
    methods: {
        content: function(e) {
            // console.log(e);
            this.$router.push({
                path:'./proschedule',
                query: {
                    Title: e.title,
                    BaseID:e.id
                }
            });
            

            return 
            // console.log(e);
            // sessionStorage.setItem("sharetitle",e.title)
            window.removeEventListener("scroll", this.getScroll);
            this.$dataApi({
                url: "api/Users/CheckIsConcernProject",
                method: "POST",
                data: {
                    OpenId: sessionStorage.getItem("openID"),
                    id: e.id,
                    Source: 1
                }
            }).then(res => {
                this.msg = res.Msg;
                //是否被关注
                //let newUrl = e.ZBUrl.replace(/ContentHtml/,'ContentHtmlTest')
                let a =e.ZBUrl +`?IsConcerned=${this.msg}&id=${e.id}&openID=${sessionStorage.getItem("openID")}&Source=1`;
                sessionStorage.setItem("url", a);
                this.$router.push({
                    path: "/iframe",
                    query: {
                        ZBUrl: a,
                        id:e.id
                    }
                });
            });
        },
        GetattentionByOpenID(){
            let that = this;
            this.$dataApi({
                url: "api/Users/GetattentionByOpenID",
                method: "POST",
                data: {
                    OpenId: sessionStorage.getItem("openID"),
                    Source: 1
                }
            }).then(res => {
                console.log(res);
                if(res.length == 0){
                    that.show = true;
                }
                this.arr1 = res;
                this.arr1.forEach(item => {
                    item.GGType = item.FormatGGType;
                    let day2 = new Date();
                    day2.setTime(day2.getTime());
                    let nowdate =
                        day2.getFullYear() +
                        "-" +
                        (day2.getMonth() + 1 < 10
                            ? "0" + (day2.getMonth() + 1)
                            : day2.getMonth() + 1) +
                        "-" +
                        (day2.getDate() < 10
                            ? "0" + day2.getDate()
                            : day2.getDate());

                    // item.GGType=item.FormatGGType;
                    let date = item.JoinDate.replace(new RegExp("-", "gm"), "/");
                    let EndTime = new Date(date).getTime(); //获取抓取时间的秒数
                    let s = day2.getTime() / 1000 - EndTime / 1000;
                    let m = day2.getTime() / 1000 / 60 - EndTime / 1000 / 60;
                    let h =
                        day2.getTime() / 1000 / 60 / 60 - EndTime / 1000 / 60 / 60;
                    if (s > 0 && s < 60) {
                        item.JoinDate = parseInt(s) + "秒前";
                    } else if (m > 0 && m < 60) {
                        item.JoinDate = parseInt(m) + "分钟前";
                    } else if (h > 0 && h < 24) {
                        item.JoinDate = parseInt(h) + "小时前";
                    } else if (h >= 24 && h <= 48) {
                        item.JoinDate = "昨天";
                    } else if (h > 48) {
                        item.JoinDate = item.JoinDate.substring(0, 10);
                    }
                });
            });
        },
        GetDataInfo(){
            let that = this;
            that.$dataApi({
                url: "api/BaseData/GetDataInfo",
                method: "GET",
                data: {
                    id: 18212670,
                },
            }).then((res) => {
                console.log(res);
            });
        }
    },
    created() {
        this.GetattentionByOpenID()
        this.GetDataInfo();
    }
};
</script>

<style scoped>
.listBox {
    margin-bottom: 1rem;
}
.search-list {
    height: auto;
    width: 100%;
    margin: 0 auto;
}
.search-split {
    width: 100%;
    height: 0.16rem;
    background: rgba(242, 242, 242, 1);
}
.search-title {
    width: 90%;
    margin-left: 0.23rem;
    margin-top: 0.38rem;
    font-size: 0.32rem;
    font-family: PingFang SC;
    font-weight: bold;
    color: rgba(48, 48, 48, 1);
    line-height: 0.48rem;
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 2;
    overflow: hidden;
    text-overflow: ellipsis;
    text-align: left;
}
.infotyle {
    width: 100%;
    height: 0.4rem;
    margin-top: 0.29rem;
    margin-bottom: 0.38rem;
}
.infotyle span {
    height: 0.26rem;
    float: left;
    font-size: 0.24rem;
    font-family: PingFang SC;
    font-weight: 500;
    color: rgba(171, 171, 171, 1);
    line-height: 0.26rem;
    margin-right: 0.1rem;
    padding: 0.08rem 0.12rem;
    border: 0.01rem solid rgba(232, 232, 232, 1);
    border-radius: 20px;
    max-width: 8em;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
}
.infotyle span:nth-of-type(1) {
    background: #579ce9;
    color: #f1f4fb;
}
.infotyle span:nth-of-type(2) {
    background: #ecfdf7;
    color: #6da88a;
}
.infotyle span:nth-of-type(3) {
    background: #ebeeff;
    color: #7886c2 !important;
}
.prise {
    background: #fcf3f4;
    color: #e58890 !important;
}
.noMain{
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction:column;
    margin-top: 4rem;
}
.noMain>img{
    width: 2rem;
    height: 2.5rem;
}
.noMain>p{
    font-size: 0.2rem;
    text-align: center;
    color: #999;
}
</style>