export default [
    {
        path: "queryEbankStatus",
        name: "QueryEbankStatus",
        component: () => import("@/views/accountOpening/queryEbankStatus/index.vue"),
        meta: {
            title: "QueryEbankStatus"
        }
    }
]