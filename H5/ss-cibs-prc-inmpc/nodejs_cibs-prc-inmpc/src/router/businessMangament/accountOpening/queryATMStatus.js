export default [
    {
        path: "queryATMStatus",
        name: "QueryATMStatus",
        component: () => import("@/views/accountOpening/queryATMStatus/index.vue"),
        meta: {
            title: "QueryATMStatus"
        }
    }
]