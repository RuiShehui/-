// 开启增量部署
// () => process.env.NODE_ENV === 'production' && import('@/utils/system.min.js');
// import 'babel-polyfill'   //如果需要兼容到IE9就打开
import Vue from 'vue';
import App from './App.vue';
import NProgress from 'nprogress';
import 'nprogress/nprogress.css';
import ElementUI from 'element-ui';
// import 'element-ui/packages/theme-chalk/src/index.scss';
import 'inmanage-web-style/theme/index.css';
import './style/element-icons.scss';

import {
  getToken,
  getHead
} from '@/utils/user';
import Lib, {
  _import
} from '@v2-lib/vue.spa.plugin'
//路由
import router from './router';
//状态管理
import store from './store';
//in18国际化
import VueI18n from 'vue-i18n';
import i18nIns from './i18n/instance';
// zz's plugins
import zzPlugins from '@/plugins';
import { path } from 'koa/lib/request';

Vue.use(VueI18n);
Vue.use(ElementUI);
Vue.use(Lib);

Vue.use(zzPlugins);

Vue.config.productionTip = false;

const whiteList = store.getters['permission/whiteList'];

router.beforeEach(async (to, from, next) => {

  NProgress.start();
  let wpath = window.location.hash.split('?')[0].replace('#/', '');
  let routes = router.options.routes;
  
  const token = getToken();
  const head = getHead();

  const isLogin = (token && head) ? true : false;

  // 打开新窗口
  if (
    sessionStorage.getItem('openWindow') &&
    sessionStorage.getItem('openWindow') === wpath
  ) {
    routes.push({
      path: '/' + wpath,
      component: _import(wpath),
      hidden: true
    });
    router.addRoutes(routes);
  }
 
  if (isLogin) {
    if (to.path === '/login') {
      router.push('/homePage');
      next();
    } else {
      const hasRoute =
        await store.getters['permission/whiteList'].some(item => item.includes(to.path));
        console.log(hasRoute,'hasRoute')
      if (hasRoute) {
        next()
      } else {
        console.log(4)
        router.push('/homePage');
        next();
      }
    }
  } else {
    // 不需要登录的页面
    if (whiteList.includes(to.path) || to.path === '/login') {
      next();
    } else {
      next('/login');
    }
  }
});

router.afterEach(() => {
  // 在即将进入新的页面组件前，关闭掉进度条
  NProgress.done()
});

new Vue({
  router,
  store,
  methods: {
    closeTab(path) {
      this.$store.commit('tabs/DELETE_TABS', path || this.$store.getters.getActiveTab);
    },
    close(path) {
      this.closeTab(path);
    }
  },
  i18n: i18nIns,
  render: h => h(App)
}).$mount('#app');