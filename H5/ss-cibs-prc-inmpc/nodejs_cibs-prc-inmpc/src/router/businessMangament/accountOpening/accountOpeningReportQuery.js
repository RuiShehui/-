export default [
  {
    path: "accountOpeningReportQuery",
    name: "AccountOpeningReportQuery",
    component: () => import("@/views/accountOpening/accountOpeningReportQuery/index.vue"),
    meta: {
        title: "AccountOpeningReportQuery"
    }
  },
  {
    path: "accountOpeningReportQuery/detail",
    name: "AccountOpeningReportDetail",
    component: () => import("@/views/accountOpening/accountOpeningReportQuery/accountOpeningReportQuery-detail.vue"),
    meta: {
        title: "AccountOpeningReportDetail"
    },
    hidden: true
  }
]