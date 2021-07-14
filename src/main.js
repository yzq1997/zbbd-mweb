// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import store from './store'

import axios from 'axios'
import qs from 'qs'
import VueAxios from 'vue-axios'
import Cookies from 'js-cookie'
// import mock from 'mock'
import wx from 'weixin-js-sdk';
import COMMON from './common/common.vue'
import index from './page/index.vue'
import { apiAxios } from './util/request'
import { baseURL } from './util/config.js'
import { userInfo } from './util/getInfos'
import { List, Popup, Toast, Picker, Search, DropdownMenu, DropdownItem, Button, Field, Dialog, Checkbox, CheckboxGroup, RadioGroup, Radio, Loading, IndexBar, IndexAnchor, Cell, CellGroup, ActionSheet, Form, Icon } from 'vant';
Vue.use(List).use(Popup).use(Picker).use(Search).use(DropdownMenu).use(DropdownItem).use(Button).use(Field).use(Dialog).use(Checkbox).use(CheckboxGroup).use(RadioGroup).use(Radio).use(Loading).use(IndexBar).use(IndexAnchor).use(Cell).use(CellGroup).use(ActionSheet).use(Form).use(Toast).use(Icon)
Vue.prototype.$axios = axios;
Vue.prototype.qs = qs;

import 'vant/lib/index.css';



// 定义全局变量
Vue.prototype.$dataApi = apiAxios

Vue.prototype.wx = wx

Vue.prototype.COMMON = COMMON;

Vue.config.productionTip = false
router.beforeEach((to, fff, next) => {
    if (window.location.href.indexOf("iframe") > 0) {
        //文章页直接分享缓存地址
        sessionStorage.setItem("ZBUrl", window.location.href)
    }
    if (window.location.href.indexOf("helpshare") > 0) {
        //助力直接分享缓存地址
        sessionStorage.setItem("helpshare", window.location.href)
    }
    if (window.location.href.indexOf("signone") > 0) {
        //助力直接分享缓存地址
        sessionStorage.setItem("signone", window.location.href)
    }

    //首页推送链接-旧
    if (window.location.href.indexOf("DataPacketId") > 0) {
        localStorage.removeItem('PushDataId');
        localStorage.setItem("Identify", "Identify")
        var IdentifyNumber = window.location.href.substring(window.location.href.indexOf("DataPacketId=") + 13, window.location.href.indexOf("&openid"));
        localStorage.setItem("IdentifyNumber", IdentifyNumber);
    };

    //首页推送链接-新
    if (window.location.href.indexOf("PushDataId") > 0) {
        localStorage.removeItem('IdentifyNumber');
        localStorage.setItem("Identify", "Identify")
        var PushDataId = window.location.href.substring(window.location.href.indexOf("PushDataId=") + 11, window.location.href.indexOf("&openid"));
        localStorage.setItem("PushDataId", PushDataId);
    };

    //关注信息变更推送链接
    if (window.location.href.indexOf("ProjectsConcern") > 0) {
        localStorage.setItem("ProjectsConcern", "ProjectsConcern")
        var ProjectsConcernNumber = window.location.href.substring(window.location.href.indexOf("baseID=") + 7, window.location.href.indexOf("&ProjectsConcern"));
        localStorage.setItem("ProjectsConcernNumber", ProjectsConcernNumber)
    };

    if (sessionStorage.getItem("openID") == null) {
        userInfo.getInfo().then(() => {
            if(sessionStorage.getItem("ZBUrl") !=null){
                window.location.href=sessionStorage.getItem("ZBUrl");
            }
            else if(sessionStorage.getItem("signone") !=null){
                window.location.href=sessionStorage.getItem("signone");
            }else if(sessionStorage.getItem("helpshare") !=null){
                window.location.href=sessionStorage.getItem("helpshare");
            }else{
                if (localStorage.getItem("Identify") == null) {
                    if(localStorage.getItem("ProjectsConcern") == 'ProjectsConcern'){
                        next('proschedule')
                    }else{
                        userInfo.saveFoot().then(()=>{
                            userInfo.isfirstvip().then(() => {
                                if(sessionStorage.getItem("UserIsVip") == 1){
                                    next('/index');  //因为加载过慢，由订阅页先改为首页 /Keyinfolist
                                }else {
                                    userInfo.haveKey().then(()=>{
                                        if(sessionStorage.getItem("UserIsVip") == 3){
                                            next('/index');
                                        }else{
                                            next('/index');  //因为加载过慢，由订阅页先改为首页 /Keyinfolist
                                        }
                                    })
                                }
                            })
                        });
                    }
                } else if(localStorage.getItem("Identify") == 'Identify') {
                    next('ts')
                }
            }
        })
    } else {
        next()
    }
    // next()

    if (to.meta.title) {
        document.title = to.meta.title
    }
    window.scrollTo(0, 0);
    COMMON.initRem();
});

router.afterEach((to, fff, next) => {
    if (to.path == "/login" && fff.path == "/iframe") {
    }
    else {
        window.scrollTo(0, 0);
    }
    COMMON.initRem();
});

/* eslint-disable no-new */
new Vue({
    el: '#app',
    router,
    store,
    components: { App },
    template: '<App/>'
})
