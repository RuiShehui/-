/*
 * @Author: ZhangZhen
 * @Date: 2022-01-04 15:25:19
 * @LastEditTime: 2022-11-02 11:15:39
 * @LastEditors: Please set LastEditors
 * @Description: Zz's design
 * @FilePath: \ss-cibs-prc-inmpc\nodejs_cibs-prc-inmpc\src\router\statiscal-query\index.js
 */
// import Layout from '@/layout';

export default [
  {
    path: "applicationSpecial",
    name: "applicationSpecial",
    component: () => import("@/views/specialInstruction/appliocationSpecial/index.vue"),
    meta: {
      title: "applicationSpecial",
    }
  },
  {
    path: "specialManagement",
    name: "specialManagement",
    component: () => import("@/views/specialInstruction/specialManagement/index.vue"),
    meta: {
      title: "specialManagement",
    }
  },
]