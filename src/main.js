// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'

import Vuetify from 'vuetify/src/index'
import './stylus/main.styl'
Vue.use(Vuetify)

import App from '@/App'
import http from '@/http'
import router from '@/router'
import store from '@/store'

import '@/plugins'

Vue.config.productionTip = false
Vue.config.silent = process.env.NODE_ENV === 'production'
Vue.config.devtools = process.env.NODE_ENV !== 'production'

const app = new Vue({
  el: '#app',
  store,
  router,
  http,
  template: '<App/>',
  components: { App }
})

if (process.env.NODE_ENV !== 'production') {
  window.Vue = Vue
  window.app = app
}
