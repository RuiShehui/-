/*
 * @Author: zhangcheng
 * @Date: 2021-11-12 14:59:57
 * @LastEditTime: 2021-12-08 20:19:20
 * @LastEditors: zhangcheng
 * @Description: 客户开户
 * @FilePath: \ss-cibs-prc-inmpc\src\router\customerManagement\customerAccountOpen.js
 */
export default [{
    path: "customerAccountOpen",
    name: "CustomerAccountOpen",
    component: () => import("@/views/customerManagement/customer/customerAccount-open.vue"),
    meta: {
      title: "CustomerAccountOpen"
    },
    hidden: true
  },
  {
    path: "customerAccountOpen/confirm",
    name: "CustomerAccountOpenConfirm",
    component: () => import("@/views/customerManagement/customer/customerAccount-confirm.vue"),
    meta: {
      title: "CustomerAccountOpenConfirm"
    },
    hidden: true
  },
]