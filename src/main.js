import Vue from 'vue'
import App from './App.vue'
// eslint-disable-next-line no-unused-vars
import router from "./router"
import store from "./store"
import { BootstrapVue, IconsPlugin } from 'bootstrap-vue'
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'

// Install BootstrapVue
Vue.use(BootstrapVue);
// Optionally install the BootstrapVue icon components plugin
Vue.use(IconsPlugin);

import global_msg from './global.js' //挂载全局变量
Vue.prototype.$global_msg = global_msg;

import util from './util.js' //挂载全局函数
Vue.use(util);

import Axios from 'axios' //挂载axios
Vue.prototype.$axios = Axios;

import Vuex from 'vuex'
Vue.use(Vuex);

import Resource from 'vue-resource';
Vue.use(Resource); //使用resource

import VueLazyload from 'vue-lazyload'
Vue.use(VueLazyload);

Vue.config.productionTip = false;

new Vue({
  router,
  // 引入路由对象
  store,
  render: h => h(App),
}).$mount('#app');

