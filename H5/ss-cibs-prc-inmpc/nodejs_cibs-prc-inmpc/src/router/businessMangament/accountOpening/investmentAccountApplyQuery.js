export default [
  {
      path: "investmentAccountApplyQuery",
      name: "InvestmentAccountApplyQuery",
      component: () => import("@/views/accountOpening/investmentAccountApplyQuery/index.vue"),
      meta: {
          title: "InvestmentAccountApplyQuery"
      }
  },
  {
      path: "investmentAccountApplyQuery/detail",
      name: "EiaoApplyDetail",
      component: () => import("@/views/accountOpening/investmentAccountApplyQuery/investmentAccountApplyQuery-detail.vue"),
      meta: {
          title: "EiaoApplyDetail"
      },
      hidden: true
  }
]