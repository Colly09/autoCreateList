import { commonAjaxGet, commonAjaxPost, constructQueryString } from '../../common/function'
import config from '../../common/config'
import { stat } from 'fs';

const state = {
  tableData: [],
  pageData: [],
  operateData: {},
  searchData:{}
}

const getters = {
  tableData: state => state.tableData,
  pageData: state => state.pageData,
  operateData: state => state.operateData,
  searchData: state => state.searchData,
}

const actions = {
  doAjax({ commit }, data) {
    let url = data.ajaxUri;
    delete data.ajaxUri;
    return commonAjaxPost(url, data).then(body => {
      return body
    })
  },

  getTableData({ commit }, data){
    let url = data.ajaxUri;
    delete data.ajaxUri;
    return commonAjaxPost(url, data).then(body => {
      commit('SET_TABLE_DATA', body.data.list)
      commit('SET_PAGE_DATA', body.data.page)
    })
  }
}

const mutations = {
  SET_TABLE_DATA(state, data) {
    state.tableData = data
  },
  SET_PAGE_DATA(state, data) {
    state.pageData = data
  },
  SET_OPERATE_DATA(state, data){
    state.operateData = data
  },
  SET_SEARCH_DATA(state, data) {
    state.searchData = data
  },
}

export default {
  state,
  getters,
  actions,
  mutations
}
