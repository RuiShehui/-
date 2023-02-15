export default [
  /* 行内转账 */
  {
    path: '/bankTransfer/paymentSettlement/intraBankTransfer',
    name: 'intraBankTransfer',
    component:
      () => import('@/views/bankTransfer/paymentSettlement/intraBankTransfer'),
    meta: {
      title: '行内转账',
    }
  },
  /* 转数快 */
  {
    path: '/bankTransfer/paymentSettlement/fast',
    name: 'fast',
    component: () =>
      import('@/views/bankTransfer/paymentSettlement/fast'),
    meta: {
      title: '转数快'
    },
  },
  /* CHATS */
  {
    path: '/bankTransfer/paymentSettlement/localtransfer',
    name: 'localtransfer',
    component: () =>
      import('@/views/bankTransfer/paymentSettlement/localtransfer'),
    meta: {
      title: 'CHATS'
    }
  },
  /* 电汇 */
  {
    path: '/bankTransfer/paymentSettlement/remittance',
    name: 'remittance',
    component: () => import('@/views/bankTransfer/paymentSettlement/remittance'),
    meta: {
      title: '电汇'
    }
  },
  /* 最近转账记录 */
  {
    path: '/bankTransfer/transferRecord/index',
    name: 'transferRecord',
    component: () => import('@/views/bankTransfer/transferRecord'),
    meta: {
      title: '最近转账记录'
    }
  },
  /* 登记第三者账户 */
  {
    path: '/bankTransfer/registerThirdAccount/registerAccountIndex',
    name: 'registerAccountIndex',
    component: () =>
      import('@/views/bankTransfer/registerThirdAccount/registerAccountIndex'),
    meta: {
      title: '登记第三者账户'
    }
  },
  /* 批量交易录入 */
  {
    path: '/paymentSettlement/batchTransfer/recordManually',
    name: 'batchTrans',
    component: () =>
      import('@/views/paymentsSettlement/batchTransfer'),
    meta: {
      title: '批量交易录入'
    },
  },
  /* 批量交易查询 */
  {
    path: '/paymentSettlement/batchTransfer/search',
    name: 'batchSearche',
    component: () =>
      import('@/views/paymentsSettlement/batchPayday'),
    meta: {
      title: '批量交易查询'
    }
  },
  /* 批量交易详情 */
  {
    path: '/paymentSettlement/batchTransfer/details',
    name: 'batchDetailse',
    component: () =>
      import('@/views/paymentsSettlement/batchPayday/details.vue'),
    meta: {
      title: '批量交易详情'
    }
  },
  /* 批量交易录入 */
  {
    path: '/paymentSettlement/payDay/recordManually',
    name: 'batchTransferes',
    component: () =>
      import('@/views/batchPayday/batchTransfer'),
    meta: {
      title: '批量交易录入'
    },
  },
  /* 批量交易查询 */
  {
    path: '/paymentSettlement/payDay/search',
    name: 'batchSearches',
    component: () =>
      import('@/views/batchPayday/batchPayday'),
    meta: {
      title: '批量交易查询'
    }
  },
  /* 批量交易详情 */
  {
    path: '/paymentSettlement/payDay/details',
    name: 'batchDetails',
    component: () =>
      import('@/views/batchPayday/batchPayday/details.vue'),
    meta: {
      title: '批量交易详情'
    }
  },
 
  /* 预约交易管理 */
  {
    path: '/bankTransfer/appointTransactionManage/index',
    name: 'appointTransactionManage',
    component: () =>
      import('@/views/bankTransfer/appointTransactionManage'),
    meta: {
      title: '预约交易管理'
    },
  }
]