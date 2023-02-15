/*
 * @Author: ZhangZhen
 * @Date: 2021-11-27 17:11:48
 * @LastEditTime: 2022-11-07 20:09:29
 * @LastEditors: Please set LastEditors
 * @Description: Zz's design
 * @FilePath: \ss-cibs-prc-inmpc\nodejs_cibs-prc-inmpc\src\store\modules\permission.js
 */
import {
  _import
} from '@v2-lib/vue.spa.plugin';

import AEmpty from '@v2-lib/vue.spa.plugin/components/empty.vue';
import routeInfoList from '@/configs/white-list';

const filterAsyncRouter = (asyncRoutes) => {

  let res = asyncRoutes.map(route => {
    if (!route.component) {
      route.component = AEmpty;
    }
    if (typeof route.component === 'string') {
      // route.componentUrl = route.component;
      route.component = _import(route.component, route.deploy);
    }
    if (route.children && route.children.length) {
      route.children = filterAsyncRouter(route.children);
    }
    return route;
  })

  return res;
}

const state = {
  routes: [],
}

const mutations = {
  SET_ROUTES(state, routes) {
    state.routes = routes;
  },
}
const actions = {
  transformRoutes({
    commit
  }, routes) {
    return new Promise((resolve) => {
      let accessRoutes = filterAsyncRouter(routes, true);
      commit('SET_ROUTES', accessRoutes);
      resolve(accessRoutes);
    })
  },
  FILTER_ROUTES({
    commit
  }) {
    commit('SET_ROUTES', []);
  }
}

const getters = {
  whiteList(state) {
    const whiteList = [
      '/',
      '/homePage',
      'login',
      '/login',
      'Login',
      '/Login',
      '/customerManagement/specialManagement'
      // /* 2022-01-04 开发时暂用 */
      // //特殊天气
      // // '/systemManagement/weatherSetting',
      // // '/statiscal-query',                                     
      // // '/statiscal-query/op-logs',
      // // '/statiscal-query/high-risk',
      // // 网上银行客户情况统计报表-
      // '/statiscal-query/internet-bank-customer-statistics',
      // // // 申领支票簿
      // '/statiscal-query/apply-checkbook',
      // // 网上银行每日可疑交易报表
      // '/statiscal-query/internet-dubious-transfer',
      // // 公司客户销售报表
      // '/statiscal-query/compony-customer-salesman',
      // // 未启用网银客户报表
      // '/statiscal-query/not-enabled-banking',
      // // 公司客户开户报表 zl
      // '/statiscal-query/customer-open-statement',
      // // 客户交易日志报表 zl
      // '/statiscal-query/customer-transaction-report',
      // // 修改客户信息报表 zl
      // // '/statiscal-query/change-customer-info',
      // // 重置密码报表 zl
      // '/statiscal-query/reset-password',
      // // 密码生成/重置异常报表
      // '/statiscal-query/psd-add-reset-error',
      // // 公司客户销户报表
      // '/statiscal-query/compony-customer-destory',
      // // 网上银行每日高风险交易
      // '/statiscal-query/internet-bank-high-risk',
      // // CIBS和t24的对比异常报表
      // '/statiscal-query/cibs-and-t24-error',
      // // 高风险交易汇总报表
      // '/statiscal-query/high-risk-transfer',
      // // 网银密码生成汇总报表
      // '/statiscal-query/webbank-psd-created',
      // // 网银交易数据报表
      // '/statiscal-query/webbank-transfer-data',
      // // 已接受的银行间资金转账报表
      // '/statiscal-query/isreport-bank-transfer',
      // // 缴付账单对账汇总报表
      // '/statiscal-query/pay-bill-rec',
      // // 缴付账单对账明细报表
      // '/statiscal-query/pay-bill-rec-detail',
      // // 操作员日志
      // '/statiscal-query/op-logs',
      /* 2022-01-04 开发时暂用 */
    ];
    routeInfoList.forEach(r1 => {
      if (state.routes.some(r2 => r2.url === r1.url)) {
        whiteList.push(...r1.urlMap);
      }
    });
    return whiteList;
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions,
  getters
};