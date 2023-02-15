/*
 * @Author: 朱涛
 * @Date: 2021-10-25 18:44:12
 * @LastEditTime: 2022-01-26 10:32:54
 * @LastEditors: zhangcheng
 * @Description: In User Settings Edit
 * @FilePath: \ss-cibs-prc-inmpc\nodejs_cibs-prc-inmpc\src\router\systemMangement\mechanism.js
 */
export default [{
        path: "mechanism",
        name: "mechanism",
        component: () =>
            import("@/views/system-manage/organizationManage.vue"),
        meta: {
            title: 'GovermentManagement'
        }
    },
    {
        path: "/mechanism/ditail",
        name: 'mechanismDitail',
        component: () =>
            import("@/views/mechanism/mechanism-ditail.vue"),
        meta: {
            title: "mechanismDitail"
        },
        hidden: true
    },
    {
        path: "/mechanism/add",
        name: "mechanismAdd",
        component: () =>
            import("@/views/mechanism/mechanism-add.vue"),
        meta: {
            title: "mechanismAdd"
        },
        hidden: true
    },
    {
        path: "/mechanism/edit",
        name: "mechanismEdit",
        component: () =>
            import("@/views/mechanism/mechanism-edit.vue"),
        meta: {
            title: "mechanismEdit"
        },
        hidden: true
    },
    // {
    //     path: "/mechanism/submit",
    //     name: "mechanismSubmit",
    //     component: () => import("@/views/mechanism/mechanism-submit.vue"),
    //     meta: {
    //         title: "确认"
    //     },
    //     hidden: true
    // }

]