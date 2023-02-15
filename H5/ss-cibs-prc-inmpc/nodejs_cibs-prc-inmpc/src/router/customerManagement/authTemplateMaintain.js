/*
 * @Author: zhangcheng
 * @Date: 2021-10-29 09:51:42
 * @LastEditTime: 2021-12-08 19:51:39
 * @LastEditors: zhangcheng
 * @Description: 授权模板维护路由配置
 * @FilePath: \ss-cibs-prc-inmpc\src\router\customerManagement\authTemplateMaintain.js
 */
export default [{
    path: "authTemplateMaintain",
    name: "AuthTemplateMaintain",
    component: () => import("@/views/customerManagement/authorization/authTemplateMaintain.vue"),
    meta: {
      title: 'AuthTemplateMaintain'
    },
    hidden: true
  },
  {
    path: "authTemplateMaintain/detail",
    name: 'AuthTemplateMaintainDetail',
    component: () => import("@/views/customerManagement/authorization/authTemplateMaintain-detail.vue"),
    meta: {
      title: "AuthTemplateMaintainDetail"
    },
    hidden: true
  },
  {
    path: "authTemplateMaintain/add",
    name: 'AuthTemplateMaintainAdd',
    component: () => import("@/views/customerManagement/authorization/authTemplateMaintain-add.vue"),
    meta: {
      title: "AuthTemplateMaintainAdd"
    },
    hidden: true
  },
  {
    path: "authTemplateMaintain/addConfirm",
    name: 'AuthTemplateMaintainAddConfirm',
    component: () => import("@/views/customerManagement/authorization/authTemplateMaintain-addConfirm.vue"),
    meta: {
      title: "AuthTemplateMaintainAddConfirm"
    },
    hidden: true
  },
  {
    path: "authTemplateMaintain/edit",
    name: 'AuthTemplateMaintainEdit',
    component: () => import("@/views/customerManagement/authorization/authTemplateMaintain-edit.vue"),
    meta: {
      title: "AuthTemplateMaintainEdit"
    },
    hidden: true
  },
  {
    path: "authTemplateMaintain/editConfirm",
    name: 'AuthTemplateMaintainEditConfirm',
    component: () => import("@/views/customerManagement/authorization/authTemplateMaintain-editConfirm.vue"),
    meta: {
      title: "AuthTemplateMaintainEditConfirm"
    },
    hidden: true
  }
]