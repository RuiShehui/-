/*
 * @Author: your name
 * @Date: 2021-12-02 16:24:29
 * @LastEditTime: 2021-12-03 14:15:34
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \ss-cibs-prc-custpc\src\router\internationalBusiness\index.js
 */
export default [{
    path: "/internationalBusiness/forexListPrice/forexListPrice",
    name: "forexListPrice",
    component: () =>
      import("@/views/internationalBusiness/forexListPrice/forexListPrice.vue"),
    meta: {
      title: "外币牌价",
    },
  },{
    path: "/internationalBusiness/remittanceConfirm/remittanceConfirm",
    name: "remittanceConfirm",
    component: () =>
      import("@/views/internationalBusiness/remittanceConfirm/remittanceConfirm.vue"),
    meta: {
      title: "货币兑换",
    },
  }]