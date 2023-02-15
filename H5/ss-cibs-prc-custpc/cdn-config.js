/*
 * @Author: ZhangZhen
 * @Date: 2022-02-21 17:14:31
 * @LastEditTime: 2022-07-06 11:46:10
 * @LastEditors: Please set LastEditors
 * @Description: Zz's design
 * @FilePath: \webbank-pc\cdn-config.js
 */
const isProduction = process.env.NODE_ENV === 'production';
const {
  VUE_APP_CDN_API
} = process.env;

/** cdn配置 */
const cdn = {
  dev: {
    css: [],
    js: []
  },
  build: {
    css: [],
    js: [
      `${VUE_APP_CDN_API}/vue/vue.min.js`,
      `${VUE_APP_CDN_API}/vue-router/vue-router.min.js`,
      `${VUE_APP_CDN_API}/vuex/vuex.min.js`,
      `${VUE_APP_CDN_API}/vue-i18n/vue-i18n.min.js`,
      `${VUE_APP_CDN_API}/axios/axios.min.js`,
      `${VUE_APP_CDN_API}/echarts/echarts.min.js`,
      `${VUE_APP_CDN_API}/nprogress/nprogress.js`,
      `${VUE_APP_CDN_API}/element-ui/index.js`,
      `${VUE_APP_CDN_API}/lodash/lodash.js`,
    ],
  }
};
/** 忽略打包的依赖 */
const externals = isProduction ? {
  'vue': 'Vue',
  'vue-router': 'VueRouter',
  'vuex': 'Vuex',
  'vue-i18n': 'VueI18n',
  'axios': 'axios',
  'echarts': 'echarts',
  'element-ui': 'ELEMENT',
  'nprogress': 'NProgress',
  'lodash': '_',
} : {};

const target = {
  // SIT: 'http://10.98.33.100:10003', // Sit测试环境z
  SIT: 'https://220.241.39.45/', // Sit测试环境z
  // UAT: 'http://10.98.33.31:10003', // Uat环境
  UAT: 'https://220.241.39.45/', // Uat环境
  UAT3: 'https://220.241.39.47:6888/', // Uat3环境
  DEV: 'http://10.98.17.60:10003', // Dev环境
  YANSHI:'http://192.168.67.51/',// 演示环境
};

module.exports = {
  cdn,
  externals,
  target,
};
