export default [{
    path: "/payService/billPayment",
    name: "billPayment",
    component: () =>
        import ("@/views/payService/billPayment"),
    meta: {
        title: "缴付账单",
    },
},
{
    path: "/payService/highRiskBusiness",
    name: "highRiskBusiness",
    component: () =>
        import ("@/views/payService/highRiskBusiness/index.vue"),
    meta: {
        title: "我的商户清单",
    },
},
{
    path: "/payService/advancePayManagement",
    name: "advancePayManagement",
    component: () =>
        import ("@/views/payService/advancePayManagement/index.vue"),
    meta: {
        title: "预约缴付管理",
    },
},
{
    path: "/payService/highRiskBusiness/busniessInfo",
    name: "busniessInfo",
    component: () =>
        import ("@/views/payService/highRiskBusiness/busniessInfo.vue"),
    meta: {
        title: "高风险商户维护",
    },
},
{
    path: "/payService/advancePayManagement/modify",
    name: "modify",
    component: () =>
        import ("@/views/payService/advancePayManagement/modify"),
    meta: {
        title: "预约缴付管理",
    },
},
]