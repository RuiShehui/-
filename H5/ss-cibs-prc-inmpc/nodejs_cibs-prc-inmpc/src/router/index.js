/*
 * @Author: ZhangZhen
 * @Date: 2021-11-27 17:11:48
 * @LastEditTime: 2022-11-02 10:36:58
 * @LastEditors: Please set LastEditors
 * @Description: Zz's design
 * @FilePath: \ss-cibs-prc-inmpc\nodejs_cibs-prc-inmpc\src\router\index.js
 */
import Vue from 'vue';
import VueRouter from 'vue-router';
import _ from 'lodash';

// import homePage from '../views/home/homePage';

import Layout from '@/layout';

import NotFound from '@/views/404';
// import Main from '@/views/main/main'
import BusinessMagament from './businessMangament';
import CustomerManagement from './customerManagement';
import SystemMangement from './systemMangement';
import AuthorizationCenter from './authorizationCenter';
import StatiscalQuery from './statiscal-query';
// 2022-10-24 特殊指令
// import specialInstruction from './specialInstruction'
Vue.use(VueRouter)

;((VueRouter) => {

  const routerPush = VueRouter.prototype.push,
    routerReplace = VueRouter.prototype.replace;

  VueRouter.prototype.push = function push(location) {
    return routerPush.call(this, location).catch(error => error);
  }
  VueRouter.prototype.replace = function push(location) {
    return routerReplace.call(this, location).catch(error => error);
  }

})(VueRouter);


//基本的路由页面，不需要通过后台返回的
export const mainRouter = [
  // {
  //   path: '/homePage',
  //   name: 'homePage',
  //   component: () => import('@/views/home/homePage.vue'),
  //   meta: {
  //     title: 'HomePage',
  //     icon: 'el-icon-goods'
  //   }
  // },
  {
    path: '/',
    redirect: '/login',
    component: Layout,
    meta: {
      title: 'HomePage',
      icon: require('@/img/menu-icon/home-page.png'),
      backIcon: require('@/img/menu-icon/home-page-back.png'),
    },
    children: [{
      path: '/homePage',
      name: 'homePage',
      component: () =>
        import('@/views/home/homePage.vue'),
      meta: {
        title: 'HomePage',
        // icon: 'el-icon-goods'
      }
    }, ],
    hidden: true
  },
  {
    path: '/homePage',
    name: 'homePage',
    component: () =>
      import('@/views/home/homePage.vue'),
    meta: {
      title: 'HomePage',
      icon: require('@/img/menu-icon/home-page.png'),
      backIcon: require('@/img/menu-icon/home-page-back.png'),
    }
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import('@/views/Login.vue'),
    hidden: true
  },
  {
    path: '*',
    redirect: '/404',
    component: NotFound,
    hidden: true
  }
];

mainRouter.push(BusinessMagament);
mainRouter.push(CustomerManagement);
mainRouter.push(SystemMangement);
mainRouter.push(AuthorizationCenter);
mainRouter.push(StatiscalQuery);
// 2022-10-24 特殊指令
// mainRouter.push(specialInstruction)

const createRouter = () => {
  return new VueRouter({
    routes: _.cloneDeep(mainRouter)
  });
}

const router = createRouter();

// 退出登录或者更改角色或者重新addroutes 需要resetRouter
export function resetRouter() {
  const newRouter = createRouter();
  router.options.routes = _.cloneDeep(mainRouter);

  router.matcher = newRouter.matcher; // reset router
}

export default router;