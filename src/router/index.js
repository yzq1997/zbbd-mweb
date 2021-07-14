import Vue from 'vue'
import Router from 'vue-router'

const originalPush = Router.prototype.push
Router.prototype.push = function push(location) {
    return originalPush.call(this, location).catch(err => err)
}

import index from '../page/index.vue'
import searchList from '../page/searchList.vue'
import keyWords from '../page/keyWords.vue'
import my from "../page/my.vue"
import set from "../page/my/set.vue"
import myPro from "../page/my/myPro.vue"
import myFoot from "../page/my/myFoot.vue"
import myOpinion from "../page/my/myOpinion.vue"
import business from "../page/my/business.vue"
import push from "../page/my/push.vue"
import ques from "../page/my/Ques.vue"
import iframe from '../page/iframe.vue'
import addkeyword from '../page/Keyword/addkeyword.vue'
import keywordslist from '../page/Keyword/keywordslist.vue'
import Keyinfolist from '../page/Keyword/Keyinfolist.vue'
import addkeywords from "../page/exportExcel/addkeywords"
import excludeKeyWord from "../page/Keyword/excludeKeyWord"
import Lookup from "../page/lookup/Lookup"
import Export from "../page/exportExcel/export"
import ExportExcel from "../page/exportExcel/exportExcel"
import Ts from "../page/ts.vue"
import login from "../page/login/login"
import concise from "../page/concise/concise"
import Sign from "../page/Integral/Sign"
import Record from "../page/Integral/Record"
import helpshare from "../page/helpshare/helpshare"
import share from "../page/helpshare/share"

//抽奖页面
import Signone from "../page/Integral/Signone"
import Gain from "../page/Integral/Gain"

//引导页
import bladdkeywords from '../page/Keyword/bladdkeywords.vue'

import proschedule from '../page/my/ProSchedule'



Vue.use(Router)

export default new Router({
    routes: [
        {
            path: '/',
            redirect: '/index' // 重定向到一级
        },
        {
            path: '/index',
            name: 'index',
            component: index,
            meta: {
                keepAlive: true,
                title: '招标宝典'//开启缓存
            }
        },
        {
            path: '/login',
            name: 'login',
            component: login,
            meta: {
                title: '登录'
            }
        },
        {
            path: '/concise',
            name: 'concise',
            component: concise,
        },
        {
            path: '/ts',
            name: 'Ts',
            component: Ts,
            meta: {
                title: '推送数据'
            }
        },
        {
            path: '/iframe',
            name: 'iframe',
            component: iframe,
            meta: {
                title: '招标宝典'
            }
        },

        {
            path: '/searchList',
            name: 'searchList',
            component: searchList,
            meta: {
                keepAlive: true,
            }
        },
        {
            path: '/keyWords',
            name: 'keyWords',
            component: keyWords,
            meta: {
                title: '关键字'
            }
        },
        //新加路由
        {
            path: '/my',
            name: 'my',
            component: my,
            meta: {
                title: '我的'
            }
        },
        {
            path: '/set',
            name: 'set',
            component: set,
            meta: {
                title: '设置'
            }
        },
        {
            path: '/push',
            name: 'push',
            component: push,
            meta: {
                keepAlive: true,
                title: '推送设置'
            }
        },
        {
            path: '/mypro',
            name: 'mypro',
            component: myPro,
            meta: {
                title: '我关注的项目'
            }
        },
        {
            path: '/proschedule',
            name: 'proschedule',
            component: proschedule,
            meta: {
                title: '项目进度监控'
            }
        },
        {
            path: '/ques',
            name: 'ques',
            component: ques,
            meta: {
                title: '常见问题'
            }
        },
        {
            path: '/myfoot',
            name: 'myfoot',
            component: myFoot,
            meta: {
                title: ' '
            }
        },
        {
            path: '/myopinion',
            name: 'myopinion',
            component: myOpinion,
            meta: {
                title: '意见反馈'
            }
        },
        {
            path: '/business',
            name: 'business',
            component: business,
            meta: {
                title: '个人中心'
            }
        },
        {
            path: '/lookup',
            name: 'lookup',
            component: Lookup,
        },
        {
            path: '/export',
            name: 'export',
            component: Export,
            meta: {
                keepAlive: true,
                title: '数据导出'
            }
        },

        {
            path: '/exportExcel',
            name: 'exportExcel',
            component: ExportExcel,
            meta: {
                title: '数据导出'
            }
        },
        {
            path: '/addkeywords',
            name: 'addkeywords',
            component: addkeywords,
            meta: {
                keepAlive: true,
                title: '关键词'
            }
        },

        {
            path: '/addkeyword',
            name: 'addkeyword',
            component: addkeyword,
            meta: {
                title: '添加您关注的行业'
            }
        },
        {
            path: '/keywordslist',
            name: 'keywordslist',
            component: keywordslist,
            meta: {
                title: '添加关键词'
            }
        },
        {
            path: '/excludeKeyWord',
            name: 'excludeKeyWord',
            component: excludeKeyWord,
            meta: {
                title: '排除关键词'
            }
        },
        {
            path: '/Keyinfolist',
            name: 'Keyinfolist',
            component: Keyinfolist,
            meta: {
                // keepAlive: true,
                title: '招标宝典'
            }
        },
        //签到 Sign
        // {
        //     path: '/sign',
        //     name: 'Sign',
        //     component: Sign,
        //     meta: {
        //         keepAlive: false,
        //         title: '签到送积分'
        //     }
        // },
        {
            path: '/record',
            name: 'Record',
            component: Record,
            meta: {
                keepAlive: false,
                title: '兑换记录'
            }
        },
        {
            path: '/helpshare',
            name: 'helpshare',
            component: helpshare,
            meta: {
                keepAlive: false,
                title: '分享助力'
            }
        },
        {
            path: '/share',
            name: 'share',
            component: share,
            meta: {
                keepAlive: false,
                title: '分享助力'
            }
        },
        // {
        //     path: '/signone',
        //     name: 'Signone',
        //     component: Signone,
        //     meta: {
        //         title: '签到送积分'
        //     },
        // },
        {
            path: '/gain',
            name: 'Gain',
            component: Gain,
            meta: {
                title: '积分任务'
            },
        },
        {
            path: '/bladdkeywords',
            name: 'bladdkeywords',
            component: bladdkeywords,
            meta: {
                keepAlive: false,
                title: '招标宝典'
            }
        },

    ],
    base: '/mqy/ZBSystem',
    mode: 'hash'//去除地址上的#
})
