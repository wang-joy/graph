import Vue from 'vue'
import axios from 'axios'
import './assets/css/reset.css'
import App from './App'
import router from './router'
import store from './store'
import ElementUI from 'element-ui'
import IScrollView from 'vue-iscroll-view'
import IScroll from 'iscroll'
import 'element-ui/lib/theme-chalk/index.css'
import 'svg.select.js/dist/svg.select.css'
// import '@/svg/WinEvt'
if (!process.env.IS_WEB) Vue.use(require('vue-electron'))
Vue.http = Vue.prototype.$http = axios
Vue.config.productionTip = false
Vue.use(ElementUI)
Vue.use(IScrollView, IScroll)
/* eslint-disable no-new */
new Vue({
  components: { App },
  router,
  store,
  template: '<App/>'
}).$mount('#app')
