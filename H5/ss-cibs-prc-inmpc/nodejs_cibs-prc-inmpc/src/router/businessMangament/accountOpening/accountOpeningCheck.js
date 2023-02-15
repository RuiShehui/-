export default [
  {
      path: "accountOpeningCheck",
      name: "AccountOpeningCheck",
      component: () => import("@/views/accountOpening/accountOpeningCheck/index.vue"),
      meta: {
          title: "AccountOpeningCheck"
      }
  },
  {
      path: "accountOpeningCheck/detail",
      name: "AccountOpeningCheckDetail",
      component: () => import("@/views/accountOpening/accountOpeningCheck/accountOpeningCheck-detail.vue"),
      meta: {
          title: "AccountOpeningCheckDetail"
      },
      hidden: true
  },
  {
      path: "accountOpeningCheck/recheckDetail",
      name: "AccountOpeningRecheckDetail",
      component: () => import("@/views/accountOpening/accountOpeningCheck/accountOpeningCheck-detail.vue"),
      meta: {
          title: "AccountOpeningRecheckDetail"
      },
      hidden: true
  },
  {
    path: "accountOpeningCheck/confirmDetail",
    name: "ConfirmDetail",
    component: () => import("@/views/accountOpening/accountOpeningReportQuery/accountOpeningReportQuery-detail.vue"),
    meta: {
        title: "Detail"
    },
    hidden: true
  },
]