/*
 * @Author: zhangcheng
 * @Date: 2021-10-28 11:38:10
 * @LastEditTime: 2021-12-09 10:06:16
 * @LastEditors: zhangcheng
 * @Description: 用户维护
 * @FilePath: \ss-cibs-prc-inmpc\src\router\customerManagement\userMaintain.js
 */
export default [{
    path: "userMaintain",
    name: "UserMaintain",
    component: () => import("@/views/customerManagement/user/userMaintain.vue"),
    meta: {
      title: "UserMaintain"
    },
    hidden: true
  },
  {
    path: "userMaintain/detail",
    name: "UserMaintainDetail",
    component: () => import("@/views/customerManagement/user/userMaintain-detail.vue"),
    meta: {
      title: "UserMaintainDetail"
    },
    hidden: true
  },
  {
    path: "userMaintain/add",
    name: "UserMaintainAdd",
    component: () => import("@/views/customerManagement/user/userMaintain-add.vue"),
    meta: {
      title: "UserMaintainAdd"
    },
    hidden: true
  },
  {
    path: "userMaintain/addConfirm",
    name: "UserMaintainAddConfirm",
    component: () => import("@/views/customerManagement/user/userMaintain-addConfirm.vue"),
    meta: {
      title: "UserMaintainAddConfirm"
    },
    hidden: true
  },
  {
    path: "userMaintain/edit",
    name: "UserMaintainEdit",
    component: () => import("@/views/customerManagement/user/userMaintain-edit.vue"),
    meta: {
      title: "UserMaintainEdit"
    },
    hidden: true
  },
  {
    path: "userMaintain/editConfirm",
    name: "UserMaintainEditConfirm",
    component: () => import("@/views/customerManagement/user/userMaintain-editConfirm.vue"),
    meta: {
      title: "UserMaintainEditConfirm"
    },
    hidden: true
  }
]