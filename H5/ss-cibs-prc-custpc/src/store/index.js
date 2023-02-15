/*
 * @Author: ZhangZhen
 * @Date: 2022-01-28 11:25:31
 * @LastEditTime: 2022-03-10 11:19:36
 * @LastEditors: zhangcheng
 * @Description: Zz's design
 * @FilePath: \ss-cibs-prc-custpc\src\store\index.js
 */
import Vue from "vue";
import Vuex from "vuex";
// modules import
import App from './modules/app';
import Announcement from './modules/announcement';
import Home from './modules/home';
import Fund from './modules/fund';

Vue.use(Vuex);

// 动态引入./modules里的文件
/* const files = require.context("./modules", true, /\.js$/);
const modules = files.keys().reduce((modules, filePath) => {
  const fileName = filePath.replace(/^\.\/(.*)\.\w+$/, "$1");
  const value = files(filePath);
  modules[fileName] = value.default;
  // console.log(modules,'modules')
  return modules;
}, {}); */

const store = new Vuex.Store({
  strict: process.env.NODE_ENV !== "production", // 在非生产环境下，使用严格模式
  modules: {
    app: App,
    announcement: Announcement,
    home: Home,
    fund: Fund,
  }
});

export default store;

/*
  store.commit('app/SET_LOADING', true)
  console.log(store.state.app.requestLoading);
*/