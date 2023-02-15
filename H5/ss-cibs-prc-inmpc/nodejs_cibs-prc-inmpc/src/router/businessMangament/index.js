/*
 * @Author: 赵霖
 * @Date: 2021-10-25 15:29:20
 * @LastEditTime: 2022-06-01 14:51:23
 * @LastEditors: ZhangZhen
 * @Description: 业务管理路由配置
 * @FilePath: \ss-cibs-prc-inmpc\nodejs_cibs-prc-inmpc\src\router\businessMangament\index.js
 */
import Layout from '@/layout'
import businessMagament from "./businessMangament";
import discount from "./discount.js"
import qouta from "./qouta.js"
import announcement from "./announcement.js"
import epsbusiness from "./epsbusiness.js"
import merchantsMaintain from "./merchantMaintain.js"
import businessStart from "./businessStart.js"
import exception from "./exception.js"
import custQuotaManage from './custQuotaManage';
import accountOpening from './accountOpening';
export default {
  path: "/businessMangament",
  component: Layout,
  redirect: 'businessMangament',
  meta: {
    title: "BusinessManage",
    icon: require('@/img/menu-icon/business-management.png'),
    backIcon: require('@/img/menu-icon/business-management-back.png'),
  },
  children: [
    ...businessMagament,
    ...discount,
    ...businessStart,
    ...qouta,
    ...custQuotaManage,
    ...epsbusiness,
    ...merchantsMaintain,
    ...announcement,
    ...exception,
    accountOpening
  ]
}