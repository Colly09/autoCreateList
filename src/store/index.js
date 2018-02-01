import Vue from 'vue'
import Vuex from 'vuex'
import api from './modules/Api'

Vue.use(Vuex)

export default new Vuex.Store({
  strict: process.env.NODE_ENV !== 'production',
  modules: {
    api
  }
})
