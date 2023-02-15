/*
 * @Author: 朱涛
 * @Date: 2021-10-26 09:57:16
 * @LastEditTime: 2022-02-11 15:50:01
 * @LastEditors: zhangcheng
 * @Description: In User Settings Edit
 * @FilePath: \ss-cibs-prc-inmpc\nodejs_cibs-prc-inmpc\src\router\systemMangement\roleManagement.js
 */
export default [{
    path: "roleManagement",
    name: "roleManagement",
    component: () =>
      // import("@/views/roleManagement/index.vue"),
      import("@/views/system-manage/roleManage.vue"),
    meta: {
      title: 'RoleManagement'
    }
  },
  {
    path: "/roleManagement/ditail",
    name: 'roleManagementDitail',
    component: () =>
      import("@/views/roleManagement/roleManagement-ditail.vue"),
    meta: {
      title: "roleManagementDitail"
    },
    hidden: true
  },
  {
    path: "/roleManagement/add",
    name: "roleManagementAdd",
    component: () =>
      import("@/views/roleManagement/roleManagement-add.vue"),
    meta: {
      title: "roleManagementAdd"
    },
    hidden: true
  },
  {
    path: "/roleManagement/edit",
    name: "roleManagementEdit",
    component: () =>
      import("@/views/roleManagement/roleManagement-edit.vue"),
    meta: {
      title: "roleManagementEdit"
    },
    hidden: true
  }

]