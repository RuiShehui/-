/*
 * @Author: ZhangZhen
 * @Date: 2022-06-01 14:49:47
 * @LastEditTime: 2022-06-01 14:51:09
 * @LastEditors: ZhangZhen
 * @Description: Zz's design
 * @FilePath: \ss-cibs-prc-inmpc\nodejs_cibs-prc-inmpc\src\router\businessMangament\custQuotaManage.js
 */
export default [
  {
    path: 'custQuotaManage',
    name: 'CustQuotaManage',
    component: () => import('@/views/custQuotaManage'),
    meta: {
      title: 'CustQuotaManage'
    }
  }
];
