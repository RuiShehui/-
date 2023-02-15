/*
 * @Author: ZhangZhen
 * @Date: 2022-01-04 15:25:19
 * @LastEditTime: 2022-10-24 10:48:10
 * @LastEditors: Please set LastEditors
 * @Description: Zz's design
 * @FilePath: \ss-cibs-prc-inmpc\nodejs_cibs-prc-inmpc\src\router\statiscal-query\index.js
 */
import Layout from '@/layout';

export default {
  path: '/statiscal-query',
  component: Layout,
  redirect: 'op-logs',
  meta: {
    title: 'StatiscalQuery',
    icon: require('@/img/menu-icon/statistical-query.png'),
    backIcon: require('@/img/menu-icon/statistical-query-back.png'),
  },
  children: [
    // 操作员日志
    {
      path: 'op-logs',
      name: 'OpLogs',
      component: () => import('@/views/op-logs'),
      meta: {
        title: 'OpLogs',
        type: 'index'
      },
      hidden: false,
    },
    // 网上银行每日高风险交易
    {
      path: 'internet-bank-high-risk',
      name: 'InternetBankHighRisk',
      component: () => import('@/views/statement-query/internet-bank-high-risk'),
      meta: {
        title: 'InternetBankHighRisk',
        type: 'index'
      },
      hidden: false,
    },
    // 申领支票簿
    {
      path: 'apply-checkbook',
      name: 'ApplyCheckbox',
      component: () => import('@/views/statement-query/apply-checkbook'),
      meta: {
        title: 'ApplyCheckbook',
        type: 'index'
      },
      hidden: false,
    },
    // 修改客户信息报表
    {
      path: 'change-customer-info',
      name: 'ChangeCustomerInfo',
      component: () => import('@/views/statement-query/change-customer-info'),
      meta: {
        title: 'ChangeCustomerInfo',
        type: 'index'
      },
      hidden: false,
    },
    // CIBS和t24的对比异常报表
    {
      path: 'cibs-and-t24-error',
      name: 'CibsAndT24Error',
      component: () => import('@/views/statement-query/cibs-and-t24-error'),
      meta: {
        title: 'CibsAndT24Error',
        type: 'index'
      },
      hidden: false,
    },
    // 公司客户销户报表
    {
      path: 'compony-customer-destory',
      name: 'ComponyCustomerDestory',
      component: () => import('@/views/statement-query/compony-customer-destory'),
      meta: {
        title: 'ComponyCustomerDestory',
        type: 'index'
      },
      hidden: false,
    },
    // 公司客户销售报表
    {
      path: 'compony-customer-salesman',
      name: 'ComponyCustomerSalesman',
      component: () => import('@/views/statement-query/compony-customer-salesman'),
      meta: {
        title: 'ComponyCustomerSalesman',
        type: 'index'
      },
      hidden: false,
    },
    // 公司客户开户报表
    {
      path: 'customer-open-statement',
      name: 'CustomerOpenStatement',
      component: () => import('@/views/statement-query/customer-open-statement'),
      meta: {
        title: 'CustomerOpenStatement',
        type: 'index'
      },
      // children:[
      //   {
      //     path:'customer-open-statement/user-detail',
      //     component:()=>import('@/views/statement-query/customer-open-statement/account-detail.vue')
      //   }
      // ],
      hidden: false,
    },
    // 客户交易日志报表
    {
      path: 'customer-transaction-report',
      name: 'CustomerTransactionReport',
      component: () => import('@/views/statement-query/customer-transaction-report'),
      meta: {
        title: 'CustomerTransactionReport',
        type: 'index'
      },
      hidden: false,
    },
    // 高风险交易汇总报表
    {
      path: 'high-risk-transfer',
      name: 'HighRiskTransfer',
      component: () => import('@/views/statement-query/high-risk-transfer'),
      meta: {
        title: 'HighRiskTransfer',
        type: 'index'
      },
      hidden: false,
    },
    // 网上银行客户情况统计报表
    {
      path: 'internet-bank-customer-statistics',
      name: 'InternetBankCustomerStatistics',
      component: () => import('@/views/statement-query/internet-bank-customer-statistics'),
      meta: {
        title: 'InternetBankCustomerStatistics',
        type: 'index'
      },
      hidden: false,
    },
    // 网上银行每日可疑交易报表
    {
      path: 'internet-dubious-transfer',
      name: 'InternetDubiousTransfer',
      component: () => import('@/views/statement-query/internet-dubious-transfer'),
      meta: {
        title: 'InternetDubiousTransfer',
        type: 'index'
      },
      hidden: false,
    },
    // 已接受的银行间资金转账报表
    {
      path: 'isreport-bank-transfer',
      name: 'IsreportBankTransfer',
      component: () => import('@/views/statement-query/isreport-bank-transfer'),
      meta: {
        title: 'IsreportBankTransfer',
        type: 'index'
      },
      hidden: false,
    },
    // 交付账单对账报表
    {
      path: 'pay-bill-rec',
      name: 'PayBillRec',
      component: () => import('@/views/statement-query/pay-bill-rec'),
      meta: {
        title: 'PayBillRec',
        type: 'index'
      },
      hidden: false,
    },
    {
      path: 'pay-bill-rec-detail',
      name: 'PayBillRecDetail',
      component: () => import('@/views/statement-query/pay-bill-rec-detail'),
      meta: {
        title: 'PayBillRecDetail',
        type: 'index'
      },
      hidden: false,
    },
    // 未启用网银客户报表
    {
      path: 'not-enabled-banking',
      name: 'NotEnabledBanking',
      component: () => import('@/views/statement-query/not-enabled-banking'),
      meta: {
        title: 'NotEnabledBanking',
        type: 'index'
      },
      hidden: false,
    },
    // 密码生成/重置异常报表
    {
      path: 'psd-add-reset-error',
      name: 'PsdAddResetError',
      component: () => import('@/views/statement-query/psd-add-reset-error'),
      meta: {
        title: 'PsdAddResetError',
        type: 'index'
      },
      hidden: false,
    },
    // 重置密码报表
    {
      path: 'reset-password',
      name: 'ResetPassword',
      component: () => import('@/views/statement-query/reset-password'),
      meta: {
        title: 'ResetPassword',
        type: 'index'
      },
      hidden: false,
    },
    // 网银密码生成汇总报表
    {
      path: 'webbank-psd-created',
      name: 'WebbankPsdCreated',
      component: () => import('@/views/statement-query/webbank-psd-created'),
      meta: {
        title: 'WebbankPsdCreated',
        type: 'index'
      },
      hidden: false,
    },
    // 网银交易数据报表
    {
      path: 'webbank-transfer-data',
      name: 'WebbankTransferData',
      component: () => import('@/views/statement-query/webbank-transfer-data'),
      meta: {
        title: 'WebbankTransferData',
        type: 'index'
      },
      hidden: false,
    },
    //网上银行客户情况统计报表
    {
      path: 'bank-customer-profile',
      name: 'Bank-Customer-Profile',
      component: () => import('@/views/statement-query/bank-customer-profile'),
      meta: {
        title: 'BankCustomerProfile',
      }
    },
    //网上银行每日可疑交易报表
    {
      path: 'suspicious-transactions',
      name: 'Suspicious-Transactions',
      component: () => import('@/views/statement-query/suspicious-transactions'),
      meta: {
        title: 'SuspiciousTransactions',
      }
    },
    //修改客户信息报表
    {
      path: 'customer-modify',
      name: 'Customer-Modify',
      component: () => import('@/views/statement-query/customer-modify'),
      meta: {
        title: 'CustomerModify',
      }
    },
    // //重置密码报表
    // {
    //   path: 'reset-password',
    //   name: 'Reset-Password',
    //   component: () => import('@/views/statement-query/reset-password'),
    //   meta: {
    //     title: 'ResetPassword',
    //   }
    // },
    //密码生成/重置异常报表
    {
      path: 'abnormal-password',
      name: 'Abnormal-Password',
      component: () => import('@/views/statement-query/abnormal-password'),
      meta: {
        title: 'AbnormalPassword',
      }
    },
  ],
};