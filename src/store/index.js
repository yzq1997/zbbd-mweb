import Vue from 'vue'
import Vuex from 'vuex'
import { get } from 'js-cookie'
Vue.use(Vuex)
var store = new Vuex.Store({
  state: {
    isTabbarShow: true,
    active: 0,
  },
  mutations: {     //更改状态的唯一方法
    show(state) {
      state.isTabbarShow = true
    },
    hide(state) {
      state.isTabbarShow = false
    },
    activeOne(state, data) {
      state.active = data;
    },
    activeTwo(state, data) {
      state.active = data
    },
    activeThr(state, data) {
      state.active = data
    }
  },
})

export default store;
