/*
 * @Author: ZhangZhen
 * @Date: 2021-11-27 17:11:48
 * @LastEditTime: 2021-12-22 11:15:31
 * @LastEditors: ZhangZhen
 * @Description: Zz's design
 * @FilePath: \workplace\src\store\index.js
 */
import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

import getters from './getters';

//动态添加模块
const modulesFiles = require.context('./modules', true, /\.js$/);
const modules = {};
modulesFiles.keys().map(key => {
  const keys = key.replace(/(\.\/|\.js)/g, '')
  modules[keys.split('/').pop()] = modulesFiles(key).default
});

const store = new Vuex.Store({
  modules,
  state: {
  },
  getters:{
 
    ...getters
  },
  mutations: {
   
  },
  actions: {

  }
});

export default store;
