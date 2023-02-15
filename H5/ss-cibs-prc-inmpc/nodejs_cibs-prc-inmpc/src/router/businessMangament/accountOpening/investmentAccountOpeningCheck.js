
export default [
    {
        path: "investmentAccountOpeningCheck",
        name: "InvestmentAccountOpeningCheck",
        component: () => import("@/views/accountOpening/investmentAccountOpeningCheck/index.vue"),
        meta: {
            title: "InvestmentAccountOpeningCheck"
        }
    },
    {
        path: "investmentAccountOpeningCheck/detail",
        name: "EiaoCheckDetail",
        component: () => import("@/views/accountOpening/investmentAccountOpeningCheck/investmentAccountOpeningCheck-detail.vue"),
        meta: {
            title: "EiaoCheckDetail"
        },
        hidden: true
    },
]