/*
 * @Author: ZhangZhen
 * @Date: 2021-11-22 09:35:32
 * @LastEditTime: 2022-01-20 16:46:32
 * @LastEditors: ZhangZhen
 * @Description: Zz's design
 * @FilePath: \ss-cibs-prc-inmpc\nodejs_cibs-prc-inmpc\src\router\businessMangament\qouta.js
 */
export default [
  // 限额列表
  {
    path: "qouta",
    name: "qouta",
    component: () =>
        import ("@/views/quota/index.vue"),
    meta: {
        title: "BankQuota"
    },
  },
  // 新增限额
  {
    path: 'addBankQuota',
    name: 'AddBankQuota',
    component: () => import('@/views/quota/add.vue'),
    meta: {
      title: 'BankQuota' // AddBankQuota
    },
    hidden: true,
  }
];