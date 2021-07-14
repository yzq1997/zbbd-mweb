<template>
    <div class="box">
        <van-collapse v-model="activeName" accordion>
            <van-collapse-item title="1.如何订阅招标信息？" name="1">进入<span class="col">招标宝典</span>微信公众号，找到公众号下方菜单栏<span class="col">“招标订阅”</span>。进入页面后点击<span class="col">“订阅”</span>，在“订阅”页面中设置或者修改您需要的关键词</van-collapse-item>
            <van-collapse-item title="2.关键词怎么设置？" name="2">招标宝典<span class="col">非会员用户</span>最多可设置<span class="col">5组关键词</span>，<span class="col">会员用户</span>可设置<span class="col">无限组关键词</span>。设置完成后，我们将会根据您设置的每组关键词自动匹配满足每组关键词要求的招标信息。点击关键词可查看符合该关键词以及筛选条件的所有招标信息。</van-collapse-item>
            <van-collapse-item title="3.可以按省份推送招标信息吗？" name="3">如果您想订阅某个省或者几个省的招标信息，设置关键词时点击“选择地区”选择您想看到的省份即可，支持多选。</van-collapse-item>
            <van-collapse-item title="4.为什么收不到推送消息？" name="4">
                <p>如果您已经订阅关键词，但一直没有收到或者很少收到招标信息，可能发生了以下情况</p>
                <p>1.您在一组关键词栏中设置太长的词，比如“垃圾清运运输处理招标信息”；</p>
                <p>2.您在设置关键词时使用了标点符号。比如“地址：矿产调查”。尽量不要在订阅关键词时使用标点符号；</p>
                <p>3.您设置的关键词所有的招标信息本身较少发布公告；</p>
                <p>4.您在“设置-推送设置”中关闭了推送功能。</p>
            </van-collapse-item>
            <van-collapse-item title="5.可以按照信息类型推送吗？" name="5">如果您只想接收招标信息中的特定信息类型，在关键词设置或者点击每组关键词里的编辑，在信息类型中选择您想要的信息类型就可以了。</van-collapse-item>
            <van-collapse-item title="6.招标信息中的附件为什么不能打开和下载？" name="6">招标订阅目前暂不提供附件的打开和下载服务，您可以点击项目页面左下角的<span class="col">“阅读原文”</span>前往原发布网站来进行下载。</van-collapse-item>
            <van-collapse-item title="7.怎样才能取消订阅？" name="7">想要取消订阅，可以点击<span class="col">“关键词-编辑”</span>将所有的关键词删除即可取消订阅。</van-collapse-item>
            <van-collapse-item title="8.您订阅的关键词字数较多，可能会收不到推送信息" name="8">
                <p>如果您在订阅时一组设置了较多关键词，系统很难匹配到相关信息，将导致您收不到推送。</p>
                <p>正确的订阅方式：</p>
                <p>当您要订阅较多关键词时，您可以将这些词拆开并逐一订阅，就能轻松获得最新招标信息推送！</p>
            </van-collapse-item>
        </van-collapse>
    </div>
</template>

<script>
import Vue from "vue";
import { Collapse, CollapseItem } from "vant";

Vue.use(Collapse);
Vue.use(CollapseItem);
export default {
    data() {
        return {
            activeName: '0',
        };
    }
};
</script>

<style lang="scss" scoped>
    .box{
        height: 100%;
        background: #F5F5F9;
        padding: 0.2rem;
    }
    .van-collapse-item{
        margin-top: 0.2rem;
        border-radius: 0.5rem;
    }
    .van-cell--clickable{
        border-radius: 0.2rem;
    }
    .col{
        color: #CC0000;
    }
   
</style>