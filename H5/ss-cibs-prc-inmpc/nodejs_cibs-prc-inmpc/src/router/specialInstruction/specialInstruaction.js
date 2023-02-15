/*
 * @Author: ZhangZhen
 * @Date: 2022-01-04 15:25:19
 * @LastEditTime: 2022-10-24 11:41:34
 * @LastEditors: Please set LastEditors
 * @Description: Zz's design
 * @FilePath: \ss-cibs-prc-inmpc\nodejs_cibs-prc-inmpc\src\router\statiscal-query\index.js
 */
import Layout from '@/layout';

export default {
  path: '/specialInstruction',
  component: Layout,
  redirect: 'applicationSpecial',
  meta: {
    title: 'specialInstruction',
    icon: require('@/img/menu-icon/statistical-query.png'),
    backIcon: require('@/img/menu-icon/statistical-query-back.png'),
  },
  children: [
    {
      path: "applicationSpecial",
      name: "applicationSpecial",
      component: () => import("@/views/specialInstruction/appliocationSpecial/index.vue"),
      meta: {
        title: "applicationSpecial",
        type: 'index'
      }
    },
    {
      path: "specialManagement",
      name: "specialManagement",
      component: () => import("@/views/specialInstruction/specialManagement/index.vue"),
      meta: {
        title: "specialManagement",
        type: 'index'
      }
    },
  ]
};