/*
 * @Author: 赵霖
 * @Date: 2021-10-25 16:44:44
 * @LastEditTime: 2021-12-03 09:55:54
 * @LastEditors: ZhangZhen
 * @Description: 收费项目设置路由配置
 * @FilePath: \workplace\src\router\businessMangament\businessMangament.js
 */
export default [
    // {
    //     path: "index",
    //     name: 'businessMangamentIndex',
    //     component: () => import("@/views/businessMangament/index.vue"),
    //     meta: {
    //         title: "收费项目设置"
    //     }
    // },
    {
        path: "add",
        name: "businessMangamentAdd",
        component: () => import("@/views/businessMangament/businessMangament-add.vue"),
        meta: {
            title: "新增收费项目"
        },
        hidden: true
    },
    {
        path: "modify",
        name: "businessMangamentModify",
        component: () => import('@/views/businessMangament/businessMagament-modify.vue'),
        meta: {
            title: "修改收费项目"
        },
        hidden: true
    },
    {
        path: "detail",
        name: "businessMangamentDetail",
        component: () => import("@/views/businessMangament/businessMagament-ditail.vue"),
        meta: {
            title: "收费项目详情"
        },
        hidden: true
    },
]