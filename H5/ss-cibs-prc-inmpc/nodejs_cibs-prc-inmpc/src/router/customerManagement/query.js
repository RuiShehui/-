/*
 * @Author: zhangcheng
 * @Date: 2021-12-01 11:23:59
 * @LastEditTime: 2022-01-25 17:11:43
 * @LastEditors: ZhangZhen
 * @Description: Do not Edit
 * @FilePath: \ss-cibs-prc-inmpc\nodejs_cibs-prc-inmpc\src\router\customerManagement\query.js
 */

export default [{
  path: "customerQueryOpen",
  name: "CustomerQueryOpen",
  component: () => import("@/views/customerManagement/customer/customerAccount-open.vue"),
  meta: {
    title: "CustomerQueryOpen",
  }
}, {
  path: "customerQueryDel",
  name: "CustomerQueryDel",
  // component: () => import("@/views/customerManagement/customer/customerAccount-query"),
  component: () => import("@/views/customerManagement/customer/customerAccount-del.vue"),
  meta: {
    title: "CustomerQueryDelete",
    // top: "customerQuery"
  }
}, {
  path: "customerQueryCusMain",
  name: "CustomerQueryCusMain",
  // component: () => import("@/views/customerManagement/customer/customerAccount-query"),
  component: () => import("@/views/customerManagement/customer/customerInfoMaintain.vue"),
  meta: {
    title: "CustomerQueryMaintain",
    // top: "customerQuery"
  }
}, {
  path: "customerQueryUserMain",
  name: "CustomerQueryUserMain",
  // component: () => import("@/views/customerManagement/customer/customerAccount-query"),
  component: () => import("@/views/customerManagement/user/userMaintain.vue"),
  meta: {
    title: "UserQueryMaintain",
    // top: "customerQuery"
  }
}, {
  path: "customerQueryCusView",
  name: "CustomerQueryCusView",
  // component: () => import("@/views/customerManagement/customer/customerAccount-query"),
  component: () => import("@/views/customerManagement/customer/customerInfoView.vue"),
  meta: {
    title: "CustomerQueryInfoOverview",
    // top: "customerQuery"
  }
}, {
  path: "customerQueryTemMain",
  name: "CustomerQueryTemMain",
  // component: () => import("@/views/customerManagement/customer/customerAccount-query"),
  component: () => import("@/views/customerManagement/authorization/authTemplateMaintain.vue"),
  meta: {
    title: "AuthTemplateMaintainQuery",
    // top: "customerQuery"
  }
}, {
  path: "customerQueryCusPrint",
  name: "CustomerQueryCusPrint",
  // component: () => import("@/views/customerManagement/customer/customerAccount-query"),
  component: () => import("@/views/customerManagement/customer/customerEnvelopePrint.vue"),
  meta: {
    title: "CustomerEnvelopePrintQuery",
    // top: "customerQuery"
  }
}, {
  path: "customerWelcomePrint",
  name: "CustomerWelcomePrint",
  // component: () => import("@/views/customerManagement/customer/customerAccount-query"),
  component: () => import("@/views/customerManagement/customer/customerWelcomePrint.vue"),
  meta: {
    title: "customerWelcomePrint",
    // top: "customerQuery"
  }
}, {
  path: "registraTionProcessing",
  name: "registraTionProcessing",
  // component: () => import("@/views/customerManagement/customer/customerAccount-query"),
  component: () => import("@/views/customerManagement/customer/registraTionProcessing.vue"),
  meta: {
    title: "registraTionProcessing",
    // top: "customerQuery"
  }
},{
  path: "customerQuerySerGen",
  name: "CustomerQuerySerGen",
  // component: () => import("@/views/customerManagement/customer/customerAccount-query"),
  component: () => import('@/views/customerManagement/despostiReservation'),
  meta: {
    title: "DespostiReservationQuery",
    // top: "customerQuery"
  }
}, {
  path: "customerQueryBillMain",
  name: "CustomerQueryBillMain",
  // component: () => import("@/views/customerManagement/customer/customerAccount-query"),
  component: () => import("@/views/customerManagement/billMainrenace/index.vue"),
  meta: {
    title: "BillMaintainQuery",
    // top: "customerQuery"
  }
}, {
  path: "customerQueryThird",
  name: "CustomerQueryThird",
  // component: () => import("@/views/customerManagement/customer/customerAccount-query"),
  component: () => import("@/views/customerManagement/registerThird"),
  meta: {
    title: "RegisterThirdQuery",
    // top: "customerQuery"
  }
}, {
  path: "customerQueryTrsSet",
  name: "CustomerQueryTrsSet",
  // component: () => import("@/views/customerManagement/customer/customerAccount-query"),
  component: () => import('@/views/customerManagement/trsAuSettings/index.vue'),
  meta: {
    title: "TruAuSettingsQuery",
    // top: "customerQuery"
  }
}, ];