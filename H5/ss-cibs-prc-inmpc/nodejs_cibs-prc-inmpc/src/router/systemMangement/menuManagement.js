/*
 * @Autor: 朱涛
 * @Date: 2021-10-25 18:51:35
 * @LastEditors: 朱涛
 * @LastEditTime: 2021-12-14 18:53:51
 * @Description: 
 * @FilePath: \ss-cibs-prc-inmpc\src\router\systemMangement\menuManagement.js
 * @symbol_custom_string_obkorol: 可以输入预定版本的版权声明、个性签名、空行等
 */
export default [{
        path: "menuManagement",
        name: "menuManagement",
        component: () =>
            import("@/views/menuManagement/index.vue"),
        meta: {
            title: 'MenuManagement'
        },
    },
    {
        path: "/menuManagement/ditail",
        name: 'menuManagementDitail',
        component: () =>
            import("@/views/menuManagement/menuManagement-ditail.vue"),
        meta: {
            title: "menuManagementDitail"
        },
        hidden: true
    },
    {
        path: "/menuManagement/add",
        name: "menuManagementAdd",
        component: () =>
            import("@/views/menuManagement/menuManagement-add.vue"),
        meta: {
            title: "menuManagementAdd"
        },
        hidden: true
    },
    {
        path: "/menuManagement/edit",
        name: "menuManagementEdit",
        component: () =>
            import("@/views/menuManagement/menuManagement-edit.vue"),
        meta: {
            title: "menuManagementEdit"
        },
        hidden: true
    },
    // {
    //     path: "/menuManagement/submit",
    //     name: "menuManagementSubmit",
    //     component: () => import("@/views/menuManagement/menuManagement-submit.vue"),
    //     meta: {
    //         title: "确认"
    //     },
    //     hidden: true
    // }
]