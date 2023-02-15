/*
 * @Author: zhangcheng
 * @Date: 2021-11-08 10:22:58
 * @LastEditTime: 2022-01-25 11:43:02
 * @LastEditors: zhangcheng
 * @Description: Do not Edit
 * @FilePath: \ss-cibs-prc-inmpc\nodejs_cibs-prc-inmpc\src\router\customerManagement\billMainrenace.js
 */
export default [{
    path: "billMainrenace",
    name: "BillMainrenace",
    component: () => import("@/views/customerManagement/billMainrenace/index.vue"),
    meta: {
      title: "BillMaintain"
    },
    hidden: true
  },
  {
    path: "billMainrenace/add",
    name: "BillMainrenaceAdd",
    component: () => import("@/views/customerManagement/billMainrenace/billMainrenace-add.vue"),
    meta: {
      title: "BillMaintainAdd"
    },
    hidden: true
  },
  {
    path: "billMainrenace/addConfirm",
    name: "BillMainrenaceAddConfirm",
    component: () => import("@/views/customerManagement/billMainrenace/billMainrenace-addConfirm.vue"),
    meta: {
      title: "BillMaintainAddConfirm"
    },
    hidden: true
  },
  {
    path: "billMainrenace/modify",
    name: "BillMainrenaceModify",
    component: () => import("@/views/customerManagement/billMainrenace/billMainrenace-modify.vue"),
    meta: {
      title: "BillMaintainModify"
    },
    hidden: true
  },
  {
    path: "billMainrenace/modifyConfirm",
    name: "BillMainrenaceModifyConfirm",
    component: () => import("@/views/customerManagement/billMainrenace/billMainrenace-modifyConfirm.vue"),
    meta: {
      title: "BillMaintainModifyConfirm"
    },
    hidden: true
  }
]