/*
 * @Author: 赵霖
 * @Date: 2021-10-25 17:20:18
 * @LastEditTime: 2022-01-20 16:59:48
 * @LastEditors: ZhangZhen
 * @Description: 银行公告管理路由配置
 * @FilePath: \ss-cibs-prc-inmpc\nodejs_cibs-prc-inmpc\src\router\businessMangament\announcement.js
 */
export default [
    {
        path: "announcement",
        name: "announcement",
        component: () => import("@/views/announcement/index.vue"),
        meta: {
            title: "AnnouncementManage"
        }
    },
    {
        path: "announcement/add",
        name: "AnnouncementAdd",
        component: () => import("@/views/announcement/announcement-add.vue"),
        meta: {
            title: "AnnouncementManage" // AnnouncementAdd
        },
        hidden: true
    },
    {
        path: 'announcement/add-confirm',
        name: 'AnnouncementAddConfirm',
        component: () => import("@/views/announcement/announcement-add-confirm.vue"),
        meta: {
            title: 'AnnouncementManage' // AnnouncementAddConfirm
        },
        hidden: true
    },
    {
        path: "announcement/detail",
        name: "AnnouncementDetail",
        component: () => import("@/views/announcement/announcement-detail.vue"),
        meta: {
            title: "AnnouncementManage" // AnnouncementDetail
        },
        hidden: true
    },
]