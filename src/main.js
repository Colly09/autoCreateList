// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import router from './router'
import store from './store'
// import axios from 'axios'

Vue.use(ElementUI);

Vue.config.productionTip = false;

//将变量挂载到vue
Vue.prototype.$selfConfig = window.Config;
Vue.prototype.$format = window.format;
// Vue.prototype.$axios = axios;

/* eslint-disable no-new */
new Vue({
  el: '#app',
  config: Config,
  store,
  router,
  components: { App },
  template: '<App/>'
})
