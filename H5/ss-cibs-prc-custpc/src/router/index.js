/*
 * @Author: ZhangZhen
 * @Date: 2022-01-28 11:25:30
 * @LastEditTime: 2022-11-04 15:24:03
 * @LastEditors: Please set LastEditors
 * @Description: Zz's design
 * @FilePath: \webbank-pc\src\router\index.js
 */
import Vue from 'vue';
import VueRouter from 'vue-router';

Vue.use(VueRouter);

import _ from 'lodash';

import homeRoutes from './home';
import paymentSettlement from './paymentSettlement';
import internationalBusiness from './internationalBusiness';
import authorizeCenter from './authorizeCenter';
import seriveQuery from './seriveQuery';
// import allInvestment from './allInvestment';
import _businessManagement from './_businessManagement';
import accountManagement from './accountManagement';
import investementFinacing from './investementFinacing';
import applyCheckBoock from './applyCheckBoock';
import payService from './payService';
import specialInstruction from './specialIntruction'
import user from './user'

const isProduction = process.env.NODE_ENV === 'production';

//3.1版本 在路由跳转的时候两次push replace 的path地址相同
const routerPush = VueRouter.prototype.push
VueRouter.prototype.push = function push(location) {
  return routerPush.call(this, location).catch(error => error)
}
const routerReplace = VueRouter.prototype.replace
VueRouter.prototype.replace = function push(location) {
  return routerReplace.call(this, location).catch(error => error)
}

//基本的路由页面，不需要通过后台返回的
export const mainRouter = [
  {
    name: 'Login',
    path: '/login',
    component: () => import(`@/views/user/login`),
    meta: {
      title: '登录'
    },
    children: []
  },
  {
    path: '/login/firstLogin',
    component: () => import(`@/components/login/components/firstLogin.vue`),
    meta: {
      title: '首次登录'
    }
  },
  {
    path:'/login/resetUserName',
    component: () => import(`@/components/login/components/resetUserName`),
    meta:{
      title:'忘记用户名'
    }
  },
  {
    path:'/login/checkHKDID',
    component: ()=>import(`@/components/login/components/checkHKD`),
    meta:{
      title:'HKDID验证'
    }
  },
 
  ...homeRoutes,

  {
    path: '/layout',
    name: 'layout',
    component: () => import('@/components/layout'),
    children: [
      ...paymentSettlement,
      // ...allInvestment,
      ...internationalBusiness,
      ...authorizeCenter,
      ...seriveQuery,
      ...accountManagement,
      ..._businessManagement,
      ...investementFinacing,
      ...applyCheckBoock,
      ...payService,
      ...user,
      ...specialInstruction
    ]
  }
];

const createRouter = () => {
  return new VueRouter({
    routes: _.cloneDeep(mainRouter),
    // mode: isProduction ? 'hash' : 'history'
  })
}

const router = createRouter()

// 退出登录或者更改角色或者重新addroutes 需要resetRouter
export function resetRouter() {
  const newRouter = createRouter()
  router.options.routes = _.cloneDeep(mainRouter)

  router.matcher = newRouter.matcher // reset router
}

export const defaultLeftMenus = [{
  path: '/homePage',
  name: 'main',
  component: () => import('@/views/home'),
  meta: {
    title: '首页',
    icon: 'menu-home',
  }
}];


export default router; 