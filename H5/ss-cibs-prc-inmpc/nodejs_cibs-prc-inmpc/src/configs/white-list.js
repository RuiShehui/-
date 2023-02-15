/**
 * route-info-map-list
 */
const routeInfoList = [{
    url: '/customerManagement/customerQueryTrsSet',
    urlMap: [
      '/customerManagement/customerQueryTrsSet',
      '/customerManagement/trsAuSettings',
      '/customerManagement/trsAuSettings/detail',
    ]
  },
  {
    url: '/businessMangament/epsbusiness',
    urlMap: [
      '/businessMangament/epsbusiness',
      '/epsbusiness/add',
      '/epsbusiness/edit',
      '/epsbusiness/modify',
      '/businessMangament/epsbusiness/add',
      '/businessMangament/epsbusiness/edit',
      '/businessMangament/epsbusiness/detail',
    ]
  },
  {
    url: '/businessMangament/exception',
    urlMap: [
      '/businessMangament/exception',
    ],
  },
  {
    url: '/customerManagement/customerQueryTemMain',
    urlMap: [
      '/customerManagement/customerQueryTemMain',
      '/customerManagement/authTemplateMaintain',
      '/customerManagement/authTemplateMaintain/add',
      '/customerManagement/authTemplateMaintain/addConfirm',
      '/customerManagement/authTemplateMaintain/detail',
      '/customerManagement/authTemplateMaintain/edit',
      '/customerManagement/authTemplateMaintain/editConfirm',
    ]
  },
  {
    url: '/customerManagement/customerQueryBillMain',
    urlMap: [
      '/customerManagement/customerQueryBillMain',
      '/customerManagement/billMainrenace',
      '/customerManagement/billMainrenace/add',
      '/customerManagement/billMainrenace/addConfirm',
      '/customerManagement/billMainrenace/modify',
      '/customerManagement/billMainrenace/modifyConfirm',
    ],
  },
  
 
  {
    url: '/customerManagement/customerQueryOpen',
    urlMap: [
      '/customerManagement/customerQueryOpen',
      '/customerManagement/customerAccountOpen',
      '/customerManagement/customerAccountOpen/confirm',
    ],
  },
  
  {
    url: '/businessMangament/merchantsMaintain',
    urlMap: [
      '/merchants',
      '/merchants/add',
      '/businessMangament/merchantsMaintain',
      '/businessMangament/merchantMaintain/add',
      '/businessMangament/merchantMaintain/edit',
      '/businessMangament/merchantMaintain/detail',
      '/businessMangament/merchantMaintain/operate-confirm',
    ],
  },
  {
    url: '/systemManagement/roleManagement',
    urlMap: [
      '/systemManagement/roleManagement',
      '/roleManagement/add',
      '/roleManagement/ditail',
      '/roleManagement/edit',
    ]
  },
  {
    url: '/customerManagement/customerQueryCusMain',
    urlMap: [
      '/customerManagement/customerQueryCusMain',
      '/customerManagement/customerInfoMaintain',
      '/customerManagement/customerInfoMaintain/confirm',
    ],
  },
  {
    url: '/systemManagement/mechanism',
    urlMap: [
      '/systemManagement/mechanism',
      '/mechanism/add',
      '/mechanism/edit',
      '/mechanism/ditail',
      '/mechanism/submit',
    ],
  },
  {
    url: '/customerManagement/customerQueryUserMain',
    urlMap: [
      '/customerManagement/customerQueryUserMain',
      '/customerManagement/userMaintain',
      '/customerManagement/userMaintain/add',
      '/customerManagement/userMaintain/addConfirm',
      '/customerManagement/userMaintain/edit',
      '/customerManagement/userMaintain/editConfirm',
      '/customerManagement/userMaintain/detail',
    ],
  },
  {
    url: '/systemManagement/menuManagement',
    urlMap: [
      '/systemManagement/menuManagement',
      '/menuManagement/add',
      '/menuManagement/edit',
      '/menuManagement/ditail',
      '/menuManagement/submit',
    ],
  },
  {
    url: '/businessMangament/qouta',
    urlMap: [
      '/businessMangament/qouta',
      '/businessMangament/addBankQuota',
      '/businessMangament/qouta-detail',
    ]
  },
  {
    url: '/businessMangament/custQuotaManage',
    urlMap: [
      '/businessMangament/custQuotaManage',
    ]
  },
  {
    url: '/systemManagement/userManagement',
    urlMap: [
      '/systemManagement/userManagement',
      '/userManagement/add',
      '/userManagement/edit',
      '/userManagement/ditail',
      '/userManagement/submit',
    ],
  },
  {
    url: '/systemManagement/weatherSetting',
    urlMap: [
      '/systemManagement/weatherSetting',
    ],
  },
  {
    url: '/businessMangament/announcement',
    urlMap: [
      '/businessMangament/announcement',
      '/businessMangament/announcement/add',
      '/businessMangament/announcement/add-confirm',
      '/businessMangament/announcement/detail',
    ],
  },
  {
    url: '/customerManagement/customerQueryCusPrint',
    urlMap: [
      '/customerManagement/customerQueryCusPrint',
      '/customerManagement/customerEnvelopePrint',
    ],
  },
   /* 2022-10-08新增 重設密碼重試次數*/ 
   {
    url: '/customerManagement/passwordReset',
    urlMap:[
      '/customerManagement/passwordReset'
    ]
  },
  {
    url: '/customerManagement/customerWelcomePrint',
    urlMap: [
      '/customerManagement/customerWelcomePrint',
    ],
  },
  {
    url: '/customerManagement/registraTionProcessing',
    urlMap: [
      '/customerManagement/registraTionProcessing',
    ],
  },
  {
    url: '/businessMangament/discount',
    urlMap: [
      '/businessMangament/discount',
      '/businessMangament/discount/add',
      '/businessMangament/discount/edit',
      '/businessMangament/discount/confirm',
      '/businessMangament/discount/detail',
    ]
  },
  {
    url: '/customerManagement/customerQueryThird',
    urlMap: [
      '/customerManagement/customerQueryThird',
      '/customerManagement/registerThird',
      '/customerManagement/registerThird/detail',
      '/customerManagement/registerThird/add-inside-transfer',
      '/customerManagement/registerThird/edit-inside-transfer',
      '/customerManagement/registerThird/add-fast-transfer',
      '/customerManagement/registerThird/edit-fast-transfer',
      '/customerManagement/registerThird/add-local-fast',
      '/customerManagement/registerThird/edit-local-fast',
      '/customerManagement/registerThird/add-elec-transfer',
      '/customerManagement/registerThird/edit-elec-transfer',
    ],
  },
  {
    url: '/customerManagement/customerQueryCusView',
    urlMap: [
      '/customerManagement/customerQueryCusView',
      '/customerManagement/customerInfoView',
      '/customerManagement/customerInfoView/detail',
    ]
  },
  {
    url: '/businessMangament/businessStart',
    urlMap: [
      '/businessMangament/businessStart',
      '/businessMangament/businessStart/setup',
    ]
  },
  {
    url: '/customerManagement/customerQuerySerGen',
    urlMap: [
      '/customerManagement/customerQuerySerGen',
      '/customerManagement/despostiReservation',
      '/customerManagement/despostiReservation/add',
      '/customerManagement/despostiReservation/confirm',
    ],
  },
  {
    url: '/customerManagement/customerQueryDel',
    urlMap: [
      '/customerManagement/customerQueryDel',
      '/customerManagement/customerAccountDel',
    ],
  },
  // 我提交的
  {
    url: '/authorizationCenter/mySubmit',
    urlMap: [
      '/authorizationCenter/mySubmit',
      '/mySubmit/ditail',
    ]
  },
  // 待我授权
  {
    url: '/authorizationCenter/subjectAuthorization',
    urlMap: [
      '/authorizationCenter/subjectAuthorization',
      '/authorizationCenter/subjectAuthorization/ditail',
      '/authorziationSettingReminder',
    ]
  },
  // 只要有客户管理就一定会有的字段
  {
    url: '/customerManagement/customerAccountQuery',
    urlMap: [
      '/customerManagement/customerQueryOpen',
      '/customerManagement/customerQueryDel',
      '/customerManagement/customerQueryCusMain',
      '/customerManagement/customerQueryUserMain',
      '/customerManagement/customerQueryCusView',
      '/customerManagement/customerQueryTemMain',
      '/customerManagement/customerQueryCusPrint',
      '/customerManagement/customerWelcomePrint',
      '/customerManagement/customerQuerySerGen',
      '/customerManagement/customerQueryBillMain',
      '/customerManagement/customerQueryThird',
      '/customerManagement/customerQueryTrsSet',
    ],
  },

  {
    url: '/customerManagement/customerQueryCusView',
    urlMap: [
      '/customerManagement/customerQueryCusView'
    ],
  },
  {
    url: '/statiscal-query/apply-checkbook',
    urlMap: [
      '/statiscal-query/apply-checkbook'
    ],
  },
  {
    url: '/statiscal-query/internet-bank-customer-statistics',
    urlMap: [
      '/statiscal-query/internet-bank-customer-statistics'
    ],
  },
  {
    url: '/statiscal-query/internet-dubious-transfer',
    urlMap: [
      '/statiscal-query/internet-dubious-transfer'
    ],
  },
  {
    url: '/statiscal-query/compony-customer-salesman',
    urlMap: [
      '/statiscal-query/compony-customer-salesman'
    ],
  },
  {
    url: '/statiscal-query/not-enabled-banking',
    urlMap: [
      '/statiscal-query/not-enabled-banking'
    ],
  },
  {
    url: '/statiscal-query/customer-open-statement',
    urlMap: [
      '/statiscal-query/customer-open-statement'
    ],
  },
  {
    url: '/statiscal-query/customer-transaction-report',
    urlMap: [
      '/statiscal-query/customer-transaction-report'
    ],
  },
  {
    url: '/statiscal-query/change-customer-info',
    urlMap: [
      '/statiscal-query/change-customer-info'
    ],
  },
  {
    url: '/statiscal-query/reset-password',
    urlMap: [
      '/statiscal-query/reset-password',
    ],
  },
    //2022-10-24 新增 特殊指令
    {
      url:'/customerManagement/applicationSpecial',
      urlMap:[
        '/customerManagement/applicationSpecial',      
      ]
    },
    {
      url:'/customerManagement/specialManagement',
      urlMap:[
        '/customerManagement/specialManagement',
        
      ]
    },
  {
    url: '/statiscal-query/psd-add-reset-error',
    urlMap: [
      '/statiscal-query/psd-add-reset-error'
    ],
  },
  {
    url: '/statiscal-query/compony-customer-destory',
    urlMap: [
      '/statiscal-query/compony-customer-destory'
    ],
  },
  {
    url: '/statiscal-query/internet-bank-high-risk',
    urlMap: [
      '/statiscal-query/internet-bank-high-risk'
    ],
  },
  {
    url: '/statiscal-query/cibs-and-t24-error',
    urlMap: [
      '/statiscal-query/cibs-and-t24-error'
    ],
  },
  {
    url: '/statiscal-query/high-risk-transfer',
    urlMap: [
      '/statiscal-query/high-risk-transfer'
    ],
  },
  {
    url: '/statiscal-query/webbank-psd-created',
    urlMap: [
      '/statiscal-query/webbank-psd-created'
    ],
  },
  {
    url: '/statiscal-query/webbank-transfer-data',
    urlMap: [
      '/statiscal-query/webbank-transfer-data'
    ],
  },
  {
    url: '/statiscal-query/webbank-transfer-data',
    urlMap: [
      '/statiscal-query/webbank-transfer-data'
    ],
  },
  {
    url: '/statiscal-query/isreport-bank-transfer',
    urlMap: [
      '/statiscal-query/isreport-bank-transfer'
    ],
  },
  {
    url: '/statiscal-query/pay-bill-rec',
    urlMap: [
      '/statiscal-query/pay-bill-rec'
    ],
  },
  {
    url: '/statiscal-query/pay-bill-rec-detail',
    urlMap: [
      '/statiscal-query/pay-bill-rec-detail'
    ],
  },
  {
    url: '/statiscal-query/op-logs',
    urlMap: [
      '/statiscal-query/op-logs'
    ],
  },
  /* 2022-01-04新增：统计查询 */
  {
    url: '/statiscal-query',
    urlMap: [
      '/statiscal-query',
      // '/statiscal-query/op-logs',
      // '/statiscal-query/internet-bank-customer-statistics', // 网上银行客户情况统计报表
      // '/statiscal-query/apply-checkbook', // 申领支票簿
      // '/statiscal-query/internet-dubious-transfer', // 网上银行每日可疑交易报表
      // '/statiscal-query/compony-customer-salesman', // 公司客户销售报表
      // '/statiscal-query/not-enabled-banking', // 未启用网银客户报表
      // '/statiscal-query/customer-open-statement', // 公司客户开户报表
      // '/statiscal-query/customer-transaction-report', // 客户交易日志报表
      // '/statiscal-query/change-customer-info', // 修改客户信息报表
      // '/statiscal-query/reset-password', // 重置密码报表
      // '/statiscal-query/psd-add-reset-error', // 密码生成
      // '/statiscal-query/compony-customer-destory', // 公司客户销户报表
      // '/statiscal-query/internet-bank-high-risk', // 网上银行每日高风险交易
      // '/statiscal-query/cibs-and-t24-error', // CIBS和t24的对比异常报表
      // '/statiscal-query/high-risk-transfer', // 高风险交易汇总报表
      // '/statiscal-query/webbank-psd-created', // 网银密码生成汇总报表
      // '/statiscal-query/webbank-transfer-data', // 网银交易数据报表
      // '/statiscal-query/isreport-bank-transfer', // 已接受的银行间资金转账报表
      // '/statiscal-query/pay-bill-rec', // 缴付账单对账汇总报表
    ]
  },
  
  {
    url: '/statiscal-query/customer-open-statement',
    urlMap: [
      '/statiscal-query/customer-open-statement',
      '/customer-open-statement/user-detail',
    ]
  },

  // 开户审核
  {
    url: '/businessMangament/accountOpening',
    urlMap: [
      '/businessMangament/accountOpening',
    ],
  },
  {
    url: '/businessMangament/accountOpening/investmentAccountApplyQuery',
    urlMap: [
      '/businessMangament/accountOpening/investmentAccountApplyQuery',
      '/businessMangament/accountOpening/investmentAccountApplyQuery/detail',
    ],
  },
  {
    url: '/businessMangament/accountOpening/accountOpeningReportQuery',
    urlMap: [
      '/businessMangament/accountOpening/accountOpeningReportQuery',
      '/businessMangament/accountOpening/accountOpeningReportQuery/detail',
    ],
  },
  {
    url: '/businessMangament/accountOpening/investmentAccountApplyQuery',
    urlMap: [
      '/businessMangament/accountOpening/investmentAccountApplyQuery',
      '/businessMangament/accountOpening/investmentAccountApplyQuery/detail',
    ],
  },
  {
    url: '/businessMangament/accountOpening/accountOpeningCheck',
    urlMap: [
      '/businessMangament/accountOpening/accountOpeningCheck',
      '/businessMangament/accountOpening/accountOpeningCheck/detail',
      '/businessMangament/accountOpening/accountOpeningCheck/recheckDetail',
      '/businessMangament/accountOpening/accountOpeningCheck/confirmDetail'
    ],
  },
  {
    url: '/businessMangament/accountOpening/investmentAccountOpeningCheck',
    urlMap: [
      '/businessMangament/accountOpening/investmentAccountOpeningCheck',
      '/businessMangament/accountOpening/investmentAccountOpeningCheck/detail',
    ],
  },
  {
    url: '/businessMangament/accountOpening/invitationCodeManagement',
    urlMap: [
      '/businessMangament/accountOpening/invitationCodeManagement',
      '/businessMangament/accountOpening/invitationCodeManagement/detail',
      '/businessMangament/accountOpening/invitationCodeManagement/add',
      '/businessMangament/accountOpening/invitationCodeManagement/update',
    ],
  },
  {
    url: '/businessMangament/accountOpening/queryATMStatus',
    urlMap: [
      '/businessMangament/accountOpening/queryATMStatus',
    ],
  },
  {
    url: '/businessMangament/accountOpening/queryEbankStatus',
    urlMap: [
      '/businessMangament/accountOpening/queryEbankStatus',
    ],
  },
  {
    url: '/businessMangament/accountOpening/reportQuery',
    urlMap: [
      '/businessMangament/accountOpening/reportQuery',
    ],
  },
];

export default routeInfoList;