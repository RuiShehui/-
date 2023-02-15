/*
 * @Author: zhangcheng
 * @Date: 2022-01-27 16:11:31
 * @LastEditTime: 2022-02-18 15:35:04
 * @LastEditors: zhangcheng
 * @Description: Do not Edit
 * @FilePath: \ss-cibs-prc-custpc\src\router\allInvestment\index.js
 */
export default [{
    path: '/allInvestment/investment/investment',
    name: 'investment',
    component: () => import('@/views/allInvestment/investment/investment.vue'),
    meta: {
      title: '基金认购'
    }
  },
  {
    path: '/allInvestment/investment/myFundsSubscription',
    name: 'MyFundsSubscription',
    component: () => import('@/views/allInvestment/investment/myFundsSubscription/index.vue'),
    meta: {
      title: '基金认购'
    }
  },
  {
    path: '/allInvestment/investment/myFunds',
    name: 'myFunds',
    component: () => import('@/views/allInvestment/investment/myFunds/index.vue'),
    meta: {
      title: '我的基金'
    },
  },
  {
    path: '/allInvestment/investment/fundMonth',
    name: 'fundMonth',
    component: () => import('@/views/allInvestment/investment/fundMonth/index.vue'),
    meta: {
      title: '基金月报'
    },
  },
  {
    path: '/allInvestment/investment/iframeThirdPage',
    name: 'iframeThirdPage',
    component: () => import('@/views/allInvestment/investment/iframeThirdPage.vue'),
    meta: {
      title: '基金认购第三方页面'
    },
  },
  {
    path: '/allInvestment/investment/myFundsSwitch',
    name: 'myFundsSwitch',
    component: () => import('@/views/allInvestment/investment/myFundsSwitch/index.vue'),
    meta: {
      title: '我的基金'
    },
  },
  {
    path: '/allInvestment/investment/myFundsRedemption',
    name: 'myFundsRedemption',
    component: () => import('@/views/allInvestment/investment/myFundsRedemption/index.vue'),
    meta: {
      title: '我的基金'
    },
  },
  {
    path: '/allInvestment/investment/investDealRecord',
    name: 'investDealRecord',
    component: () => import('@/views/allInvestment/investment/investDealRecord/index.vue'),
    meta: {
      title: '投资交易记录'
    },
  }
]