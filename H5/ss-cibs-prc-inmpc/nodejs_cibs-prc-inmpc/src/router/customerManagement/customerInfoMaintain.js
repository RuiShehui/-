/*
 * @Author: zhangcheng
 * @Date: 2021-11-17 17:41:56
 * @LastEditTime: 2021-12-08 20:19:39
 * @LastEditors: zhangcheng
 * @Description: Do not Edit
 * @FilePath: \ss-cibs-prc-inmpc\src\router\customerManagement\customerInfoMaintain.js
 */
export default [{
  path: "customerInfoMaintain",
  name: "CustomerInfoMaintain",
  component: () => import("@/views/customerManagement/customer/customerInfoMaintain.vue"),
  meta: {
    title: "CustomerInfoMaintain"
  },
  hidden: true
}, {
  path: "customerInfoMaintain/confirm",
  name: "CustomerInfoMaintainConfirm",
  component: () => import("@/views/customerManagement/customer/customerInfoMaintain-confirm.vue"),
  meta: {
    title: "CustomerInfoMaintainConfirm"
  },
  hidden: true
}]