/*
 * @Author: zhangcheng
 * @Date: 2021-10-28 16:11:26
 * @LastEditTime: 2021-12-08 20:32:25
 * @LastEditors: zhangcheng
 * @Description: 客户信息概览
 * @FilePath: \ss-cibs-prc-inmpc\src\router\customerManagement\customerInfoView.js
 */
export default [{
    path: "customerInfoView",
    name: "CustomerInfoView",
    component: () => import("@/views/customerManagement/customer/customerInfoView.vue"),
    meta: {
      title: "CustomerInfoView"
    },
    hidden: true
  },
  {
    path: "customerInfoView/detail",
    name: "CustomerInfoViewDetail",
    component: () => import("@/views/customerManagement/customer/customerInfoView-detail.vue"),
    meta: {
      title: "CustomerInfoViewDetail"
    },
    hidden: true
  }
]