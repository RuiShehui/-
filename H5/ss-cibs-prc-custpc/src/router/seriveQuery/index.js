/*
 * @Author: your name
 * @Date: 2021-12-09 09:21:01
 * @LastEditTime: 2022-09-20 09:35:13
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \ss-cibs-prc-custpc\src\router\seriveQuery\index.js
 */
export default [{
        path: "/seriveQuery/interestRateQuery",
        name: "interestRateQuery",
        component: () =>
            import ("@/views/seriveQuery/interestRateQuery.vue"),
        meta: {
            title: "汇率利率查询",
        },
    },
    {
        path: "/seriveQuery/historyQuery",
        name: "historyQuery",
        component: () =>
            import ("@/views/seriveQuery/historyQuery.vue"),
        meta: {
            title: "网银交易记录",
        },
    },
    {
        path: "/authorizeCenter/detail",
        name: "historyQueryDetail",
        component: () =>
            import ("@/views/authorizeCenter/detail.vue"),
        meta: {
            title: "详情",
        },
    },
    {
        path: "/seriveQuery/serviceCenter",
        name: "serviceCenter",
        component: () =>
            import ("@/views/seriveQuery/serviceCenter.vue"),
        meta: {
            title: "服务中心",
        },
    },
    {
        path: "/seriveQuery/download",
        name: "download",
        component: () =>
            import ("@/views/seriveQuery/download.vue"),
        meta: {
            title: "APP下载",
        },
    },
    {
        path: "/seriveQuery/forexListPrice",
        name: "depositPrice",
        component: () =>
            import ("@/views/seriveQuery/forexListPrice.vue"),
        meta: {
            title: "储蓄存款利率",
        },
    },
    {
        path: "/seriveQuery/historyQueryDetail",
        name: "historyDetailPrice",
        component: () =>
            import ("@/views/seriveQuery/historyQueryDetail.vue"),
        meta: {
            title: "储蓄存款利率",
        },
    },
]