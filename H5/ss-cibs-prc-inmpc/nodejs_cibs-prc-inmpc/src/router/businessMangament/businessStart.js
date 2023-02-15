/*
 * @Author: ZhangZhen
 * @Date: 2021-11-22 09:35:32
 * @LastEditTime: 2022-01-20 16:33:21
 * @LastEditors: ZhangZhen
 * @Description: Zz's design
 * @FilePath: \ss-cibs-prc-inmpc\nodejs_cibs-prc-inmpc\src\router\businessMangament\businessStart.js
 */
export default [{
    path: "businessStart",
    name: "BusinessStart",
    component: () =>
      import("@/views/businessStart/index.vue"),
    meta: {
      title: "BusinessStart"
    }
  },
  {
    path: "businessStart/setup",
    name: "BusinessStartSetup",
    component: () =>
      import("@/views/businessStart/businessStart-setup.vue"),
    meta: {
      title: "BusinessStart" // BusinessStartSetup
    },
    hidden: true
  },
];