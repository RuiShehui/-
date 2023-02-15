import 'babel-polyfill'; //如果需要兼容到IE9就打开
import Vue from 'vue';
import App from './App';
import NProgress from 'nprogress';

import ElementUI from 'element-ui';
import 'element-ui/packages/theme-chalk/src/index.scss';

import './style/index.scss';

import {
  getToken,
  getNeedUpdatePassword,
  setNeedUpdatePassword
} from '@/utils/user';

// 路由
import router from './router';
// 状态管理
import store from './store';
// 国际化
import i18n from './i18n';
// 全局过滤器
import vFilter from './filters';
// 包装类原型初始化
import './utils/initPrototype/string';
// 公共组件注册
import installComponents from '@/components';


import cancelToken from '@/utils/cancelAxios';
// 自定义的confirmA
import {
  myConfirm,
  myAlert,
  myMessage,
  otpDialog
} from '@/components/messageBox';

import createPdf from '@/utils/pdf-generator';

Vue.prototype.$pdf = createPdf;

// Vue.prototype.$regExp = regExpression // 暂时没用到

Vue.use(installComponents);

for (const key in vFilter) {
  Vue.filter(key, vFilter[key]);
}

Vue.prototype.$vFilter = vFilter;

// Vue.prototype.$notify = ElementUI.Notification
document.onselectstart = function () {
  return false
}

// Vue.use(webideSupport)
Vue.use(ElementUI, {
  i18n: (key, value) => i18n.t(key, value)
});

// 目前没用到
// Vue.prototype.$AUTH = function (path, wid) {
//   var widgetMap = store.state.user.auth || {};
//   return path && wid && widgetMap[path] && (widgetMap[path].indexOf(wid) !== -1);
// }

Vue.prototype.$confirm = myConfirm;
Vue.prototype.$alert = myAlert;
Vue.prototype.$message = myMessage;

Vue.config.productionTip = false;

const whiteList = [
  '/404',
  '/home',
  '/home/homePage',
  '/homePage/tips',
  '/homePage/notice',
  '/login/firstLogin',
  '/login/checkHKDID',
  '/login/resetUserName',
  '/login/resetPassword',
  '/user',
  '/user/resetPassword',
  '/user/myUserName',
  '/user/safe',
  '/user/safe/erweima',
  '/user/safe/setSfotToken',
  '/user/safe/softTokenMode',
  '/user/safe/softTokenResult',
  '/layout',
  // 现金管理
  '/bankTransfer/paymentSettlement/intraBankTransfer',
  '/bankTransfer/paymentSettlement/fast',
  '/bankTransfer/paymentSettlement/localtransfer',
  '/bankTransfer/paymentSettlement/remittance',
  '/bankTransfer/transferRecord/index',
  '/bankTransfer/registerThirdAccount/registerAccountIndex',
  '/paymentSettlement/batchTransfer/recordManually',
  '/paymentSettlement/batchTransfer/search',
  '/paymentSettlement/batchTransfer/details',
  '/paymentSettlement/payDay/recordManually',
  '/paymentSettlement/payDay/search',
  '/paymentSettlement/payDay/details',
  '/paymentSettlement/payee/recordManually',
  '/paymentSettlement/payee/search',
  '/paymentSettlement/payee/details',
  '/bankTransfer/appointTransactionManage/index',

  // 申领支票溥
  '/more/applyCheckbook',

  //定期存款 
  '/investmentFinancing/fixedDeposit',
  '/investmentFinancing/fixedDeposit/details',
  '/investmentFinancing/fixedDeposit/details/beforeDetails',
  '/investmentFinancing/fixedDeposit/details/expiredDetails',
  '/investmentFinancing/openFixed',
  '/investmentFinancing/changeDueTip',
  '/investmentFinancing/changeDueTip/formInfo',

  // 投资服务
  '/allInvestment/investment/investment',
  '/allInvestment/investment/myFunds',
  '/allInvestment/investment/myFundsSwitch',
  '/allInvestment/investment/myFundsRedemption',
  '/allInvestment/investment/myFundsSubscription',
  '/allInvestment/investment/investDealRecord',
  '/allInvestment/investment/fundMonth',
  '/allInvestment/investment/iframeThirdPage',

  // 账户管理
  '/accountManagement/assetOverview',
  '/accountManagement/accountDetails',
  '/accountManagement/transactionDetailEnquiry',
  '/accountManagement/toTransactionDetail',
  '/accountManagement/electronicStatement',
  '/accountManagement/electronicReceipt',

  // 网银管理
  '/_businessManagement/operatorMaintain',
  '/_businessManagement/operatorMaintain/newOperator',
  '/_businessManagement/operatorMaintain/modifyInfo',
  '/_businessManagement/operatorMaintain/seeUser',
  '/_businessManagement/operatorMaintain/updateOperator',
  '/_businessManagement/operatorMaintain/userResult',

  // 账户管理
  '/_businessManagement/accountMaintenance',
  '/_businessManagement/result',

  // 授权模板维护
  '/_businessManagement/authManagement/rightsTemplate',
  '/_businessManagement/authManagement/dealMandate',
  '/_businessManagement/authManagement/detail',
  '/_businessManagement/authManagement/tranDetail',
  '/_businessManagement/authManagement/addTemplate',
  '/_businessManagement/authManagement/resultTemplate',
  '/_businessManagement/authManagement/dealMandate/result',

  // 服务设定
  '/_businessManagement/serviceSetting/enterpriseQuota',
  '/_businessManagement/serviceSetting/bindingAccount',
  '/_businessManagement/serviceSetting/bindingAccount/contact',
  '/_businessManagement/serviceSetting/bindingAccount/uncontact',
  '/_businessManagement/serviceSetting/bindingAccount/modify',
  '/_businessManagement/serviceSetting/smallTransfer',
  '/_businessManagement/serviceSetting/smallTransfer/result',
  '/_businessManagement/serviceSetting/edda',
  '/_businessManagement/serviceSetting/edda/elePayment',
  '/_businessManagement/serviceSetting/edda/elePayment/detail',
  '/_businessManagement/serviceSetting/edda/elePayment/modify',
  '/_businessManagement/serviceSetting/edda/elePayment/eddaResult',
  '/_businessManagement/serviceSetting/eleStatements',
  '/_businessManagement/serviceSetting/tradingTips',
  '/_businessManagement/serviceSetting/tradingTips/result',

  // 授权中心
  '/_businessManagement/authorizeCenter/waitAuth',
  '/_businessManagement/authorizeCenter/mySubmit',
  '/_businessManagement/authorizeCenter/detail',
  '/_businessManagement/authorizeCenter/mySubmit/result',

  // 操作员日志
  '/_businessManagement/operatorLog',

  //投资服务
  '/internationalBusiness/forexListPrice/forexListPrice',
  '/internationalBusiness/remittanceConfirm/remittanceConfirm',
  //授权中心
  '/authorizeCenter/waitAuth',
  '/authorizeCenter/mySubmit',
  '/authorizeCenter/detail',
  '/authorizeCenter/result',

  //查询服务
  '/seriveQuery/interestRateQuery',
  '/seriveQuery/historyQuery',
  '/seriveQuery/historyQueryDetail',
  '/authorizeCenter/detail',
  '/seriveQuery/transactionDetail',
  '/seriveQuery/serviceCenter',
  '/seriveQuery/download',
  '/seriveQuery/downloadone',
  '/seriveQuery/forexListPrice',

  //缴费服务
  '/payService/billPayment',
  '/payService/highRiskBusiness',
  '/payService/advancePayManagement',
  '/payService/highRiskBusiness/busniessInfo',
  '/payService/advancePayManagement/modify',
  

  // 特殊指令递交申请
  "/specialInstruction/applicationSpecial"
]

router.beforeEach(async (to, from, next) => {
  NProgress.start();
  // const wpath = window.location.hash.split('?')[0].replace('#/', '');
  // const routes = router.options.routes;
  if (to.path.startsWith('/html/')) {
    next();
    return
  }
  const token = getToken();

  const needUpdatePassword = getNeedUpdatePassword();
  if (token && needUpdatePassword !== 'Y') {
    if (to.path === '/login') {
      setNeedUpdatePassword("N")
      next({
        path: '/'
      });
      return;
    } else {
      try {
        //获取菜单
        const menus = await store.dispatch('user/getMenus');
        // const menus = await store.dispatch('user/getMenus');
        //把菜单转化为路由
        const accessRoutes = await store.dispatch('permission/transformRoutes', menus);
        //把菜单加入到路由
        router.options.routes.forEach(element => {
          if (element.isLayout) {
            if (!element.children) element.children = [];
            element.children.push(...accessRoutes);
            return;
          }
        });
        router.addRoutes(router.options.routes);
        next({
          path: to.redirectedFrom || to.path,
          replace: true,
          query: to.query
        });
      } catch (error) {
        // 删除token 并跳转到登录页
        await store.dispatch('user/resetToken');
        // cancelToken.clearPending()
        next(`/login`);
      }
      // }
    }
  } else {
    let status = JSON.parse(sessionStorage.getItem('userInfo'))

    if (whiteList.indexOf(to.path) !== -1 || to.path === '/login') {
      next();
    } else {
      next(`/login`);
    }
    if (to.path == '/user/safe') {
      if (status.softTokenInfo.status == '0' || status.softTokenInfo.status == '1') {
        next('/user/safe/setSfotToken')
      } else {
        next('/user/safe/softTokenMode')
      }
    }
  }
})

router.afterEach(() => {
  // 在即将进入新的页面组件前，关闭掉进度条
  NProgress.done();
})

const {
  VUE_APP_IMAGES_API
} = process.env;

new Vue({
  i18n,
  router,
  store,
  provide: {
    imageBase: VUE_APP_IMAGES_API,
  },
  render: h => h(App)
}).$mount('#app');